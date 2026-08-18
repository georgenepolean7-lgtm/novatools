"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { Check, Zap, Sparkles, Shield, HelpCircle, ArrowRight, X, AlertCircle } from "lucide-react";

interface PricingClientProps {
  premiumAmountInr: number;
  paymentEnabled: boolean;
  premiumEnabled: boolean;
}

export function PricingClient({ premiumAmountInr, paymentEnabled, premiumEnabled }: PricingClientProps) {
  const { user, profile, isAdmin } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleUpgradeClick = () => {
    setModalOpen(true);
  };

  const isPremiumUser = profile?.isPremium;

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TRANSPARENT &amp; ACCESSIBLE PRICING</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Free forever for everyone. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Upgrade for pure focus.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            All 250+ utility tools run directly in your browser with zero file upload to servers.
            Enjoy unlimited free access, or unlock a completely ad-free experience.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* FREE PLAN */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col justify-between backdrop-blur-xl shadow-xl space-y-8 relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Free Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">Full access for students &amp; professionals</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  Current Default
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">₹0</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Forever free</span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-300">
                {[
                  "Unlimited access to all 250+ tools",
                  "100% In-browser client-side computation",
                  "Zero data ingestion or server file uploads",
                  "PDF, Image, Developer, Tamil & Finance suites",
                  "Save favorite tools & usage history",
                  "Standard community support",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="w-full py-3.5 px-6 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-white text-sm font-bold transition-all text-center block shadow-md"
              >
                Start Using 250+ Tools Free
              </Link>
            </div>
          </div>

          {/* PREMIUM PLAN */}
          <div className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 flex flex-col justify-between backdrop-blur-xl shadow-2xl shadow-cyan-500/10 space-y-8 relative overflow-hidden">
            {/* Ribbon */}
            <div className="absolute -top-1 right-8">
              <span className="px-4 py-1 rounded-b-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-[11px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
                Pure Focus
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Premium Tier</span>
                    <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  </h3>
                  <p className="text-xs text-cyan-300/80 mt-1">Zero distractions &amp; premium badges</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">₹{premiumAmountInr}</span>
                <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">One-time / Year</span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-200">
                {[
                  "100% Ad-Free experience across all 250+ tools",
                  "Golden Verified Account badge on your profile",
                  "Priority tool execution and batching",
                  "Early access to upcoming AI & developer utilities",
                  "Direct priority feedback inbox to developers",
                  "Support the development of open web utilities",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 space-y-2">
              {isAdmin ? (
                <div className="w-full py-3.5 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-bold text-center">
                  👑 Administrator Account (All Features Active)
                </div>
              ) : isPremiumUser ? (
                <div className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold text-center">
                  ✨ Active Premium Membership
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-sm font-extrabold shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <p className="text-[11px] text-center text-slate-400">
                Instant activation • No hidden subscriptions • 100% secure
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto space-y-6 pt-8">
          <h2 className="text-2xl font-bold text-white text-center">Plan Comparison</h2>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-center">Free</th>
                  <th className="p-4 sm:p-5 text-center text-cyan-300">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { name: "250+ Free Utilities", free: "Unlimited", premium: "Unlimited" },
                  { name: "Client-Side Processing (0 Uploads)", free: "Yes", premium: "Yes" },
                  { name: "Tool Favorites & History", free: "Yes", premium: "Yes" },
                  { name: "Advertisements", free: "Standard Ads", premium: "100% Ad-Free" },
                  { name: "Verified Golden Profile Badge", free: "No", premium: "Yes" },
                  { name: "Early Access to Beta Tools", free: "No", premium: "Yes" },
                  { name: "Priority Support & Feature Voting", free: "Community", premium: "Priority" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">{row.name}</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">{row.free}</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-cyan-300">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-slate-400">Everything you need to know about Nova Tools plans.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Are the 250+ tools really 100% free to use?",
                a: "Yes! Every single PDF, image, developer, finance, text, and Tamil tool on Nova Tools is 100% free and unlimited. All computations occur client-side inside your browser, meaning no subscriptions are required to use any tool.",
              },
              {
                q: "What does the Premium upgrade provide?",
                a: "Upgrading to Premium gives you a completely ad-free interface, a golden verified account badge on your profile, priority processing for multi-file operations, and priority consideration for newly requested tools.",
              },
              {
                q: "Are my files or inputs ever uploaded to your servers?",
                a: "Never. Privacy and security are fundamental to Nova Tools. All conversions, compressions, OCR, image resizing, and hash generations run in memory on your device using WebAssembly and HTML5 APIs. Zero server storage.",
              },
              {
                q: "How does payment processing work?",
                a: "When payment gateways are enabled, payments are processed securely through certified PCI-DSS compliant providers. We never store payment credentials or card details on our servers.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout / Upgrade Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Upgrade to Nova Tools Premium</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {!user
                  ? "Please sign in or create an account first to link your premium subscription."
                  : paymentEnabled && premiumEnabled
                  ? "Proceed to secure checkout for ₹" + premiumAmountInr + "."
                  : "Premium checkout is currently in preview mode. Live payment processing is dormant pending gateway key provisioning."}
              </p>
            </div>

            {!user ? (
              <div className="space-y-3 pt-2">
                <Link
                  href="/auth/signup"
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all text-center block"
                >
                  Create Free Account &amp; Upgrade
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full py-3 px-6 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-bold transition-all text-center block"
                >
                  Sign In to Existing Account
                </Link>
              </div>
            ) : paymentEnabled && premiumEnabled ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Selected Plan:</span>
                  <span className="font-bold text-white">Premium Tier</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Due:</span>
                  <span className="font-bold text-cyan-400">₹{premiumAmountInr}</span>
                </div>
                <button
                  type="button"
                  className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-md"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Checkout Preview Notice</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  All 250+ utility tools remain 100% free and unrestricted. Payment processing switches will be activated once merchant gateway verification is completed.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold transition-colors"
                  >
                    Continue Using Free Tools
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
