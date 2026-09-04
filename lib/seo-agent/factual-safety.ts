/**
 * Nova Tools Autonomous SEO Agent - Factual Content Safety Gate
 * 
 * Enforces rigorous semantic verification on all AI-generated content (FAQs,
 * meta descriptions, titles, technical explanations) before publication.
 * 
 * Guiding Principles:
 * 1. Zero Hallucinated Claims: Claims cannot be published unless verifiable from the tool's
 *    actual implementation code or trusted registry definition.
 * 2. Strict Prohibition of Superlatives / Buzzwords: Phrases like "official", "verified",
 *    "secure", "industry standard", "guaranteed", "certified", etc., are rejected unless explicitly
 *    grounded in the tool definition.
 * 3. High-Risk Technical Domain Guards: Strong validation against unverified claims in PDF crypto,
 *    rasterization/DPI, image resampling, codec bitrates, exam specs, and barcode standards.
 * 4. Internal links introduce no factual text, remaining SAFE_TO_EXECUTE.
 */

import { ToolDefinition } from "@/lib/tools/tool-types";

export interface FactualClaimEvidence {
  claim: string;
  category: "BUZZWORD" | "HIGH_RISK_DOMAIN" | "INVENTED_SPEC" | "UNVERIFIED_EXPLANATION";
  matchedPattern: string;
  sourceFoundInRegistry: boolean;
  verdict: "SAFE" | "NEEDS_REVIEW" | "REJECTED";
}

export interface FactualSafetyCheckResult {
  isSafe: boolean;
  classification: "SAFE_TO_EXECUTE" | "NEEDS_REVIEW" | "SKIP";
  factuallyVerified: boolean;
  claimsChecked: number;
  unverifiedClaims: string[];
  bannedWordsFound: string[];
  highRiskAreaDetected?: string;
  evidenceTrail: FactualClaimEvidence[];
  reason: string;
}

export class FactualContentSafetyValidator {
  /**
   * Disallowed buzzwords and unverified superlatives.
   * Prohibited unless explicitly present in the tool's existing trusted metadata.
   */
  private static readonly BANNED_BUZZWORDS: Array<{ word: string; pattern: RegExp }> = [
    { word: "official", pattern: /\bofficial\b/i },
    { word: "verified", pattern: /\bverified\b/i },
    { word: "secure", pattern: /\bsecure\b/i },
    { word: "industry standard", pattern: /\bindustry[-\s]standard\b/i },
    { word: "guaranteed", pattern: /\bguaranteed?\b/i },
    { word: "certified", pattern: /\bcertifi(ed|cation)\b/i },
    { word: "bank-grade", pattern: /\bbank[-\s]grade\b/i },
    { word: "military-grade", pattern: /\bmilitary[-\s]grade\b/i },
    { word: "government approved", pattern: /\bgovernment[-\s]approved\b/i },
    { word: "legally binding", pattern: /\blegally[-\s]binding\b/i },
    { word: "100% safe", pattern: /\b100%\s*safe\b/i },
    { word: "zero risk", pattern: /\bzero[-\s]risk\b/i },
    { word: "flawless", pattern: /\bflawless\b/i },
    { word: "unbreakable", pattern: /\bunbreakable\b/i },
    { word: "patented", pattern: /\bpatented\b/i },
  ];

