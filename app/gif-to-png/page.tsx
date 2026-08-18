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
  pngSize: number;
  previewUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
};

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function GifToPngPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
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
    const validGifs = incomingFiles.filter(
      (f) => f.type === "image/gif" || f.name.toLowerCase().endsWith(".gif")
    );

    if (validGifs.length === 0) {
      setMessage("Please select valid GIF image files (.gif).");
      return;
    }

    setFiles(validGifs);
    setConvertedFiles([]);
    setMessage("");
    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);
  }

  async function convertGifsToPng() {
    if (files.length === 0) return;

    setProcessing(true);
    setRobotState("processing");
    setMessage("Extracting high-resolution PNG frames...");

    const results: ConvertedFile[] = [];

    try {
      for (const file of files) {
        const item = await convertSingleGif(file);
        results.push(item);
      }

      setConvertedFiles(results);
      setProcessing(false);
      setRobotState("success");
      setMessage(
        `Successfully converted ${results.length} GIF file${
          results.length > 1 ? "s" : ""
        } to PNG!`
      );
      setTimeout(() => setRobotState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to convert GIF to PNG. Please verify the file is not corrupted.");
      setTimeout(() => setRobotState("idle"), 2500);
    }
  }

  function convertSingleGif(file: File): Promise<ConvertedFile> {
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

        // Draw GIF frame onto transparent canvas
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            URL.revokeObjectURL(url);
            reject(new Error("PNG blob generation failed"));
            return;
          }

          const downloadUrl = URL.createObjectURL(blob);
          const baseName = file.name.replace(/\.[^/.]+$/, "");

          resolve({
            name: `${baseName}.png`,
            originalSize: file.size,
            pngSize: blob.size,
            previewUrl: url,
            downloadUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }, "image/png");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load GIF image: ${file.name}`));
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
    saveAs(zipBlob, "novatools-converted-pngs.zip");
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
        name="GIF to PNG Converter"
        path="/gif-to-png"
        description="Convert static and animated GIF images into crystal-clear lossless PNG format online. 100% private in-browser image extraction with ZIP export."
        faqs={[
          {
            question: "How does GIF to PNG conversion work?",
            answer:
              "The converter reads your GIF into an in-memory canvas and re-encodes the image into a high-depth 32-bit lossless PNG with full alpha transparency support.",
          },
          {
            question: "What happens with animated GIFs?",
            answer:
              "The browser canvas renders the primary frame of the animated GIF and exports it into a crisp, static, high-resolution PNG image.",
          },
          {
            question: "Can I convert multiple GIF files at once?",
            answer:
              "Yes! You can select multiple GIFs in batch mode and download all converted PNG files individually or as a combined ZIP archive.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE IMAGE CONVERTER"
          title="GIF to PNG Converter"
          description="Extract clean, lossless PNG images from static and animated GIF files."
        >
          <UploadCard
            title="Upload GIF Files"
            description="Select or drop one or multiple .gif files to convert."
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
                <div className="text-5xl">🎬</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop GIF files here
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Single or batch upload supported (.gif)
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Browse GIF Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/gif,.gif"
                    onChange={handleFiles}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-300">
                    {files.length} GIF File{files.length > 1 ? "s" : ""} Selected
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
                  <ul className="max-h-40 space-y-2 overflow-y-auto text-xs text-slate-300">
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

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-cyan-200">
                  💡 Note: For animated GIFs, the key frame is extracted and encoded into a clean, lossless PNG graphic with transparency.
                </div>

                <button
                  type="button"
                  disabled={processing}
                  onClick={convertGifsToPng}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing
                    ? "Converting to PNG..."
                    : `Convert ${files.length} GIF${files.length > 1 ? "s" : ""} to PNG`}
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
              description="Your GIF images have been converted to high-definition PNG files."
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
                            {item.width}×{item.height} px • {(item.pngSize / 1024).toFixed(1)} KB
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
            <h2 className="text-2xl font-bold text-white">How to Convert GIF to PNG</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload one or multiple GIF files.</li>
              <li>Click &quot;Convert to PNG&quot; to process the files inside your browser.</li>
              <li>Preview the converted lossless PNG graphics.</li>
              <li>Download individual PNG files or download all files as a ZIP archive.</li>
            </ol>
          </div>

          <RelatedTools current="/gif-to-png" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
