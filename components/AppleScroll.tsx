"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    title: "Powerful.",
    subtitle: "Professional tools for everyone.",
    color: "#ffffff",
  },
  {
    title: "Beautiful.",
    subtitle: "Designed with a cinematic experience.",
    color: "#38bdf8",
  },
  {
    title: "Fast.",
    subtitle: "Lightning fast processing.",
    color: "#ffffff",
  },
  {
    title: "Built for Creators.",
    subtitle: "Nova Tools makes work effortless.",
    color: "#38bdf8",
  },
];

export default function AppleScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".nova-slide");

      panels.forEach((panel) => {
        gsap.set(panel, {
          opacity: 0,
          scale: 0.85,
          filter: "blur(20px)",
        });
      });

      if (panels.length > 0) {
        gsap.set(panels[0], {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4000",
          scrub: 1,
          pin: true,
        },
      });

      panels.forEach((panel, index) => {
        if (index !== 0) {
          tl.to(
            panels[index - 1],
            {
              opacity: 0,
              scale: 1.25,
              filter: "blur(25px)",
              duration: 1,
            },
            "+=0.5"
          );

          tl.to(
            panel,
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1,
            },
            "<"
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#040816]"
    >
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="relative flex h-full items-center justify-center">
        {slides.map((slide) => (
          <div
            key={slide.title}
            className="nova-slide absolute text-center"
          >
            <h1
              style={{ color: slide.color }}
              className="text-6xl font-black md:text-8xl xl:text-9xl"
            >
              {slide.title}
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-400">
              {slide.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}