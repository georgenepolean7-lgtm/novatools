"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 24 });

export default function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {particles.map((_, index) => {

        const size = 2 + (index % 4);

        const left = (index * 4.1) % 100;

        const delay = index * 0.4;

        const duration = 10 + (index % 6);

        return (
          <motion.div
            key={index}
            className="absolute rounded-full bg-cyan-400/40"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-20px",
              opacity: 0.15,
            }}
            animate={{
              y: [-20, -700],
              opacity: [0, 0.8, 0],
              x: [0, 20, -15, 10],
              scale: [1, 1.4, 0.8],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );

      })}

    </div>
  );
}