"use client";

import { useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type GenMode = "paragraphs" | "sentences" | "words";
type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur",
  "pretium", "tincidunt", "lacus", "nulla", "gravida", "orci", "a", "odio",
  "nullam", "varius", "turpis", "et", "commodo", "pharetra", "est", "eros",
  "bibendum", "elit", "nec", "luctus", "magna", "felis", "sollicitudin", "mauris",
  "integer", "urna", "interdum", "posuere", "leo", "sed", "pulvinar", "pellentesque",
];

const STANDARD_OPENING =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default function LoremIpsumGeneratorPage() {
  const [mode, setMode] = useState<GenMode>("paragraphs");
  const [amount, setAmount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");

  useEffect(() => {
    generateLorem();
  }, [mode, amount, startWithLorem]);

  function getRandomWord(): string {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  }

  function generateSentence(minWords = 6, maxWords = 14): string {
    const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(getRandomWord());
    }
    // Capitalize first word and add period
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return `${words.join(" ")}.`;
  }

  function generateParagraph(minSentences = 4, maxSentences = 7): string {
    const len = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences: string[] = [];
    for (let i = 0; i < len; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  }

  function generateLorem() {
    let result = "";

    if (mode === "words") {
      const count = Math.max(1, Math.min(2000, amount));
      const words: string[] = [];
      if (startWithLorem && count >= 5) {
        words.push("Lorem", "ipsum", "dolor", "sit", "amet");
        for (let i = 5; i < count; i++) {
          words.push(getRandomWord());
        }
      } else {
        for (let i = 0; i < count; i++) {
          words.push(getRandomWord());
        }
        if (words.length > 0) {
          words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        }
      }
      result = words.join(" ");
    } else if (mode === "sentences") {
      const count = Math.max(1, Math.min(100, amount));
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push(STANDARD_OPENING);
        } else {
          sentences.push(generateSentence());
        }
      }
      result = sentences.join(" ");
    } else {
      // Paragraphs
      const count = Math.max(1, Math.min(50, amount));
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          paras.push(`${STANDARD_OPENING} ${generateParagraph(3, 5)}`);
        } else {
          paras.push(generateParagraph(4, 7));
        }
      }
      result = paras.join("\n\n");
    }

    setGeneratedText(result);
    setCopied(false);
  }

  async function copyText() {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
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
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "novatools-lorem-ipsum.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const wordCount = (generatedText.trim().match(/\S+/gu) || []).length;
  const charCount = Array.from(generatedText).length;

  return (
    <>
      <ToolSEO
        name="Lorem Ipsum Generator"
        path="/lorem-ipsum-generator"
        description="Generate standard classical Latin placeholder dummy text by words, sentences, or paragraphs. Free and private in-browser generator."
        faqs={[
          {
            question: "What is Lorem Ipsum placeholder text?",
            answer:
              "Lorem Ipsum is the industry standard dummy text used by designers, web developers, and typographers to demonstrate visual formatting without meaningful distractions.",
          },
          {
            question: "Where does the Latin text come from?",
            answer:
              "The text is derived from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) written by Cicero in 45 BC.",
          },
          {
            question: "Are external APIs used?",
            answer:
              "No! The dummy text is generated 100% locally in your web browser with zero API latency or tracking.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE DEVELOPER TOOL"
          title="Lorem Ipsum Generator"
          description="Create custom placeholder dummy text for mockups, web templates, and graphic design."
        >
          {/* Controls Card */}
          <UploadCard
            title="Generation Settings"
            description="Customize output length, format type, and options."
          >
            <div className="space-y-6">
              {/* Generation Mode Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Generation Unit
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "paragraphs", label: "Paragraphs", defaultAmt: 3, max: 20 },
                    { id: "sentences", label: "Sentences", defaultAmt: 5, max: 50 },
                    { id: "words", label: "Words", defaultAmt: 50, max: 500 },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMode(m.id as GenMode);
                        setAmount(m.defaultAmt);
                      }}
                      className={`rounded-2xl border py-3 text-xs font-semibold transition ${
                        mode === m.id
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:bg-white/10"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Number of {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </span>
                  <span className="font-bold text-cyan-400">{amount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={mode === "paragraphs" ? 20 : mode === "sentences" ? 50 : 500}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                  className="mt-2 w-full accent-cyan-400"
                />
              </div>

              {/* Checkbox Options & Regenerate Button */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={startWithLorem}
                    onChange={(e) => setStartWithLorem(e.target.checked)}
                    className="h-4 w-4 rounded accent-cyan-400"
                  />
                  <span>Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
                </label>

                <button
                  type="button"
                  onClick={generateLorem}
                  className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500/20 hover:text-cyan-300"
                >
                  🔄 Regenerate
                </button>
              </div>

              {/* Output Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {wordCount.toLocaleString()} Words • {charCount.toLocaleString()} Characters
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyText}
                      className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5 font-bold text-white shadow transition hover:scale-105"
                    >
                      {copied ? "Copied! ✓" : "Copy to Clipboard"}
                    </button>
                    <button
                      type="button"
                      onClick={downloadTxt}
                      className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-slate-300 hover:bg-white/20"
                    >
                      Download .TXT
                    </button>
                  </div>
                </div>

                <textarea
                  aria-label="Generated Lorem Ipsum placeholder text"
                  readOnly
                  value={generatedText}
                  rows={10}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-sans text-xs leading-relaxed text-slate-200 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </UploadCard>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Generate Lorem Ipsum Dummy Text</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Select your preferred generation unit: Paragraphs, Sentences, or Words.</li>
              <li>Adjust the quantity slider to generate the exact amount of filler text needed.</li>
              <li>Click &quot;Copy to Clipboard&quot; to paste into your UI design, code mockup, or layout document.</li>
            </ol>
          </div>

          <RelatedTools current="/lorem-ipsum-generator" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
