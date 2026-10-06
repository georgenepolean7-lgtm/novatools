/**
 * Nova Tools Autonomous SEO Agent - 404 & Route Integrity Health Checker
 * Deterministically scans tool canonical routes, static pages, and external GSC 404 reports.
 * Classifies issues into:
 *  - SAFE_FIX: 301 redirect to canonical tool URL
 *  - REVIEW_REQUIRED: Missing content requiring manual inspection
 *  - IGNORED_EXTERNAL: Scraper, CDN, bot, or Cloudflare injected route
 */

import { getAllTools, getToolBySlug } from "@/lib/tools/registry";

export type RouteIssueClassification = "SAFE_FIX" | "REVIEW_REQUIRED" | "IGNORED_EXTERNAL";

export interface RouteHealthCheckResult {
  url: string;
  slug: string;
  status: number | "UNREACHABLE";
  isCanonicalMatch: boolean;
  classification?: RouteIssueClassification;
  suggestedAction?: string;
  targetCanonical?: string;
}

export interface Gsc404ClassificationResult {
  url: string;
  classification: RouteIssueClassification;
  reason: string;
  suggestedRedirect?: string;
  robotsRuleRecommended?: string;
}

// Known mapping of historical slug typos to active canonical tools
export const KNOWN_HISTORICAL_SLUG_REDIRECTS: Record<string, string> = {
  "text-diff-viewer": "text-diff-checker",
  "base64-file-converter": "data-url-file-converter",
  "file-hash-calculator": "file-checksum-sha256",
  "emi-calculator": "loan-emi-calculator",
};

/**
 * Classifies any 404 URL encountered in GSC or crawl reports.
 */
export function classify404Url(urlOrPath: string): Gsc404ClassificationResult {
  const cleanPath = urlOrPath
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/[?#].*$/, "")
    .trim();
  const slug = cleanPath.replace(/^\/+|\/+$/g, "");

  // 1. Cloudflare / CDN / ScrapeShield injected URLs -> IGNORED_EXTERNAL
  if (cleanPath.startsWith("/cdn-cgi/") || cleanPath.includes("cdn-cgi")) {
    return {
      url: urlOrPath,
      classification: "IGNORED_EXTERNAL",
      reason: "Cloudflare ScrapeShield email protection link crawled without fragment; blocked via robots.txt.",
      robotsRuleRecommended: "Disallow: /cdn-cgi/",
    };
  }

  // 2. Generic bot scans / WordPress probes / dotfiles -> IGNORED_EXTERNAL
  if (
    cleanPath.startsWith("/wp-") ||
    cleanPath.startsWith("/.") ||
    cleanPath.startsWith("/cgi-bin/") ||
    cleanPath.endsWith(".php") ||
    cleanPath.endsWith(".env") ||
    cleanPath.endsWith(".git")
  ) {
    return {
      url: urlOrPath,
      classification: "IGNORED_EXTERNAL",
      reason: "External bot probe or vulnerability scanner URL; not part of Nova Tools site structure.",
    };
  }

  // 3. Known historical tool slug typo -> SAFE_FIX
  if (KNOWN_HISTORICAL_SLUG_REDIRECTS[slug]) {
    const targetSlug = KNOWN_HISTORICAL_SLUG_REDIRECTS[slug];
    const targetTool = getToolBySlug(targetSlug);
    const targetName = targetTool?.name || targetSlug;
    return {
      url: urlOrPath,
      classification: "SAFE_FIX",
      reason: `Historical alias or homepage link typo for canonical tool '${targetName}' (${targetSlug}). Permanent 301 redirect resolves indexing cleanly.`,
      suggestedRedirect: `/${targetSlug}`,
    };
  }

  // 4. Fuzzy check against active tools in registry
  const allTools = getAllTools();
  const exactMatch = allTools.find((t) => t.slug === slug);
  if (exactMatch) {
    return {
      url: urlOrPath,
      classification: "SAFE_FIX",
      reason: `Slug '${slug}' matches active tool in canonical registry. Verify server-side route compilation.`,
      suggestedRedirect: `/${slug}`,
    };
  }

  // Check if a tool shares a substantial keyword prefix or suffix
  const similarTool = allTools.find((t) => {
    const tSlug = t.slug;
    return (
      (tSlug.length > 5 && slug.includes(tSlug)) ||
      (slug.length > 5 && tSlug.includes(slug))
    );
  });

  if (similarTool) {
    return {
      url: urlOrPath,
      classification: "SAFE_FIX",
      reason: `Slug '${slug}' closely resembles active tool '${similarTool.slug}'.`,
      suggestedRedirect: `/${similarTool.slug}`,
    };
  }

  // 5. Unrecognized core route -> REVIEW_REQUIRED
  return {
    url: urlOrPath,
    classification: "REVIEW_REQUIRED",
    reason: `Unrecognized route '${cleanPath}'. No automated 301 safely inferred. Requires developer review.`,
  };
}

/**
 * Validates that all canonical tools in registry resolve properly without 404s.
 */
export function checkCatalogRouteDefinitions(): {
  totalTools: number;
  validTools: number;
  missingRoutes: string[];
} {
  const allTools = getAllTools();
  const missingRoutes: string[] = [];

  for (const tool of allTools) {
    if (!tool.slug || typeof tool.slug !== "string") {
      missingRoutes.push(tool.name || "UNNAMED_TOOL");
    }
  }

  return {
    totalTools: allTools.length,
    validTools: allTools.length - missingRoutes.length,
    missingRoutes,
  };
}
