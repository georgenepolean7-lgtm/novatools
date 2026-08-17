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

export default function JpgToPngPage() {
  const [files, setFiles] = useState<File[]>([]);
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

    const validFiles = selected.filter(
      (f) =>
        f.type === "image/jpeg" ||
        f.type === "image/jpg" ||
        f.name.toLowerCase().endsWith(".jpg") ||
        f.name.toLowerCase().endsWith(".jpeg")
    );

    if (validFiles.length === 0) {
      setMessage("Please select valid JPG or JPEG image files.");
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
        f.type === "image/jpeg" ||
        f.type === "image/jpg" ||
        f.name.toLowerCase().endsWith(".jpg") ||
        f.name.toLowerCase().endsWith(".jpeg")
    );

    if (valid.length === 0) {
      setMessage("Please drop JPG or JPEG image files.");
      return;
    }

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFiles(valid);
    setConvertedFiles([]);
    setMessage("");
  }

  async function convertToPng() {
    if (files.length === 0) {
      setMessage("Please select at least one JPG image.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Converting images to PNG...");

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

        ctx.drawImage(image, 0, 0);

        const pngBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/png");
        });

        URL.revokeObjectURL(objectUrl);

        if (!pngBlob) {
          throw new Error("Could not create PNG image.");
        }

        const downloadUrl = URL.createObjectURL(pngBlob);
        const originalName = file.name.replace(/\.[^/.]+$/, "");

        results.push({
          name: `${originalName}.png`,
          originalSize: file.size / 1024,
          pngSize: pngBlob.size / 1024,
          previewUrl: downloadUrl,
          downloadUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      }

      setConvertedFiles(results);
      setRobotState("success");
      setMessage(
        `Successfully converted ${results.length} image${
          results.length > 1 ? "s" : ""
        } to PNG.`
      );

      setTimeout(() => setRobotState("idle"), 2500);
    } catch {
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      setMessage("An error occurred while converting the image(s) to PNG.");
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
    saveAs(zipBlob, "novatools-converted-png.zip");
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
        name="JPG to PNG Converter"
        path="/jpg-to-png"
        description="Convert JPG and JPEG images to lossless high quality PNG format online for free."
        faqs={[
          {
            question: "How do I convert JPG to PNG?",
            answer:
              "Upload your JPG or JPEG image, click 'Convert to PNG', and download your converted high-quality PNG file instantly.",
          },
          {
            question: "Is this JPG to PNG converter free?",
            answer:
              "Yes. Nova Tools provides completely free in-browser image conversion with zero registration required.",
          },
          {
            question: "Can I convert multiple JPG images at once?",
            answer:
              "Yes. You can select or drop multiple JPG files and download them individually or as a single ZIP archive.",
          },
          {
            question: "Are my images uploaded to any server?",
            answer:
              "No. All image processing runs 100% locally inside your browser, ensuring total privacy and security.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="FREE IMAGE TOOL"
          title="JPG to PNG Converter"
          description="Convert JPG and JPEG images to clean, lossless PNG format in seconds."
        >
          <UploadCard
            title="Upload JPG Images"
            description="Select or drag and drop JPG or JPEG files."
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
                Choose JPG or JPEG files
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Supports single or batch file selection
              </p>

              <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                Browse Files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg"
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

                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-2">
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
                  onClick={convertToPng}
                  disabled={processing}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Converting to PNG..." : "Convert to PNG"}
                </button>
              </div>
            )}

            {message && convertedFiles.length === 0 && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {convertedFiles.length > 0 && (
            <ResultCard
              title="Your PNG is ready"
              description={message || "Conversion completed successfully."}
            >
              {convertedFiles.length === 1 ? (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                    <img
                      src={convertedFiles[0].previewUrl}
                      alt="Converted PNG"
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
                      <p className="text-xs text-slate-400">Original JPG</p>
                      <p className="mt-1 font-bold text-white">
                        {convertedFiles[0].originalSize.toFixed(1)} KB
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Converted PNG</p>
                      <p className="mt-1 font-bold text-emerald-400">
                        {convertedFiles[0].pngSize.toFixed(1)} KB
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xs text-slate-400">Format</p>
                      <p className="mt-1 font-bold text-cyan-300">Lossless PNG</p>
                    </div>
                  </div>

                  <a
                    href={convertedFiles[0].downloadUrl}
                    download={convertedFiles[0].name}
                    className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 text-center font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download PNG Image ↓
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
                          {item.pngSize.toFixed(1)} KB • {item.width}×{item.height}
                        </p>
                        <a
                          href={item.downloadUrl}
                          download={item.name}
                          className="mt-3 block rounded-xl bg-white/10 py-2 text-center text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
                        >
                          Download PNG ↓
                        </a>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={downloadAllZip}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Download All PNGs as ZIP (.zip) ↓
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
            <h2 className="text-2xl font-bold text-white">How to Convert JPG to PNG</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload one or more JPG or JPEG images from your device.</li>
              <li>Click the &quot;Convert to PNG&quot; button to begin processing.</li>
              <li>Preview the converted lossless PNG files with dimension & size details.</li>
              <li>Download your converted PNG file or download all as a ZIP archive.</li>
            </ol>

            <h2 className="mt-8 text-2xl font-bold text-white">Why Convert JPG to PNG?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="font-semibold text-cyan-300">Lossless Quality</h3>
                <p className="mt-1 text-sm text-slate-400">
                  PNG format does not lose quality upon repeated saving, ideal for graphics and illustrations.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="font-semibold text-cyan-300">Sharp Text & Lines</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Avoid JPEG compression artifacts around text, logos, and high-contrast lines.
                </p>
              </div>
            </div>
          </div>

          <RelatedTools current="/jpg-to-png" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
