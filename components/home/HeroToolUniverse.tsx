"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  ScanText,
  Type,
  Database,
  Code2,
  DollarSign,
  Search,
  Languages,
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
  // Position style in desktop canvas (percentages)
  posClass: string;
  floatAnim: string;
  // Node coordinate in SVG 0 0 600 600
  svgNode: { cx: number; cy: number };
}

const UNIVERSE_CATEGORIES: UniverseCategory[] = [
  // 1. TOP-CENTER: PDF
  {
    id: "pdf",
    name: "PDF Tools",
    shortLabel: "PDF",
    sublabel: "Merge, Split, Sign",
    icon: FileText,
    accentColor: "rose",
    borderHover: "hover:border-rose-400/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]",
    badgeBg: "bg-rose-500/15 border-rose-500/30",
    iconColor: "text-rose-400",
    glowColor: "rgba(244,63,94,0.8)",
    posClass: "top-[4%] left-[45%] -translate-x-1/2",
    floatAnim: "animate-hero-float-1",
    svgNode: { cx: 280, cy: 75 },
  },
  // 2. TOP-LEFT: Image
  {
    id: "image",
    name: "Image Processing",
    shortLabel: "Image",
    sublabel: "Compress, Convert",
    icon: ImageIcon,
    accentColor: "cyan",
    borderHover: "hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.8)",
    posClass: "top-[16%] left-[4%]",
    floatAnim: "animate-hero-float-2",
    svgNode: { cx: 120, cy: 145 },
  },
  // 3. TOP-RIGHT: OCR
  {
    id: "ocr",
    name: "OCR & Vision",
    shortLabel: "OCR",
    sublabel: "Text Recognition",
    icon: ScanText,
    accentColor: "indigo",
    borderHover: "hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]",
    badgeBg: "bg-indigo-500/15 border-indigo-500/30",
    iconColor: "text-indigo-400",
    glowColor: "rgba(99,102,241,0.8)",
    posClass: "top-[15%] right-[5%]",
    floatAnim: "animate-hero-float-3",
    svgNode: { cx: 480, cy: 140 },
  },
  // 4. MID-LEFT: Text
  {
    id: "text",
    name: "Text & Word Tools",
    shortLabel: "Text",
    sublabel: "Word, Case, Diff",
    icon: Type,
    accentColor: "emerald",
    borderHover: "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    iconColor: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.8)",
    posClass: "top-[44%] left-[0%]",
    floatAnim: "animate-hero-float-4",
    svgNode: { cx: 90, cy: 300 },
  },
  // 5. MID-RIGHT: Data
  {
    id: "data",
    name: "Data Tools",
    shortLabel: "Data",
    sublabel: "CSV, JSON, SQL",
    icon: Database,
    accentColor: "blue",
    borderHover: "hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    iconColor: "text-blue-400",
    glowColor: "rgba(59,130,246,0.8)",
    posClass: "top-[43%] right-[0%]",
    floatAnim: "animate-hero-float-1",
    svgNode: { cx: 515, cy: 300 },
  },
  // 6. BOTTOM-LEFT: Developer
  {
    id: "developer",
    name: "Developer Utilities",
    shortLabel: "Developer",
    sublabel: "JSON, JWT, Regex",
    icon: Code2,
    accentColor: "purple",
    borderHover: "hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    iconColor: "text-purple-400",
    glowColor: "rgba(168,85,247,0.8)",
    posClass: "bottom-[20%] left-[5%]",
    floatAnim: "animate-hero-float-2",
    svgNode: { cx: 125, cy: 455 },
  },
  // 7. BOTTOM-CENTER-LEFT: Finance
  {
    id: "finance",
    name: "Finance Calculators",
    shortLabel: "Finance",
    sublabel: "Margin, Tax, ROI",
    icon: DollarSign,
    accentColor: "amber",
    borderHover: "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    iconColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.8)",
    posClass: "bottom-[7%] left-[28%]",
    floatAnim: "animate-hero-float-3",
    svgNode: { cx: 230, cy: 520 },
  },
  // 8. BOTTOM-MID-RIGHT: SEO
  {
    id: "seo",
    name: "SEO Tools",
    shortLabel: "SEO",
    sublabel: "Meta, OG, Slugs",
    icon: Search,
    accentColor: "teal",
    borderHover: "hover:border-teal-400/60 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]",
    badgeBg: "bg-teal-500/15 border-teal-500/30",
    iconColor: "text-teal-400",
    glowColor: "rgba(20,184,166,0.8)",
    posClass: "bottom-[21%] right-[11%]",
    floatAnim: "animate-hero-float-4",
    svgNode: { cx: 460, cy: 445 },
  },
  // 9. BOTTOM-RIGHT: Tamil
  {
    id: "tamil",
    name: "Tamil Utilities",
    shortLabel: "Tamil",
    sublabel: "Fonts & Text Tools",
    icon: Languages,
    accentColor: "fuchsia",
    borderHover: "hover:border-fuchsia-400/60 hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]",
    badgeBg: "bg-fuchsia-500/15 border-fuchsia-500/30",
    iconColor: "text-fuchsia-400",
    glowColor: "rgba(217,70,239,0.8)",
    posClass: "bottom-[7%] right-[3%]",
    floatAnim: "animate-hero-float-1",
    svgNode: { cx: 495, cy: 520 },
  },
];

