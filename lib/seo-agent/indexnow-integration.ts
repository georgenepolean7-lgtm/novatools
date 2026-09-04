/**
 * Nova Tools Autonomous SEO Agent - IndexNow Integration
 * Reuses existing lib/seo/indexnow.ts to submit ONLY changed public URLs to IndexNow.
 * Explicitly guards against submitting admin, api, or private routes.
 */

import { submitToIndexNow, IndexNowResponse } from "@/lib/seo/indexnow";
import { SEO_AGENT_CONFIG } from "./config";

export class SeoIndexNowIntegration {
  /**
   * Submits a list of modified tool slugs to IndexNow.
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
      const cleanSlug = slug.replace(/^\//, "").trim();

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

    // Submit via existing Nova Tools IndexNow infrastructure
    const response = await submitToIndexNow(urlsToSubmit);

    return {
      submittedUrls: urlsToSubmit,
      indexNowResponse: response,
      success: response.success,
    };
  }
}
