import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getAllTools } from "@/lib/tools/registry";
import { DynamicToolHost } from "@/components/tools/DynamicToolHost";

interface PageProps {
  params: Promise<{ toolSlug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((t) => ({
    toolSlug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    return {
      title: "Tool Not Found | Nova Tools",
      description: "The requested tool could not be found.",
    };
  }

  const rawTitle = (tool.seoTitle || tool.name).trim();
  const cleanTitle = rawTitle.replace(/(\s*\|\s*Nova Tools\s*)+$/i, "").trim();
  const hasBrandSuffix = /\|\s*Nova Tools\s*$/i.test(rawTitle);
  const fullTitle = `${cleanTitle} | Nova Tools`;

  return {
    title: hasBrandSuffix ? { absolute: fullTitle } : cleanTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: `https://novatool.in/${tool.slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: tool.seoDescription,
      url: `https://novatool.in/${tool.slug}`,
      siteName: "Nova Tools",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function DynamicToolPage({ params }: PageProps) {
  const { toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    notFound();
  }

  return <DynamicToolHost tool={tool} />;
}
