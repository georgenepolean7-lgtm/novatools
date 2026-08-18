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

export default function PngToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState<number>(0.92);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
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

    const validFiles = selected.filter(
      (f) =>
        f.type === "image/png" ||
        f.name.toLowerCase().endsWith(".png")
    );

    if (validFiles.length === 0) {
      setMessage("Please select valid PNG image files.");
      return;
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
    const droppedFiles = Array.from(e.dataTransfer.files ?? []);
    const valid = droppedFiles.filter(
      (f) =>
        f.type === "image/png" ||
        f.name.toLowerCase().endsWith(".png")
    );

    if (valid.length === 0) {
      setMessage("Please drop PNG image files.");
      return;
    }

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFiles(valid);
    setConvertedFiles([]);
    setMessage("");
  }

  async function convertToJpg() {
    if (files.length === 0) {
      setMessage("Please select at least one PNG image.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Converting PNG images to JPG...");

    try {
      const results: ConvertedFile[] = [];

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

        // Fill background for transparency replacement
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);

        const jpgBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
        });

        URL.revokeObjectURL(objectUrl);

        if (!jpgBlob) {
          throw new Error("Could not create JPG image.");
        }

        const downloadUrl = URL.createObjectURL(jpgBlob);
        const originalName = file.name.replace(/\.[^/.]+$/, "");
        const originalSizeKB = file.size / 1024;
        const jpgSizeKB = jpgBlob.size / 1024;
        const savedPercent =
          originalSizeKB > 0
            ? Math.max(0, ((originalSizeKB - jpgSizeKB) / originalSizeKB) * 100)
            : 0;

        results.push({
          name: `${originalName}.jpg`,
          originalSize: originalSizeKB,
          jpgSize: jpgSizeKB,
          previewUrl: downloadUrl,
          downloadUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
          savedPercent,
        });
      }

      setConvertedFiles(results);
      setRobotState("success");
      setMessage(
        `Successfully converted ${results.length} PNG image${
          results.length > 1 ? "s" : ""
        } to JPG.`
      );

      setTimeout(() => setRobotState("idle"), 2500);
    } catch {
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      setMessage("An error occurred while converting the image(s) to JPG.");
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
    saveAs(zipBlob, "novatools-converted-jpg.zip");
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
        name="PNG to JPG Converter"
        path="/png-to-jpg"
        description="Convert PNG images to JPG/JPEG format online for free. Adjust quality, background color, and compress file size."
        faqs={[
          {
            question: "How do I convert PNG to JPG?",
            answer:
              "Upload your PNG file, customize the background color for any transparent sections, choose your desired quality, and click 'Convert to JPG'.",
          },
          {
            question: "What happens to transparent areas in my PNG?",
            answer:
              "Since JPG does not support alpha transparency, any transparent areas will be filled with your chosen background color (default is clean white).",
          },
          {
            question: "Will converting PNG to JPG reduce file size?",
            answer:
              "Yes! PNG files (especially photographs or complex images) are significantly larger than JPGs. Converting typically reduces file size by 50% to 80%.",
          },
          {
            question: "Is this converter safe and private?",
            answer:
              "Yes. All conversions happen entirely in your web browser. No files are uploaded to our servers.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE IMAGE TOOL"
          title="PNG to JPG Converter"
          description="Convert transparent or high-res PNG images into optimized, lightweight JPG files."
        >
          <UploadCard
            title="Upload PNG Images"
            description="Select or drag and drop PNG files."
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
              <div className="text-5xl">🖼️</div>
              <h3 className="mt-4 text-xl font-bold text-white">
                Choose PNG files
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Single file or batch conversion supported
              </p>

              <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                Browse PNG Files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
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

                {/* Conversion Options */}
                <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">
                      JPEG Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>Smaller Size (50%)</span>
                      <span>Max Quality (100%)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300">
                      Background Fill (for transparency)
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded-lg border border-white/20 bg-transparent p-1"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBgColor("#ffffff")}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                            bgColor === "#ffffff"
                              ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                              : "border-white/10 bg-white/5 text-slate-400"
                          }`}
                        >
                          White
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgColor("#000000")}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                            bgColor === "#000000"
                              ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                              : "border-white/10 bg-white/5 text-slate-400"
                          }`}
                        >
                          Black
                        </button>
                      </div>
                    </div>
                  </div>
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
                  onClick={convertToJpg}
                  disabled={processing}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Converting to JPG..." : "Convert to JPG"}
                </button>
              </div>
            )}

            {message && convertedFiles.length === 0 && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {convertedFiles.length > 0 && (
            <ResultCard
              title="Your JPG is ready"
              description={message || "Conversion completed successfully."}
            >
              {convertedFiles.length === 1 ? (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                    <img
                      src={convertedFiles[0].previewUrl}
                      alt="Converted JPG"
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
                      <p className="text-xs text-slate-400">Original PNG</p>
                      <p className="mt-1 font-bold text-white">
                        {convertedFiles[0].originalSize.toFixed(1)} KB
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Converted JPG</p>
                      <p className="mt-1 font-bold text-emerald-400">
                        {convertedFiles[0].jpgSize.toFixed(1)} KB
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center">
                      <p className="text-xs text-emerald-300">Space Saved</p>
                      <p className="mt-1 font-bold text-emerald-400">
                        {convertedFiles[0].savedPercent > 0
                          ? `-${convertedFiles[0].savedPercent.toFixed(1)}%`
                          : "Optimized"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={convertedFiles[0].downloadUrl}
                    download={convertedFiles[0].name}
                    className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 text-center font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download JPG Image ↓
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
                          {item.jpgSize.toFixed(1)} KB •{" "}
                          <span className="text-emerald-400">
                            {item.savedPercent > 0
                              ? `-${item.savedPercent.toFixed(0)}%`
                              : "JPG"}
                          </span>
                        </p>
                        <a
                          href={item.downloadUrl}
                          download={item.name}
                          className="mt-3 block rounded-xl bg-white/10 py-2 text-center text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
                        >
                          Download JPG ↓
                        </a>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={downloadAllZip}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download All JPGs as ZIP (.zip) ↓
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={resetAll}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                Convert More PNGs
              </button>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Convert PNG to JPG</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload one or multiple PNG images.</li>
              <li>Optionally configure the background fill color and JPEG quality.</li>
              <li>Click &quot;Convert to JPG&quot; to process the files directly in your browser.</li>
              <li>Download your compressed JPG image or batch ZIP file.</li>
            </ol>
          </div>

          <RelatedTools current="/png-to-jpg" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
