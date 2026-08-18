import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/tools/categories";
import { getAllTools } from "@/lib/tools/registry";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tool Categories Directory | Nova Tools",
  description: "Explore all utility tool categories on Nova Tools: PDF, Image, Developer, Tamil, Finance, Text, CSS, SEO, and Security tools.",
  alternates: {
    canonical: "https://novatool.in/categories",
  },
  openGraph: {
    title: "Tool Categories Directory | Nova Tools",
    description: "Browse 250+ tools across 16 specialized categories.",
    url: "https://novatool.in/categories",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function CategoriesDirectoryPage() {
  const categories = getAllCategories();
  const allTools = getAllTools();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Categories", url: "https://novatool.in/categories" },
        ]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CATEGORIES DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Explore Tools by <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Specialized Category
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Find the exact in-browser utility you need across our 16 curated categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = allTools.filter((t) => t.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
                      {count} Tools
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {cat.popularKeywords.slice(0, 3).map((kw) => (
                    <span key={kw} className="text-[10px] text-slate-400 font-mono">
                      #{kw}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
