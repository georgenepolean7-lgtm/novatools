"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("cookie-consent");
      if (!accepted) {
        // Delay popup to keep initial render completely unblocked
        const timer = setTimeout(() => setShow(true), 2500);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is disabled or restricted
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem("cookie-consent", "accepted");
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-md z-50 rounded-2xl border border-white/10 bg-slate-900/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-xs sm:text-sm font-bold text-white">Cookie Notice</h2>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
            Nova Tools uses cookies to improve your experience and analyze traffic. By using this site, you agree to cookie usage.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-cyan-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-400 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}