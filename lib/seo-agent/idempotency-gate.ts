/**
 * Nova Tools Autonomous SEO Agent - Idempotency & Content Gap Gate
 * Evaluates whether an SEO opportunity represents a genuine remaining content gap,
 * an already satisfied optimization, or an unimpactful no-op.
 */

import { ToolDefinition } from "@/lib/tools/tool-types";
import { SeoOpportunity, OptimizationRecord, SeoActionType } from "./types";
import { SeoAuditStore, computeToolContentFingerprint } from "./audit-store";
import { SEO_AGENT_CONFIG } from "./config";

export type IdempotencyStatus = "ALREADY_OPTIMIZED" | "NO_MEANINGFUL_CHANGE" | "REMAINING_GAP";

export interface UsefulContentDepth {
  isThin: boolean;
  faqCount: number;
  hasHowTo: boolean;
  hasFeatures: boolean;
  hasEditorialGuide: boolean;
  depthScore: number; // 0 to 100
  remainingGap?: string;
}

export interface IdempotencyEvaluation {
  status: IdempotencyStatus;
  isActionable: boolean;
  reason: string;
  remainingGap?: string;
  previousOptimization?: OptimizationRecord;
  contentFingerprint?: string;
}

/**
 * Evaluates actual useful content depth across all content axes of a tool.
 * Does not rely solely on FAQ count to judge thinness.
 */
export function evaluateUsefulContentDepth(tool: ToolDefinition): UsefulContentDepth {
  const faqCount = tool.faq?.length || 0;
  const hasHowTo = (tool.howToSteps?.length || 0) >= 2;
  const hasFeatures = (tool.features?.length || 0) >= 3;
  const hasEditorialGuide = !!(tool.editorialGuide?.sections && tool.editorialGuide.sections.length > 0);
  const hasSubstantialDesc =
    (tool.longDescription?.length || 0) >= 100 || (tool.shortDescription?.length || 0) >= 60;

  // Composite content depth score (0 to 100)
  let depthScore = 0;
  depthScore += Math.min(50, faqCount * 10); // Up to 50 pts for 5 FAQs
  if (hasHowTo) depthScore += 20;            // 20 pts for structured how-to steps
  if (hasFeatures) depthScore += 15;         // 15 pts for bulleted features
  if (hasSubstantialDesc) depthScore += 15;  // 15 pts for descriptive text
  if (hasEditorialGuide) depthScore += 25;   // Bonus for full editorial guide

  // A page is genuinely thin ONLY if it lacks depth across all content axes:
  // 1. If it has >= 5 FAQs, it satisfies the threshold for search snippets.
  // 2. If it has >= 4 FAQs PLUS how-to steps and features, it is well-structured and NOT thin.
  // 3. If it has an editorial guide with sections, it is NOT thin.
  const isSatisfied =
    faqCount >= (SEO_AGENT_CONFIG.BUDGETS.FAQ_CONTENT_THRESHOLD || 5) ||
    (faqCount >= 4 && hasHowTo && hasFeatures) ||
    hasEditorialGuide;

  const isThin = !isSatisfied && (faqCount < 4 || (!hasHowTo && !hasFeatures));

  const remainingGap = isThin
    ? `Page has limited content depth (depth score: ${depthScore}/100, ${faqCount} FAQs, ${hasHowTo ? "has" : "no"} how-to steps, ${hasFeatures ? "has" : "no"} features). Needs ${Math.max(1, 5 - faqCount)} more technical FAQ(s) or editorial guidance.`
    : undefined;

  return {
    isThin,
    faqCount,
    hasHowTo,
    hasFeatures,
    hasEditorialGuide,
    depthScore: Math.min(100, depthScore),
    remainingGap,
  };
}

/**
 * Explicit Idempotency & No-Op Gate.
 * Categorizes an opportunity into ALREADY_OPTIMIZED, NO_MEANINGFUL_CHANGE, or REMAINING_GAP.
 * Only REMAINING_GAP is actionable.
 */
