"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  convertBaminiToUnicode,
  transliterateTanglishToTamil,
  countTamilCharacters,
  countTamilWordsSentences,
  normalizeTamilUnicode,
  cleanTamilText,
  inspectTamilCodePoints,
  formatTamilCaseTitles,
  TamilEngineResult,
} from "@/lib/engines/tamil-engine";
import { Copy, Check, Languages, Sparkles } from "lucide-react";

interface TamilWidgetProps {
  tool: ToolDefinition;
}

export function TamilWidget({ tool }: TamilWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;
  const [input, setInput] = useState(
    action.includes("bamini")
      ? "jkpo; nkhop cyfpd; kpfg; goikahd nkhop MFk;."
      : action.includes("tanglish")
      ? "vanakkam nanbargale! tamil mozhi migavum inimaiyadhana mozhi."
      : "தமிழ் மொழி உலகின் மிகத் தொன்மையான செம்மொழிகளில் ஒன்றாகும். திருக்குறள் மற்றும் சங்க இலக்கியங்கள் உலகப் புகழ்பெற்றவை."
  );
  const [copied, setCopied] = useState(false);

  let res: TamilEngineResult = { success: true, output: "" };

  if (action === "bamini-to-unicode" || action.includes("bamini")) {
    res = convertBaminiToUnicode(input);
  } else if (action === "tanglish-to-tamil" || action.includes("tanglish")) {
    res = transliterateTanglishToTamil(input);
  } else if (action.includes("character-counter")) {
    res = countTamilCharacters(input);
  } else if (action.includes("word-counter") || action.includes("sentence-counter")) {
    res = countTamilWordsSentences(input);
  } else if (action.includes("normalizer")) {
    res = normalizeTamilUnicode(input);
  } else if (action.includes("cleaner")) {
    res = cleanTamilText(input);
  } else if (action.includes("codepoint")) {
    res = inspectTamilCodePoints(input);
  } else if (action.includes("case") || action.includes("titles")) {
    res = formatTamilCaseTitles(input);
  }

  const handleCopy = async () => {
    if (!res.output) return;
    await navigator.clipboard.writeText(res.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Languages className="w-4 h-4" />
            <span>தமிழ் உள்ளீடு (Tamil Input)</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans leading-relaxed"
          />
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900/80 border border-purple-500/20 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>முடிவு (Processed Tamil Output)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-sm text-purple-100 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
              {res.output}
            </div>

            {res.breakdown && (
              <div className="space-y-1 border-t border-slate-800/80 pt-3">
                <dl className="space-y-1 text-xs">
                  {Object.entries(res.breakdown).map(([label, val]) => (
                    <div key={label} className="flex justify-between py-0.5 border-b border-slate-800/40">
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-purple-500/20"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>நகலெடு (Copy Result)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
