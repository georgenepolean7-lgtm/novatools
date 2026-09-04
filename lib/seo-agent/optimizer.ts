/**
 * Nova Tools Autonomous SEO Agent - Safe Code Optimizer
 * Safely applies low-risk SEO modifications (metadata, FAQ, guides, internal links)
 * to data/tools/ files while strictly isolating security, auth, and billing boundaries.
 */

import fs from "fs";
import path from "path";
import ts from "typescript";
import { getAllTools, getToolBySlug } from "@/lib/tools/registry";
import { SEO_AGENT_CONFIG } from "./config";
import { SeoOptimizationProposal, SeoOpportunity } from "./types";
import { SemanticOptimizationResult, normalizeFaqQuestion } from "./hermes-qwen-client";

export interface OptimizationApplicationResult {
  success: boolean;
  targetFile: string;
  previousContent: string;
  newContent: string;
  proposal: SeoOptimizationProposal;
  errorMessage?: string;
}

export class SeoOptimizer {
  private workspaceRoot: string;

  constructor(workspaceRoot = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Finds the exact start and end indices of an array property within a block,
   * properly accounting for nested brackets, strings, and escaped characters.
   */
  private findArrayBounds(
    block: string,
    propertyName: string
  ): { arrayStart: number; arrayEnd: number; innerContent: string } | null {
    const propRegex = new RegExp(`(?:^|[\\s,{])${propertyName}\\s*:\\s*\\[`);
    const match = block.match(propRegex);
    if (!match || match.index === undefined) return null;

    const bracketOpenPos = match.index + match[0].lastIndexOf("[");
    let depth = 0;
    let inString: string | null = null;
    let isEscaped = false;

    for (let i = bracketOpenPos; i < block.length; i++) {
      const char = block[i];

      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (inString) {
        if (char === inString) {
          inString = null;
        }
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        inString = char;
        continue;
      }

      if (char === "[") {
        depth++;
      } else if (char === "]") {
        depth--;
        if (depth === 0) {
          return {
            arrayStart: bracketOpenPos,
            arrayEnd: i,
            innerContent: block.substring(bracketOpenPos + 1, i),
          };
        }
      }
    }

    return null;
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Finds the exact tool block { ... } in the file for the specified slug.
   * Scans backwards from slugPos to locate the outermost enclosing curly brace of that tool definition.
   */
  private findToolBlock(
    content: string,
    toolSlug: string
  ): { blockStart: number; blockEnd: number; block: string } | null {
    const escapedSlug = this.escapeRegExp(toolSlug);
    const slugRegex = new RegExp(`slug:\\s*["']${escapedSlug}["']`);
    const slugMatch = content.match(slugRegex);
    if (!slugMatch || slugMatch.index === undefined) return null;

    const slugPos = slugMatch.index;

    // Scan backwards from slugPos to find the matching outermost '{'
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

    if (blockStart === -1) {
      blockStart = content.lastIndexOf("{", slugPos);
    }
    if (blockStart === -1) return null;

    // Now find the matching closing brace for this tool block
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

      if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0) {
          blockEnd = i;
          break;
        }
      }
    }

    if (blockEnd === -1) return null;

    const block = content.substring(blockStart, blockEnd + 1);
    if (!slugRegex.test(block)) return null;

