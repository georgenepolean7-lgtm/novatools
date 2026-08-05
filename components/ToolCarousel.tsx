"use client";

import { useRef, useState } from "react";

const tools = [
  {
    title: "Compress Image",
    description: "Reduce image size to 20KB, 50KB, 100KB or your exact target.",
    icon: "🖼️",
    href: "/compress-image",
  },
  {
    title: "Image Resizer",
    description: "Resize JPG and PNG images to the exact width and height you need.",
    icon: "📐",
    href: "/image-resizer",
  },
  {
    title: "Signature Resizer",
    description: "Resize and compress signatures for online applications and exams.",
    icon: "✍️",
    href: "/signature-resizer",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF size for online forms, applications and document uploads.",
    icon: "📄",
    href: "/compress-pdf",
  },
 
{
  title: "Merge PDF",
  description: "Combine multiple PDF files into one document.",
  icon: "📑",
  href: "/merge-pdf",
},
 {
    title: "JPG to PDF",
    description: "Convert one or multiple JPG images into a PDF document.",
    icon: "🔄",
    href: "/jpg-to-pdf",
  },
  {
  title: "PDF to JPG",
  description: "Convert every PDF page into high quality JPG images.",
  icon: "🖼️",
  href: "/pdf-to-jpg",
},
{
  title: "Split PDF",
  description: "Extract selected pages or split PDF into multiple files.",
  icon: "✂️",
  href: "/split-pdf",
},
{
  title: "Rotate PDF",
  description: "Rotate PDF pages by 90°, 180° or 270° instantly.",
  icon: "🔄",
  href: "/rotate-pdf",
},
  {
    title: "Tamil Image to Text",
    description: "Extract Tamil text from photos, screenshots and scanned images.",
    icon: "தமிழ்",
    href: "/tamil-image-to-text",
  },
];

export default function ToolCarousel() {
  const [active, setActive] = useState(
  Math.floor(tools.length / 2)
);

  const lastMoveTime = useRef(0);

  const moveLeft = () => {
    setActive((current) =>
      current === 0 ? tools.length - 1 : current - 1
    );
  };

  const moveRight = () => {
    setActive((current) =>
      current === tools.length - 1 ? 0 : current + 1
    );
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const now = Date.now();

    // 800ms cooldown
    if (now - lastMoveTime.current < 800) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // Left 20%
    if (mouseX < rect.width * 0.2) {
      moveLeft();
      lastMoveTime.current = now;
    }

    // Right 20%
    if (mouseX > rect.width * 0.8) {
      moveRight();
      lastMoveTime.current = now;
    }
  };

  return (
    <div className="relative mx-auto mt-14 max-w-7xl">
      <div
        className="relative h-[390px] overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {tools.map((tool, index) => {
          let offset = index - active;

          if (offset > tools.length / 2) {
            offset -= tools.length;
          }

          if (offset < -tools.length / 2) {
            offset += tools.length;
          }

          const distance = Math.abs(offset);

          return (
            <a
              key={tool.title}
              href={tool.href}
             className="group absolute left-1/2 top-1/2 w-[320px] rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-[0_20px_60px_rgba(34,211,238,.18)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40"
              style={{
                transform: `
                  translate(-50%, -50%)
                  translateX(${offset * 280}px)
                  translateY(${distance * 22}px)
                  scale(${distance === 0 ? 1.08 : 0.82})
                  rotateY(${offset * -8}deg)
                `,
                opacity:
                  distance > 2
                    ? 0
                    : 1 - distance * 0.18,
                zIndex: 20 - distance,
                boxShadow:
  distance === 0
    ? "0 30px 80px rgba(34,211,238,.22)"
    : "0 10px 30px rgba(0,0,0,.25)",
                transition:
                  "transform 850ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms ease",
                  filter:
  distance === 0
    ? "blur(0px)"
    : "blur(2px)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl">
                  {tool.icon}
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
                  ↗
                </div>
              </div>

              <h3 className="mt-7 text-xl font-bold text-white">
                {tool.title}
              </h3>

              <p className="mt-3 min-h-20 leading-7 text-slate-400">
                {tool.description}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-all duration-300 group-hover:gap-3 group-hover:text-cyan-200">
  Open Tool
  <span>→</span>
</div>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={moveLeft}
        className="absolute left-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-xl text-white backdrop-blur-xl transition hover:bg-blue-600"
        aria-label="Previous tool"
      >
        ←
      </button>

      <button
        type="button"
        onClick={moveRight}
        className="absolute right-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-xl text-white backdrop-blur-xl transition hover:bg-blue-600"
        aria-label="Next tool"
      >
        →
      </button>

      <div className="mt-2 flex justify-center gap-2">
        {tools.map((tool, index) => (
          <button
            key={tool.title}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${tool.title}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === active
                ? "w-8 bg-cyan-400"
                : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}