"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  calculateAudioBitrateSize,
  convertAudioDurationToSamples,
  calculateBpmDelayTimes,
  AudioEngineResult,
} from "@/lib/engines/audio-engine";
import { Music, Copy, Check, Sliders, Activity } from "lucide-react";

interface AudioWidgetProps {
  tool: ToolDefinition;
}

export function AudioWidget({ tool }: AudioWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  const [durationSec, setDurationSec] = useState(180); // 3 minutes
  const [sampleRate, setSampleRate] = useState(44100);
  const [bitDepth, setBitDepth] = useState(16);
  const [channels, setChannels] = useState(2);
  const [bpm, setBpm] = useState(128);
  const [copied, setCopied] = useState(false);

  let result: AudioEngineResult = { success: true, output: "" };

  if (action.includes("bitrate") || action.includes("size") || action.includes("metadata")) {
    result = calculateAudioBitrateSize(durationSec, sampleRate, bitDepth, channels);
  } else if (action.includes("sample")) {
    result = convertAudioDurationToSamples(durationSec);
  } else if (action.includes("bpm") || action.includes("tempo") || action.includes("delay")) {
    result = calculateBpmDelayTimes(bpm);
  }

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider flex items-center gap-2">
            {action.includes("bpm") ? <Activity className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            <span>Audio Parameters</span>
          </div>

          {action.includes("bpm") ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Tempo (Beats Per Minute)</span>
                  <span className="font-mono font-bold text-pink-400">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={240}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full accent-pink-400"
                />
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm mt-2"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Audio Track Duration (Seconds)</label>
                <input
                  type="number"
                  value={durationSec}
                  onChange={(e) => setDurationSec(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Sample Rate</label>
                  <select
                    value={sampleRate}
                    onChange={(e) => setSampleRate(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  >
                    <option value={44100}>44.1 kHz (CD Standard)</option>
                    <option value={48000}>48.0 kHz (Video / Broadcast)</option>
                    <option value={96000}>96.0 kHz (Hi-Res Studio)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Bit Depth</label>
                  <select
                    value={bitDepth}
                    onChange={(e) => setBitDepth(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  >
                    <option value={16}>16-bit (CD Quality)</option>
                    <option value={24}>24-bit (Studio Master)</option>
                    <option value={32}>32-bit Float</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Audio Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 2, label: "2 Channels (Stereo)" },
                    { id: 1, label: "1 Channel (Mono)" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannels(ch.id)}
                      className={`py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                        channels === ch.id ? "bg-pink-500 text-slate-950 font-bold" : "bg-slate-950 border border-slate-800 text-slate-300"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-950/30 to-slate-900/80 border border-pink-500/20 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Audio Calculation Result</span>
            </div>
            <div className="text-xl font-extrabold text-white">
              {result.output || "—"}
            </div>
          </div>

          {result.breakdown && (
            <div className="space-y-1 border-t border-slate-800 pt-3">
              <dl className="space-y-1 text-xs">
                {Object.entries(result.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-0.5 border-b border-slate-800/40">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-pink-500/20"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>Copy Audio Breakdown</span>
          </button>
        </div>
      </div>
    </div>
  );
}
