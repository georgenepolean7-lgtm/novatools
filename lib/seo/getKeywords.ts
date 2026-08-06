import { seoKeywords } from "./seoKeywords";

export function getKeywords(slug: string): string[] {
  return seoKeywords[slug as keyof typeof seoKeywords] ?? [];
}

export function getKeywordString(slug: string): string {
  return getKeywords(slug).join(", ");
}