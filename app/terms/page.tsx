import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import { FileText, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Usage Agreement",
  description: "Terms and conditions of use for Nova Tools free web utility suite.",
  alternates: {
    canonical: "https://novatool.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14 space-y-8 flex-1">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-10 shadow-xl backdrop-blur-xl space-y-8">
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>LEGAL AGREEMENT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-slate-400">
              Last updated: August 18, 2026 • Nova Code Tech
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p>
                By accessing or using Nova Tools (&ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                2. Scope of Service &amp; Client Processing
              </h2>
              <p>
                Nova Tools provides 250+ utility tools for image editing, PDF manipulation, document conversion, text manipulation, and developer utilities. All operations are executed locally within your web browser. You retain 100% intellectual property ownership of all files and content processed using the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                3. Acceptable Use
              </h2>
              <p>
                You agree not to use Nova Tools to violate applicable local, national, or international laws, infringe upon third-party copyrights, or attempt to reverse-engineer unauthorized internal APIs.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                4. Disclaimer of Warranties
              </h2>
              <p>
                The services are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                5. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}