"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <motion.div
        animate={{
          x: [-80, 120, -80],
          y: [-40, 60, -40],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[140px]"
      />

      <motion.div
        animate={{
          x: [100, -120, 100],
          y: [50, -50, 50],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-10%] bottom-[-15%] h-[550px] w-[550px] rounded-full bg-blue-500/10 blur-[160px]"
      />

      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]"
      />
    </div>
  );
}