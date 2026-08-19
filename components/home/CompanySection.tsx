export default function CompanySection() {
  return (
    <section
      id="company"
      className="relative overflow-hidden bg-slate-950 py-24 text-white [content-visibility:auto]"
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
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Developer Note
              </p>

              <h3 className="mt-4 text-3xl font-bold">
                Nova Code Tech
              </h3>

              <p className="mt-6 text-slate-300 leading-8">
                We believe online file tools should be simple, fast, and
                respect user privacy.
              </p>

              <p className="mt-4 text-slate-400 leading-8">
                Nova Tools is crafted to help people compress documents, resize
                images, and extract information without unnecessary friction.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">
                  N
                </div>
                <div>
                  <p className="font-semibold text-white">George Nepolean</p>
                  <p className="text-sm text-slate-400">Founder &amp; Developer, Nova Code Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}