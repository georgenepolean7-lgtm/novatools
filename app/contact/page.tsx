import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { Mail, MessageSquare, Clock, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Support, Feedback & Inquiries | Nova Tools",
  description:
    "Get in touch with Nova Tools support team. Submit feedback, report tool bugs, request new features, or inquire about custom web engineering by Nova Code Tech.",
  alternates: {
    canonical: "https://novatool.in/contact",
  },
  openGraph: {
    title: "Contact Us - Support, Feedback & Inquiries | Nova Tools",
    description:
      "Get in touch with Nova Tools support team. Submit feedback, report tool bugs, request new features, or inquire about custom web engineering by Nova Code Tech.",
    url: "https://novatool.in/contact",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <SiteHeader />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://novatool.in" },
          { name: "Contact Support", url: "https://novatool.in/contact" },
        ]}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            We&apos;re Here to Help
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Have questions, found a bug in one of our 250+ utilities, or want to suggest a new tool? Reach out directly to the Nova Code Tech engineering and support team.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Support Card */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Email Support</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send us an email for general inquiries, bug reports, or feature recommendations.
            </p>
            <div className="pt-2">
              <a
                href="mailto:georgenepolean7@gmail.com"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm font-semibold break-all"
              >
                <span>georgenepolean7@gmail.com</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Response Commitment Card */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Response Time</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our engineering team typically reviews and replies to all user emails within <strong>24 to 48 business hours</strong>.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Developer Support</span>
            </div>
          </div>
        </div>

        {/* Inquiries Scope */}
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white">What You Can Contact Us About</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h3 className="font-bold text-white">🐛 Tool Bugs &amp; Performance Issues</h3>
              <p className="text-slate-400 leading-relaxed">
                If a file failed to convert or render correctly in your browser, let us know the browser and file type.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h3 className="font-bold text-white">💡 New Tool Requests</h3>
              <p className="text-slate-400 leading-relaxed">
                Need a specific calculator, text formatter, or converter? We build community-requested tools weekly.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h3 className="font-bold text-white">💼 Custom Web Engineering</h3>
              <p className="text-slate-400 leading-relaxed">
                Nova Code Tech designs and deploys custom web applications, SaaS products, and high-performance websites.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h3 className="font-bold text-white">🔒 Privacy &amp; Security Verification</h3>
              <p className="text-slate-400 leading-relaxed">
                Inquire about our zero-upload client-side architecture and technical data processing policies.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}