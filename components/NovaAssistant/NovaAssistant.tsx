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
  idle: "/novabuddy/idle.png",
  point: "/novabuddy/point.png",
  uploading: "/novabuddy/upload.png",
  processing: "/novabuddy/processing.png",
  success: "/novabuddy/success.png",
  error: "/novabuddy/error.png",
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