"use client";

import { ChangeEvent, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import { saveAs } from "file-saver";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function PdfPageExtractorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState<string>("");

  const [extractedBlob, setExtractedBlob] = useState<Blob | null>(null);
  const [extractedUrl, setExtractedUrl] = useState<string | null>(null);
  const [extractedSize, setExtractedSize] = useState<number | null>(null);

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    validateAndLoad(selected);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    validateAndLoad(dropped);
  }

  async function validateAndLoad(pdfFile: File) {
    if (pdfFile.type !== "application/pdf" && !pdfFile.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Please upload a valid PDF document (.pdf).");
      return;
    }

    setProcessing(true);
    setRobotState("uploading");
    setMessage("Reading PDF document...");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      if (totalPages === 0) {
        throw new Error("This PDF has no pages.");
      }

      setFile(pdfFile);
      setPageCount(totalPages);
      setSelectedPages([1]); // Select first page by default
      setRangeInput("1");
      setExtractedBlob(null);
      setExtractedUrl(null);
      setExtractedSize(null);
      setMessage("");
      setProcessing(false);
      setRobotState("idle");
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to load PDF. Document may be encrypted or corrupted.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function togglePage(pageNum: number) {
    setSelectedPages((prev) => {
      let updated: number[];
      if (prev.includes(pageNum)) {
        updated = prev.filter((p) => p !== pageNum);
      } else {
        updated = [...prev, pageNum].sort((a, b) => a - b);
      }
      setRangeInput(formatPageRanges(updated));
      return updated;
    });
  }

  function selectAll() {
    const all = Array.from({ length: pageCount }, (_, i) => i + 1);
    setSelectedPages(all);
    setRangeInput(`1-${pageCount}`);
  }

  function selectNone() {
    setSelectedPages([]);
    setRangeInput("");
  }

  function handleRangeChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setRangeInput(val);

    const parsed = parsePageRanges(val, pageCount);
    setSelectedPages(parsed);
  }

  function parsePageRanges(input: string, max: number): number[] {
    const pages = new Set<number>();
    const parts = input.split(",");

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(max, Math.max(start, end));
          for (let i = from; i <= to; i++) {
            pages.add(i);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pages.add(p);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  }

  function formatPageRanges(pages: number[]): string {
    if (pages.length === 0) return "";
    return pages.join(", ");
  }

  async function extractPages() {
    if (!file || selectedPages.length === 0) {
      setMessage("Please select at least one page to extract.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Extracting selected pages...");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      // Convert 1-indexed selected pages to 0-indexed indices
      const indices = selectedPages.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(srcDoc, indices);

      for (const page of copiedPages) {
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setExtractedBlob(blob);
      setExtractedUrl(url);
      setExtractedSize(blob.size);
      setProcessing(false);
      setRobotState("success");
      setMessage(`Successfully extracted ${selectedPages.length} page${selectedPages.length > 1 ? "s" : ""}!`);
      setTimeout(() => setRobotState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to extract pages from PDF.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function downloadExtracted() {
    if (!extractedBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    saveAs(extractedBlob, `${baseName}-extracted.pdf`);
  }

  function resetAll() {
    if (extractedUrl) URL.revokeObjectURL(extractedUrl);

    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setRangeInput("");
    setExtractedBlob(null);
    setExtractedUrl(null);
    setExtractedSize(null);
    setProcessing(false);
    setMessage("");
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <ToolSEO
        name="PDF Page Extractor"
        path="/pdf-page-extractor"
        description="Extract individual pages or custom ranges from PDF documents online. 100% private in-browser extraction preserving original vector quality."
        faqs={[
          {
            question: "How do I extract specific pages from a PDF?",
            answer:
              "Upload your PDF, click on the page numbers you want to extract or type a range like '1-3, 5', and click 'Extract Selected Pages'.",
          },
          {
            question: "Is the original vector and text quality preserved?",
            answer:
              "Yes! The tool clones the native PDF page streams without rasterizing or altering fonts and vector contents.",
          },
          {
            question: "Is my document uploaded to a remote server?",
            answer:
              "No. All page extraction is performed locally in your browser memory using pdf-lib.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="FREE PDF TOOL"
          title="PDF Page Extractor"
          description="Extract individual pages, groups, or custom page ranges into a new standalone PDF document."
        >
          <UploadCard
            title="Upload PDF Document"
            description="Select or drop a PDF file to choose pages for extraction."
          >
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/50"
                }`}
              >
                <div className="text-5xl">📑</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop PDF document here
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Select any multi-page PDF document
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Browse PDF
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-cyan-300">{file.name}</span>
                    <p className="text-xs text-slate-400">
                      {pageCount} Total Page{pageCount > 1 ? "s" : ""} • {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    Change PDF
                  </button>
                </div>

                {/* Range Input & Quick Select */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <label className="text-xs font-semibold text-slate-300">
                      Page Range (e.g. 1-3, 5)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAll}
                        className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-cyan-500/20"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={selectNone}
                        className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-rose-500/20"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={handleRangeChange}
                    placeholder="e.g. 1, 3-5, 8"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Page Selection Grid */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Click pages to toggle selection:</span>
                    <span className="font-semibold text-cyan-400">
                      {selectedPages.length} of {pageCount} selected
                    </span>
                  </div>

                  <div className="mt-3 grid max-h-56 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-8">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => {
                      const isSelected = selectedPages.includes(num);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => togglePage(num)}
                          className={`flex h-14 flex-col items-center justify-center rounded-xl border font-semibold transition ${
                            isSelected
                              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md"
                              : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40"
                          }`}
                        >
                          <span className="text-[10px] text-slate-400">Page</span>
                          <span className="text-sm">{num}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  disabled={processing || selectedPages.length === 0}
                  onClick={extractPages}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing
                    ? "Extracting Pages..."
                    : `Extract ${selectedPages.length} Selected Page${selectedPages.length > 1 ? "s" : ""}`}
                </button>
              </div>
            )}

            {message && !extractedBlob && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {extractedBlob && extractedUrl && (
            <ResultCard
              title="Pages Extracted Successfully"
              description="Your selected PDF pages have been compiled into a new document."
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">📑</div>
                    <div>
                      <p className="font-semibold text-white">novatools-extracted.pdf</p>
                      <p className="text-xs text-slate-400">
                        {selectedPages.length} Pages • {extractedSize ? (extractedSize / 1024).toFixed(1) : 0} KB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadExtracted}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg transition hover:scale-105 sm:w-auto"
                  >
                    Download Extracted PDF ⬇
                  </button>
                </div>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Extract Pages from a PDF</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your multi-page PDF document.</li>
              <li>Select individual pages on the grid or enter a custom range (e.g. 1-4, 7).</li>
              <li>Click &quot;Extract Selected Pages&quot; to compile the new PDF.</li>
              <li>Download your new extracted PDF document immediately.</li>
            </ol>
          </div>

          <RelatedTools current="/pdf-page-extractor" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
