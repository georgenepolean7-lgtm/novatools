import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/tools/registry";
import { getAllCategories } from "@/lib/tools/categories";
import { programmaticPages } from "@/lib/seo/programmaticPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://novatool.in";
  const now = new Date();

  // 1. Core Homepage
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. All Registry Tools (Core 30 + Dynamic Suite)
  const toolRoutes: MetadataRoute.Sitemap = getAllTools().map((t) => ({
    url: `${baseUrl}/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: t.isFeatured ? 0.95 : 0.85,
  }));

  // 3. Category Hub Pages
  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${baseUrl}/categories/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. Programmatic SEO Landing Pages
  const progRoutes: MetadataRoute.Sitemap = Object.values(programmaticPages)
    .flat()
    .map((p) => ({
      url: `${baseUrl}/tools/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const merged: MetadataRoute.Sitemap = [];

  [...staticRoutes, ...toolRoutes, ...categoryRoutes, ...progRoutes].forEach((entry) => {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      merged.push(entry);
    }
  });

  return merged;
}