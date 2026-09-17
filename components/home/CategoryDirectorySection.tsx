import React from "react";
import Link from "next/link";
import { FolderTree, ArrowRight } from "lucide-react";
import { getAllCategories } from "@/lib/tools/categories";
import { getToolDirectoryItems } from "@/lib/tools/directory-index";

export default function CategoryDirectorySection() {
  const masterCategories = getAllCategories();
  const allTools = getToolDirectoryItems();

  // Active categories: only those with at least 1 active tool
  const activeCategories = masterCategories
    .map((cat) => ({
      ...cat,
      tools: allTools.filter((t) => t.category === cat.id),
    }))
    .filter((cat) => cat.tools.length > 0)
    .sort((a, b) => b.tools.length - a.tools.length);

  const totalActiveTools = allTools.length;
  const totalActiveCategories = activeCategories.length;
  const masterTaxonomyCount = masterCategories.length;
  const upcomingCategoriesCount = masterTaxonomyCount - totalActiveCategories;

  return (
    <section
      id="category-directory"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 [content-visibility:auto] [contain-intrinsic-size:1px_900px] scroll-mt-20"
    >
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
              <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
              <span>CATEGORY DIRECTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Browse Tools by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Explore dedicated topic hubs across {totalActiveTools} tools organized into {totalActiveCategories} active categories. Every utility is engineered for in-browser speed and zero-upload privacy.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>Taxonomy Overview ({masterTaxonomyCount} Categories)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Category Cards Grid (16 Active Suites with Real Counts - No 0 counts) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeCategories.map((cat) => {
            const catTools = cat.tools;
            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/categories/${cat.id}`}
                      className="text-sm font-bold text-white hover:text-cyan-300 transition-colors truncate"
                      title={cat.name}
                    >
                      {cat.name}
                    </Link>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 shrink-0">
                      {catTools.length} tools
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <ul className="space-y-1 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                    {catTools.slice(0, 4).map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          href={`/${tool.slug}`}
                          className="hover:text-cyan-300 hover:underline truncate block"
                          title={tool.name}
                        >
                          • {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <Link
                    href={`/categories/${cat.id}`}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View all {catTools.length} {cat.name}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Taxonomy Status Note (Master Taxonomy Preserved) */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span>
              <strong>{totalActiveTools} tools</strong> across <strong>{totalActiveCategories} categories</strong> are live and ready to use in your browser. {upcomingCategoriesCount} additional suites (AI, Media, OCR, Business) are scheduled on our product roadmap.
            </span>
          </div>

          <Link
            href="/categories"
            className="text-cyan-400 hover:text-cyan-300 font-semibold shrink-0 inline-flex items-center gap-1"
          >
            <span>Explore All 25 Taxonomy Guides</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
