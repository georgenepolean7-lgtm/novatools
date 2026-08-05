"use client";

import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import { ChangeEvent, useEffect, useState } from "react";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [finalSize, setFinalSize] = useState<number | null>(null);
const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
const [robotState, setRobotState] = useState<
  "idle" |
  "uploading" |
  "processing" |
  "success" |
  "error"
>("idle");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [previewUrl, downloadUrl]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    const url = URL.createObjectURL(selectedFile);
    const image = new Image();

    image.onload = () => {
      setRobotState("uploading");

setTimeout(() => {
  setRobotState("idle");
}, 1200);

      setFile(selectedFile);
      setPreviewUrl(url);

      setOriginalWidth(image.naturalWidth);
      setOriginalHeight(image.naturalHeight);

      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);

      setDownloadUrl(null);
      setFinalSize(null);
      setMessage("");
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      setMessage("Could not read this image.");
    };

    image.src = url;
  }

  function changeWidth(value: number) {
    const newWidth = Math.max(1, value || 1);

    setWidth(newWidth);

    if (lockRatio && originalWidth && originalHeight) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.max(1, Math.round(newWidth * ratio)));
    }
  }

  function changeHeight(value: number) {
    const newHeight = Math.max(1, value || 1);

    setHeight(newHeight);

    if (lockRatio && originalWidth && originalHeight) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.max(1, Math.round(newHeight * ratio)));
    }
  }

  async function resizeImage() {
    if (!file || !previewUrl) {
      setMessage("Please select an image first.");
      return;
    }

    if (width <= 0 || height <= 0) {
      setMessage("Please enter valid width and height.");
      return;
    }

    setProcessing(true);

    setRobotState("processing");
    setMessage("");

    try {
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Image load failed."));
        image.src = previewUrl;
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas not supported.");
      }

      canvas.width = width;
      canvas.height = height;

      if (format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(image, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          format === "png" ? "image/png" : "image/jpeg",
          format === "jpeg" ? 0.92 : undefined
        );
      });

      if (!blob) throw new Error("Resize failed.");

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      const resultUrl = URL.createObjectURL(blob);

      setDownloadUrl(resultUrl);
      setFinalSize(blob.size / 1024);
setRobotState("success");

