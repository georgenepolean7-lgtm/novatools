"use client";

import Image from "next/image";

export default function CompanySection() {
  return (
    <section
  id="tools"
  className="relative overflow-hidden bg-slate-950 py-24 text-white"
>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,.12),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(59,130,246,.12),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="about-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-10 shadow-2xl backdrop-blur-2xl">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]" />

            <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-blue-600/10 blur-[100px]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                NEXT GENERATION FILE TOOLS
              </div>

              <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
                Building the Future of
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Smart File Processing
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-9 text-slate-400">
                Compress, convert and manage files with a modern experience
                built for speed, privacy and simplicity.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">⚡ Fast</span>
                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-300">🔒 Secure</span>
                <span className="rounded-full bg-violet-500/10 px-4 py-2 text-violet-300">📱 Mobile</span>
                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-300">☁ Cloud</span>
              </div>

            </div>

          </div>

          <div className="about-card relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.05] p-10 backdrop-blur-2xl">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />

            <div className="relative z-10">

              <div className="flex items-center gap-4">

                <Image
                  src="/icon.png"
                  alt="Nova Tools"
                  width={64}
                  height={64}
                  className="rounded-3xl shadow-xl"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Contact
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    Nova Code Tech
                  </h2>
                </div>

              </div>

              <p className="mt-8 text-lg leading-8 text-slate-400">
                Questions, feedback or business enquiries?
                We'd love to hear from you.
              </p>

              <div className="mt-10 space-y-4">

                <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                  <span className="text-slate-500">Company</span>
                  <span className="font-semibold">Nova Code Tech</span>
                </div>

                <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                  <span className="text-slate-500">Product</span>
                  <span className="font-semibold">Nova Tools</span>
                </div>

                <div className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold">
                    Puducherry, India
                  </span>
                </div>

              </div>

              <div className="mt-8 flex items-center gap-3 font-medium text-emerald-300">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                Nova Tools is Online
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}