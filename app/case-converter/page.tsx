"use client";

import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "capitalized"
  | "alternating"
  | "inverse";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);

  function applyCase(type: CaseType) {
    if (!inputText) return;
    setActiveCase(type);
    let converted = "";

    switch (type) {
      case "upper":
        converted = inputText.toUpperCase();
        break;

      case "lower":
        converted = inputText.toLowerCase();
        break;

      case "sentence":
        converted = toSentenceCase(inputText);
        break;

      case "title":
        converted = toTitleCase(inputText);
        break;

      case "capitalized":
        converted = toCapitalizedCase(inputText);
        break;

      case "alternating":
        converted = toAlternatingCase(inputText);
        break;

      case "inverse":
        converted = toInverseCase(inputText);
        break;

      default:
        converted = inputText;
    }

    setInputText(converted);
    setRobotState("success");
    setTimeout(() => setRobotState("idle"), 1500);
  }

  function toSentenceCase(str: string): string {
    const lower = str.toLowerCase();
    return lower.replace(/(^\s*|[.!?\n]\s+)(\p{L})/gu, (match, prefix, char) => {
      return prefix + char.toUpperCase();
    });
  }

  function toTitleCase(str: string): string {
    const minorWords = new Set([
      "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet",
      "at", "by", "in", "of", "on", "to", "up", "with", "as",
    ]);

    const words = str.toLowerCase().split(/(\s+)/);
    let isFirstWord = true;

    return words
      .map((w) => {
        if (/^\s+$/.test(w)) return w;
        const cleanWord = w.replace(/[^\p{L}\p{N}]/gu, "");
        if (!isFirstWord && minorWords.has(cleanWord)) {
          return w;
        }
        isFirstWord = false;
        return w.replace(/\p{L}/u, (c) => c.toUpperCase());
      })
      .join("");
  }

  function toCapitalizedCase(str: string): string {
    return str.replace(/\b(\p{L})/gu, (c) => c.toUpperCase());
  }

  function toAlternatingCase(str: string): string {
    let upper = true;
    return Array.from(str)
      .map((char) => {
        if (/\p{L}/u.test(char)) {
          const res = upper ? char.toUpperCase() : char.toLowerCase();
          upper = !upper;
          return res;
        }
        return char;
      })
      .join("");
  }

  function toInverseCase(str: string): string {
    return Array.from(str)
      .map((char) => {
        if (char === char.toUpperCase() && char !== char.toLowerCase()) {
          return char.toLowerCase();
        } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
          return char.toUpperCase();
        }
        return char;
      })
      .join("");
  }

  async function copyText() {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
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
    if (!inputText) return;
    const blob = new Blob([inputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "novatools-converted-case.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function clearText() {
    setInputText("");
    setActiveCase(null);
    setCopied(false);
    setRobotState("idle");
  }

  const charCount = Array.from(inputText).length;
  const wordCount = (inputText.trim().match(/\S+/gu) || []).length;

  return (
    <>
      <ToolSEO
        name="Case Converter"
        path="/case-converter"
        description="Convert text into UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Words, and Alternating Case instantly. 100% private in-browser text tool."
        faqs={[
          {
            question: "What does Title Case do?",
            answer:
              "Title Case capitalizes the first letter of each major word while keeping short articles, conjunctions, and prepositions (like 'and', 'in', 'of', 'the') in lowercase.",
          },
          {
            question: "Does Case Converter support non-English languages?",
            answer:
              "Yes! It converts accented European characters (like French, German, Spanish) and preserves non-cased scripts such as Tamil, Hindi, and Arabic without breaking text.",
          },
          {
            question: "Is my text data stored or sent anywhere?",
            answer:
              "No. All transformations occur exclusively inside your web browser. No text is sent across any network.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE TEXT TOOL"
          title="Case Converter"
          description="Transform text between UPPERCASE, lowercase, Title Case, Sentence case, and more."
        >
          <UploadCard
            title="Convert Text Case"
            description="Type or paste your text below and choose a case conversion format."
          >
            <div className="space-y-4">
              {/* Quick Actions Header */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {wordCount.toLocaleString()} Words • {charCount.toLocaleString()} Characters
                </span>
                {inputText && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyText}
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                    >
                      {copied ? "Copied! ✓" : "Copy Result"}
                    </button>
                    <button
                      type="button"
                      onClick={downloadTxt}
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/20"
                    >
                      Download .TXT
                    </button>
                    <button
                      type="button"
                      onClick={clearText}
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-rose-300 hover:bg-rose-500/20"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Text Area */}
              <textarea
                aria-label="Text input for case conversion"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste text to convert case..."
                rows={10}
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-sans text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />

              {/* Case Conversion Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {[
                  { id: "sentence", label: "Sentence case" },
                  { id: "lower", label: "lower case" },
                  { id: "upper", label: "UPPER CASE" },
                  { id: "title", label: "Title Case" },
                  { id: "capitalized", label: "Capitalized Words" },
                  { id: "alternating", label: "aLtErNaTiNg" },
                  { id: "inverse", label: "iNVERSE cASE" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!inputText}
                    onClick={() => applyCase(item.id as CaseType)}
                    className={`rounded-xl border py-2.5 px-2 text-xs font-semibold transition disabled:opacity-40 ${
                      activeCase === item.id
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </UploadCard>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Convert Text Case</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Enter or paste your text in the text area above.</li>
              <li>Click any transformation button (e.g. UPPERCASE, lowercase, Title Case, Sentence case).</li>
              <li>Instantly view the transformed text, copy it to your clipboard, or download it as a .txt file.</li>
            </ol>
          </div>

          <RelatedTools current="/case-converter" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
