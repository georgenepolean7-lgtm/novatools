export type ToolCategory =
  | "pdf"
  | "image"
  | "text"
  | "ocr"
  | "developer"
  | "calculators"
  | "seo"
  | "file"
  | "qr"
  | "business"
  | "finance"
  | "education"
  | "productivity"
  | "accessibility"
  | "privacy"
  | "ai"
  | "audio"
  | "video"
  | "social"
  | "marketing"
  | "webmaster"
  | "data"
  | "design"
  | "india"
  | "tamil";

export type InputType =
  | "text"
  | "file"
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "number"
  | "json"
  | "sql"
  | "csv"
  | "svg"
  | "none";

export type OutputType =
  | "text"
  | "file"
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "number"
  | "json"
  | "sql"
  | "csv"
  | "svg"
  | "data-url"
  | "zip";

export interface HowToStep {
  step: number;
  title: string;
  instruction: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  subcategory?: string;
  keywords: string[];
  searchTerms: string[];
  synonyms: string[];
  problemStatements: string[];
  inputTypes: InputType[];
  outputTypes: OutputType[];
  features: string[];
  howToSteps: HowToStep[];
  faq: ToolFAQ[];
  relatedTools: string[]; // slugs
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  processingType: "client" | "web-worker" | "wasm" | "server";
  privacyMessage: string;
  browserSupport: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  priority: number;
  isPremium: boolean;
  isFeatured: boolean;
  isEnabled: boolean;
  iconName: string;
  engineComponent: string; // Identifier for client widget dispatcher
  supportedFormats?: string[];
  limitations?: string[];
  customParams?: Record<string, unknown>;
}

export interface CategoryMetadata {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
  badgeColor: string;
  gradient: string;
  popularKeywords: string[];
}
