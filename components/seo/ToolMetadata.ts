import type { Metadata } from "next";
import { getKeywords } from "@/lib/seo/getKeywords";

type ToolMetadataProps = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createToolMetadata({
  title,
  description,
  path,
  keywords = [],
}: ToolMetadataProps): Metadata {
  const slug = path.replace("/", "");

  const allKeywords = [
    ...new Set([
      ...keywords,
      ...getKeywords(slug),
    ]),
  ];

  return {
    title,
    description,

    keywords: allKeywords,

    authors: [
      {
        name: "Nova Code Tech",
      },
    ],

    creator: "Nova Code Tech",

    publisher: "Nova Code Tech",

    alternates: {
      canonical: `https://novatool.in${path}`,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },

    openGraph: {
      title: `${title} | Nova Tools`,
      description,
      url: `https://novatool.in${path}`,
      siteName: "Nova Tools",
      locale: "en_IN",
      type: "website",

      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${title} | Nova Tools`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | Nova Tools`,
      description,

      images: [
        "/og-image.png",
      ],
    },
  };
}