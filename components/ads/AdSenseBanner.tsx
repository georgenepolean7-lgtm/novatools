"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthContext";

interface AdSenseBannerProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle";
  responsive?: boolean;
  className?: string;
}

export default function AdSenseBanner({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseBannerProps) {
  const { profile } = useAuth();
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  const isPremiumUser = profile?.isPremium === true;

  useEffect(() => {
    if (isPremiumUser) return;
    // Only attempt push once per mount and when window is available
    if (typeof window !== "undefined" && !isLoaded.current) {
      try {
        // @ts-expect-error - adsbygoogle is dynamically provided by Google AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch {
        // Suppress AdSense push errors if script is still loading or ad blocked
      }
    }
  }, [isPremiumUser]);

  // Premium users enjoy 100% ad-free experience
  if (isPremiumUser) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 my-6 ${className}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30 p-2 sm:p-3 text-center transition-all">
        {/* Subtle, standard label conforming to Google AdSense policies */}
        <div className="mb-1.5 flex items-center justify-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Advertisement
          </span>
        </div>

        {/* Ad container with reserved min-height to prevent Cumulative Layout Shift (CLS) */}
        <div className="min-h-[90px] sm:min-h-[100px] md:min-h-[120px] w-full flex items-center justify-center overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: "block", minWidth: "250px" }}
            data-ad-client="ca-pub-7888119602395886"
            data-ad-slot={slotId || "1234567890"}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
          />
        </div>
      </div>
    </aside>
  );
}
