import { ToolCategory } from "./tool-types";
import { ToolDirectoryItem, getToolDirectoryItems } from "./directory-index";

export interface SearchOptions {
  category?: ToolCategory;
  limit?: number;
  featuredOnly?: boolean;
}

export function searchTools(query: string, options?: SearchOptions): ToolDirectoryItem[] {
  const all = getToolDirectoryItems();
  const q = query.trim().toLowerCase();

  let candidates = all;
  if (options?.category) {
    candidates = candidates.filter((t) => t.category === options.category);
  }
  if (options?.featuredOnly) {
    candidates = candidates.filter((t) => t.isFeatured);
  }

  if (!q) {
    return [...candidates]
      .sort((a, b) => b.priority - a.priority)
      .slice(0, options?.limit || candidates.length);
  }

  // Fast token & prefix weighted search
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = candidates
    .map((tool) => {
      let score = 0;
      const nameLower = tool.name.toLowerCase();
      const slugLower = tool.slug.toLowerCase();
      const descLower = tool.shortDescription.toLowerCase();

      if (nameLower === q || slugLower === q) score += 1000;
      else if (nameLower.startsWith(q)) score += 600;
      else if (nameLower.includes(q)) score += 400;

      for (const kw of tool.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === q) score += 350;
        else if (kwLower.includes(q)) score += 150;
      }

      // Check multi-term presence
      for (const term of terms) {
        if (nameLower.includes(term)) score += 80;
        if (descLower.includes(term)) score += 30;
      }

      return { tool, score };
    })
    .filter((item) => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.tool).slice(0, options?.limit || scored.length);
}
