import type { Metadata } from "next";
import { getKeywordString } from "@/lib/seo/getKeywords";

type ToolMetadataProps = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
};

export function createToolMetadata({
  title,
  description,
  path,
  keywords,
}: ToolMetadataProps): Metadata {
  return {
    title,
    description,

    keywords: [
      ...keywords,
      ...getKeywordString(path.replace("/", "")).split(", "),
    ],

    alternates: {
      canonical: path,
    },

    openGraph: {
      title,
      description,
      url: `https://novatool.in${path}`,
      siteName: "Nova Tools",
      type: "website",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}