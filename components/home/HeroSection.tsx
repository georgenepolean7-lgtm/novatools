import Link from "next/link";
import AuroraBackground from "@/components/AuroraBackground";
import HeroLighting from "@/components/HeroLighting";
import CinematicHero from "@/components/CinematicHero";
import HeroParticles from "@/components/HeroParticles";
import HeroSearch from "./HeroSearch";
import { HeroDesktopVisuals } from "./HeroBackgroundEffects";
import HeroToolUniverse from "./HeroToolUniverse";

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

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:gap-14 px-4 sm:px-6 pb-16 pt-28 sm:pt-32 lg:pt-36 md:grid-cols-2 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="mt-4 text-center md:mt-0 md:text-left">
          <div className="glow-border inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-medium text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,.18)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(34,211,238,.35)]">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />
            250+ Free Online Tools
            <span className="text-white/30">•</span>
            Fast
            <span className="text-white/30">•</span>
            Private
          </div>

          <h1 className="neon-blue mt-6 sm:mt-7 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Your files.
            <span className="neon-text block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Reimagined.
            </span>
          </h1>

          <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-300 md:mx-0">
            Compress, convert, calculate, and format your files using fast
            online tools built for everyday work.
          </p>

          <HeroSearch />

          <div className="mt-7 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="#all-tools"
              className="glow-border inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 px-7 py-3.5 sm:py-4 font-semibold text-white shadow-[0_0_35px_rgba(34,211,238,.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_70px_rgba(34,211,238,.55)] active:scale-95 sm:w-auto text-sm sm:text-base"
            >
              Explore All Tools
              <span className="ml-2">→</span>
            </Link>

            <div className="pointer-events-none select-none flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-slate-400 backdrop-blur-xl">
              <span className="text-emerald-400 mr-2 font-bold">✓</span> No signup required
            </div>
          </div>

          <div className="mt-7 sm:mt-9 flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start">
            {["Free to use", "Mobile friendly", "Fast processing"].map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-medium text-slate-300 backdrop-blur-lg"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        {/* Product Visualization: Nova Tool Universe */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <HeroToolUniverse />
        </div>
      </div>
    </section>
  );
}