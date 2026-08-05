"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ToolCardProps = {
  title: string;
  description: string;
  icon: string;
  href: string;
};

export default function ToolCard({
  title,
  description,
  icon,
  href,
}: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />

      <div className="relative z-10">
        <div className="mb-5 text-5xl">{icon}</div>

        <h3 className="mb-2 text-2xl font-bold text-white">
          {title}
        </h3>

        <p className="mb-6 text-gray-400">
          {description}
        </p>

        <Link
          href={href}
          className="inline-flex items-center gap-2 text-cyan-400 transition-all duration-300 group-hover:gap-4"
        >
          Open Tool →
        </Link>
      </div>
    </motion.div>
  );
}