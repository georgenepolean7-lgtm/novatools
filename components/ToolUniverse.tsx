"use client";

import { motion } from "framer-motion";

const tools = [
  "Compress Image",
  "Merge PDF",
  "JPG to PDF",
  "Compress PDF",
  "Resize Image",
  "Crop Image",
  "Rotate PDF",
  "Word to PDF",
];

export default function ToolUniverse() {
  return (
    <section className="relative overflow-hidden bg-[#030712] py-40">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        <motion.h2
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-5xl font-black text-white md:text-7xl"
        >
          Everything You Need
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: .2 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-2xl text-center text-xl text-gray-400"
        >
          Fast. Secure. Beautiful. All your tools in one place.
        </motion.p>

        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {tools.map((tool, index) => (

            <motion.div
              key={tool}
              initial={{
                opacity: 0,
                y: 80,
                rotateX: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateX: 0,
              }}
              transition={{
                duration: .6,
                delay: index * .08,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                rotateY: 8,
              }}
              className="group rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-3xl">
                ⚡
              </div>

              <h3 className="text-2xl font-bold text-white">
                {tool}
              </h3>

              <p className="mt-4 text-gray-400">
                Professional quality processing with maximum speed and privacy.
              </p>

              <div className="mt-8 text-cyan-400 opacity-0 transition-all group-hover:opacity-100">
                Open Tool →
              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}