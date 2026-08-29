import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer - Liability Notice | Nova Tools",
  description: "Legal disclaimer regarding file processing results, OCR accuracy, and utility output on Nova Tools.",
  alternates: {
    canonical: "https://novatool.in/disclaimer",
  },
  openGraph: {
    title: "Disclaimer - Liability Notice | Nova Tools",
    description: "Legal disclaimer regarding file processing results, OCR accuracy, and utility output on Nova Tools.",
    url: "https://novatool.in/disclaimer",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Disclaimer", url: "https://novatool.in/disclaimer" },
        ]}
      />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14 space-y-8 flex-1">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-10 shadow-xl backdrop-blur-xl space-y-8">
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>DISCLAIMER &amp; LIMITATIONS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Disclaimer
            </h1>
            <p className="text-xs text-slate-400">
              Last updated: August 18, 2026 • Nova Tools
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                1. General Information
              </h2>
              <p>
                The information and utilities provided by Nova Tools are for general informational, educational, and workflow automation purposes only.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                2. File Processing &amp; Compression Results
              </h2>
              <p>
                File size reduction, visual resolution, PDF rendering fidelity, and format conversion outcomes vary depending on the complexity of your input documents. Users should always inspect generated files before submitting them to official regulatory authorities, academic portals, or commercial channels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                3. OCR &amp; Text Extraction Accuracy
              </h2>
              <p>
                Optical Character Recognition (OCR) results (including Tamil and English language recognition) depend on source document resolution, typography, lighting conditions, and scan clarity. Nova Tools makes no guarantees of 100% character precision.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                4. Financial &amp; Calculation Utilities
              </h2>
              <p>
                Financial tools, calculators, interest estimations, and percentage utilities are provided as estimation aids and should not be considered formal certified financial or tax advice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                5. Affiliate &amp; Third-Party Link Disclosure
              </h2>
              <p>
                Some links on Nova Tools are affiliate links. If you purchase products or services through these links (such as desktop software or partner utilities), Nova Tools may receive an affiliate commission at no additional cost to you. We only recommend software and services that we believe provide genuine utility and value to our community.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}