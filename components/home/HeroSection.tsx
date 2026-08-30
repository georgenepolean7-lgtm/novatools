import Link from "next/link";
import AuroraBackground from "@/components/AuroraBackground";
import HeroLighting from "@/components/HeroLighting";
import CinematicHero from "@/components/CinematicHero";
import HeroParticles from "@/components/HeroParticles";
import HeroSearch from "./HeroSearch";
import { HeroDesktopVisuals, HeroUploadVisual } from "./HeroBackgroundEffects";

export default function HeroSection() {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-slate-950">
      <AuroraBackground />
      <HeroLighting />
      <CinematicHero />
      <HeroParticles />
      <HeroDesktopVisuals />

      <div className="hero-blue-glow pointer-events-none absolute left-[-220px] top-[-180px] h-[700px] w-[700px] rounded-full bg-cyan-500/20 blur-[170px]" />
      <div className="hero-purple-glow pointer-events-none absolute right-[-220px] top-[80px] h-[650px] w-[650px] rounded-full bg-fuchsia-500/20 blur-[170px]" />
      <div className="hero-center-glow pointer-events-none absolute left-1/2 top-[45%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-260px] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[180px]" />

      <div className="relative z-10 mx-auto grid min-h-[820px] max-w-7xl items-center gap-14 px-6 pb-20 pt-36 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="mt-10 text-center lg:mt-0 lg:text-left">
          <div className="glow-border inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 px-5 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,.18)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(34,211,238,.35)]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />
            Free Online Tools
            <span className="text-white/30">•</span>
            Fast
            <span className="text-white/30">•</span>
            Simple
          </div>

          <h1 className="neon-blue mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Your files.
            <span className="neon-text block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Reimagined.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 lg:mx-0">
            Compress, resize, convert and extract your files using fast online
            tools built for everyday work.
          </p>

          <HeroSearch />

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="#tools"
              className="glow-border inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 px-7 py-4 font-semibold text-white shadow-[0_0_35px_rgba(34,211,238,.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_70px_rgba(34,211,238,.55)] active:scale-95 sm:w-auto"
            >
              Explore Free Tools
              <span className="ml-2">→</span>
            </Link>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 backdrop-blur-xl">
              ✓ No signup required
            </div>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            {["Free to use", "Mobile friendly", "Fast processing"].map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-lg"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[520px] lg:block">
          <HeroUploadVisual />

          {/* Floating Glass Status */}
          <div className="absolute left-14 top-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Image
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              50 KB ✓
            </p>
          </div>

          {/* Floating PDF */}
          <div className="absolute -right-12 bottom-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              PDF Ready
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              3 Pages ✓
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}