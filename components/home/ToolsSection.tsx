import ToolCarousel from "@/components/ToolCarousel";

export default function ToolsSection() {
  return (
    <section
      id="tools"
      className="relative overflow-hidden bg-slate-950 py-24 text-white [content-visibility:auto]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.16),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(124,58,237,0.12),transparent_35%)]" />

      <div className="tools-glow absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="tools-glow-delay absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Nova Workspace
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need,
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              in one place.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
            Choose your tool, add your file and get the result you need
            without installing complicated software.
          </p>
        </div>

        <ToolCarousel />

        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-slate-400 backdrop-blur-xl">
          <span>✓ Free to use</span>
          <span>✓ No signup</span>
          <span>✓ Mobile friendly</span>
          <span>✓ Fast processing</span>
        </div>
      </div>
    </section>
  );
}