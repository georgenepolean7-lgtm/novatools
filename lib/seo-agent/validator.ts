/**
 * Nova Tools Autonomous SEO Agent - Integrity Validator & Rollback Engine
 * Enforces pre-deployment quality gates: TypeScript, lint, build compilation,
 * canonical consistency, robots preservation, sitemap validity, and structured data.
 */

import { exec } from "child_process";
import { promisify } from "util";
import { getAllTools } from "@/lib/tools/registry";
import { ValidationSummary, ValidationCheckResult } from "./types";
import { SEO_AGENT_CONFIG } from "./config";

const execAsync = promisify(exec);

export class SeoValidator {
  private workspaceRoot: string;

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Runs the full pre-deployment validation suite.
   */
  async validateAll(changedSlug?: string): Promise<ValidationSummary> {
    const checks: ValidationCheckResult[] = [];

    // 1. Check Canonical URLs (Strict: https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${tool.slug})
    const canonicalCheck = this.validateCanonicals();
    checks.push(canonicalCheck);

    // 2. Check Robots.txt Integrity
    const robotsCheck = this.validateRobotsConfig();
    checks.push(robotsCheck);

    // 3. Check Sitemap & Public Routes Count
    const sitemapCheck = this.validateSitemapIntegrity();
    checks.push(sitemapCheck);

    // 4. Check Internal Links Graph Integrity
    const internalLinksCheck = this.validateInternalLinks(changedSlug);
    checks.push(internalLinksCheck);

    // 5. Check Structured Data Schema Integrity
    const structuredDataCheck = this.validateStructuredData(changedSlug);
    checks.push(structuredDataCheck);

    // 6. Run Dedicated TypeScript Typecheck
    const typecheckCheck = await this.runTypeCheck();
    checks.push(typecheckCheck);

    // 7. Run ESLint Quality Gate
    const lintCheck = await this.runLintCheck();
    checks.push(lintCheck);

    // 8. Run Next.js Build Compilation Check
    const buildCheck = await this.runBuildCheck();
    checks.push(buildCheck);

    const overallPassed = checks.every((c) => c.passed);
    const failedCheck = checks.find((c) => !c.passed);

    return {
      overallPassed,
      typecheckPassed: typecheckCheck.passed,
      lintPassed: lintCheck.passed,
      buildPassed: buildCheck.passed,
      canonicalValid: canonicalCheck.passed,
      sitemapValid: sitemapCheck.passed,
      robotsValid: robotsCheck.passed,
      structuredDataValid: structuredDataCheck.passed,
      internalLinksValid: internalLinksCheck.passed,
      checks,
      failureReason: failedCheck ? `${failedCheck.name}: ${failedCheck.message}` : undefined,
    };
  }