    return { blockStart, blockEnd, block };
  }

  /**
   * Applies an approved low-risk SEO optimization to the codebase.
   */
  async applyOptimization(
    opportunity: SeoOpportunity,
    semanticResult: SemanticOptimizationResult
  ): Promise<OptimizationApplicationResult> {
    const tool = getToolBySlug(opportunity.pageSlug);
    if (!tool) {
      return {
        success: false,
        targetFile: "",
        previousContent: "",
        newContent: "",
        proposal: this.createEmptyProposal(opportunity),
        errorMessage: `Tool not found in registry: ${opportunity.pageSlug}`,
      };
    }

    // 1. Factual Content Safety Gate
    if (semanticResult.factualSafety && !semanticResult.factualSafety.isSafe) {
      return {
        success: false,
        targetFile: "",
        previousContent: "",
        newContent: "",
        proposal: this.createEmptyProposal(opportunity),
        errorMessage: `FACTUAL SAFETY BLOCKED: ${semanticResult.factualSafety.reason}`,
      };
    }

    const relativeTarget = `data/tools/${tool.category}.ts`;
    const targetFilePath = path.join(this.workspaceRoot, relativeTarget);

    // 2. Boundary Check: Ensure file is inside whitelisted modification directories
    if (!this.isWhitelistedFile(relativeTarget)) {
      return {
        success: false,
        targetFile: relativeTarget,
        previousContent: "",
        newContent: "",
        proposal: this.createEmptyProposal(opportunity),
        errorMessage: `SECURITY BREACH BLOCKED: Target file ${relativeTarget} is outside allowed SEO modification scope.`,
      };
    }

    if (!fs.existsSync(targetFilePath)) {
      return {
        success: false,
        targetFile: relativeTarget,
        previousContent: "",
        newContent: "",
        proposal: this.createEmptyProposal(opportunity),
        errorMessage: `Target file does not exist: ${targetFilePath}`,
      };
    }

    const originalContent = fs.readFileSync(targetFilePath, "utf8");

    // 2. Build proposal record
    const proposal: SeoOptimizationProposal = {
      opportunityId: opportunity.id,
      pageSlug: tool.slug,
      riskLevel: opportunity.riskLevel,
      targetFile: relativeTarget,
      category: tool.category,
      previousState: {
        seoTitle: tool.seoTitle,
        seoDescription: tool.seoDescription,
        faqCount: tool.faq?.length || 0,
        relatedTools: [...(tool.relatedTools || [])],
      },
      newState: {
        seoTitle: semanticResult.seoTitle,
        seoDescription: semanticResult.seoDescription,
        addedFaqs: semanticResult.faqs,
      },
      justification: semanticResult.reasoning,
      evidence: opportunity.provenance,
    };

    try {
      // 3. Perform targeted text replacement respecting actionType decoupling
      const updatedContent = this.patchToolFileContent(originalContent, tool.slug, opportunity, semanticResult);

      const origToolBlock = this.findToolBlock(originalContent, tool.slug);
      const updToolBlock = this.findToolBlock(updatedContent, tool.slug);

      if (!origToolBlock || !updToolBlock) {
        return {
          success: false,
          targetFile: relativeTarget,
          previousContent: originalContent,
          newContent: originalContent,
          proposal,
          errorMessage: `NO_ACTIONABLE_CHANGE: Could not locate tool block for ${tool.slug}`,
        };
      }

      // Verify the patch actually changes the target tool block
      if (origToolBlock.block === updToolBlock.block || updatedContent === originalContent) {
        return {
          success: false,
          targetFile: relativeTarget,
          previousContent: originalContent,
          newContent: originalContent,
          proposal,
          errorMessage: `NO_ACTIONABLE_CHANGE: Target tool block for ${tool.slug} was not modified by patch`,
        };
      }

      // If action is FAQ_ENRICHMENT or THIN_PAGE_CONTENT, verify resulting FAQ set is not identical
      const actionType = opportunity.proposedAction?.type;
      if (actionType === "FAQ_ENRICHMENT" || opportunity.type === "THIN_PAGE_CONTENT") {
        const origFaqBounds = this.findArrayBounds(origToolBlock.block, "faq");
        const updFaqBounds = this.findArrayBounds(updToolBlock.block, "faq");
        const origFaqContent = origFaqBounds ? origFaqBounds.innerContent.trim() : "";
        const updFaqContent = updFaqBounds ? updFaqBounds.innerContent.trim() : "";
        if (origFaqContent === updFaqContent) {
          return {
            success: false,
            targetFile: relativeTarget,
            previousContent: originalContent,
            newContent: originalContent,
            proposal,
            errorMessage: `NO_ACTIONABLE_CHANGE: Resulting FAQ set for ${tool.slug} is identical to original FAQ set`,
          };
        }
      }

      // Title Optimization identical check
      if (actionType === "TITLE_OPTIMIZATION") {
        const origTitle = origToolBlock.block.match(/seoTitle:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        const updTitle = updToolBlock.block.match(/seoTitle:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        const ot = (origTitle?.[1] || origTitle?.[2] || "").trim();
        const ut = (updTitle?.[1] || updTitle?.[2] || "").trim();
        if (ot === ut) {
          return {
            success: false,
            targetFile: relativeTarget,
            previousContent: originalContent,
            newContent: originalContent,
            proposal,
            errorMessage: `NO_ACTIONABLE_CHANGE: Resulting title for ${tool.slug} is identical to original title`,
          };
        }
      }

      // Description Optimization identical check
      if (actionType === "DESCRIPTION_OPTIMIZATION") {
        const origDesc = origToolBlock.block.match(/seoDescription:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        const updDesc = updToolBlock.block.match(/seoDescription:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        const od = (origDesc?.[1] || origDesc?.[2] || "").trim();
        const ud = (updDesc?.[1] || updDesc?.[2] || "").trim();
        if (od === ud) {
          return {
            success: false,
            targetFile: relativeTarget,
            previousContent: originalContent,
            newContent: originalContent,
            proposal,
            errorMessage: `NO_ACTIONABLE_CHANGE: Resulting description for ${tool.slug} is identical to original description`,
          };
        }
      }

      // Internal Links identical check
      if (actionType === "INTERNAL_LINKS") {
        const origRelBounds = this.findArrayBounds(origToolBlock.block, "relatedTools");
        const updRelBounds = this.findArrayBounds(updToolBlock.block, "relatedTools");
        const origRelContent = origRelBounds ? origRelBounds.innerContent.trim() : "";
        const updRelContent = updRelBounds ? updRelBounds.innerContent.trim() : "";
        if (origRelContent === updRelContent) {
          return {
            success: false,
            targetFile: relativeTarget,
            previousContent: originalContent,
            newContent: originalContent,
            proposal,
            errorMessage: `NO_ACTIONABLE_CHANGE: Resulting internal links for ${tool.slug} are identical to original links`,
          };
        }
      }

      // PRE-WRITE SAFETY VERIFICATION
      // 1. Target tool block still exists
      const escapedSlug = this.escapeRegExp(tool.slug);
      const slugRegex = new RegExp(`slug:\\s*["']${escapedSlug}["']`);
      if (!slugRegex.test(updatedContent)) {
        throw new Error(`PRE-WRITE CHECK FAILED: Target tool slug ${tool.slug} was lost during generation`);
      }

      // 2. Verify slug appears exactly once in the entire file
      const slugOccurrences = (updatedContent.match(new RegExp(`slug:\\s*["']${escapedSlug}["']`, "g")) || []).length;
      if (slugOccurrences !== 1) {
        throw new Error(`PRE-WRITE CHECK FAILED: Expected tool slug ${tool.slug} to appear exactly once, but found ${slugOccurrences} occurrences`);
      }

      // 3. Verify TypeScript syntax remains structurally valid via AST parser
      const sourceFile = ts.createSourceFile(
        path.basename(targetFilePath),
        updatedContent,
        ts.ScriptTarget.Latest,
        true
      );
      const syntaxDiagnostics = (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics || [];
      if (syntaxDiagnostics.length > 0) {
        const firstErr = syntaxDiagnostics[0];
        const msg = typeof firstErr.messageText === "string" ? firstErr.messageText : firstErr.messageText.messageText;
        throw new Error(`PRE-WRITE CHECK FAILED: Structural TypeScript syntax error in modified content: ${msg}`);
      }

      // 4. Invariant checks for FAQ_ENRICHMENT
      if (actionType === "FAQ_ENRICHMENT" || opportunity.type === "THIN_PAGE_CONTENT") {

        // Assert seoTitle is unchanged
        const origTitle = origToolBlock.block.match(/seoTitle:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        const updTitle = updToolBlock.block.match(/seoTitle:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        if (origTitle && updTitle && (origTitle[1] || origTitle[2]) !== (updTitle[1] || updTitle[2])) {
          throw new Error(`PRE-WRITE INVARIANT FAILED: seoTitle modified during FAQ_ENRICHMENT`);
        }

        // Assert seoDescription is unchanged
        const origDesc = origToolBlock.block.match(/seoDescription:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        const updDesc = updToolBlock.block.match(/seoDescription:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
        if (origDesc && updDesc && (origDesc[1] || origDesc[2]) !== (updDesc[1] || updDesc[2])) {
          throw new Error(`PRE-WRITE INVARIANT FAILED: seoDescription modified during FAQ_ENRICHMENT`);
        }

        // Assert relatedTools is unchanged
        const origRelBounds = this.findArrayBounds(origToolBlock.block, "relatedTools");
        const updRelBounds = this.findArrayBounds(updToolBlock.block, "relatedTools");
        if (origRelBounds && updRelBounds && origRelBounds.innerContent.trim() !== updRelBounds.innerContent.trim()) {
          throw new Error(`PRE-WRITE INVARIANT FAILED: relatedTools modified during FAQ_ENRICHMENT`);
        }
      }

      // 5. Write new content
      fs.writeFileSync(targetFilePath, updatedContent, "utf8");

      return {
        success: true,
        targetFile: relativeTarget,
        previousContent: originalContent,
        newContent: updatedContent,
        proposal,
      };
    } catch (err) {
      return {
        success: false,
        targetFile: relativeTarget,
        previousContent: originalContent,
        newContent: originalContent,
        proposal,
        errorMessage: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Patches a tool's definitions inside the category data file.
   * Strictly respects action decoupling:
   * INTERNAL_LINKS modifies ONLY relatedTools and never rewrites metadata.
   */
  private patchToolFileContent(
    content: string,
    toolSlug: string,
    opportunity: SeoOpportunity,
    semanticResult: SemanticOptimizationResult
  ): string {
    const toolBlockInfo = this.findToolBlock(content, toolSlug);
    if (!toolBlockInfo) return content;

    const { blockStart, blockEnd, block: originalBlock } = toolBlockInfo;
    let updatedBlock = originalBlock;
    const actionType = opportunity.proposedAction?.type;

    // RULE: If action is purely INTERNAL_LINKS, NEVER touch seoTitle, seoDescription, or faq!
    if (actionType === "INTERNAL_LINKS" || opportunity.type === "WEAK_INTERNAL_LINKING" || opportunity.type === "ORPHAN_PAGE") {
      const allValidSlugs = new Set(getAllTools().map((t) => t.slug));
      const linksToAdd = (semanticResult.internalLinkSuggestions || []).filter(
        (slug) => allValidSlugs.has(slug) && slug !== toolSlug
      );
      if (linksToAdd.length > 0) {
        const relatedBounds = this.findArrayBounds(updatedBlock, "relatedTools");
        if (relatedBounds) {
          const existingLinks = relatedBounds.innerContent
            .split(",")
            .map((s) => s.replace(/["'\s]/g, ""))
            .filter(Boolean);

          const newLinks = Array.from(new Set([...existingLinks, ...linksToAdd]));
          const formatted = newLinks.map((l) => JSON.stringify(l)).join(", ");
          updatedBlock =
            updatedBlock.substring(0, relatedBounds.arrayStart) +
            `[${formatted}]` +
            updatedBlock.substring(relatedBounds.arrayEnd + 1);
        }
      }
      return content.substring(0, blockStart) + updatedBlock + content.substring(blockEnd + 1);
    }

    // 1. Update seoTitle ONLY if action requires title optimization
    if (
      actionType === "TITLE_OPTIMIZATION" ||
      opportunity.type === "WEAK_TITLE" ||
      opportunity.type === "POSITION_4_10_OPPORTUNITY"
    ) {
      if (semanticResult.seoTitle) {
        const titlePattern = /seoTitle:\s*["'][^"']*["'],?/;
        if (titlePattern.test(updatedBlock)) {
          updatedBlock = updatedBlock.replace(titlePattern, `seoTitle: ${JSON.stringify(semanticResult.seoTitle)},`);
        }
      }
    }

    // 2. Update seoDescription ONLY if action requires description optimization
    if (
      actionType === "DESCRIPTION_OPTIMIZATION" ||
      opportunity.type === "WEAK_META_DESCRIPTION" ||
      opportunity.type === "HIGH_IMPRESSIONS_LOW_CTR"
    ) {
      if (semanticResult.seoDescription) {
        const descPattern = /seoDescription:\s*["'][^"']*["'],?/;
        if (descPattern.test(updatedBlock)) {
          updatedBlock = updatedBlock.replace(descPattern, `seoDescription: ${JSON.stringify(semanticResult.seoDescription)},`);
        }
      }
    }

    // 3. Append high-value FAQs if provided for FAQ_ENRICHMENT
    if (
      actionType === "FAQ_ENRICHMENT" ||
      opportunity.type === "THIN_PAGE_CONTENT"
    ) {
      if (semanticResult.faqs && semanticResult.faqs.length > 0) {
        const faqBounds = this.findArrayBounds(updatedBlock, "faq");
        if (faqBounds) {
          const existingFaqStr = faqBounds.innerContent.trim();
          // Extract existing questions to avoid duplicates using normalized question text
          const existingQuestions = new Set<string>();
          const qMatches = existingFaqStr.matchAll(/question:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/g);
          for (const m of qMatches) {
            const rawQ = m[1] !== undefined ? m[1] : m[2];
            existingQuestions.add(normalizeFaqQuestion(rawQ.replace(/\\(["'\\])/g, "$1")));
          }

          const novelFaqs = semanticResult.faqs.filter(
            (f) => !existingQuestions.has(normalizeFaqQuestion(f.question))
          );

          if (novelFaqs.length > 0) {
            const newFaqsFormatted = novelFaqs
              .map(
                (f) =>
                  `      { question: ${JSON.stringify(f.question)}, answer: ${JSON.stringify(f.answer)} }`
              )
              .join(",\n");

            const combinedFaq = existingFaqStr
              ? `${existingFaqStr},\n${newFaqsFormatted}`
              : `\n${newFaqsFormatted}\n    `;

            updatedBlock =
              updatedBlock.substring(0, faqBounds.arrayStart) +
              `[\n${combinedFaq}\n    ]` +
              updatedBlock.substring(faqBounds.arrayEnd + 1);
          }
        } else {
          // Tool does not have faq array yet; insert before relatedTools, seoTitle, or canonicalUrl
          const novelFaqs = semanticResult.faqs;
          if (novelFaqs.length > 0) {
            const newFaqsFormatted = novelFaqs
              .map(
                (f) =>
                  `      { question: ${JSON.stringify(f.question)}, answer: ${JSON.stringify(f.answer)} }`
              )
              .join(",\n");

            const insertAnchor = updatedBlock.match(/(?:relatedTools|seoTitle|canonicalUrl):\s*/);
            if (insertAnchor && insertAnchor.index !== undefined) {
              const faqProperty = `faq: [\n${newFaqsFormatted}\n    ],\n    `;
              updatedBlock = updatedBlock.substring(0, insertAnchor.index) + faqProperty + updatedBlock.substring(insertAnchor.index);
            }
          }
        }
      }
    }

    return content.substring(0, blockStart) + updatedBlock + content.substring(blockEnd + 1);
  }

  /**
   * Restores a previously modified file in case of validation failure.
   */
  rollbackFile(relativeFilePath: string, previousContent: string): boolean {
    try {
      const fullPath = path.isAbsolute(relativeFilePath)
        ? relativeFilePath
        : path.join(this.workspaceRoot, relativeFilePath);
      fs.writeFileSync(fullPath, previousContent, "utf8");
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reverts changes using a stored rollback snapshot.
   */
  async rollback(snapshot: { filePath: string; previousContent: string }): Promise<{ success: boolean }> {
    const ok = this.rollbackFile(snapshot.filePath, snapshot.previousContent);
    return { success: ok };
  }

  private isWhitelistedFile(filePath: string): boolean {
    const norm = filePath.replace(/\\/g, "/");
    return SEO_AGENT_CONFIG.WHITELISTED_MODIFICATION_DIRECTORIES.some((dir) =>
      norm.startsWith(dir)
    );
  }

  private createEmptyProposal(opportunity: SeoOpportunity): SeoOptimizationProposal {
    return {
      opportunityId: opportunity.id,
      pageSlug: opportunity.pageSlug,
      riskLevel: opportunity.riskLevel,
      targetFile: "",
      category: "",
      previousState: {},
      newState: {},
      justification: "Failed initial validation",
      evidence: opportunity.provenance,
    };
  }
}
