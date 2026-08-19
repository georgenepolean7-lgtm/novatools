/**
 * Central UPDF Affiliate Configuration for Nova Tools
 * All affiliate URLs and promotional copy are maintained centrally here.
 */

export interface UPDFAffiliateConfig {
  enabled: boolean;
  trackingUrl: string;
  ctaText: string;
  disclosureEnabled: boolean;
  bannerEnabled: boolean;
  headline: string;
  description: string;
  disclosureText: string;
  sponsoredBadge: string;
}

export const DEFAULT_UPDF_CONFIG: UPDFAffiliateConfig = {
  enabled: true,
  // Central production CJ tracking URL (can be overridden dynamically in the Admin Dashboard)
  trackingUrl: "https://www.dpbolvw.net/click-101855940-15717946",
  ctaText: "Explore UPDF",
  disclosureEnabled: true,
  bannerEnabled: true,
  headline: "Need a complete PDF solution?",
  description:
    "Nova Tools handles quick PDF tasks directly in your browser. If you need a full-featured PDF editor with AI-powered document tools, UPDF is another option.",
  disclosureText:
    "Some links on Nova Tools are affiliate links. If you purchase through these links, Nova Tools may receive a commission at no additional cost to you.",
  sponsoredBadge: "Sponsored / Affiliate recommendation",
};

/**
 * PDF-related tool detection
 * Checks whether a tool or category is PDF-specific.
 */
export function isPdfRelatedTool(category?: string | null, slug?: string | null): boolean {
  if (category && category.toLowerCase() === "pdf") {
    return true;
  }
  if (!slug) return false;
  const slugLower = slug.toLowerCase();
  return slugLower.includes("pdf");
}