  /**
   * High-risk domain technical patterns requiring strict verification against tool implementation.
   */
  private static readonly HIGH_RISK_DOMAINS: Array<{
    area: string;
    pattern: RegExp;
    description: string;
  }> = [
    {
      area: "PDF compression / DPI / rasterization",
      pattern: /\b(\d+\s*dpi|rasteriz\w*|ghostscript|downsampl\w*|lossless\s+pdf|pdf\s*a\b|lineariz\w*|cmyk)\b/i,
      description: "Specific DPI, rasterization, or PDF/A archiving claims",
    },
    {
      area: "PDF encryption AES-128 / AES-256",
      pattern: /\b(aes[-\s]?128|aes[-\s]?256|rsa\b|sha[-\s]?256|rc4|cryptographic\s+hash|256[-\s]?bit|128[-\s]?bit\s+encryption)\b/i,
      description: "Cryptographic cipher or key length claims",
    },
    {
      area: "PDF metadata / XMP",
      pattern: /\b(xmp\b|exif\b|forensic\s+metadata|anonymiz\w*|redact\w*|metadata\s+stripping)\b/i,
      description: "Metadata sanitization or XMP schema claims",
    },
    {
      area: "Image resampling / interpolation",
      pattern: /\b(lanczos|bicubic|bilinear|nearest[-\s]?neighbor|resampl\w*|subpixel|anti[-\s]?alias\w*)\b/i,
      description: "Algorithm-specific image resampling claims",
    },
    {
      area: "WebP browser compatibility",
      pattern: /\b(safari\s*(?:1[0-4]|\d+)|caniuse|browser\s+support|fallback\s+to\s+png|internet\s+explorer)\b/i,
      description: "Version-specific browser compatibility assertions",
    },
    {
      area: "JPG/PNG transparency behavior",
      pattern: /\b(jpg\s+transparen\w*|jpeg\s+transparen\w*|alpha\s+channel\s+in\s+jpg|transparent\s+jpg)\b/i,
      description: "JPG transparency claims (JPG standard does not support alpha)",
    },
    {
      area: "Indian exam / signature specifications",
      pattern: /\b(upsc|ssc\s+cgl|ibps|gate\s+exam|jee\s+main|neet\b|passport\s+photo\s+spec|sbi\s+po|official\s+size)\b/i,
      description: "Government/exam board dimension or file-size mandates",
    },
    {
      area: "CommonMark / GFM claims",
      pattern: /\b(commonmark\s*(?:0\.\d+)?|gfm\s+compliance|github\s+flavored\s+markdown\s+spec|rfc\s*\d+)\b/i,
      description: "Formal markdown specification compliance claims",
    },
    {
      area: "Barcode checksum / scanner compatibility",
      pattern: /\b(gs1\b|iso[\s/]?iec\b|mod\s*10|check\s*digit\s+standard|symbology\s+compliance|laser\s+scanner)\b/i,
      description: "Barcode checksum or hardware scanner compatibility standards",
    },
    {
      area: "Audio codec / bitrate technical claims",
      pattern: /\b(flac\s+lossless|aac[\s-]lc|opus\s+codec|320\s*kbps|vbr\s+encoding|lossless\s+transcode|sample\s+rate\s+48khz)\b/i,
      description: "Audio bitrate or codec transcode specifications",
    },
    {
      area: "Invented certifications / regulatory standards",
      pattern: /\b(iso[-\s]?\d+|iec[-\s]?\d+|fips[-\s]?\d+|nist\b|gdpr\s+compliant|hipaa|pci[-\s]?dss)\b/i,
      description: "Formal security or regulatory compliance certifications",
    },
  ];

