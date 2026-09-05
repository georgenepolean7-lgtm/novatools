/**
 * Nova Tools Autonomous SEO Agent - Hermes + Qwen Integration Client
 * Connects to local Ollama (Qwen 4B or configurable model) / OpenAI-compatible endpoint.
 * Enforces negative constraints against AI fluff, fake stats, and keyword stuffing.
 */

import { SEO_AGENT_CONFIG } from "./config";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { FactualContentSafetyValidator, FactualSafetyCheckResult } from "./factual-safety";
import { SeoActionType } from "./types";

export interface SemanticOptimizationResult {
  seoTitle?: string;
  seoDescription?: string;
  contentSuggestions?: string[];
  internalLinkSuggestions?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  editorialSection?: { heading: string; content: string };
  reasoning: string;
  reasoningSummary?: string;
  modelUsed: string;
  provenanceType?: "model-generated" | "deterministic-fallback";
  factualSafety?: FactualSafetyCheckResult;
}

export function normalizeFaqQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export class HermesQwenClient {
  private model: string;
  private ollamaBaseUrl: string;
  private customEndpoint: string;

  constructor() {
    this.model = SEO_AGENT_CONFIG.LLM.MODEL;
    this.ollamaBaseUrl = SEO_AGENT_CONFIG.LLM.OLLAMA_BASE_URL;
    this.customEndpoint = SEO_AGENT_CONFIG.LLM.CUSTOM_OPENAI_ENDPOINT;
  }

  /**
   * Health check for local Ollama / Hermes Qwen instance.
   */
  async checkHealth(): Promise<{
    connected: boolean;
    status: "CONNECTED" | "NOT_CONNECTED" | "FALLBACK_MODE";
    model: string;
    message: string;
  }> {
    try {
      const endpoint = this.customEndpoint || `${this.ollamaBaseUrl}/api/tags`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return {
          connected: true,
          status: "CONNECTED" as const,
          model: this.model,
          message: `Local Ollama instance active with model ${this.model}`,
        };
      }
      return {
        connected: false,
        status: "NOT_CONNECTED" as const,
        model: this.model,
        message: `Ollama returned HTTP ${res.status}: ${res.statusText}`,
      };
    } catch (err) {
      return {
        connected: false,
        status: "NOT_CONNECTED" as const,
        model: this.model,
        message: `Ollama service unreachable at ${this.ollamaBaseUrl} (${err instanceof Error ? err.message : String(err)}). Local deterministic semantic engine active.`,
      };
    }
  }

  /**
   * Generates safe, high-value SEO improvements for a specific tool.
   * Employs strict negative prompting against keyword stuffing and AI filler.
   */
  async generateOptimization(
    tool: ToolDefinition,
    actionType: SeoActionType,
    context: { primaryQuery?: string; reason: string; avgPosition?: number; ctr?: number; multiSourceContext?: string }
  ): Promise<SemanticOptimizationResult> {
    const prompt = this.buildPrompt(tool, actionType, context);
    let result: SemanticOptimizationResult | null = null;

    // Try calling local Ollama / Hermes runner with bounded watchdog
    try {
      const completion = await this.callLlm(prompt);
      if (completion) {
        result = this.parseLlmResponse(completion, tool);
      }
    } catch (err) {
      const isTimeout = err instanceof Error && err.message.startsWith("TIMEOUT:");
      console.warn(
        `[SEO Agent] LLM generation ${isTimeout ? "timed out" : "unavailable"} for /${tool.slug}. Falling back to deterministic semantic rules.`
      );
      // Local LLM offline / error / timeout - fallback to deterministic high-quality rules
    }

    if (!result) {
      result = this.generateDeterministicSemanticFallback(tool, actionType, context);
    }

    // Run strict factual content safety verification
    let safety = FactualContentSafetyValidator.validate(tool, actionType, {
      seoTitle: result.seoTitle,
      seoDescription: result.seoDescription,
      faqs: result.faqs,
      contentSuggestions: result.contentSuggestions,
      internalLinks: result.internalLinkSuggestions,
    });

    // If AI generation has unverified claims, fall back to grounded deterministic output
    if (!safety.isSafe) {
      const fallbackResult = this.generateDeterministicSemanticFallback(tool, actionType, context);
      const fallbackSafety = FactualContentSafetyValidator.validate(tool, actionType, {
        seoTitle: fallbackResult.seoTitle,
        seoDescription: fallbackResult.seoDescription,
        faqs: fallbackResult.faqs,
        contentSuggestions: fallbackResult.contentSuggestions,
        internalLinks: fallbackResult.internalLinkSuggestions,
      });
      if (fallbackSafety.isSafe) {
        result = fallbackResult;
        safety = fallbackSafety;
      }
    }

    result.factualSafety = safety;
    return result;
  }

  private buildPrompt(
    tool: ToolDefinition,
    actionType: string,
    context: { primaryQuery?: string; reason: string; multiSourceContext?: string }
  ): string {
    const isFileTool = tool.category === "pdf" || tool.category === "image" || tool.category === "file";
    const categoryGuidance = isFileTool
      ? "Focus on file processing capabilities, client-side browser performance, and privacy."
      : "This is a numeric/text utility or calculator. Focus on speed, formula accuracy, and instant browser calculation. DO NOT mention file uploads.";

    return `
You are the Senior Technical SEO Specialist for Nova Tools (novatool.in).
Tool to optimize:
- Name: "${tool.name}"
- Slug: "${tool.slug}"
- Category: "${tool.category}"
- Current SEO Title: "${tool.seoTitle}"
- Current Description: "${tool.seoDescription}"
- Optimization Goal: ${actionType}
- Target Search Intent: "${context.primaryQuery || tool.keywords[0] || tool.name}"
- Trigger Reason: "${context.reason}"
${context.multiSourceContext ? `- Real Telemetry Context: "${context.multiSourceContext}"` : ""}

CATEGORY GUIDANCE:
${categoryGuidance}

STRICT SEO & FACTUAL CONTENT SAFETY RULES:
1. NEVER append or use the template "Free, Fast & Private".
2. NEVER use the boilerplate phrase "Fast, private, in-browser processing with zero file uploads".
3. NEVER use unverified buzzwords or superlatives: "official", "verified", "secure", "industry standard", "guaranteed", "certified", "bank-grade", "military-grade".
4. NEVER invent formulas, standards, certifications, DPI rasterization specs, AES encryption ciphers, or browser compatibility claims.
5. All explanations MUST be strictly derived from the tool's actual client-side browser execution.
6. Title MUST be 40 to 60 characters, tailored specifically to "${tool.name}", include primary user search intent, and end with "| Nova Tools".
7. Meta description MUST be 120 to 155 characters, concise, persuasive, and highlight the exact utility of this tool.
8. If suggesting internal links, suggest 2-4 semantically related tool slugs in the Nova Tools catalog.
9. Provide a concise 1-2 sentence "reasoningSummary" explaining the specific SEO benefit.

Return ONLY a valid JSON object in this exact schema:
{
  "seoTitle": "...",
  "seoDescription": "...",
  "contentSuggestions": ["..."],
  "internalLinkSuggestions": ["..."],
  "faqs": [{"question": "...", "answer": "..."}],
  "reasoningSummary": "..."
}
`;
  }

  private async callLlm(prompt: string): Promise<string | null> {
    const controller = new AbortController();
    const timeoutMs = SEO_AGENT_CONFIG.TIMEOUTS?.LLM_TIMEOUT_MS || SEO_AGENT_CONFIG.LLM.TIMEOUT_MS || 120000;
    let isTimedOut = false;
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const url = this.customEndpoint || `${this.ollamaBaseUrl}/api/generate`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          format: "json",
          temperature: SEO_AGENT_CONFIG.LLM.TEMPERATURE,
        }),
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const json = await res.json();

      // Qwen3:4b may place JSON in json.response, or inside json.thinking / think tags
      const responseText = (json?.response || "").trim();
      const thinkingText = (json?.thinking || "").trim();

      if (responseText && responseText.includes("{")) {
        return responseText;
      }
      if (thinkingText && thinkingText.includes("{")) {
        return thinkingText;
      }
      if (responseText) return responseText;
      if (json?.choices?.[0]?.message?.content) return json.choices[0].message.content;

      return null;
    } catch (_err) {
      clearTimeout(timeoutId);
      if (isTimedOut) {
        throw new Error(`TIMEOUT: LLM generation exceeded ${timeoutMs}ms`);
      }
      return null;
    }
  }

  private parseLlmResponse(raw: string, fallbackTool: ToolDefinition): SemanticOptimizationResult | null {
    try {
      // Find outermost JSON block
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.seoTitle && !parsed.seoDescription && !parsed.internalLinkSuggestions) {
        return null;
      }

      const seoTitle = parsed.seoTitle ? this.sanitizeText(parsed.seoTitle, 65) : fallbackTool.seoTitle;
      const seoDescription = parsed.seoDescription ? this.sanitizeText(parsed.seoDescription, 160) : fallbackTool.seoDescription;

      // Reject generic template leakage
      if (
        seoTitle.toLowerCase().includes("free, fast & private") ||
        seoDescription.toLowerCase().includes("zero file uploads. optimized for security")
      ) {
        return null;
      }

      const contentSuggestions = Array.isArray(parsed.contentSuggestions)
        ? parsed.contentSuggestions.map((s: unknown) => String(s)).slice(0, 3)
        : undefined;

      const internalLinkSuggestions = Array.isArray(parsed.internalLinkSuggestions)
        ? parsed.internalLinkSuggestions.map((s: unknown) => String(s).replace(/^\//, "").trim()).slice(0, 4)
        : undefined;

      const existingNormalized = new Set(
        (fallbackTool.faq || []).map((f) => normalizeFaqQuestion(f.question))
      );

      const rawFaqs = Array.isArray(parsed.faqs)
        ? (parsed.faqs as Array<{ question?: unknown; answer?: unknown }>)
            .filter((f): f is { question: string; answer: string } => Boolean(f && typeof f.question === "string" && typeof f.answer === "string"))
        : [];

      const currentFaqCount = fallbackTool.faq?.length || 0;
      const faqThreshold = SEO_AGENT_CONFIG.BUDGETS.FAQ_CONTENT_THRESHOLD || 8;

      let faqs: Array<{ question: string; answer: string }> | undefined;

      if (currentFaqCount < faqThreshold) {
        const seenNorms = new Set<string>();
        const novelFaqs: Array<{ question: string; answer: string }> = [];

        for (const f of rawFaqs) {
          const norm = normalizeFaqQuestion(f.question);
          if (!norm || existingNormalized.has(norm) || seenNorms.has(norm)) continue;
          seenNorms.add(norm);
          novelFaqs.push(f);
        }

        // If model-generated FAQs were duplicates of existing questions, supplement with novel grounded FAQ candidates
        if (novelFaqs.length === 0) {
          const groundedCandidates = this.getGroundedFaqCandidates(fallbackTool);
          for (const cand of groundedCandidates) {
            const norm = normalizeFaqQuestion(cand.question);
            if (!norm || existingNormalized.has(norm) || seenNorms.has(norm)) continue;
            seenNorms.add(norm);
            novelFaqs.push(cand);
            if (novelFaqs.length >= SEO_AGENT_CONFIG.BUDGETS.MAX_FAQS_PER_OPTIMIZATION) break;
          }
        }

        if (novelFaqs.length > 0) {
          const maxToAdd = Math.min(
            SEO_AGENT_CONFIG.BUDGETS.MAX_FAQS_PER_OPTIMIZATION,
            faqThreshold - currentFaqCount
          );
          faqs = novelFaqs.slice(0, Math.max(1, maxToAdd));
        }
      }

      const reasoningSummary =
        typeof parsed.reasoningSummary === "string" && parsed.reasoningSummary.trim().length > 0
          ? parsed.reasoningSummary.trim()
          : `Page-specific semantic optimization for ${fallbackTool.name}`;

      return {
        seoTitle,
        seoDescription,
        contentSuggestions,
        internalLinkSuggestions,
        faqs,
        reasoning: reasoningSummary,
        reasoningSummary,
        modelUsed: this.model,
        provenanceType: "model-generated",
      };
    } catch {
      return null;
    }
  }

  /**
   * Generates grounded, tool-specific FAQ candidates based on tool functionality and metadata.
   */
  private getGroundedFaqCandidates(tool: ToolDefinition): Array<{ question: string; answer: string }> {
    const isFileTool = tool.category === "pdf" || tool.category === "image" || tool.category === "file";
    const candidates: Array<{ question: string; answer: string }> = [];

    // 1. Specific grounded FAQ candidates for aspect-ratio-calculator
    if (tool.slug === "aspect-ratio-calculator") {
      candidates.push(
        {
          question: "What are the most common aspect ratio presets?",
          answer:
            "The most common aspect ratio presets are 16:9 (standard widescreen for YouTube and HDTV), 4:3 (traditional displays and retro video), 1:1 (square format for Instagram feeds), 9:16 (vertical video for TikTok, Reels, and Shorts), and 21:9 (ultrawide panoramic monitors).",
        },
        {
          question: "What formula does Aspect Ratio Calculator (Image & Video) use for proportional scaling?",
          answer:
            "The calculator applies the cross-multiplication formula: New Height = (Original Height × New Width) / Original Width, or New Width = (Original Width × New Height) / Original Height, preserving exact image proportions.",
        },
        {
          question: "How do I calculate a new height while maintaining the aspect ratio?",
          answer:
            "Enter your original width and height, then specify your target width. The calculator divides original height by original width and multiplies by your new width to output the exact proportional height.",
        },
        {
          question: "Can I find the original aspect ratio from custom pixel dimensions?",
          answer:
            "Yes. Enter your custom width and height in pixels. The calculator computes the greatest common divisor (GCD) to display the simplified ratio fraction and decimal multiplier.",
        },
        {
          question: "Does Aspect Ratio Calculator (Image & Video) support 4K and 8K resolutions?",
          answer:
            "Yes. The calculator accepts any numerical dimensions without restrictions, including 3840x2160 (4K UHD) and 7680x4320 (8K UHD) with instant precision.",
        }
      );
    }

    // 2. Feature-grounded candidates
    if (tool.features && tool.features.length > 0) {
      for (const feature of tool.features) {
        candidates.push({
          question: `Does ${tool.name} support ${feature.toLowerCase()}?`,
          answer: `Yes. ${tool.name} provides ${feature.toLowerCase()} natively in your browser with real-time feedback.`,
        });
      }
    }

    // 3. Problem-statement grounded candidates
    if (tool.problemStatements && tool.problemStatements.length > 0) {
      for (const prob of tool.problemStatements) {
        const cleanProb = prob.replace(/^(how to|can i|calculate|find)\s+/i, "").trim();
        candidates.push({
          question: `Can I use ${tool.name} to ${cleanProb}?`,
          answer: `Yes. ${tool.name} is designed specifically for this use case. Input your parameters to calculate the exact result in real time.`,
        });
      }
    }

    // 4. How-to steps grounded candidates
    if (tool.howToSteps && tool.howToSteps.length > 0) {
      const stepSummary = tool.howToSteps
        .map((s) => `Step ${s.step}: ${s.title} (${s.instruction})`)
        .join(" ");
      candidates.push({
        question: `What are the steps to use ${tool.name}?`,
        answer: stepSummary,
      });
    }

    // 5. Input types grounded candidates
    if (tool.inputTypes && tool.inputTypes.length > 0) {
      candidates.push({
        question: `What input formats are accepted by ${tool.name}?`,
        answer: `${tool.name} accepts ${tool.inputTypes.join(", ")} input with instant local browser validation.`,
      });
    }

    // 6. Category execution & privacy grounded candidates
    if (isFileTool) {
      candidates.push(
        {
          question: `How does ${tool.name} process files in the browser?`,
          answer: `Processing runs locally in your web browser using HTML5 and client-side web technologies. Files remain on your device and are not uploaded to external servers.`,
        },
        {
          question: `Are my files uploaded to any server when using ${tool.name}?`,
          answer: `No. All file processing happens entirely in your local browser environment. No file data is transferred to external servers.`,
        },
        {
          question: `What browsers support ${tool.name}?`,
          answer: `All modern web browsers including Chrome, Edge, Firefox, and Safari with JavaScript enabled support ${tool.name}.`,
        }
      );
    } else {
      candidates.push(
        {
          question: `How does ${tool.name} calculate results?`,
          answer: `Calculations execute client-side directly in your browser using standard JavaScript mathematical logic for immediate results.`,
        },
        {
          question: `Does ${tool.name} require an internet connection after loading?`,
          answer: `No. Once the page is loaded, calculations execute locally in your browser without sending input data over the network.`,
        },
        {
          question: `Is ${tool.name} free to use on Nova Tools?`,
          answer: `Yes. All calculations are performed directly in-browser with no usage limits or registration required.`,
        }
      );
    }

    return candidates;
  }

  /**
   * Evidence-backed page-specific deterministic fallback.
   * Never uses generic "Free, Fast & Private" or "zero file uploads" boilerplate.
   * If metadata is already solid and the action is purely internal linking, preserves existing metadata.
   */
  private generateDeterministicSemanticFallback(
    tool: ToolDefinition,
    actionType: string,
    context: { primaryQuery?: string; reason: string }
  ): SemanticOptimizationResult {
    let seoTitle = tool.seoTitle;
    let seoDescription = tool.seoDescription;
    let faqs: Array<{ question: string; answer: string }> | undefined;
    const isFileTool = tool.category === "pdf" || tool.category === "image" || tool.category === "file";

    // Sanitize any pre-existing catalog boilerplate
    if (seoTitle && seoTitle.includes("Free, Fast & Private")) {
      seoTitle = `${tool.name} | Nova Tools`;
    }
    if (seoDescription && !isFileTool && (seoDescription.includes("zero file uploads") || seoDescription.includes("Free, Fast & Private"))) {
      seoDescription = `${tool.shortDescription || tool.longDescription} Instant calculations with accurate real-time results on Nova Tools.`;
    }

    // If existing metadata is already healthy, preserve it!
    const titleLength = (seoTitle || "").length;
    const descLength = (seoDescription || "").length;
    const titleNeedsWork = actionType === "TITLE_OPTIMIZATION" || titleLength < 30 || titleLength > 65;
    const descNeedsWork = actionType === "DESCRIPTION_OPTIMIZATION" || descLength < 80 || descLength > 165;

    if (titleNeedsWork) {
      if (context.primaryQuery && context.primaryQuery.length > 3 && !context.primaryQuery.includes("http")) {
        const capitalizedQuery = context.primaryQuery.charAt(0).toUpperCase() + context.primaryQuery.slice(1);
        seoTitle = `${capitalizedQuery} - ${tool.name} | Nova Tools`;
      } else {
        seoTitle = `${tool.name} Online Tool | Nova Tools`;
      }
      if (seoTitle.length > 60) {
        seoTitle = `${tool.name} | Nova Tools`;
      }
    }

    if (descNeedsWork) {
      if (isFileTool) {
        seoDescription = `${tool.shortDescription || tool.longDescription} Fast in-browser processing with total privacy on Nova Tools.`;
      } else {
        seoDescription = `${tool.shortDescription || tool.longDescription} Instant calculations with accurate real-time results on Nova Tools.`;
      }
      if (seoDescription.length > 155) {
        seoDescription = seoDescription.slice(0, 152) + "...";
      }
    }

    const isFaqAction =
      actionType === "FAQ_ENRICHMENT" ||
      context.reason?.toLowerCase().includes("thin") ||
      context.reason?.toLowerCase().includes("faq");

    if (isFaqAction) {
      const currentFaqCount = tool.faq?.length || 0;
      const faqThreshold = SEO_AGENT_CONFIG.BUDGETS.FAQ_CONTENT_THRESHOLD || 8;
      const existingNormalized = new Set(
        (tool.faq || []).map((f) => normalizeFaqQuestion(f.question))
      );

      const candidates = this.getGroundedFaqCandidates(tool);

      // Deduplicate candidates and filter against existing FAQs using normalized question text
      const seenCandidates = new Set<string>();
      const novelCandidates: Array<{ question: string; answer: string }> = [];

      for (const cand of candidates) {
        const norm = normalizeFaqQuestion(cand.question);
        if (!norm) continue;
        if (existingNormalized.has(norm)) continue;
        if (seenCandidates.has(norm)) continue;
        seenCandidates.add(norm);
        novelCandidates.push(cand);
      }

      // Return novel FAQs only when existing count is below the configured content threshold
      if (currentFaqCount < faqThreshold && novelCandidates.length > 0) {
        const maxToAdd = Math.min(
          SEO_AGENT_CONFIG.BUDGETS.MAX_FAQS_PER_OPTIMIZATION,
          faqThreshold - currentFaqCount
        );
        faqs = novelCandidates.slice(0, Math.max(1, maxToAdd));
      } else {
        faqs = undefined;
      }
    }

    return {
      seoTitle,
      seoDescription,
      faqs,
      reasoning: `Deterministic page-specific optimization for ${tool.slug} (${context.reason})`,
      reasoningSummary: `Deterministic page-specific optimization for ${tool.slug} (${context.reason})`,
      modelUsed: "deterministic-rules-engine",
      provenanceType: "deterministic-fallback",
    };
  }

  private sanitizeText(text: string, maxLength: number): string {
    return text.replace(/["\r\n]+/g, " ").trim().slice(0, maxLength);
  }
}
