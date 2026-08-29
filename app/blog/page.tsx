import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { getAllArticles } from "@/lib/blog/posts";
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides, Tutorials & Technical Documentation | Nova Tools Blog",
  description:
    "In-depth guides, step-by-step tutorials, and technical explainers on PDF management, image optimization, developer utilities, and in-browser privacy by Nova Tools.",
  alternates: {
    canonical: "https://novatool.in/blog",
  },
  openGraph: {
    title: "Guides, Tutorials & Technical Documentation | Nova Tools Blog",
    description:
      "In-depth guides, step-by-step tutorials, and technical explainers on PDF management, image optimization, developer utilities, and in-browser privacy by Nova Tools.",
    url: "https://novatool.in/blog",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function BlogHubPage() {
  const articles = getAllArticles();
  const featured = articles[0];
  const restArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <SiteHeader />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Blog & Guides", url: "https://novatool.in/blog" },
        ]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE &amp; TUTORIALS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Practical Guides &amp; Technical Explainers
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Detailed step-by-step tutorials, format comparisons, and technical insights to help you optimize documents, images, code, and calculations securely in your browser.
          </p>
        </div>

        {/* Featured Guide Hero Card */}
        {featured && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-cyan-950/40 border border-cyan-500/30 p-8 sm:p-12 shadow-2xl shadow-cyan-500/10">
            <div className="max-w-3xl space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider">
                  Featured Guide
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {featured.publishedAt}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white hover:text-cyan-300 transition-colors">
                <Link href={`/blog/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {featured.summary}
              </p>

              {/* Key Takeaways preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {featured.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all group"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              All Guides &amp; Documentation ({articles.length})
            </h2>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Fact-checked by Nova Tools Editorial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restArticles.map((article) => (
              <article
                key={article.slug}
                className="group flex flex-col justify-between p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-semibold uppercase text-[10px] tracking-wider">
                      {article.categoryName}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-mono">
                    {article.publishedAt}
                  </span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-cyan-400 group-hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cross-Link Category Showcase */}
        <section className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Explore All 250+ In-Browser Tools</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            All utilities run 100% locally on your device without server uploads. Clean, fast, and completely free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/tools"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Browse All Tools
            </Link>
            <Link
              href="/categories"
              className="px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
            >
              Explore Category Directory
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
