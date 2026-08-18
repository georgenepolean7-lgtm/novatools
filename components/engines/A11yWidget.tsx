"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  checkColorContrast,
  checkImageAltAttributes,
  validateAriaAttributes,
  checkTouchTargetSize,
  checkFormLabels,
  A11yEngineResult,
} from "@/lib/engines/a11y-engine";
import { analyzeHeadingStructure } from "@/lib/engines/seo-engine";
import { Eye, ShieldCheck, Check, Copy } from "lucide-react";

interface A11yWidgetProps {
  tool?: ToolDefinition;
}

export function A11yWidget({ tool }: A11yWidgetProps) {
  const action = (tool?.customParams?.action as string) || tool?.slug || "check-contrast";

  // Contrast state
  const [fg, setFg] = useState("#FFFFFF");
  const [bg, setBg] = useState("#0F172A");

  // HTML scanner state
  const [htmlInput, setHtmlInput] = useState(
    `<main>\n  <h1>Main Page Title</h1>\n  <img src="/hero.jpg" alt="Platform Overview" />\n  <img src="/decorative-icon.svg" alt="" />\n  <img src="/unlabeled-badge.png" />\n  <form>\n    <label for="email">Email Address</label>\n    <input type="email" id="email" />\n    <input type="password" placeholder="Password" />\n  </form>\n  <button role="button" aria-expanded="false" aria-label="Toggle navigation menu">Menu</button>\n</main>`
  );

  // Touch target state
  const [targetWidth, setTargetWidth] = useState(48);
  const [targetHeight, setTargetHeight] = useState(48);

  const [copied, setCopied] = useState(false);

  let result: A11yEngineResult = { success: true, formatted: "" };

  if (action === "check-contrast" || action.includes("contrast")) {
    result = checkColorContrast(fg, bg);
  } else if (action.includes("alt-text")) {
    result = checkImageAltAttributes(htmlInput);
  } else if (action.includes("aria")) {
    result = validateAriaAttributes(htmlInput);
  } else if (action.includes("touch-target")) {
    result = checkTouchTargetSize(targetWidth, targetHeight);
  } else if (action.includes("form-label")) {
    result = checkFormLabels(htmlInput);
  } else if (action.includes("heading")) {
    const headingRes = analyzeHeadingStructure(htmlInput);
    result = {
      success: headingRes.success,
      formatted: headingRes.output || "Heading outline generated",
      breakdown: headingRes.breakdown,
    };
  }

  const handleCopy = async () => {
    if (!result.formatted) return;
    await navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-lime-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Accessibility Audit Inputs</span>
          </div>

          {(action === "check-contrast" || action.includes("contrast")) && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Foreground / Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="w-12 h-10 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm uppercase"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="w-12 h-10 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {action.includes("touch-target") && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Target Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Target Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {!action.includes("contrast") && !action.includes("touch-target") && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">HTML Code Snippet</label>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-lime-950/30 to-slate-900/80 border border-lime-500/20 flex flex-col justify-between space-y-6">
          {(action === "check-contrast" || action.includes("contrast")) && (
            <div
              style={{ backgroundColor: bg, color: fg }}
              className="p-5 rounded-xl border border-slate-700/40 shadow-inner flex flex-col justify-center items-center text-center space-y-1 transition-colors"
            >
              <span className="text-base font-bold">Sample Text Heading</span>
              <span className="text-xs opacity-90">Preview text legibility on chosen background.</span>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>WCAG 2.1 Audit Summary</span>
            </div>
            <div className="text-xl font-extrabold text-white">
              {result.formatted}
            </div>
          </div>

          {result.breakdown && (
            <div className="space-y-1 border-t border-slate-800 pt-3">
              <dl className="space-y-1 text-xs">
                {Object.entries(result.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-0.5 border-b border-slate-800/40">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd
                      className={`font-semibold ${
                        String(val).includes("PASS") || String(val).includes("✓")
                          ? "text-lime-400"
                          : String(val).includes("FAIL") || String(val).includes("✗")
                          ? "text-rose-400"
                          : "text-slate-200"
                      }`}
                    >
                      {String(val)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-lime-500/20"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>Copy Audit Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
