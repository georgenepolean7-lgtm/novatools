"use client";

import { useEffect, useState } from "react";

const files = [
  {
    icon: "🖼️",
    name: "IMAGE",
    detail: "50 KB",
    className: "cinematic-file file-1",
  },
  {
    icon: "📄",
    name: "PDF",
    detail: "Ready",
    className: "cinematic-file file-2",
  },
  {
    icon: "📐",
    name: "RESIZE",
    detail: "1080 × 1080",
    className: "cinematic-file file-3",
  },
  {
    icon: "✍️",
    name: "SIGNATURE",
    detail: "20 KB",
    className: "cinematic-file file-4",
  },
  {
    icon: "🔄",
    name: "CONVERT",
    detail: "JPG → PDF",
    className: "cinematic-file file-5",
  },
  {
    icon: "தமிழ்",
    name: "OCR",
    detail: "Text Ready",
    className: "cinematic-file file-6",
  },
];

export default function CinematicFiles() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden lg:block"
      aria-hidden="true"
    >
      {files.map((file, index) => {
        const direction = index % 2 === 0 ? 1 : -1;

        const xMove =
          scrollY * (0.08 + index * 0.025) * direction;

        const yMove =
          scrollY * (0.02 + index * 0.008);

        const rotate =
          scrollY * 0.002 * direction;

        return (
          <div
            key={file.name}
            className={file.className}
            style={{
              translate: `${xMove}px ${yMove}px`,
              rotate: `${rotate}deg`,
            }}
          >
            <div className="cinematic-file-icon">
              {file.icon}
            </div>

            <div>
              <p className="cinematic-file-name">
                {file.name}
              </p>

              <p className="cinematic-file-detail">
                {file.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}