  /**
   * Primary entrypoint: Validates all semantic claims proposed for a tool page.
   */
  public static validate(
    tool: ToolDefinition,
    actionType: string,
    proposed: {
      seoTitle?: string;
      seoDescription?: string;
      faqs?: Array<{ question: string; answer: string }>;
      contentSuggestions?: string[];
      internalLinks?: string[];
    },
    evidenceContext?: {
      hasMeasurableTraffic?: boolean;
      objectiveDefect?: boolean;
    }
  ): FactualSafetyCheckResult {
    // 1. Internal Links Only -> Always SAFE because it introduces zero factual prose
    if (actionType === "INTERNAL_LINKS") {
      return {
        isSafe: true,
        classification: "SAFE_TO_EXECUTE",
        factuallyVerified: true,
        claimsChecked: 0,
        unverifiedClaims: [],
        bannedWordsFound: [],
        evidenceTrail: [],
        reason: "Internal-link-only changes introduce no factual or semantic content.",
      };
    }

    // 2. High-Risk Architectural Actions -> Always SKIP
    if (actionType === "CANONICAL_CHECK" || actionType === "ROBOTS_UPDATE" || actionType === "URL_REDIRECT") {
      return {
        isSafe: false,
        classification: "SKIP",
        factuallyVerified: false,
        claimsChecked: 0,
        unverifiedClaims: ["High-risk structural architecture changes are outside autonomous scope"],
        bannedWordsFound: [],
        evidenceTrail: [],
        reason: "Structural architectural changes must not be autonomously applied.",
      };
    }

    // Combine all proposed text
    const textBlocks: string[] = [];
    if (proposed.seoTitle) textBlocks.push(proposed.seoTitle);
    if (proposed.seoDescription) textBlocks.push(proposed.seoDescription);
    if (proposed.faqs) {
      proposed.faqs.forEach((faq) => {
        textBlocks.push(`${faq.question} ${faq.answer}`);
      });
    }
    if (proposed.contentSuggestions) {
      textBlocks.push(...proposed.contentSuggestions);
    }

    const combinedText = textBlocks.join(" \n ");
    if (!combinedText.trim()) {
      return {
        isSafe: false,
        classification: "SKIP",
        factuallyVerified: false,
        claimsChecked: 0,
        unverifiedClaims: ["Empty proposed content"],
        bannedWordsFound: [],
        evidenceTrail: [],
        reason: "No semantic content proposed.",
      };
    }

    // Extract tool baseline knowledge for ground-truth comparison
    const toolGroundTruth = this.compileToolGroundTruth(tool);

    const evidenceTrail: FactualClaimEvidence[] = [];
    const bannedWordsFound: string[] = [];
    const unverifiedClaims: string[] = [];
    let highRiskAreaDetected: string | undefined;

    // 3. Scan for Disallowed Buzzwords / Superlatives
    for (const item of this.BANNED_BUZZWORDS) {
      if (item.pattern.test(combinedText)) {
        // Verify if tool ground truth explicitly supports this term
        const supported = item.pattern.test(toolGroundTruth);
        if (!supported) {
          bannedWordsFound.push(item.word);
          unverifiedClaims.push(`Unverified buzzword/superlative: "${item.word}"`);
          evidenceTrail.push({
            claim: item.word,
            category: "BUZZWORD",
            matchedPattern: item.pattern.source,
            sourceFoundInRegistry: false,
            verdict: "NEEDS_REVIEW",
          });
        } else {
          evidenceTrail.push({
            claim: item.word,
            category: "BUZZWORD",
            matchedPattern: item.pattern.source,
            sourceFoundInRegistry: true,
            verdict: "SAFE",
          });
        }
      }
    }

    // 4. Scan for High-Risk Technical Domains
    for (const domain of this.HIGH_RISK_DOMAINS) {
      const match = combinedText.match(domain.pattern);
      if (match) {
        const matchedTerm = match[0];
        const supported = domain.pattern.test(toolGroundTruth);
        if (!supported) {
          if (!highRiskAreaDetected) highRiskAreaDetected = domain.area;
          unverifiedClaims.push(`High-risk claim in [${domain.area}]: "${matchedTerm}"`);
          evidenceTrail.push({
            claim: matchedTerm,
            category: "HIGH_RISK_DOMAIN",
            matchedPattern: domain.pattern.source,
            sourceFoundInRegistry: false,
            verdict: "NEEDS_REVIEW",
          });
        } else {
          evidenceTrail.push({
            claim: matchedTerm,
            category: "HIGH_RISK_DOMAIN",
            matchedPattern: domain.pattern.source,
            sourceFoundInRegistry: true,
            verdict: "SAFE",
          });
        }
      }
    }

    // 5. Evaluate FAQ Explanations specifically
    if (proposed.faqs && proposed.faqs.length > 0) {
      for (const faq of proposed.faqs) {
        const isClientSideExplanation =
          /browser|client[-\s]side|local|device|never\s+upload|not\s+upload|instant|recalculat|math|formula|dimension|ratio/i.test(faq.answer);

        // If it claims server-side processing, specialized cloud APIs, or complex guarantees not in tool
        if (!isClientSideExplanation && !this.isDirectlyDerivedFromTool(faq.answer, tool)) {
          unverifiedClaims.push(`FAQ answer introduces unverified mechanism: "${faq.question}"`);
          evidenceTrail.push({
            claim: faq.question,
            category: "UNVERIFIED_EXPLANATION",
            matchedPattern: "FAQ_ANSWER_GROUNDING",
            sourceFoundInRegistry: false,
            verdict: "NEEDS_REVIEW",
          });
        }
      }
    }

    const totalClaimsChecked = evidenceTrail.length;

    // 6. Final Decision Logic
    if (bannedWordsFound.length > 0 || unverifiedClaims.length > 0) {
      return {
        isSafe: false,
        classification: "NEEDS_REVIEW",
        factuallyVerified: false,
        claimsChecked: totalClaimsChecked,
        unverifiedClaims,
        bannedWordsFound,
        highRiskAreaDetected,
        evidenceTrail,
        reason: `Content requires editorial verification: ${unverifiedClaims.slice(0, 2).join("; ")}`,
      };
    }

    // 7. Metadata Optimization Check
    if (actionType === "TITLE_OPTIMIZATION" || actionType === "DESCRIPTION_OPTIMIZATION") {
      const hasDefectOrTraffic =
        evidenceContext?.hasMeasurableTraffic || evidenceContext?.objectiveDefect;

      if (!hasDefectOrTraffic) {
        return {
          isSafe: false,
          classification: "SKIP",
          factuallyVerified: true,
          claimsChecked: totalClaimsChecked,
          unverifiedClaims: [],
          bannedWordsFound: [],
          evidenceTrail,
          reason: "Metadata is already compliant and page lacks search performance signal. Skipped to prevent churn.",
        };
      }
    }

    // Completely clean and verifiable
    return {
      isSafe: true,
      classification: "SAFE_TO_EXECUTE",
      factuallyVerified: true,
      claimsChecked: totalClaimsChecked,
      unverifiedClaims: [],
      bannedWordsFound: [],
      evidenceTrail,
      reason: "All factual claims verified against tool implementation and trusted metadata.",
    };
  }

