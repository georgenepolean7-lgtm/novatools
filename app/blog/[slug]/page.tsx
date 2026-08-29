import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleSchema from "@/components/blog/ArticleSchema";
import { getAllArticles, getArticleBySlug, getRelatedArticlesFor } from "@/lib/blog/posts";
import { getToolBySlug } from "@/lib/tools/registry";
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Info,
  ExternalLink,
} from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Nova Tools",
      description: "The requested guide could not be found.",
    };
  }

  const fullTitle = `${article.seoTitle} | Nova Tools`;

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: `https://novatool.in/blog/${article.slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: article.seoDescription,
      url: `https://novatool.in/blog/${article.slug}`,
      siteName: "Nova Tools",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: article.seoDescription,
    },
  };
}

export default async function IndividualArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticlesFor(article.slug, 3);
  const primaryTool = getToolBySlug(article.primaryToolSlug);
  const relatedTools = article.relatedToolSlugs
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <SiteHeader />
      <ArticleSchema article={article} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Back Link & Category */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </Link>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase text-[10px]">
            {article.categoryName}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-6 border-b border-slate-800 pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-slate-300">
              <User className="w-4 h-4 text-cyan-400" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Updated: {article.updatedAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {article.summary}
          </p>
        </header>

        {/* Key Takeaways Card */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-3 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Key Takeaways &amp; Quick Summary</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Table of Contents */}
        {article.tableOfContents && article.tableOfContents.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              In This Guide
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {article.tableOfContents.map((toc) => (
                <li key={toc.id}>
                  <a
                    href={`#${toc.id}`}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                  >
                    <span>•</span>
                    <span>{toc.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Tool Callout Card */}
        {primaryTool && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold">
                <Wrench className="w-3.5 h-3.5" />
                <span>ONLINE CLIENT-SIDE UTILITY</span>
              </div>
              <h3 className="text-lg font-bold text-white">{primaryTool.name}</h3>
              <p className="text-xs text-slate-300 max-w-lg">{primaryTool.shortDescription}</p>
            </div>
            <Link
              href={`/${primaryTool.slug}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Launch {primaryTool.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Main Content Body */}
        <article className="space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {article.content.intro}
          </p>

          {article.content.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 pt-4 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800/80 pb-2">
                {section.heading}
              </h2>

              {section.subheading && (
                <h3 className="text-lg font-semibold text-cyan-300">
                  {section.subheading}
                </h3>
              )}

              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Step by Step Cards */}
              {section.steps && section.steps.length > 0 && (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {section.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800"
                    >
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-extrabold flex items-center justify-center shrink-0 border border-cyan-500/30">
                        {st.stepNumber}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">{st.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{st.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Data Table */}
              {section.table && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-1 my-4">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-800/80 text-cyan-300 font-semibold">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {section.table.rows.map((r, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40">
                          {r.map((c, cIdx) => (
                            <td key={cIdx} className="p-3">
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Code Snippet */}
              {section.codeBlock && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
                  <pre>
                    <code>{section.codeBlock.code}</code>
                  </pre>
                </div>
              )}

              {/* Callout Box */}
              {section.callout && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 my-4 text-xs ${
                    section.callout.type === "warning"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                      : section.callout.type === "tip"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : "bg-cyan-500/10 border-cyan-500/30 text-cyan-200"
                  }`}
                >
                  {section.callout.type === "warning" ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  ) : section.callout.type === "tip" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">{section.callout.title}</span>
                    <p className="opacity-90">{section.callout.text}</p>
                  </div>
                </div>
              )}

              {/* Tips list */}
              {section.tips && section.tips.length > 0 && (
                <ul className="space-y-1.5 pt-2 text-xs sm:text-sm text-slate-300">
                  {section.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Conclusion */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="text-lg font-bold text-white">Summary &amp; Next Steps</h3>
            <p className="text-slate-300 text-sm">{article.content.conclusion}</p>
          </div>
        </article>

        {/* FAQs Section */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="space-y-4 border-t border-slate-800 pt-8">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => (
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

        {/* Related Tools Internal Links Grid */}
        {relatedTools.length > 0 && (
          <section className="space-y-4 border-t border-slate-800 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recommended Free In-Browser Tools
              </h2>
              <Link href="/tools" className="text-xs text-cyan-400 hover:underline">
                View All Tools
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="group p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-cyan-400">
                      {t.category}
                    </span>
                    <h3 className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{t.shortDescription}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles Internal Links Grid */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Related Tutorials &amp; Documentation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((relArt) => (
                <Link
                  key={relArt.slug}
                  href={`/blog/${relArt.slug}`}
                  className="group p-4 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      {relArt.readTime}
                    </span>
                    <h3 className="font-semibold text-white text-xs sm:text-sm group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {relArt.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium pt-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
