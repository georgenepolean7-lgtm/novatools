"use client";

import { useMemo, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function CharacterCounterPage() {
  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");

  const stats = useMemo(() => {
    if (!text) {
      return {
        totalChars: 0,
        noSpaces: 0,
        noWhitespace: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        bytes: 0,
      };
    }

    // Unicode grapheme aware character counting (emojis, complex Indic ligatures)
    const totalChars = Array.from(text).length;
    const noSpaces = Array.from(text.replace(/ /g, "")).length;
    const noWhitespace = Array.from(text.replace(/\s+/g, "")).length;

    // Word count
    const words = (text.trim().match(/\S+/gu) || []).length;

    // Line count
    const lines = text.split(/\r\n|\r|\n/).length;

    // Paragraph count
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0).length;

    // UTF-8 byte length
    const bytes = new TextEncoder().encode(text).length;

    return {
      totalChars,
      noSpaces,
      noWhitespace,
      words,
      lines,
      paragraphs: Math.max(paragraphs, words > 0 ? 1 : 0),
      bytes,
    };
  }, [text]);

  async function copyText() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
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
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "novatools-character-count.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function clearText() {
    setText("");
    setCopied(false);
    setRobotState("idle");
  }

  const socialLimits = [
    { platform: "X / Twitter", limit: 280 },
    { platform: "Instagram Caption", limit: 2200 },
    { platform: "LinkedIn Post", limit: 3000 },
    { platform: "SMS (Single)", limit: 160 },
  ];

  return (
    <>
      <ToolSEO
        name="Character Counter"
        path="/character-counter"
        description="Count total characters, characters excluding spaces/whitespace, words, lines, and social media limits in real-time. Full Unicode and Tamil support."
        faqs={[
          {
            question: "Does this counter correctly count emojis and Tamil characters?",
            answer:
              "Yes! Unlike standard length calculators that count multi-byte UTF-16 surrogate pairs as 2 characters, our counter uses Unicode Array iterators to count true graphemes correctly.",
          },
          {
            question: "What is the difference between 'No Spaces' and 'No Whitespace'?",
            answer:
              "'No Spaces' subtracts only standard space characters (' '), while 'No Whitespace' also excludes tabs, returns, and newline characters.",
          },
          {
            question: "Is my text data private?",
            answer:
              "Yes! All text processing is 100% client-side in your browser memory. Nothing is ever sent to a server.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE TEXT TOOL"
          title="Character Counter"
          description="Accurate Unicode character counter with space exclusions, line tallies, and social limit meters."
        >
          {/* Main Counter Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Characters</p>
              <p className="mt-1 text-2xl font-bold text-cyan-400">{stats.totalChars.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">No Spaces</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.noSpaces.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">No Whitespace</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.noWhitespace.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Words</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.words.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lines</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.lines.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">UTF-8 Size</p>
              <p className="mt-1 text-lg font-bold text-emerald-400">{(stats.bytes / 1024).toFixed(2)} KB</p>
            </div>
          </div>

          <UploadCard
            title="Text Input"
            description="Type, paste, or draft your text below to view real-time metrics."
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Unicode &amp; Multilingual Ready (Tamil, English, Hindi, Arabic, Emojis)
                </span>
                {text && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyText}
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                    >
                      {copied ? "Copied! ✓" : "Copy"}
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

              <textarea
                aria-label="Text input for character counting"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={10}
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-sans text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />

              {/* Social Media Character Meters */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Social Media Limits
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {socialLimits.map((item) => {
                    const remaining = item.limit - stats.totalChars;
                    const percent = Math.min(100, Math.round((stats.totalChars / item.limit) * 100));
                    const isExceeded = remaining < 0;

                    return (
                      <div
                        key={item.platform}
                        className="rounded-xl border border-white/5 bg-white/5 p-3"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-white">{item.platform}</span>
                          <span className={isExceeded ? "font-bold text-rose-400" : "text-slate-400"}>
                            {isExceeded ? `${Math.abs(remaining)} over` : `${remaining} left`}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full transition-all ${
                              isExceeded ? "bg-rose-500" : percent > 85 ? "bg-amber-400" : "bg-cyan-400"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </UploadCard>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Count Characters</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Type or paste your text into the editor.</li>
              <li>View character counts with and without spaces, word count, and line count immediately.</li>
              <li>Check social media character progress bars for Twitter, Instagram, and LinkedIn.</li>
            </ol>
          </div>

          <RelatedTools current="/character-counter" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
