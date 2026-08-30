"use client";

import dynamic from "next/dynamic";

const CinematicFiles = dynamic(
  () => import("@/components/CinematicFiles"),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HeroDesktopVisuals() {
  return <CinematicFiles />;
}

const HeroUploadDemo = dynamic(
  () => import("@/components/HeroUploadDemo"),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HeroUploadVisual() {
  return <HeroUploadDemo />;
}
