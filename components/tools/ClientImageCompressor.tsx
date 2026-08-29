"use client";

import React, { ChangeEvent, useState } from "react";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import { ShieldCheck, Zap, Sparkles, Image as ImageIcon, Sliders, ArrowDown } from "lucide-react";

interface ClientImageCompressorProps {
  initialTargetKB?: number;
  toolTitle?: string;
}

export default function ClientImageCompressor({
  initialTargetKB = 100,
  toolTitle = "Compress Image",
}: ClientImageCompressorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState(initialTargetKB);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{
    width: number;
    height: number;
    format: string;
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size / 1024);
    setCompressedSize(null);
    setDownloadUrl(null);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const img = new Image();
    img.onload = () => {
      setImageInfo({
        width: img.width,
        height: img.height,
        format: selectedFile.type.split("/")[1]?.toUpperCase() || "IMAGE",
      });
    };
    img.src = URL.createObjectURL(selectedFile);
    setMessage("");
  }

  async function compressImage() {
    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    if (targetKB <= 0) {
      setMessage("Please enter a valid target size (greater than 0 KB).");
      return;
    }

    setProcessing(true);
    setMessage("");
    setDownloadUrl(null);

    try {
      const image = new Image();
      const imageUrl = URL.createObjectURL(file);
      image.src = imageUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not load image."));
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("HTML5 Canvas is not supported in this browser.");

      let width = image.width;
      let height = image.height;
      const maxDimension = 2500;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      const targetBytes = targetKB * 1024;
      let blob: Blob | null = null;

      async function createBlob(sourceCanvas: HTMLCanvasElement, qualityValue: number) {
        return new Promise<Blob | null>((resolve) => {
          sourceCanvas.toBlob(
            (result) => resolve(result),
            "image/jpeg",
            qualityValue
          );
        });
      }

      let workingCanvas = canvas;
      let finalWidth = width;
      let finalHeight = height;

      for (let resizeAttempt = 0; resizeAttempt < 12; resizeAttempt++) {
        let low = 0.55;
        let high = 1.0;
        let bestBlob: Blob | null = null;

        for (let i = 0; i < 14; i++) {
          const qualityValue = (low + high) / 2;
          const testBlob = await createBlob(workingCanvas, qualityValue);

          if (!testBlob) break;

          if (testBlob.size <= targetBytes) {
            bestBlob = testBlob;
            low = qualityValue;
          } else {
            high = qualityValue;
          }
        }

        if (bestBlob) {
          blob = bestBlob;
          if (bestBlob.size >= targetBytes * 0.9) break;

          const maxQBlob = await createBlob(workingCanvas, 1);
          if (maxQBlob && maxQBlob.size <= targetBytes) {
            blob = maxQBlob;
            break;
          }
        }

        // Downsample dimensions slightly if quality alone cannot achieve target KB
        finalWidth = Math.max(1, Math.round(workingCanvas.width * 0.92));
        finalHeight = Math.max(1, Math.round(workingCanvas.height * 0.92));

        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        if (!resizedCtx) break;

        resizedCanvas.width = finalWidth;
        resizedCanvas.height = finalHeight;
        resizedCtx.fillStyle = "#ffffff";
        resizedCtx.fillRect(0, 0, finalWidth, finalHeight);
        resizedCtx.drawImage(workingCanvas, 0, 0, finalWidth, finalHeight);

        workingCanvas = resizedCanvas;
      }

      if (!blob) throw new Error("Compression failed to produce a valid image.");

      const url = URL.createObjectURL(blob);
      setCompressedSize(blob.size / 1024);
      setDownloadUrl(url);

      const finalKB = blob.size / 1024;
      if (finalKB <= targetKB) {
        setMessage(`Image successfully optimized to ${finalKB.toFixed(2)} KB.`);
      } else {
        setMessage(`Best achievable size was ${finalKB.toFixed(2)} KB. To compress further, select a smaller pixel dimension.`);
      }

      URL.revokeObjectURL(imageUrl);
    } catch {
      setMessage("An error occurred during compression. Please check that your image file is intact.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Guarantees Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>100% In-Browser Privacy (Zero Uploads)</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Zap className="w-4 h-4" />
          <span>Hardware-Accelerated Canvas</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Target Size: ~{targetKB} KB</span>
        </div>
      </div>

      <UploadCard
        title={`Select Image for ${toolTitle}`}
        description="Supports JPG, PNG, and WebP formats. Processed entirely on your device."
      >
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const droppedFile = e.dataTransfer.files[0];
            if (!droppedFile) return;
            const event = {
              target: { files: [droppedFile] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFile(event);
          }}
          className={`group block cursor-pointer rounded-3xl border border-dashed p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
              : "border-slate-700 bg-slate-900/40 hover:border-cyan-400/60 hover:bg-slate-900/80"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl transition duration-300 group-hover:scale-110">
            <ImageIcon className="w-7 h-7 text-cyan-400" />
          </div>

          <p className="mt-4 text-base font-bold text-white">
            Select or drag your image here
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Click to browse files from your computer or phone
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-white text-sm">
                {file.name}
              </p>
              {originalSize !== null && (
                <p className="text-xs text-slate-400">
                  Original: {originalSize.toFixed(2)} KB {imageInfo ? `(${imageInfo.width}×${imageInfo.height} px, ${imageInfo.format})` : ""}
                </p>
              )}
            </div>

            <div className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
          </div>
        )}

        {/* Target KB Selector */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target File Size</span>
            </label>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-0.5 text-xs font-mono font-bold text-cyan-300">
              {targetKB} KB
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[20, 50, 100, 200].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTargetKB(size)}
                className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                  targetKB === size
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                {size} KB
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 focus-within:border-cyan-500">
            <span className="text-xs text-slate-500 mr-3">Custom Target:</span>
            <input
              type="number"
              min="1"
              max="5000"
              value={targetKB}
              onChange={(e) => setTargetKB(Number(e.target.value))}
              className="w-full bg-transparent py-3 text-sm text-white outline-none font-mono"
            />
            <span className="text-xs font-mono text-slate-500">KB</span>
          </div>
        </div>

        <button
          onClick={compressImage}
          disabled={!file || processing}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-4 font-bold text-white text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Compressing...
            </span>
          ) : (
            `Compress Image to ~${targetKB} KB`
          )}
        </button>

        {message && compressedSize === null && (
          <p className="mt-4 text-center text-xs text-slate-400">{message}</p>
        )}
      </UploadCard>

      {/* Results Box */}
      {compressedSize !== null && (
        <ResultCard
          title="Optimization Complete"
          description={message || "Your image has been optimized."}
        >
          {previewUrl && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 text-center">Original Image</p>
                <img
                  src={previewUrl}
                  alt="Original Preview"
                  className="h-48 w-full rounded-xl object-contain bg-black/40"
                />
                <p className="text-center text-xs text-slate-400 font-mono">
                  {originalSize?.toFixed(2)} KB
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                <p className="text-xs font-semibold text-emerald-300 text-center">Compressed Output</p>
                <img
                  src={downloadUrl || ""}
                  alt="Compressed Preview"
                  className="h-48 w-full rounded-xl object-contain bg-black/40"
                />
                <p className="text-center text-xs text-emerald-300 font-mono font-bold">
                  {compressedSize.toFixed(2)} KB
                  {originalSize && (
                    <span className="ml-2 text-cyan-400 font-normal">
                      ({(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}% smaller)
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`novatools-${targetKB}kb-${file?.name?.replace(/\.[^/.]+$/, "") || "image"}.jpg`}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowDown className="w-4 h-4" />
              <span>Download Compressed Image ({compressedSize.toFixed(2)} KB)</span>
            </a>
          )}
        </ResultCard>
      )}
    </div>
  );
}
