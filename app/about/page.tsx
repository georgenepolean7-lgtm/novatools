import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { Shield, Zap, Lock, Cpu, Globe, Users, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Nova Tools - Mission, Privacy Architecture & Technology",
  description:
    "Learn about Nova Tools by Nova Code Tech. Our mission is to provide 250+ fast, free, privacy-first web utilities running 100% locally in your browser.",
  alternates: {
    canonical: "https://novatool.in/about",
  },
  openGraph: {
    title: "About Nova Tools - Mission, Privacy Architecture & Technology",
    description:
      "Learn about Nova Tools by Nova Code Tech. Our mission is to provide 250+ fast, free, privacy-first web utilities running 100% locally in your browser.",
    url: "https://novatool.in/about",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "About Us", url: "https://novatool.in/about" },
        ]}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>ABOUT NOVA TOOLS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for Privacy, Speed, and Daily Productivity
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Nova Tools is a comprehensive suite of 250+ browser-based utilities developed by Nova Code Tech. We build fast, lightweight, and zero-upload software for creators, developers, students, and businesses worldwide.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Zero-Upload Privacy</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your files, images, PDFs, and data stay on your machine. All computation executes locally inside your browser memory using WebAssembly and Canvas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Instant Performance</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No server queues, no file transfer lag, and no rate limits. Tools execute in milliseconds directly on your device CPU and GPU.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">100% Free &amp; Open</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No mandatory registration, no watermarks, and no software installations. Open any tool and get your work done immediately.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Our Architectural Philosophy
            </h2>
            <p>
              Traditional online utilities require users to upload confidential documents (like tax returns, medical records, and contracts) to remote cloud servers. Even with promises of hourly deletion, this architecture exposes users to data transit leaks and third-party storage vulnerabilities.
            </p>
            <p>
              Nova Tools was created to prove that modern web browsers possess sufficient computing power to perform complex image manipulation, PDF compilation, OCR text recognition, and mathematical modeling directly on the client side. By compiling high-performance C/C++ and Rust libraries to WebAssembly (WASM), we deliver desktop-grade performance directly inside your browser tab.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "PDF Management: Compress, merge, split, encrypt, rotate, and convert PDF documents.",
                "Image Optimization: Resize, crop, convert to WebP, and compress signatures to 20KB-50KB.",
                "Developer Utilities: JSON formatter, Base64 encoder/decoder, UUID generator, and timestamp tools.",
                "Calculators: Loan EMI amortization, GST inclusive/exclusive calculators, and age calculators.",
                "Linguistic & OCR: In-browser Tamil OCR, Tanglish transliteration, and text formatters.",
                "Data Conversion: JSON to CSV, YAML, SQL, XML, and Markdown matrix generators.",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Company &amp; Editorial Standards
            </h2>
            <p>
              Nova Tools is developed and maintained by <strong>Nova Code Tech</strong>. Our technical editorial team is dedicated to publishing accurate, fact-checked tutorials and practical guides that solve everyday digital problems.
            </p>
            <p>
              We adhere to strict quality guidelines: no misleading download buttons, no deceptive advertising, and clear disclosure of any affiliate or sponsored partnerships (such as our desktop PDF recommendation with UPDF).
            </p>
          </section>
        </div>

        {/* Quick Links Footer CTA */}
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Ready to Explore Our Utilities?</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Discover all 250+ free tools or read our detailed technical guides.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/tools"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              Browse All Tools
            </Link>
            <Link
              href="/blog"
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Read Guides &amp; Tutorials
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}