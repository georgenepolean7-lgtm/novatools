import { ToolDefinition, ToolCategory } from "./tool-types";
import { getAllTools } from "./registry";
import { rankToolRelevance, RankedSearchResult } from "./ranking";

export interface SearchOptions {
  category?: ToolCategory;
  limit?: number;
  featuredOnly?: boolean;
}

export function searchTools(query: string, options?: SearchOptions): ToolDefinition[] {
  const all = getAllTools();
  const q = query.trim();

  let candidates = all;
  if (options?.category) {
    candidates = candidates.filter((t) => t.category === options.category);
  }
  if (options?.featuredOnly) {
    candidates = candidates.filter((t) => t.isFeatured);
  }

  if (!q) {
    // If no search query, return sorted by priority
    return candidates.sort((a, b) => b.priority - a.priority).slice(0, options?.limit || candidates.length);
  }

  const scored: RankedSearchResult[] = candidates
    .map((tool) => rankToolRelevance(tool, q))
    .filter((res) => res.score > 10);

  scored.sort((a, b) => b.score - a.score);

  const results = scored.map((s) => s.tool);
  return results.slice(0, options?.limit || results.length);
}
