"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type ConvertedFile = {
  name: string;
  originalSize: number;
  jpgSize: number;
  previewUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
  savedPercent: number;
};

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function BmpToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState<number>(0.9);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      convertedFiles.forEach((f) => {
        URL.revokeObjectURL(f.previewUrl);
        URL.revokeObjectURL(f.downloadUrl);
      });
    };
  }, [convertedFiles]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) return;
    validateAndAdd(selected);
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
    validateAndAdd(dropped);
  }

  function validateAndAdd(incomingFiles: File[]) {
    const validBmps = incomingFiles.filter(
      (f) =>
        f.type === "image/bmp" ||
        f.type === "image/x-ms-bmp" ||
        f.name.toLowerCase().endsWith(".bmp")
    );

    if (validBmps.length === 0) {
      setMessage("Please select valid BMP bitmap image files (.bmp).");
      return;
    }

    setFiles(validBmps);
    setConvertedFiles([]);
    setMessage("");
    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);
  }

  async function convertBmpToJpg() {
    if (files.length === 0) return;

    setProcessing(true);
    setRobotState("processing");
    setMessage("Converting bitmap images to compact JPG...");

    const results: ConvertedFile[] = [];

    try {
      for (const file of files) {
        const item = await convertSingleBmp(file, quality, bgColor);
        results.push(item);
      }

      setConvertedFiles(results);
      setProcessing(false);
      setRobotState("success");
      setMessage(
        `Successfully converted ${results.length} BMP file${
          results.length > 1 ? "s" : ""
        } to JPG!`
      );
      setTimeout(() => setRobotState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to convert BMP to JPG. Please verify the BMP file format.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function convertSingleBmp(file: File, qualityVal: number, bg: string): Promise<ConvertedFile> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas context creation failed"));
          return;
        }

        // Fill background color
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw BMP image on top
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              URL.revokeObjectURL(url);
              reject(new Error("JPEG encoding failed"));
              return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const saved = Math.max(
              0,
              Math.round(((file.size - blob.size) / file.size) * 100)
            );

            resolve({
              name: `${baseName}.jpg`,
              originalSize: file.size,
              jpgSize: blob.size,
              previewUrl: url,
              downloadUrl,
              width: img.naturalWidth,
              height: img.naturalHeight,
              savedPercent: saved,
            });
          },
          "image/jpeg",
          qualityVal
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to decode BMP image: ${file.name}`));
      };

      img.src = url;
    });
  }

  async function downloadAllZip() {
    if (convertedFiles.length === 0) return;

    const zip = new JSZip();
    for (const item of convertedFiles) {
      const response = await fetch(item.downloadUrl);
      const blob = await response.blob();
      zip.file(item.name, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "novatools-converted-jpgs.zip");
  }

  function resetAll() {
    convertedFiles.forEach((f) => {
      URL.revokeObjectURL(f.previewUrl);
      URL.revokeObjectURL(f.downloadUrl);
    });

    setFiles([]);
    setConvertedFiles([]);
    setProcessing(false);
    setMessage("");
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <ToolSEO
        name="BMP to JPG Converter"
        path="/bmp-to-jpg"
        description="Convert heavy bitmap BMP images into lightweight, compressed JPG photos online. 100% private in-browser conversion with quality control."
        faqs={[
          {
            question: "Why convert BMP to JPG?",
            answer:
              "BMP files are uncompressed bitmap graphics that take up huge storage space. Converting to JPG can reduce file size by up to 90% with minimal perceived quality loss.",
          },
          {
            question: "Can I adjust the JPEG compression quality?",
            answer:
              "Yes! You can use the quality slider to balance between maximum compression and crystal-clear image clarity.",
          },
          {
            question: "Are my BMP images secure?",
            answer:
              "Yes. All processing is carried out entirely inside your web browser without uploading files to any remote server.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE IMAGE CONVERTER"
          title="BMP to JPG Converter"
          description="Convert large uncompressed BMP bitmaps to compact, optimized JPG photos in seconds."
        >
          <UploadCard
            title="Upload BMP Files"
            description="Select or drop one or multiple .bmp bitmap files."
          >
            {files.length === 0 ? (
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
                <div className="text-5xl">🖼️</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop BMP images here
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Single or batch upload supported (.bmp)
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Browse BMP Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/bmp,.bmp"
                    onChange={handleFiles}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-300">
                    {files.length} BMP File{files.length > 1 ? "s" : ""} Selected
                  </span>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    Change Selection
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <ul className="max-h-36 space-y-2 overflow-y-auto text-xs text-slate-300">
                    {files.map((file, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="truncate">{file.name}</span>
                        <span className="text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conversion Settings */}
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:grid-cols-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">JPG Quality</span>
                      <span className="font-bold text-cyan-400">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-300">
                      Background Fill
                    </span>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                      />
                      <span className="font-mono text-xs text-slate-400 uppercase">
                        {bgColor}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={processing}
                  onClick={convertBmpToJpg}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing
                    ? "Converting to JPG..."
                    : `Convert ${files.length} BMP${files.length > 1 ? "s" : ""} to JPG`}
                </button>
              </div>
            )}

            {message && convertedFiles.length === 0 && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {convertedFiles.length > 0 && (
            <ResultCard
              title="Conversion Complete"
              description="Your BMP images have been converted to optimized JPEG photos."
            >
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {convertedFiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 p-2">
                        <img
                          src={item.downloadUrl}
                          alt={item.name}
                          className="mx-auto h-32 object-contain"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="truncate font-semibold text-white">{item.name}</p>
                          <p className="text-slate-400">
                            {(item.jpgSize / 1024).toFixed(1)} KB •{" "}
                            <span className="font-bold text-emerald-400">
                              -{item.savedPercent}% smaller
                            </span>
                          </p>
                        </div>
                        <a
                          href={item.downloadUrl}
                          download={item.name}
                          className="rounded-xl bg-cyan-500/20 px-3 py-1.5 font-semibold text-cyan-300 hover:bg-cyan-500/30"
                        >
                          Download ⬇
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {convertedFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={downloadAllZip}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download All as ZIP Archive (ZIP) 📦
                  </button>
                )}
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Convert BMP to JPG</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload one or multiple BMP bitmap files.</li>
              <li>Adjust the JPG quality slider and optional background fill color.</li>
              <li>Click &quot;Convert to JPG&quot; to compress the files in your browser.</li>
              <li>Download your converted JPG images individually or as a single ZIP archive.</li>
            </ol>
          </div>

          <RelatedTools current="/bmp-to-jpg" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
