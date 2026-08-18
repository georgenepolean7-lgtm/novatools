"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Layers } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error in client console
    console.error("Application error boundary triggered:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20 relative overflow-hidden">
        <div className="max-w-lg w-full text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/10">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              An unexpected error occurred while processing your request. All your browser data and tools remain safe.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs transition-all"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/#tools"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold text-xs transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Tools Directory</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
