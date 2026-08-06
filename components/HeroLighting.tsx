export default function HeroLighting() {
  return (
    <>
      <div className="hero-nebula-blue absolute -left-72 top-[-120px] h-[900px] w-[900px] rounded-full" />

      <div className="hero-nebula-purple absolute -right-72 top-[-80px] h-[900px] w-[900px] rounded-full" />

      <div className="hero-center-light absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="hero-bottom-aurora absolute bottom-[-220px] left-1/2 h-[500px] w-[1400px] -translate-x-1/2 rounded-full" />
    </>
  );
}