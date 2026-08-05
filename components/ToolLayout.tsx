import type { ReactNode } from "react";

type ToolLayoutProps = {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
};

export default function ToolLayout({
  title,
  description,
  badge = "Nova Tools",
  children,
}: ToolLayoutProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute -right-40 top-[35%] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[130px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.10),transparent_40%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {badge}
          </div>

          <h1 className="mt-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl">
  {children}
</div>
      </div>
    </section>
  );
}