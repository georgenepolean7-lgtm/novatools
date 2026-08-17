"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Robot floating animation
      gsap.to(robotRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Cards staggered reveal
      gsap.from(".about-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-32 text-white"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
            About Nova Tools
          </span>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Built for Speed, Privacy &amp; Simplicity
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Nova Tools helps you compress, convert and manage files with a
            modern, fast and secure experience.
          </p>
        </div>

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">

          <div
            ref={robotRef}
            className="flex justify-center"
          >
            <Image
              src="/nova-robot.png"
              alt="Nova Robot"
              width={340}
              height={340}
              className="w-[340px] h-auto drop-shadow-[0_25px_50px_rgba(59,130,246,0.4)]"
            />
          </div>

          <div className="space-y-6">

            <div className="about-card rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold">⚡ Fast Processing</h3>
              <p className="mt-3 text-slate-400">
                Upload your file and get results in seconds.
              </p>
            </div>

            <div className="about-card rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold">🔒 Privacy First</h3>
              <p className="mt-3 text-slate-400">
                Your files stay protected throughout processing.
              </p>
            </div>

            <div className="about-card rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold">📱 Works Everywhere</h3>
              <p className="mt-3 text-slate-400">
                Use Nova Tools on desktop, tablet or mobile.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}