"use client";

import { motion } from "framer-motion";

export default function TransitionSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <p className="mb-4 text-cyan-400 uppercase tracking-[0.4em] text-sm">
          NOVA EXPERIENCE
        </p>

        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Fast.
          <br />
          Secure.
          <br />
          Beautiful.
        </h2>

        <p className="mt-8 text-lg text-gray-400 max-w-2xl mx-auto">
          Every tool is crafted to deliver premium performance with smooth
          animations and a modern user experience.
        </p>
      </motion.div>

      {/* Floating Glow */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"
      />
    </section>
  );
}