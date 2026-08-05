"use client";

import { motion } from "framer-motion";

export default function CinematicSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816]">

      {/* Glow */}
      <div className="absolute h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 text-center"
      >
        <p className="mb-6 text-cyan-400 tracking-[0.5em] uppercase">
          NOVA TOOLS
        </p>

        <h2 className="text-6xl font-bold text-white md:text-8xl">
          Powerful.
        </h2>

        <h2 className="mt-4 text-6xl font-bold text-cyan-400 md:text-8xl">
          Beautiful.
        </h2>

        <h2 className="mt-4 text-6xl font-bold text-white md:text-8xl">
          Fast.
        </h2>

        <p className="mx-auto mt-10 max-w-2xl text-xl text-gray-400">
          Professional tools designed with a cinematic experience.
        </p>
      </motion.div>
    </section>
  );
}