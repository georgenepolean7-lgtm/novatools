"use client";

import React from "react";
import Link from "next/link";
import { DEFAULT_UPDF_CONFIG } from "@/lib/affiliate/updf-config";
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface UPDFRecommendationProps {
  toolSlug?: string;
  trackingUrl?: string;
  ctaText?: string;
  className?: string;
}

export default function UPDFRecommendation({
  toolSlug = "pdf-tool",
  trackingUrl = DEFAULT_UPDF_CONFIG.trackingUrl,
  ctaText = DEFAULT_UPDF_CONFIG.ctaText,
  className = "",
}: UPDFRecommendationProps) {
  const handleAffiliateClick = () => {
    try {
      if (typeof window !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/affiliate/track",
          JSON.stringify({ provider: "updf", toolSlug })
        );
      } else {
        fetch("/api/affiliate/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "updf", toolSlug }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking
    }
  };

  return (
    <section
      aria-label="Desktop PDF Solution Recommendation"
      className={`my-10 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all hover:border-amber-500/35 ${className}`}
    >
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative z-10 space-y-6">
        {/* Top Header & Sponsored Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{DEFAULT_UPDF_CONFIG.sponsoredBadge}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Desktop &amp; Cloud Option</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {DEFAULT_UPDF_CONFIG.headline}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {DEFAULT_UPDF_CONFIG.description}
            </p>

            {/* UPDF Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Edit text, images &amp; links inside PDFs</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>AI Assistant (Summarize &amp; Ask PDF)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Convert PDF to Word, Excel &amp; PPT</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Works on Mac, Windows, iOS &amp; Android</span>
              </div>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className="flex flex-col items-start lg:items-end justify-center space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-md">
            <div className="space-y-1 text-left lg:text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                UPDF Pro &amp; AI
              </div>
              <p className="text-xs text-slate-400">
                Cross-platform PDF editor with AI document analysis
              </p>
            </div>

            <Link
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={handleAffiliateClick}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/35 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all cursor-pointer"
            >
              <span>{ctaText}</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Affiliate Disclosure (AdSense & Regulatory Compliance) */}
        <div className="border-t border-white/5 pt-3">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {DEFAULT_UPDF_CONFIG.disclosureText}
          </p>
        </div>
      </div>
    </section>
  );
}
