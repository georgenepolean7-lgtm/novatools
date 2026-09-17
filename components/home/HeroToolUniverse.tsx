"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Database,
  Search,
  DollarSign,
  Code2,
  Languages,
  ScanText,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface UniverseCategory {
  id: string;
  name: string;
  shortLabel: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderHover: string;
  badgeBg: string;
  iconColor: string;
  glowColor: string;
  // Position coordinates in percentage within the desktop canvas
  posClass: string;
  floatAnim: string;
  // SVG connection endpoint coordinates in viewBox 0 0 500 500
  svgNode: { cx: number; cy: number };
}

const UNIVERSE_CATEGORIES: UniverseCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    shortLabel: "PDF",
    sublabel: "Merge, Split, Sign",
    icon: FileText,
    accentColor: "rose",
    borderHover: "hover:border-rose-400/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]",
    badgeBg: "bg-rose-500/10 border-rose-500/25 text-rose-400",
    iconColor: "text-rose-400",
    glowColor: "rgba(244,63,94,0.3)",
    posClass: "top-[8%] left-[4%]",
    floatAnim: "animate-hero-float-1",
    svgNode: { cx: 105, cy: 95 },
  },
  {
    id: "image",
    name: "Image Processing",
    shortLabel: "Image",
    sublabel: "Compress, Convert",
    icon: ImageIcon,
    accentColor: "cyan",
    borderHover: "hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]",
    badgeBg: "bg-cyan-500/10 border-cyan-500/25 text-cyan-400",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.3)",
    posClass: "top-[2%] left-1/2 -translate-x-1/2",
    floatAnim: "animate-hero-float-2",
    svgNode: { cx: 250, cy: 62 },
  },
  {
    id: "ocr",
    name: "OCR & Vision",
    shortLabel: "OCR",
    sublabel: "Text Recognition",
    icon: ScanText,
    accentColor: "indigo",
    borderHover: "hover:border-indigo-400/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.35)]",
    badgeBg: "bg-indigo-500/10 border-indigo-500/25 text-indigo-400",
    iconColor: "text-indigo-400",
    glowColor: "rgba(99,102,241,0.3)",
    posClass: "top-[8%] right-[4%]",
    floatAnim: "animate-hero-float-3",
    svgNode: { cx: 395, cy: 95 },
  },
  {
    id: "data",
    name: "Data Tools",
    shortLabel: "Data",
    sublabel: "CSV, JSON, SQL",
    icon: Database,
    accentColor: "blue",
    borderHover: "hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]",
    badgeBg: "bg-blue-500/10 border-blue-500/25 text-blue-400",
    iconColor: "text-blue-400",
    glowColor: "rgba(59,130,246,0.3)",
    posClass: "top-1/2 right-[1%] -translate-y-1/2",
    floatAnim: "animate-hero-float-4",
    svgNode: { cx: 435, cy: 250 },
  },
  {
    id: "finance",
    name: "Finance Tools",
    shortLabel: "Finance",
    sublabel: "Margin, Tax, ROI",
    icon: DollarSign,
    accentColor: "amber",
    borderHover: "hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]",
    badgeBg: "bg-amber-500/10 border-amber-500/25 text-amber-400",
    iconColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.3)",
    posClass: "bottom-[8%] right-[4%]",
    floatAnim: "animate-hero-float-1",
    svgNode: { cx: 395, cy: 405 },
  },
  {
    id: "developer",
    name: "Developer Tools",
    shortLabel: "Developer",
    sublabel: "JSON, JWT, Regex",
    icon: Code2,
    accentColor: "purple",
    borderHover: "hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]",
    badgeBg: "bg-purple-500/10 border-purple-500/25 text-purple-400",
    iconColor: "text-purple-400",
    glowColor: "rgba(168,85,247,0.3)",
    posClass: "bottom-[2%] left-1/2 -translate-x-1/2",
    floatAnim: "animate-hero-float-2",
    svgNode: { cx: 250, cy: 438 },
  },
  {
    id: "tamil",
    name: "Tamil Utilities",
    shortLabel: "Tamil",
    sublabel: "Fonts & Text Tools",
    icon: Languages,
    accentColor: "fuchsia",
    borderHover: "hover:border-fuchsia-400/50 hover:shadow-[0_0_25px_rgba(217,70,239,0.35)]",
    badgeBg: "bg-fuchsia-500/10 border-fuchsia-500/25 text-fuchsia-400",
    iconColor: "text-fuchsia-400",
    glowColor: "rgba(217,70,239,0.3)",
    posClass: "bottom-[8%] left-[4%]",
    floatAnim: "animate-hero-float-3",
    svgNode: { cx: 105, cy: 405 },
  },
  {
    id: "seo",
    name: "SEO Tools",
    shortLabel: "SEO",
    sublabel: "Meta, OG, Slugs",
    icon: Search,
    accentColor: "teal",
    borderHover: "hover:border-teal-400/50 hover:shadow-[0_0_25px_rgba(20,184,166,0.35)]",
    badgeBg: "bg-teal-500/10 border-teal-500/25 text-teal-400",
    iconColor: "text-teal-400",
    glowColor: "rgba(20,184,166,0.3)",
    posClass: "top-1/2 left-[1%] -translate-y-1/2",
    floatAnim: "animate-hero-float-4",
    svgNode: { cx: 65, cy: 250 },
  },
];

