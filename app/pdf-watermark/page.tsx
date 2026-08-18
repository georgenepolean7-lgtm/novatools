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

const PRESET_COLORS: { label: string; rgb: [number, number, number]; hex: string }[] = [
  { label: "Light Gray", rgb: [0.6, 0.6, 0.6], hex: "#9ca3af" },
  { label: "Crimson Red", rgb: [0.85, 0.15, 0.15], hex: "#ef4444" },
  { label: "Ocean Blue", rgb: [0.15, 0.45, 0.85], hex: "#3b82f6" },
  { label: "Dark Slate", rgb: [0.15, 0.15, 0.15], hex: "#1e293b" },
  { label: "Emerald Green", rgb: [0.1, 0.65, 0.3], hex: "#10b981" },
];

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  // Watermark options
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState<number>(48);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(45);
  const [colorIndex, setColorIndex] = useState<number>(0);

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

      if (totalPages === 0) {
        throw new Error("This PDF has no pages.");
      }

      setFile(pdfFile);
      setPageCount(totalPages);
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

  async function applyWatermark() {
    if (!file || !watermarkText.trim()) {
      setMessage("Please enter watermark text.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Embedding watermark on all pages...");

    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      const selectedColor = PRESET_COLORS[colorIndex].rgb;
      const pdfColor = rgb(selectedColor[0], selectedColor[1], selectedColor[2]);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);

        // Center coordinates calculation considering rotation
        const rad = (rotation * Math.PI) / 180;
        const xOffset = (textWidth / 2) * Math.cos(rad) - (textHeight / 2) * Math.sin(rad);
        const yOffset = (textWidth / 2) * Math.sin(rad) + (textHeight / 2) * Math.cos(rad);

        page.drawText(watermarkText, {
          x: width / 2 - xOffset,
          y: height / 2 - yOffset,
          size: fontSize,
          font: helveticaFont,
          color: pdfColor,
          opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setProcessing(false);
      setRobotState("success");
      setMessage(`Watermark "${watermarkText}" stamped on all ${pages.length} pages!`);
      setTimeout(() => setRobotState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to apply watermark to PDF.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function downloadWatermarked() {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    saveAs(resultBlob, `${baseName}-watermarked.pdf`);
  }

  function resetAll() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setPageCount(0);
    setResultBlob(null);
    setResultUrl(null);
    setResultSize(null);
    setProcessing(false);
    setMessage("");
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <ToolSEO
        name="PDF Watermark Tool"
        path="/pdf-watermark"
        description="Add custom text watermarks, confidential stamps, and drafts to PDF documents online. 100% private in-browser watermarking with angle and opacity control."
        faqs={[
          {
            question: "How do I add a watermark to a PDF?",
            answer:
              "Upload your PDF, enter your watermark text (or select a preset like 'CONFIDENTIAL'), customize font size, color, rotation, and opacity, and click 'Apply Watermark to PDF'.",
          },
          {
            question: "Is the watermark applied to all pages?",
            answer:
              "Yes! The watermark is embedded directly into the native vector layer of every page in your document.",
          },
          {
            question: "Will watermarking damage my existing PDF content?",
            answer:
              "No, our tool draws translucent vector text on top of your existing page streams without flattening or destroying underlying text and images.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE PDF UTILITY"
          title="PDF Watermark Tool"
          description="Stamp custom text watermarks, confidential labels, and draft markers across all PDF pages."
        >
          <UploadCard
            title="Upload PDF Document"
            description="Select or drop a PDF document to add a watermark."
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
                <div className="text-5xl">💧</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop PDF document here
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Single or multi-page PDF documents
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
                      {pageCount} Page{pageCount > 1 ? "s" : ""} • {(file.size / 1024).toFixed(1)} KB
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

                {/* Watermark Text Configuration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text..."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-cyan-400"
                  />

                  {/* Preset quick buttons */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["CONFIDENTIAL", "DRAFT", "DO NOT COPY", "SAMPLE", "INTERNAL ONLY"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setWatermarkText(preset)}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styling Controls Grid */}
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:grid-cols-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Font Size</span>
                      <span className="font-bold text-cyan-400">{fontSize} pt</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="2"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Opacity</span>
                      <span className="font-bold text-cyan-400">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.9"
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-300">
                      Rotation Angle
                    </span>
                    <div className="mt-2 flex gap-2">
                      {[
                        { label: "45° (Diagonal)", val: 45 },
                        { label: "0° (Horizontal)", val: 0 },
                        { label: "-45°", val: -45 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setRotation(item.val)}
                          className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition ${
                            rotation === item.val
                              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                              : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-300">
                      Color
                    </span>
                    <div className="mt-2 flex gap-2">
                      {PRESET_COLORS.map((c, idx) => (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => setColorIndex(idx)}
                          title={c.label}
                          className={`h-8 w-8 rounded-full border transition ${
                            colorIndex === idx
                              ? "border-white scale-110 shadow-lg ring-2 ring-cyan-400"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  disabled={processing || !watermarkText.trim()}
                  onClick={applyWatermark}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Applying Watermark..." : "Apply Watermark to PDF"}
                </button>
              </div>
            )}

            {message && !resultBlob && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {resultBlob && resultUrl && (
            <ResultCard
              title="Watermark Applied Successfully"
              description="Your PDF document has been stamped with the specified watermark."
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">📕</div>
                    <div>
                      <p className="font-semibold text-white">novatools-watermarked.pdf</p>
                      <p className="text-xs text-slate-400">
                        {pageCount} Page{pageCount > 1 ? "s" : ""} • {resultSize ? (resultSize / 1024).toFixed(1) : 0} KB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadWatermarked}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg transition hover:scale-105 sm:w-auto"
                  >
                    Download Watermarked PDF ⬇
                  </button>
                </div>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Add a Watermark to a PDF</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your PDF file.</li>
              <li>Type your custom watermark text or choose a preset like &quot;CONFIDENTIAL&quot; or &quot;DRAFT&quot;.</li>
              <li>Adjust the font size, opacity slider, rotation angle, and color.</li>
              <li>Click &quot;Apply Watermark to PDF&quot; and download your stamped document.</li>
            </ol>
          </div>

          <RelatedTools current="/pdf-watermark" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
