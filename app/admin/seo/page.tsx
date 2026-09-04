import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { verifyAdminSession } from "@/lib/supabase/server";
import SeoAgentDashboard from "@/components/admin/SeoAgentDashboard";

export const metadata: Metadata = {
  title: "Admin SEO Automation Dashboard | Nova Tools",
  description: "Autonomous SEO Agent Command Center & Telemetry Matrix",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminSeoPage() {
  const { isAdmin, user } = await verifyAdminSession();

  if (!isAdmin && process.env.NODE_ENV === "production") {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access Restricted</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            You must be authenticated with an administrative role in Supabase to access the Autonomous SEO Command Center.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all"
            >
              Sign In as Administrator
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AUTONOMOUS SEO AGENT COMMAND CENTER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
              SEO Automation &amp; Telemetry Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-Source Telemetry (GSC, GA4, Bing, Clarity, Ads) • Hermes Qwen 3:4b Engine • Hard Cap 80/day
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              ← System Operations
            </Link>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Server-Verified Admin
            </span>
          </div>
        </div>

        {/* SEO Agent Dashboard Component */}
        <SeoAgentDashboard />
      </div>
    </main>
  );
}
