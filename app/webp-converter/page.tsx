"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type OutputFormat = "webp" | "jpeg" | "png";

type ConvertedFile = {
  name: string;
  originalSize: number;
  newSize: number;
  previewUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
  format: string;
};

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function WebPConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState<number>(0.85);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      convertedFiles.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
      });
    };
  }, [convertedFiles]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;

    const validFiles = selected.filter((f) => f.type.startsWith("image/"));

    if (validFiles.length === 0) {
      setMessage("Please select valid image files (WebP, JPG, PNG, GIF, BMP).");
      return;
    }

    // Auto-detect format suggestion
    const firstIsWebP =
      validFiles[0].type === "image/webp" ||
      validFiles[0].name.toLowerCase().endsWith(".webp");

    if (firstIsWebP) {
      setTargetFormat("png");
    } else {
      setTargetFormat("webp");
    }

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFiles(validFiles);
    setConvertedFiles([]);
    setMessage("");
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
    const dropped = Array.from(e.dataTransfer.files ?? []);
    const valid = dropped.filter((f) => f.type.startsWith("image/"));

    if (valid.length === 0) {
      setMessage("Please drop image files.");
      return;
    }

    const firstIsWebP =
      valid[0].type === "image/webp" ||
      valid[0].name.toLowerCase().endsWith(".webp");

    if (firstIsWebP) {
      setTargetFormat("png");
    } else {
      setTargetFormat("webp");
    }

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFiles(valid);
    setConvertedFiles([]);
    setMessage("");
  }

  async function convertImages() {
    if (files.length === 0) {
      setMessage("Please select at least one image.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Converting images...");

    try {
      const results: ConvertedFile[] = [];
      const mimeType =
        targetFormat === "webp"
          ? "image/webp"
          : targetFormat === "jpeg"
          ? "image/jpeg"
          : "image/png";

      const ext =
        targetFormat === "webp"
          ? "webp"
          : targetFormat === "jpeg"
          ? "jpg"
          : "png";

      for (const file of files) {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error(`Failed to load ${file.name}`));
        });

        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Canvas context is not available.");
        }

        if (targetFormat === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(image, 0, 0);

        const convertedBlob = await new Promise<Blob | null>((resolve) => {
          if (targetFormat === "png") {
            canvas.toBlob((b) => resolve(b), "image/png");
          } else {
            canvas.toBlob((b) => resolve(b), mimeType, quality);
          }
        });

        URL.revokeObjectURL(objectUrl);

        if (!convertedBlob) {
          throw new Error(`Could not convert ${file.name}`);
        }

        const downloadUrl = URL.createObjectURL(convertedBlob);
        const originalName = file.name.replace(/\.[^/.]+$/, "");

        results.push({
          name: `${originalName}.${ext}`,
          originalSize: file.size / 1024,
          newSize: convertedBlob.size / 1024,
          previewUrl: downloadUrl,
          downloadUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
          format: ext.toUpperCase(),
        });
      }

      setConvertedFiles(results);
      setRobotState("success");
      setMessage(
        `Successfully converted ${results.length} image${
          results.length > 1 ? "s" : ""
        } to ${ext.toUpperCase()}.`
      );

      setTimeout(() => setRobotState("idle"), 2500);
    } catch {
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      setMessage("An error occurred while converting the image(s).");
    } finally {
      setProcessing(false);
    }
  }

  async function downloadAllZip() {
    if (convertedFiles.length === 0) return;

    const zip = new JSZip();

    for (let i = 0; i < convertedFiles.length; i++) {
      const fileData = convertedFiles[i];
      const res = await fetch(fileData.downloadUrl);
      const blob = await res.blob();
      zip.file(fileData.name, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `novatools-converted-${targetFormat}.zip`);
  }

  function resetAll() {
    convertedFiles.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
    });

    setFiles([]);
    setConvertedFiles([]);
    setMessage("");
    setProcessing(false);
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <ToolSEO
        name="WebP Converter"
        path="/webp-converter"
        description="Convert WebP to JPG/PNG or convert PNG/JPG to WebP format online for free. Next-gen image compression with quality tuning."
        faqs={[
          {
            question: "What is WebP?",
            answer:
              "WebP is a modern image format developed by Google that provides superior lossless and lossy compression for web images, typically 30% smaller than JPG or PNG.",
          },
          {
            question: "Can I convert WebP images to JPG or PNG?",
            answer:
              "Yes! Simply upload your WebP image, select 'JPG' or 'PNG' as the target format, and click 'Convert'.",
          },
          {
            question: "Can I convert JPG or PNG to WebP?",
            answer:
              "Yes. Upload any JPG, PNG, or GIF image, select 'WebP', and adjust the quality slider to dramatically shrink your image file size.",
          },
          {
            question: "Are my files stored on a server?",
            answer:
              "No. All image transformations execute securely inside your browser canvas. No image data is ever uploaded.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="FREE IMAGE TOOL"
          title="WebP Converter"
          description="Convert to and from WebP format for lighter websites and faster loading times."
        >
          <UploadCard
            title="Upload Images"
            description="Select WebP, JPG, PNG, GIF, or BMP files."
          >
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
              <div className="text-5xl">⚡</div>
              <h3 className="mt-4 text-xl font-bold text-white">
                Choose image files to convert
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Supports WebP, JPG, PNG, GIF, BMP
              </p>

              <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                Browse Files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="hidden"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </span>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    Clear All
                  </button>
                </div>

                {/* Target Format & Quality Options */}
                <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">
                      Target Output Format
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      {[
                        { id: "webp", label: "WebP (Next-Gen)", icon: "⚡" },
                        { id: "png", label: "PNG (Lossless)", icon: "🖼️" },
                        { id: "jpeg", label: "JPG (Standard)", icon: "📷" },
                      ].map((fmt) => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setTargetFormat(fmt.id as OutputFormat)}
                          className={`rounded-xl border p-3 text-center text-sm font-semibold transition ${
                            targetFormat === fmt.id
                              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/10"
                              : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                          }`}
                        >
                          <div className="text-xl">{fmt.icon}</div>
                          <div className="mt-1">{fmt.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {targetFormat !== "png" && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-300">
                        Output Quality: {Math.round(quality * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.4"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="mt-2 w-full accent-cyan-400"
                      />
                      <div className="mt-1 flex justify-between text-xs text-slate-500">
                        <span>Max Compression (40%)</span>
                        <span>Best Quality (100%)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 max-h-36 space-y-2 overflow-y-auto pr-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-sm"
                    >
                      <span className="truncate pr-4 text-slate-300">
                        {file.name}
                      </span>
                      <span className="shrink-0 text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={convertImages}
                  disabled={processing}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing
                    ? "Converting..."
                    : `Convert to ${targetFormat.toUpperCase()}`}
                </button>
              </div>
            )}

            {message && convertedFiles.length === 0 && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {convertedFiles.length > 0 && (
            <ResultCard
              title={`Your ${targetFormat.toUpperCase()} is ready`}
              description={message || "Conversion completed successfully."}
            >
              {convertedFiles.length === 1 ? (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                    <img
                      src={convertedFiles[0].previewUrl}
                      alt="Converted Output"
                      className="mx-auto max-h-80 rounded-xl object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Dimensions</p>
                      <p className="mt-1 font-bold text-white">
                        {convertedFiles[0].width} × {convertedFiles[0].height}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Original Size</p>
                      <p className="mt-1 font-bold text-white">
                        {convertedFiles[0].originalSize.toFixed(1)} KB
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Converted Size</p>
                      <p className="mt-1 font-bold text-emerald-400">
                        {convertedFiles[0].newSize.toFixed(1)} KB
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Target Format</p>
                      <p className="mt-1 font-bold text-cyan-300">
                        {convertedFiles[0].format}
                      </p>
                    </div>
                  </div>

                  <a
                    href={convertedFiles[0].downloadUrl}
                    download={convertedFiles[0].name}
                    className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 text-center font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download {convertedFiles[0].format} Image ↓
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {convertedFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="h-36 w-full rounded-xl object-contain bg-black/20"
                        />
                        <p className="mt-3 truncate font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.newSize.toFixed(1)} KB • {item.format}
                        </p>
                        <a
                          href={item.downloadUrl}
                          download={item.name}
                          className="mt-3 block rounded-xl bg-white/10 py-2 text-center text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
                        >
                          Download ↓
                        </a>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={downloadAllZip}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download All as ZIP (.zip) ↓
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={resetAll}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                Convert More Images
              </button>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Use the WebP Converter</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload any image file or multiple images.</li>
              <li>Select your target format (WebP, PNG, or JPG) and quality level.</li>
              <li>Click Convert to transform the images instantly in your browser.</li>
              <li>Download your individual images or grab everything as a ZIP package.</li>
            </ol>
          </div>

          <RelatedTools current="/webp-converter" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
