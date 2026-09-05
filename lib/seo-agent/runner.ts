/**
 * Nova Tools Autonomous SEO Agent - Autonomous Cycle Runner
 * Orchestrates the full 20-step loop: Data Ingestion -> Opportunity Detection ->
 * Scoring -> Risk Gate -> Hermes/Qwen Generation -> Safe Optimization ->
 * Validation -> Git Commit -> Production Deploy -> IndexNow -> Learning Loop.
 */

import fs from "fs";
import path from "path";
import { getToolBySlug, getAllTools } from "@/lib/tools/registry";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { SeoDataConnector } from "./data-connector";
import { SeoOpportunityEngine } from "./opportunity-engine";
import { SeoScoringEngine } from "./scoring-engine";
import { HermesQwenClient, SemanticOptimizationResult, normalizeFaqQuestion } from "./hermes-qwen-client";
import { SeoOptimizer } from "./optimizer";
import { SeoValidator } from "./validator";
import { SeoDeploymentEngine } from "./deployment";
import { SeoIndexNowIntegration } from "./indexnow-integration";
import { SeoLearningLoop } from "./learning-loop";
import { SeoAuditStore, computeToolContentFingerprint } from "./audit-store";
import { evaluateOpportunityIdempotency } from "./idempotency-gate";
import {
  DataSourceMatrixItem,
  SeoActionType,
  SeoAuditRecord,
  SeoOpportunity,
  ValidationSummary,
  MultiSourceMetrics,
  GSCPageMetric,
  ConnectorStatus,
} from "./types";
import { SEO_AGENT_CONFIG } from "./config";

export interface CycleRunResult {
  success: boolean;
  status: "COMPLETED" | "PARTIAL" | "FAILED" | "COMPLETED_WITH_ROLLBACKS" | "BLOCKED_PENDING_REAL_DATA" | "PAUSED_KILL_SWITCH" | "DRY_RUN";
  realDataStatus: "AVAILABLE" | "BLOCKED_PENDING_REAL_DATA";
  missingConnectors?: string[];
  cycleId: string;
  timestamp: string;
  opportunitiesDetected: number;
  filteredAlreadyOptimized?: number;
  filteredCooldown?: number;
  filteredNoOp?: number;
  actuallyActionable?: number;
  highRiskSkipped: number;
  optimizationsApplied: number;
  deploymentsCompleted: number;
  indexNowUrlsSubmitted: string[];
  selectedOpportunities?: SeoOpportunity[];
  multiSourceMatrix?: DataSourceMatrixItem[];
  targetSlugFiltered?: { status: string; reason: string };
  summary: string;
  auditRecords: SeoAuditRecord[];
  killSwitchActive: boolean;
  timing?: {
    telemetryIngestionMs: number;
    opportunityScoringMs: number;
    llmMs: number;
    optimizationMs: number;
    validationMs: number;
    buildMs: number;
    deploymentMs: number;
    totalCycleMs: number;
  };
}

export interface ActionabilityResult {
  isActionable: boolean;
  reason: string;
}

export function verifyActionableSemanticChange(
  tool: ToolDefinition,
  actionType: string | undefined,
  semanticResult: SemanticOptimizationResult | null | undefined
): ActionabilityResult {
  if (!semanticResult) {
    return { isActionable: false, reason: "Semantic result is null or empty" };
  }

  // 1. FAQ_ENRICHMENT is actionable only when semanticResult.faqs contains at least one genuinely new FAQ with novel question AND answer.
  if (actionType === "FAQ_ENRICHMENT" || actionType === "EDITORIAL_EXPANSION") {
    if (!semanticResult.faqs || semanticResult.faqs.length === 0) {
      return { isActionable: false, reason: "FAQ_ENRICHMENT returned zero FAQ items" };
    }
    const existingQuestionNorms = new Set((tool.faq || []).map((f) => normalizeFaqQuestion(f.question)));
    const existingAnswerNorms = new Set((tool.faq || []).map((f) => f.answer.toLowerCase().replace(/[^a-z0-9]/g, "")));
    const novelFaqs = semanticResult.faqs.filter(
      (f) =>
        f.question &&
        f.answer &&
        !existingQuestionNorms.has(normalizeFaqQuestion(f.question)) &&
        !existingAnswerNorms.has(f.answer.toLowerCase().replace(/[^a-z0-9]/g, ""))
    );
    if (novelFaqs.length === 0) {
      return { isActionable: false, reason: "All proposed FAQs already exist (duplicate questions or answers)" };
    }
    return { isActionable: true, reason: `Contains ${novelFaqs.length} new valid FAQ(s)` };
  }

  // 2. TITLE_OPTIMIZATION is actionable only when the proposed title differs from the existing title and is not weaker.
  if (actionType === "TITLE_OPTIMIZATION") {
    const proposedTitle = (semanticResult.seoTitle || "").trim();
    const existingTitle = (tool.seoTitle || "").trim();
    if (!proposedTitle) {
      return { isActionable: false, reason: "Proposed title is empty" };
    }
    if (proposedTitle === existingTitle) {
      return { isActionable: false, reason: "Proposed title is identical to existing title" };
    }
    // Weaker title protection: Do not replace an already optimal title with a degraded or excessively short fallback
    if (existingTitle.length >= 35 && existingTitle.length <= 65) {
      if (proposedTitle.length < 30) {
        return {
          isActionable: false,
          reason: `REJECTED_WEAKER_TITLE: Proposed title (${proposedTitle.length} chars) is weaker/shorter than existing optimal title (${existingTitle.length} chars)`,
        };
      }
      if (existingTitle.length >= 40 && proposedTitle.length < existingTitle.length - 15) {
        return {
          isActionable: false,
          reason: `REJECTED_WEAKER_TITLE: Proposed title drops descriptive keywords from existing optimal title (${proposedTitle.length} vs ${existingTitle.length} chars)`,
        };
      }
    }
    return { isActionable: true, reason: "Proposed title differs from existing title" };
  }

  // 3. DESCRIPTION_OPTIMIZATION is actionable only when the proposed description differs from the existing description and is not weaker.
  if (actionType === "DESCRIPTION_OPTIMIZATION") {
    const proposedDesc = (semanticResult.seoDescription || "").trim();
    const existingDesc = (tool.seoDescription || "").trim();
    const baselineDesc = (tool.seoDescription || tool.shortDescription || tool.longDescription || "").trim();
    if (!proposedDesc) {
      return { isActionable: false, reason: "Proposed description is empty" };
    }
    if (proposedDesc === existingDesc) {
      return { isActionable: false, reason: "Proposed description is identical to existing description" };
    }
    // Weaker description protection: reject degraded descriptions under 100 chars when baseline exists
    if (proposedDesc.length < 100 && baselineDesc.length >= 50) {
      return {
        isActionable: false,
        reason: `REJECTED_WEAKER_DESCRIPTION: Proposed description (${proposedDesc.length} chars) is weaker/shorter than recommended minimum and existing description (${baselineDesc.length} chars)`,
      };
    }
    return { isActionable: true, reason: "Proposed description differs from existing description" };
  }

  // 4. INTERNAL_LINKS is actionable only when at least one new valid relatedTool exists.
  if (actionType === "INTERNAL_LINKS") {
    const suggestions = semanticResult.internalLinkSuggestions || [];
    if (suggestions.length === 0) {
      return { isActionable: false, reason: "No internal link suggestions provided" };
    }
    const existingLinks = new Set(tool.relatedTools || []);
    const allToolsSet = new Set(getAllTools().map((t) => t.slug));
    const newValidLinks = suggestions.filter(
      (slug) => slug !== tool.slug && allToolsSet.has(slug) && !existingLinks.has(slug)
    );
    if (newValidLinks.length === 0) {
      return { isActionable: false, reason: "All proposed internal links already exist in tool" };
    }
    return { isActionable: true, reason: `Contains ${newValidLinks.length} new valid related tool link(s)` };
  }

  // 5. General check for other action types
  const titleDiff = !!semanticResult.seoTitle && semanticResult.seoTitle.trim() !== (tool.seoTitle || "").trim();
  const descDiff = !!semanticResult.seoDescription && semanticResult.seoDescription.trim() !== (tool.seoDescription || "").trim();
  const existingQuestionNorms = new Set((tool.faq || []).map((f) => normalizeFaqQuestion(f.question)));
  const hasNovelFaq = (semanticResult.faqs || []).some(
    (f) => f.question && !existingQuestionNorms.has(normalizeFaqQuestion(f.question))
  );

  if (titleDiff || descDiff || hasNovelFaq) {
    return { isActionable: true, reason: "Semantic result contains real content delta" };
  }

  return { isActionable: false, reason: "NO_ACTIONABLE_CHANGE: Semantic result produces no modifications" };
}

