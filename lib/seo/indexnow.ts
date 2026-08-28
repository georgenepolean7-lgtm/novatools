import { getAllTools } from "@/lib/tools/registry";
import { getAllCategories } from "@/lib/tools/categories";
import { programmaticPages } from "@/lib/seo/programmaticPages";

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "e3d23f7bb6e24db492c3a59336d39ab7";
export const INDEXNOW_HOST = "novatool.in";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

const PRIVATE_PATH_PREFIXES = [
  "/auth",
  "/admin",
  "/api",
  "/favorites",
  "/profile",
  "/reset-password",
  "/_not-found",
];

/**
 * Returns all legitimate, public, indexable URLs for Nova Tools.
 * Strictly filters out any private, admin, auth, API, or user-specific routes.
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

  // 2. All 250+ registry tools
  const toolPaths = getAllTools().map((t) => `/${t.slug}`);

  // 3. Category hub pages
  const categoryPaths = getAllCategories().map((c) => `/categories/${c.id}`);

  // 4. Programmatic landing pages
  const progPaths = Object.values(programmaticPages)
    .flat()
    .map((p) => `/tools/${p.slug}`);

  const allPaths = [...staticPaths, ...toolPaths, ...categoryPaths, ...progPaths];

  // Deduplicate and filter out any accidental private routes
  const cleanUrls = new Set<string>();

  for (const p of allPaths) {
    const isPrivate = PRIVATE_PATH_PREFIXES.some((prefix) =>
      p.toLowerCase().startsWith(prefix)
    );
    if (!isPrivate) {
      const fullUrl = p === "" ? baseUrl : `${baseUrl}${p.startsWith("/") ? "" : "/"}${p}`;
      cleanUrls.add(fullUrl);
    }
  }

  return Array.from(cleanUrls);
}

export interface IndexNowSubmitResult {
  success: boolean;
  submittedCount: number;
  keyLocation: string;
  host: string;
  timestamp: string;
  responses: Array<{
    endpoint: string;
    status: number;
    statusText: string;
    body?: string;
  }>;
  errors?: string[];
}

/**
 * Submits an array of public URLs to IndexNow endpoints (Bing, IndexNow hub).
 * If no URLs are provided, submits the entire legitimate public URL catalog.
 */
export async function submitToIndexNow(
  customUrls?: string[]
): Promise<IndexNowSubmitResult> {
  // Filter URLs to ensure ONLY legitimate public URLs belonging to novatool.in are submitted
  let targetUrls = customUrls && customUrls.length > 0 ? customUrls : getPublicIndexableUrls();

  targetUrls = targetUrls.filter((u) => {
    try {
      const parsed = new URL(u);
      if (parsed.hostname !== INDEXNOW_HOST && parsed.hostname !== `www.${INDEXNOW_HOST}`) {
        return false;
      }
      const pathname = parsed.pathname;
      const isPrivate = PRIVATE_PATH_PREFIXES.some((prefix) =>
        pathname.toLowerCase().startsWith(prefix)
      );
      return !isPrivate;
    } catch {
      return false;
    }
  });

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: targetUrls,
  };

  const results: Array<{
    endpoint: string;
    status: number;
    statusText: string;
    body?: string;
  }> = [];

  const errors: string[] = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": "NovaTools-IndexNow-Client/1.0",
        },
        body: JSON.stringify(payload),
      });

      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {
        // empty body is expected for 200/202
      }

      results.push({
        endpoint,
        status: res.status,
        statusText: res.statusText,
        body: bodyText ? bodyText.slice(0, 300) : undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Error calling ${endpoint}: ${msg}`);
      results.push({
        endpoint,
        status: 0,
        statusText: "Network Error",
        body: msg,
      });
    }
  }

  // Success if at least one endpoint returned 200 or 202
  const isSuccess = results.some((r) => r.status === 200 || r.status === 202);

  return {
    success: isSuccess,
    submittedCount: targetUrls.length,
    keyLocation: INDEXNOW_KEY_LOCATION,
    host: INDEXNOW_HOST,
    timestamp: new Date().toISOString(),
    responses: results,
    errors: errors.length > 0 ? errors : undefined,
  };
}
