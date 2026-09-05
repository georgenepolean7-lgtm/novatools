/**
 * Nova Tools Autonomous SEO Agent - Git & Deployment Integration
 * Manages atomic Git commits, pushes, and production post-deployment verification.
 * Enforces strict Git safety: never force pushes, never rewrites history.
 * Employs bounded watchdog timeouts on all Git and network operations.
 */

import { SEO_AGENT_CONFIG } from "./config";
import { PostDeployCheckResult } from "./types";
import { execWithWatchdog } from "./validator";

export class SeoDeploymentEngine {
  private workspaceRoot: string;

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Creates a dedicated atomic Git commit for the autonomous SEO change with bounded watchdog timeout.
   */
  async createAutonomousCommit(
    changedFile: string,
    actionSummary: string,
    pageSlug: string,
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.GIT_COMMIT_TIMEOUT_MS || 30000
  ): Promise<{ success: boolean; commitHash?: string; message: string }> {
    console.log("[SEO][git_commit] started");
    const start = Date.now();
    try {
      const commitMessage = `seo(auto): ${actionSummary.slice(0, 60)} [${pageSlug}]`;

      // 1. Stage ONLY the specific SEO file(s) that were validated
      const filesToStage = changedFile
        .split(/\s+/)
        .filter(Boolean)
        .map((f) => `"${f}"`)
        .join(" ");
      await execWithWatchdog(`git add ${filesToStage}`, { cwd: this.workspaceRoot }, timeoutMs, "Git Add");

      // 2. Commit
      const { stdout } = await execWithWatchdog(
        `git commit -m "${commitMessage}"`,
        { cwd: this.workspaceRoot },
        timeoutMs,
        "Git Commit"
      );

      const durationMs = Date.now() - start;
      console.log(`[SEO][git_commit] completed in ${durationMs}ms`);

      // Extract hash
      const hashMatch = stdout.match(/\[(?:[^\s]+)\s+([a-f0-9]+)\]/i);
      const commitHash = hashMatch ? hashMatch[1] : undefined;

      return {
        success: true,
        commitHash,
        message: commitMessage,
      };
    } catch (err) {
      const durationMs = Date.now() - start;
      const isTimeout = err instanceof Error && err.message.startsWith("TIMEOUT:");
      if (isTimeout) {
        console.log(`[SEO][git_commit] timeout after ${durationMs}ms`);
      } else {
        console.log(`[SEO][git_commit] failed`);
      }
      return {
        success: false,
        message: `Git commit failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Pushes the commit to the main branch with bounded watchdog timeout.
   * STRICT SAFETY: Standard push only. Never force-pushes.
   */
  async pushToProduction(
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.GIT_PUSH_TIMEOUT_MS || 60000
  ): Promise<{ success: boolean; message: string }> {
    console.log("[SEO][deployment] started");
    const start = Date.now();
    try {
      // Push current branch to origin
      const { stdout } = await execWithWatchdog(
        "git push origin main",
        { cwd: this.workspaceRoot },
        timeoutMs,
        "Git Push"
      );
      const durationMs = Date.now() - start;
      console.log(`[SEO][deployment] completed in ${durationMs}ms`);
      return {
        success: true,
        message: `Pushed successfully: ${stdout.trim().slice(0, 100)}`,
      };
    } catch (err) {
      const durationMs = Date.now() - start;
      const isTimeout = err instanceof Error && err.message.startsWith("TIMEOUT:");
      if (isTimeout) {
        console.log(`[SEO][deployment] timeout after ${durationMs}ms`);
      } else {
        console.log(`[SEO][deployment] failed`);
      }
      return {
        success: false,
        message: `Git push failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Verifies production status of the deployed page with bounded timeout.
   * Checks HTTP 200, canonical URL, title, and description.
   */
  async verifyProductionPage(
    pageSlug: string,
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.DEPLOY_VERIFY_TIMEOUT_MS || 20000
  ): Promise<PostDeployCheckResult> {
    const targetUrl = `${SEO_AGENT_CONFIG.SITE_URL}/${pageSlug}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
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
   * Reverts the latest Git commit if a production regression is detected with bounded watchdog timeout.
   */
  async rollbackCommit(
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.GIT_PUSH_TIMEOUT_MS || 60000
  ): Promise<{ success: boolean; message: string }> {
    try {
      await execWithWatchdog("git revert --no-edit HEAD", { cwd: this.workspaceRoot }, timeoutMs, "Git Revert");
      await execWithWatchdog("git push origin main", { cwd: this.workspaceRoot }, timeoutMs, "Git Revert Push");
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
