"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  removeDuplicateLines,
  sortLines,
  getWordFrequency,
  getCharacterFrequency,
  calculateReadingTime,
  reverseText,
  slugifyText,
  findAndReplace,
  removeEmptyLines,
  prefixSuffixLines,
  extractEmails,
  extractUrls,
  extractNumbers,
  convertToCamelCase,
  convertToSnakeCase,
  convertToKebabCase,
  convertToPascalCase,
  convertToTitleCase,
  convertToSentenceCase,
  convertToMorseCode,
  convertTextToBinary,
  convertBinaryToText,
  convertToNatoPhonetic,
  normalizeUnicode,
  generateMarkdownTable,
  TextEngineResult,
} from "@/lib/engines/text-engine";
import { Copy, Check, Type, Play, Sparkles } from "lucide-react";

interface TextWidgetProps {
  tool: ToolDefinition;
}

export function TextWidget({ tool }: TextWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<Record<string, string | number> | undefined>(undefined);

  // Extra inputs
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [addLineNumbers, setAddLineNumbers] = useState(false);

  const [unicodeForm, setUnicodeForm] = useState<"NFC" | "NFD" | "NFKC" | "NFKD">("NFC");

  const handleProcess = (modeOverride?: string) => {
    setError(null);
    let res: TextEngineResult = { success: true, output: "" };

    if (action === "remove-duplicate-lines") {
      res = removeDuplicateLines(input, matchCase);
    } else if (action === "sort-lines") {
      res = sortLines(input, modeOverride === "desc" ? "desc" : "asc", matchCase);
    } else if (action === "word-frequency") {
      res = getWordFrequency(input);
    } else if (action === "character-frequency") {
      res = getCharacterFrequency(input);
    } else if (action === "reading-time") {
      res = calculateReadingTime(input);
    } else if (action === "slug-generator") {
      res = slugifyText(input);
    } else if (action === "reverse-text") {
      res = reverseText(input, (modeOverride as "character" | "words" | "lines") || "character");
    } else if (action === "find-and-replace") {
      res = findAndReplace(input, findText, replaceText, isRegex, matchCase, wholeWord);
    } else if (action === "remove-empty-lines") {
      res = removeEmptyLines(input);
    } else if (action === "prefix-suffix") {
      res = prefixSuffixLines(input, prefix, suffix, addLineNumbers);
    } else if (action === "extract-emails") {
      res = extractEmails(input);
    } else if (action === "extract-urls") {
      res = extractUrls(input);
    } else if (action === "extract-numbers") {
      res = extractNumbers(input);
    } else if (action === "camelcase-converter") {
      res = convertToCamelCase(input);
    } else if (action === "snake-case-converter") {
      res = convertToSnakeCase(input);
    } else if (action === "kebab-case-converter") {
      res = convertToKebabCase(input);
    } else if (action === "pascalcase-converter") {
      res = convertToPascalCase(input);
    } else if (action === "title-case-converter") {
      res = convertToTitleCase(input);
    } else if (action === "sentence-case-converter") {
      res = convertToSentenceCase(input);
    } else if (action === "text-to-morse-code") {
      res = convertToMorseCode(input, "encode");
    } else if (action === "morse-code-to-text") {
      res = convertToMorseCode(input, "decode");
    } else if (action === "text-to-binary") {
      res = convertTextToBinary(input);
    } else if (action === "binary-to-text") {
      res = convertBinaryToText(input);
    } else if (action === "nato-phonetic") {
      res = convertToNatoPhonetic(input);
    } else if (action === "normalize-unicode") {
      res = normalizeUnicode(input, unicodeForm);
    } else if (action === "markdown-table" || action.includes("markdown-table")) {
      res = generateMarkdownTable(4, 3);
    }

    if (!res.success) {
      setError(res.error || "Operation failed");
    } else {
      setOutput(res.output);
      setBreakdown(res.breakdown);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Dedicated Controls Bar for specific tools */}
      {action === "find-and-replace" && (
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Find Text</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="String or regex pattern..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Replace With</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replacement text..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Match Case</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Whole Word Only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isRegex}
                onChange={(e) => setIsRegex(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Regular Expression</span>
            </label>
          </div>
        </div>
      )}

      {action === "prefix-suffix" && (
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Line Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder='e.g. "- " or "> "'
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Line Suffix</label>
              <input
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder='e.g. "," or ";" '
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={addLineNumbers}
              onChange={(e) => setAddLineNumbers(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>Add Line Numbers (1., 2., 3...)</span>
          </label>
        </div>
      )}

      {action === "normalize-unicode" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="text-xs font-semibold uppercase text-slate-400">Unicode Form:</label>
          {(["NFC", "NFD", "NFKC", "NFKD"] as const).map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => setUnicodeForm(form)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                unicodeForm === form ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      )}

      {/* Input Textarea */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            <span>Text Input Payload</span>
          </div>
          {input && (
            <button
              type="button"
              onClick={() => { setInput(""); setOutput(""); setBreakdown(undefined); setError(null); }}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter or paste text for ${tool.name}...`}
          rows={6}
          className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-emerald-500 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600 font-mono resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {action === "sort-lines" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleProcess("asc")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Sort A → Z
            </button>
            <button
              type="button"
              onClick={() => handleProcess("desc")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm cursor-pointer hover:bg-slate-700"
            >
              Sort Z → A
            </button>
          </div>
        ) : action === "reverse-text" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleProcess("character")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Reverse Characters
            </button>
            <button
              type="button"
              onClick={() => handleProcess("words")}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-700"
            >
              Reverse Words
            </button>
            <button
              type="button"
              onClick={() => handleProcess("lines")}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-700"
            >
              Reverse Lines
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleProcess()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Process {tool.name}</span>
          </button>
        )}

        {output && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Result"}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Output Display */}
      {output && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Output Result</span>
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {/* Breakdown Details */}
      {breakdown && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Analysis Breakdown
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(breakdown).map(([label, val]) => (
              <div key={label} className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <dt className="text-slate-400">{label}:</dt>
                <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