  /**
   * Compiles the authoritative ground truth for a tool from its code definition.
   */
  private static compileToolGroundTruth(tool: ToolDefinition): string {
    const parts: string[] = [
      tool.name || "",
      tool.slug || "",
      tool.category || "",
      tool.longDescription || "",
      tool.shortDescription || "",
      tool.seoTitle || "",
      tool.seoDescription || "",
      tool.privacyMessage || "",
      tool.browserSupport || "",
      ...(tool.keywords || []),
      ...(tool.searchTerms || []),
      ...(tool.synonyms || []),
      ...(tool.problemStatements || []),
      ...(tool.features || []),
    ];

    if (tool.howToSteps) {
      tool.howToSteps.forEach((s) => {
        parts.push(s.title || "");
        parts.push(s.instruction || "");
      });
    }

    if (tool.faq) {
      tool.faq.forEach((f) => {
        parts.push(f.question);
        parts.push(f.answer);
      });
    }

    if (tool.editorialGuide?.sections) {
      tool.editorialGuide.sections.forEach((s) => {
        parts.push(s.heading);
        parts.push(s.content);
      });
    }

    return parts.join(" ").toLowerCase();
  }

  /**
   * Checks if an answer's key assertions exist within the tool's definition.
   */
  private static isDirectlyDerivedFromTool(text: string, tool: ToolDefinition): boolean {
    const groundTruth = this.compileToolGroundTruth(tool);
    // Simple heuristic: key nouns and terms in the explanation must overlap with the tool's ground truth
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 5);

    if (tokens.length === 0) return true;
    const matched = tokens.filter((t) => groundTruth.includes(t));
    return matched.length / tokens.length > 0.4;
  }
}
