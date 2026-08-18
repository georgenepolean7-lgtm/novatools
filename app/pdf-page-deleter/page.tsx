"use client";

import { ChangeEvent, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import { saveAs } from "file-saver";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function PdfPageDeleterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesToDelete, setPagesToDelete] = useState<number[]>([]);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);

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

      if (totalPages <= 1) {
        throw new Error("This PDF only has 1 page. Deleting pages requires a multi-page document.");
      }

      setFile(pdfFile);
      setPageCount(totalPages);
      setPagesToDelete([]);
      setResultBlob(null);
      setResultUrl(null);
      setResultSize(null);
      setMessage("");
      setProcessing(false);
      setRobotState("idle");
    } catch (err: unknown) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      const errMessage = err instanceof Error ? err.message : "Failed to load PDF.";
      setMessage(errMessage);
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function toggleDelete(pageNum: number) {
    setPagesToDelete((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((p) => p !== pageNum);
      } else {
        if (prev.length + 1 >= pageCount) {
          setMessage("You must keep at least 1 page in your document.");
          return prev;
        }
        setMessage("");
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  }

  function clearSelection() {
    setPagesToDelete([]);
    setMessage("");
  }

  async function deletePagesAndSave() {
    if (!file || pagesToDelete.length === 0) {
      setMessage("Please select at least one page to delete.");
      return;
    }

    if (pagesToDelete.length >= pageCount) {
      setMessage("Cannot delete all pages. At least 1 page must remain.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Generating updated PDF without deleted pages...");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      // Collect all 0-indexed indices of pages to keep
      const keepIndices: number[] = [];
      for (let i = 1; i <= pageCount; i++) {
        if (!pagesToDelete.includes(i)) {
          keepIndices.push(i - 1);
        }
      }

      const copiedPages = await newPdf.copyPages(srcDoc, keepIndices);
      for (const page of copiedPages) {
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setProcessing(false);
      setRobotState("success");
      setMessage(
        `Successfully deleted ${pagesToDelete.length} page${
          pagesToDelete.length > 1 ? "s" : ""
        }! ${keepIndices.length} page${keepIndices.length > 1 ? "s" : ""} remaining.`
      );
      setTimeout(() => setRobotState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to delete pages from PDF.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function downloadResult() {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    saveAs(resultBlob, `${baseName}-modified.pdf`);
  }

  function resetAll() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setPageCount(0);
    setPagesToDelete([]);
    setResultBlob(null);
    setResultUrl(null);
    setResultSize(null);
    setProcessing(false);
    setMessage("");
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const remainingCount = pageCount - pagesToDelete.length;

  return (
    <>
      <ToolSEO
        name="PDF Page Deleter"
        path="/pdf-page-deleter"
        description="Delete unwanted pages from PDF documents online. 100% private in-browser page removal with exact layout preservation."
        faqs={[
          {
            question: "How do I remove pages from a PDF?",
            answer:
              "Upload your PDF document, click on the pages you want to remove (they will be highlighted in red with a delete icon), and click 'Delete Selected Pages'.",
          },
          {
            question: "Will the remaining pages lose quality?",
            answer:
              "No! The tool preserves the original vector graphics, text formatting, and page resolutions of all remaining pages.",
          },
          {
            question: "Can I delete all pages?",
            answer:
              "A valid PDF document must contain at least one page, so our tool prevents deleting 100% of the pages.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE PDF TOOL"
          title="PDF Page Deleter"
          description="Remove unwanted pages from multi-page PDF documents cleanly and permanently."
        >
          <UploadCard
            title="Upload PDF Document"
            description="Select or drop a PDF file to choose pages to delete."
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
                <div className="text-5xl">🗑️</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop PDF document here
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Multi-page PDF documents supported
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
                      {pageCount} Total Pages • {(file.size / 1024).toFixed(1)} KB
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

                {/* Status Bar */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs">
                    <span className="text-rose-400 font-semibold">
                      {pagesToDelete.length} Page{pagesToDelete.length === 1 ? "" : "s"} marked for deletion
                    </span>
                    <span className="mx-2 text-slate-600">•</span>
                    <span className="text-emerald-400 font-semibold">
                      {remainingCount} Page{remainingCount === 1 ? "" : "s"} will remain
                    </span>
                  </div>

                  {pagesToDelete.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/20"
                    >
                      Clear Marks
                    </button>
                  )}
                </div>

                {/* Page Selection Grid */}
                <div>
                  <p className="text-xs text-slate-400">
                    Click any page box to mark it for deletion:
                  </p>

                  <div className="mt-3 grid max-h-60 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-8">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => {
                      const isDeleted = pagesToDelete.includes(num);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => toggleDelete(num)}
                          className={`relative flex h-14 flex-col items-center justify-center rounded-xl border font-semibold transition ${
                            isDeleted
                              ? "border-rose-500/80 bg-rose-500/20 text-rose-300 line-through shadow-md"
                              : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                          }`}
                        >
                          <span className="text-[10px] text-slate-400">Page</span>
                          <span className="text-sm">{num}</span>
                          {isDeleted && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white">
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  disabled={processing || pagesToDelete.length === 0}
                  onClick={deletePagesAndSave}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing
                    ? "Deleting Pages..."
                    : `Delete ${pagesToDelete.length} Selected Page${pagesToDelete.length > 1 ? "s" : ""} & Save PDF`}
                </button>
              </div>
            )}

            {message && !resultBlob && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {resultBlob && resultUrl && (
            <ResultCard
              title="Pages Deleted Successfully"
              description="Your modified PDF has been generated and is ready to download."
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">📕</div>
                    <div>
                      <p className="font-semibold text-white">novatools-modified.pdf</p>
                      <p className="text-xs text-slate-400">
                        {remainingCount} Page{remainingCount === 1 ? "" : "s"} • {resultSize ? (resultSize / 1024).toFixed(1) : 0} KB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadResult}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg transition hover:scale-105 sm:w-auto"
                  >
                    Download Modified PDF ⬇
                  </button>
                </div>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Delete Pages from a PDF</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your multi-page PDF document.</li>
              <li>Click on the pages you want to remove to mark them with a red deletion tag.</li>
              <li>Click &quot;Delete Selected Pages &amp; Save PDF&quot; to produce the sanitized document.</li>
              <li>Download your updated PDF immediately.</li>
            </ol>
          </div>

          <RelatedTools current="/pdf-page-deleter" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