setTimeout(() => {
  setRobotState("idle");
}, 2500);

      setMessage("Image resized successfully.");
    } catch (error) {
  console.error(error);

  setRobotState("error");

  setTimeout(() => {
    setRobotState("idle");
  }, 2500);

  setMessage("Something went wrong while resizing.");
    } finally {
      setProcessing(false);
    }
  }
   return (
    <>
    <ToolSEO
  name="Image Resizer"
  path="/image-resizer"
  description="Resize JPG and PNG images online for free."
  faqs={[
    {
      question: "How do I resize an image?",
      answer:
        "Upload your image, enter the required width and height, then click Resize Image.",
    },
    {
      question: "Can I keep the original aspect ratio?",
      answer:
        "Yes. Enable Keep Original Aspect Ratio to avoid image distortion.",
    },
    {
      question: "Is Image Resizer free?",
      answer:
        "Yes. Nova Tools lets you resize images online for free.",
    },
    {
      question: "Are my images secure?",
      answer:
        "Your uploaded images are processed securely and are not permanently stored.",
    },
  ]}
/>

<main className="min-h-screen bg-[#030712] text-white">
      <SiteHeader />

      <ToolLayout
        badge="FREE IMAGE TOOL"
        title="Image Resizer"
        description="Resize your images instantly while maintaining the best possible quality."
      >
        <UploadCard
          title="Upload Image"
          description="Upload a JPG or PNG image to resize."
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
      target: {
        files: [droppedFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleFile(event);
  }}
  className={`block cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center backdrop-blur-xl transition-all duration-300 ${
    dragActive
      ? "scale-[1.02] border-cyan-400 bg-cyan-500/10"
      : "border-cyan-500/30 bg-white/5 hover:border-cyan-400"
  }`}

>
            <div className="text-5xl">🖼️</div>

            <div className="mt-4 text-2xl font-bold">
              Choose an Image
            </div>

            <div className="mt-2 text-slate-400">
              JPG, PNG, WEBP Supported
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {file && previewUrl && (
            <>
                          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-80 rounded-2xl object-contain"
                />

                <div className="mt-5 text-center">
                  <h3 className="text-xl font-bold text-white">
                    {file.name}
                  </h3>

                  <p className="mt-2 text-slate-400">
                    Original Size : {originalWidth} × {originalHeight} px
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block font-semibold text-slate-300">
                    Width
                  </label>

                  <div className="flex items-center rounded-2xl border border-cyan-500/30 bg-white/5 px-4 backdrop-blur-lg">
                    <input
                      type="number"
                      min="1"
                      value={width}
                      onChange={(e) =>
                        changeWidth(Number(e.target.value))
                      }
                      className="w-full bg-transparent py-4 outline-none"
                    />

                    <span className="text-cyan-300">px</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-300">
                    Height
                  </label>

                  <div className="flex items-center rounded-2xl border border-cyan-500/30 bg-white/5 px-4 backdrop-blur-lg">
                    <input
                      type="number"
                      min="1"
                      value={height}
                      onChange={(e) =>
                        changeHeight(Number(e.target.value))
                      }
                      className="w-full bg-transparent py-4 outline-none"
                    />

                    <span className="text-cyan-300">px</span>
                  </div>
                </div>

                
              </div>

                            <label className="mt-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="h-5 w-5 accent-cyan-400"
                />

                <span className="font-medium text-slate-300">
                  Keep Original Aspect Ratio
                </span>
              </label>

              <div className="mt-8">
                <p className="mb-4 font-semibold text-slate-300">
                  Output Format
                </p>

                <div className="grid grid-cols-2 gap-4">

                  <button
                    type="button"
                    onClick={() => setFormat("jpeg")}
                    className={`rounded-2xl border py-4 font-bold transition ${
                      format === "jpeg"
                        ? "border-cyan-400 bg-cyan-500 text-black shadow-lg shadow-cyan-500/40"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    JPG
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat("png")}
                    className={`rounded-2xl border py-4 font-bold transition ${
                      format === "png"
                        ? "border-cyan-400 bg-cyan-500 text-black shadow-lg shadow-cyan-500/40"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    PNG
                  </button>

                </div>
              </div>

              <button
                onClick={resizeImage}
                disabled={processing}
                className="mt-8 w-full rounded-2xl bg-cyan-500 px-6 py-4 text-lg font-bold text-black transition hover:scale-[1.02] hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? "Resizing..." : "Resize Image"}
              </button>

              {message && (
                <p className="mt-5 text-center text-cyan-300">
                  {message}
                </p>
              )}

             {downloadUrl && (
  <ResultCard
    title="Image Ready"
    description="Your resized image has been generated successfully."
  >
    <div className="mb-8 grid gap-6 lg:grid-cols-2">

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <p className="mb-4 text-center font-semibold text-slate-300">
          Original Image
        </p>

        <img
          src={previewUrl ?? ""}
          alt="Original"
          className="h-72 w-full rounded-2xl bg-black/20 object-contain"
        />
      </div>

      <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 p-5 backdrop-blur-xl">
        <p className="mb-4 text-center font-semibold text-emerald-300">
          Resized Image
        </p>

        <img
          src={downloadUrl}
          alt="Resized"
          className="h-72 w-full rounded-2xl bg-black/20 object-contain"
        />
      </div>

    </div>

    <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

      <h3 className="mb-6 text-center text-xl font-bold text-cyan-300">
        Image Information
      </h3>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <div>
          <p className="text-xs uppercase text-slate-500">
            File Name
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-white">
            {file?.name}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500">
            Original Size
          </p>

          <p className="mt-1 font-semibold text-white">
            {originalWidth} × {originalHeight}px
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500">
            Resized
          </p>

          <p className="mt-1 font-semibold text-emerald-300">
            {width} × {height}px
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500">
            Format
          </p>

          <p className="mt-1 font-semibold text-white">
            {format.toUpperCase()}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-500">
            Output Size
          </p>

          <p className="mt-1 font-semibold text-cyan-300">
            {finalSize?.toFixed(2)} KB
          </p>
        </div>

      </div>

    </div>

    <div className="space-y-4">

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">

        <p className="text-lg font-bold text-white">
          {width} × {height}px
        </p>
<div className="mb-5 flex justify-center">
  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300">
    ✅ Image Ready
  </span>
</div>

        <p className="mt-2 text-emerald-300">
          Resize Completed Successfully
        </p>

      </div>

      <a
        href={downloadUrl}
        download={`novatools-resized.${format === "png" ? "png" : "jpg"}`}
        className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
      >
        ⬇ Download Image
      </a>

      <button
        onClick={() => {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          if (downloadUrl) URL.revokeObjectURL(downloadUrl);

          setFile(null);
          setPreviewUrl(null);
          setDownloadUrl(null);

          setOriginalWidth(0);
          setOriginalHeight(0);

          setWidth(0);
          setHeight(0);

          setFinalSize(null);
          setMessage("");

          setFormat("jpeg");
          setLockRatio(true);
        }}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
      >
        🔄 Resize Another Image
      </button>

    </div>

  </ResultCard>
)}

            </>
          )}
        </UploadCard>

<div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h2 className="text-3xl font-bold text-white">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-6">

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is this image resizer free?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. Resize JPG and PNG images online without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can I keep the original aspect ratio?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. Enable the aspect ratio option to resize images without stretching.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Are my images secure?
      </h3>

      <p className="mt-2 text-slate-300">
        Your uploaded images are processed securely and are not permanently stored.
      </p>
    </div>

  </div>

</div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-bold">
            How to Resize an Image
          </h2>

          <div className="mt-6 space-y-4 text-slate-300">

            <p>1. Upload your JPG or PNG image.</p>

            <p>2. Enter the required Width or Height.</p>

            <p>3. Keep Aspect Ratio enabled for best quality.</p>

            <p>4. Select JPG or PNG output.</p>

            <p>5. Click <strong>Resize Image</strong>.</p>

            <p>6. Download your resized image.</p>

          </div>
        </div>

      </ToolLayout>
<RelatedTools current="/image-resizer" />
      <SiteFooter />
      <NovaAssistant
  state={robotState}
/>
    </main>
    </>
  );
}