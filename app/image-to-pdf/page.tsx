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

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape" | "auto";
type MarginSize = "none" | "small" | "normal";
type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};
type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<MarginSize>("small");

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) return;
    addFiles(selected);
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
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length === 0) return;
    addFiles(dropped);
  }

  function addFiles(newFiles: File[]) {
    const validImages = newFiles.filter((f) => f.type.startsWith("image/"));
    if (validImages.length === 0) {
      setMessage("Please select valid image files (JPG, PNG, WebP, etc.).");
      return;
    }

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    const items: ImageItem[] = validImages.map((f) => {
      const previewUrl = URL.createObjectURL(f);
      return {
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        previewUrl,
        width: 0,
        height: 0,
      };
    });

    setImages((prev) => [...prev, ...items]);
    setMessage("");
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfBlob(null);
      setPdfSize(null);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const removed = prev[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function moveImage(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  }

  async function convertToPdf() {
    if (images.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Generating PDF document...");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const fileBytes = await item.file.arrayBuffer();
        let embeddedImage;

        // Try direct embedding or canvas fallback for formats like WebP
        if (item.file.type === "image/jpeg" || item.file.type === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(fileBytes);
        } else if (item.file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(fileBytes);
        } else {
          // Convert other formats (WebP, BMP, GIF) to PNG via canvas
          const pngBytes = await imageToPngBuffer(item.file);
          embeddedImage = await pdfDoc.embedPng(pngBytes);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        // Determine page dimensions
        let pageWidth = 595.28; // Default A4 portrait
        let pageHeight = 841.89;

        if (pageSize === "letter") {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === "fit") {
          pageWidth = imgWidth;
          pageHeight = imgHeight;
        }

        // Apply orientation
        if (pageSize !== "fit") {
          let isLandscape = false;
          if (orientation === "landscape") {
            isLandscape = true;
          } else if (orientation === "auto") {
            isLandscape = imgWidth > imgHeight;
          }

          if (isLandscape && pageWidth < pageHeight) {
            const temp = pageWidth;
            pageWidth = pageHeight;
            pageHeight = temp;
          } else if (!isLandscape && pageWidth > pageHeight) {
            const temp = pageWidth;
            pageWidth = pageHeight;
            pageHeight = temp;
          }
        }

        // Margin in points
        let marginPoints = 0;
        if (pageSize !== "fit") {
          if (margin === "small") marginPoints = 20;
          if (margin === "normal") marginPoints = 40;
        }

        const availWidth = pageWidth - marginPoints * 2;
        const availHeight = pageHeight - marginPoints * 2;

        const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight, 1);
        const finalW = imgWidth * scale;
        const finalH = imgHeight * scale;

        const posX = marginPoints + (availWidth - finalW) / 2;
        const posY = marginPoints + (availHeight - finalH) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, {
          x: posX,
          y: posY,
          width: finalW,
          height: finalH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setPdfSize(blob.size);
      setProcessing(false);
      setRobotState("success");
      setMessage("PDF generated successfully!");
      setTimeout(() => setRobotState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to create PDF. Please ensure all images are valid.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function imageToPngBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            reject(new Error("Blob conversion failed"));
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve(buf);
        }, "image/png");
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image load error"));
      };
      img.src = url;
    });
  }

  function downloadPdf() {
    if (!pdfBlob) return;
    saveAs(pdfBlob, "novatools-converted.pdf");
  }

  function resetAll() {
    images.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    setImages([]);
    setPdfBlob(null);
    setPdfUrl(null);
    setPdfSize(null);
    setProcessing(false);
    setMessage("");
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <ToolSEO
        name="Image to PDF Converter"
        path="/image-to-pdf"
        description="Convert JPG, PNG, and WebP photos to professional PDF documents. Choose page sizes, orientation, margin, and order with 100% private in-browser processing."
        faqs={[
          {
            question: "Can I convert multiple images into a single PDF?",
            answer:
              "Yes! You can upload multiple images at once, reorder them, and combine them into one seamless PDF document.",
          },
          {
            question: "What page sizes are supported?",
            answer:
              "You can choose between A4, US Letter, or match the original dimensions of your images.",
          },
          {
            question: "Are my images uploaded to external servers?",
            answer:
              "No. All image-to-PDF compilation is executed completely in your browser memory via pdf-lib.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="FREE PDF CREATOR"
          title="Image to PDF Converter"
          description="Convert JPG, PNG, and WebP pictures into clean, high-resolution PDF documents."
        >
          <UploadCard
            title="Upload Images"
            description="Select one or multiple photos to convert into PDF."
          >
            {images.length === 0 ? (
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
                <div className="text-5xl">📄</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop images here or browse
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Supports JPG, PNG, WebP, GIF, BMP
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Choose Images
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-300">
                    {images.length} Image{images.length > 1 ? "s" : ""} Selected
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer text-xs font-semibold text-cyan-400 hover:underline">
                      + Add More
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFiles}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="text-xs text-slate-400 hover:text-rose-400"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Image Thumbnails & Order Controls */}
                <div className="grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <img
                        src={item.previewUrl}
                        alt={`Page ${index + 1}`}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">
                          {item.file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Page {index + 1} • {(item.file.size / 1024).toFixed(0)} KB
                        </p>
                        <div className="mt-1 flex gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveImage(index, index - 1)}
                            className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-cyan-500/20 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index === images.length - 1}
                            onClick={() => moveImage(index, index + 1)}
                            className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-cyan-500/20 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* PDF Page Settings */}
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300">
                      Page Size
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as PageSize)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="a4">A4 (Standard)</option>
                      <option value="letter">US Letter</option>
                      <option value="fit">Match Image Dimensions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300">
                      Orientation
                    </label>
                    <select
                      value={orientation}
                      disabled={pageSize === "fit"}
                      onChange={(e) => setOrientation(e.target.value as Orientation)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 disabled:opacity-50"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                      <option value="auto">Auto (Match Image Ratio)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300">
                      Margin
                    </label>
                    <select
                      value={margin}
                      disabled={pageSize === "fit"}
                      onChange={(e) => setMargin(e.target.value as MarginSize)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 disabled:opacity-50"
                    >
                      <option value="none">No Margin (0)</option>
                      <option value="small">Small (20pt)</option>
                      <option value="normal">Normal (40pt)</option>
                    </select>
                  </div>
                </div>

                {/* Process Button */}
                <button
                  type="button"
                  disabled={processing || images.length === 0}
                  onClick={convertToPdf}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Generating PDF..." : `Convert ${images.length} Image${images.length > 1 ? "s" : ""} to PDF`}
                </button>
              </div>
            )}

            {message && !pdfBlob && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {pdfBlob && pdfUrl && (
            <ResultCard
              title="PDF Ready"
              description="Your images have been combined into a high-quality PDF document."
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">📕</div>
                    <div>
                      <p className="font-semibold text-white">novatools-converted.pdf</p>
                      <p className="text-xs text-slate-400">
                        {images.length} Page{images.length > 1 ? "s" : ""} • {pdfSize ? (pdfSize / 1024).toFixed(1) : 0} KB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadPdf}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg transition hover:scale-105 sm:w-auto"
                  >
                    Download PDF ⬇
                  </button>
                </div>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Convert Images to PDF</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload one or multiple JPG, PNG, or WebP pictures.</li>
              <li>Reorder your images or remove unwanted pages.</li>
              <li>Customize your PDF page size (A4/Letter), orientation, and margin settings.</li>
              <li>Click &quot;Convert to PDF&quot; and download your compiled PDF document.</li>
            </ol>
          </div>

          <RelatedTools current="/image-to-pdf" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
