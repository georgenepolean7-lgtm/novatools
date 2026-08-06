const particles = Array.from({ length: 24 });

export default function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, index) => {
        const size = 2 + (index % 4);
        const left = (index * 4.1) % 100;
        const delay = `${index * 0.4}s`;
        const duration = `${10 + (index % 6)}s`;

        return (
          <span
            key={index}
            className="absolute rounded-full bg-cyan-400/40 animate-[particleFloat_linear_infinite]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-20px",
              opacity: 0.15,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        );
      })}
    </div>
  );
}