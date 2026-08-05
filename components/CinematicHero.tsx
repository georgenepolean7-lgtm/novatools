"use client";

export default function CinematicHero() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Background Image */}
     <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
  style={{
    backgroundImage: "url('/images/hero-bg.png')",
  }}
/>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/35" />

      {/* Left Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

{/* Moving Blue Aura */}
<div className="hero-aura-blue absolute left-[8%] top-[12%] h-[900px] w-[900px] rounded-full" />

{/* Moving Purple Aura */}
<div className="hero-aura-purple absolute right-[8%] bottom-[8%] h-[900px] w-[900px] rounded-full" />

{/* Aurora Layer */}
<div className="hero-aurora" />

{/* Left Light Ray */}
<div className="hero-light-ray hero-light-left" />

{/* Right Light Ray */}
<div className="hero-light-ray hero-light-right" />


      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-[#020617] to-transparent" />

    </div>
  );
}