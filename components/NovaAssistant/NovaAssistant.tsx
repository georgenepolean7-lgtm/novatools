"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type NovaState =
  | "idle"
  | "point"
  | "uploading"
  | "processing"
  | "success"
  | "error";

interface Props {
  state: NovaState;
}

const images: Record<NovaState, string> = {
  idle: "/novabuddy/idle.webp",
  point: "/novabuddy/point.webp",
  uploading: "/novabuddy/upload.webp",
  processing: "/novabuddy/processing.webp",
  success: "/novabuddy/success.webp",
  error: "/novabuddy/error.webp",
};

export default function NovaAssistant({ state }: Props) {
    const [position, setPosition] = useState({
  bottom: 24,
  right: 24,
});

useEffect(() => {
  switch (state) {
    case "uploading":
    case "processing":
      setPosition({
        bottom: 180,
        right: 320,
      });
      break;

    default:
      setPosition({
        bottom: 24,
        right: 24,
      });
  }
}, [state]);
 return (
  <div
    className="fixed z-50 pointer-events-none transition-all duration-700 ease-in-out"
    style={{
      bottom: `${position.bottom}px`,
      right: `${position.right}px`,
    }}
  >
     <Image
  src={images[state]}
  alt="Nova Buddy"
  width={220}
  height={220}
  priority
  className={
    state === "processing"
      ? "nova-spin"
      : "nova-float"
  }
/>
    </div>
  );
}