export class SeoAgentRunner {
  private workspaceRoot: string;
  private connector: SeoDataConnector;
  private opportunityEngine: SeoOpportunityEngine;
  private scoringEngine: SeoScoringEngine;
  private llmClient: HermesQwenClient;
  private optimizer: SeoOptimizer;
  private validator: SeoValidator;
  private deployment: SeoDeploymentEngine;
  private indexNow: SeoIndexNowIntegration;
  private learningLoop: SeoLearningLoop;
  private auditStore: SeoAuditStore;

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
    this.connector = new SeoDataConnector();
    this.opportunityEngine = new SeoOpportunityEngine();
    this.scoringEngine = new SeoScoringEngine();
    this.llmClient = new HermesQwenClient();
    this.optimizer = new SeoOptimizer(workspaceRoot);
    this.validator = new SeoValidator(workspaceRoot);
    this.deployment = new SeoDeploymentEngine(workspaceRoot);
    this.indexNow = new SeoIndexNowIntegration();
    this.learningLoop = new SeoLearningLoop();
    this.auditStore = new SeoAuditStore(workspaceRoot);
  }

  /**
   * Executes the full autonomous SEO cycle without requiring human approval.
   */
  async runCycle(options: { dryRun?: boolean; forceSingleSlug?: string } = {}): Promise<CycleRunResult> {
    const cycleId = `cycle-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const auditRecords: SeoAuditRecord[] = [];

    // 0. CONCURRENCY LOCK CHECK & ACQUISITION (Task 11 & 12)
    const lockDir = path.join(this.workspaceRoot, "data", "seo-agent");
    const lockPath = path.join(lockDir, "seo-agent.lock");

    if (fs.existsSync(lockPath)) {
      try {
        const rawLock = fs.readFileSync(lockPath, "utf8");
        const lockData = JSON.parse(rawLock);
        const lockPid = lockData.pid;
        const lockTime = new Date(lockData.timestamp).getTime();

        let isRunning = false;
        if (lockPid && typeof lockPid === "number") {
          try {
            process.kill(lockPid, 0);
            isRunning = true;
          } catch {
            isRunning = false;
          }
        }

        if (isRunning && Date.now() - lockTime < 2 * 60 * 60 * 1000) {
          console.error(`❌ SEO cycle already running (PID: ${lockPid}, Started: ${lockData.timestamp})`);
          throw new Error("SEO cycle already running");
        } else {
          console.warn(`⚠️ Stale lock file detected from PID ${lockPid}. Reclaiming lock.`);
        }
      } catch (err) {
        if (err instanceof Error && err.message === "SEO cycle already running") {
          throw err;
        }
      }
    }

    try {
      fs.mkdirSync(lockDir, { recursive: true });
      fs.writeFileSync(
        lockPath,
        JSON.stringify({ pid: process.pid, timestamp: new Date().toISOString(), cycleId }, null, 2),
        "utf8"
      );
    } catch {
      // Proceed safely
    }

    const releaseLock = () => {
      try {
        if (fs.existsSync(lockPath)) {
          const raw = fs.readFileSync(lockPath, "utf8");
          const data = JSON.parse(raw);
          if (data.pid === process.pid) {
            fs.unlinkSync(lockPath);
          }
        }
      } catch {}
    };

    process.once("exit", releaseLock);

    const CYCLE_TIMEOUT_MS = SEO_AGENT_CONFIG.TIMEOUTS?.CYCLE_TIMEOUT_MS || 1200000;
    let cycleTimer: NodeJS.Timeout | null = null;
    const cycleTimeoutPromise = new Promise<never>((_, reject) => {
      cycleTimer = setTimeout(
        () => reject(new Error(`TIMEOUT: Autonomous SEO cycle exceeded hard cycle limit of ${CYCLE_TIMEOUT_MS}ms`)),
        CYCLE_TIMEOUT_MS
      );
      if (typeof cycleTimer.unref === "function") cycleTimer.unref();
    });

    try {
      return await Promise.race([
        this.executeCycleBody(options, cycleId, timestamp, auditRecords),
        cycleTimeoutPromise,
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const isTimeout = errMsg.startsWith("TIMEOUT:");
      if (isTimeout) {
        console.error(`\n❌ [SEO][cycle] timeout after ${CYCLE_TIMEOUT_MS}ms: ${errMsg}`);
      } else {
        console.error(`\n❌ [SEO][cycle] failed: ${errMsg}`);
      }
      const failAudit: SeoAuditRecord = {
        id: `audit-${cycleId}-cycle-failed`,
        timestamp,
        action: isTimeout ? "CYCLE_TIMEOUT" : "CYCLE_FAILED",
        status: "FAILED",
        riskLevel: "HIGH",
        details: { message: errMsg },
        provenance: [],
      };
      this.auditStore.recordAudit(failAudit);
      return {
        success: false,
        status: "FAILED",
        realDataStatus: "BLOCKED_PENDING_REAL_DATA",
        cycleId,
        timestamp,
        opportunitiesDetected: 0,
        highRiskSkipped: 0,
        optimizationsApplied: 0,
        deploymentsCompleted: 0,
        indexNowUrlsSubmitted: [],
        summary: `Cycle failed: ${errMsg}`,
        auditRecords: [...auditRecords, failAudit],
        killSwitchActive: false,
      };
    } finally {
      if (cycleTimer) clearTimeout(cycleTimer);
      releaseLock();
      process.removeListener("exit", releaseLock);
    }
  }

  private async executeCycleBody(
    options: { dryRun?: boolean; forceSingleSlug?: string },
    cycleId: string,
    timestamp: string,
    auditRecords: SeoAuditRecord[]
  ): Promise<CycleRunResult> {

    // 1. EMERGENCY KILL SWITCH CHECK
    const cycleStartTime = Date.now();
    let totalLlmMs = 0;
    let totalOptimizationMs = 0;
    let totalValidationMs = 0;
    let totalBuildMs = 0;
    let totalDeploymentMs = 0;
    let telemetryIngestionMs = 0;
    let opportunityScoringMs = 0;
    const getElapsed = () => ((Date.now() - cycleStartTime) / 1000).toFixed(1) + "s";

    if (this.auditStore.isKillSwitchActive()) {
      const killAudit: SeoAuditRecord = {
        id: `audit-${cycleId}-killswitch`,
        timestamp,
        action: "CYCLE_ABORTED",
        status: "SKIPPED",
        riskLevel: "HIGH",
        details: { message: "Emergency Kill Switch is ACTIVE. Autonomous cycle halted." },
        provenance: [],
      };
      this.auditStore.recordAudit(killAudit);
      return {
        success: false,
        status: "PAUSED_KILL_SWITCH",
        realDataStatus: "BLOCKED_PENDING_REAL_DATA",
        cycleId,
        timestamp,
        opportunitiesDetected: 0,
        highRiskSkipped: 0,
        optimizationsApplied: 0,
        deploymentsCompleted: 0,
        indexNowUrlsSubmitted: [],
        summary: "Autonomous SEO operations are paused via Emergency Kill Switch.",
        auditRecords: [killAudit],
        killSwitchActive: true,
      };
    }

    // 2. CHECK CONNECTOR HEALTH & FETCH REAL MULTI-SOURCE DATA
    console.log(`[Heartbeat | Elapsed: ${getElapsed()}] Stage: PREFLIGHT_CONNECTOR_CHECK...`);
    const healthStart = Date.now();
    const health = await this.connector.checkHealth();
    console.log(`[Heartbeat | Elapsed: ${getElapsed()}] Stage: PREFLIGHT_CONNECTOR_CHECK_COMPLETED (${Date.now() - healthStart}ms)`);
    const missingConnectors: string[] = [];
    if (health.gsc.status !== "CONNECTED") {
      missingConnectors.push(`Google Search Console (${health.gsc.status})`);
    }
    if (health.ga4.status !== "CONNECTED" && health.ga4DataApi.status !== "CONNECTED") {
      missingConnectors.push(`Google Analytics 4 (${health.ga4.status})`);
    }

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const priorStartDate = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Global overall telemetry ingestion timeout protection (60s default)
    console.log("[SEO][telemetry_ingestion] started");
    console.log(`[Heartbeat | Elapsed: ${getElapsed()}] Stage: TELEMETRY_INGESTION...`);
    const OVERALL_TIMEOUT_MS = SEO_AGENT_CONFIG.TELEMETRY_TIMEOUTS?.OVERALL_INGESTION_MS || 60000;
    let timeoutTimer: NodeJS.Timeout | null = null;
    const overallTimeoutPromise = new Promise<never>((_, reject) => {
      timeoutTimer = setTimeout(() => {
        reject(new Error(`Overall telemetry ingestion exceeded ${OVERALL_TIMEOUT_MS}ms timeout`));
      }, OVERALL_TIMEOUT_MS);
      if (typeof timeoutTimer.unref === "function") timeoutTimer.unref();
    });

    let multiSource: MultiSourceMetrics;
    let priorGscResult: { metrics: GSCPageMetric[]; status: ConnectorStatus; provenanceReport: string };

    try {
      const ingestionPromise = (async () => {
        const ms = await this.connector.fetchAllMultiSourceMetrics({ startDate, endDate });
        let prior: { metrics: GSCPageMetric[]; status: ConnectorStatus; provenanceReport: string } = {
          metrics: [],
          status: "NOT_CONNECTED",
          provenanceReport: "Prior GSC comparison not fetched",
        };
        // Fetch prior 28d comparison if current GSC returned real data
        if (ms.gsc.length > 0) {
          const priorStart = Date.now();
          prior = await this.connector.fetchSearchConsoleMetrics({ startDate: priorStartDate, endDate: startDate });
          console.log(`[SEO][1/4+] Prior GSC comparison (28d prior) completed: ${prior.metrics.length} rows (took ${Date.now() - priorStart}ms)`);
        }
        return [ms, prior] as const;
      })();

      [multiSource, priorGscResult] = await Promise.race([ingestionPromise, overallTimeoutPromise]);
      telemetryIngestionMs = Date.now() - healthStart;
      console.log(`[SEO][telemetry_ingestion] completed in ${telemetryIngestionMs}ms`);
      console.log(`[Heartbeat | Elapsed: ${getElapsed()}] Stage: TELEMETRY_INGESTION_COMPLETED (${telemetryIngestionMs}ms)`);
    } catch (err) {
      telemetryIngestionMs = Date.now() - healthStart;
      const isTimeout = err instanceof Error && (err.message.includes("exceeded") || err.message.includes("TIMEOUT:") || err.message.includes("timed out"));
      if (isTimeout) {
        console.log(`[SEO][telemetry_ingestion] timeout after ${telemetryIngestionMs}ms`);
      } else {
        console.log(`[SEO][telemetry_ingestion] failed: ${err instanceof Error ? err.message : String(err)}`);
      }
      console.error(`[SEO] Telemetry ingestion halted: ${err instanceof Error ? err.message : String(err)}`);
      multiSource = {
        gsc: [],
        ga4: [],
        bing: [],
        clarity: [],
        googleAds: { status: "NOT_AVAILABLE", reason: "Telemetry ingestion timed out or failed" },
        matrix: await this.connector.getAllSourcesHealth({ startDate, endDate }).catch(() => []),
      };
      priorGscResult = {
        metrics: [],
        status: "ERROR",
        provenanceReport: `Telemetry ingestion failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    } finally {
      if (timeoutTimer) clearTimeout(timeoutTimer);
    }

    const hasRealGscData = multiSource.gsc.length > 0;
    const realDataStatus: "AVAILABLE" | "BLOCKED_PENDING_REAL_DATA" = hasRealGscData
      ? "AVAILABLE"
      : "BLOCKED_PENDING_REAL_DATA";

    // Stop and block if real Search Console metrics are unavailable
    if (SEO_AGENT_CONFIG.REAL_SEO_DATA_REQUIRED && !hasRealGscData) {
      const summary = `BLOCKED: Zero real GSC telemetry data retrieved. Real Data Gate prevents autonomous changes without authenticated live metrics. Missing/Pending: ${missingConnectors.join(", ")}.`;
      console.warn(`\n🛑 [REAL DATA GATE ACTIVATED]`);
      console.warn(`   Reason: Search Console returned 0 rows for ${SEO_AGENT_CONFIG.GSC_SITE_PROPERTY}`);
      console.warn(`   Resolution: Verify Composio Google OAuth connection or GSC credentials in .env.local.`);
      console.warn(`   Zero files modified. Zero autonomous deployments executed.\n`);

      const gateAudit: SeoAuditRecord = {
        id: `audit-${cycleId}-real-data-blocked`,
        timestamp,
        action: "REAL_DATA_GATE_BLOCKED",
        status: "SKIPPED",
        riskLevel: "HIGH",
        details: { message: summary, missingConnectors },
        provenance: [],
      };
      this.auditStore.recordAudit(gateAudit);
      auditRecords.push(gateAudit);

      this.auditStore.recordCycleRun({
        date: timestamp.split("T")[0],
        cycleId,
        opportunities: 0,
        selected: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        rollback: 0,
        deployment: 0,
        indexNow: 0,
        finalStatus: "BLOCKED_PENDING_REAL_DATA",
        summary,
        isDryRun: !!options.dryRun,
      });

      return {
        success: false,
        status: "BLOCKED_PENDING_REAL_DATA",
        realDataStatus: "BLOCKED_PENDING_REAL_DATA",
        missingConnectors,
        cycleId,
        timestamp,
        opportunitiesDetected: 0,
        highRiskSkipped: 0,
        optimizationsApplied: 0,
        deploymentsCompleted: 0,
        indexNowUrlsSubmitted: [],
        multiSourceMatrix: multiSource.matrix,
        summary,
        auditRecords,
        killSwitchActive: false,
        timing: {
          telemetryIngestionMs,
          opportunityScoringMs: 0,
          llmMs: 0,
          optimizationMs: 0,
          validationMs: 0,
          buildMs: 0,
          deploymentMs: 0,
          totalCycleMs: Date.now() - cycleStartTime,
        },
      };
    }

    // 3. DETECT OPPORTUNITIES ACROSS 19 ADVANCED PATTERNS
    console.log(`[Heartbeat | Elapsed: ${getElapsed()}] Stage: OPPORTUNITY_DETECTION_AND_SCORING...`);
    const oppStart = Date.now();
    console.log("[SEO][opportunity_scoring] started");
    const deployedOpts = this.auditStore.getOptimizations().filter((o) => o.commitStatus === "DEPLOYED");
    const recentAudits = this.auditStore.getRuntimeStatus().recentAudits || [];
    const resolvedOppKeys: string[] = recentAudits
      .filter((a) => a.action === "HIGH_RISK_SKIPPED")
      .map((a) => `${a.pageSlug}:HIGH_RISK`)
      .concat(
        recentAudits
          .filter((a) => a.action === "OPTIMIZATION_APPLIED" || a.action === "PAGE_OPTIMIZED" || a.action === "NO_ACTIONABLE_CHANGE")
          .map((a) => `thin-content-${a.pageSlug}`)
      )
      .concat(deployedOpts.map((o) => `${o.pageSlug}:${o.actionType}`))
      .concat(deployedOpts.map((o) => `${o.pageSlug}:${o.opportunityType}`))
      .concat(deployedOpts.map((o) => `thin-content-${o.pageSlug}`))
      .concat(deployedOpts.map((o) => `orphan-page-${o.pageSlug}`))
      .concat(deployedOpts.map((o) => `weak-links-${o.pageSlug}`));

    const rawOpportunities = this.opportunityEngine.detectOpportunities(
      multiSource.gsc,
      multiSource.ga4,
      priorGscResult.metrics,
      multiSource.bing,
      multiSource.clarity,
      resolvedOppKeys
    );
    console.log(`[SEO] Opportunity engine evaluated 19 criteria in ${Date.now() - oppStart}ms: ${rawOpportunities.length} opportunities detected`);

    // 4. SCORE AND PRIORITIZE
    const scoredOpportunities = this.scoringEngine.scoreAndPrioritize(rawOpportunities);
    this.auditStore.setOpportunities(scoredOpportunities);
    opportunityScoringMs = Date.now() - oppStart;
    console.log(`[SEO][opportunity_scoring] completed in ${opportunityScoringMs}ms`);
    console.log(`[Heartbeat | Elapsed: ${getElapsed()}] Stage: OPPORTUNITY_SCORING_COMPLETED (${opportunityScoringMs}ms: ${scoredOpportunities.length} opportunities evaluated)`);

    // 5. BUDGET CHECK AND RISK FILTERING
    console.log("[SEO][candidate_filtering] started");
    const filterStart = Date.now();
    const budgets = this.auditStore.getBudgets();
    const selection = this.scoringEngine.selectActionableOpportunities(
      scoredOpportunities,
      budgets.dailyDone,
      budgets.weeklyDone,
      this.auditStore
    );
    console.log(`[SEO][candidate_filtering] completed in ${Date.now() - filterStart}ms`);
    const {
      actionable,
      skippedHighRisk,
      budgetExceeded,
      filteredAlreadyOptimized,
      filteredCooldown,
      filteredNoOp,
    } = selection;

    // Log budget deferred opportunities
    if (budgetExceeded.length > 0) {
      this.auditStore.recordAudit({
        id: `audit-${cycleId}-budget-deferred`,
        timestamp,
        action: "BUDGET_LIMIT_DEFERRED",
        status: "SKIPPED",
        riskLevel: "LOW",
        details: { count: budgetExceeded.length, message: "Opportunities deferred to next scheduled cycle to respect budget." },
        provenance: [],
      });
    }

    // Record audits for skipped high-risk opportunities (No waiting for approval!)
    skippedHighRisk.forEach((opp) => {
      const audit: SeoAuditRecord = {
        id: `audit-${cycleId}-${opp.id}-skipped`,
        timestamp,
        action: "HIGH_RISK_SKIPPED",
        status: "SKIPPED",
        riskLevel: "HIGH",
        pageSlug: opp.pageSlug,
        pageUrl: opp.pageUrl,
        details: {
          reason: opp.reason,
          riskRule: "HIGH-risk changes must never be executed automatically.",
        },
        provenance: opp.provenance,
      };
      this.auditStore.recordAudit(audit);
      auditRecords.push(audit);
    });

    // Record audits for filtered opportunities
    filteredCooldown.forEach((f) => {
      const audit: SeoAuditRecord = {
        id: `audit-${cycleId}-${f.opportunity.id}-cooldown`,
        timestamp,
        action: "OPPORTUNITY_FILTERED_COOLDOWN",
        status: "SKIPPED",
        riskLevel: f.opportunity.riskLevel,
        pageSlug: f.opportunity.pageSlug,
        pageUrl: f.opportunity.pageUrl,
        details: {
          reason: f.reason,
          remainingDays: f.remainingDays,
          lastOptimizedAt: f.lastOptimizedAt,
          actionType: f.opportunity.proposedAction.type,
        },
        provenance: f.opportunity.provenance,
      };
      this.auditStore.recordAudit(audit);
      auditRecords.push(audit);
    });

    filteredAlreadyOptimized.forEach((f) => {
      const audit: SeoAuditRecord = {
        id: `audit-${cycleId}-${f.opportunity.id}-already-optimized`,
        timestamp,
        action: "OPTIMIZATION_ALREADY_APPLIED",
        status: "SKIPPED",
        riskLevel: f.opportunity.riskLevel,
        pageSlug: f.opportunity.pageSlug,
        pageUrl: f.opportunity.pageUrl,
        details: {
          reason: f.reason,
          actionType: f.opportunity.proposedAction.type,
        },
        provenance: f.opportunity.provenance,
      };
      this.auditStore.recordAudit(audit);
      auditRecords.push(audit);
    });

    filteredNoOp.forEach((f) => {
      const audit: SeoAuditRecord = {
        id: `audit-${cycleId}-${f.opportunity.id}-noop`,
        timestamp,
        action: "NO_MEANINGFUL_CHANGE",
        status: "SKIPPED",
        riskLevel: f.opportunity.riskLevel,
        pageSlug: f.opportunity.pageSlug,
        pageUrl: f.opportunity.pageUrl,
        details: {
          reason: f.reason,
          actionType: f.opportunity.proposedAction.type,
        },
        provenance: f.opportunity.provenance,
      };
      this.auditStore.recordAudit(audit);
      auditRecords.push(audit);
    });

    let targetOpportunities: SeoOpportunity[] = [];
    let targetSlugFilterInfo: { status: string; reason: string } | undefined;

    if (options.forceSingleSlug) {
      const cooldownItem = filteredCooldown.find((f) => f.opportunity.pageSlug === options.forceSingleSlug);
      const alreadyItem = filteredAlreadyOptimized.find((f) => f.opportunity.pageSlug === options.forceSingleSlug);
      const noOpItem = filteredNoOp.find((f) => f.opportunity.pageSlug === options.forceSingleSlug);
      const highRiskItem = skippedHighRisk.find((o) => o.pageSlug === options.forceSingleSlug);

      if (cooldownItem) {
        console.log(`ℹ️ [SEO Opportunity Gate] /${options.forceSingleSlug} (${cooldownItem.opportunity.proposedAction.type}): FILTERED BY COOLDOWN - ${cooldownItem.reason}`);
      }
      if (alreadyItem) {
        console.log(`ℹ️ [SEO Opportunity Gate] /${options.forceSingleSlug} (${alreadyItem.opportunity.proposedAction.type}): FILTERED AS ALREADY OPTIMIZED - ${alreadyItem.reason}`);
      }
      if (noOpItem) {
        console.log(`ℹ️ [SEO Opportunity Gate] /${options.forceSingleSlug} (${noOpItem.opportunity.proposedAction.type}): FILTERED AS NO-OP - ${noOpItem.reason}`);
      }
      if (highRiskItem) {
        console.log(`🛡️ [SEO Opportunity Gate] /${options.forceSingleSlug}: SKIPPED HIGH RISK - ${highRiskItem.reason}`);
      }

      // If the primary or targeted opportunity for this slug was filtered by cooldown or already optimized, prioritize reporting that
      if (alreadyItem && !actionable.some((o) => o.pageSlug === options.forceSingleSlug)) {
        targetSlugFilterInfo = { status: "FILTERED_AS_ALREADY_OPTIMIZED", reason: `(${alreadyItem.opportunity.proposedAction.type}) ${alreadyItem.reason}` };
        targetOpportunities = [];
      } else if (cooldownItem && (!actionable.some((o) => o.pageSlug === options.forceSingleSlug) || cooldownItem.opportunity.type === "THIN_PAGE_CONTENT")) {
        targetSlugFilterInfo = { status: "FILTERED_BY_COOLDOWN", reason: `(${cooldownItem.opportunity.proposedAction.type}) ${cooldownItem.reason}` };
        targetOpportunities = [];
      } else if (noOpItem && !actionable.some((o) => o.pageSlug === options.forceSingleSlug)) {
        targetSlugFilterInfo = { status: "FILTERED_AS_NO_OP", reason: `(${noOpItem.opportunity.proposedAction.type}) ${noOpItem.reason}` };
        targetOpportunities = [];
      } else if (highRiskItem && !actionable.some((o) => o.pageSlug === options.forceSingleSlug)) {
        targetSlugFilterInfo = { status: "SKIPPED_HIGH_RISK", reason: highRiskItem.reason };
        targetOpportunities = [];
      } else {
        const isActionable = actionable.find((o) => o.pageSlug === options.forceSingleSlug);
        if (isActionable) {
          targetOpportunities = [isActionable];
          targetSlugFilterInfo = { status: "ACTIONABLE", reason: "Passed all safety, cooldown, and content novelty gates" };
        } else {
          const prevOpt = this.auditStore.getRecentOptimization(options.forceSingleSlug);
          const tool = getToolBySlug(options.forceSingleSlug);
          if (prevOpt && tool) {
            targetSlugFilterInfo = {
              status: "ALREADY_OPTIMIZED",
              reason: `Page already received intended ${prevOpt.actionType} (commit ${prevOpt.commitHash?.slice(0, 7) || "historical"}) and satisfies content depth criteria (${tool.faq?.length || 0} FAQs, ${(tool.howToSteps || []).length} how-to steps, ${(tool.features || []).length} features). Zero remaining content gap.`,
            };
          } else {
            targetSlugFilterInfo = { status: "NOT_ACTIONABLE", reason: "Page does not meet actionable criteria for optimization" };
          }
          targetOpportunities = [];
        }
      }
    } else {
      targetOpportunities = actionable;
    }

    let appliedCount = 0;
    let deployedCount = 0;
    const changedSlugs: string[] = [];

    // DRY-RUN MODE: Reason about top opportunities without modifying files
    if (options.dryRun) {
      // In dry-run mode, reason on the top actionable candidates to demonstrate live Qwen outputs
      const dryRunBatch = targetOpportunities.slice(0, 3);
      let oppIdx = 0;
      for (const opp of dryRunBatch) {
        oppIdx++;
        console.log(`[Heartbeat | Candidate ${oppIdx}/${dryRunBatch.length} | Elapsed: ${getElapsed()}] 🧠 LLM Reasoning on /${opp.pageSlug} (${opp.type})...`);
        const realTool = getToolBySlug(opp.pageSlug);
        if (!realTool) continue;

        // 7. NO_ACTIONABLE_CHANGE and ALREADY_OPTIMIZED candidates must be filtered before LLM invocation
        const idempotency = evaluateOpportunityIdempotency(realTool, opp, this.auditStore);
        if (!idempotency.isActionable) {
          console.log(`[SEO][candidate_filtering] Pre-LLM skipped /${opp.pageSlug} (${opp.proposedAction.type}): ${idempotency.status} - ${idempotency.reason}`);
          continue;
        }

        console.log(`[SEO][llm_generation] started for /${opp.pageSlug}`);
        const llmStart = Date.now();
        const hasMeasurableTraffic =
          (opp.currentMetrics?.impressions || 0) > 0 ||
          (opp.currentMetrics?.clicks || 0) > 0 ||
          (opp.currentMetrics?.trafficSessions || 0) > 0;
        const hasObjectiveDefect =
          opp.type === "WEAK_TITLE" ||
          opp.type === "WEAK_META_DESCRIPTION" ||
          (realTool.seoTitle || "").trim().length < 30 ||
          (realTool.seoTitle || "").trim().length > 65 ||
          (realTool.seoDescription || "").trim().length < 80 ||
          (realTool.seoDescription || "").trim().length > 165 ||
          (realTool.seoTitle || "").includes("Free, Fast & Private") ||
          (realTool.seoDescription || "").includes("Free, Fast & Private");

        const semanticResult = await this.llmClient.generateOptimization(
          realTool,
          opp.proposedAction.type as SeoActionType,
          {
            primaryQuery: opp.primaryQuery,
            reason: opp.reason,
            multiSourceContext: `GSC imp: ${opp.currentMetrics?.impressions || 0}, clicks: ${opp.currentMetrics?.clicks || 0}, pos: ${(opp.currentMetrics?.position || 0).toFixed(1)}, GA4 sessions: ${opp.currentMetrics?.trafficSessions || 0}, Bing imp: ${opp.currentMetrics?.bingImpressions || 0}, Clarity dead clicks: ${opp.currentMetrics?.clarityDeadClicks || 0}`,
            hasMeasurableTraffic,
            objectiveDefect: hasObjectiveDefect,
          }
        );
        const llmDuration = Date.now() - llmStart;
        totalLlmMs += llmDuration;
        console.log(`[SEO][llm_generation] completed in ${llmDuration}ms`);

        const actionability = verifyActionableSemanticChange(
          realTool,
          opp.proposedAction.type as SeoActionType,
          semanticResult
        );

        (opp as SeoOpportunity & { semanticResult?: unknown; actionability?: unknown; isActionable?: boolean }).semanticResult = semanticResult;
        (opp as SeoOpportunity & { semanticResult?: unknown; actionability?: unknown; isActionable?: boolean }).actionability = actionability;
        (opp as SeoOpportunity & { semanticResult?: unknown; actionability?: unknown; isActionable?: boolean }).isActionable = actionability.isActionable;

        if (!actionability.isActionable) {
          console.log(`[Heartbeat | Candidate ${oppIdx}/${dryRunBatch.length} | Elapsed: ${getElapsed()}] ℹ️ [Actionability Gate] /${opp.pageSlug} (${opp.proposedAction.type}): NO_ACTIONABLE_CHANGE - ${actionability.reason}`);
        } else {
          console.log(`[Heartbeat | Candidate ${oppIdx}/${dryRunBatch.length} | Elapsed: ${getElapsed()}] ✅ [Actionability Gate] /${opp.pageSlug} (${opp.proposedAction.type}): ACTIONABLE - ${actionability.reason}`);
        }
      }

      const summary = `DRY RUN COMPLETED (Real Data Gate: ${realDataStatus}). Detected ${rawOpportunities.length} opportunities, ${filteredAlreadyOptimized.length} already optimized, ${filteredCooldown.length} in cooldown, ${filteredNoOp.length} no-op, ${skippedHighRisk.length} high-risk skipped, ${targetOpportunities.length} actionable (capped at 80/day, processed in 20-page atomic batches). ZERO files modified, ZERO deployments executed.`;

      this.auditStore.recordCycleRun({
        date: timestamp.split("T")[0],
        cycleId,
        opportunities: rawOpportunities.length,
        selected: targetOpportunities.length,
        processed: 0,
        successful: 0,
        failed: 0,
        rollback: 0,
        deployment: 0,
        indexNow: 0,
        finalStatus: "DRY_RUN",
        summary,
        isDryRun: true,
      });

      return {
        success: true,
        status: "DRY_RUN",
        realDataStatus,
        cycleId,
        timestamp,
        opportunitiesDetected: rawOpportunities.length,
        filteredAlreadyOptimized: filteredAlreadyOptimized.length,
        filteredCooldown: filteredCooldown.length,
        filteredNoOp: filteredNoOp.length,
        actuallyActionable: actionable.length,
        highRiskSkipped: skippedHighRisk.length,
        optimizationsApplied: 0,
        deploymentsCompleted: 0,
        indexNowUrlsSubmitted: [],
        selectedOpportunities: dryRunBatch,
        multiSourceMatrix: multiSource.matrix,
        targetSlugFiltered: targetSlugFilterInfo,
        summary,
        auditRecords,
        killSwitchActive: false,
        timing: {
          telemetryIngestionMs,
          opportunityScoringMs,
          llmMs: totalLlmMs,
          optimizationMs: totalOptimizationMs,
          validationMs: totalValidationMs,
          buildMs: totalBuildMs,
          deploymentMs: totalDeploymentMs,
          totalCycleMs: Date.now() - cycleStartTime,
        },
      };
    }

    // 6. PRODUCTION ATOMIC BATCH PROCESSOR (MAX 80/DAY, 20 PAGES PER ATOMIC BATCH)
    const batchSize = SEO_AGENT_CONFIG.BUDGETS.BATCH_SIZE;
    const batches: SeoOpportunity[][] = [];
    for (let i = 0; i < targetOpportunities.length; i += batchSize) {
      batches.push(targetOpportunities.slice(i, i + batchSize));
    }

    let successfulBatches = 0;
    let failedBatches = 0;
    let rollbacksCount = 0;

    for (let bIndex = 0; bIndex < batches.length; bIndex++) {
      const batch = batches[bIndex];
      const batchModifiedFiles: Array<{ targetFile: string; previousContent: string }> = [];
      const batchChangedSlugs: string[] = [];

        for (let oppIdx = 0; oppIdx < batch.length; oppIdx++) {
        const opp = batch[oppIdx];
        const realTool = getToolBySlug(opp.pageSlug);
        if (!realTool) continue;

        console.log(`\n[Heartbeat | Candidate ${oppIdx + 1}/${batch.length} (Batch ${bIndex + 1}/${batches.length}) | Elapsed: ${getElapsed()}] Evaluating /${opp.pageSlug} (${opp.proposedAction.type})...`);

          // 7. NO_ACTIONABLE_CHANGE and ALREADY_OPTIMIZED candidates must be filtered before LLM invocation
          const idempotency = evaluateOpportunityIdempotency(realTool, opp, this.auditStore);
          if (!idempotency.isActionable) {
            console.log(`   [Pre-LLM Filter] /${opp.pageSlug} (${opp.proposedAction.type}): FILTERED BEFORE LLM (${idempotency.status}) - ${idempotency.reason}`);
            console.log(`[SEO][candidate_filtering] Pre-LLM skipped /${opp.pageSlug}: ${idempotency.status}`);
            const filterAudit: SeoAuditRecord = {
              id: `audit-${cycleId}-${opp.id}-pre-llm-filtered`,
              timestamp: new Date().toISOString(),
              action: idempotency.status === "ALREADY_OPTIMIZED" ? "ALREADY_OPTIMIZED_SKIPPED" : "NO_ACTIONABLE_CHANGE",
              status: "SKIPPED",
              riskLevel: opp.riskLevel,
              pageSlug: opp.pageSlug,
              pageUrl: opp.pageUrl,
              details: { reason: idempotency.reason, filterType: idempotency.status },
              provenance: opp.provenance,
            };
            this.auditStore.recordAudit(filterAudit);
            auditRecords.push(filterAudit);
            continue;
          }

          // Bounded watchdog timeout per opportunity (Task 4)
          const OPP_TIMEOUT_MS = SEO_AGENT_CONFIG.TIMEOUTS?.OPPORTUNITY_PROCESSING_MS || 150000;
          let oppTimer: NodeJS.Timeout | null = null;
          const oppTimeoutPromise = new Promise<never>((_, reject) => {
            oppTimer = setTimeout(
              () => reject(new Error(`TIMEOUT: Opportunity processing for /${opp.pageSlug} exceeded ${OPP_TIMEOUT_MS}ms`)),
              OPP_TIMEOUT_MS
            );
            if (typeof oppTimer.unref === "function") oppTimer.unref();
          });

          try {
            const processOppPromise = (async () => {
              // Step A: Hermes / Qwen semantic optimization
              console.log(`[SEO][llm_generation] started for /${opp.pageSlug}`);
              console.log(`   [LLM / Semantic Engine] Generating recommendation for /${opp.pageSlug}...`);
              const optStart = Date.now();
              const hasMeasurableTraffic =
                (opp.currentMetrics?.impressions || 0) > 0 ||
                (opp.currentMetrics?.clicks || 0) > 0 ||
                (opp.currentMetrics?.trafficSessions || 0) > 0;
              const hasObjectiveDefect =
                opp.type === "WEAK_TITLE" ||
                opp.type === "WEAK_META_DESCRIPTION" ||
                (realTool.seoTitle || "").trim().length < 30 ||
                (realTool.seoTitle || "").trim().length > 65 ||
                (realTool.seoDescription || "").trim().length < 80 ||
                (realTool.seoDescription || "").trim().length > 165 ||
                (realTool.seoTitle || "").includes("Free, Fast & Private") ||
                (realTool.seoDescription || "").includes("Free, Fast & Private");

              const semanticResult = await this.llmClient.generateOptimization(
                realTool,
                opp.proposedAction.type as SeoActionType,
                {
                  primaryQuery: opp.primaryQuery,
                  reason: opp.reason,
                  multiSourceContext: `GSC imp: ${opp.currentMetrics?.impressions || 0}, pos: ${(opp.currentMetrics?.position || 0).toFixed(1)}, GA4 sessions: ${opp.currentMetrics?.trafficSessions || 0}`,
                  hasMeasurableTraffic,
                  objectiveDefect: hasObjectiveDefect,
                }
              );
              const llmDuration = Date.now() - optStart;
              totalLlmMs += llmDuration;
              console.log(`[SEO][llm_generation] completed in ${llmDuration}ms`);
              console.log(`   [LLM / Semantic Engine] Generated recommendation for /${opp.pageSlug} in ${llmDuration}ms`);

              // Guardrail: Skip suspicious or malformed recommendation without poisoning the batch
              if (
                !semanticResult ||
                (!semanticResult.seoTitle && !semanticResult.seoDescription && !semanticResult.internalLinkSuggestions)
              ) {
                console.log(`   [Guardrail] Skipping /${opp.pageSlug}: Malformed or empty AI recommendation.`);
                const skipAudit: SeoAuditRecord = {
                  id: `audit-${cycleId}-${opp.id}-bad-rec-skipped`,
                  timestamp: new Date().toISOString(),
                  action: "AI_RECOMMENDATION_REJECTED",
                  status: "SKIPPED",
                  riskLevel: opp.riskLevel,
                  pageSlug: opp.pageSlug,
                  details: { reason: "Malformed or empty AI recommendation skipped safely." },
                  provenance: opp.provenance,
                };
                this.auditStore.recordAudit(skipAudit);
                auditRecords.push(skipAudit);
                return;
              }

              // Factual Content Safety Gate: Never auto-publish unverified claims
              if (semanticResult.factualSafety && !semanticResult.factualSafety.isSafe) {
                console.log(`   [Factual Safety Gate] Skipping /${opp.pageSlug}: ${semanticResult.factualSafety.reason}`);
                const isReview = semanticResult.factualSafety.classification === "NEEDS_REVIEW";
                const safetyAudit: SeoAuditRecord = {
                  id: `audit-${cycleId}-${opp.id}-factual-safety`,
                  timestamp: new Date().toISOString(),
                  action: isReview ? "FACTUAL_VERIFICATION_REQUIRED" : "AI_RECOMMENDATION_REJECTED",
                  status: isReview ? "NEEDS_REVIEW" : "SKIPPED",
                  riskLevel: opp.riskLevel,
                  pageSlug: opp.pageSlug,
                  details: {
                    reason: semanticResult.factualSafety.reason,
                    unverifiedClaims: semanticResult.factualSafety.unverifiedClaims,
                    highRiskArea: semanticResult.factualSafety.highRiskAreaDetected,
                  },
                  provenance: opp.provenance,
                };
                this.auditStore.recordAudit(safetyAudit);
                auditRecords.push(safetyAudit);
                return;
              }

              // Actionability Gate: Verify semantic result produces real content change
              const actionability = verifyActionableSemanticChange(
                realTool,
                opp.proposedAction.type as SeoActionType,
                semanticResult
              );
              console.log(`   [Actionability Gate] /${opp.pageSlug}: ${actionability.isActionable ? "ACTIONABLE ✅" : "NO_ACTIONABLE_CHANGE ℹ️"} (${actionability.reason})`);
              if (!actionability.isActionable) {
                const noChangeAudit: SeoAuditRecord = {
                  id: `audit-${cycleId}-${opp.id}-no-actionable-change`,
                  timestamp: new Date().toISOString(),
                  action: "NO_ACTIONABLE_CHANGE",
                  status: "SKIPPED",
                  riskLevel: opp.riskLevel,
                  pageSlug: opp.pageSlug,
                  pageUrl: opp.pageUrl,
                  details: {
                    reason: actionability.reason,
                    proposedAction: opp.proposedAction.type,
                    message: "Proposed action cannot produce a real content change on the target page.",
                  },
                  provenance: opp.provenance,
                };
                this.auditStore.recordAudit(noChangeAudit);
                auditRecords.push(noChangeAudit);
                return;
              }

              // Step B: Safe code modification
              console.log(`   [Optimizer] Applying optimization patch to ${opp.proposedAction.targetFile || "data/tools/*.ts"}...`);
              const optPatchStart = Date.now();
              const applyResult = await this.optimizer.applyOptimization(opp, semanticResult);
              totalOptimizationMs += Date.now() - optPatchStart;
              if (!applyResult.success) {
                console.log(`   [Optimizer] Patch could not be applied: ${applyResult.errorMessage}`);
                if (applyResult.errorMessage?.includes("NO_ACTIONABLE_CHANGE")) {
                  const noChangeAudit: SeoAuditRecord = {
                    id: `audit-${cycleId}-${opp.id}-optimizer-no-change`,
                    timestamp: new Date().toISOString(),
                    action: "NO_ACTIONABLE_CHANGE",
                    status: "SKIPPED",
                    riskLevel: opp.riskLevel,
                    pageSlug: opp.pageSlug,
                    pageUrl: opp.pageUrl,
                    details: {
                      reason: applyResult.errorMessage,
                      proposedAction: opp.proposedAction.type,
                    },
                    provenance: opp.provenance,
                  };
                  this.auditStore.recordAudit(noChangeAudit);
                  auditRecords.push(noChangeAudit);
                }
                return;
              }

              // STAGE A: Cheap, Fast Per-Page Validation Gate (Task 3 & Task 5)
              // Validates target tool existence, syntax-safe patch, boundary, canonicals, metadata, FAQs, relatedTools, factual safety
              console.log(`[SEO][stage_a_validation] started for /${opp.pageSlug}`);
              console.log(`   [Stage A Isolation] Running cheap preflight check for /${opp.pageSlug}...`);
              const stageAStart = Date.now();
              const stageAResult = this.validator.validatePageStageA(opp.pageSlug);
              totalValidationMs += Date.now() - stageAStart;
              if (!stageAResult.passed) {
                console.log(`[SEO][stage_a_validation] failed for /${opp.pageSlug}: ${stageAResult.failureReason}`);
                // Reject ONLY this page, restore it immediately, do not add to candidate batch
                console.warn(`\n⚠️ [Stage A Isolation] Page /${opp.pageSlug} failed Stage A validation (${stageAResult.durationMs}ms):`);
                console.warn(`   Reason: ${stageAResult.failureReason}`);
                console.warn(`   Action: Restoring /${opp.pageSlug} immediately; remaining candidate batch continues.`);

                this.optimizer.rollbackFile(applyResult.targetFile, applyResult.previousContent);

                const stageAAudit: SeoAuditRecord = {
                  id: `audit-${cycleId}-${opp.id}-stage-a-rejected`,
                  timestamp: new Date().toISOString(),
                  action: "STAGE_A_ISOLATION_REJECTED",
                  status: "SKIPPED",
                  riskLevel: opp.riskLevel,
                  pageSlug: opp.pageSlug,
                  pageUrl: opp.pageUrl,
                  details: {
                    reason: stageAResult.failureReason,
                    failedChecks: stageAResult.checks.filter((c) => !c.passed).map((c) => `${c.name}: ${c.message}`),
                    message: "Page rejected during Stage A pre-build isolation and restored immediately without poisoning batch.",
                  },
                  provenance: opp.provenance,
                };
                this.auditStore.recordAudit(stageAAudit);
                auditRecords.push(stageAAudit);
                return;
              }

              // Stage A passed: safe to include in candidate batch!
              console.log(`[SEO][stage_a_validation] completed in ${stageAResult.durationMs}ms`);
              console.log(`   [Stage A Isolation] PASS (${stageAResult.durationMs}ms): /${opp.pageSlug} accepted into candidate batch.`);
              batchModifiedFiles.push({
                targetFile: applyResult.targetFile,
                previousContent: applyResult.previousContent,
              });
              batchChangedSlugs.push(opp.pageSlug);
            })();

            await Promise.race([processOppPromise, oppTimeoutPromise]);
          } catch (oppErr) {
          const timeoutErrMsg = oppErr instanceof Error ? oppErr.message : String(oppErr);
          console.error(`\n❌ [Opportunity Processing Error] /${opp.pageSlug}: ${timeoutErrMsg}`);
          const errAudit: SeoAuditRecord = {
            id: `audit-${cycleId}-${opp.id}-processing-timeout`,
            timestamp: new Date().toISOString(),
            action: "OPPORTUNITY_PROCESSING_TIMEOUT",
            status: "SKIPPED",
            riskLevel: opp.riskLevel,
            pageSlug: opp.pageSlug,
            pageUrl: opp.pageUrl,
            details: {
              reason: timeoutErrMsg,
              message: "Opportunity processing timed out or failed. Continued safely to next opportunity.",
            },
            provenance: opp.provenance,
          };
          this.auditStore.recordAudit(errAudit);
          auditRecords.push(errAudit);
        } finally {
          if (oppTimer) clearTimeout(oppTimer);
        }
      }

      if (batchModifiedFiles.length === 0) {
        continue;
      }

      // STAGE B: Expensive Global Validation Gate (Task 3 & Task 5)
      // Executed ONCE per remaining atomic batch (Sitemap, Robots, Canonicals, Structured Data, Internal Links, TypeScript, ESLint, Next.js build)
      const BATCH_VAL_TIMEOUT_MS = SEO_AGENT_CONFIG.TIMEOUTS?.BATCH_VALIDATION_MS || 600000;
      let valTimer: NodeJS.Timeout | null = null;
      const batchValTimeoutPromise = new Promise<ValidationSummary>((_, reject) => {
        valTimer = setTimeout(
          () => reject(new Error(`TIMEOUT: Batch validation exceeded ${BATCH_VAL_TIMEOUT_MS}ms`)),
          BATCH_VAL_TIMEOUT_MS
        );
        if (typeof valTimer.unref === "function") valTimer.unref();
      });

      let lastValSummary: ValidationSummary;
      const stageBStart = Date.now();
      console.log("[SEO][stage_b_validation] started");
      try {
        console.log(`\n[Heartbeat | Elapsed: ${getElapsed()}] ⏳ Running Stage B Global Validation Gate for batch ${bIndex + 1} (${batchChangedSlugs.length} candidate pages)...`);
        lastValSummary = await Promise.race([
          this.validator.validateBatchStageB(batchChangedSlugs),
          batchValTimeoutPromise,
        ]);
        const stageBDuration = Date.now() - stageBStart;
        if (lastValSummary.overallPassed) {
          console.log(`[SEO][stage_b_validation] completed in ${stageBDuration}ms`);
        } else {
          console.log(`[SEO][stage_b_validation] failed: ${lastValSummary.failureReason}`);
        }
        const buildCheck = lastValSummary.checks.find((c) => c.name.includes("Build"));
        if (buildCheck && buildCheck.durationMs) {
          totalBuildMs += buildCheck.durationMs;
          totalValidationMs += stageBDuration - buildCheck.durationMs;
        } else {
          totalValidationMs += stageBDuration;
        }
      } catch (err) {
        const timeoutMsg = err instanceof Error ? err.message : String(err);
        const stageBDuration = Date.now() - stageBStart;
        if (timeoutMsg.includes("TIMEOUT:") || timeoutMsg.includes("exceeded")) {
          console.log(`[SEO][stage_b_validation] timeout after ${stageBDuration}ms`);
        } else {
          console.log(`[SEO][stage_b_validation] failed: ${timeoutMsg}`);
        }
        totalValidationMs += stageBDuration;
        lastValSummary = {
          overallPassed: false,
          typecheckPassed: false,
          lintPassed: false,
          buildPassed: false,
          canonicalValid: false,
          sitemapValid: false,
          robotsValid: false,
          structuredDataValid: false,
          internalLinksValid: false,
          checks: [
            {
              name: "Batch Validation Timeout Gate",
              passed: false,
              message: timeoutMsg,
              durationMs: BATCH_VAL_TIMEOUT_MS,
            },
          ],
          failureReason: timeoutMsg,
        };
      } finally {
        if (valTimer) clearTimeout(valTimer);
      }

      // Rollback entire remaining atomic batch if Stage B fails
      if (!lastValSummary.overallPassed) {
        failedBatches++;
        rollbacksCount += batchModifiedFiles.length;

        const failedChecks = lastValSummary.checks.filter((c) => !c.passed);
        const primaryFailedCheck = failedChecks[0] || {
          name: "Validation Gate",
          passed: false,
          message: lastValSummary.failureReason || "One or more Stage B global validation checks failed.",
          durationMs: 0,
        };

        console.error(`\n❌ ==================== SEO BATCH VALIDATION FAILED (STAGE B) ====================`);
        console.error(`   Affected Pages (${batchChangedSlugs.length}):  ${batchChangedSlugs.map((s) => "/" + s).join(", ")}`);
        console.error(`   Failure Reason:         ${lastValSummary.failureReason || primaryFailedCheck.message}`);
        console.error(`   Failed Checks Count:    ${failedChecks.length} / ${lastValSummary.checks.length}`);
        console.error(`   --- Failed Check Breakdown ---`);
        for (const fc of failedChecks) {
          console.error(`   * Check Name:     ${fc.name}`);
          console.error(`     Passed:         ${fc.passed}`);
          console.error(`     Message:        ${fc.message}`);
          console.error(`     Duration:       ${fc.durationMs !== undefined ? fc.durationMs + "ms" : "N/A"}`);
        }
        console.error(`   ------------------------------`);
        console.error(`   Action Taken:           Atomic rollback of all ${batchModifiedFiles.length} file(s) in batch...`);
        console.error(`===================================================================================\n`);

        for (const snap of batchModifiedFiles) {
          this.optimizer.rollbackFile(snap.targetFile, snap.previousContent);
        }

        const failAudit: SeoAuditRecord = {
          id: `audit-${cycleId}-batch-${bIndex}-validation-failed`,
          timestamp: new Date().toISOString(),
          action: "BATCH_VALIDATION_FAILED_ROLLED_BACK",
          status: "ROLLED_BACK",
          riskLevel: "LOW",
          validationSummary: lastValSummary,
          details: {
            batchIndex: bIndex,
            affectedPages: batchChangedSlugs,
            failedCheckName: primaryFailedCheck.name,
            exactFailureMessage: primaryFailedCheck.message,
            allFailedChecks: failedChecks.map((c) => c.name),
            validationSummary: lastValSummary,
          },
          provenance: [],
        };
        this.auditStore.recordAudit(failAudit);
        auditRecords.push(failAudit);
        continue;
      }

      // Step E: Git commit batch
      const commitStart = Date.now();
      const commitRes = await this.deployment.createAutonomousCommit(
        batchModifiedFiles.map((b) => b.targetFile).join(" "),
        `Autonomous SEO batch ${bIndex + 1}: optimized ${batchChangedSlugs.length} pages`,
        batchChangedSlugs.join(",")
      );
      totalDeploymentMs += Date.now() - commitStart;

      if (!commitRes.success) {
        failedBatches++;
        rollbacksCount += batchModifiedFiles.length;
        for (const snap of batchModifiedFiles) {
          this.optimizer.rollbackFile(snap.targetFile, snap.previousContent);
        }
        continue;
      }

      // Step F: Production Deployment
      const deployStart = Date.now();
      const pushRes = await this.deployment.pushToProduction();
      totalDeploymentMs += Date.now() - deployStart;
      if (!pushRes.success) {
        failedBatches++;
        rollbacksCount += batchModifiedFiles.length;
        await this.deployment.rollbackCommit();
        for (const snap of batchModifiedFiles) {
          this.optimizer.rollbackFile(snap.targetFile, snap.previousContent);
        }
        continue;
      }

      successfulBatches++;

      // Step G: IndexNow submission for successfully deployed batch
      const indexNowRes = await this.indexNow.submitChangedSlugs(batchChangedSlugs);
      if (indexNowRes.success) {
        console.log(`📡 IndexNow broadcast complete for ${batchChangedSlugs.length} URLs.`);
      }

      appliedCount += batchChangedSlugs.length;
      deployedCount += batchChangedSlugs.length;
      changedSlugs.push(...batchChangedSlugs);
      this.auditStore.recordChangeApplied();

      // Record deployed optimization fingerprints to audit store only for actually deployed pages
      for (const slug of batchChangedSlugs) {
        const deployedTool = getToolBySlug(slug);
        const opp = batch.find((o) => o.pageSlug === slug);
        if (deployedTool && opp) {
          const contentFp = computeToolContentFingerprint(deployedTool, opp.proposedAction.type);
          this.auditStore.recordOptimization({
            id: `opt-${cycleId}-${opp.pageSlug}-${Date.now()}`,
            pageSlug: opp.pageSlug,
            opportunityType: opp.type,
            actionType: opp.proposedAction.type as SeoActionType,
            contentFingerprint: contentFp,
            timestamp: new Date().toISOString(),
            commitStatus: "DEPLOYED",
            commitHash: commitRes.commitHash,
            details: {
              title: deployedTool.seoTitle,
              description: deployedTool.seoDescription,
              faqCount: deployedTool.faq?.length,
              faqQuestions: deployedTool.faq?.map((f) => f.question),
              relatedTools: deployedTool.relatedTools,
              reasoningSummary: opp.proposedAction.summary,
            },
          });
        }
      }
    }

    console.log(`Batch processing finished. Successful batches: ${successfulBatches}, Failed batches: ${failedBatches}, Rollbacks: ${rollbacksCount}`);

    let finalCycleStatus: "COMPLETED" | "PARTIAL" | "FAILED";
    if (failedBatches === 0 && rollbacksCount === 0) {
      finalCycleStatus = "COMPLETED";
    } else if (successfulBatches > 0) {
      finalCycleStatus = "PARTIAL";
    } else {
      finalCycleStatus = "FAILED";
    }

    const isRolledBackCycle = finalCycleStatus === "FAILED";

    // 7. SUBMIT TO INDEXNOW SUMMARY
    const summary = isRolledBackCycle
      ? `Cycle ${cycleId} finished with failures: ${rawOpportunities.length} opportunities detected, ${filteredAlreadyOptimized.length} already optimized, ${filteredCooldown.length} in cooldown, ${filteredNoOp.length} no-op, ${skippedHighRisk.length} high-risk skipped, ${rollbacksCount} changes rolled back after batch validation failure. 0 files permanently modified, 0 deployments executed.`
      : `Cycle ${cycleId} finished (${finalCycleStatus}): ${rawOpportunities.length} opportunities detected, ${filteredAlreadyOptimized.length} already optimized, ${filteredCooldown.length} in cooldown, ${filteredNoOp.length} no-op, ${skippedHighRisk.length} high-risk skipped, ${appliedCount} optimized in atomic batches, ${deployedCount} deployed, ${changedSlugs.length} IndexNow URLs broadcast.`;

    this.auditStore.recordCycleRun({
      date: timestamp.split("T")[0],
      cycleId,
      opportunities: rawOpportunities.length,
      selected: targetOpportunities.length,
      processed: appliedCount + rollbacksCount,
      successful: appliedCount,
      failed: targetOpportunities.length - appliedCount,
      rollback: rollbacksCount,
      deployment: deployedCount,
      indexNow: changedSlugs.length,
      finalStatus: finalCycleStatus,
      summary,
      isDryRun: false,
    });

    return {
      success: !isRolledBackCycle,
      status: finalCycleStatus,
      realDataStatus,
      missingConnectors,
      cycleId,
      timestamp,
      opportunitiesDetected: rawOpportunities.length,
      filteredAlreadyOptimized: filteredAlreadyOptimized.length,
      filteredCooldown: filteredCooldown.length,
      filteredNoOp: filteredNoOp.length,
      actuallyActionable: actionable.length,
      highRiskSkipped: skippedHighRisk.length,
      optimizationsApplied: appliedCount,
      deploymentsCompleted: deployedCount,
      indexNowUrlsSubmitted: changedSlugs,
      selectedOpportunities: targetOpportunities,
      targetSlugFiltered: targetSlugFilterInfo,
      summary,
      auditRecords,
      killSwitchActive: false,
      timing: {
        telemetryIngestionMs,
        opportunityScoringMs,
        llmMs: totalLlmMs,
        optimizationMs: totalOptimizationMs,
        validationMs: totalValidationMs,
        buildMs: totalBuildMs,
        deploymentMs: totalDeploymentMs,
        totalCycleMs: Date.now() - cycleStartTime,
      },
    };
  }
}
