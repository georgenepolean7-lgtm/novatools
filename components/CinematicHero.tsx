export default function CinematicHero() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dynamic Moving Aura Gradients */}
      <div className="hero-aura-blue absolute left-[8%] top-[12%] h-[600px] w-[600px] rounded-full opacity-60" />
      <div className="hero-aura-purple absolute right-[8%] bottom-[8%] h-[600px] w-[600px] rounded-full opacity-60" />

      {/* Aurora Layer */}
      <div className="hero-aurora" />

      {/* Light Rays */}
      <div className="hero-light-ray hero-light-left" />
      <div className="hero-light-ray hero-light-right" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-[#020617] to-transparent" />
    </div>
  );
}