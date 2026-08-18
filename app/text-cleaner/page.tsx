"use client";

import { useMemo, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type CleaningOptions = {
  removeExtraSpaces: boolean;
  trimLines: boolean;
  removeEmptyLines: boolean;
  removeDuplicateBlankLines: boolean;
  removeDuplicateLines: boolean;
  normalizeLineBreaks: boolean;
  convertTabsToSpaces: boolean;
  removePunctuation: boolean;
  removeNumbers: boolean;
};

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function TextCleanerPage() {
  const [inputText, setInputText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");

  const [options, setOptions] = useState<CleaningOptions>({
    removeExtraSpaces: true,
    trimLines: true,
    removeEmptyLines: false,
    removeDuplicateBlankLines: true,
    removeDuplicateLines: false,
    normalizeLineBreaks: true,
    convertTabsToSpaces: true,
    removePunctuation: false,
    removeNumbers: false,
  });

  const cleanedText = useMemo(() => {
    if (!inputText) return "";

    let result = inputText;

    // 1. Normalize line breaks
    if (options.normalizeLineBreaks) {
      result = result.replace(/\r\n|\r/g, "\n");
    }

    // 2. Convert tabs to spaces
    if (options.convertTabsToSpaces) {
      result = result.replace(/\t/g, "  ");
    }

    // Split lines for line-based rules
    let lines = result.split("\n");

    // 3. Trim lines
    if (options.trimLines) {
      lines = lines.map((l) => l.trim());
    }

    // 4. Remove empty lines
    if (options.removeEmptyLines) {
      lines = lines.filter((l) => l.length > 0);
    } else if (options.removeDuplicateBlankLines) {
      // 5. Collapse multiple blank lines to a single blank line
      const collapsed: string[] = [];
      let lastWasEmpty = false;
      for (const line of lines) {
        if (line.trim().length === 0) {
          if (!lastWasEmpty) {
            collapsed.push("");
            lastWasEmpty = true;
          }
        } else {
          collapsed.push(line);
          lastWasEmpty = false;
        }
      }
      lines = collapsed;
    }

    // 6. Remove duplicate lines
    if (options.removeDuplicateLines) {
      const seen = new Set<string>();
      lines = lines.filter((line) => {
        if (line.length === 0) return true; // keep blank lines
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      });
    }

    result = lines.join("\n");

    // 7. Remove extra intra-line spaces (multiple spaces collapsed to 1)
    if (options.removeExtraSpaces) {
      result = result.replace(/[^\S\r\n]+/g, " ");
    }

    // 8. Optional: remove punctuation
    if (options.removePunctuation) {
      result = result.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’“”«»[\]<>@|\\+]/g, "");
    }

    // 9. Optional: remove numbers
    if (options.removeNumbers) {
      result = result.replace(/\d+/g, "");
    }

    return result;
  }, [inputText, options]);

  function toggleOption(key: keyof CleaningOptions) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function copyCleaned() {
    if (!cleanedText) return;
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setRobotState("success");
      setTimeout(() => {
        setCopied(false);
        setRobotState("idle");
      }, 2000);
    } catch {
      // Fallback
    }
  }

  function downloadTxt() {
    if (!cleanedText) return;
    const blob = new Blob([cleanedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "novatools-cleaned-text.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function resetAll() {
    setInputText("");
    setCopied(false);
    setRobotState("idle");
  }

  // Before & After Stats
  const origChars = Array.from(inputText).length;
  const cleanChars = Array.from(cleanedText).length;
  const origLines = inputText ? inputText.split(/\r\n|\r|\n/).length : 0;
  const cleanLines = cleanedText ? cleanedText.split("\n").length : 0;
  const charsSaved = Math.max(0, origChars - cleanChars);

  return (
    <>
      <ToolSEO
        name="Text Cleaner"
        path="/text-cleaner"
        description="Clean and sanitize messy text online. Remove duplicate spaces, empty lines, duplicate lines, and format whitespace with 100% in-browser privacy."
        faqs={[
          {
            question: "How does Text Cleaner sanitize content?",
            answer:
              "Text Cleaner applies customizable rules to normalize line breaks, strip accidental repeated spaces, collapse excessive blank lines, and remove unwanted duplicates.",
          },
          {
            question: "Can I safely clean Tamil or non-English text?",
            answer:
              "Yes! All whitespace and formatting operations are Unicode-safe and preserve non-Latin alphabets like Tamil, Hindi, and Arabic without breaking word ligatures.",
          },
          {
            question: "Is my text data private?",
            answer:
              "Yes. Text cleaning runs 100% inside your browser using standard JavaScript string methods. No text is ever uploaded.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE TEXT TOOL"
          title="Text Cleaner &amp; Formatter"
          description="Remove duplicate spaces, strip empty lines, trim edges, and sanitize messy text."
        >
          {/* Comparison Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Original Chars</p>
              <p className="mt-1 text-xl font-bold text-slate-300">{origChars.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cleaned Chars</p>
              <p className="mt-1 text-xl font-bold text-cyan-400">{cleanChars.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lines</p>
              <p className="mt-1 text-xl font-bold text-white">
                {origLines} → {cleanLines}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Characters Saved</p>
              <p className="mt-1 text-xl font-bold text-emerald-400">-{charsSaved.toLocaleString()}</p>
            </div>
          </div>

          {/* Cleaning Options Selector */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Active Cleaning Rules
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "removeExtraSpaces", label: "Remove Extra Spaces", desc: "Collapse multiple spaces into one" },
                { key: "trimLines", label: "Trim Lines", desc: "Strip leading & trailing whitespace" },
                { key: "removeDuplicateBlankLines", label: "Remove Duplicate Blank Lines", desc: "Keep max 1 empty line" },
                { key: "removeEmptyLines", label: "Remove All Empty Lines", desc: "Strip 100% of blank lines" },
                { key: "removeDuplicateLines", label: "Remove Duplicate Lines", desc: "Keep only unique lines" },
                { key: "convertTabsToSpaces", label: "Convert Tabs to Spaces", desc: "Replace tab characters with spaces" },
                { key: "normalizeLineBreaks", label: "Normalize Line Breaks", desc: "Standardize CRLF to LF" },
                { key: "removePunctuation", label: "Remove Punctuation", desc: "Strip special punctuation marks" },
                { key: "removeNumbers", label: "Remove Numbers", desc: "Strip numeric digits (0-9)" },
              ].map((item) => {
                const isChecked = options[item.key as keyof CleaningOptions];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleOption(item.key as keyof CleaningOptions)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                      isChecked
                        ? "border-cyan-400 bg-cyan-500/10 text-white"
                        : "border-white/5 bg-black/20 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                      isChecked ? "border-cyan-400 bg-cyan-400 text-black font-bold" : "border-slate-500"
                    }`}>
                      {isChecked ? "✓" : ""}
                    </span>
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Card */}
            <UploadCard
              title="Original Input"
              description="Type or paste text to clean."
            >
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Input text</span>
                  {inputText && (
                    <button
                      type="button"
                      onClick={resetAll}
                      className="text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  aria-label="Raw text input to clean"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste messy text with extra spaces, tabs, or empty lines..."
                  rows={12}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-sans text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </UploadCard>

            {/* Cleaned Result Card */}
            <UploadCard
              title="Cleaned Output"
              description="Real-time cleaned & formatted text."
            >
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Sanitized result</span>
                  {cleanedText && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyCleaned}
                        className="text-cyan-400 hover:underline"
                      >
                        {copied ? "Copied! ✓" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={downloadTxt}
                        className="text-slate-300 hover:underline"
                      >
                        Download .TXT
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  aria-label="Cleaned text output"
                  readOnly
                  value={cleanedText}
                  placeholder="Cleaned output will appear here in real-time..."
                  rows={12}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-sans text-xs text-cyan-200 placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </UploadCard>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Clean Text Online</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Paste your raw text into the Original Input box.</li>
              <li>Toggle your desired cleaning rules (e.g. Remove Extra Spaces, Trim Lines, Remove Duplicate Blank Lines).</li>
              <li>Instantly review before/after character metrics and copy or download your sanitized text.</li>
            </ol>
          </div>

          <RelatedTools current="/text-cleaner" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
