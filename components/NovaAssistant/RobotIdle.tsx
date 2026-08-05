"use client";

export default function RobotIdle() {
  return (
    <div className="animate-float fixed bottom-6 right-6 z-50">
      <div className="relative h-56 w-44">

        {/* Head */}
        <div className="absolute left-4 top-0 h-20 w-24 rounded-[28px] border-4 border-cyan-400 bg-white shadow-[0_0_30px_rgba(34,211,238,0.5)]">

          {/* Face */}
          <div className="absolute left-2 top-2 h-14 w-20 rounded-2xl bg-slate-900">

            {/* Eyes */}
            <div className="absolute left-4 top-5 h-3 w-3 animate-pulse rounded-full bg-cyan-400"></div>
            <div className="absolute right-4 top-5 h-3 w-3 animate-pulse rounded-full bg-cyan-400"></div>

            {/* Smile */}
            <div className="absolute bottom-3 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full border-b-2 border-cyan-400"></div>

          </div>
        </div>

        {/* Body */}
        <div className="absolute left-8 top-20 h-16 w-16 rounded-2xl bg-white border-4 border-cyan-400 shadow-lg"></div>

        {/* Cape */}
        <div className="absolute left-16 top-20 h-20 w-12 rounded-b-full bg-cyan-500/30 blur-sm animate-pulse"></div>

      </div>
    </div>
  );
}