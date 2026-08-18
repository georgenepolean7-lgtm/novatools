"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  generateSecurePassword,
  checkPasswordStrength,
  PrivacyEngineResult,
} from "@/lib/engines/privacy-engine";
import { ShieldCheck, Copy, Check, RefreshCw } from "lucide-react";

interface PrivacyWidgetProps {
  tool: ToolDefinition;
}

export function PrivacyWidget({ tool }: PrivacyWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [passwordInput, setPasswordInput] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const res = generateSecurePassword({ length, uppercase, lowercase, numbers, symbols });
    setGeneratedPassword(res.output);
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthResult: PrivacyEngineResult = checkPasswordStrength(passwordInput);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {action === "generate-password" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-300 font-semibold uppercase">Password Length: {length} Characters</label>
              <span className="text-xs text-cyan-400 font-mono font-bold">{length * 6} bits approx</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded border-slate-700 text-cyan-500" />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="rounded border-slate-700 text-cyan-500" />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="rounded border-slate-700 text-cyan-500" />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="rounded border-slate-700 text-cyan-500" />
                Symbols (!@#$)
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Password</span>
            </button>

            {generatedPassword && (
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>Copy Password</span>
              </button>
            )}
          </div>

          {generatedPassword && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono text-lg tracking-wider break-all">
              {generatedPassword}
            </div>
          )}
        </div>
      )}

      {action === "check-password-strength" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <label className="text-xs text-slate-300 font-semibold uppercase">Enter Password to Test Entropy</label>
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Type or paste password..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base"
            />
          </div>

          {passwordInput && strengthResult.breakdown && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Strength Assessment</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {strengthResult.output}
              </div>
              <dl className="space-y-1.5 text-xs border-t border-slate-800 pt-4">
                {Object.entries(strengthResult.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-slate-800/60">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd className="font-semibold text-slate-200">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
