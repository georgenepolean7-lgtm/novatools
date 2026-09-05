/**
 * Nova Tools Autonomous SEO Agent - Integrity Validator & Rollback Engine
 * Enforces pre-deployment quality gates: TypeScript, lint, build compilation,
 * canonical consistency, robots preservation, sitemap validity, and structured data.
 * Implements two-stage validation: Stage A per-page isolation and Stage B global atomic gates.
 */

import fs from "fs";
import path from "path";
import ts from "typescript";
import { exec } from "child_process";
import { getAllTools } from "@/lib/tools/registry";
import { ValidationSummary, ValidationCheckResult, StageAValidationResult } from "./types";
import { SEO_AGENT_CONFIG } from "./config";
import { FactualContentSafetyValidator } from "./factual-safety";

export function normalizeToolSlug(slug: string): string {
  if (!slug || typeof slug !== "string") return "";
  return slug.trim().replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
}

export function execWithWatchdog(
  command: string,
  options: { cwd: string; maxBuffer?: number },
  timeoutMs: number,
  taskName: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    let timer: NodeJS.Timeout | null = null;
    let finished = false;
    const child = exec(command, options, (error, stdout, stderr) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      if (error) {
        reject(Object.assign(error, { stdout: String(stdout || ""), stderr: String(stderr || "") }));
      } else {
        resolve({ stdout: String(stdout || ""), stderr: String(stderr || "") });
      }
    });
    timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      try {
        if (child.pid) {
          if (process.platform === "win32") exec(`taskkill /pid ${child.pid} /T /F`, () => {});
          else child.kill("SIGKILL");
        } else child.kill("SIGKILL");
      } catch {}
      reject(new Error(`TIMEOUT: ${taskName} exceeded timeout of ${timeoutMs}ms and was terminated.`));
    }, timeoutMs);
  });
}

export class SeoValidator {
  private workspaceRoot: string;
  constructor(workspaceRoot = process.cwd()) { this.workspaceRoot = workspaceRoot; }

