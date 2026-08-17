"use client";

import Link from "next/link";

type ToolCardProps = {
  title: string;
  description: string;
  icon: string;
  href: string;
};

export default function ToolCard({
  title,
  description,
  icon,
  href,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-7 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:bg-slate-900/90 hover:shadow-[0_20px_50px_rgba(34,211,238,0.12)]"
    >
      {/* Subtle Hover Gradient Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-inner transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-300">
            ↗
          </div>
        </div>

        <h3 className="mt-5 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-300">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 transition-all duration-300 group-hover:gap-3 group-hover:text-cyan-300">
          Open Tool <span>→</span>
        </span>
      </div>
    </Link>
  );
}