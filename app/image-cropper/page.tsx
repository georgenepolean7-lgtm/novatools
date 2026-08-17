"use client";

import { ChangeEvent, useEffect, useRef, useState, useCallback } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type AspectRatio = "free" | "1:1" | "4:3" | "16:9" | "9:16" | "3:2" | "2:3";
type ExportFormat = "image/png" | "image/jpeg" | "image/webp";
type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // Normalized crop rectangle (0 to 1 range relative to image)
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/png");
  const quality = 0.92;

  // Result state
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{ width: number; height: number } | null>(null);

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mouse / Touch Dragging state
  const isDragging = useRef<"move" | "nw" | "ne" | "se" | "sw" | null>(null);
  const dragStart = useRef<{ mouseX: number; mouseY: number; initialCrop: typeof crop }>({
    mouseX: 0,
    mouseY: 0,
    initialCrop: crop,
  });

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [imageSrc, resultUrl]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    const url = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);

      // Default crop: centered 80%
      setCrop({
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8,
      });
      setAspectRatio("free");
    };
    img.src = url;

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFile(selectedFile);
    setImageSrc(url);
    setResultUrl(null);
    setResultSize(null);
    setResultDimensions(null);
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

    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    const url = URL.createObjectURL(droppedFile);
    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);
      setCrop({
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8,
      });
      setAspectRatio("free");
    };
    img.src = url;

    setRobotState("uploading");
    setTimeout(() => setRobotState("idle"), 1200);

    setFile(droppedFile);
    setImageSrc(url);
    setResultUrl(null);
    setResultSize(null);
    setResultDimensions(null);
    setMessage("");
  }

  const applyAspectRatio = useCallback(
    (ratio: AspectRatio) => {
      setAspectRatio(ratio);
      if (ratio === "free" || naturalWidth === 0 || naturalHeight === 0) return;

      let targetRatio = 1;
      if (ratio === "1:1") targetRatio = 1;
      else if (ratio === "4:3") targetRatio = 4 / 3;
      else if (ratio === "16:9") targetRatio = 16 / 9;
      else if (ratio === "9:16") targetRatio = 9 / 16;
      else if (ratio === "3:2") targetRatio = 3 / 2;
      else if (ratio === "2:3") targetRatio = 2 / 3;

      // Current natural aspect ratio
      const imgAspect = naturalWidth / naturalHeight;

      let newW = 0.8;
      let newH = (newW * imgAspect) / targetRatio;

      if (newH > 0.9) {
        newH = 0.8;
        newW = (newH * targetRatio) / imgAspect;
      }

      newW = Math.min(1, Math.max(0.1, newW));
      newH = Math.min(1, Math.max(0.1, newH));

      const newX = (1 - newW) / 2;
      const newY = (1 - newH) / 2;

      setCrop({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newW,
        height: newH,
      });
    },
    [naturalWidth, naturalHeight]
  );

  // Start Dragging/Resizing Handler
  const startDrag = (e: React.MouseEvent | React.TouchEvent, action: "move" | "nw" | "ne" | "se" | "sw") => {
    e.stopPropagation();
    isDragging.current = action;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragStart.current = {
      mouseX: clientX,
      mouseY: clientY,
      initialCrop: { ...crop },
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = (clientX - dragStart.current.mouseX) / rect.width;
      const deltaY = (clientY - dragStart.current.mouseY) / rect.height;

      const { initialCrop } = dragStart.current;

      setCrop(() => {
        let { x, y, width, height } = initialCrop;

        if (isDragging.current === "move") {
          x = Math.max(0, Math.min(1 - width, initialCrop.x + deltaX));
          y = Math.max(0, Math.min(1 - height, initialCrop.y + deltaY));
        } else if (isDragging.current === "se") {
          width = Math.max(0.05, Math.min(1 - x, initialCrop.width + deltaX));
          height = Math.max(0.05, Math.min(1 - y, initialCrop.height + deltaY));
        } else if (isDragging.current === "sw") {
          const maxLeft = initialCrop.x + initialCrop.width - 0.05;
          x = Math.max(0, Math.min(maxLeft, initialCrop.x + deltaX));
          width = initialCrop.width + (initialCrop.x - x);
          height = Math.max(0.05, Math.min(1 - y, initialCrop.height + deltaY));
        } else if (isDragging.current === "ne") {
          const maxTop = initialCrop.y + initialCrop.height - 0.05;
          y = Math.max(0, Math.min(maxTop, initialCrop.y + deltaY));
          height = initialCrop.height + (initialCrop.y - y);
          width = Math.max(0.05, Math.min(1 - x, initialCrop.width + deltaX));
        } else if (isDragging.current === "nw") {
          const maxLeft = initialCrop.x + initialCrop.width - 0.05;
          const maxTop = initialCrop.y + initialCrop.height - 0.05;
          x = Math.max(0, Math.min(maxLeft, initialCrop.x + deltaX));
          y = Math.max(0, Math.min(maxTop, initialCrop.y + deltaY));
          width = initialCrop.width + (initialCrop.x - x);
          height = initialCrop.height + (initialCrop.y - y);
        }

        return { x, y, width, height };
      });
    };

    const handleUp = () => {
      isDragging.current = null;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  async function cropImage() {
    if (!file || !imageSrc || naturalWidth === 0 || naturalHeight === 0) {
      setMessage("Please select an image first.");
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Cropping image...");

    try {
      const img = new Image();
      img.src = imageSrc;

      await new Promise<void>((resolve, reject) => {
        if (img.complete) resolve();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image."));
      });

      // Calculate actual pixel bounds on full natural image
      const sourceX = Math.round(crop.x * naturalWidth);
      const sourceY = Math.round(crop.y * naturalHeight);
      const sourceW = Math.max(1, Math.round(crop.width * naturalWidth));
      const sourceH = Math.max(1, Math.round(crop.height * naturalHeight));

      const canvas = document.createElement("canvas");
      canvas.width = sourceW;
      canvas.height = sourceH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context is not available.");
      }

      if (exportFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sourceW, sourceH);
      }

      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

      const blob = await new Promise<Blob | null>((resolve) => {
        if (exportFormat === "image/png") {
          canvas.toBlob((b) => resolve(b), "image/png");
        } else {
          canvas.toBlob((b) => resolve(b), exportFormat, quality);
        }
      });

      if (!blob) {
        throw new Error("Failed to export cropped image.");
      }

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size / 1024);
      setResultDimensions({ width: sourceW, height: sourceH });

      setRobotState("success");
      setMessage(`Image cropped successfully (${sourceW} × ${sourceH} px).`);
      setTimeout(() => setRobotState("idle"), 2500);
    } catch {
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      setMessage("An error occurred while cropping the image.");
    } finally {
      setProcessing(false);
    }
  }

  function resetAll() {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setImageSrc(null);
    setNaturalWidth(0);
    setNaturalHeight(0);
    setResultUrl(null);
    setResultSize(null);
    setResultDimensions(null);
    setMessage("");
    setProcessing(false);
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Pixel coordinates display
  const pixelW = Math.round(crop.width * naturalWidth);
  const pixelH = Math.round(crop.height * naturalHeight);

  return (
    <>
      <ToolSEO
        name="Image Cropper"
        path="/image-cropper"
        description="Crop images and photos online with preset aspect ratios (1:1, 4:3, 16:9, 9:16) and custom precision boxes. Free, fast and private."
        faqs={[
          {
            question: "How do I crop an image online?",
            answer:
              "Upload your photo, drag and adjust the crop rectangle (or choose an aspect ratio like 1:1 Square or 16:9), and click 'Crop Image'.",
          },
          {
            question: "Does cropping reduce image resolution?",
            answer:
              "Cropping extracts only your selected area at full original resolution with zero unnecessary quality compression.",
          },
          {
            question: "Can I crop for Instagram, YouTube, or Passport photos?",
            answer:
              "Yes. Use the 1:1 preset for profile avatars/Instagram posts, 16:9 for YouTube thumbnails, or 9:16 for Reels and TikTok.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="FREE IMAGE TOOL"
          title="Image Cropper"
          description="Crop photos with exact dimensions, custom rectangles, and popular aspect ratio presets."
        >
          <UploadCard
            title="Upload Photo to Crop"
            description="Select or drag and drop an image."
          >
            {!imageSrc ? (
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
                <div className="text-5xl">✂️</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Choose an image to crop
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
                {/* Aspect Ratio Preset Buttons */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300">
                      Aspect Ratio Presets
                    </label>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="text-xs text-slate-400 hover:text-rose-400"
                    >
                      Change Image
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { id: "free", label: "Free" },
                      { id: "1:1", label: "1:1 Square" },
                      { id: "4:3", label: "4:3 Standard" },
                      { id: "16:9", label: "16:9 Widescreen" },
                      { id: "9:16", label: "9:16 Story/Reel" },
                      { id: "3:2", label: "3:2 Photo" },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyAspectRatio(preset.id as AspectRatio)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                          aspectRatio === preset.id
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40 hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Crop Stage */}
                <div
                  ref={containerRef}
                  className="relative mx-auto select-none overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-2xl touch-none"
                  style={{ maxHeight: "480px" }}
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Crop preview"
                    className="mx-auto max-h-[480px] w-full object-contain pointer-events-none"
                  />

                  {/* Darkened overlay for non-crop areas */}
                  <div
                    className="absolute border-2 border-cyan-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move"
                    style={{
                      left: `${crop.x * 100}%`,
                      top: `${crop.y * 100}%`,
                      width: `${crop.width * 100}%`,
                      height: `${crop.height * 100}%`,
                    }}
                    onMouseDown={(e) => startDrag(e, "move")}
                    onTouchStart={(e) => startDrag(e, "move")}
                  >
                    {/* Rule of thirds grid lines */}
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40">
                      <div className="border-r border-b border-white/40" />
                      <div className="border-r border-b border-white/40" />
                      <div className="border-b border-white/40" />
                      <div className="border-r border-b border-white/40" />
                      <div className="border-r border-b border-white/40" />
                      <div className="border-b border-white/40" />
                      <div className="border-r border-white/40" />
                      <div className="border-r border-white/40" />
                      <div />
                    </div>

                    {/* Resize Handles */}
                    <div
                      onMouseDown={(e) => startDrag(e, "nw")}
                      onTouchStart={(e) => startDrag(e, "nw")}
                      className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-cyan-400 bg-white cursor-nwse-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => startDrag(e, "ne")}
                      onTouchStart={(e) => startDrag(e, "ne")}
                      className="absolute -right-2 -top-2 h-4 w-4 rounded-full border-2 border-cyan-400 bg-white cursor-nesw-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => startDrag(e, "se")}
                      onTouchStart={(e) => startDrag(e, "se")}
                      className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full border-2 border-cyan-400 bg-white cursor-nwse-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => startDrag(e, "sw")}
                      onTouchStart={(e) => startDrag(e, "sw")}
                      className="absolute -left-2 -bottom-2 h-4 w-4 rounded-full border-2 border-cyan-400 bg-white cursor-nesw-resize shadow-md"
                    />
                  </div>
                </div>

                {/* Pixel Dimension Info & Format Settings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">Crop Output Dimensions</p>
                    <p className="mt-1 text-lg font-bold text-cyan-300">
                      {pixelW} × {pixelH} px
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Original: {naturalWidth} × {naturalHeight} px
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <label className="block text-xs text-slate-400">Export Format</label>
                    <div className="mt-2 flex gap-2">
                      {[
                        { id: "image/png", label: "PNG" },
                        { id: "image/jpeg", label: "JPG" },
                        { id: "image/webp", label: "WebP" },
                      ].map((fmt) => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setExportFormat(fmt.id as ExportFormat)}
                          className={`flex-1 rounded-xl border py-1.5 text-xs font-semibold transition ${
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
                </div>

                <button
                  type="button"
                  onClick={cropImage}
                  disabled={processing}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Cropping Image..." : "✂️ Crop Image Now"}
                </button>
              </div>
            )}

            {message && !resultUrl && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {resultUrl && resultDimensions && (
            <ResultCard
              title="Your cropped image is ready"
              description={message || "Image crop completed successfully."}
            >
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                  <img
                    src={resultUrl}
                    alt="Cropped output"
                    className="mx-auto max-h-80 rounded-xl object-contain"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">Cropped Dimensions</p>
                    <p className="mt-1 font-bold text-white">
                      {resultDimensions.width} × {resultDimensions.height} px
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">Cropped Size</p>
                    <p className="mt-1 font-bold text-emerald-400">
                      {resultSize ? `${resultSize.toFixed(1)} KB` : "-"}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs text-slate-400">Format</p>
                    <p className="mt-1 font-bold text-cyan-300">
                      {exportFormat.replace("image/", "").toUpperCase()}
                    </p>
                  </div>
                </div>

                <a
                  href={resultUrl}
                  download={`novatools-cropped.${exportFormat.replace("image/", "").replace("jpeg", "jpg")}`}
                  className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 text-center font-bold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Download Cropped Image ↓
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (resultUrl) URL.revokeObjectURL(resultUrl);
                    setResultUrl(null);
                    setResultSize(null);
                    setResultDimensions(null);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                >
                  Adjust Crop
                </button>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Crop an Image Online</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your JPG, PNG, or WebP photo.</li>
              <li>Drag the crop handles or select an aspect ratio preset like 1:1 Square or 16:9.</li>
              <li>Choose your export format (PNG, JPG, or WebP).</li>
              <li>Click &quot;Crop Image Now&quot; and instantly download your cropped high-res photo.</li>
            </ol>
          </div>

          <RelatedTools current="/image-cropper" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
