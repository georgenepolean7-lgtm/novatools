/**
 * Nova Tools Autonomous SEO Agent - IndexNow Integration
 * Reuses existing lib/seo/indexnow.ts to submit ONLY changed public URLs to IndexNow.
 * Explicitly guards against submitting admin, api, or private routes.
 * Enforces bounded timeout watchdog around submission to prevent hangs.
 */

import { submitToIndexNow, IndexNowResponse } from "@/lib/seo/indexnow";
import { SEO_AGENT_CONFIG } from "./config";

export class SeoIndexNowIntegration {
  /**
   * Submits a list of modified tool slugs to IndexNow with a bounded timeout watchdog.
   * Resolves them to fully qualified public URLs.
   */
  async submitChangedSlugs(changedSlugs: string[]): Promise<{
    submittedUrls: string[];
    indexNowResponse: IndexNowResponse;
    success: boolean;
  }> {
    if (!changedSlugs || changedSlugs.length === 0) {
      return {
        submittedUrls: [],
        indexNowResponse: {
          success: true,
          timestamp: new Date().toISOString(),
          submittedCount: 0,
          keyLocation: "",
          results: [],
        },
        success: true,
      };
    }

    // Build fully qualified public URLs
    const urlsToSubmit: string[] = [];

    for (const slug of changedSlugs) {
      const cleanSlug = slug.replace(/^\/+/, "").replace(/\/+$/, "").trim();

      // Guard against private or forbidden prefixes
      const isPrivate = ["admin", "api", "auth", "profile", "favorites"].some((prefix) =>
        cleanSlug.startsWith(prefix)
      );

      if (!isPrivate && cleanSlug) {
        const fullUrl = `${SEO_AGENT_CONFIG.SITE_URL}/${cleanSlug}`;
        urlsToSubmit.push(fullUrl);
      }
    }

    if (urlsToSubmit.length === 0) {
      return {
        submittedUrls: [],
        indexNowResponse: {
          success: true,
          timestamp: new Date().toISOString(),
          submittedCount: 0,
          keyLocation: "",
          results: [],
        },
        success: true,
      };
    }

    // Submit via existing Nova Tools IndexNow infrastructure with bounded timeout watchdog
    const timeoutMs = SEO_AGENT_CONFIG.TIMEOUTS?.INDEXNOW_TIMEOUT_MS || 30000;
    let timer: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`TIMEOUT: IndexNow broadcast exceeded ${timeoutMs}ms`)), timeoutMs);
      if (typeof timer.unref === "function") timer.unref();
    });

    try {
      const response = await Promise.race([submitToIndexNow(urlsToSubmit), timeoutPromise]);
      if (timer) clearTimeout(timer);

      return {
        submittedUrls: urlsToSubmit,
        indexNowResponse: response,
        success: response.success,
      };
    } catch (err) {
      if (timer) clearTimeout(timer);
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        submittedUrls: urlsToSubmit,
        indexNowResponse: {
          success: false,
          timestamp: new Date().toISOString(),
          submittedCount: urlsToSubmit.length,
          keyLocation: "",
          results: [
            {
              endpoint: "all",
              status: 408,
              ok: false,
              message: errMsg,
              submittedCount: urlsToSubmit.length,
            },
          ],
        },
        success: false,
      };
    }
  }
}
