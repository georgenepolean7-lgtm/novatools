import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-white/10 bg-slate-950 py-24 text-white [content-visibility:auto]"
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
              sizes="(max-width: 768px) 240px, 360px"
              loading="lazy"
              className="h-auto w-auto"
            />
          </div>

          <div className="absolute bottom-8 right-8 hidden sm:block">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-slate-200 backdrop-blur-xl">
              100% In-Browser &amp; Private
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}