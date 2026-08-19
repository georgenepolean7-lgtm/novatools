"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { searchTools } from "@/lib/tools/search";
import { Search, ArrowRight, X } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTools(query.trim()).slice(0, 6);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto lg:mx-0 mt-8 z-30">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search 250+ tools (e.g. compress pdf, emi, gst, json, resize photo, tamil)..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl divide-y divide-slate-800/80 max-h-[380px] overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Tools ({results.length})</span>
                <span className="text-cyan-400">250 Total Active</span>
              </div>
              <div className="py-1 space-y-1">
                {results.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/90 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold shrink-0">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {tool.category}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-2 px-3 pb-1 text-center">
                <Link
                  href="#all-tools"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>View all tools matching in directory</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <p>No direct matches found for &quot;{query}&quot;</p>
              <Link
                href="#all-tools"
                onClick={() => setIsOpen(false)}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Browse all 250 tools by category →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Category Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <span className="text-[11px] text-slate-500">Quick:</span>
        {["PDF", "Image", "EMI", "GST", "JSON", "QR Code", "Tamil", "Password"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setQuery(cat);
              setIsOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 text-[11px] font-medium transition-all"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