export default function HeroToolUniverse() {
  return (
    <div className="relative w-full">
      {/* ============================================================ */}
      {/* 1. DESKTOP & TABLET: Interactive "Nova Tool Universe" Canvas */}
      {/* ============================================================ */}
      <div className="hidden md:flex relative mx-auto w-full max-w-[520px] lg:max-w-[560px] aspect-square items-center justify-center select-none">
        {/* Ambient background glow behind canvas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-violet-500/15 blur-3xl"
        />

        {/* Constellation & Orbital SVG backdrop */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 500 500"
          fill="none"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="orbitalLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Central radial glow */}
          <circle cx="250" cy="250" r="150" fill="url(#hubGlow)" />

          {/* Inner orbital ring */}
          <circle
            cx="250"
            cy="250"
            r="128"
            stroke="rgba(34, 211, 238, 0.14)"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="animate-hero-orbit"
          />

          {/* Outer orbital ring */}
          <circle
            cx="250"
            cy="250"
            r="195"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />

          {/* Radiating constellation lines to nodes */}
          {UNIVERSE_CATEGORIES.map((cat) => (
            <g key={`svg-${cat.id}`}>
              <line
                x1="250"
                y1="250"
                x2={cat.svgNode.cx}
                y2={cat.svgNode.cy}
                stroke="url(#orbitalLineGrad)"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0.6"
              />
              <circle
                cx={cat.svgNode.cx}
                cy={cat.svgNode.cy}
                r="3"
                fill={cat.glowColor}
                className="animate-pulse"
              />
            </g>
          ))}
        </svg>

        {/* Central Hub: "Nova Tools Core" */}
        <div className="relative z-20 flex flex-col items-center justify-center rounded-3xl border border-cyan-400/30 bg-slate-900/85 p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.22)] backdrop-blur-2xl transition-all duration-500 animate-hero-core w-[190px] h-[190px]">
          {/* Subtle inner corner glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-400/15 via-transparent to-violet-500/15"
          />

          {/* Pulsing Sparkle Badge */}
          <div className="relative mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-violet-500/20 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
            Nova Tools
          </span>

          <span className="mt-1 bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-xl font-black text-transparent">
            251 Tools
          </span>

          <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>100% In-Browser</span>
          </div>
        </div>

        {/* Orbiting Satellite Category Cards */}
        {UNIVERSE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              aria-label={`Explore ${cat.name} in Nova Tools`}
              className={`group absolute z-30 flex items-center gap-2.5 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-slate-900/95 active:scale-95 ${cat.posClass} ${cat.floatAnim} ${cat.borderHover}`}
            >
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border transition-transform duration-300 group-hover:scale-110 ${cat.badgeBg}`}
              >
                <Icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${cat.iconColor}`} />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-bold text-white transition-colors group-hover:text-cyan-300">
                    {cat.shortLabel}
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-cyan-400" />
                </div>
                <span className="hidden lg:block text-[10px] text-slate-400 font-medium">
                  {cat.sublabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE: Sleek, Compact Tool Ecosystem Strip (< md)       */}
      {/* ============================================================ */}
      <div className="block md:hidden mt-6 w-full max-w-lg mx-auto">
        <div className="rounded-2xl border border-white/12 bg-slate-900/75 p-3.5 shadow-xl backdrop-blur-xl">
          {/* Mobile Header Banner */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/15">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">
                Nova Tool Ecosystem
              </span>
            </div>
            <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              251 In-Browser Tools
            </span>
          </div>

          {/* 8 Compact Category Cards (4 cols x 2 rows) */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {UNIVERSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={`mobile-${cat.id}`}
                  href={`/categories/${cat.id}`}
                  aria-label={`Explore ${cat.name}`}
                  className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] p-2 text-center transition-all active:scale-95 hover:border-cyan-400/30 hover:bg-white/[0.08]"
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border mb-1 ${cat.badgeBg}`}
                  >
                    <Icon className={`h-3 w-3 ${cat.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-200 truncate max-w-full">
                    {cat.shortLabel}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer Trust Badge */}
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="h-3 w-3" /> 100% Client-Side
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-cyan-300 font-medium">
              <Zap className="h-3 w-3" /> Instant & Zero Uploads
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
