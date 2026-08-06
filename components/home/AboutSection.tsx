"use client";

import Image from "next/image";
import { RefObject } from "react";

type AboutSectionProps = {
  aboutRef: RefObject<HTMLDivElement | null>;
};

export default function AboutSection({
  aboutRef,
}: AboutSectionProps) {
  return (
    <section
      ref={aboutRef}
      id="about"
      className="relative overflow-hidden bg-slate-950 py-24 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.18),transparent_55%)]" />

      <div className="absolute left-1/4 top-1/2 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Why Nova Tools
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Built to make files
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {" "}feel simple.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
            Useful file tools designed for speed, privacy and everyday use
            across your phone and computer.
          </p>

        </div>

        <div className="relative mt-16 h-[330px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">

          <div className="absolute inset-x-10 bottom-12 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <div className="absolute inset-x-0 bottom-8 h-20 bg-blue-500/5 blur-3xl" />

          <div className="nova-robot-run absolute bottom-8 left-0">

            <Image
              src="/nova-robot.png"
              alt="Nova robot moving digital files"
              width={360}
              height={360}
              priority={false}
              className="drop-shadow-[0_20px_35px_rgba(59,130,246,0.3)]"
            />

          </div>

          <div className="absolute left-8 top-8 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">

            <p className="text-xs text-slate-400">
              Processing
            </p>

            <p className="mt-1 font-semibold text-cyan-300">
              Your files securely
            </p>

          </div>

          <div className="absolute right-8 top-8 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            Ready

          </div>

        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          {[
            {
              icon: "⚡",
              title: "Fast",
              text: "Get common file tasks completed without complicated steps.",
            },
            {
              icon: "🔒",
              title: "Privacy Focused",
              text: "Our tools are designed with your file privacy in mind.",
            },
            {
              icon: "📱",
              title: "Mobile Friendly",
              text: "Use Nova Tools from your phone, tablet or computer.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="about-card rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.08]"
            >
              <div className="text-2xl">
                {item.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.text}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}