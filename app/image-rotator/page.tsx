"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type ExportFormat = "image/png" | "image/jpeg" | "image/webp";
type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function ImageRotatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState(0);

  // Transformations
  const [rotationAngle, setRotationAngle] = useState(0); // in degrees
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/png");

  // Output
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [outputDims, setOutputDims] = useState<{ width: number; height: number } | null>(null);

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [previewSrc, downloadUrl]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (previewSrc) URL.revokeObjectURL(previewSrc);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    const url = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
    };
    img.src = url;

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFile(selectedFile);
    setPreviewSrc(url);
    setRotationAngle(0);
    setFlipH(false);
    setFlipV(false);
    setDownloadUrl(null);
    setOutputSize(null);
    setOutputDims(null);
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
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile || !droppedFile.type.startsWith("image/")) {
      setMessage("Please drop a valid image file.");
      return;
    }

    if (previewSrc) URL.revokeObjectURL(previewSrc);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    const url = URL.createObjectURL(droppedFile);
    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
    };
    img.src = url;

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFile(droppedFile);
    setPreviewSrc(url);
    setRotationAngle(0);
    setFlipH(false);
    setFlipV(false);
    setDownloadUrl(null);
    setOutputSize(null);
    setOutputDims(null);
    setMessage("");
  }

  // Draw preview canvas whenever transformations change
  useEffect(() => {
    if (!previewSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      const rad = (rotationAngle * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));

      // Calculate bounding box dimensions
      const boundW = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
      const boundH = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

      canvas.width = boundW;
      canvas.height = boundH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, boundW, boundH);
      ctx.save();
      ctx.translate(boundW / 2, boundH / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();
    };
    img.src = previewSrc;
  }, [previewSrc, rotationAngle, flipH, flipV]);

  const rotateBy = (deg: number) => {
    setRotationAngle((prev) => {
      const next = (prev + deg) % 360;
      return next < 0 ? next + 360 : next;
    });
  };

  async function processAndSave() {
    if (!file || !previewSrc || naturalWidth === 0) {
      setMessage("Please upload an image first.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Rendering transformed image...");

    try {
      const img = new Image();
      img.src = previewSrc;

      await new Promise<void>((resolve, reject) => {
        if (img.complete) resolve();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image."));
      });

      const rad = (rotationAngle * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));

      const boundW = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
      const boundH = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

      const canvas = document.createElement("canvas");
      canvas.width = boundW;
      canvas.height = boundH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context is not available.");
      }

      if (exportFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, boundW, boundH);
      }

      ctx.save();
      ctx.translate(boundW / 2, boundH / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), exportFormat, 0.95);
      });

      if (!blob) {
        throw new Error("Failed to render image.");
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputSize(blob.size / 1024);
      setOutputDims({ width: boundW, height: boundH });

      setRobotState("success");
      setMessage(`Image rotated successfully (${boundW} × ${boundH} px).`);
      setTimeout(() => setRobotState("idle"), 2500);
    } catch {
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      setMessage("An error occurred while processing the image.");
    } finally {
      setProcessing(false);
    }
  }

  function resetAll() {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setFile(null);
    setPreviewSrc(null);
    setNaturalWidth(0);
    setRotationAngle(0);
    setFlipH(false);
    setFlipV(false);
    setDownloadUrl(null);
    setOutputSize(null);
    setOutputDims(null);
    setMessage("");
    setProcessing(false);
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <ToolSEO
        name="Image Rotator"
        path="/image-rotator"
        description="Rotate images 90, 180, 270 degrees or arbitrary angles. Flip photos horizontally and vertically online for free with 100% privacy."
        faqs={[
          {
            question: "How do I rotate an image online?",
            answer:
              "Upload your JPG, PNG, or WebP photo, click the rotation buttons (90° CW, 90° CCW, 180°) or use the fine angle slider, and click 'Apply & Save'.",
          },
          {
            question: "Can I flip or mirror an image?",
            answer:
              "Yes! Click 'Flip Horizontal' to mirror an image left-to-right, or 'Flip Vertical' to invert it upside-down.",
          },
          {
            question: "Does rotating an image cause quality loss?",
            answer:
              "No. Standard 90°/180° rotations and flips are rendered with pixel-exact precision from the original source file.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE IMAGE TOOL"
          title="Image Rotator & Flipper"
          description="Rotate photos 90°, 180°, custom angles or mirror flip with live canvas preview."
        >
          <UploadCard
            title="Upload Photo to Rotate"
            description="Select or drag and drop an image file."
          >
            {!previewSrc ? (
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
                <div className="text-5xl">🔄</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Choose an image to rotate
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Supports JPG, PNG, WebP, GIF, BMP
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Browse Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Transform Action Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300">
                      Rotation & Flip Controls
                    </label>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="text-xs text-slate-400 hover:text-rose-400"
                    >
                      Change Image
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => rotateBy(-90)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:bg-cyan-500/10"
                    >
                      <span>↶</span> 90° Left
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateBy(90)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:bg-cyan-500/10"
                    >
                      <span>↷</span> 90° Right
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateBy(180)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:bg-cyan-500/10"
                    >
                      <span>↻</span> 180°
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRotationAngle(0);
                        setFlipH(false);
                        setFlipV(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-400 transition hover:text-white"
                    >
                      Reset Angles
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFlipH((prev) => !prev)}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                        flipH
                          ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                      }`}
                    >
                      <span>↔</span> Flip Horizontal {flipH && "✓"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipV((prev) => !prev)}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                        flipV
                          ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                      }`}
                    >
                      <span>↕</span> Flip Vertical {flipV && "✓"}
                    </button>
                  </div>

                  {/* Fine Angle Slider */}
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Fine Angle Tuning</span>
                      <span className="text-cyan-300">{rotationAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      className="mt-2 w-full accent-cyan-400"
                    />
                  </div>
                </div>

                {/* Live Canvas Preview */}
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 p-4 text-center shadow-inner">
                  <p className="mb-2 text-xs text-slate-500">Live Transformation Preview</p>
                  <canvas
                    ref={previewCanvasRef}
                    className="mx-auto max-h-80 w-auto rounded-xl object-contain shadow-md"
                  />
                </div>

                {/* Export Options */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-sm font-semibold text-slate-300">Export Format</span>
                  <div className="flex gap-2">
                    {[
                      { id: "image/png", label: "PNG" },
                      { id: "image/jpeg", label: "JPG" },
                      { id: "image/webp", label: "WebP" },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id as ExportFormat)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          exportFormat === fmt.id
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                            : "border-white/10 bg-white/5 text-slate-400"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={processAndSave}
                  disabled={processing}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Saving Transformed Image..." : "Apply & Generate Download"}
                </button>
              </div>
            )}

            {message && !downloadUrl && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {downloadUrl && outputDims && (
            <ResultCard
              title="Your rotated image is ready"
              description={message || "Transformation applied successfully."}
            >
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                  <img
                    src={downloadUrl}
                    alt="Transformed output"
                    className="mx-auto max-h-80 rounded-xl object-contain"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">Resolution</p>
                    <p className="mt-1 font-bold text-white">
                      {outputDims.width} × {outputDims.height} px
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">File Size</p>
                    <p className="mt-1 font-bold text-emerald-400">
                      {outputSize ? `${outputSize.toFixed(1)} KB` : "-"}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">Rotation Applied</p>
                    <p className="mt-1 font-bold text-cyan-300">
                      {rotationAngle}° {flipH ? "• Flipped" : ""}
                    </p>
                  </div>
                </div>

                <a
                  href={downloadUrl}
                  download={`novatools-rotated.${exportFormat.replace("image/", "").replace("jpeg", "jpg")}`}
                  className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 text-center font-bold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Download Rotated Image ↓
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
                    setDownloadUrl(null);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                >
                  Make Further Adjustments
                </button>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Rotate an Image Online</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your JPG, PNG, or WebP photo.</li>
              <li>Click 90° Left, 90° Right, or 180°, or use the fine angle slider.</li>
              <li>Optionally flip horizontally or vertically for a mirror effect.</li>
              <li>Click &quot;Apply &amp; Generate Download&quot; to download your rotated image.</li>
            </ol>
          </div>

          <RelatedTools current="/image-rotator" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
