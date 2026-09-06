import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { programmaticPages, ProgrammaticPageData } from "@/lib/seo/programmaticPages";
import ClientImageCompressor from "@/components/tools/ClientImageCompressor";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Sliders,
  Sparkles,
  HelpCircle,
  Layers,
  ChevronRight,
} from "lucide-react";

function findPage(slug: string): ProgrammaticPageData | null {
  for (const pages of Object.values(programmaticPages)) {
    const page = pages.find((item) => item.slug === slug);
    if (page) return page;
  }
  return null;
}

export async function generateStaticParams() {
  return Object.values(programmaticPages)
    .flat()
    .map((page) => ({
      slug: page.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: { absolute: `${page.title} | Nova Tools` },
    description: page.description,
    alternates: {
      canonical: `https://novatool.in/tools/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} | Nova Tools`,
      description: page.description,
      url: `https://novatool.in/tools/${page.slug}`,
      siteName: "Nova Tools",
      type: "website",
    },
  };
}

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findPage(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://novatool.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://novatool.in/categories/image",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: `https://novatool.in/tools/${page.slug}`,
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.title,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 Canvas and JavaScript support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: page.description,
    url: `https://novatool.in/tools/${page.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-black">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {page.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero / Header */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/categories/image" className="hover:text-cyan-400 transition-colors">
              Image Tools
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-medium truncate">{page.title}</span>
          </nav>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{page.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {page.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {page.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        {/* Interactive Tool Widget */}
        <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/40 p-6 sm:p-8 backdrop-blur shadow-2xl shadow-cyan-950/20">
          <ClientImageCompressor
            initialTargetKB={page.targetKB}
            toolTitle={page.title}
          />
        </section>

        {/* Deep Editorial Overview */}
        <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span>EXPERT GUIDE &amp; SPECIFICATIONS</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Understanding {page.badge} Image Optimization
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {page.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Pixel Dimensions &amp; Scaling</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {page.dimensionsGuide}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Format Selection (JPG vs PNG vs WebP)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {page.formatAdvice}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Compression Mechanics &amp; Quality Preservation</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {page.technicalTradeoffs}
            </p>
          </div>
        </section>

        {/* Portal & Exam Use Cases */}
        {page.portalUseCases.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Supported Official Portals &amp; Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.portalUseCases.map((useCase, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200">{useCase}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How to Use Step Guide */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            How to Compress Your Image Step-by-Step
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {page.stepGuide.map((s) => (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 relative"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                  {s.step}
                </div>
                <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {page.faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-3">
              {page.faqs.map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2"
                >
                  <h3 className="font-semibold text-slate-100 text-sm">{f.question}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Compression Utilities */}
        <section className="space-y-4 border-t border-slate-800 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Related Image &amp; PDF Utilities
            </h2>
            <Link
              href="/categories/image"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>All Image Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/compress-image"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-300 hover:text-white"
            >
              ⚡ Universal Image Compressor
            </Link>
            <Link
              href="/image-resizer"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-300 hover:text-white"
            >
              📐 Custom Image Resizer
            </Link>
            <Link
              href="/tools/compress-image-to-200kb"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-300 hover:text-white"
            >
              🎯 Compress to 200KB
            </Link>
            <Link
              href="/tools/compress-image-to-50kb"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-300 hover:text-white"
            >
              📝 Compress to 50KB
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}