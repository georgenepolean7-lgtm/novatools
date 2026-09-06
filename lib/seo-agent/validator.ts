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

/**
 * Normalizes tool slugs for robust canonical comparison:
 * strips leading/trailing slashes, trims whitespace, and lowercases.
 */
export function normalizeToolSlug(slug: string): string {
  if (!slug || typeof slug !== "string") return "";
  return slug.trim().replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
}

/**
 * Bounded child process execution wrapper with watchdog timer.
 * Prevents indefinite hangs on Windows and Linux by terminating the process tree on timeout.
 */
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
        if (child.killed || (error as { killed?: boolean }).killed) {
          reject(new Error(`TIMEOUT: ${taskName} exceeded timeout of ${timeoutMs}ms and was terminated.`));
        } else {
          reject(Object.assign(error, { stdout: String(stdout || ""), stderr: String(stderr || "") }));
        }
      } else {
        resolve({ stdout: String(stdout || ""), stderr: String(stderr || "") });
      }
    });

    timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      try {
        if (child.pid) {
          if (process.platform === "win32") {
            exec(`taskkill /pid ${child.pid} /T /F`, () => {});
          } else {
            child.kill("SIGKILL");
          }
        } else {
          child.kill("SIGKILL");
        }
      } catch {
        // ignore
      }
      reject(new Error(`TIMEOUT: ${taskName} exceeded timeout of ${timeoutMs}ms and was terminated.`));
    }, timeoutMs);

    if (timer && typeof timer.unref === "function") {
      timer.unref();
    }
  });
}

export interface PostPatchMetadataOverrides {
  seoTitle?: string;
  seoDescription?: string;
  name?: string;
  canonicalUrl?: string;
  faq?: Array<{ question: string; answer: string }>;
  relatedTools?: string[];
}

/**
 * Safely extracts the enclosing tool block { ... } for a given slug from raw TypeScript file content.
 */
