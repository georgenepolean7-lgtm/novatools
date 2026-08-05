"use client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ChangeEvent, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";

export default function CompressImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState(50);
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
const [robotState, setRobotState] = useState<
  "idle" |
  "uploading" |
  "processing" |
  "success" |
  "error"
>("idle");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
setRobotState("uploading");

setTimeout(() => {
  setRobotState("idle");
}, 1200);

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
    format:
      selectedFile.type.split("/")[1].toUpperCase(),
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
      setMessage("Please enter a valid target size.");
      return;
    }

    setProcessing(true);

    setRobotState("processing");

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

      if (!ctx) {
        throw new Error("Canvas is not supported.");
      }

      let width = image.width;
      let height = image.height;

      const maxDimension = 2500;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(
          maxDimension / width,
          maxDimension / height
        );

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      const targetBytes = targetKB * 1024;

      let quality = 0.92;
      let blob: Blob | null = null;

// Try to get as close as possible to the target size
// while keeping the highest possible image quality.
async function createBlob(
  sourceCanvas: HTMLCanvasElement,
  qualityValue: number
) {
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
  let high = 1;
  let bestBlob: Blob | null = null;

  // Binary search finds the highest quality
  // that stays under the requested KB size.
  for (let i = 0; i < 14; i++) {
    const qualityValue = (low + high) / 2;

    const testBlob = await createBlob(
      workingCanvas,
      qualityValue
    );

    if (!testBlob) {
      break;
    }

    if (testBlob.size <= targetBytes) {
      bestBlob = testBlob;
      low = qualityValue;
    } else {
      high = qualityValue;
    }
  }

  if (bestBlob) {
    blob = bestBlob;

    // If we are reasonably close to the target,
    // use this result.
    if (bestBlob.size >= targetBytes * 0.9) {
      break;
    }

    // Even maximum quality is far below target.
    // This is already the best useful result.
    const maximumQualityBlob = await createBlob(
      workingCanvas,
      1
    );

    if (
      maximumQualityBlob &&
      maximumQualityBlob.size <= targetBytes
    ) {
      blob = maximumQualityBlob;
      break;
    }
  }

  // Quality reduction alone was not enough.
  // Reduce dimensions slightly and try again.
  finalWidth = Math.max(
    1,
    Math.round(workingCanvas.width * 0.94)
  );

  finalHeight = Math.max(
    1,
    Math.round(workingCanvas.width * 0.94)
  );

  const resizedCanvas = document.createElement("canvas");
  const resizedContext = resizedCanvas.getContext("2d");

  if (!resizedContext) {
    break;
  }

  resizedCanvas.width = finalWidth;
  resizedCanvas.height = finalHeight;

  resizedContext.fillStyle = "#ffffff";
  resizedContext.fillRect(
    0,
    0,
    finalWidth,
    finalHeight
  );

  resizedContext.drawImage(
    workingCanvas,
    0,
    0,
    finalWidth,
    finalHeight
  );

  workingCanvas = resizedCanvas;
}

if (!blob) {
  throw new Error("Compression failed.");
}

const url = URL.createObjectURL(blob);

setCompressedSize(blob.size / 1024);
setDownloadUrl(url);

setRobotState("success");

setTimeout(() => {
  setRobotState("idle");
}, 2500);

const finalKB = blob.size / 1024;

if (finalKB <= targetKB) {
  setMessage(
    `Image compressed successfully to ${finalKB.toFixed(2)} KB.`
  );
} else {
  setMessage(
    "Could not reach the requested size. Please try a slightly larger target."
  );
}

      URL.revokeObjectURL(imageUrl);
    } catch {
 setRobotState("error");

setTimeout(() => {
  setRobotState("idle");
}, 2500);

      setMessage("Something went wrong while compressing the image.");
    } finally {
      setProcessing(false);
    }
  }

  return (
       <>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I compress an image to 20KB or 50KB?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your image, choose the target file size such as 20KB, 50KB or 100KB, then compress and download the optimized image.",
          },
        },
        {
          "@type": "Question",
          name: "Is this image compressor free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Nova Tools lets you compress images online for free.",
          },
        },
        {
          "@type": "Question",
          name: "Which image formats are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JPG, JPEG, PNG and other common image formats are supported.",
          },
        },
        {
          "@type": "Question",
          name: "Are my images secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Images are processed in your browser and are not permanently stored.",
          },
        },
      ],
    }),
  }}
/>
  <main className="min-h-screen bg-slate-950 text-white">
 

    <SiteHeader />

    <ToolLayout
      badge="Free Online Image Tool"
      title="Compress Image to Exact KB"
      description="Reduce JPG, PNG and other supported images to the size you need for online forms, applications and document uploads."
    >
      <UploadCard
        title="Choose your image"
        description="Upload a JPG, PNG or other supported image format."
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
  className={`group block cursor-pointer rounded-3xl border border-dashed p-8 text-center transition-all duration-300 sm:p-10 ${
    dragActive
      ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"
      : "border-blue-400/30 bg-blue-500/5 hover:border-cyan-400/60 hover:bg-blue-500/10"
  }`}
