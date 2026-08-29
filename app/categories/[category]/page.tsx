import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { getAllCategories, getCategoryById, getCategoryEditorial } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import { getArticlesByCategory } from "@/lib/blog/posts";
import { ToolCategory } from "@/lib/tools/tool-types";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import UPDFRecommendation from "@/components/affiliate/UPDFRecommendation";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Users,
  Cpu,
  Layers,
} from "lucide-react";

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

  const baseTitle = `${meta.name} - Free Online Utilities & Guides`;
  const description = `${meta.description} 100% private, free, and in-browser utilities by Nova Tools.`;

  return {
    title: baseTitle,
    description,
    alternates: {
      canonical: `https://novatool.in/categories/${meta.id}`,
    },
    openGraph: {
      title: `${baseTitle} | Nova Tools`,
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
  const editorial = getCategoryEditorial(meta.id);
  const relatedArticles = getArticlesByCategory(meta.id);

  // Category FAQ JSON-LD Schema
  const faqSchema =
    editorial.faqs && editorial.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: editorial.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Categories", url: "https://novatool.in/categories" },
          { name: meta.name, url: `https://novatool.in/categories/${meta.id}` },
        ]}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Category Hero Header */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <Layers className="w-3.5 h-3.5" />
            <span>CATEGORY DIRECTORY &amp; DOCUMENTATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            {meta.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {editorial.overview}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {meta.popularKeywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Practical Workflows & Technical Capabilities Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Who is it for */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>Who Should Use These Tools?</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {editorial.whoIsItFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Capabilities */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Key Capabilities &amp; Architecture</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {editorial.keyCapabilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Available Tools Grid */}
        <section className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Available Tools in {meta.name} ({tools.length})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All tools run 100% locally in your browser with zero server uploads.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-4 h-4" /> Instant
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/20"
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
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {t.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-cyan-400 font-semibold pt-3 border-t border-slate-800/60">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Dedicated UPDF Recommendation for PDF category directory */}
          {meta.id === "pdf" && (
            <div className="pt-6">
              <UPDFRecommendation toolSlug="category-pdf" />
            </div>
          )}
        </section>

        {/* Related Blog Guides & Tutorials */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 border-t border-slate-800 pt-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>STEP-BY-STEP TUTORIALS</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Guides &amp; Technical Articles for {meta.name}
                </h2>
              </div>
              <Link href="/blog" className="text-xs text-cyan-400 hover:underline">
                View All Guides
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/blog/${art.slug}`}
                  className="group p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {art.readTime}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{art.summary}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-cyan-400 font-semibold pt-2 border-t border-slate-800/80">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category FAQs */}
        {editorial.faqs && editorial.faqs.length > 0 && (
          <section className="space-y-6 border-t border-slate-800 pt-10">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {meta.name} Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4 max-w-3xl">
              {editorial.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2"
                >
                  <h3 className="font-semibold text-white text-sm sm:text-base">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Architecture Callout */}
        <section className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>ZERO-UPLOAD SECURITY ARCHITECTURE</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {editorial.technicalArchitecture}
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
