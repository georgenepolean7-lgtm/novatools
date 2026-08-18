import { ToolDefinition } from "./tool-types";

export interface RankedSearchResult {
  tool: ToolDefinition;
  score: number;
  matchReasons: string[];
}

export function rankToolRelevance(tool: ToolDefinition, query: string): RankedSearchResult {
  const q = query.toLowerCase().trim();
  if (!q) return { tool, score: 0, matchReasons: [] };

  const terms = q.split(/\s+/).filter(Boolean);
  let score = 0;
  const matchReasons: string[] = [];

  const nameLower = tool.name.toLowerCase();
  const slugLower = tool.slug.toLowerCase();
  const shortDescLower = tool.shortDescription.toLowerCase();

  // 1. Exact Name Match (Highest Weight: 1000)
  if (nameLower === q || slugLower === q) {
    score += 1000;
    matchReasons.push("Exact Name Match");
  } else if (nameLower.startsWith(q)) {
    score += 600;
    matchReasons.push("Prefix Name Match");
  } else if (nameLower.includes(q)) {
    score += 400;
    matchReasons.push("Partial Name Match");
  }

  // 2. Keyword & Synonym Matches (Weight: 200 - 350)
  tool.keywords.forEach((kw) => {
    const kwLower = kw.toLowerCase();
    if (kwLower === q) {
      score += 350;
      matchReasons.push(`Exact Keyword: "${kw}"`);
    } else if (kwLower.includes(q)) {
      score += 150;
    }
  });

  tool.synonyms.forEach((syn) => {
    if (syn.toLowerCase().includes(q)) {
      score += 180;
      matchReasons.push(`Synonym Match: "${syn}"`);
    }
  });

  // 3. User Problem Statement Matches (Weight: 150)
  tool.problemStatements.forEach((prob) => {
    if (prob.toLowerCase().includes(q)) {
      score += 150;
      matchReasons.push("Solves User Problem");
    }
  });

  // 4. Token-by-token Term Coverage
  let matchedTerms = 0;
  terms.forEach((term) => {
    if (
      nameLower.includes(term) ||
      tool.keywords.some((k) => k.toLowerCase().includes(term)) ||
      tool.synonyms.some((s) => s.toLowerCase().includes(term)) ||
      shortDescLower.includes(term) ||
      tool.category.toLowerCase().includes(term)
    ) {
      matchedTerms++;
      score += 50;
    }
  });

  if (matchedTerms === terms.length && terms.length > 1) {
    score += 200; // Multi-word full match bonus
  }

  // Factor in baseline tool priority
  score += (tool.priority || 50) * 0.1;

  return { tool, score, matchReasons };
}
