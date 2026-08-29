import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { ShieldCheck, Lock, Eye, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Zero-Upload Data Protection | Nova Tools",
  description:
    "Nova Tools Privacy Policy. Learn about our 100% client-side zero-upload processing, cookie policies, and Google AdSense privacy compliance.",
  alternates: {
    canonical: "https://novatool.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy - Zero-Upload Data Protection | Nova Tools",
    description:
      "Nova Tools Privacy Policy. Learn about our 100% client-side zero-upload processing, cookie policies, and Google AdSense privacy compliance.",
    url: "https://novatool.in/privacy",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <SiteHeader />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Privacy Policy", url: "https://novatool.in/privacy" },
        ]}
      />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14 space-y-8 flex-1">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-10 shadow-xl backdrop-blur-xl space-y-8">
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRIVACY &amp; DATA PROTECTION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400">
              Last updated: August 18, 2026 • Effective immediately
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>1. Zero-Upload Client-Side Architecture</span>
              </h2>
              <p>
                Nova Tools is built on a strict privacy-first principle: <strong>100% of your tool computation runs directly inside your web browser</strong> using WebAssembly, HTML5 Canvas, and modern Web APIs.
              </p>
              <p>
                When you merge PDFs, compress images, resize signatures, convert documents, extract text via OCR, or generate hashes, <strong>your files are never uploaded to our servers</strong>. All data remains exclusively in your device&apos;s local memory and is discarded immediately when you close or refresh the page.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>2. Information We Collect</span>
              </h2>
              <p>
                When you interact with Nova Tools, we collect minimal operational information to ensure service stability:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 ml-2">
                <li><strong>Account Information:</strong> If you register an account, we store your email address, display name, and authentication timestamp via Supabase Auth.</li>
                <li><strong>Usage &amp; Preferences:</strong> Pinned favorite tool slugs and local session preferences.</li>
                <li><strong>Telemetry:</strong> Aggregated anonymous technical metadata (browser type, screen resolution, referral path) to monitor platform health.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cookie className="w-4 h-4 text-amber-400" />
                <span>3. Cookies &amp; Google AdSense Advertising</span>
              </h2>
              <p>
                Nova Tools uses cookies, web beacons, and similar tracking technologies to deliver essential functionality and display relevant advertisements:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 ml-2">
                <li>
                  <strong>Google AdSense:</strong> Google, as a third-party vendor, uses cookies (such as the DoubleClick DART cookie) to serve ads based on a user&apos;s prior visits to Nova Tools or other websites on the internet.
                </li>
                <li>
                  <strong>Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">aboutads.info</a>.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> We utilize privacy-conscious Google Analytics and Microsoft Clarity to understand feature popularity and optimize interface usability.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                4. Data Security &amp; Encryption
              </h2>
              <p>
                All communications between your browser and Nova Tools are encrypted using industry-standard TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS). We do not store sensitive payment details or credentials on our infrastructure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                5. Affiliate Links &amp; Partner Recommendations
              </h2>
              <p>
                Nova Tools participates in select verified software partner and affiliate programs (such as UPDF by Superace). Some links on Nova Tools are affiliate tracking links. If you make a purchase through these links, Nova Tools may earn an affiliate commission at no additional cost to you. We strictly partner with reputable software vendors and always prioritize privacy, clarity, and genuine user utility.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                6. Contact &amp; Privacy Requests
              </h2>
              <p>
                If you have questions regarding this Privacy Policy or wish to exercise data rights under GDPR or local privacy regulations, contact our Data Protection Officer at:
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                Email: support@novatool.in<br />
                Entity: Nova Code Tech
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}