export function evaluateOpportunityIdempotency(
  tool: ToolDefinition,
  opp: SeoOpportunity,
  auditStore?: SeoAuditStore
): IdempotencyEvaluation {
  const actionType: SeoActionType | string = opp.proposedAction?.type || "FAQ_ENRICHMENT";
  const contentDepth = evaluateUsefulContentDepth(tool);

  // 1. Check Previous Optimization History from Audit Store (Stable Identity: slug + opp.type / actionType)
  if (auditStore) {
    const opts = auditStore.getOptimizations();
    const matchingOpts = opts.filter(
      (o) =>
        o.pageSlug === tool.slug &&
        (o.actionType === actionType || o.opportunityType === opp.type) &&
        (o.commitStatus === "DEPLOYED" || o.commitStatus === "COMMITTED")
    );

    if (matchingOpts.length > 0) {
      const latest = matchingOpts[0];

      // Case 1A: THIN_PAGE_CONTENT / FAQ_ENRICHMENT already applied
      if (actionType === "FAQ_ENRICHMENT" || opp.type === "THIN_PAGE_CONTENT") {
        if (!contentDepth.isThin || contentDepth.faqCount >= 5) {
          return {
            status: "ALREADY_OPTIMIZED",
            isActionable: false,
            reason: `Page already received intended FAQ enrichment (commit ${latest.commitHash?.slice(0, 7) || "historical"}) and now satisfies content depth threshold with ${contentDepth.faqCount} FAQs (depth score: ${contentDepth.depthScore}/100).`,
            previousOptimization: latest,
          };
        }
      }

      // Case 1B: TITLE_OPTIMIZATION already applied
      if (actionType === "TITLE_OPTIMIZATION" || opp.type === "WEAK_TITLE") {
        const titleLen = (tool.seoTitle || "").trim().length;
        if (titleLen >= 35 && titleLen <= 65) {
          return {
            status: "ALREADY_OPTIMIZED",
            isActionable: false,
            reason: `Page title was already optimized in previous cycle (commit ${latest.commitHash?.slice(0, 7) || "historical"}) and current title length (${titleLen} chars) meets search intent criteria.`,
            previousOptimization: latest,
          };
        }
      }

      // Case 1C: DESCRIPTION_OPTIMIZATION already applied
      if (actionType === "DESCRIPTION_OPTIMIZATION" || opp.type === "WEAK_META_DESCRIPTION") {
        const descLen = (tool.seoDescription || "").trim().length;
        if (descLen >= 110 && descLen <= 165) {
          return {
            status: "ALREADY_OPTIMIZED",
            isActionable: false,
            reason: `Page meta description was already optimized in previous cycle (commit ${latest.commitHash?.slice(0, 7) || "historical"}) and current description length (${descLen} chars) meets SERP criteria.`,
            previousOptimization: latest,
          };
        }
      }

      // Case 1D: INTERNAL_LINKS already applied
      if (actionType === "INTERNAL_LINKS" || opp.type === "WEAK_INTERNAL_LINKING" || opp.type === "ORPHAN_PAGE") {
        const relCount = tool.relatedTools?.length || 0;
        if (relCount >= 2) {
          return {
            status: "ALREADY_OPTIMIZED",
            isActionable: false,
            reason: `Page internal links were already established in previous cycle (commit ${latest.commitHash?.slice(0, 7) || "historical"}) with ${relCount} related tool links.`,
            previousOptimization: latest,
          };
        }
      }
    }

    // Check Cooldown State
    const cooldown = auditStore.isPageInCooldown(tool.slug, actionType);
    if (cooldown.inCooldown) {
      return {
        status: "ALREADY_OPTIMIZED",
        isActionable: false,
        reason: `Active cooldown in effect: ${actionType} was deployed on ${cooldown.lastOptimizedAt}. ${cooldown.remainingDays} day(s) remaining of ${cooldown.cooldownDays}-day cooldown.`,
      };
    }

    // Check Content Fingerprint Match
    const currentFp = computeToolContentFingerprint(tool, actionType);
    if (auditStore.isContentAlreadyApplied(tool.slug, actionType, currentFp)) {
      return {
        status: "ALREADY_OPTIMIZED",
        isActionable: false,
        reason: `Exact resulting content fingerprint (${currentFp}) was already deployed and active.`,
        contentFingerprint: currentFp,
      };
    }
  }

  // 2. Check Saturated Capacity / No-Op Opportunity Conditions
  if (actionType === "FAQ_ENRICHMENT" || opp.type === "THIN_PAGE_CONTENT") {
    const maxFaqs = SEO_AGENT_CONFIG.BUDGETS.MAX_FAQS_PER_PAGE || 8;
    if (contentDepth.faqCount >= maxFaqs) {
      return {
        status: "NO_MEANINGFUL_CHANGE",
        isActionable: false,
        reason: `Page FAQ capacity reached (${contentDepth.faqCount}/${maxFaqs} FAQs already present).`,
      };
    }
    if (!contentDepth.isThin && contentDepth.faqCount >= 5) {
      return {
        status: "NO_MEANINGFUL_CHANGE",
        isActionable: false,
        reason: `Page already satisfies useful content depth (${contentDepth.faqCount} FAQs, depth score: ${contentDepth.depthScore}/100). Additional FAQs produce no meaningful ranking lift.`,
      };
    }
  }

  if (actionType === "INTERNAL_LINKS" || opp.type === "ORPHAN_PAGE" || opp.type === "WEAK_INTERNAL_LINKING") {
    const currentLinks = tool.relatedTools?.length || 0;
    const maxLinks = SEO_AGENT_CONFIG.BUDGETS.MAX_INTERNAL_LINKS_PER_PAGE || 6;
    if (currentLinks >= maxLinks) {
      return {
        status: "NO_MEANINGFUL_CHANGE",
        isActionable: false,
        reason: `Page internal links capacity reached (${currentLinks}/${maxLinks} links already present).`,
      };
    }
  }

  if (actionType === "TITLE_OPTIMIZATION" && opp.type === "WEAK_TITLE") {
    const titleLen = (tool.seoTitle || "").trim().length;
    if (titleLen >= 35 && titleLen <= 60) {
      return {
        status: "NO_MEANINGFUL_CHANGE",
        isActionable: false,
        reason: `Current title is already in optimal length range (${titleLen} characters).`,
      };
    }
  }

  if (actionType === "DESCRIPTION_OPTIMIZATION" && opp.type === "WEAK_META_DESCRIPTION") {
    const descLen = (tool.seoDescription || "").trim().length;
    if (descLen >= 120 && descLen <= 155) {
      return {
        status: "NO_MEANINGFUL_CHANGE",
        isActionable: false,
        reason: `Current meta description is already in optimal length range (${descLen} characters).`,
      };
    }
  }

  // 3. Genuine Remaining Content Gap Verified
  let gapDescription = "";
  if (actionType === "FAQ_ENRICHMENT" || opp.type === "THIN_PAGE_CONTENT") {
    gapDescription = contentDepth.remainingGap || `Page has only ${contentDepth.faqCount} FAQs; needs additional technical explanations.`;
  } else if (actionType === "TITLE_OPTIMIZATION") {
    gapDescription = `Current title length is ${(tool.seoTitle || "").length} chars; needs keyword alignment with search queries.`;
  } else if (actionType === "DESCRIPTION_OPTIMIZATION") {
    gapDescription = `Current description length is ${(tool.seoDescription || "").length} chars; needs search intent alignment.`;
  } else if (actionType === "INTERNAL_LINKS") {
    gapDescription = `Page currently has ${tool.relatedTools?.length || 0} outgoing links and low internal connectivity.`;
  } else {
    gapDescription = `Unsatisfied opportunity criteria for ${opp.type}.`;
  }

  return {
    status: "REMAINING_GAP",
    isActionable: true,
    reason: `Verified actionable opportunity with genuine remaining gap: ${gapDescription}`,
    remainingGap: gapDescription,
  };
}
