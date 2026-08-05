import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://novatool.in";

  const routes = [
    {
      url: `${baseUrl}`,
      priority: 1,
    },
    {
      url: `${baseUrl}/compress-image`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compress-pdf`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-resizer`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jpg-to-pdf`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/merge-pdf`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-to-jpg`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rotate-pdf`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signature-resizer`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/split-pdf`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tamil-image-to-text`,
      priority: 0.9,
    },
  ];

  return routes.map((route) => ({
    url: route.url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}