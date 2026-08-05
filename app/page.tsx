"use client";

import HeroParticles from "@/components/HeroParticles";
import HeroLighting from "@/components/HeroLighting";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CinematicFiles from "@/components/CinematicFiles";
import CinematicHero from "@/components/CinematicHero";
import ToolCarousel from "@/components/ToolCarousel";
//import CinematicSection from "@/components/CinematicSection";
//import AppleScroll from "@/components/AppleScroll";
//import ToolUniverse from "@/components/ToolUniverse";
import HeroUploadDemo from "@/components/HeroUploadDemo";
import AuroraBackground from "@/components/AuroraBackground";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tools = [

  {
    title: "Compress Image",
    description: "Reduce image size to 20KB, 50KB, 100KB or your exact target.",
    icon: "🖼️",
  },
  {
    title: "Image Resizer",
    description: "Resize JPG and PNG images to the exact width and height you need.",
    icon: "📐",
  },
  {
    title: "Signature Resizer",
    description: "Resize and compress signatures for online applications and exams.",
    icon: "✍️",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF size for online forms, applications and document uploads.",
    icon: "📄",
  },
  {
    title: "JPG to PDF",
    description: "Convert one or multiple JPG images into a PDF document.",
    icon: "🔄",
  },
  {
  title: "PDF to JPG",
  description: "Convert every PDF page into high quality JPG images.",
  href: "/pdf-to-jpg",
  icon: "🖼️",
},

{
  title: "Split PDF",
  description: "Extract selected pages or split PDF into multiple files.",
  href: "/split-pdf",
  icon: "✂️",
},

{
  title: "Rotate PDF",
  description: "Rotate PDF pages 90°, 180° or 270° instantly.",
  href: "/rotate-pdf",
  icon: "🔄",
},
  {
    title: "Tamil Image to Text",
    description: "Extract Tamil text from photos, screenshots and scanned images.",
    icon: "தமிழ்",
  },
];

