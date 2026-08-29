import React from "react";
import { Cpu, ShieldCheck, Zap, Laptop } from "lucide-react";

export default function ExploreNovaSection() {
  const benefits = [
    {
      icon: Cpu,
      title: "Browser-Based Processing",
      description:
        "Many Nova Tools execute client-side using modern Web APIs (Canvas, WebAssembly, Web Workers), avoiding unnecessary network roundtrips.",
      badge: "Local Execution",
    },
    {
      icon: ShieldCheck,
      title: "No Upload Required",
      description:
        "For client-side utilities, your sensitive documents, personal images, and code snippets stay on your device and are never transmitted to remote servers.",
      badge: "Private by Design",
    },
    {
      icon: Zap,
      title: "Free to Use",
      description:
        "Access fast online tools without paywalls, subscription models, compulsory account registrations, or watermarks.",
      badge: "Zero Friction",
    },
    {
      icon: Laptop,
      title: "Built for Everyday Tasks",
      description:
        "Clean, responsive interfaces crafted for rapid conversion, formatting, calculations, and optimization across desktop and mobile browsers.",
      badge: "Mobile & Desktop",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 [content-visibility:auto]">
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Why Use Nova Tools
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered for Speed, Privacy &amp; Simplicity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Reliable everyday utilities designed with modern browser technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {item.badge}
                  </span>
                  <h3 className="font-bold text-white text-base tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
