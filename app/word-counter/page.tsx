"use client";

import { useMemo, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function WordCounterPage() {
  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");

  const stats = useMemo(() => {
    if (!text.trim()) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: "0 min",
        speakingTime: "0 min",
      };
    }

    // Unicode-aware character counting (handles emojis and Indic graphemes)
    const charsWithSpaces = Array.from(text).length;
    const charsNoSpaces = Array.from(text.replace(/\s+/g, "")).length;

    // Unicode-aware word segmentation
    let words = 0;
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      try {
        const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
        const segments = segmenter.segment(text);
        for (const seg of segments) {
          if (seg.isWordLike) {
            words++;
          }
        }
      } catch {
        words = (text.trim().match(/\S+/gu) || []).length;
      }
    } else {
      words = (text.trim().match(/\S+/gu) || []).length;
    }

    // Sentence count
    const sentences = (text.match(/[^.!?\n]+[.!?]+(?:\s+|\n|$)|[^.!?\n]+$/gu) || []).filter(
      (s) => s.trim().length > 0
    ).length;

    // Paragraph count
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0).length;

    // Reading & speaking times
    const readMin = Math.ceil(words / 200);
    const speakMin = Math.ceil(words / 130);

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences: Math.max(sentences, words > 0 ? 1 : 0),
      paragraphs: Math.max(paragraphs, words > 0 ? 1 : 0),
      readingTime: `${readMin} min${readMin > 1 ? "s" : ""}`,
      speakingTime: `${speakMin} min${speakMin > 1 ? "s" : ""}`,
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
    link.download = "novatools-text.txt";
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

  return (
    <>
      <ToolSEO
        name="Word Counter"
        path="/word-counter"
        description="Count words, characters, sentences, paragraphs, and reading time in real-time. Supports English, Tamil, Hindi, multilingual Unicode text, and emojis."
        faqs={[
          {
            question: "How does the Word Counter handle non-English text?",
            answer:
              "Our word counter uses native Unicode segmentation APIs (Intl.Segmenter) to accurately calculate word and grapheme boundaries for Tamil, Hindi, Arabic, European languages, and emojis.",
          },
          {
            question: "How are reading and speaking times estimated?",
            answer:
              "Reading time is calculated at an average silent reading speed of 200 words per minute (WPM), while speaking time is estimated at 130 WPM.",
          },
          {
            question: "Is my text private?",
            answer:
              "Yes! All text counting and analysis are performed 100% locally in your web browser. No text is ever uploaded or logged.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE TEXT TOOL"
          title="Word Counter"
          description="Real-time word, character, sentence, and reading time statistics for any text."
        >
          {/* Key Metrics Counter Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Words</p>
              <p className="mt-1 text-2xl font-bold text-cyan-400">{stats.words.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Characters</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.charsWithSpaces.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">No Spaces</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.charsNoSpaces.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentences</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.sentences.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paragraphs</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.paragraphs.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Reading Time</p>
              <p className="mt-1 text-lg font-bold text-emerald-400">{stats.readingTime}</p>
            </div>
          </div>

          <UploadCard
            title="Enter or Paste Text"
            description="Type or paste your text below to get instant real-time analysis."
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {stats.words > 0
                    ? `Estimated Speaking Time: ~${stats.speakingTime}`
                    : "Supports English, Tamil, Multilingual & Emojis"}
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
                aria-label="Text input for word counting"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your article, essay, or notes here..."
                rows={12}
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-sans text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </UploadCard>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Use Word Counter</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Type or paste your content into the editor box above.</li>
              <li>Instantly view word count, character count, sentence totals, and estimated reading time.</li>
              <li>Copy the text or download it as a plain text (.txt) file with one click.</li>
            </ol>
          </div>

          <RelatedTools current="/word-counter" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