export default function HeroToolUniverse() {
  return (
    <div className="relative w-full">
      {/* ============================================================ */}
      {/* 1. DESKTOP & TABLET: Cinematic "Nova Tool Universe" Canvas   */}
      {/* ============================================================ */}
      <div className="hidden md:flex relative mx-auto w-full max-w-[620px] lg:max-w-[660px] aspect-square items-center justify-center select-none overflow-visible">
        {/* Soft atmospheric ambient glow behind universe */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-10%] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/20 blur-[100px] opacity-75"
        />

        {/* Constellation & Orbital SVG Backdrop */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 600 600"
          fill="none"
        >
          <defs>
            {/* Radial glow for planetary corona */}
            <radialGradient id="planetCorona" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="85%" stopColor="#818cf8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>

            {/* Glowing orbital stroke gradient */}
            <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#c084fc" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Large Corona Glow */}
          <circle cx="300" cy="300" r="220" fill="url(#planetCorona)" />

          {/* Elliptical Orbital Ring 1 (Tilted ~ -20 deg) */}
          <g transform="rotate(-18 300 300)">
            <ellipse
              cx="300"
              cy="300"
              rx="235"
              ry="110"
              stroke="url(#orbitGrad1)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="animate-hero-orbit opacity-75"
            />
            {/* Glowing orbital node points */}
            <circle cx="75" cy="300" r="3.5" fill="#22d3ee" className="animate-pulse" />
            <circle cx="525" cy="300" r="3.5" fill="#c084fc" className="animate-pulse" />
            <circle cx="300" cy="190" r="3" fill="#818cf8" />
            <circle cx="300" cy="410" r="3" fill="#38bdf8" />
          </g>

          {/* Elliptical Orbital Ring 2 (Outer tilted ~ 15 deg) */}
          <g transform="rotate(14 300 300)">
            <ellipse
              cx="300"
              cy="300"
              rx="265"
              ry="125"
              stroke="url(#orbitGrad2)"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              opacity="0.55"
            />
            {/* Glowing node points */}
            <circle cx="45" cy="300" r="3" fill="#c084fc" />
            <circle cx="555" cy="300" r="3" fill="#22d3ee" />
          </g>

          {/* Constellation Connection Rays to Nodes */}
          {UNIVERSE_CATEGORIES.map((cat) => (
            <g key={`ray-${cat.id}`}>
              <line
                x1="300"
                y1="300"
                x2={cat.svgNode.cx}
                y2={cat.svgNode.cy}
                stroke={cat.glowColor}
                strokeWidth="1"
                strokeDasharray="3 5"
                opacity="0.35"
              />
              <circle
                cx={cat.svgNode.cx}
                cy={cat.svgNode.cy}
                r="3.5"
                fill={cat.glowColor}
                className="animate-pulse"
              />
            </g>
          ))}
        </svg>

        {/* ============================================================ */}
        {/* HANDWRITTEN DOODLE CALLOUTS (Decorative, subtle SVG text)    */}
        {/* ============================================================ */}
        {/* Top-Left: "One Platform / Infinite Possibilities" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 left-[18%] z-40 hidden xl:block select-none transform -rotate-6"
        >
          <div className="font-serif italic text-xs text-indigo-200/70 tracking-wide">
            One Platform
          </div>
          <div className="font-serif italic text-[11px] text-indigo-300/60 -mt-0.5">
            Infinite Possibilities
          </div>
          <svg className="w-12 h-8 text-indigo-300/50 mt-0.5 ml-3" viewBox="0 0 50 30" fill="none">
            <path
              d="M 10,2 Q 25,18 42,22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 36,18 L 43,22 L 39,28"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Top-Right: "Tools for / A Smarter You" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1 right-[2%] z-40 hidden xl:block select-none transform rotate-3"
        >
          <div className="font-serif italic text-xs text-indigo-200/70 tracking-wide">
            Tools for
          </div>
          <div className="font-serif italic text-[11px] text-indigo-300/60 -mt-0.5">
            A Smarter You
          </div>
          <svg className="w-10 h-7 text-indigo-300/50 mt-0.5 ml-2" viewBox="0 0 40 25" fill="none">
            <path
              d="M 30,2 Q 18,12 8,18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 15,16 L 7,19 L 10,24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Bottom-Right: "Create / Convert / Calculate / Simplify" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-16px] right-[-24px] z-40 hidden xl:block select-none transform rotate-3 text-right"
        >
          <div className="font-serif italic text-[11px] text-indigo-200/70 leading-snug">
            Create
          </div>
          <div className="font-serif italic text-[11px] text-indigo-200/70 leading-snug">
            Convert
          </div>
          <div className="font-serif italic text-[11px] text-indigo-200/70 leading-snug">
            Calculate
          </div>
          <div className="font-serif italic text-[11px] text-cyan-300/70 leading-snug font-bold">
            Simplify
          </div>
          <svg className="w-8 h-8 text-indigo-300/50 mt-1 ml-auto mr-3" viewBox="0 0 35 35" fill="none">
            <path
              d="M 28,28 Q 15,20 10,6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 6,12 L 9,5 L 16,7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ============================================================ */}
        {/* CENTRAL PLANET: 3D Glowing Spherical Nova Tools World         */}
        {/* ============================================================ */}
        <div
          className="relative z-20 flex flex-col items-center justify-center rounded-full w-[240px] h-[240px] lg:w-[268px] lg:h-[268px] text-center transition-all duration-500 animate-hero-core"
          style={{
            background:
              "radial-gradient(circle at 35% 28%, #38bdf8 0%, #0284c7 20%, #0369a1 40%, #075985 60%, #0c2340 80%, #020817 100%)",
            boxShadow:
              "0 0 50px rgba(14, 165, 233, 0.45), 0 0 100px rgba(59, 130, 246, 0.25), inset 3px 3px 20px rgba(255, 255, 255, 0.65), inset -12px -12px 35px rgba(2, 6, 23, 0.95), inset 0 0 40px rgba(56, 189, 248, 0.5)",
          }}
        >
          {/* Planetary Cloud & Texture Overlay Layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-35 mix-blend-overlay overflow-hidden"
          >
            <svg className="w-full h-full" viewBox="0 0 260 260" fill="none">
              <path
                d="M 20,90 Q 60,60 130,80 T 240,70 Q 200,120 150,110 T 30,130 Z"
                fill="#ffffff"
                opacity="0.4"
                style={{ filter: "blur(6px)" }}
              />
              <path
                d="M 40,160 Q 110,130 180,150 T 250,180 Q 180,210 110,195 T 25,185 Z"
                fill="#38bdf8"
                opacity="0.5"
                style={{ filter: "blur(8px)" }}
              />
              <circle cx="130" cy="130" r="128" stroke="#38bdf8" strokeWidth="2" opacity="0.3" />
            </svg>
          </div>

          {/* Inner Spherical Atmospheric Glare */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-6 w-24 h-14 rounded-full bg-white/25 blur-lg transform -rotate-25"
          />

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center justify-center p-3">
            {/* Nova Tools Brand Icon Badge */}
            <div className="relative mb-2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-cyan-300/40 bg-slate-950/80 shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-transform hover:scale-105">
              <Image
                src="/icon.png"
                alt="Nova Tools Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover rounded-xl"
                priority
              />
            </div>

            {/* Label: NOVA TOOLS */}
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/90 drop-shadow-md">
              Nova Tools
            </span>

            {/* Huge Electric Tool Count: 251 Tools */}
            <span className="mt-0.5 text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              251 Tools
            </span>

            {/* In-Browser Pill Badge */}
            <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-cyan-400/35 bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-cyan-300 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>100% In-Browser</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 9 ORBITING CATEGORY CARDS (With Real Canonical Routes)       */}
        {/* ============================================================ */}
        {UNIVERSE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              aria-label={`Explore ${cat.name} on Nova Tools`}
              className={`group absolute z-30 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-slate-900/80 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-slate-900/95 active:scale-95 ${cat.posClass} ${cat.floatAnim} ${cat.borderHover}`}
            >
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${cat.badgeBg}`}
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
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  {cat.sublabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE: Sleek, Compact Tool Ecosystem (< md)              */}
      {/* ============================================================ */}
      <div className="block md:hidden mt-8 w-full max-w-lg mx-auto">
        <div className="rounded-3xl border border-white/12 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-2xl">
          {/* Mobile Central Planet Banner */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/40 bg-slate-950/80 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Image
                  src="/icon.png"
                  alt="Nova Tools"
                  width={32}
                  height={32}
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white tracking-tight block">
                  Nova Tool Universe
                </span>
                <span className="text-[10px] text-cyan-300 font-medium">
                  251 Free In-Browser Tools
                </span>
              </div>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Client-Side
            </span>
          </div>

          {/* 9 Category Cards Grid (3 columns x 3 rows) */}
          <div className="grid grid-cols-3 gap-2">
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
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border mb-1.5 ${cat.badgeBg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${cat.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white truncate max-w-full">
                    {cat.shortLabel}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate max-w-full font-medium">
                    {cat.sublabel.split(",")[0]}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer Trust Badges */}
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="h-3 w-3" /> Zero Server Uploads
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-cyan-300 font-medium">
              <Zap className="h-3 w-3" /> Instant Execution
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
