import { ToolDefinition, ToolCategory } from "./tool-types";
import { pdfTools } from "@/data/tools/pdf";
import { imageTools } from "@/data/tools/image";
import { textTools } from "@/data/tools/text";
import { developerTools } from "@/data/tools/developer";
import { calculatorTools } from "@/data/tools/calculators";
import { indiaTools } from "@/data/tools/india";
import { tamilTools } from "@/data/tools/tamil";
import { dataTools } from "@/data/tools/data";
import { seoTools } from "@/data/tools/seo";
import { webmasterTools } from "@/data/tools/webmaster";
import { financeTools } from "@/data/tools/finance";
import { educationTools } from "@/data/tools/education";
import { accessibilityTools } from "@/data/tools/accessibility";
import { privacyTools } from "@/data/tools/privacy";
import { qrTools } from "@/data/tools/qr";
import { fileTools } from "@/data/tools/file";

// Aggregated Master Tool Collection
const ALL_TOOLS: ToolDefinition[] = [
  ...pdfTools,
  ...imageTools,
  ...textTools,
  ...developerTools,
  ...calculatorTools,
  ...indiaTools,
  ...tamilTools,
  ...dataTools,
  ...seoTools,
  ...webmasterTools,
  ...financeTools,
  ...educationTools,
  ...accessibilityTools,
  ...privacyTools,
  ...qrTools,
  ...fileTools,
];

// In-Memory Index Maps for O(1) Lookups
const TOOL_MAP_BY_SLUG = new Map<string, ToolDefinition>();
const TOOL_MAP_BY_ID = new Map<string, ToolDefinition>();

ALL_TOOLS.forEach((t) => {
  TOOL_MAP_BY_SLUG.set(t.slug, t);
  TOOL_MAP_BY_ID.set(t.id, t);
});

export function getAllTools(): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.isEnabled);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOL_MAP_BY_SLUG.get(slug);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOL_MAP_BY_ID.get(id);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.category === category && t.isEnabled);
}

export function getFeaturedTools(): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.isFeatured && t.isEnabled).sort((a, b) => b.priority - a.priority);
}

export function getRelatedToolsFor(slug: string, limit: number = 4): ToolDefinition[] {
  const current = getToolBySlug(slug);
  if (!current) return [];

  // Try explicit related tools first
  const explicit = current.relatedTools
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolDefinition => !!t && t.slug !== slug);

  if (explicit.length >= limit) return explicit.slice(0, limit);

  // Fallback to same category tools
  const sameCategory = getToolsByCategory(current.category).filter(
    (t) => t.slug !== slug && !explicit.some((e) => e.slug === t.slug)
  );

  return [...explicit, ...sameCategory].slice(0, limit);
}
