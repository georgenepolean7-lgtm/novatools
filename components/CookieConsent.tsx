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
    <div className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-bold text-white">
        Cookie Notice
      </h2>

      <p className="mt-3 text-slate-300 text-sm leading-relaxed">
        Nova Tools uses cookies and similar technologies to improve your
        experience, analyze website traffic, and enhance our services.
        By continuing to use this website, you agree to our use of cookies.
      </p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={accept}
          className="rounded-2xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-400 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          Accept
        </button>
      </div>
    </div>
  );
}