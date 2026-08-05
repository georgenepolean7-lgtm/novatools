import type { ReactNode } from "react";

type UploadCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function UploadCard({
  children,
  title = "Upload your file",
  description = "Choose a file to get started.",
}: UploadCardProps) {
  return (
    <div className="group relative mx-auto max-w-3xl overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-1 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-[80px]" />

      <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/50 p-6 sm:p-9 backdrop-blur-2xl">
       
       <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
  <div className="absolute -left-40 top-0 h-full w-32 -rotate-12 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[700px]" />
</div>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-3xl shadow-[0_0_60px_rgba(34,211,238,0.30)] transition-all duration-500 hover:scale-110">
            ↑
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
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