"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { getToolBySlug } from "@/lib/tools/registry";
import {
  Sparkles,
  X,
  ShieldCheck,
  Zap,
  HelpCircle,
  BookOpen,
  FileCheck,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export type NovaState =
  | "idle"
  | "point"
  | "uploading"
  | "processing"
  | "success"
  | "error";

interface NovaBuddyProps {
  tool?: ToolDefinition;
  toolSlug?: string;
  state?: NovaState;
}

const MASCOT_IMAGES: Record<NovaState, string> = {
  idle: "/novabuddy/idle.webp",
  point: "/novabuddy/point.webp",
  uploading: "/novabuddy/upload.webp",
  processing: "/novabuddy/processing.webp",
  success: "/novabuddy/success.webp",
  error: "/novabuddy/error.webp",
};

const CATEGORY_PRO_TIPS: Record<string, string> = {
  pdf: "Pro Tip: Downsampling images to 150 DPI reduces PDF file size by up to 70% while keeping text razor-sharp for government and academic portals.",
  image: "Pro Tip: WebP format provides 25% to 34% smaller file sizes compared to JPEG at equivalent visual quality.",
  text: "Pro Tip: Clean whitespace and remove invisible Unicode characters before pasting copy into CMS editors or code files.",
  ocr: "Pro Tip: For highest OCR accuracy, ensure high contrast, straight orientation, and at least 300 DPI resolution on scanned documents.",
  developer: "Pro Tip: Formatting minified JSON or decoding HTML entities runs 100% in local memory—no API keys or tokens are leaked.",
  calculators: "Pro Tip: Double-check your interest compounding frequency (monthly vs. yearly) for exact financial amortization accuracy.",
  finance: "Pro Tip: GST Reverse Charge (RCM) and forward tax rates calculate instantly with zero rounding discrepancies.",
  india: "Pro Tip: Exam portals (UPSC, SSC, TNPSC) enforce strict 10KB-50KB limits; use our Target Size compressors for 1-click compliance.",
  tamil: "Pro Tip: Easily convert between legacy BAMINI/Kavitha font encodings and universal Unicode for cross-platform publishing.",
  seo: "Pro Tip: Keep meta titles under 60 characters and descriptions between 140-160 characters for optimal Google Search SERP snippets.",
  file: "Pro Tip: Check file checksums (SHA-256 / MD5) locally before sharing critical software archives or disk images.",
  qr: "Pro Tip: Test generated QR codes with high error correction (Level H) if printing on physical packaging or business cards.",
};

export default function NovaBuddy({
  tool: propTool,
  toolSlug,
  state = "idle",
}: NovaBuddyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"guide" | "specs" | "faqs">("guide");
  const [selectedQuickQuestion, setSelectedQuickQuestion] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const pathSlug = pathname ? pathname.replace(/^\//, "").split("/")[0] : "";

  // Resolve tool definition from prop, slug, or active route
  const tool: ToolDefinition | undefined =
    propTool || (toolSlug ? getToolBySlug(toolSlug) : (pathSlug ? getToolBySlug(pathSlug) : undefined));

  // Close panel on outside click or Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Only close if click is not on the trigger button
        const trigger = document.getElementById("novabuddy-trigger");
        if (trigger && !trigger.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toolName = tool?.name || "Nova Tools Assistant";
  const categoryKey = tool?.category || "general";
  const proTip = CATEGORY_PRO_TIPS[categoryKey] || "All computations execute in your browser's local sandbox memory for complete privacy.";

  // Quick Questions tailored to tool
  const quickQuestions = [
    {
      q: "Is my data safe?",
      a: tool?.privacyMessage || "Yes. All processing occurs 100% in your browser memory. Your files are never uploaded to remote servers.",
    },
    {
      q: "What formats work?",
      a: tool?.supportedFormats && tool.supportedFormats.length > 0
        ? `Supported formats: ${tool.supportedFormats.join(", ")}.`
        : `Accepts: ${tool?.inputTypes?.join(", ") || "Standard web inputs"}. Generates: ${tool?.outputTypes?.join(", ") || "Optimized file/text"}.`,
    },
    {
      q: "Are there size limits?",
      a: tool?.limitations && tool.limitations.length > 0
        ? tool.limitations.join(" ")
        : "Client-side processing handles standard documents and files comfortably within available device RAM.",
    },
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <div
        id="novabuddy-trigger"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5"
      >
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`Open NovaBuddy Assistant for ${toolName}`}
            aria-expanded={isOpen}
            className="group relative flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:shadow-[0_0_35px_rgba(34,211,238,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {/* Mascot Avatar with Online Ping */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 flex items-center justify-center p-0.5 overflow-hidden border border-cyan-400/30">
              <Image
                src={MASCOT_IMAGES[state] || MASCOT_IMAGES.idle}
                alt="NovaBuddy"
                width={40}
                height={40}
                className={`w-full h-full object-contain ${
                  state === "processing" ? "nova-spin" : "nova-float"
                }`}
              />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="text-left">
              <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
                <span>NovaBuddy</span>
                <span className="hidden md:inline text-[10px] px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  Guide
                </span>
              </div>
              <p className="text-[9px] text-slate-400 hidden sm:block truncate max-w-[120px]">
                {state === "processing"
                  ? "Processing..."
                  : state === "success"
                  ? "Done!"
                  : `${toolName.slice(0, 16)}...`}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Floating Interactive Assistant Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="novabuddy-title"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md max-h-[82vh] sm:max-h-[580px] bg-slate-950/95 border border-cyan-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl text-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center p-1 relative">
                <Image
                  src={MASCOT_IMAGES[state] || MASCOT_IMAGES.idle}
                  alt="NovaBuddy Mascot"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <h3
                  id="novabuddy-title"
                  className="text-sm font-bold text-white flex items-center gap-1.5"
                >
                  <span>NovaBuddy Assistant</span>
                  {tool && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      {tool.category}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {tool ? tool.name : "Your In-Browser Utility Guide"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium">100% Client-Side Engine</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">Zero Upload</span>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-semibold text-slate-400 bg-slate-900/40">
            <button
              type="button"
              onClick={() => setActiveTab("guide")}
              className={`py-2.5 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "guide"
                  ? "text-cyan-300 border-b-2 border-cyan-400 bg-cyan-500/5 font-bold"
                  : "hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`py-2.5 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "specs"
                  ? "text-cyan-300 border-b-2 border-cyan-400 bg-cyan-500/5 font-bold"
                  : "hover:text-white"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Specs</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("faqs")}
              className={`py-2.5 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "faqs"
                  ? "text-cyan-300 border-b-2 border-cyan-400 bg-cyan-500/5 font-bold"
                  : "hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
            {/* Tab 1: How to Use */}
            {activeTab === "guide" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-slate-300 font-medium">
                    {tool?.longDescription || tool?.shortDescription || "Follow these simple steps to process your files securely in your browser."}
                  </p>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    Step-by-Step Instructions
                  </h4>
                  {tool?.howToSteps && tool.howToSteps.length > 0 ? (
                    tool.howToSteps.map((step) => (
                      <div
                        key={step.step}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
                      >
                        <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/30">
                          {step.step}
                        </span>
                        <div>
                          <p className="font-bold text-white text-xs">{step.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{step.instruction}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div>
                          <p className="font-bold text-white text-xs">Add Input Data or File</p>
                          <p className="text-slate-400 text-[11px]">Upload your file or enter input in the interactive widget above.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                          2
                        </span>
                        <div>
                          <p className="font-bold text-white text-xs">Configure Options</p>
                          <p className="text-slate-400 text-[11px]">Select your preferred compression, quality, or formatting settings.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                          3
                        </span>
                        <div>
                          <p className="font-bold text-white text-xs">Export &amp; Download</p>
                          <p className="text-slate-400 text-[11px]">Save the processed file or copy the formatted text to your clipboard.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Pro Tip */}
                <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Expert Advice</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{proTip}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Specs & Privacy */}
            {activeTab === "specs" && (
              <div className="space-y-4">
                {/* Specifications Grid */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase text-slate-500 font-mono">Accepted Inputs</span>
                      <p className="font-semibold text-white capitalize mt-0.5">
                        {tool?.inputTypes?.join(", ") || "Text / Files"}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase text-slate-500 font-mono">Generated Output</span>
                      <p className="font-semibold text-white capitalize mt-0.5">
                        {tool?.outputTypes?.join(", ") || "Optimized Result"}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2">
                      <span className="text-[10px] uppercase text-slate-500 font-mono">Runtime Engine</span>
                      <p className="font-semibold text-cyan-300 mt-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>Client Sandbox ({tool?.processingType?.toUpperCase() || "WASM / JS"})</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                {tool?.features && tool.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                      Included Features
                    </h4>
                    <div className="space-y-1.5">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limitations */}
                {tool?.limitations && tool.limitations.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Platform Considerations</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-100/90 list-disc list-inside">
                      {tool.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: FAQs & Quick Q&A */}
            {activeTab === "faqs" && (
              <div className="space-y-4">
                {/* Quick Question Chips */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    Instant Answers
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {quickQuestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setSelectedQuickQuestion(
                            selectedQuickQuestion === item.q ? null : item.q
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                          selectedQuickQuestion === item.q
                            ? "bg-cyan-500 text-slate-950 font-bold"
                            : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/30"
                        }`}
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>

                  {selectedQuickQuestion && (
                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-slate-200 text-[11px] animate-in fade-in duration-150">
                      {quickQuestions.find((q) => q.q === selectedQuickQuestion)?.a}
                    </div>
                  )}
                </div>

                {/* Tool-Specific FAQs */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                  <h4 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    Frequently Asked Questions
                  </h4>
                  {tool?.faq && tool.faq.length > 0 ? (
                    tool.faq.map((faqItem, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1"
                      >
                        <p className="font-bold text-white text-[11px] flex items-start gap-1.5">
                          <span className="text-cyan-400">Q:</span>
                          <span>{faqItem.question}</span>
                        </p>
                        <p className="text-slate-400 text-[11px] pl-4 leading-relaxed">
                          {faqItem.answer}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-[11px]">
                      No additional FAQs recorded for this tool.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
            {tool?.category ? (
              <Link
                href={`/categories/${tool.category}`}
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <Layers className="w-3 h-3" />
                <span>Explore {tool.category.toUpperCase()} Hub</span>
              </Link>
            ) : (
              <span className="text-[10px] text-slate-500">Nova Tools Suite</span>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
