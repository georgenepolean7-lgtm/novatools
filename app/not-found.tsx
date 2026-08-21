import type { Metadata } from "next";
import Link from "next/link";
import { Home, Layers, ArrowRight, ShieldAlert } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist on Nova Tools. Browse our 250+ free client-side online tools.",
  robots: {
    index: false,
    follow: true,
  },
};

const POPULAR_TOOLS = [
  { name: "Merge PDF", slug: "merge-pdf", cat: "PDF" },
  { name: "Image Resizer", slug: "image-resizer", cat: "Image" },
  { name: "Compress PDF", slug: "compress-pdf", cat: "PDF" },
  { name: "Tamil Image to Text", slug: "tamil-image-to-text", cat: "Tamil" },
  { name: "Word Counter", slug: "word-counter", cat: "Text" },
  { name: "Case Converter", slug: "case-converter", cat: "Text" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ERROR 404 • RESOURCE NOT FOUND</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 tracking-tight">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              We couldn&apos;t find that tool or page.
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              The link you clicked may be outdated or the URL was mistyped. All 250+ utility tools are ready and waiting in our directory.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/#tools"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-white font-bold text-sm transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Browse All 250+ Tools</span>
            </Link>
          </div>

          {/* Popular Tools Pills */}
          <div className="pt-8 border-t border-slate-800/80 space-y-4">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Popular Utilities
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all group"
                >
                  <span>{tool.name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}