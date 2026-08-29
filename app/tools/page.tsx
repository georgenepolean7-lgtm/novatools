import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import AllToolsSection from "@/components/AllToolsSection";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { Sparkles, Shield, Cpu, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "All 250+ Free Online Tools Directory | Nova Tools",
  description:
    "Explore the complete directory of 250+ free client-side online tools: PDF editors, Image compressors, Tamil OCR, Developer utilities, Text analyzers, and Financial calculators.",
  alternates: {
    canonical: "https://novatool.in/tools",
  },
  openGraph: {
    title: "All 250+ Free Online Tools Directory | Nova Tools",
    description: "100% free, private, and client-side browser utilities for students, developers, and creators.",
    url: "https://novatool.in/tools",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ToolsDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <SiteHeader />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Tools Directory", url: "https://novatool.in/tools" },
        ]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMPLETE WEB UTILITY REGISTRY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Browse All 250+ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Free Browser Utilities
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            All tools execute 100% locally in your browser memory without transmitting your files or data to external servers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero-Upload Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>WebAssembly Powered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>250+ Standalone Tools</span>
            </div>
          </div>
        </div>

        {/* Paginated Tools Grid */}
        <AllToolsSection />
      </main>

      <SiteFooter />
    </div>
  );
}
