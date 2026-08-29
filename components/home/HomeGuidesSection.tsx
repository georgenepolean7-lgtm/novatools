import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock, Sparkles } from "lucide-react";
import { BLOG_ARTICLES } from "@/lib/blog/posts";

export default function HomeGuidesSection() {
  const featuredSlugs = [
    "how-to-compress-pdf-without-losing-quality",
    "how-to-compress-images-for-web-performance",
    "developer-guide-to-safe-html-decoding",
    "gst-calculation-guide-india",
    "image-resizing-and-aspect-ratio-guide",
    "complete-guide-to-browser-based-privacy",
  ];

  const featuredArticles = featuredSlugs
    .map((slug) => BLOG_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 [content-visibility:auto]">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Technical Guides &amp; Tutorials
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Learn How Digital Utilities Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              In-depth editorial articles covering image compression algorithms, PDF formatting standards, web development security, and financial calculations.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>Browse All {BLOG_ARTICLES.length} Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((art) => (
            <Link
              key={art.slug}
              href={`/blog/${art.slug}`}
              className="group p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
                    <Sparkles className="w-3 h-3" />
                    <span>{art.categoryName}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
