"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  convertWorldTimezones,
  calculateBusinessHoursOverlap,
  calculateWorkingBusinessDays,
  calculateIsoWeekNumber,
  TimeEngineResult,
} from "@/lib/engines/time-engine";
import { Clock, Copy, Check, Globe, Calendar } from "lucide-react";

interface TimeWidgetProps {
  tool: ToolDefinition;
}

export function TimeWidget({ tool }: TimeWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  const [timeInput, setTimeInput] = useState("14:30");
  const [fromTz, setFromTz] = useState("Asia/Kolkata");
  const [toTz, setToTz] = useState("America/New_York");
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-09-30");
  const [isoDate, setIsoDate] = useState("2024-08-15");
  const [copied, setCopied] = useState(false);

  let result: TimeEngineResult = { success: true, output: "" };

  if (action.includes("world-clock") || action.includes("timezone")) {
    result = convertWorldTimezones(timeInput, fromTz, toTz);
  } else if (action.includes("overlap") || action.includes("business-hours")) {
    result = calculateBusinessHoursOverlap(fromTz, toTz);
  } else if (action.includes("working-days") || action.includes("business-days")) {
    result = calculateWorkingBusinessDays(startDate, endDate);
  } else if (action.includes("week-number") || action.includes("iso-week")) {
    result = calculateIsoWeekNumber(isoDate);
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
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            {action.includes("working-days") || action.includes("week") ? (
              <Calendar className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            <span>Timezone & Schedule Settings</span>
          </div>

          {(action.includes("world-clock") || action.includes("timezone") || action.includes("overlap")) && (
            <div className="space-y-3">
              {action.includes("world-clock") && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Local Time (24h format)</label>
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Source Timezone</label>
                <select
                  value={fromTz}
                  onChange={(e) => setFromTz(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="UTC">UTC / GMT (+0:00)</option>
                  <option value="America/New_York">America/New_York (EST/EDT -5:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT -8:00)</option>
                  <option value="Europe/London">Europe/London (GMT/BST +1:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST +9:00)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST +10:00)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Target Timezone</label>
                <select
                  value={toTz}
                  onChange={(e) => setToTz(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="America/New_York">America/New_York (EST/EDT -5:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT -8:00)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="UTC">UTC / GMT (+0:00)</option>
                  <option value="Europe/London">Europe/London (GMT/BST +1:00)</option>
                  <option value="Europe/Berlin">Europe/Berlin (CET +1:00)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST +9:00)</option>
                </select>
              </div>
            </div>
          )}

          {action.includes("working-days") && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                />
              </div>
            </div>
          )}

          {action.includes("week") && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Target Date</label>
                <input
                  type="date"
                  value={isoDate}
                  onChange={(e) => setIsoDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-950/30 to-slate-900/80 border border-sky-500/20 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Conversion & Calculation Result</span>
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
            className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-sky-500/20"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>Copy Calculation Result</span>
          </button>
        </div>
      </div>
    </div>
  );
}
