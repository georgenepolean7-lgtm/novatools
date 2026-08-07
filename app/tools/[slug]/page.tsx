import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ToolContent from "@/components/seo/ToolContent";
import { programmaticPages } from "@/lib/seo/programmaticPages";
import FAQSection from "@/components/seo/FAQSection";
import RelatedToolsSection from "@/components/seo/RelatedToolsSection";
import HowToUse from "@/components/content/HowToUse";
import Benefits from "@/components/content/Benefits";


type PageData = {
  slug: string;
  title: string;
  description: string;
};

function findPage(slug: string): PageData | null {
  for (const pages of Object.values(programmaticPages)) {
    const page = pages.find((item) => item.slug === slug);
    if (page) return page;
  }

  return null;
}

export async function generateStaticParams() {
  return Object.values(programmaticPages)
    .flat()
    .map((page) => ({
      slug: page.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const page = findPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,

    alternates: {
      canonical: `/tools/${page.slug}`,
    },

    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://novatool.in/tools/${page.slug}`,
      siteName: "Nova Tools",
      type: "website",
    },
  };
}

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = findPage(slug);

  if (!page) {
    notFound();
  }

  return (
    
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">

        <h1 className="text-4xl font-bold">
          {page.title}
        </h1>

        <p className="mt-6 text-lg text-slate-300">
          {page.description}
        </p>

        <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-white/5 p-8">

          <h2 className="text-2xl font-bold">
            Use Nova Tools
          </h2>

          <p className="mt-4 text-slate-300">
            Open the relevant Nova Tools utility to complete this task online for free.
          </p>

        </div>

<HowToUse tool={page.title} />

<Benefits tool={page.title} />

<ToolContent
  title={page.title}
  description={page.description}
/>

<FAQSection
  title={page.title}
/>

<RelatedToolsSection
  currentSlug={page.slug}
/>

      </div>
    </main>
  );
}