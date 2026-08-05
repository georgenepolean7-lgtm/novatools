import type { ReactNode } from "react";

type ResultCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function ResultCard({
  children,
  title = "Your file is ready",
  description = "Processing completed successfully.",
}: ResultCardProps) {
  return (
    <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-4xl border border-emerald-400/15 bg-white/5 p-1 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[80px]" />

      <div className="relative rounded-[28px] border border-white/5 bg-slate-950/40 p-6 sm:p-9">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-300">
            ✓
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Completed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <div className="mt-7">
          {children}
        </div>
      </div>
    </div>
  );
}