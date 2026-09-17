import Link from "next/link";
import ToolCarousel from "@/components/ToolCarousel";
import { Sparkles, ArrowUp } from "lucide-react";

export default function ToolsSection() {
  return (
    <section
      id="workspace"
      className="relative overflow-hidden bg-slate-950 py-16 text-white [content-visibility:auto] [contain-intrinsic-size:1px_550px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.14),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(124,58,237,0.10),transparent_35%)]" />

      <div className="tools-glow absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="tools-glow-delay absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Spotlight</span>
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Quick Launcher:{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Popular Everyday Tools
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed">
            Spin through our most frequently accessed converters and resizers for immediate one-click document and photo tasks.
          </p>
        </div>

        <ToolCarousel />

        <div className="mx-auto mt-8 flex max-w-3xl flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs text-slate-400 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span>✓ 100% Client-Side</span>
            <span>✓ Zero Server Queues</span>
            <span>✓ No Signup Required</span>
          </div>

          <Link
            href="#all-tools"
            className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Back to All 251 Tools</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}