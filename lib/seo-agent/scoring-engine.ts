/**
 * Nova Tools Autonomous SEO Agent - Scoring & Prioritization Engine
 * Calculates deterministic Opportunity Scores and enforces strict risk tiers and cycle budgets.
 */

import { SeoOpportunity, OpportunitySelectionResult, FilteredOpportunityInfo } from "./types";
import { SEO_AGENT_CONFIG } from "./config";
import { getToolBySlug } from "@/lib/tools/registry";
import { SeoAuditStore } from "./audit-store";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { evaluateOpportunityIdempotency } from "./idempotency-gate";

export class SeoScoringEngine {
  /**
   * Scores and prioritizes detected opportunities using the deterministic SEO formula.
   */
  scoreAndPrioritize(opportunities: SeoOpportunity[]): SeoOpportunity[] {
    const scored = opportunities.map((opp) => {
      const breakdown = this.calculateBreakdown(opp);
      const totalScore = Math.max(
        0,
        breakdown.impressionPotential +
          breakdown.positionOpportunity +
          breakdown.ctrOpportunity +
          breakdown.trafficTrend +
          breakdown.businessRelevance +
          breakdown.pageQuality -
          breakdown.riskPenalty
      );

      return {
        ...opp,
        opportunityScore: Math.round(totalScore * 10) / 10,
        scoreBreakdown: breakdown,
      };
    });

    // Sort descending by opportunity score
    return scored.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  /**
   * Filters and selects actionable opportunities enforcing:
   * 1. Skipping all HIGH-risk items automatically (no waiting for approval)
   * 2. Per-action cooldown protection (e.g. 14 days for FAQ_ENRICHMENT)
   * 3. Content-aware duplicate / already-optimized detection via content fingerprints
   * 4. No-op pre-filtering based on current page state
   * 5. Daily and weekly change budget limits
   */
  selectActionableOpportunities(
    scoredOpportunities: SeoOpportunity[],
    dailyChangesAlreadyDone = 0,
    weeklyChangesAlreadyDone = 0,
    auditStore?: SeoAuditStore
  ): OpportunitySelectionResult {
    const dailyBudgetRemaining = Math.max(
      0,
      SEO_AGENT_CONFIG.BUDGETS.MAX_PAGE_CHANGES_PER_DAILY_CYCLE - dailyChangesAlreadyDone
    );
    const weeklyBudgetRemaining = Math.max(
      0,
      SEO_AGENT_CONFIG.BUDGETS.MAX_PAGE_CHANGES_PER_WEEK - weeklyChangesAlreadyDone
    );
    const effectiveBudget = Math.min(dailyBudgetRemaining, weeklyBudgetRemaining);

    const actionable: SeoOpportunity[] = [];
    const skippedHighRisk: SeoOpportunity[] = [];
    const budgetExceeded: SeoOpportunity[] = [];
    const filteredAlreadyOptimized: FilteredOpportunityInfo[] = [];
    const filteredCooldown: FilteredOpportunityInfo[] = [];
    const filteredNoOp: FilteredOpportunityInfo[] = [];

    // Track unique pages per cycle to avoid modifying the same page twice in one cycle
    const modifiedPagesInCycle = new Set<string>();

    for (const opp of scoredOpportunities) {
      // 1. HIGH-Risk guardrail: Immediately skip and log
      if (opp.riskLevel === "HIGH" || this.isHighRiskType(opp.type)) {
        skippedHighRisk.push(opp);
        continue;
      }

      // 2. Cooldown Gate: Per-action cooldown protection
      if (auditStore) {
        const cooldown = auditStore.isPageInCooldown(opp.pageSlug, opp.proposedAction.type);
        if (cooldown.inCooldown) {
          filteredCooldown.push({
            opportunity: opp,
            filterType: "COOLDOWN_ACTIVE",
            remainingDays: cooldown.remainingDays,
            lastOptimizedAt: cooldown.lastOptimizedAt,
            reason: `Active cooldown: ${opp.proposedAction.type} was deployed on ${cooldown.lastOptimizedAt}. ${cooldown.remainingDays} day(s) remaining of ${cooldown.cooldownDays}-day cooldown.`,
          });
          continue;
        }
      }

      // 3. Idempotency & Content Gap Gate (ALREADY_OPTIMIZED vs NO_MEANINGFUL_CHANGE vs REMAINING_GAP)
      const tool = getToolBySlug(opp.pageSlug);
      if (tool) {
        const idempotency = evaluateOpportunityIdempotency(tool, opp, auditStore);
        if (idempotency.status === "ALREADY_OPTIMIZED") {
          filteredAlreadyOptimized.push({
            opportunity: opp,
            filterType: "ALREADY_OPTIMIZED",
            reason: idempotency.reason,
            lastOptimizedAt: idempotency.previousOptimization?.timestamp,
          });
          continue;
        }

        if (idempotency.status === "NO_MEANINGFUL_CHANGE") {
          filteredNoOp.push({
            opportunity: opp,
            filterType: "NO_OP",
            reason: idempotency.reason,
          });
          continue;
        }

        // Only REMAINING_GAP continues to the actionable candidate pool!
      }

      // Avoid duplicate modifications to the same page in a single cycle
      if (modifiedPagesInCycle.has(opp.pageSlug)) {
        continue;
      }

      // 5. Budget check
      if (actionable.length >= effectiveBudget) {
        budgetExceeded.push(opp);
        continue;
      }

      actionable.push(opp);
      modifiedPagesInCycle.add(opp.pageSlug);
    }

    return {
      actionable,
      filteredAlreadyOptimized,
      filteredCooldown,
      filteredNoOp,
      skippedHighRisk,
      budgetExceeded,
    };
  }

  private checkNoOpOpportunity(tool: ToolDefinition, opp: SeoOpportunity): { noOp: boolean; reason: string } {
    const actionType = opp.proposedAction.type;

    if (actionType === "FAQ_ENRICHMENT" || opp.type === "THIN_PAGE_CONTENT") {
      const faqCount = tool.faq?.length || 0;
      const maxFaqs = SEO_AGENT_CONFIG.BUDGETS.MAX_FAQS_PER_PAGE || 8;
      if (faqCount >= maxFaqs) {
        return {
          noOp: true,
          reason: `Page FAQ capacity reached (${faqCount}/${maxFaqs} FAQs already present).`,
        };
      }
    }

    if (actionType === "INTERNAL_LINKS" || opp.type === "ORPHAN_PAGE" || opp.type === "WEAK_INTERNAL_LINKING") {
      const currentLinks = tool.relatedTools?.length || 0;
      const maxLinks = SEO_AGENT_CONFIG.BUDGETS.MAX_INTERNAL_LINKS_PER_PAGE || 6;
      if (currentLinks >= maxLinks) {
        return {
          noOp: true,
          reason: `Page internal links capacity reached (${currentLinks}/${maxLinks} links already present).`,
        };
      }
    }

    if (actionType === "TITLE_OPTIMIZATION" && opp.type === "WEAK_TITLE") {
      const titleLen = (tool.seoTitle || "").length;
      if (titleLen >= 35 && titleLen <= 60) {
        return {
          noOp: true,
          reason: `Current title is already in optimal length range (${titleLen} characters).`,
        };
      }
    }

    if (actionType === "DESCRIPTION_OPTIMIZATION" && opp.type === "WEAK_META_DESCRIPTION") {
      const descLen = (tool.seoDescription || "").length;
      if (descLen >= 120 && descLen <= 155) {
        return {
          noOp: true,
          reason: `Current meta description is already in optimal length range (${descLen} characters).`,
        };
      }
    }

    return { noOp: false, reason: "" };
  }

  private calculateBreakdown(opp: SeoOpportunity) {
    const metrics = opp.currentMetrics;
    const impressions = metrics?.impressions || 0;
    const clicks = metrics?.clicks || 0;
    const ctr = metrics?.ctr || 0;
    const position = metrics?.position || 0;

    // 1. Impression Potential (0 to 30 points) - Real search demand priority
    let impressionPotential = 0;
    if (impressions > 1000) impressionPotential = 30;
    else if (impressions > 500) impressionPotential = 25;
    else if (impressions > 200) impressionPotential = 20;
    else if (impressions > 50) impressionPotential = 15;
    else if (impressions > 10) impressionPotential = 10;
    else if (impressions > 0) impressionPotential = 5;

    // 2. Position Opportunity (0 to 25 points)
    // Positions 4-10 get the highest score (striking distance)
    let positionOpportunity = 0;
    if (position >= 4 && position <= 10) positionOpportunity = 25;
    else if (position >= 11 && position <= 20) positionOpportunity = 20;
    else if (position >= 1 && position <= 3) positionOpportunity = 10;
    else if (position > 20 && position <= 40) positionOpportunity = 8;
    else if (position > 40) positionOpportunity = 4;

    // 3. CTR Opportunity (0 to 20 points)
    let ctrOpportunity = 0;
    if (impressions > 100 && ctr < 1.5) ctrOpportunity = 20;
    else if (impressions > 50 && ctr < 3.0) ctrOpportunity = 15;
    else if (impressions > 0 && ctr < 5.0) ctrOpportunity = 10;
    else if (impressions > 0) ctrOpportunity = 5;

    // 4. Traffic Trend (0 to 10 points)
    let trafficTrend = clicks > 50 ? 8 : (clicks > 0 ? 5 : 2);
    if (opp.type === "LOSING_CLICKS" || opp.type === "LOSING_IMPRESSIONS") {
      trafficTrend = 10; // Prioritize stopping bleed
    }

    // 5. Business Relevance & Multi-Source Reinforcement (0 to 15 points)
    // Real search demand & multi-source evidence take strict precedence over category keywords
    let businessRelevance = 8;
    const hasGscDemand = impressions > 0 || clicks > 0;
    const hasGa4Demand = (metrics?.trafficSessions || 0) > 0;
    const hasBingDemand = (metrics?.bingImpressions || 0) > 0 || (metrics?.bingClicks || 0) > 0;
    const hasClarityFriction = (metrics?.clarityDeadClicks || 0) > 0;

    // Multi-source signal reinforcement
    let activeSourcesCount = 0;
    if (hasGscDemand) activeSourcesCount++;
    if (hasGa4Demand) activeSourcesCount++;
    if (hasBingDemand) activeSourcesCount++;
    if (hasClarityFriction) activeSourcesCount++;

    if (activeSourcesCount >= 3) {
      businessRelevance = 15; // Triple-verified demand
    } else if (activeSourcesCount >= 2) {
      businessRelevance = 13; // Dual-verified demand
    } else if (activeSourcesCount === 1) {
      businessRelevance = 10;
    } else {
      businessRelevance = 5; // Unproven catalog utility
    }

    // 6. Page Quality Factor (0 to 10 points)
    let pageQuality = 8;
    if (opp.type === "THIN_PAGE_CONTENT" || opp.type === "ORPHAN_PAGE") {
      pageQuality = 5;
    }

    // 7. Risk Penalty
    let riskPenalty = 0;
    if (opp.riskLevel === "HIGH") {
      riskPenalty = 100; // Heavily penalize high risk
    } else if (opp.riskLevel === "MEDIUM") {
      riskPenalty = 15;
    } else {
      riskPenalty = 0;
    }

    return {
      impressionPotential,
      positionOpportunity,
      ctrOpportunity,
      trafficTrend,
      businessRelevance,
      pageQuality,
      riskPenalty,
    };
  }

  private isHighRiskType(type: string): boolean {
    const highRiskKeywords = [
      "CANONICAL",
      "ROBOTS",
      "NOINDEX",
      "REDIRECT",
      "DELETION",
      "AUTH",
      "PAYMENT",
      "CANNIBALIZATION",
    ];
    return highRiskKeywords.some((kw) => type.includes(kw));
  }
}
