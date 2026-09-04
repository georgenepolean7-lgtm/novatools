/**
 * Nova Tools Autonomous SEO Agent - Git & Deployment Integration
 * Manages atomic Git commits, pushes, and production post-deployment verification.
 * Enforces strict Git safety: never force pushes, never rewrites history.
 */

import { exec } from "child_process";
import { promisify } from "util";
import { SEO_AGENT_CONFIG } from "./config";
import { PostDeployCheckResult } from "./types";

const execAsync = promisify(exec);

export class SeoDeploymentEngine {
  private workspaceRoot: string;

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Creates a dedicated atomic Git commit for the autonomous SEO change.
   */
  async createAutonomousCommit(
    changedFile: string,
    actionSummary: string,
    pageSlug: string
  ): Promise<{ success: boolean; commitHash?: string; message: string }> {
    try {
      const commitMessage = `seo(auto): ${actionSummary.slice(0, 60)} [${pageSlug}]`;

      // 1. Stage ONLY the specific SEO file(s) that were validated
      const filesToStage = changedFile
        .split(/\s+/)
        .filter(Boolean)
        .map((f) => `"${f}"`)
        .join(" ");
      await execAsync(`git add ${filesToStage}`, { cwd: this.workspaceRoot });

      // 2. Commit
      const { stdout } = await execAsync(`git commit -m "${commitMessage}"`, {
        cwd: this.workspaceRoot,
      });

      // Extract hash
      const hashMatch = stdout.match(/\[(?:[^\s]+)\s+([a-f0-9]+)\]/i);
      const commitHash = hashMatch ? hashMatch[1] : undefined;

      return {
        success: true,
        commitHash,
        message: commitMessage,
      };
    } catch (err) {
      return {
        success: false,
        message: `Git commit failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Pushes the commit to the main branch.
   * STRICT SAFETY: Standard push only. Never force-pushes.
   */
  async pushToProduction(): Promise<{ success: boolean; message: string }> {
    try {
      // Push current branch to origin
      const { stdout } = await execAsync("git push origin main", {
        cwd: this.workspaceRoot,
      });
      return {
        success: true,
        message: `Pushed successfully: ${stdout.trim().slice(0, 100)}`,
      };
    } catch (err) {
      return {
        success: false,
        message: `Git push failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Verifies production status of the deployed page.
   * Checks HTTP 200, canonical URL, title, and description.
   */
  async verifyProductionPage(pageSlug: string): Promise<PostDeployCheckResult> {
    const targetUrl = `${SEO_AGENT_CONFIG.SITE_URL}/${pageSlug}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(targetUrl, {
        headers: { "User-Agent": "NovaTools-Autonomous-SEO-Verifier/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          url: targetUrl,
          statusCode: res.status,
          canonicalMatches: false,
          titleMatches: false,
          descriptionMatches: false,
          h1Present: false,
          passed: false,
          error: `HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const html = await res.text();
      const expectedCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${pageSlug}`;
      const hasCanonical = html.includes(expectedCanonical);
      const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(html);
      const hasTitle = /<title[^>]*>.*?<\/title>/i.test(html);
      const hasDescription = /<meta[^>]*name=["']description["'][^>]*>/i.test(html);

      const passed = res.status === 200 && hasCanonical && hasTitle;

      return {
        url: targetUrl,
        statusCode: res.status,
        canonicalMatches: hasCanonical,
        titleMatches: hasTitle,
        descriptionMatches: hasDescription,
        h1Present: hasH1,
        passed,
      };
    } catch (err) {
      return {
        url: targetUrl,
        statusCode: 0,
        canonicalMatches: false,
        titleMatches: false,
        descriptionMatches: false,
        h1Present: false,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Reverts the latest Git commit if a production regression is detected.
   */
  async rollbackCommit(): Promise<{ success: boolean; message: string }> {
    try {
      await execAsync("git revert --no-edit HEAD", { cwd: this.workspaceRoot });
      await execAsync("git push origin main", { cwd: this.workspaceRoot });
      return {
        success: true,
        message: "Successfully reverted latest commit and pushed rollback to main.",
      };
    } catch (err) {
      return {
        success: false,
        message: `Rollback failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }
}
