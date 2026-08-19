"use client";

import dynamic from "next/dynamic";

const HeroParticles = dynamic(
  () => import("@/components/HeroParticles"),
  {
    ssr: false,
    loading: () => null,
  }
);

const CinematicHero = dynamic(
  () => import("@/components/CinematicHero"),
  {
    ssr: false,
    loading: () => null,
  }
);

const CinematicFiles = dynamic(
  () => import("@/components/CinematicFiles"),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HeroBackgroundVisuals() {
  return (
    <>
      <CinematicHero />
      <HeroParticles />
      <CinematicFiles />
    </>
  );
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
