"use client";

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
        ease: "power1.inOut",
      });

      // Cards reveal
      gsap.from(".about-card", {
        opacity: 0,
        y: 80,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-950 py-24 text-white"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
            About Nova Tools
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Built for
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Speed.
            </span>
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
            <img
              src="/nova-robot.png"
              alt="Nova Robot"
              className="w-[340px] drop-shadow-[0_25px_50px_rgba(59,130,246,0.4)]"
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