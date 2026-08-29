import Link from "next/link";
import { ChevronDown, HelpCircle, Shield, Zap, Globe, FolderTree } from "lucide-react";
import { getAllCategories } from "@/lib/tools/categories";
import { getToolDirectoryItems } from "@/lib/tools/directory-index";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is Nova Tools and how do in-browser tools work?",
    answer:
      "Nova Tools is a suite of 250+ free, high-performance web utilities for PDFs, images, code formatting, calculations, India compliance, Tamil linguistic tools, and data conversions. All processing runs 100% locally inside your web browser using WebAssembly, Web Audio, HTML5 Canvas, and modern browser APIs. Your files, documents, and data are never uploaded to any remote server or third-party queue.",
  },
  {
    question: "Are Nova Tools free to use, and is signup required?",
    answer:
      "Yes, all 250+ utilities on Nova Tools are completely free to use with zero registration, no software downloads, and no watermarks. You can convert, compress, calculate, or format files immediately upon loading the page.",
  },
  {
    question: "Are my sensitive files (such as Aadhaar, PAN, invoices, and PDFs) secure?",
    answer:
      "Yes. Because processing happens strictly on your local device (client-side), your files never leave your computer or phone. No file data, text, or images are transmitted over the internet or saved to external databases.",
  },
  {
    question: "How do I compress images or PDFs to exact government portal sizes (e.g. 50KB, 100KB, 200KB)?",
    answer:
      "Nova Tools includes specialized target-size compressors such as 'Compress Image to 50KB', 'Compress Image to 100KB', 'Compress Image to 200KB', and 'Signature Resizer'. Simply upload your file, select your desired dimensions and file size threshold, and download the portal-ready file.",
  },
  {
    question: "Does Nova Tools support regional and Tamil language processing?",
    answer:
      "Yes! Nova Tools features a dedicated suite of Tamil utilities including BAMINI to Unicode converter, Tanglish to Tamil transliteration, Tamil Image OCR, Tamil Number to Words converter, and Tamil Typing Speed Tester.",
  },
  {
    question: "Can I use Nova Tools on mobile phones and tablets?",
    answer:
      "Absolutely. Nova Tools is engineered with a responsive, touch-optimized interface that works seamlessly on iPhones, iPads, Android smartphones, Windows PCs, Macs, and Linux devices without requiring app installations.",
  },
];

export default function SeoFaqSection() {
  const categories = getAllCategories();
  const allTools = getToolDirectoryItems();

  // Structured Data for Google Rich Snippets (FAQPage)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="relative overflow-hidden bg-slate-950/90 py-20 text-white border-t border-slate-900 [content-visibility:auto]">
      {/* JSON-LD Schema for Google Search Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Value Proposition Highlights */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Client-Side Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by modern WebAssembly and JavaScript engines. No upload delays, no server queues, and zero file transfer overhead.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Strict Privacy Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your sensitive documents, photos, and financial numbers remain 100% on your machine. Zero tracking of user-generated file contents.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Domain Tool Arsenal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              250+ dedicated utilities spanning PDF engineering, image manipulation, India tax compliance, developer converters, and Tamil tools.
            </p>
          </div>
        </div>

        {/* Crawlable Category & Tools Directory for Search Engines */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2.5">
            <FolderTree className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Browse Tools by Category</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Explore dedicated topic hubs across 16 categories. Each category contains tailored tools optimized for speed, precision, and zero-loss conversions.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
            {categories.map((cat) => {
              const catTools = allTools.filter((t) => t.category === cat.id);
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2.5 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/categories/${cat.id}`}
                      className="text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {catTools.length}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400">
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
                    {catTools.length > 4 && (
                      <li className="pt-1">
                        <Link
                          href={`/categories/${cat.id}`}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          + View all {catTools.length} tools →
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Guides & Tutorials Showcase */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>STEP-BY-STEP GUIDES &amp; TUTORIALS</span>
              </div>
              <h3 className="text-xl font-bold text-white">Technical Documentation &amp; How-To Articles</h3>
            </div>
            <Link
              href="/blog"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
            >
              Browse All Guides →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
            <Link
              href="/blog/how-to-compress-pdf-without-losing-quality"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase">PDF Guide</span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  How to Compress a PDF Without Losing Quality
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Learn DPI downsampling and vector font retention for strict portal limits.
                </p>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold pt-1">Read Guide →</span>
            </Link>

            <Link
              href="/blog/how-to-compress-images-for-web-performance"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Image Guide</span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  How to Compress Images for Web Performance &amp; LCP
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Optimize Largest Contentful Paint (LCP) and convert to modern WebP.
                </p>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold pt-1">Read Guide →</span>
            </Link>

            <Link
              href="/blog/how-to-format-and-validate-json-data"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Developer Guide</span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  How to Format, Validate, and Beautify JSON
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Fix syntax errors, trailing commas, and unquoted keys in REST APIs.
                </p>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold pt-1">Read Guide →</span>
            </Link>

            <Link
              href="/blog/zero-upload-architecture-how-in-browser-tools-protect-privacy"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Privacy &amp; Security</span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  Zero-Upload Architecture: In-Browser Privacy
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Why WebAssembly and local RAM processing keep files 100% confidential.
                </p>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold pt-1">Read Guide →</span>
            </Link>
          </div>
        </div>

        {/* Interactive SEO FAQ Section (Native HTML Details/Summary for 0 JS Cost) */}
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Everything You Need to Know About Nova Tools
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                open={index === 0}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <summary className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors cursor-pointer list-none select-none">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
