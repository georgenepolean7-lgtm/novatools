import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getCategoryById } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import { ToolCategory } from "@/lib/tools/tool-types";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryById(category);

  if (!meta) {
    return {
      title: "Category Not Found | Nova Tools",
      description: "Category could not be found.",
    };
  }

  const title = `${meta.name} - Free Online In-Browser Tools | Nova Tools`;
  const description = `${meta.description} 100% private, free, and in-browser utilities by Nova Tools.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://novatool.in/categories/${meta.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://novatool.in/categories/${meta.id}`,
      siteName: "Nova Tools",
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = getCategoryById(category);

  if (!meta) {
    notFound();
  }

  const tools = getToolsByCategory(meta.id as ToolCategory);

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Categories", url: "https://novatool.in#categories" },
          { name: meta.name, url: `https://novatool.in/categories/${meta.id}` },
        ]}
      />

      {/* Decorative Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-cyan-600/15 blur-[140px]" />
        <div className="absolute -right-40 top-[30%] h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 sm:py-20 space-y-12">
        {/* Category Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <span>CATEGORY DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            {meta.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {meta.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {meta.popularKeywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Available Tools ({tools.length})
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Client-Side Privacy
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Zap className="w-4 h-4" /> Instant
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      {t.difficulty}
                    </span>
                    {t.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {t.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm text-cyan-400 font-semibold pt-2 border-t border-slate-800/60">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
