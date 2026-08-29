import React from "react";
import { BlogArticle } from "@/lib/blog/types";

interface ArticleSchemaProps {
  article: BlogArticle;
}

export default function ArticleSchema({ article }: ArticleSchemaProps) {
  const url = `https://novatool.in/blog/${article.slug}`;

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    image: `https://novatool.in/icon.png`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: article.author.name,
      url: "https://novatool.in/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Nova Tools",
      url: "https://novatool.in",
      logo: {
        "@type": "ImageObject",
        url: "https://novatool.in/icon.png",
      },
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://novatool.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog & Guides",
        item: "https://novatool.in/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  // Optional FAQ Schema
  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