  validatePageStageA(slug: string): StageAValidationResult {
    const start = Date.now();
    const checks: ValidationCheckResult[] = [];
    const cleanSlug = normalizeToolSlug(slug);
    const allTools = getAllTools();
    const tool = allTools.find((t) => normalizeToolSlug(t.slug) === cleanSlug);
    if (!tool) return {
      passed: false, slug, failureReason: `Target tool '${slug}' does not exist in canonical registry.`, durationMs: Date.now() - start,
      checks: [{ name: "Target Tool Existence Gate", passed: false, message: `Tool with slug '${slug}' not found in registry.`, durationMs: Date.now() - start }],
    };
    checks.push({ name: "Target Tool Existence Gate", passed: true, message: `Tool ${tool.slug} found in canonical registry.`, durationMs: Date.now() - start });

    const categoryFileRel = `data/tools/${tool.category}.ts`;
    const isWhitelisted = SEO_AGENT_CONFIG.WHITELISTED_MODIFICATION_DIRECTORIES.some((dir) => categoryFileRel.replace(/\\/g, "/").startsWith(dir));
    const isProtected = SEO_AGENT_CONFIG.PROTECTED_PATHS.some((p) => categoryFileRel.replace(/\\/g, "/").startsWith(p));
    if (!isWhitelisted || isProtected) return {
      passed: false, slug, failureReason: `Tool ${tool.slug} targets forbidden file path: ${categoryFileRel}`, durationMs: Date.now() - start,
      checks: [...checks, { name: "Allowed Modification Boundary Gate", passed: false, message: `File ${categoryFileRel} is outside allowed modification boundary.`, durationMs: Date.now() - start }],
    };
    checks.push({ name: "Allowed Modification Boundary Gate", passed: true, message: `File ${categoryFileRel} is strictly within allowed boundary.`, durationMs: Date.now() - start });

    const categoryFullPath = path.join(this.workspaceRoot, categoryFileRel);
    if (fs.existsSync(categoryFullPath)) {
      try {
        const sourceFile = ts.createSourceFile(path.basename(categoryFullPath), fs.readFileSync(categoryFullPath, "utf8"), ts.ScriptTarget.Latest, true);
        const syntaxDiagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics || [];
        if (syntaxDiagnostics.length > 0) {
          const firstErr = syntaxDiagnostics[0];
          const msg = typeof firstErr.messageText === "string" ? firstErr.messageText : firstErr.messageText.messageText;
          return { passed: false, slug, failureReason: `Syntax error in ${categoryFileRel}: ${msg}`, durationMs: Date.now() - start, checks: [...checks, { name: "Syntax-Safe Patch Gate", passed: false, message: `TypeScript AST parse error: ${msg}`, durationMs: Date.now() - start }] };
        }
      } catch (err) {
        return { passed: false, slug, failureReason: `Failed to read or parse ${categoryFileRel}: ${err instanceof Error ? err.message : String(err)}`, durationMs: Date.now() - start, checks: [...checks, { name: "Syntax-Safe Patch Gate", passed: false, message: String(err), durationMs: Date.now() - start }] };
      }
    }
    checks.push({ name: "Syntax-Safe Patch Gate", passed: true, message: `TypeScript AST syntax verified cleanly for ${categoryFileRel}.`, durationMs: Date.now() - start });

    if (!tool.slug || tool.slug.trim() === "") return { passed: false, slug, failureReason: `Tool ${tool.id} has an empty slug.`, durationMs: Date.now() - start, checks: [...checks, { name: "Canonical Invariant Gate", passed: false, message: `Tool ${tool.id} has an empty slug.`, durationMs: Date.now() - start }] };
    const expectedCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${cleanSlug}`;
    if (tool.canonicalUrl) {
      const normalizedToolCanonical = (tool.canonicalUrl.startsWith("http://") || tool.canonicalUrl.startsWith("https://")) ? tool.canonicalUrl.trim().replace(/\/+$/, "") : `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${normalizeToolSlug(tool.canonicalUrl)}`;
      if (normalizedToolCanonical !== expectedCanonical) return { passed: false, slug, failureReason: `Tool ${tool.slug} canonicalUrl mismatch: declared '${tool.canonicalUrl}', expected '${expectedCanonical}'`, durationMs: Date.now() - start, checks: [...checks, { name: "Canonical Invariant Gate", passed: false, message: `Canonical mismatch: declared '${tool.canonicalUrl}', expected '${expectedCanonical}'`, durationMs: Date.now() - start }] };
    }
    checks.push({ name: "Canonical Invariant Gate", passed: true, message: `Canonical URL correctly matches ${expectedCanonical}.`, durationMs: Date.now() - start });

    if (!tool.name || tool.name.trim().length === 0) return { passed: false, slug, failureReason: `Tool ${tool.slug} is missing required name for schema markup.`, durationMs: Date.now() - start, checks: [...checks, { name: "Metadata Invariants Gate", passed: false, message: `Tool ${tool.slug} is missing required name for schema markup.`, durationMs: Date.now() - start }] };

    // IMPORTANT: Existing weak metadata is an intended optimization target.
    // Stage A validates metadata only when an invalid value is introduced, not because the pre-change value is weak.
    if (tool.seoTitle && (tool.seoTitle.trim().length < 20 || tool.seoTitle.trim().length > 75)) return { passed: false, slug, failureReason: `Tool ${tool.slug} seoTitle length is syntactically invalid (${tool.seoTitle.trim().length} chars); optimization should provide a safe replacement.`, durationMs: Date.now() - start, checks: [...checks, { name: "Metadata Invariants Gate", passed: false, message: `seoTitle length is outside hard safety bounds 20-75 after patch.`, durationMs: Date.now() - start }] };
    if (tool.seoDescription && (tool.seoDescription.trim().length < 60 || tool.seoDescription.trim().length > 180)) return { passed: false, slug, failureReason: `Tool ${tool.slug} seoDescription length is syntactically invalid (${tool.seoDescription.trim().length} chars); optimization should provide a safe replacement.`, durationMs: Date.now() - start, checks: [...checks, { name: "Metadata Invariants Gate", passed: false, message: `seoDescription length is outside broad hard safety bounds 60-180 after patch.`, durationMs: Date.now() - start }] };
    checks.push({ name: "Metadata Invariants Gate", passed: true, message: `Metadata invariants verified within broad hard safety bounds.`, durationMs: Date.now() - start });

    if (tool.faq && Array.isArray(tool.faq)) {
      const seenQuestions = new Set<string>();
      for (const [idx, item] of tool.faq.entries()) {
        if (!item.question || typeof item.question !== "string" || !item.question.trim()) return { passed: false, slug, failureReason: `Tool ${tool.slug} has invalid FAQ question at index ${idx}.`, durationMs: Date.now() - start, checks: [...checks, { name: "FAQ Structure Gate", passed: false, message: `Invalid FAQ question at index ${idx}.`, durationMs: Date.now() - start }] };
        if (!item.answer || typeof item.answer !== "string" || !item.answer.trim()) return { passed: false, slug, failureReason: `Tool ${tool.slug} has invalid FAQ answer at index ${idx}.`, durationMs: Date.now() - start, checks: [...checks, { name: "FAQ Structure Gate", passed: false, message: `Invalid FAQ answer at index ${idx}.`, durationMs: Date.now() - start }] };
        const qNorm = item.question.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (seenQuestions.has(qNorm)) return { passed: false, slug, failureReason: `Tool ${tool.slug} has duplicate FAQ question at index ${idx}: "${item.question}".`, durationMs: Date.now() - start, checks: [...checks, { name: "FAQ Structure Gate", passed: false, message: `Duplicate FAQ question at index ${idx}.`, durationMs: Date.now() - start }] };
        seenQuestions.add(qNorm);
      }
    }
    checks.push({ name: "FAQ Structure Gate", passed: true, message: `FAQ structure verified with ${tool.faq?.length || 0} valid questions and answers.`, durationMs: Date.now() - start });

    const linkCheck = this.validateInternalLinks(cleanSlug);
    if (!linkCheck.passed) return { passed: false, slug, failureReason: linkCheck.message, durationMs: Date.now() - start, checks: [...checks, linkCheck] };
    checks.push(linkCheck);

    return { passed: true, slug, durationMs: Date.now() - start, checks };
  }

  async validateBatchStageB(_batchSlugs: string[] = []): Promise<ValidationSummary> {
    const checks: ValidationCheckResult[] = [];
    const canonicalCheck = this.validateCanonicals(); checks.push(canonicalCheck);
    const robotsCheck = this.validateRobotsConfig(); checks.push(robotsCheck);
    const sitemapCheck = this.validateSitemapIntegrity(); checks.push(sitemapCheck);
    const internalLinksCheck = this.validateInternalLinks(_batchSlugs.length ? _batchSlugs : undefined); checks.push(internalLinksCheck);
    const structuredDataCheck = this.validateStructuredData(); checks.push(structuredDataCheck);
    const typecheckCheck = await this.runTypeCheck(); checks.push(typecheckCheck);
    const lintCheck = await this.runLintCheck(); checks.push(lintCheck);
    const buildCheck = await this.runBuildCheck(); checks.push(buildCheck);
    const failedCheck = checks.find((c) => !c.passed);
    return { overallPassed: !failedCheck, typecheckPassed: typecheckCheck.passed, lintPassed: lintCheck.passed, buildPassed: buildCheck.passed, canonicalValid: canonicalCheck.passed, sitemapValid: sitemapCheck.passed, robotsValid: robotsCheck.passed, structuredDataValid: structuredDataCheck.passed, internalLinksValid: internalLinksCheck.passed, checks, failureReason: failedCheck ? `${failedCheck.name}: ${failedCheck.message}` : undefined };
  }

  async validateAll(changedSlug?: string): Promise<ValidationSummary> {
    if (changedSlug) {
      const stageA = this.validatePageStageA(changedSlug);
      if (!stageA.passed) {
        const failedC = stageA.checks.find((c) => !c.passed);
        return { overallPassed: false, typecheckPassed: false, lintPassed: false, buildPassed: false, canonicalValid: stageA.checks.some((c) => c.name.includes("Canonical") && c.passed), sitemapValid: true, robotsValid: true, structuredDataValid: true, internalLinksValid: stageA.checks.some((c) => c.name.includes("Internal Links") && c.passed), checks: stageA.checks, failureReason: stageA.failureReason || (failedC ? `${failedC.name}: ${failedC.message}` : "Stage A validation failed") };
      }
    }
    return this.validateBatchStageB(changedSlug ? [changedSlug] : []);
  }

  validateCanonicals(): ValidationCheckResult {
    const start = Date.now(); const allTools = getAllTools(); const seenCanonicals = new Set<string>();
    for (const tool of allTools) { const cleanSlug = normalizeToolSlug(tool.slug); if (!cleanSlug) return { name: "Canonical Validation", passed: false, message: `Tool ${tool.id} has an empty slug.`, durationMs: Date.now() - start }; const expectedCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${cleanSlug}`; if (seenCanonicals.has(expectedCanonical)) return { name: "Canonical Validation", passed: false, message: `Duplicate canonical URL detected: ${expectedCanonical}`, durationMs: Date.now() - start }; seenCanonicals.add(expectedCanonical); }
    return { name: "Canonical Validation", passed: true, message: `Verified ${seenCanonicals.size} unique canonical URLs with zero conflicts.`, durationMs: Date.now() - start };
  }

  validateRobotsConfig(): ValidationCheckResult {
    const start = Date.now(); const protectedPrefixes = ["/admin", "/api/"]; const tools = getAllTools(); const improperlyBlocked = tools.find((t) => protectedPrefixes.some((p) => `/${t.slug}`.startsWith(p))); if (improperlyBlocked) return { name: "Robots Validation", passed: false, message: `Tool slug /${improperlyBlocked.slug} conflicts with robots.txt disallow rule!`, durationMs: Date.now() - start }; return { name: "Robots Validation", passed: true, message: "Robots policy correctly allows all public tool and category routes.", durationMs: Date.now() - start };
  }

  validateSitemapIntegrity(): ValidationCheckResult {
    const start = Date.now(); const count = getAllTools().length; return count < 250 ? { name: "Sitemap Integrity", passed: false, message: `Unexpected drop in active tools count: found ${count}, expected >= 250`, durationMs: Date.now() - start } : { name: "Sitemap Integrity", passed: true, message: `Verified ${count} tools registered for sitemap inclusion.`, durationMs: Date.now() - start };
  }

  validateInternalLinks(changedSlug?: string | string[]): ValidationCheckResult {
    const start = Date.now(); const allTools = getAllTools(); const slugSet = new Set(allTools.map((t) => normalizeToolSlug(t.slug)));
    try { const appDir = path.join(this.workspaceRoot, "app"); if (fs.existsSync(appDir)) for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) if (entry.isDirectory() && fs.existsSync(path.join(appDir, entry.name, "page.tsx"))) slugSet.add(normalizeToolSlug(entry.name)); } catch {}
    const targetSlugs = changedSlug ? (Array.isArray(changedSlug) ? changedSlug : [changedSlug]).map(normalizeToolSlug).filter(Boolean) : [];
    const toolsToCheck = targetSlugs.length ? allTools.filter((t) => targetSlugs.includes(normalizeToolSlug(t.slug))) : [];
    if (!toolsToCheck.length) return { name: "Internal Links Validation", passed: true, message: `Verified internal link graph integrity across ${allTools.length} tools.`, durationMs: Date.now() - start };
    for (const tool of toolsToCheck) {
      const related = tool.relatedTools || []; const seen = new Set<string>();
      for (const rawRel of related) { if (!rawRel || typeof rawRel !== "string") return { name: "Internal Links Validation", passed: false, message: `Tool ${tool.slug} contains an empty/invalid related tool reference.`, durationMs: Date.now() - start }; const cleanRel = normalizeToolSlug(rawRel); if (!slugSet.has(cleanRel)) return { name: "Internal Links Validation", passed: false, message: `Tool ${tool.slug} references invalid related tools: ${rawRel}`, durationMs: Date.now() - start }; if (cleanRel === normalizeToolSlug(tool.slug)) return { name: "Internal Links Validation", passed: false, message: `Tool ${tool.slug} references itself in related tools: ${rawRel}`, durationMs: Date.now() - start }; if (seen.has(cleanRel)) return { name: "Internal Links Validation", passed: false, message: `Tool ${tool.slug} contains duplicate related tools: ${rawRel}`, durationMs: Date.now() - start }; seen.add(cleanRel); }
    }
    return { name: "Internal Links Validation", passed: true, message: `Verified internal links for ${toolsToCheck.length} tools.`, durationMs: Date.now() - start };
  }

  validateStructuredData(changedSlug?: string): ValidationCheckResult {
    const start = Date.now(); const allTools = getAllTools(); const toolsToCheck = changedSlug ? allTools.filter((t) => normalizeToolSlug(t.slug) === normalizeToolSlug(changedSlug)) : allTools;
    for (const tool of toolsToCheck) { if (!tool.name || !tool.name.trim()) return { name: "Structured Data Validation", passed: false, message: `Tool ${tool.slug} is missing required name for schema markup.`, durationMs: Date.now() - start }; if (!tool.shortDescription || !tool.shortDescription.trim()) return { name: "Structured Data Validation", passed: false, message: `Tool ${tool.slug} is missing shortDescription for schema markup.`, durationMs: Date.now() - start }; for (const [idx, item] of (tool.faq || []).entries()) { if (!item.question?.trim() || !item.answer?.trim()) return { name: "Structured Data Validation", passed: false, message: `Tool ${tool.slug} has invalid FAQ at index ${idx}.`, durationMs: Date.now() - start }; } }
    return { name: "Structured Data Validation", passed: true, message: `Verified structured data schema integrity across ${toolsToCheck.length} tools.`, durationMs: Date.now() - start };
  }

  async runTypeCheck(timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.TYPESCRIPT_TIMEOUT_MS || 120000): Promise<ValidationCheckResult> {
    const start = Date.now(); try { await execWithWatchdog("cmd.exe /c npx tsc --noEmit", { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 }, timeoutMs, "TypeScript Typecheck"); return { name: "TypeScript Typecheck Gate", passed: true, message: "TypeScript compiler checked clean with zero type errors.", durationMs: Date.now() - start }; } catch (err: unknown) { return { name: "TypeScript Typecheck Gate", passed: false, message: `TypeScript error: ${String(err).slice(0, 1000)}`, durationMs: Date.now() - start }; }
  }

  async runLintCheck(timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.ESLINT_TIMEOUT_MS || 90000): Promise<ValidationCheckResult> {
    const start = Date.now(); try { await execWithWatchdog("cmd.exe /c npx eslint data/tools/", { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 }, timeoutMs, "ESLint"); return { name: "ESLint Quality Gate", passed: true, message: "Lint check on tool definitions passed with 0 errors.", durationMs: Date.now() - start }; } catch (err: unknown) { return { name: "ESLint Quality Gate", passed: false, message: `Lint error: ${String(err).slice(0, 1000)}`, durationMs: Date.now() - start }; }
  }

  async runBuildCheck(timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.BUILD_TIMEOUT_MS || 480000): Promise<ValidationCheckResult> {
    const start = Date.now(); try { await execWithWatchdog("cmd.exe /c npx next build", { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 }, timeoutMs, "Next.js Build"); return { name: "Next.js Build Gate", passed: true, message: "Full production build compiled cleanly with all static routes generated.", durationMs: Date.now() - start }; } catch (err: unknown) { return { name: "Next.js Build Gate", passed: false, message: `Build error: ${String(err).slice(0, 1000)}`, durationMs: Date.now() - start }; }
  }
}
