"use client";

import { CheckCircle2, FileImage, UploadCloud } from "lucide-react";

export default function HeroUploadDemo() {
  return (
    <div className="relative isolate w-full max-w-md overflow-hidden rounded-[32px] border border-cyan-400/20 bg-white/[0.08] p-6 shadow-[0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl transition-all duration-700 animate-in fade-in slide-in-from-right-8">
      {/* Blue Aura */}
      <div className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Purple Aura */}
      <div className="pointer-events-none absolute -right-28 -bottom-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[120px]" />

      {/* Center Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-500/10 blur-3xl" />

      {/* Animated Ring */}
      <div className="hero-ring absolute -inset-10 rounded-[40px]" />

      {/* Inner Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-cyan-400/10 shadow-[0_0_80px_rgba(34,211,238,.25)]" />

      {/* Floating Blue Orb */}
      <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Floating Purple Orb */}
      <div className="absolute -right-24 bottom-[-80px] h-56 w-56 rounded-full bg-violet-500/20 blur-[120px]" />

      {/* Glass Reflection */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

      <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      
      {/* Animated Neon Border */}
      <div className="hero-card-border absolute inset-0 rounded-[32px]" />

      {/* Top Neon Line */}
      <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80" />

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 h-20 w-56 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <UploadCloud className="h-7 w-7 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">Uploading File</h3>
            <p className="text-sm text-gray-400">holiday-photo.jpg</p>
          </div>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 w-full animate-[pulse_2.5s_ease-in-out_infinite]" />
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 p-4 transition-all">
          <CheckCircle2 className="text-emerald-400" />
          <span className="text-white">Compression Completed</span>
        </div>

        <div className="absolute -right-8 -top-8 rounded-2xl bg-cyan-500/20 p-4 backdrop-blur-xl animate-bounce [animation-duration:4s]">
          <FileImage className="h-8 w-8 text-cyan-300" />
        </div>
      </div>
    </div>
  );
}