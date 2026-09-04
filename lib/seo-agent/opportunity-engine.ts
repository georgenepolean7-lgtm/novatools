/**
 * Nova Tools Autonomous SEO Agent - Opportunity Detection Engine
 * Analyzes live search signals, registry structures, and content health
 * across all 19 opportunity criteria.
 */

import { getAllTools } from "@/lib/tools/registry";
import { getAllCategories } from "@/lib/tools/categories";
import {
  GSCPageMetric,
  GA4TrafficMetric,
  BingPerformanceMetric,
  ClarityUxMetric,
  SeoOpportunity,
  OpportunityType,
  RiskLevel,
  MetricProvenance,
} from "./types";
import { SEO_AGENT_CONFIG } from "./config";
import { evaluateUsefulContentDepth } from "./idempotency-gate";

export class SeoOpportunityEngine {
  /**
   * Scans all tools and search metrics to detect active SEO opportunities.
   * Ingests GSC, GA4, Bing Webmaster Tools, and Microsoft Clarity telemetry.
   */
  detectOpportunities(
    gscMetrics: GSCPageMetric[],
    ga4Metrics: GA4TrafficMetric[],
    priorGscMetrics: GSCPageMetric[] = [],
    bingMetrics: BingPerformanceMetric[] = [],
    clarityMetrics: ClarityUxMetric[] = [],
    resolvedOpportunities: string[] = []
  ): SeoOpportunity[] {
    const allTools = getAllTools();
    const categories = getAllCategories();
    const opportunities: SeoOpportunity[] = [];
    const timestamp = new Date().toISOString();
    const resolvedSet = new Set(resolvedOpportunities);

    // Map metrics by slug for fast correlation
    const gscBySlug = new Map<string, GSCPageMetric[]>();
    gscMetrics.forEach((m) => {
      if (!m || !m.page) return;
      const slug = m.page.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
      const existing = gscBySlug.get(slug) || [];
      existing.push(m);
      gscBySlug.set(slug, existing);
    });

    const priorGscBySlug = new Map<string, GSCPageMetric[]>();
    priorGscMetrics.forEach((m) => {
      if (!m || !m.page) return;
      const slug = m.page.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
      const existing = priorGscBySlug.get(slug) || [];
      existing.push(m);
      priorGscBySlug.set(slug, existing);
    });

    const ga4BySlug = new Map<string, GA4TrafficMetric>();
    ga4Metrics.forEach((m) => {
      const slug = m.pagePath.replace(/^\//, "").replace(/\/$/, "");
      ga4BySlug.set(slug, m);
    });

    // Compute internal linking incoming degrees across all tools
    const incomingLinkCount = new Map<string, number>();
    allTools.forEach((t) => {
      incomingLinkCount.set(t.slug, 0);
    });
    allTools.forEach((t) => {
      (t.relatedTools || []).forEach((relSlug) => {
        const count = incomingLinkCount.get(relSlug) || 0;
        incomingLinkCount.set(relSlug, count + 1);
      });
    });

    // 1. EVALUATE EACH TOOL
    for (const tool of allTools) {
      const pageSlug = tool.slug;
      const pageUrl = `${SEO_AGENT_CONFIG.SITE_URL}/${pageSlug}`;
      const targetFile = `data/tools/${tool.category}.ts`;
      const toolMetrics = gscBySlug.get(pageSlug) || [];
      const priorMetrics = priorGscBySlug.get(pageSlug) || [];
      const ga4 = ga4BySlug.get(pageSlug);

      const totalClicks = toolMetrics.reduce((sum, m) => sum + m.clicks, 0);
      const totalImpressions = toolMetrics.reduce((sum, m) => sum + m.impressions, 0);
      const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgPosition =
        toolMetrics.length > 0
          ? toolMetrics.reduce((sum, m) => sum + m.position, 0) / toolMetrics.length
          : 0;

      const priorClicks = priorMetrics.reduce((sum, m) => sum + m.clicks, 0);
      const priorImpressions = priorMetrics.reduce((sum, m) => sum + m.impressions, 0);

      const provenance: MetricProvenance[] = toolMetrics.map((m) => m.provenance);
      if (ga4) provenance.push(ga4.provenance);

      // Rule A: Position 4-10 Striking Distance (High CTR upside)
      if (avgPosition >= 4.0 && avgPosition <= 10.0 && totalImpressions >= 50) {
        opportunities.push(
          this.createOpportunity({
            id: `pos-4-10-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "POSITION_4_10_OPPORTUNITY",
            reason: `Average ranking is position ${avgPosition.toFixed(1)} with ${totalImpressions} impressions. Striking distance to top 3.`,
            riskLevel: "LOW",
            targetFile,
            actionType: "TITLE_OPTIMIZATION",
            actionSummary: `Refine title and meta description to target primary search intent and lift CTR from ${avgCtr.toFixed(1)}%.`,
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule B: Position 11-20 Page 2 Breakout
      if (avgPosition >= 11.0 && avgPosition <= 20.0 && totalImpressions >= 100) {
        opportunities.push(
          this.createOpportunity({
            id: `pos-11-20-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "POSITION_11_20_OPPORTUNITY",
            reason: `Ranks on Page 2 (position ${avgPosition.toFixed(1)}) with ${totalImpressions} impressions. Content depth and internal links can push to Page 1.`,
            riskLevel: "LOW",
            targetFile,
            actionType: "EDITORIAL_EXPANSION",
            actionSummary: "Enrich technical guide and contextual FAQ to improve topical authority.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule C: High Impressions, Low CTR (Underperforming Snippet)
      if (totalImpressions >= 200 && avgCtr < 2.0 && avgPosition <= 15) {
        opportunities.push(
          this.createOpportunity({
            id: `high-imp-low-ctr-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "HIGH_IMPRESSIONS_LOW_CTR",
            reason: `High search visibility (${totalImpressions} impressions) but CTR is only ${avgCtr.toFixed(2)}%. SERP snippet needs compelling benefit hook.`,
            riskLevel: "LOW",
            targetFile,
            actionType: "DESCRIPTION_OPTIMIZATION",
            actionSummary: "Optimize title tag and meta description for higher click-through intent.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule E: Losing Clicks (Trend Drop)
      if (priorClicks >= 30 && totalClicks < priorClicks * 0.7) {
        opportunities.push(
          this.createOpportunity({
            id: `losing-clicks-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "LOSING_CLICKS",
            reason: `Clicks dropped by ${Math.round(((priorClicks - totalClicks) / priorClicks) * 100)}% (from ${priorClicks} to ${totalClicks}).`,
            riskLevel: "LOW",
            targetFile,
            actionType: "FAQ_ENRICHMENT",
            actionSummary: "Enrich fresh user questions and update outdated information.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule F: Losing Impressions (Visibility Loss)
      if (priorImpressions >= 200 && totalImpressions < priorImpressions * 0.7) {
        opportunities.push(
          this.createOpportunity({
            id: `losing-impressions-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "LOSING_IMPRESSIONS",
            reason: `Impressions dropped by ${Math.round(((priorImpressions - totalImpressions) / priorImpressions) * 100)}% (from ${priorImpressions} to ${totalImpressions}).`,
            riskLevel: "LOW",
            targetFile,
            actionType: "TITLE_OPTIMIZATION",
            actionSummary: "Align title and headings with shifting search queries.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule I: Thin Pages (Evaluated via Holistic Useful Content Depth)
      // Safety Rule: Zero-traffic pages never receive speculative FAQ/content changes.
      const contentDepth = evaluateUsefulContentDepth(tool);
      const hasSearchEvidence = totalImpressions > 0 || (ga4?.sessions || 0) > 0;
      const isFaqResolved =
        resolvedSet.has(`thin-content-${pageSlug}`) ||
        resolvedSet.has(`${pageSlug}:FAQ_ENRICHMENT`) ||
        resolvedSet.has(`${pageSlug}:THIN_PAGE_CONTENT`);

      // Genuinely thin page check: only flagged if content depth is truly lacking AND has search demand
      if (contentDepth.isThin && hasSearchEvidence && !isFaqResolved) {
        opportunities.push(
          this.createOpportunity({
            id: `thin-content-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "THIN_PAGE_CONTENT",
            reason: `Tool has limited explanatory content (${contentDepth.faqCount} FAQs, depth score: ${contentDepth.depthScore}/100) with search evidence (${totalImpressions} GSC imp, ${ga4?.sessions || 0} GA4 sessions).`,
            riskLevel: "LOW",
            targetFile,
            actionType: "FAQ_ENRICHMENT",
            actionSummary: "Add high-value technical FAQ and how-to guidance tailored to the tool's browser engine.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule J & R: Weak Internal Linking / Orphan Check (DECOUPLED: metadata preserved)
      const linksCount = incomingLinkCount.get(pageSlug) || 0;
      const currentRelCount = tool.relatedTools?.length || 0;
      const maxLinks = SEO_AGENT_CONFIG.BUDGETS.MAX_INTERNAL_LINKS_PER_PAGE || 6;
      const canAddLinks = currentRelCount < maxLinks;
      const isLinksResolved =
        resolvedSet.has(`orphan-page-${pageSlug}`) ||
        resolvedSet.has(`weak-links-${pageSlug}`) ||
        resolvedSet.has(`${pageSlug}:INTERNAL_LINKS`);

      if (linksCount === 0 && canAddLinks && !isLinksResolved) {
        opportunities.push(
          this.createOpportunity({
            id: `orphan-page-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "ORPHAN_PAGE",
            reason: `Page has 0 incoming links from other tools in the registry.`,
            riskLevel: "LOW",
            targetFile,
            actionType: "INTERNAL_LINKS",
            actionSummary: "Add contextual links from related tools in the same category (internal linking only; title and description are preserved).",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      } else if (linksCount < 2 && canAddLinks && !isLinksResolved) {
        opportunities.push(
          this.createOpportunity({
            id: `weak-links-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "WEAK_INTERNAL_LINKING",
            reason: `Page has only ${linksCount} incoming internal link.`,
            riskLevel: "LOW",
            targetFile,
            actionType: "INTERNAL_LINKS",
            actionSummary: "Establish bidirectional connections with sibling utilities in data/tools/ (internal linking only; title and description are preserved).",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule L: Title Tag Health
      const titleLen = (tool.seoTitle || "").length;
      if (titleLen < 25 || titleLen > 65) {
        opportunities.push(
          this.createOpportunity({
            id: `weak-title-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "WEAK_TITLE",
            reason: `Title length (${titleLen} characters) is outside optimal range (35-60 chars).`,
            riskLevel: "LOW",
            targetFile,
            actionType: "TITLE_OPTIMIZATION",
            actionSummary: "Format title tag with primary intent keyword and brand value.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }

      // Rule M: Meta Description Health
      const descLen = (tool.seoDescription || "").length;
      if (descLen < 80 || descLen > 165) {
        opportunities.push(
          this.createOpportunity({
            id: `weak-desc-${pageSlug}`,
            pageSlug,
            pageUrl,
            type: "WEAK_META_DESCRIPTION",
            reason: `Meta description length (${descLen} characters) is outside optimal range (120-155 chars).`,
            riskLevel: "LOW",
            targetFile,
            actionType: "DESCRIPTION_OPTIMIZATION",
            actionSummary: "Craft crisp 140-character summary highlighting instant client-side privacy.",
            currentMetrics: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, trafficSessions: ga4?.sessions },
            provenance,
            detectedAt: timestamp,
          })
        );
      }
    }

    // 2. CHECK CATEGORY HUBS
    for (const cat of categories) {
      if (!cat.description || cat.description.length < 50) {
        opportunities.push(
          this.createOpportunity({
            id: `category-enrich-${cat.id}`,
            pageSlug: `categories/${cat.id}`,
            pageUrl: `${SEO_AGENT_CONFIG.SITE_URL}/categories/${cat.id}`,
            type: "CATEGORY_ENRICHMENT_NEEDED",
            reason: `Category hub for ${cat.name} has thin description (${cat.description?.length || 0} characters).`,
            riskLevel: "MEDIUM",
            targetFile: "lib/tools/categories.ts",
            actionType: "EDITORIAL_EXPANSION",
            actionSummary: "Expand category summary and keyword highlights for topical authority.",
            provenance: [],
            detectedAt: timestamp,
          })
        );
      }
    }

    // 3. CANNIBALIZATION DETECTION (Multiple tools targeting identical keywords)
    const keywordMap = new Map<string, string[]>();
    allTools.forEach((t) => {
      (t.keywords || []).forEach((kw) => {
        const norm = kw.toLowerCase().trim();
        const list = keywordMap.get(norm) || [];
        list.push(t.slug);
        keywordMap.set(norm, list);
      });
    });

    keywordMap.forEach((slugs, kw) => {
      if (slugs.length > 2) {
        // High Risk of cannibalization
        opportunities.push({
          id: `cannibal-${kw.replace(/\s+/g, "-")}`,
          pageSlug: slugs[0],
          pageUrl: `${SEO_AGENT_CONFIG.SITE_URL}/${slugs[0]}`,
          type: "CANNIBALIZATION_RISK",
          primaryQuery: kw,
          detectedAt: timestamp,
          reason: `Keyword "${kw}" is targeted by ${slugs.length} distinct tools (${slugs.slice(0, 3).join(", ")}).`,
          riskLevel: "HIGH", // Strictly HIGH risk - must be SKIPPED automatically
          opportunityScore: 10,
          scoreBreakdown: {
            impressionPotential: 10,
            positionOpportunity: 5,
            ctrOpportunity: 5,
            trafficTrend: 0,
            businessRelevance: 5,
            pageQuality: 5,
            riskPenalty: 50,
          },
          proposedAction: {
            type: "CANONICAL_CHECK",
            targetFile: `data/tools/`,
            summary: "HIGH-RISK: Cannibalization requires manual architectural review. Skipped automatically.",
          },
          provenance: [],
        });
      }
    });

    return opportunities;
  }

  private createOpportunity(params: {
    id: string;
    pageSlug: string;
    pageUrl: string;
    type: OpportunityType;
    reason: string;
    riskLevel: RiskLevel;
    targetFile: string;
    actionType: "TITLE_OPTIMIZATION" | "DESCRIPTION_OPTIMIZATION" | "FAQ_ENRICHMENT" | "EDITORIAL_EXPANSION" | "INTERNAL_LINKS" | "CANONICAL_CHECK";
    actionSummary: string;
    currentMetrics?: { clicks: number; impressions: number; ctr: number; position: number; trafficSessions?: number };
    provenance: MetricProvenance[];
    detectedAt: string;
  }): SeoOpportunity {
    return {
      id: params.id,
      pageSlug: params.pageSlug,
      pageUrl: params.pageUrl,
      type: params.type,
      reason: params.reason,
      riskLevel: params.riskLevel,
      targetFile: params.targetFile,
      currentMetrics: params.currentMetrics,
      detectedAt: params.detectedAt,
      opportunityScore: 0, // Will be computed by ScoringEngine
      scoreBreakdown: {
        impressionPotential: 0,
        positionOpportunity: 0,
        ctrOpportunity: 0,
        trafficTrend: 0,
        businessRelevance: 0,
        pageQuality: 0,
        riskPenalty: 0,
      },
      proposedAction: {
        type: params.actionType,
        targetFile: params.targetFile,
        summary: params.actionSummary,
      },
      provenance: params.provenance,
    };
  }
}
