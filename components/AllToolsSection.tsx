"use client";

import { useMemo, useState } from "react";
import ToolCard from "./ToolCard";
import { getToolDirectoryItems } from "@/lib/tools/directory-index";
import { searchTools } from "@/lib/tools/search";
import { getAllCategories } from "@/lib/tools/categories";
import { ToolCategory } from "@/lib/tools/tool-types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Layers,
} from "lucide-react";

const PAGE_SIZE = 30;

type SortOption = "default" | "name-asc" | "name-desc" | "category";

export default function AllToolsSection() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);

  const allCategories = useMemo(() => getAllCategories(), []);
  const allTools = useMemo(() => getToolDirectoryItems(), []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let list = allTools;
    if (search.trim()) {
      list = searchTools(search, {
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });
    } else if (selectedCategory !== "all") {
      list = allTools.filter((t) => t.category === selectedCategory);
    }

    // Apply sorting
    return [...list].sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0; // default order from registry
    });
  }, [search, selectedCategory, sortBy, allTools]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: ToolCategory | "all") => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Calculate pagination parameters
  const totalTools = filteredTools.length;
  const totalPages = Math.ceil(totalTools / PAGE_SIZE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalTools);
  const currentTools = useMemo(() => {
    return filteredTools.slice(startIndex, endIndex);
  }, [filteredTools, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smoothly scroll to the top of the All Tools section
    const el = document.getElementById("all-tools");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generate page numbers to display with smart ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages);
      }
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  return (
    <section id="all-tools" className="relative overflow-hidden bg-slate-950 py-20 text-white scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(34,211,238,0.06),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(59,130,246,0.06),transparent_40%)]" />
      <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-cyan-500/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-xl">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nova Tools Directory</span>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Complete Tools Collection,
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Fast, Private &amp; 100% Free.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400">
            Browse all 250+ in-browser utilities across PDF, Image, Developer, Financial, GST, Tamil, and Data formats with zero server queues.
          </p>
        </div>

        {/* Global Search and Filter Bar */}
        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-5 text-slate-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search 250+ tools by name, keyword or tag (e.g. compress pdf, emi, gst, json, resize photo, tanglish)..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 pl-14 pr-24 py-4 text-sm text-white placeholder:text-slate-500 shadow-xl backdrop-blur-xl outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls Bar: Category Pills + Sort Selector */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                All Tools ({allTools.length})
              </button>
              {allCategories.map((cat) => {
                const count = allTools.filter((t) => t.category === cat.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                        : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="bg-transparent text-white outline-none cursor-pointer text-xs font-medium"
                >
                  <option value="default" className="bg-slate-900 text-white">Recommended</option>
                  <option value="name-asc" className="bg-slate-900 text-white">Name: A to Z</option>
                  <option value="name-desc" className="bg-slate-900 text-white">Name: Z to A</option>
                  <option value="category" className="bg-slate-900 text-white">Category</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Results Info */}
        <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            {totalTools > 0 ? (
              <span>
                Showing <strong className="text-white">{startIndex + 1}–{endIndex}</strong> of{" "}
                <strong className="text-cyan-400">{totalTools}</strong> tools
                {selectedCategory !== "all" && (
                  <span className="ml-1.5 text-slate-400">
                    in <span className="text-cyan-300 font-semibold capitalize">{selectedCategory}</span>
                  </span>
                )}
                {search && (
                  <span className="ml-1.5 text-slate-400">
                    for &ldquo;<span className="text-white font-semibold">{search}</span>&rdquo;
                  </span>
                )}
              </span>
            ) : (
              <span>No matching tools found</span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="text-xs text-slate-400 font-mono">
              Page <span className="text-cyan-300 font-bold">{safeCurrentPage}</span> of {totalPages}
            </div>
          )}
        </div>

        {/* Responsive Tool Cards Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */}
        {currentTools.length > 0 ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.name}
                description={tool.shortDescription}
                icon={
                  tool.category === "pdf"
                    ? "📄"
                    : tool.category === "image"
                    ? "🖼️"
                    : tool.category === "developer"
                    ? "💻"
                    : tool.category === "calculators"
                    ? "🧮"
                    : tool.category === "finance"
                    ? "💰"
                    : tool.category === "tamil"
                    ? "🇮🇳"
                    : "⚡"
                }
                href={`/${tool.slug}`}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Fallback */
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl my-6">
            <p className="text-4xl">🔍</p>
            <h4 className="mt-4 text-xl font-bold text-white">No matching tools found</h4>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              We couldn&apos;t find any tool matching &quot;{search}&quot;. Try broader terms like &quot;pdf&quot;, &quot;compress&quot;, &quot;tax&quot;, &quot;image&quot;, or &quot;format&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-6 rounded-xl bg-cyan-500/20 px-5 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors cursor-pointer"
            >
              Reset Filters &amp; View All Tools
            </button>
          </div>
        )}

        {/* Pagination Navigation Bar */}
        {totalPages > 1 && (
          <nav
            aria-label="Tools pagination"
            className="mt-12 flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-slate-800/80"
          >
            {/* Previous Page Button */}
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1.5">
              {pageNumbers.map((page, idx) => {
                if (typeof page === "string") {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-500 text-xs font-mono">
                      …
                    </span>
                  );
                }
                const isActive = page === safeCurrentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-9 w-9 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                        : "border border-slate-800 bg-slate-900/90 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}