>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl transition duration-300 group-hover:scale-110">
            🖼️
          </div>

          <p className="mt-4 text-lg font-bold text-white">
            Select an image
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Click here to browse your device
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
              🖼️
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {file.name}
              </p>

              {originalSize !== null && (
                <p className="mt-1 text-sm text-slate-400">
                  Original size: {originalSize.toFixed(2)} KB
                </p>
              )}
            </div>

            <div className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
          </div>
        )}

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-white">
              Target size
            </p>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {targetKB} KB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[20, 50, 100, 200].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTargetKB(size)}
                className={`rounded-xl border px-4 py-3 font-semibold transition duration-300 ${
                  targetKB === size
                    ? "border-blue-400 bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/40 hover:bg-white/10"
                }`}
              >
                {size} KB
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Or enter custom size
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-blue-400/60">
              <input
                type="number"
                min="1"
                value={targetKB}
                onChange={(event) =>
                  setTargetKB(Number(event.target.value))
                }
                className="w-full bg-transparent py-4 text-white outline-none"
              />

              <span className="font-semibold text-slate-500">
                KB
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={compressImage}
          disabled={!file || processing}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-[0_15px_40px_rgba(37,99,235,0.20)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(37,99,235,0.30)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Compressing...
            </span>
          ) : (
            "Compress Image"
          )}
        </button>

        {message && compressedSize === null && (
          <p className="mt-5 text-center text-sm font-medium text-slate-400">
            {message}
          </p>
        )}
      </UploadCard>

      {compressedSize !== null && (
        <ResultCard
          title="Your compressed image is ready"
          description={message || "Image compression completed successfully."}
        >
          {previewUrl && (
  <div className="mb-8 grid gap-6 lg:grid-cols-2">

    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="mb-4 text-center font-semibold text-slate-300">
        Original Image
      </p>

      <img
        src={previewUrl}
        alt="Original"
        className="h-72 w-full rounded-2xl object-contain bg-black/20"
      />
    </div>

    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-5">
      <p className="mb-4 text-center font-semibold text-emerald-300">
        Compressed Preview
      </p>

      <img
        src={downloadUrl ?? ""}
        alt="Compressed"
        className="h-72 w-full rounded-2xl object-contain bg-black/20"
      />
    </div>

  </div>
)}
{imageInfo && (
  <div className="mb-8 rounded-3xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl">

    <h3 className="mb-5 text-center text-xl font-bold text-cyan-300">
      Image Information
    </h3>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

      <div>
        <p className="text-xs uppercase text-slate-500">
          File Name
        </p>

        <p className="mt-1 truncate font-semibold text-white">
          {file?.name}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">
          Format
        </p>

        <p className="mt-1 font-semibold text-white">
          {imageInfo.format}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">
          Resolution
        </p>

        <p className="mt-1 font-semibold text-white">
          {imageInfo.width} × {imageInfo.height}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">
          Original
        </p>

        <p className="mt-1 font-semibold text-white">
          {originalSize?.toFixed(2)} KB
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">
          Compressed
        </p>

        <p className="mt-1 font-semibold text-emerald-300">
          {compressedSize?.toFixed(2)} KB
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">
          Saved
        </p>

        <p className="mt-1 font-semibold text-cyan-300">
          {originalSize &&
            (originalSize - compressedSize).toFixed(2)}{" "}
          KB
        </p>
      </div>

    </div>

  </div>
)}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Original
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {originalSize?.toFixed(2)} KB
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 p-6 text-center backdrop-blur-xl">
              <p className="text-xs uppercase tracking-wider text-emerald-400">
                Compressed
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {compressedSize.toFixed(2)} KB
              </p>
              {originalSize && (
  <p className="mt-3 text-sm font-semibold text-cyan-300">
    {(
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1)}
    % Smaller
  </p>
)}
            </div>
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`novatools-compressed-${file?.name.replace(
                /\.[^/.]+$/,
                ""
              )}.jpg`}
             className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
            >
              Download Compressed Image ↓
            </a>
          )}
        </ResultCard>
      )}
<button
  onClick={() => {
    setFile(null);
    setPreviewUrl(null);
    setImageInfo(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setDownloadUrl(null);
    setMessage("");
    setTargetKB(50);
    setRobotState("idle");
  }}
  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
>
  🔄 Compress Another Image
</button>
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          How it works
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Compress an image in four steps
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["01", "Select your image"],
            ["02", "Choose your target KB size"],
            ["03", "Press Compress Image"],
            ["04", "Download the compressed image"],
          ].map(([number, text]) => (
            <div
              key={number}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-300">
                {number}
              </span>

              <span className="text-sm text-slate-300">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
<div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h2 className="text-3xl font-bold text-white">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-6">

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        How do I compress an image to 20KB or 50KB?
      </h3>

      <p className="mt-2 text-slate-300 leading-8">
        Upload your image, choose the target file size such as 20KB, 50KB, 100KB or enter your own custom size, then click Compress Image. Download the optimized image when the process finishes.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is this image compressor free?
      </h3>

      <p className="mt-2 text-slate-300 leading-8">
        Yes. Nova Tools lets you compress images online for free without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Which image formats are supported?
      </h3>

      <p className="mt-2 text-slate-300 leading-8">
        JPG, JPEG, PNG and other common image formats are supported.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Are my uploaded images secure?
      </h3>

      <p className="mt-2 text-slate-300 leading-8">
        Yes. Your files are processed in your browser and are not permanently stored on our servers.
      </p>
    </div>

  </div>

</div>
        <SiteFooter />

<NovaAssistant
  state={robotState}
/>
 </main>
</>
 );
}