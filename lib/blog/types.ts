export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogTableOfContentsItem {
  id: string;
  title: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: "pdf" | "image" | "text" | "developer" | "calculators" | "ocr" | "privacy";
  categoryName: string;
  readTime: string; // e.g. "5 min read"
  publishedAt: string; // ISO string or human date
  updatedAt: string;
  author: {
    name: string;
    role: string;
    entity: string;
  };
  summary: string;
  keyTakeaways: string[];
  tableOfContents: BlogTableOfContentsItem[];
  content: {
    intro: string;
    sections: {
      id: string;
      heading: string;
      subheading?: string;
      paragraphs: string[];
      steps?: {
        stepNumber: number;
        title: string;
        description: string;
      }[];
      tips?: string[];
      table?: {
        headers: string[];
        rows: string[][];
      };
      codeBlock?: {
        language: string;
        code: string;
      };
      callout?: {
        type: "tip" | "info" | "warning" | "security";
        title: string;
        text: string;
      };
    }[];
    conclusion: string;
  };
  faqs: BlogFAQ[];
  primaryToolSlug: string;
  relatedToolSlugs: string[];
  relatedArticleSlugs: string[];
}
