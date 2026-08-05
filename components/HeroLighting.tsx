"use client";

export default function HeroLighting() {
  return (
    <>
      {/* Left Blue Nebula */}
      <div className="hero-nebula-blue absolute -left-72 top-[-120px] h-[900px] w-[900px] rounded-full" />

      {/* Right Purple Nebula */}
      <div className="hero-nebula-purple absolute -right-72 top-[-80px] h-[900px] w-[900px] rounded-full" />

      {/* Center Glow */}
      <div className="hero-center-light absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      {/* Bottom Aurora */}
      <div className="hero-bottom-aurora absolute bottom-[-220px] left-1/2 h-[500px] w-[1400px] -translate-x-1/2 rounded-full" />
    </>
  );
}