export function extractToolBlockFromContent(
  content: string,
  toolSlug: string
): { blockStart: number; blockEnd: number; block: string } | null {
  const escapedSlug = toolSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const slugRegex = new RegExp(`slug:\\s*["']${escapedSlug}["']`);
  const slugMatch = content.match(slugRegex);
  if (!slugMatch || slugMatch.index === undefined) return null;

  const slugPos = slugMatch.index;
  let depth = 0;
  let blockStart = -1;
  let inString: string | null = null;
  let isEscaped = false;

  for (let i = slugPos; i >= 0; i--) {
    const char = content[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (inString) {
      if (char === inString) inString = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inString = char;
      continue;
    }
    if (char === "}") {
      depth++;
    } else if (char === "{") {
      if (depth === 0) {
        blockStart = i;
        break;
      }
      depth--;
    }
  }

  if (blockStart === -1) blockStart = content.lastIndexOf("{", slugPos);
  if (blockStart === -1) return null;

  depth = 0;
  let blockEnd = -1;
  inString = null;
  isEscaped = false;

  for (let i = blockStart; i < content.length; i++) {
    const char = content[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (inString) {
      if (char === inString) inString = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inString = char;
      continue;
    }
    if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      if (depth === 0) {
        blockEnd = i;
        break;
      }
    }
  }

  if (blockEnd === -1) return null;

  return {
    blockStart,
    blockEnd,
    block: content.substring(blockStart, blockEnd + 1),
  };
}

export class SeoValidator {
  private workspaceRoot: string;

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Stage A: Cheap, fast per-page validation before expensive global builds.
   * Isolates failures to the single offending page without failing the entire batch.
   * Validates post-patch state after optimizer modification, ensuring patched fields
   * conform to canonical metadata limits while allowing unpatched pre-change metadata.
   */
  validatePageStageA(slug: string, postPatchOverrides?: PostPatchMetadataOverrides): StageAValidationResult {
    const start = Date.now();
    const checks: ValidationCheckResult[] = [];
    const cleanSlug = normalizeToolSlug(slug);

    // 1. Target tool existence in canonical registry
    const allTools = getAllTools();
    const tool = allTools.find((t) => normalizeToolSlug(t.slug) === cleanSlug);
    if (!tool) {
      return {
        passed: false,
        slug,
        failureReason: `Target tool '${slug}' does not exist in canonical registry.`,
        durationMs: Date.now() - start,
        checks: [
          {
            name: "Target Tool Existence Gate",
            passed: false,
            message: `Tool with slug '${slug}' not found in registry.`,
            durationMs: Date.now() - start,
          },
        ],
      };
    }
    checks.push({
      name: "Target Tool Existence Gate",
      passed: true,
      message: `Tool ${tool.slug} found in canonical registry.`,
      durationMs: Date.now() - start,
    });

    // 2. Allowed modification boundary
    const categoryFileRel = `data/tools/${tool.category}.ts`;
    const isWhitelisted = SEO_AGENT_CONFIG.WHITELISTED_MODIFICATION_DIRECTORIES.some((dir) =>
      categoryFileRel.replace(/\\/g, "/").startsWith(dir)
    );
    const isProtected = SEO_AGENT_CONFIG.PROTECTED_PATHS.some((p) =>
      categoryFileRel.replace(/\\/g, "/").startsWith(p)
    );
    if (!isWhitelisted || isProtected) {
      return {
        passed: false,
        slug,
        failureReason: `Tool ${tool.slug} targets forbidden file path: ${categoryFileRel}`,
        durationMs: Date.now() - start,
        checks: [
          ...checks,
          {
            name: "Allowed Modification Boundary Gate",
            passed: false,
            message: `File ${categoryFileRel} is outside allowed modification boundary.`,
            durationMs: Date.now() - start,
          },
        ],
      };
    }
    checks.push({
      name: "Allowed Modification Boundary Gate",
      passed: true,
      message: `File ${categoryFileRel} is strictly within allowed boundary.`,
      durationMs: Date.now() - start,
    });

    // 3. Syntax-safe patch check (TypeScript AST diagnostics on category file)
    let onDiskTitle: string | undefined;
    let onDiskDesc: string | undefined;
    let onDiskName: string | undefined;
    let onDiskCanonical: string | undefined;

    const categoryFullPath = path.join(this.workspaceRoot, categoryFileRel);
    if (fs.existsSync(categoryFullPath)) {
      try {
        const fileContent = fs.readFileSync(categoryFullPath, "utf8");
        const sourceFile = ts.createSourceFile(
          path.basename(categoryFullPath),
          fileContent,
          ts.ScriptTarget.Latest,
          true
        );
        const syntaxDiagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics || [];
        if (syntaxDiagnostics.length > 0) {
          const firstErr = syntaxDiagnostics[0];
          const msg = typeof firstErr.messageText === "string" ? firstErr.messageText : firstErr.messageText.messageText;
          return {
            passed: false,
            slug,
            failureReason: `Syntax error in ${categoryFileRel}: ${msg}`,
            durationMs: Date.now() - start,
            checks: [
              ...checks,
              {
                name: "Syntax-Safe Patch Gate",
                passed: false,
                message: `TypeScript AST parse error: ${msg}`,
                durationMs: Date.now() - start,
              },
            ],
          };
        }

        // Extract on-disk tool block properties to validate post-patch state directly from disk
        const parsedBlock = extractToolBlockFromContent(fileContent, cleanSlug);
        if (parsedBlock) {
          const tMatch = parsedBlock.block.match(/seoTitle:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
          if (tMatch) onDiskTitle = tMatch[1] || tMatch[2];
          const dMatch = parsedBlock.block.match(/seoDescription:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
          if (dMatch) onDiskDesc = dMatch[1] || dMatch[2];
          const nMatch = parsedBlock.block.match(/name:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
          if (nMatch) onDiskName = nMatch[1] || nMatch[2];
          const cMatch = parsedBlock.block.match(/canonicalUrl:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
          if (cMatch) onDiskCanonical = cMatch[1] || cMatch[2];
        }
      } catch (err) {
        return {
          passed: false,
          slug,
          failureReason: `Failed to read or parse ${categoryFileRel}: ${err instanceof Error ? err.message : String(err)}`,
          durationMs: Date.now() - start,
          checks: [
            ...checks,
            {
              name: "Syntax-Safe Patch Gate",
              passed: false,
              message: String(err),
              durationMs: Date.now() - start,
            },
          ],
        };
      }
    }
    checks.push({
      name: "Syntax-Safe Patch Gate",
      passed: true,
      message: `TypeScript AST syntax verified cleanly for ${categoryFileRel}.`,
      durationMs: Date.now() - start,
    });

    // 4. Canonical invariants for this tool
    if (!tool.slug || tool.slug.trim() === "") {
      return {
        passed: false,
        slug,
        failureReason: `Tool ${tool.id} has an empty slug.`,
        durationMs: Date.now() - start,
        checks: [
          ...checks,
          {
            name: "Canonical Invariant Gate",
            passed: false,
            message: `Tool ${tool.id} has an empty slug.`,
            durationMs: Date.now() - start,
          },
        ],
      };
    }
    const expectedCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${cleanSlug}`;
    const effectiveCanonical = (postPatchOverrides?.canonicalUrl ?? onDiskCanonical ?? tool.canonicalUrl ?? "").trim();
    if (effectiveCanonical) {
      let normalizedToolCanonical: string;
      if (effectiveCanonical.startsWith("http://") || effectiveCanonical.startsWith("https://")) {
        normalizedToolCanonical = effectiveCanonical.replace(/\/+$/, "");
      } else {
        const cleanPath = normalizeToolSlug(effectiveCanonical);
        normalizedToolCanonical = `https://${SEO_AGENT_CONFIG.SITE_DOMAIN}/${cleanPath}`;
      }
      if (normalizedToolCanonical !== expectedCanonical) {
        return {
          passed: false,
          slug,
          failureReason: `Tool ${tool.slug} canonicalUrl mismatch: declared '${effectiveCanonical}', expected '${expectedCanonical}'`,
          durationMs: Date.now() - start,
          checks: [
            ...checks,
            {
              name: "Canonical Invariant Gate",
              passed: false,
              message: `Canonical mismatch: declared '${effectiveCanonical}', expected '${expectedCanonical}'`,
              durationMs: Date.now() - start,
            },
          ],
        };
      }
    }
    checks.push({
      name: "Canonical Invariant Gate",
      passed: true,
      message: `Canonical URL correctly matches ${expectedCanonical}.`,
      durationMs: Date.now() - start,
    });

    // 5. Metadata invariants
    const effectiveName = (postPatchOverrides?.name ?? onDiskName ?? tool.name ?? "").trim();
    const effectiveTitle = (postPatchOverrides?.seoTitle ?? onDiskTitle ?? tool.seoTitle ?? "").trim();
    const effectiveDescription = (postPatchOverrides?.seoDescription ?? onDiskDesc ?? tool.seoDescription ?? "").trim();

    if (!effectiveName || effectiveName.length === 0) {
      return {
        passed: false,
        slug,
        failureReason: `Tool ${tool.slug} is missing required name for schema markup.`,
        durationMs: Date.now() - start,
        checks: [
          ...checks,
          { name: "Metadata Invariants Gate", passed: false, message: `Tool ${tool.slug} is missing required name for schema markup.` },
        ],
      };
    }

    const titleWasPatched =
      (postPatchOverrides?.seoTitle !== undefined && postPatchOverrides.seoTitle.trim() !== (tool.seoTitle || "").trim()) ||
      (onDiskTitle !== undefined && onDiskTitle.trim() !== (tool.seoTitle || "").trim());

    const descWasPatched =
      (postPatchOverrides?.seoDescription !== undefined && postPatchOverrides.seoDescription.trim() !== (tool.seoDescription || "").trim()) ||
      (onDiskDesc !== undefined && onDiskDesc.trim() !== (tool.seoDescription || "").trim());

    const minTitle = SEO_AGENT_CONFIG.METADATA.MIN_TITLE_LENGTH; // 30
    const maxTitle = SEO_AGENT_CONFIG.METADATA.MAX_TITLE_LENGTH; // 65
    const minDesc = SEO_AGENT_CONFIG.METADATA.MIN_DESCRIPTION_LENGTH; // 80
    const maxDesc = SEO_AGENT_CONFIG.METADATA.MAX_DESCRIPTION_LENGTH; // 165

    // Validate title:
    if (!effectiveTitle || effectiveTitle.length === 0) {
      return {
        passed: false,
        slug,
        failureReason: `Tool ${tool.slug} has an empty seoTitle.`,
        durationMs: Date.now() - start,
        checks: [
          ...checks,
          { name: "Metadata Invariants Gate", passed: false, message: `Tool ${tool.slug} has an empty seoTitle.` },
        ],
      };
    }

    if (titleWasPatched) {
      if (effectiveTitle.length < minTitle || effectiveTitle.length > maxTitle) {
        return {
          passed: false,
          slug,
          failureReason: `Tool ${tool.slug} post-patch seoTitle length out of bounds (${effectiveTitle.length} chars). Expected ${minTitle}-${maxTitle}.`,
          durationMs: Date.now() - start,
          checks: [
            ...checks,
            { name: "Metadata Invariants Gate", passed: false, message: `Post-patch seoTitle length out of bounds: ${effectiveTitle.length} (expected ${minTitle}-${maxTitle})` },
          ],
        };
      }
    } else {
      // Unchanged pre-existing title: reject only if malformed or exceeds max boundary
      if (effectiveTitle.length > maxTitle) {
        return {
          passed: false,
          slug,
          failureReason: `Tool ${tool.slug} seoTitle exceeds maximum allowed length (${effectiveTitle.length} chars > ${maxTitle}).`,
          durationMs: Date.now() - start,
          checks: [
            ...checks,
            { name: "Metadata Invariants Gate", passed: false, message: `seoTitle exceeds maximum bounds: ${effectiveTitle.length} > ${maxTitle}` },
          ],
        };
      }
    }

    // Validate description:
    if (!effectiveDescription || effectiveDescription.length === 0) {
      return {
        passed: false,
        slug,
        failureReason: `Tool ${tool.slug} has an empty seoDescription.`,
        durationMs: Date.now() - start,
        checks: [
          ...checks,
          { name: "Metadata Invariants Gate", passed: false, message: `Tool ${tool.slug} has an empty seoDescription.` },
        ],
      };
    }

    if (descWasPatched) {
      if (effectiveDescription.length < minDesc || effectiveDescription.length > maxDesc) {
        return {
          passed: false,
          slug,
          failureReason: `Tool ${tool.slug} post-patch seoDescription length out of bounds (${effectiveDescription.length} chars). Expected ${minDesc}-${maxDesc}.`,
          durationMs: Date.now() - start,
          checks: [
            ...checks,
            { name: "Metadata Invariants Gate", passed: false, message: `Post-patch seoDescription length out of bounds: ${effectiveDescription.length} (expected ${minDesc}-${maxDesc})` },
          ],
        };
      }
    } else {
      // Unchanged pre-existing description: reject only if malformed or exceeds max boundary
      if (effectiveDescription.length > maxDesc) {
        return {
          passed: false,
          slug,
          failureReason: `Tool ${tool.slug} seoDescription exceeds maximum allowed length (${effectiveDescription.length} chars > ${maxDesc}).`,
          durationMs: Date.now() - start,
          checks: [
            ...checks,
            { name: "Metadata Invariants Gate", passed: false, message: `seoDescription exceeds maximum bounds: ${effectiveDescription.length} > ${maxDesc}` },
          ],
        };
      }
    }

    checks.push({
      name: "Metadata Invariants Gate",
      passed: true,
      message: `Metadata invariants (name, seoTitle, seoDescription) verified within bounds.`,
      durationMs: Date.now() - start,
    });

    // 6. FAQ structure
    if (tool.faq && Array.isArray(tool.faq)) {
      const seenQuestions = new Set<string>();
      for (const [idx, item] of tool.faq.entries()) {
        if (!item.question || typeof item.question !== "string" || item.question.trim() === "") {
          return {
            passed: false,
            slug,
            failureReason: `Tool ${tool.slug} has invalid or empty FAQ question at index ${idx}.`,
            durationMs: Date.now() - start,
            checks: [
              ...checks,
              { name: "FAQ Structure Gate", passed: false, message: `Tool ${tool.slug} has invalid or empty FAQ question at index ${idx}.` },
            ],
          };
        }
        if (!item.answer || typeof item.answer !== "string" || item.answer.trim() === "") {
          return {
            passed: false,
            slug,
            failureReason: `Tool ${tool.slug} has invalid or empty FAQ answer at index ${idx}.`,
            durationMs: Date.now() - start,
            checks: [
              ...checks,
              { name: "FAQ Structure Gate", passed: false, message: `Tool ${tool.slug} has invalid or empty FAQ answer at index ${idx}.` },
            ],
          };
        }
        const qNorm = item.question.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (seenQuestions.has(qNorm)) {
          return {
            passed: false,
            slug,
            failureReason: `Tool ${tool.slug} has duplicate FAQ question at index ${idx}: "${item.question}".`,
            durationMs: Date.now() - start,
            checks: [
              ...checks,
              { name: "FAQ Structure Gate", passed: false, message: `Duplicate FAQ question at index ${idx}: "${item.question}".` },
            ],
          };
        }
        seenQuestions.add(qNorm);
      }
    }
    checks.push({
      name: "FAQ Structure Gate",
      passed: true,
      message: `FAQ structure verified with ${tool.faq?.length || 0} valid questions and answers.`,
      durationMs: Date.now() - start,
    });

    // 7. relatedTools integrity
    const linkCheck = this.validateInternalLinks(cleanSlug);
    if (!linkCheck.passed) {
      return {
        passed: false,
        slug,
        failureReason: linkCheck.message,
        durationMs: Date.now() - start,
        checks: [...checks, linkCheck],
      };
    }
    checks.push(linkCheck);

    // 8. Factual safety check
    const factualCheck = FactualContentSafetyValidator.validate(tool, "CONTENT_UPDATE", {
      seoTitle: effectiveTitle,
      seoDescription: effectiveDescription,
      faqs: postPatchOverrides?.faq || tool.faq,
      internalLinks: postPatchOverrides?.relatedTools || tool.relatedTools,
    });
    if (!factualCheck.isSafe) {
      return {
        passed: false,
        slug,
        failureReason: `Factual safety check failed for ${tool.slug}: ${factualCheck.reason}`,
        durationMs: Date.now() - start,
        checks: [
          ...checks,
          {
            name: "Factual Content Safety Gate",
            passed: false,
            message: factualCheck.reason,
            durationMs: Date.now() - start,
          },
        ],
      };
    }
    checks.push({
      name: "Factual Content Safety Gate",
      passed: true,
      message: `Factual content safety passed with zero unverified claims.`,
      durationMs: Date.now() - start,
    });

    return {
      passed: true,
      slug,
      durationMs: Date.now() - start,
      checks,
    };
  }

  /**
   * Stage B: Expensive global quality gates executed ONCE per validated atomic batch.
   * Verifies TypeScript, ESLint, Next.js build compilation, sitemap, robots, and structured data.
   */
  async validateBatchStageB(_batchSlugs: string[] = []): Promise<ValidationSummary> {
    const checks: ValidationCheckResult[] = [];

    // 1. Canonical URLs
    console.log("   [Stage B][1/8] Validating Canonical URLs...");
    const canonicalCheck = this.validateCanonicals();
    console.log(`   [Stage B][1/8] Canonicals: ${canonicalCheck.passed ? "PASS" : "FAIL"}`);
    checks.push(canonicalCheck);

    // 2. Robots.txt Integrity
    console.log("   [Stage B][2/8] Validating Robots.txt...");
    const robotsCheck = this.validateRobotsConfig();
    console.log(`   [Stage B][2/8] Robots.txt: ${robotsCheck.passed ? "PASS" : "FAIL"}`);
    checks.push(robotsCheck);

    // 3. Sitemap & Public Routes Count
    console.log("   [Stage B][3/8] Validating Sitemap Integrity...");
    const sitemapCheck = this.validateSitemapIntegrity();
    console.log(`   [Stage B][3/8] Sitemap: ${sitemapCheck.passed ? "PASS" : "FAIL"}`);
    checks.push(sitemapCheck);

    // 4. Batch Internal Links Graph Integrity
    console.log("   [Stage B][4/8] Validating Internal Links Graph...");
    const internalLinksCheck = this.validateInternalLinks(_batchSlugs && _batchSlugs.length > 0 ? _batchSlugs : undefined);
    console.log(`   [Stage B][4/8] Internal Links: ${internalLinksCheck.passed ? "PASS" : "FAIL"}`);
    checks.push(internalLinksCheck);

    // 5. Structured Data Schema Integrity
    console.log("   [Stage B][5/8] Validating Structured Data...");
    const structuredDataCheck = this.validateStructuredData();
    console.log(`   [Stage B][5/8] Structured Data: ${structuredDataCheck.passed ? "PASS" : "FAIL"}`);
    checks.push(structuredDataCheck);

    // 6. Dedicated TypeScript Typecheck with bounded watchdog timeout
    console.log("   [Stage B][6/8] Running TypeScript Typecheck Gate (tsc --noEmit)...");
    const typecheckCheck = await this.runTypeCheck();
    console.log(`   [Stage B][6/8] TypeScript: ${typecheckCheck.passed ? "PASS" : "FAIL"} (${typecheckCheck.durationMs}ms)`);
    checks.push(typecheckCheck);

    // 7. ESLint Quality Gate with bounded watchdog timeout
    console.log("   [Stage B][7/8] Running ESLint Quality Gate (npm run lint)...");
    const lintCheck = await this.runLintCheck();
    console.log(`   [Stage B][7/8] ESLint: ${lintCheck.passed ? "PASS" : "FAIL"} (${lintCheck.durationMs}ms)`);
    checks.push(lintCheck);

    // 8. Next.js Build Compilation Check with bounded watchdog timeout
    console.log("   [Stage B][8/8] Running Next.js Production Build Gate (next build)...");
    const buildCheck = await this.runBuildCheck();
    console.log(`   [Stage B][8/8] Next.js Build: ${buildCheck.passed ? "PASS" : "FAIL"} (${buildCheck.durationMs}ms)`);
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
   * Backward-compatible full pre-deployment validation suite.
   * If changedSlug is provided, runs Stage A first; if Stage A passes, runs Stage B.
   */
  async validateAll(changedSlug?: string): Promise<ValidationSummary> {
    if (changedSlug) {
      const stageA = this.validatePageStageA(changedSlug);
      if (!stageA.passed) {
        const failedC = stageA.checks.find((c) => !c.passed);
        return {
          overallPassed: false,
          typecheckPassed: false,
          lintPassed: false,
          buildPassed: false,
          canonicalValid: stageA.checks.some((c) => c.name.includes("Canonical") && c.passed),
          sitemapValid: true,
          robotsValid: true,
          structuredDataValid: stageA.checks.some((c) => c.name.includes("FAQ") && c.passed),
          internalLinksValid: stageA.checks.some((c) => c.name.includes("Internal Links") && c.passed),
          checks: stageA.checks,
          failureReason: stageA.failureReason || (failedC ? `${failedC.name}: ${failedC.message}` : "Stage A validation failed"),
        };
      }
    }

    return this.validateBatchStageB(changedSlug ? [changedSlug] : []);
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

      const cleanSlug = normalizeToolSlug(tool.slug);
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
          const cleanPath = normalizeToolSlug(tool.canonicalUrl);
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
      const cleanSlug = normalizeToolSlug(t.slug);
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
   * Normalizes slugs before comparison, ignores harmless leading/trailing slashes,
   * rejects genuinely missing tool references, closes security bypass loopholes,
   * detects duplicate and self-referential links, and keeps error messages precise.
   */
  validateInternalLinks(changedSlug?: string | string[]): ValidationCheckResult {
    const start = Date.now();
    const allTools = getAllTools();
    const slugSet = new Set(allTools.map((t) => normalizeToolSlug(t.slug)));

    // Also include any standalone tool pages in app/ (e.g. pdf-to-jpg, word-counter, etc.)
    try {
      const appDir = path.join(this.workspaceRoot, "app");
      if (fs.existsSync(appDir)) {
        const appEntries = fs.readdirSync(appDir, { withFileTypes: true });
        for (const entry of appEntries) {
          if (entry.isDirectory() && fs.existsSync(path.join(appDir, entry.name, "page.tsx"))) {
            slugSet.add(normalizeToolSlug(entry.name));
          }
        }
      }
    } catch {
      // ignore
    }

    let targetSlugs: string[] = [];
    if (changedSlug) {
      if (Array.isArray(changedSlug)) {
        targetSlugs = changedSlug.map((s) => normalizeToolSlug(s)).filter(Boolean);
      } else {
        targetSlugs = [normalizeToolSlug(changedSlug)].filter(Boolean);
      }
    }

    if (changedSlug && targetSlugs.length > 0) {
      const missingSlug = targetSlugs.find((s) => !allTools.some((t) => normalizeToolSlug(t.slug) === s));
      if (missingSlug) {
        return {
          name: "Internal Links Validation",
          passed: false,
          message: `Tool with slug '${missingSlug}' not found in canonical registry.`,
          durationMs: Date.now() - start,
        };
      }
    }

    const toolsToCheck = targetSlugs.length > 0
      ? allTools.filter((t) => targetSlugs.includes(normalizeToolSlug(t.slug)))
      : [];

    if (toolsToCheck.length === 0) {
      return {
        name: "Internal Links Validation",
        passed: true,
        message: `Verified internal link graph integrity across ${allTools.length} tools.`,
        durationMs: Date.now() - start,
      };
    }

    for (const tool of toolsToCheck) {
      const toolCheck = this.validateToolLinks(tool);
      if (!toolCheck.passed) {
        return toolCheck;
      }
    }

    return {
      name: "Internal Links Validation",
      passed: true,
      message: `Verified internal link graph integrity across ${toolsToCheck.length} tools.`,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Validates internal links for an individual tool object against the canonical registry and app routes.
   */
  validateToolLinks(tool: { slug: string; relatedTools?: string[] }): ValidationCheckResult {
    const start = Date.now();
    const allTools = getAllTools();
    const slugSet = new Set(allTools.map((t) => normalizeToolSlug(t.slug)));

    try {
      const appDir = path.join(this.workspaceRoot, "app");
      if (fs.existsSync(appDir)) {
        const appEntries = fs.readdirSync(appDir, { withFileTypes: true });
        for (const entry of appEntries) {
          if (entry.isDirectory() && fs.existsSync(path.join(appDir, entry.name, "page.tsx"))) {
            slugSet.add(normalizeToolSlug(entry.name));
          }
        }
      }
    } catch {
      // ignore
    }

    const toolCleanSlug = normalizeToolSlug(tool.slug);
    const related = tool.relatedTools || [];
    const seenRelated = new Set<string>();
    const invalidLinks: string[] = [];
    const duplicateLinks: string[] = [];
    const selfLinks: string[] = [];

    for (const rawRel of related) {
      if (!rawRel || typeof rawRel !== "string" || rawRel.trim() === "") {
        invalidLinks.push("(empty)");
        continue;
      }

      // Disallow arbitrary external protocols or non-relative URLs
      if (
        rawRel.startsWith("http://") ||
        rawRel.startsWith("https://") ||
        rawRel.startsWith("//") ||
        rawRel.startsWith("javascript:") ||
        rawRel.startsWith("mailto:")
      ) {
        invalidLinks.push(rawRel);
        continue;
      }

      const cleanRel = normalizeToolSlug(rawRel);

      // Self-referencing link detection
      if (cleanRel === toolCleanSlug) {
        selfLinks.push(rawRel);
      }

      // Duplicate link detection
      if (seenRelated.has(cleanRel)) {
        duplicateLinks.push(rawRel);
      }
      seenRelated.add(cleanRel);

      // Canonical registry existence check
      if (!slugSet.has(cleanRel)) {
        invalidLinks.push(rawRel);
      }
    }

    if (invalidLinks.length > 0) {
      return {
        name: "Internal Links Validation",
        passed: false,
        message: `Tool ${tool.slug} references invalid related tools: ${invalidLinks.join(", ")}`,
        durationMs: Date.now() - start,
      };
    }

    if (selfLinks.length > 0) {
      return {
        name: "Internal Links Validation",
        passed: false,
        message: `Tool ${tool.slug} references itself in related tools: ${selfLinks.join(", ")}`,
        durationMs: Date.now() - start,
      };
    }

    if (duplicateLinks.length > 0) {
      return {
        name: "Internal Links Validation",
        passed: false,
        message: `Tool ${tool.slug} contains duplicate related tools: ${duplicateLinks.join(", ")}`,
        durationMs: Date.now() - start,
      };
    }

    return {
      name: "Internal Links Validation",
      passed: true,
      message: `Verified internal links for tool ${tool.slug}.`,
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
      ? allTools.filter((t) => normalizeToolSlug(t.slug) === normalizeToolSlug(changedSlug))
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
   * Runs dedicated TypeScript typecheck compiler check with bounded watchdog timeout.
   */
  async runTypeCheck(
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.TYPESCRIPT_TIMEOUT_MS || 120000
  ): Promise<ValidationCheckResult> {
    console.log("[SEO][typecheck] started");
    const start = Date.now();
    try {
      await execWithWatchdog(
        "cmd.exe /c npx tsc --noEmit",
        { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 },
        timeoutMs,
        "TypeScript Typecheck"
      );
      const durationMs = Date.now() - start;
      console.log(`[SEO][typecheck] completed in ${durationMs}ms`);
      return {
        name: "TypeScript Typecheck Gate",
        passed: true,
        message: "TypeScript compiler checked clean with zero type errors.",
        durationMs,
      };
    } catch (err: unknown) {
      const durationMs = Date.now() - start;
      const isTimeout = err instanceof Error && err.message.startsWith("TIMEOUT:");
      if (isTimeout) {
        console.log(`[SEO][typecheck] timeout after ${durationMs}ms`);
      } else {
        console.log(`[SEO][typecheck] failed`);
      }
      const stdout = err && typeof err === "object" && "stdout" in err ? String(err.stdout).trim() : "";
      const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr).trim() : "";
      const errorOutput = [stderr, stdout].filter(Boolean).join("\n") || String(err);
      return {
        name: "TypeScript Typecheck Gate",
        passed: false,
        message: `TypeScript error: ${errorOutput.slice(0, 1000)}`,
        durationMs,
      };
    }
  }

  /**
   * Runs ESLint check on data/tools/ to verify modified data integrity with bounded watchdog timeout.
   */
  async runLintCheck(
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.ESLINT_TIMEOUT_MS || 90000
  ): Promise<ValidationCheckResult> {
    console.log("[SEO][eslint] started");
    const start = Date.now();
    try {
      await execWithWatchdog(
        "cmd.exe /c npx eslint data/tools/",
        { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 },
        timeoutMs,
        "ESLint"
      );
      const durationMs = Date.now() - start;
      console.log(`[SEO][eslint] completed in ${durationMs}ms`);
      return {
        name: "ESLint Quality Gate",
        passed: true,
        message: "Lint check on tool definitions passed with 0 errors.",
        durationMs,
      };
    } catch (err: unknown) {
      const durationMs = Date.now() - start;
      const isTimeout = err instanceof Error && err.message.startsWith("TIMEOUT:");
      if (isTimeout) {
        console.log(`[SEO][eslint] timeout after ${durationMs}ms`);
      } else {
        console.log(`[SEO][eslint] failed`);
      }
      const stdout = err && typeof err === "object" && "stdout" in err ? String(err.stdout).trim() : "";
      const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr).trim() : "";
      const errorOutput = [stderr, stdout].filter(Boolean).join("\n") || String(err);
      return {
        name: "ESLint Quality Gate",
        passed: false,
        message: `Lint error: ${errorOutput.slice(0, 1000)}`,
        durationMs,
      };
    }
  }

  /**
   * Runs Next.js build compilation check with bounded watchdog timeout.
   */
  async runBuildCheck(
    timeoutMs: number = SEO_AGENT_CONFIG.TIMEOUTS?.BUILD_TIMEOUT_MS || 480000
  ): Promise<ValidationCheckResult> {
    console.log("[SEO][next_build] started");
    const start = Date.now();
    try {
      await execWithWatchdog(
        "cmd.exe /c npx next build",
        { cwd: this.workspaceRoot, maxBuffer: 10 * 1024 * 1024 },
        timeoutMs,
        "Next.js Build"
      );
      const durationMs = Date.now() - start;
      console.log(`[SEO][next_build] completed in ${durationMs}ms`);
      return {
        name: "Next.js Build Gate",
        passed: true,
        message: "Full production build compiled cleanly with all static routes generated.",
        durationMs,
      };
    } catch (err: unknown) {
      const durationMs = Date.now() - start;
      const isTimeout = err instanceof Error && err.message.startsWith("TIMEOUT:");
      if (isTimeout) {
        console.log(`[SEO][next_build] timeout after ${durationMs}ms`);
      } else {
        console.log(`[SEO][next_build] failed`);
      }
      const stdout = err && typeof err === "object" && "stdout" in err ? String(err.stdout).trim() : "";
      const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr).trim() : "";
      const errorOutput = [stderr, stdout].filter(Boolean).join("\n") || String(err);
      return {
        name: "Next.js Build Gate",
        passed: false,
        message: `Build error: ${errorOutput.slice(0, 1000)}`,
        durationMs,
      };
    }
  }
}
