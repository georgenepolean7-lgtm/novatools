import React from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Calculator,
  Code2,
  Landmark,
  Type,
  Database,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { getToolDirectoryItems } from "@/lib/tools/directory-index";

interface ShortcutItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { id: "pdf", name: "PDF Tools", icon: FileText, accent: "text-rose-400 border-rose-500/20 bg-rose-500/10 hover:border-rose-500/40" },
  { id: "image", name: "Image Tools", icon: ImageIcon, accent: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10 hover:border-cyan-500/40" },
  { id: "calculators", name: "Calculators", icon: Calculator, accent: "text-amber-400 border-amber-500/20 bg-amber-500/10 hover:border-amber-500/40" },
  { id: "developer", name: "Developer", icon: Code2, accent: "text-purple-400 border-purple-500/20 bg-purple-500/10 hover:border-purple-500/40" },
  { id: "india", name: "India Tools", icon: Landmark, accent: "text-orange-400 border-orange-500/20 bg-orange-500/10 hover:border-orange-500/40" },
  { id: "text", name: "Text & Writing", icon: Type, accent: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:border-emerald-500/40" },
  { id: "data", name: "Data Tools", icon: Database, accent: "text-blue-400 border-blue-500/20 bg-blue-500/10 hover:border-blue-500/40" },
  { id: "privacy", name: "Security & Privacy", icon: ShieldCheck, accent: "text-teal-400 border-teal-500/20 bg-teal-500/10 hover:border-teal-500/40" },
];

export default function QuickCategoryShortcuts() {
  const allTools = getToolDirectoryItems();
  const activeCategoriesCount = new Set(allTools.map((t) => t.category)).size;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8 [content-visibility:auto]">
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Popular Categories</span>
          </div>
          <Link
            href="#category-directory"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <span>View All {activeCategoriesCount} Active Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {SHORTCUTS.map((item) => {
            const Icon = item.icon;
            const count = allTools.filter((t) => t.category === item.id).length;

            return (
              <Link
                key={item.id}
                href={`/categories/${item.id}`}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm group ${item.accent}`}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate max-w-full">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                  {count} tools
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