export default function Home() {
  const aboutRef = useRef(null);

const lightRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const move = (e: MouseEvent) => {
    if (!lightRef.current) return;

    lightRef.current.style.left = `${e.clientX}px`;
    lightRef.current.style.top = `${e.clientY}px`;
  };

  window.addEventListener("mousemove", move);

  return () => window.removeEventListener("mousemove", move);
}, []);

  useGSAP(() => {
 gsap.fromTo(
  ".about-card",
  {
    opacity: 0,
    y: 80,
  },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    overwrite: "auto",
    scrollTrigger: {
      trigger: aboutRef.current,
      start: "top 75%",
    },
  }
);

  gsap.to(".nova-robot-run", {
    y: -12,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
  gsap.fromTo(
  ".ai-video",
  {
    scale: 1.15,
  },
  {
    scale: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".ai-factory-video",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  }
);
},);
  return (
    <main className="min-h-screen bg-slate-950 text-white">

<div
  ref={lightRef}
  className="pointer-events-none fixed z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px] transition-transform duration-75"
/>

      <SiteHeader />
     <section className="relative min-h-[720px] overflow-hidden bg-slate-950">

  <AuroraBackground />
  <HeroLighting />
{/* Blue Glow */}
<div className="hero-blue-glow pointer-events-none absolute left-[-220px] top-[-180px] h-[700px] w-[700px] rounded-full bg-cyan-500/20 blur-[170px]" />

{/* Purple Glow */}
<div className="hero-purple-glow pointer-events-none absolute  right-[-220px] top-[80px] h-[650px] w-[650px] rounded-full bg-fuchsia-500/20 blur-[170px]" />

{/* Center Light */}
<div className="hero-center-glow pointer-events-none absolute left-1/2 top-[45%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

{/* Bottom Glow */}
<div className="pointer-events-none absolute bottom-[-260px] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[180px]" />
  <CinematicHero />
  <HeroParticles />
  <CinematicFiles />

  {/* Content */}
 <div className="relative z-10 mx-auto grid min-h-[820px] max-w-7xl items-center gap-14 px-6 pt-36 pb-20 lg:grid-cols-[1.05fr_0.95fr]">
    {/* Left */}
  <div className="mt-10 text-center lg:mt-0 lg:text-left">
      <div className="glow-border inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 px-5 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,.18)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(34,211,238,.35)]">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />
        Free Online Tools
        <span className="text-white/30">•</span>
        Fast
        <span className="text-white/30">•</span>
        Simple
      </div>

     <h1 className="neon-blue mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
        Your files.
        <span className="neon-text block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
          Reimagined.
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 lg:mx-0">
        Compress, resize, convert and extract your files using fast online
        tools built for everyday work.
      </p>

      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
        <a
          href="#tools"
          className="glow-border inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 px-7 py-4 font-semibold text-white shadow-[0_0_35px_rgba(34,211,238,.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_70px_rgba(34,211,238,.55)] active:scale-95 sm:w-auto"
        >
          Explore Free Tools
          <span className="ml-2">→</span>
        </a>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 backdrop-blur-xl">
          ✓ No signup required
        </div>
      </div>

      <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
        {["Free to use", "Mobile friendly", "Fast processing"].map(
          (item) => (
            <div
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-lg"
            >
              ✓ {item}
            </div>
          )
        )}
      </div>
    </div>

    {/* Right glass workspace */}
    <div className="hidden lg:flex items-center justify-center">
  <HeroUploadDemo />
</div>
    <div className="relative mx-auto hidden w-full max-w-[520px] lg:block">
    {/*<div className="absolute -inset-12 rounded-full bg-cyan-500/5 blur-[60px]" />

      <div className="relative rounded-[32px] border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="Nova Tools"
              className="h-12 w-12 rounded-2xl object-cover shadow-lg"
            />

            <div>
              <p className="font-semibold text-white">Nova Tools</p>
              <p className="text-xs text-slate-400">
                Choose what you want to do
              </p>
            </div>
          </div>

          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: "Compress Image",
              info: "Reduce file size",
              icon: "🖼️",
              href: "/compress-image",
            },
            {
              name: "Compress PDF",
              info: "Optimize PDF",
              icon: "📄",
              href: "/compress-pdf",
            },
            {
              name: "Image Resizer",
              info: "Exact dimensions",
              icon: "📐",
              href: "/image-resizer",
            },
            {
              name: "JPG to PDF",
              info: "Convert images",
              icon: "🔄",
              href: "/jpg-to-pdf",
            },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/[0.12]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-lg">
                {item.icon}
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {item.info}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs text-slate-400">Nova Workspace</p>
            <p className="mt-1 text-sm font-semibold text-white">
              6 tools available
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Online
          </div>
        </div>
      </div>

      {/* Floating glass file */}
      <div className="absolute right-[45%] top-[62%]-left-14 top-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">
          Image
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          50 KB ✓
        </p>
      </div>

      {/* Floating glass PDF */}
      <div className="absolute -right-12 bottom-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">
          PDF Ready
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          3 Pages ✓
        </p>
      </div>
    </div>
  </div>

  {/* Bottom fade into tools */}
 {/* <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
</section>



    <section
  id="tools"
  className="relative overflow-hidden bg-slate-950 py-24 text-white"
>
  {/* Cinematic background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.16),transparent_35%)]" />

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(124,58,237,0.12),transparent_35%)]" />

  <div className="tools-glow absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

  <div className="tools-glow-delay absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />

  <div className="relative z-10 mx-auto max-w-7xl px-8 lg:px-12">
    {/* Heading */}
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

  <section id="tools">
  <ToolCarousel />
</section>
   
    {/* Trust bar */}
    <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-slate-400 backdrop-blur-xl">
      <span>✓ Free to use</span>
      <span>✓ No signup</span>
      <span>✓ Mobile friendly</span>
      <span>✓ Fast processing</span>
    </div>
  </div>
</section> 

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
     </p>
      <section id="about">
        Why Nova Tools
        </section>
      

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
        <img
          src="/nova-robot.png"
          alt="Nova robot moving digital files"
          className="w-[360px] drop-shadow-[0_20px_35px_rgba(59,130,246,0.3)]"
        />
      </div>

      <div className="absolute left-8 top-8 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
        <p className="text-xs text-slate-400">Processing</p>
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
     <div className="about-card relative z-10 rounded-3xl border border-white/10 bg-white/[0.05] p-6 opacity-100 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.08]">
        <div className="text-2xl">⚡</div>

        <h3 className="mt-4 text-lg font-bold">
          Fast
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Get common file tasks completed without complicated steps.
        </p>
      </div>

      <div className="about-card rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.08]">
        <div className="text-2xl">🔒</div>

        <h3 className="mt-4 text-lg font-bold">
          Privacy Focused
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Our tools are designed with your file privacy in mind.
        </p>
      </div>

      <div className="about-card rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.08]">
        <div className="text-2xl">📱</div>

        <h3 className="mt-4 text-lg font-bold">
          Mobile Friendly
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Use Nova Tools from your phone, tablet or computer.
        </p>
      </div>
    </div>
  </div>
</section>


<section
  id="company"
  className="relative overflow-hidden border-t border-white/10 bg-slate-950 py-24 text-white"
>
  {/* Background Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,.12),transparent_35%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(59,130,246,.12),transparent_35%)]" />

  <div className="relative z-10 mx-auto max-w-7xl px-6">
    <div className="grid gap-8 lg:grid-cols-2">

      {/* LEFT */}
      <div className="about-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-10 shadow-2xl backdrop-blur-2xl">

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            NEXT GENERATION FILE TOOLS
          </div>

          <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
            Building the Future of
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Smart File Processing
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-9 text-slate-200 text-slate-400">
            Compress, convert and manage files with a modern experience built
            for speed, privacy and simplicity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">⚡ Fast</span>
            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-300">🔒 Secure</span>
            <span className="rounded-full bg-violet-500/10 px-4 py-2 text-violet-300">📱 Mobile</span>
            <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-300">☁ Cloud</span>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-4xl font-bold text-cyan-300">6+</p>
              <p className="mt-2 text-sm text-slate-400">Tools</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-4xl font-bold text-emerald-300">100%</p>
              <p className="mt-2 text-sm text-slate-400">Free</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-4xl font-bold text-violet-300">24/7</p>
              <p className="mt-2 text-sm text-slate-400">Online</p>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="about-card relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.05] p-10 backdrop-blur-2xl">

        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />

        <div className="relative z-10">

          <div className="flex items-center gap-4">

            <img
              src="/icon.png"
              alt="Nova Tools"
              className="h-16 w-16 rounded-3xl shadow-xl"
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
            Questions, feedback or business enquiries? We'd love to hear from you.
          </p>

          <div className="mt-10 space-y-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 flex justify-between">
              <span className="text-slate-500">Company</span>
              <span className="font-semibold">Nova Code Tech</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 flex justify-between">
              <span className="text-slate-500">Product</span>
              <span className="font-semibold">Nova Tools</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 flex justify-between">
              <span className="text-slate-500">Location</span>
              <span className="font-semibold">Puducherry, India</span>
            </div>

          </div>

          <div className="mt-8 flex items-center gap-3 text-emerald-300 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Nova Tools is Online
          </div>

        </div>

      </div>

    </div>
  </div>
</section>


<SiteFooter />
    </main>
  );
}