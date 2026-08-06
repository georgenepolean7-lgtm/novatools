export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[140px] animate-[pulse_12s_ease-in-out_infinite]" />
      <div className="absolute right-[-10%] bottom-[-15%] h-[550px] w-[550px] rounded-full bg-blue-500/10 blur-[160px] animate-[pulse_14s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
    </div>
  );
}