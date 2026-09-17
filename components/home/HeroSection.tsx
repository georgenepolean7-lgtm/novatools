import React from "react";
import Link from "next/link";
import { Zap, Lock, ShieldCheck, Heart, Play } from "lucide-react";
import HeroSearch from "./HeroSearch";
import HeroToolUniverse from "./HeroToolUniverse";

export default function HeroSection() {
  return (
    <section className="relative min-h-[760px] lg:min-h-[820px] overflow-hidden bg-[#030712] text-white">
      {/* ============================================================ */}
      {/* 1. CINEMATIC BACKGROUND: Space Atmosphere & Nebulae          */}
      {/* ============================================================ */}
      {/* Deep cosmic gradient base */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(14,165,233,0.18),rgba(3,7,18,0))]"
      />

      {/* Cosmic Cyan/Blue Nebula (Left & Center) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-15%] top-[5%] h-[750px] w-[750px] rounded-full bg-cyan-500/15 blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[30%] top-[25%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-blue-600/12 blur-[140px]"
      />

      {/* Cosmic Purple/Magenta Nebula (Upper-Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[8%] h-[680px] w-[680px] rounded-full bg-purple-600/15 blur-[160px]"
      />

      {/* Ambient Center Star Dust Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[15%] bottom-[20%] h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[130px]"
      />

      {/* Delicate Starfield Particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: "8%", left: "12%", size: 2, opacity: 0.6, color: "#38bdf8" },
          { top: "14%", left: "28%", size: 1.5, opacity: 0.8, color: "#ffffff" },
          { top: "22%", left: "45%", size: 2.5, opacity: 0.5, color: "#818cf8" },
          { top: "9%", left: "72%", size: 2, opacity: 0.9, color: "#ffffff" },
          { top: "18%", left: "88%", size: 1.5, opacity: 0.6, color: "#38bdf8" },
          { top: "35%", left: "18%", size: 2, opacity: 0.4, color: "#ffffff" },
          { top: "42%", left: "6%", size: 1.5, opacity: 0.7, color: "#c084fc" },
          { top: "52%", left: "84%", size: 2.5, opacity: 0.8, color: "#ffffff" },
          { top: "62%", left: "94%", size: 1.5, opacity: 0.5, color: "#38bdf8" },
          { top: "70%", left: "22%", size: 2, opacity: 0.4, color: "#ffffff" },
          { top: "28%", left: "62%", size: 1.5, opacity: 0.7, color: "#ffffff" },
          { top: "48%", left: "54%", size: 2, opacity: 0.6, color: "#818cf8" },
          { top: "12%", left: "48%", size: 1.5, opacity: 0.5, color: "#ffffff" },
          { top: "6%", left: "92%", size: 2.5, opacity: 0.7, color: "#38bdf8" },
        ].map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
              animationDuration: `${3 + (i % 4)}s`,
              animationDelay: `${(i * 0.4) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM PLANETARY HORIZON & MOUNTAIN SILHOUETTE            */}
      {/* ============================================================ */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            {/* Curved Atmosphere Rim Glow */}
            <linearGradient id="horizonGlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="20%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>

            {/* Earth/Planet Body Gradient */}
            <radialGradient id="earthBodyGrad" cx="50%" cy="110%" r="65%">
              <stop offset="0%" stopColor="#02295a" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#031f47" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#021029" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Broad atmospheric haze blur */}
          <path
            d="M-80,280 Q720,80 1520,280"
            stroke="#00f0ff"
            strokeWidth="24"
            opacity="0.25"
            style={{ filter: "blur(22px)" }}
          />
          <path
            d="M-40,280 Q720,95 1480,280"
            stroke="#38bdf8"
            strokeWidth="10"
            opacity="0.55"
            style={{ filter: "blur(10px)" }}
          />

          {/* Planet Curved Ocean/Cloud Body */}
          <path
            d="M-40,280 Q720,105 1480,280 L1480,280 L-40,280 Z"
            fill="url(#earthBodyGrad)"
          />

          {/* Sharp Atmospheric Cyan Horizon Rim Line */}
          <path
            d="M-40,280 Q720,105 1480,280"
            stroke="url(#horizonGlowLine)"
            strokeWidth="2.5"
            opacity="0.95"
          />

          {/* Mountain & Terrain Silhouette along the very bottom edge */}
          <path
            d="M0,280 L0,266 L35,254 L75,260 L115,248 L160,262 L220,250 L280,264 L340,252 L410,262 L480,256 L550,266 L620,254 L690,264 L760,252 L830,263 L900,250 L970,264 L1040,252 L1110,265 L1180,248 L1250,262 L1320,255 L1385,264 L1440,254 L1440,280 Z"
            fill="#030712"
            opacity="0.98"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 3. HERO CONTENT GRID                                         */}
      {/* ============================================================ */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:gap-12 px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-20 md:grid-cols-2 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT COLUMN: Brand, Headline, Search, CTAs & Trust */}
        <div className="text-center md:text-left">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-slate-900/80 px-3.5 py-1.5 sm:px-4 sm:py-1.5 text-xs font-medium text-slate-200 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span>250+ Free Online Tools</span>
            <span className="text-slate-600">•</span>
            <span>Fast</span>
            <span className="text-slate-600">•</span>
            <span>Private</span>
            <span className="text-slate-600">•</span>
            <span>No Signup</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-5 sm:mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Your files.
            <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(34,211,238,0.3)]">
              Reimagined<span className="text-indigo-400">.</span>
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto md:mx-0 mt-4 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
            Compress, convert, calculate, and format your files using fast
            online tools built for everyday work.
          </p>

          {/* Live Search Input with Right Arrow Button & Popular Chips */}
          <HeroSearch />

          {/* Call to Action Buttons */}
          <div className="mt-7 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center md:justify-start">
            {/* Primary Action Button */}
            <Link
              href="#all-tools"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(6,182,212,0.55)] active:scale-95"
            >
              <span>Explore All Tools</span>
              <span className="ml-2 text-base">→</span>
            </Link>

            {/* Secondary Action Button (Links to Architecture & Privacy Explanation) */}
            <Link
              href="#how-it-works"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/70 hover:bg-slate-800/90 px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-xl transition-all hover:border-cyan-400/40"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/15 text-cyan-300">
                <Play className="h-3.5 w-3.5 fill-cyan-300 ml-0.5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white leading-tight">Watch How It Works</div>
                <div className="text-[10px] text-slate-400">2 min tour</div>
              </div>
            </Link>
          </div>

          {/* Compact Horizontal Trust Features Row (Inspired by Reference Image) */}
          <div className="mt-8 sm:mt-9 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {/* 1. 100% In-Browser */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">100% In-Browser</div>
                <div className="text-[11px] text-slate-400 leading-tight">Your data stays on your device</div>
              </div>
            </div>

            {/* 2. No Signup Required */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">No Signup Required</div>
                <div className="text-[11px] text-slate-400 leading-tight">Start using tools instantly</div>
              </div>
            </div>

            {/* 3. Fast & Reliable */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Fast &amp; Reliable</div>
                <div className="text-[11px] text-slate-400 leading-tight">Optimized for speed</div>
              </div>
            </div>

            {/* 4. Free Forever */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 mt-0.5">
                <Heart className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Free Forever</div>
                <div className="text-[11px] text-slate-400 leading-tight">Always free, always useful</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Cinematic Nova Tool Universe */}
        <div className="relative mx-auto w-full max-w-[620px] lg:max-w-[660px]">
          <HeroToolUniverse />
        </div>
      </div>
    </section>
  );
}