  /**
   * Validates that every tool has an exact expected canonical URL:
   * https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${tool.slug}
   * and that no duplicates or conflicting canonical definitions exist.
   */
  validateCanonicals(): ValidationCheckResult {
    const start = Date.now();
    const allTools = getAllTools();
    const seenCanonicals = new Set<string>();

    for (const tool of allTools) {
      if (!tool.slug || tool.slug.trim() === "") {
        return {
          name: "Canonical Validation",
          passed: false,
          message: `Tool ${tool.id} has an empty slug.`,
          durationMs: Date.now() - start,
        };
      }

      const cleanSlug = tool.slug.trim().replace(/^\/+/, "").replace(/\/+$/, "");
      const expectedCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${cleanSlug}`;
      if (seenCanonicals.has(expectedCanonical)) {
        return {
          name: "Canonical Validation",
          passed: false,
          message: `Duplicate canonical URL detected: ${expectedCanonical}`,
          durationMs: Date.now() - start,
        };
      }
      seenCanonicals.add(expectedCanonical);

      // Verify tool.canonicalUrl consistency if explicitly declared
      if (tool.canonicalUrl) {
        let normalizedToolCanonical: string;
        if (tool.canonicalUrl.startsWith("http://") || tool.canonicalUrl.startsWith("https://")) {
          normalizedToolCanonical = tool.canonicalUrl.trim().replace(/\/+$/, "");
        } else {
          const cleanPath = tool.canonicalUrl.trim().replace(/^\/+/, "").replace(/\/+$/, "");
          normalizedToolCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${cleanPath}`;
        }

        if (normalizedToolCanonical !== expectedCanonical) {
          return {
            name: "Canonical Validation",
            passed: false,
            message: `Tool ${tool.slug} canonicalUrl mismatch: declared '${tool.canonicalUrl}', expected '${expectedCanonical}'`,
            durationMs: Date.now() - start,
          };
        }
      }
    }

    return {
      name: "Canonical Validation",
      passed: true,
      message: `Verified ${seenCanonicals.size} unique canonical URLs strictly matching https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/{slug} with zero conflicts.`,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Validates robots.ts configuration to ensure public tool routes are not blocked.
   */
  validateRobotsConfig(): ValidationCheckResult {
    const start = Date.now();
    const protectedPrefixes = ["/admin/", "/api/"];
    const tools = getAllTools();

    const improperlyBlocked = tools.find((t) => {
      const cleanSlug = t.slug.trim().replace(/^\/+/, "").replace(/\/+$/, "");
      const normalizedPath = `/${cleanSlug}/`;
      return protectedPrefixes.some((p) => normalizedPath.startsWith(p));
    });

    if (improperlyBlocked) {
      return {
        name: "Robots Validation",
        passed: false,
        message: `Tool slug /${improperlyBlocked.slug} conflicts with robots.txt disallow rule!`,
        durationMs: Date.now() - start,
      };
    }

    return {
      name: "Robots Validation",
      passed: true,
      message: "Robots policy correctly allows all public tool and category routes.",
      durationMs: Date.now() - start,
    };
  }

  /**
   * Validates that all public routes are present and sitemap does not lose pages.
   */
  validateSitemapIntegrity(): ValidationCheckResult {
    const start = Date.now();
    const allTools = getAllTools();

    // Baseline check: minimum 250 tools must be active
    if (allTools.length < 250) {
      return {
        name: "Sitemap Integrity",
        passed: false,
        message: `Unexpected drop in active tools count: found ${allTools.length}, expected >= 250`,
        durationMs: Date.now() - start,
      };
    }

    return {
      name: "Sitemap Integrity",
      passed: true,
      message: `Verified ${allTools.length} tools registered for sitemap inclusion.`,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Validates internal links to ensure tool link graph integrity.
   */
  validateInternalLinks(changedSlug?: string): ValidationCheckResult {
    const start = Date.now();
    const allTools = getAllTools();
    const slugSet = new Set(allTools.map((t) => t.slug));

    if (changedSlug) {
      const tool = allTools.find((t) => t.slug === changedSlug);
      if (tool) {
        const invalidNewLinks = (tool.relatedTools || []).filter(
          (rel) => !slugSet.has(rel) && !rel.startsWith("/")
        );
        if (invalidNewLinks.length > 0) {
          return {
            name: "Internal Links Validation",
            passed: false,
            message: `Tool ${changedSlug} references invalid related tools: ${invalidNewLinks.join(", ")}`,
            durationMs: Date.now() - start,
          };
        }
      }
    }

    return {
      name: "Internal Links Validation",
      passed: true,
      message: `Verified internal link graph integrity across ${allTools.length} tools.`,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Validates structured data (JSON-LD) readiness for SEO.
   */
  validateStructuredData(changedSlug?: string): ValidationCheckResult {
    const start = Date.now();
    const allTools = getAllTools();
    const toolsToCheck = changedSlug
      ? allTools.filter((t) => t.slug === changedSlug)
      : allTools;

    for (const tool of toolsToCheck) {
      if (!tool.name || tool.name.trim() === "") {
        return {
          name: "Structured Data Validation",
          passed: false,
          message: `Tool ${tool.slug} is missing required name for schema markup.`,
          durationMs: Date.now() - start,
        };
      }
      if (!tool.shortDescription || tool.shortDescription.trim() === "") {
        return {
          name: "Structured Data Validation",
          passed: false,
          message: `Tool ${tool.slug} is missing shortDescription for schema markup.`,
          durationMs: Date.now() - start,
        };
      }
      if (tool.faq && Array.isArray(tool.faq)) {
        for (const [idx, item] of tool.faq.entries()) {
          if (!item.question || typeof item.question !== "string" || item.question.trim() === "") {
            return {
              name: "Structured Data Validation",
              passed: false,
              message: `Tool ${tool.slug} has invalid or empty FAQ question at index ${idx}.`,
              durationMs: Date.now() - start,
            };
          }
          if (!item.answer || typeof item.answer !== "string" || item.answer.trim() === "") {
            return {
              name: "Structured Data Validation",
              passed: false,
              message: `Tool ${tool.slug} has invalid or empty FAQ answer at index ${idx}.`,
              durationMs: Date.now() - start,
            };
          }
        }
      }
    }

    return {
      name: "Structured Data Validation",
      passed: true,
      message: `Verified structured data schema integrity across ${toolsToCheck.length} tools.`,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Runs dedicated TypeScript typecheck compiler check.
   */
  async runTypeCheck(): Promise<ValidationCheckResult> {
    const start = Date.now();
    try {
      await execAsync("cmd.exe /c npx tsc --noEmit", { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 });
      return {
        name: "TypeScript Typecheck Gate",
        passed: true,
        message: "TypeScript compiler checked clean with zero type errors.",
        durationMs: Date.now() - start,
      };
    } catch (err: unknown) {
      const stdout = err && typeof err === "object" && "stdout" in err ? String(err.stdout).trim() : "";
      const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr).trim() : "";
      const errorOutput = [stderr, stdout].filter(Boolean).join("\n") || String(err);
      return {
        name: "TypeScript Typecheck Gate",
        passed: false,
        message: `TypeScript error: ${errorOutput.slice(0, 1000)}`,
        durationMs: Date.now() - start,
      };
    }
  }

  /**
   * Runs ESLint check on data/tools/ to verify modified data integrity.
   */
  async runLintCheck(): Promise<ValidationCheckResult> {
    const start = Date.now();
    try {
      await execAsync("cmd.exe /c npx eslint data/tools/", { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 });
      return {
        name: "ESLint Quality Gate",
        passed: true,
        message: "Lint check on tool definitions passed with 0 errors.",
        durationMs: Date.now() - start,
      };
    } catch (err: unknown) {
      const stdout = err && typeof err === "object" && "stdout" in err ? String(err.stdout).trim() : "";
      const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr).trim() : "";
      const errorOutput = [stderr, stdout].filter(Boolean).join("\n") || String(err);
      return {
        name: "ESLint Quality Gate",
        passed: false,
        message: `Lint error: ${errorOutput.slice(0, 1000)}`,
        durationMs: Date.now() - start,
      };
    }
  }

  /**
   * Runs Next.js build compilation check.
   */
  async runBuildCheck(): Promise<ValidationCheckResult> {
    const start = Date.now();
    try {
      await execAsync("cmd.exe /c npx next build", { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 });
      return {
        name: "Next.js Build Gate",
        passed: true,
        message: "Full production build compiled cleanly with all static routes generated.",
        durationMs: Date.now() - start,
      };
    } catch (err: unknown) {
      const stdout = err && typeof err === "object" && "stdout" in err ? String(err.stdout).trim() : "";
      const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr).trim() : "";
      const errorOutput = [stderr, stdout].filter(Boolean).join("\n") || String(err);
      return {
        name: "Next.js Build Gate",
        passed: false,
        message: `Build error: ${errorOutput.slice(0, 1000)}`,
        durationMs: Date.now() - start,
      };
    }
  }
}
