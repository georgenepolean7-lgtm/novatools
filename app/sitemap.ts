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
    {
      url: `${baseUrl}/jpg-to-png`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/png-to-jpg`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/webp-converter`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-cropper`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-rotator`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-to-base64`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-to-pdf`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-metadata`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gif-to-png`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bmp-to-jpg`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-page-extractor`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-page-deleter`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-watermark`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-password-protect`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-unlocker`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/word-counter`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/character-counter`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-converter`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/text-cleaner`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lorem-ipsum-generator`,
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