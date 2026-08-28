import { getAllTools } from "@/lib/tools/registry";
import { getAllCategories } from "@/lib/tools/categories";
import { programmaticPages } from "@/lib/seo/programmaticPages";

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a52a86efe6f041bd931a36f0e2bdadd8";
export const INDEXNOW_HOST = "novatool.in";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

// IndexNow submission endpoints (Submitting to any one endpoint broadcasts to all participating search engines like Bing, Yandex, Seznam, Naver)
export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

// Strictly prohibited patterns - private, auth, user, or administrative routes must never be submitted
const PRIVATE_ROUTE_PATTERNS = [
  /^\/admin(\/.*)?$/,
  /^\/api(\/.*)?$/,
  /^\/auth(\/.*)?$/,
  /^\/favorites(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/reset-password(\/.*)?$/,
  /^\/_not-found(\/.*)?$/,
];

/**
 * Returns all public, indexable URLs for Nova Tools.
 * Strictly filters out any private or administrative paths.
 */
export function getPublicIndexableUrls(): string[] {
  const baseUrl = `https://${INDEXNOW_HOST}`;

  // 1. Core static public pages
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/tools",
    "/categories",
    "/pricing",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  // 2. All Registry Tool Pages
  const toolPaths = getAllTools().map((t) => `/${t.slug}`);

  // 3. Category Hub Pages
  const categoryPaths = getAllCategories().map((c) => `/categories/${c.id}`);

  // 4. Programmatic Landing Pages
  const progPaths = Object.values(programmaticPages)
    .flat()
    .map((p) => `/tools/${p.slug}`);

  // Merge and filter
  const allPaths = [...staticPaths, ...toolPaths, ...categoryPaths, ...progPaths];
  const uniqueUrls = new Set<string>();

  for (const p of allPaths) {
    const isPrivate = PRIVATE_ROUTE_PATTERNS.some((pattern) => pattern.test(p));
    if (!isPrivate) {
      const fullUrl = p === "" ? baseUrl : `${baseUrl}${p}`;
      uniqueUrls.add(fullUrl);
    }
  }

  return Array.from(uniqueUrls);
}

export interface IndexNowSubmissionResult {
  endpoint: string;
  status: number;
  ok: boolean;
  message: string;
  submittedCount: number;
}

export interface IndexNowResponse {
  success: boolean;
  timestamp: string;
  submittedCount: number;
  keyLocation: string;
  results: IndexNowSubmissionResult[];
}

/**
 * Submits a list of public URLs to IndexNow.
 * If no urlList is provided, submits all public indexable Nova Tools URLs.
 */
export async function submitToIndexNow(
  urlsToSubmit?: string[]
): Promise<IndexNowResponse> {
  const allValidUrls = getPublicIndexableUrls();
  const validUrlSet = new Set(allValidUrls);

  let targetUrls: string[];

  if (urlsToSubmit && urlsToSubmit.length > 0) {
    // Validate that submitted URLs are legitimate public URLs on our domain
    targetUrls = urlsToSubmit
      .map((u) => u.trim())
      .filter((u) => {
        if (!u.startsWith(`https://${INDEXNOW_HOST}`)) return false;
        const pathname = u.replace(`https://${INDEXNOW_HOST}`, "") || "/";
        const isPrivate = PRIVATE_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
        return !isPrivate && (validUrlSet.has(u) || pathname.startsWith("/"));
      });
  } else {
    targetUrls = allValidUrls;
  }

  if (targetUrls.length === 0) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      submittedCount: 0,
      keyLocation: INDEXNOW_KEY_LOCATION,
      results: [
        {
          endpoint: "none",
          status: 400,
          ok: false,
          message: "No valid public indexable URLs provided for submission.",
          submittedCount: 0,
        },
      ],
    };
  }

  // IndexNow API accepts batches of up to 10,000 URLs
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: targetUrls,
  };

  const results: IndexNowSubmissionResult[] = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": "NovaTools-IndexNow/1.0",
        },
        body: JSON.stringify(payload),
      });

      // IndexNow returns 200 (OK) or 202 (Accepted) on success
      const ok = response.status === 200 || response.status === 202;
      let message = response.statusText || (ok ? "Submitted successfully" : "Submission failed");

      if (!ok) {
        try {
          const errText = await response.text();
          if (errText) message = `${message}: ${errText}`;
        } catch {
          // ignore
        }
      }

      results.push({
        endpoint,
        status: response.status,
        ok,
        message,
        submittedCount: targetUrls.length,
      });
    } catch (err) {
      results.push({
        endpoint,
        status: 500,
        ok: false,
        message: err instanceof Error ? err.message : "Network error during submission",
        submittedCount: targetUrls.length,
      });
    }
  }

  const anySuccess = results.some((r) => r.ok);

  return {
    success: anySuccess,
    timestamp: new Date().toISOString(),
    submittedCount: targetUrls.length,
    keyLocation: INDEXNOW_KEY_LOCATION,
    results,
  };
}
