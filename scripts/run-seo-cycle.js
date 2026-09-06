/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Nova Tools Autonomous SEO Agent - Standalone Local / Dedicated Worker Runner
 * Architectural Reference: Hermes Agent Setup (Qwen 4B + Composio)
 *
 * This runner executes outside the Vercel serverless environment.
 * Suitable for:
 * - Windows Task Scheduler
 * - Dedicated local / VPS worker daemon
 * - GitHub Actions scheduled cron workflow
 */

const path = require("path");
const fs = require("fs");

// Load local environment variables if available
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

// Parse command-line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isVerbose = args.includes("--verbose");
const slugIndex = args.indexOf("--slug");
const targetSlug = slugIndex !== -1 && args[slugIndex + 1] ? args[slugIndex + 1] : undefined;
const maxBatchesIndex = args.indexOf("--max-batches");
const maxBatches = maxBatchesIndex !== -1 && args[maxBatchesIndex + 1] ? parseInt(args[maxBatchesIndex + 1], 10) : (args.includes("--single-batch") ? 1 : undefined);
const batchSizeIndex = args.indexOf("--batch-size");
const batchSize = batchSizeIndex !== -1 && args[batchSizeIndex + 1] ? parseInt(args[batchSizeIndex + 1], 10) : undefined;

async function runStandaloneCycle() {
  console.log("================================================================================");
  console.log("🤖 NOVA TOOLS AUTONOMOUS SEO AGENT RUNNER");
  console.log("   Site: https://novatool.in");
  console.log("   Runtime: Local / Dedicated Autonomous Process (Decoupled from Vercel)");
  console.log(`   Model Target: ${process.env.SEO_AGENT_MODEL || "qwen3:4b (or local fallback)"}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log(`   Mode: ${isDryRun ? "DRY RUN (Analysis & Scoring Only)" : "AUTONOMOUS PRODUCTION EXECUTION"}`);
  if (targetSlug) console.log(`   Target Slug Override: /${targetSlug}`);
  if (maxBatches !== undefined) console.log(`   Batch Limit: Maximum ${maxBatches} batch(es)`);
  if (batchSize !== undefined) console.log(`   Atomic Batch Size Override: ${batchSize} page(s) per atomic batch`);
  console.log("================================================================================\n");

  try {
    const workspaceRoot = path.join(__dirname, "..");
    const createJiti = require("jiti");
    const jiti = createJiti(__filename, {
      alias: {
        "@": workspaceRoot,
      },
    });

    // Dynamic import of TypeScript-transpiled or runtime SEO modules
    const { SeoAgentRunner } = jiti("../lib/seo-agent/runner");
    const runner = new SeoAgentRunner(workspaceRoot);

    console.log("⏳ Step 1-4: Ingesting GSC & GA4 data and detecting opportunities across 19 criteria...");
    const result = await runner.runCycle({
      dryRun: isDryRun,
      forceSingleSlug: targetSlug,
      maxBatches,
      batchSize,
    });

    console.log("\n================================================================================");
    console.log("📊 CYCLE EXECUTION REPORT");
    console.log("================================================================================");
    console.log(`Cycle ID:                 ${result.cycleId}`);
    console.log(`Cycle Status:             ${result.status || (result.success ? "COMPLETED" : "FAILED")}`);
    console.log(`Real Data Gate:           ${result.realDataStatus || "PENDING"}`);
    if (result.missingConnectors && result.missingConnectors.length > 0) {
      console.log(`Missing Real Telemetry:   ${result.missingConnectors.join(", ")}`);
    }
    console.log(`Kill Switch Status:       ${result.killSwitchActive ? "ACTIVE (PAUSED)" : "INACTIVE (OPERATIONAL)"}`);
    console.log(`Opportunities Detected:           ${result.opportunitiesDetected}`);
    if (result.filteredAlreadyOptimized !== undefined) {
      console.log(`Filtered as Already Optimized:    ${result.filteredAlreadyOptimized}`);
    }
    if (result.filteredCooldown !== undefined) {
      console.log(`Filtered by Cooldown:             ${result.filteredCooldown}`);
    }
    if (result.filteredNoOp !== undefined) {
      console.log(`Filtered as No-Op:                ${result.filteredNoOp}`);
    }
    console.log(`High-Risk Skipped:                ${result.highRiskSkipped} (Automatic safety gate)`);
    if (result.actuallyActionable !== undefined) {
      console.log(`Actually Actionable:              ${result.actuallyActionable}`);
    }
    if (result.targetSlugFiltered) {
      console.log(`Target Slug Filtered:             ${result.targetSlugFiltered.status} (${result.targetSlugFiltered.reason})`);
    }
    console.log(`Optimizations Applied:            ${result.optimizationsApplied}${isDryRun ? " (Dry-run: Zero files modified)" : ""}`);
    console.log(`Deployments Completed:            ${result.deploymentsCompleted}${isDryRun ? " (Dry-run: Zero deployments)" : ""}`);
    console.log(`IndexNow URLs Broadcast:          ${result.indexNowUrlsSubmitted.length}`);
    console.log(`Summary:                          ${result.summary}`);
    console.log("================================================================================");

    if (result.timing) {
      console.log("\n⏱️  CYCLE TIMING BREAKDOWN:");
      console.log("--------------------------------------------------------------------------------");
      console.log(`• Telemetry Ingestion:     ${result.timing.telemetryIngestionMs}ms (${(result.timing.telemetryIngestionMs / 1000).toFixed(2)}s)`);
      console.log(`• Opportunity Scoring:     ${result.timing.opportunityScoringMs}ms (${(result.timing.opportunityScoringMs / 1000).toFixed(2)}s)`);
      console.log(`• Hermes/Qwen LLM:         ${result.timing.llmMs}ms (${(result.timing.llmMs / 1000).toFixed(2)}s)`);
      console.log(`• Optimization Patch:      ${result.timing.optimizationMs}ms (${(result.timing.optimizationMs / 1000).toFixed(2)}s)`);
      console.log(`• Validation (Stage A/B):  ${result.timing.validationMs}ms (${(result.timing.validationMs / 1000).toFixed(2)}s)`);
      console.log(`• Next.js Production Build:${result.timing.buildMs}ms (${(result.timing.buildMs / 1000).toFixed(2)}s)`);
      console.log(`• Deployment (Git/Push):   ${result.timing.deploymentMs}ms (${(result.timing.deploymentMs / 1000).toFixed(2)}s)`);
      console.log(`• Total Autonomous Cycle:  ${result.timing.totalCycleMs}ms (${(result.timing.totalCycleMs / 1000).toFixed(2)}s)`);
      console.log("--------------------------------------------------------------------------------");
    }

    if (result.multiSourceMatrix && result.multiSourceMatrix.length > 0) {
      console.log("\n📡 MULTI-SOURCE TELEMETRY STATUS MATRIX:");
      console.log("--------------------------------------------------------------------------------");
      result.multiSourceMatrix.forEach((m) => {
        const conn = m.connected ? "CONNECTED" : "NOT_CONNECTED";
        const real = m.realDataRetrieved ? `YES (${m.recordCount} rows)` : "NO";
        const feeds = m.feedsScoring ? "YES" : "NO";
        console.log(`• ${m.sourceName.padEnd(25)} | Health: ${conn.padEnd(14)} | Real Data: ${real.padEnd(16)} | Feeds Scoring: ${feeds}`);
        if (m.errorReason) {
          console.log(`  └─ Note/Status: ${m.errorReason}`);
        }
      });
      console.log("--------------------------------------------------------------------------------");
    }

    if (result.selectedOpportunities && result.selectedOpportunities.length > 0) {
      console.log(`\n🎯 Actionable Opportunities Selected for Cycle (Batch 1 of up to 20 pages | Daily Cap: 80):`);
      result.selectedOpportunities.forEach((opp, i) => {
        const file = opp.proposedAction?.targetFile || opp.targetFile || "data/tools/*.ts";
        const sem = opp.semanticResult;
        console.log(`\n--------------------------------------------------------------------------------`);
        console.log(`Opportunity #${i + 1}: /${opp.pageSlug} (Score: ${opp.opportunityScore}/100)`);
        console.log(`--------------------------------------------------------------------------------`);
        console.log(`  * URL / Page:            https://novatool.in/${opp.pageSlug}`);
        console.log(`  * Signal / Issue:        ${opp.type} - ${opp.reason}`);
        console.log(`  * Risk Classification:   ${opp.riskLevel} (Safe autonomous tier)`);
        console.log(`  * Proposed Action:       ${opp.proposedAction?.type} (${opp.proposedAction?.summary})`);
        if (opp.actionability) {
          const actIcon = opp.actionability.isActionable ? "✅" : "ℹ️";
          console.log(`  * Actionability Gate:    ${actIcon} ${opp.actionability.isActionable ? "ACTIONABLE" : "NO_ACTIONABLE_CHANGE"} - ${opp.actionability.reason}`);
        }
        console.log(`  * Target Source File:    ${file}`);
        console.log(`  * Telemetry Metrics:     GSC clicks: ${opp.currentMetrics?.clicks || 0}, imp: ${opp.currentMetrics?.impressions || 0}, pos: ${(opp.currentMetrics?.position || 0).toFixed(1)}, GA4 sessions: ${opp.currentMetrics?.trafficSessions || 0}, Bing imp: ${opp.currentMetrics?.bingImpressions || 0}, Clarity dead clicks: ${opp.currentMetrics?.clarityDeadClicks || 0}`);
        if (sem) {
          console.log(`  * Qwen Semantic Output:  [${sem.provenanceType || "model-generated"} via ${sem.modelUsed || "qwen3:4b"}]`);
          if (sem.seoTitle) console.log(`      Proposed SEO Title:       "${sem.seoTitle}"`);
          if (sem.seoDescription) console.log(`      Proposed Meta Description: "${sem.seoDescription}"`);
          if (sem.internalLinkSuggestions && sem.internalLinkSuggestions.length > 0) {
            console.log(`      Internal Link Suggestions:  ${sem.internalLinkSuggestions.map((s) => "/" + s).join(", ")}`);
          }
          if (sem.contentSuggestions && sem.contentSuggestions.length > 0) {
            console.log(`      Content Depth Suggestions:  ${sem.contentSuggestions.join("; ")}`);
          }
          if (sem.faqs && sem.faqs.length > 0) {
            console.log(`      Enriched FAQs (${sem.faqs.length}):`);
            sem.faqs.forEach((faq, fIdx) => {
              console.log(`        [Q${fIdx + 1}]: ${faq.question}`);
              console.log(`        [A${fIdx + 1}]: ${faq.answer}`);
            });
          }
          if (sem.reasoningSummary) console.log(`      Reasoning Summary:         ${sem.reasoningSummary}`);
        }
      });
    }

    if (result.highRiskSkipped > 0) {
      console.log(`\n🛡️ High-Risk Protection: ${result.highRiskSkipped} high-risk opportunities safely skipped (SKIP -> LOG -> CONTINUE).`);
    }

    if (isDryRun) {
      console.log("\n🔒 DRY RUN SAFETY GUARANTEE: Zero files were modified. Zero Git commits created. Zero deployments triggered. Zero IndexNow calls broadcast.");
    }
    console.log("================================================================================\n");

    if (isVerbose && result.auditRecords.length > 0) {
      console.log("📜 Traceable Audit Events:");
      result.auditRecords.forEach((a, idx) => {
        console.log(`  [${idx + 1}] ${a.action} -> ${a.status} (Risk: ${a.riskLevel})`);
        if (a.pageSlug) console.log(`      Page: /${a.pageSlug}`);
        if (a.commitMessage) console.log(`      Commit: ${a.commitMessage}`);
        if (a.details?.reason) console.log(`      Reason: ${a.details.reason}`);
        if (a.action === "BATCH_VALIDATION_FAILED_ROLLED_BACK") {
          console.log(`      Failed Check: ${a.details?.failedCheckName}`);
          console.log(`      Failure Message: ${a.details?.exactFailureMessage}`);
          if (a.details?.allFailedChecks) {
            console.log(`      All Failed Checks: ${a.details.allFailedChecks.join(", ")}`);
          }
        }
      });
      console.log("\n");
    }

    process.exit(result.status === "BLOCKED_PENDING_REAL_DATA" && !isDryRun ? 2 : 0);
  } catch (err) {
    if (err && (err.message === "SEO cycle already running" || String(err).includes("SEO cycle already running"))) {
      console.error("SEO cycle already running");
      process.exit(1);
    }
    console.error("❌ Autonomous SEO cycle execution failed:", err);
    process.exit(1);
  }
}

runStandaloneCycle();
