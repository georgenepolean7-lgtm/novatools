"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Process your files in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "Your files stay private.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    desc: "Desktop, Tablet & Mobile.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    desc: "Modern UI with smooth animations.",
  },
];

export default function WhyNova() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-5xl font-bold text-white"
        >
          Why Nova Tools?
        </motion.h2>

        <p className="mt-4 text-center text-gray-400 max-w-2xl mx-auto">
          Built for speed, security and simplicity.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <Icon className="h-10 w-10 text-cyan-400" />

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}