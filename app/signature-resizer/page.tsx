"use client";


import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import SiteFooter from "@/components/SiteFooter";
import { ChangeEvent, useEffect, useState } from "react";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

export default function SignatureResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(100);
  const [targetKB, setTargetKB] = useState(20);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [finalSize, setFinalSize] = useState<number | null>(null);
const [dragActive, setDragActive] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [sizeMode, setSizeMode] = useState<"best" | "exact">("best");
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

    setRobotState("uploading");

setTimeout(() => {
  setRobotState("idle");
}, 1200);
    setFile(selectedFile);
    setPreviewUrl(url);
    setDownloadUrl(null);
    setFinalSize(null);
    setMessage("");
  }

  async function createBlob(
    canvas: HTMLCanvasElement,
    quality: number
  ) {
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (result) => resolve(result),
        "image/jpeg",
        quality
      );
    });
  }

  async function processSignature() {
    if (!file || !previewUrl) {
      setMessage("Please select your signature image.");
      return;
    }

    if (width <= 0 || height <= 0 || targetKB <= 0) {
      setMessage("Please enter valid dimensions and target size.");
      return;
    }
  setProcessing(true);
    setRobotState("processing");

    setMessage("");
    setDownloadUrl(null);
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
        throw new Error("Canvas unavailable.");
      }

      canvas.width = width;
      canvas.height = height;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const targetRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let x = 0;
      let y = 0;

      if (imageRatio > targetRatio) {
        drawWidth = width;
        drawHeight = width / imageRatio;
        y = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imageRatio;
        x = (width - drawWidth) / 2;
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight
      );
const originalBlob = await createBlob(canvas, 1);

console.log("Max Quality:", originalBlob?.size);

      const targetBytes = targetKB * 1024;

     let low = 0.50;
let high = 1;
let bestBlob: Blob | null = null;
let closestDifference = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < 25; i++) {
  const quality = (low + high) / 2;
  const testBlob = await createBlob(canvas, quality);

  if (!testBlob) break;

  const difference = Math.abs(testBlob.size - targetBytes);

  if (difference < closestDifference) {
    closestDifference = difference;
    bestBlob = testBlob;
  }

  if (testBlob.size > targetBytes) {
    high = quality;
  } else {
    low = quality;
  }
}
      if (!bestBlob) {
        setMessage(
          "This target size is too small for the selected dimensions. Try a larger KB size or smaller dimensions."
        );
        return;
      }

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

if (sizeMode === "exact" && bestBlob) {
  if (bestBlob.size < targetBytes) {
    const padding = new Uint8Array(targetBytes - bestBlob.size);

    const finalBlob = new Blob([bestBlob, padding], {
      type: "image/jpeg",
    });

    bestBlob = finalBlob;
  }
}

      const resultUrl = URL.createObjectURL(bestBlob);
      const resultKB = bestBlob.size / 1024;

           setDownloadUrl(resultUrl);

      setFinalSize(resultKB);

      setRobotState("success");

      setTimeout(() => {
        setRobotState("idle");
      }, 2500);

      setMessage(
        `Signature ready at ${resultKB.toFixed(2)} KB.`
      );

    } catch (error) {

      console.error(error);

      setRobotState("error");

      setTimeout(() => {
        setRobotState("idle");
      }, 2500);

      setMessage(
        "Something went wrong while processing the signature."
      );

    } finally {

      setProcessing(false);

    }
    } 
function resetAll() {

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
  }

  setFile(null);

  setPreviewUrl(null);

  setDownloadUrl(null);

  setFinalSize(null);

  setMessage("");

  setProcessing(false);

  setRobotState("idle");

  setWidth(300);

  setHeight(100);

  setTargetKB(20);

  setSizeMode("best");

}

  return (
    <>

    <ToolSEO
  name="Signature Resizer"
  path="/signature-resizer"
  description="Resize and compress signature images online for free."
  faqs={[
    {
      question: "How do I resize my signature?",
      answer:
        "Upload your signature, choose the dimensions and target file size, then click Resize & Compress Signature.",
    },
    {
      question: "Can I create a 20KB signature?",
      answer:
        "Yes. Select 20KB or enter a custom target size.",
    },
    {
      question: "Is this signature resizer free?",
      answer:
        "Yes. Nova Tools provides this tool free of charge.",
    },
    {
      question: "Are my signature images secure?",
      answer:
        "Your uploaded signature images are processed securely and are not permanently stored.",
    },
  ]}
/>
<main className="min-h-screen bg-slate-950 text-white">

      
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Online Application Tool
          </p>

          <h1 className="mt-3 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Signature Resizer
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Resize and compress your signature for online applications,
            government forms and exam registrations.
          </p>
        </div>

        <div className="group relative mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/20 sm:p-10">
        
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-cyan-400/20"></div>
<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
  <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-3xl animate-lightSweep"></div>
</div>


          <label
  onDragOver={(e) => {
    e.preventDefault();
    setDragActive(true);
  }}
  onDragLeave={() => setDragActive(false)}
  onDrop={(e) => {
    e.preventDefault();

    setDragActive(false);

    const droppedFile =
      e.dataTransfer.files[0];

    if (!droppedFile) return;

    const event = {
      target: {
        files: [droppedFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleFile(event);
  }}
  className={`group relative block cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-14 text-center transition-all duration-500 ${
    dragActive
      ? "scale-[1.02] border-cyan-400 bg-cyan-500/10"
      : "border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-slate-900/30 to-violet-500/10 hover:border-cyan-300"
  }`}
>
           <div className="animate-float text-6xl text-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)] transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
  ✍️
</div>

<div className="mt-6 text-2xl font-bold text-white">
              Choose signature image
            </div>

            <div className="mt-3 text-base text-slate-300">
              JPG and PNG supported
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {file && previewUrl && (
            <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <img
                src={previewUrl}
                alt="Signature preview"
                className="mx-auto max-h-44 rounded-2xl border border-white/10 bg-white p-3 object-contain shadow-2xl"
              />

              <p className="mt-5 break-all text-center text-base font-semibold text-cyan-300">
                {file.name}
              </p>
            </div>
          )}

          <div className="relative z-10 mt-8">
            <p className="mb-3 font-semibold">
              Signature dimensions
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Width
                </label>

               <div className="flex rounded-2xl border border-white/10 bg-white/5 px-4 backdrop-blur-xl">
                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(event) =>
                      setWidth(Number(event.target.value))
                    }
                    className="w-full bg-transparent py-4 text-lg text-white outline-none"
                  />

                  <span className="py-4 font-bold text-cyan-300">
                    px
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Height
                </label>

                <div className="flex rounded-2xl border border-white/10 bg-white/5 px-4 backdrop-blur-xl">
                  <input
                    type="number"
                    min="1"
                    value={height}
                    onChange={(event) =>
                      setHeight(Number(event.target.value))
                    }
                    className="w-full bg-transparent py-4 text-lg text-white outline-none"
                  />

                  <span className="py-4 font-bold text-cyan-300">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>

<div className="mt-8">
  <p className="mb-3 font-semibold">Quick Presets</p>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
    <button
      type="button"
      onClick={() => {
        setWidth(300);
        setHeight(100);
        setTargetKB(20);
      }}
      className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
    >
      Passport
    </button>

    <button
      type="button"
      onClick={() => {
        setWidth(300);
        setHeight(80);
        setTargetKB(20);
      }}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-cyan-400"
    >
      SSC
    </button>

    <button
      type="button"
      onClick={() => {
        setWidth(300);
        setHeight(100);
        setTargetKB(50);
      }}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-cyan-400"
    >
      UPSC
    </button>

    <button
      type="button"
      onClick={() => {
        setWidth(200);
        setHeight(80);
        setTargetKB(20);
      }}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-cyan-400"
    >
      TNPSC
    </button>

    <button
      type="button"
      onClick={() => {
        setWidth(300);
        setHeight(100);
        setTargetKB(20);
      }}
      className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 font-semibold text-violet-300 transition hover:bg-violet-500/20"
    >
      Custom
    </button>
  </div>
</div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">
              Target file size
            </p>
<div className="mb-5 grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => setSizeMode("best")}
    className={`relative z-20 rounded-2xl px-4 py-3 font-semibold transition ${
      sizeMode === "best"
        ? "bg-cyan-500 text-white"
        : "bg-white/5 text-slate-300 border border-white/10"
    }`}
  >
    Best Quality
  </button>

  <button
    type="button"
    onClick={() => setSizeMode("exact")}
    className={`relative z-20 rounded-2xl px-4 py-3 font-semibold transition ${
      sizeMode === "exact"
        ? "bg-violet-500 text-white"
        : "bg-white/5 text-slate-300 border border-white/10"
    }`}
  >
    Exact KB
  </button>
</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[10, 20, 30, 50].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTargetKB(size)}
                 className={`rounded-2xl border px-4 py-4 font-bold transition-all duration-300 ${
  targetKB === size
    ? "border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
    : "border-white/10 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-500/10"
}`}
                >
                  {size} KB
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Custom target size
              </label>

              <div className="flex rounded-2xl border border-white/10 bg-white/5 px-4 backdrop-blur-xl">
                <input
                  type="number"
                  min="1"
                  value={targetKB}
                  onChange={(event) =>
                    setTargetKB(Number(event.target.value))
                  }
               className="w-full bg-transparent py-4 text-lg text-white outline-none"
                />

                <span className="py-4 font-bold text-cyan-300">
                  KB
                </span>
              </div>
            </div>
          </div>

<div className="relative mt-8">
  <div className="absolute left-1/2 top-1/2 h-16 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>

  <button
    onClick={processSignature}
    disabled={!file || processing}
    className="relative z-10 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 px-6 py-5 text-lg font-bold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {processing
      ? "Processing..."
      : "Resize & Compress Signature"}
  </button>
</div>

          {message && (
            <p className="mt-5 text-center font-medium text-cyan-300">
              {message}
            </p>
          )}

          {downloadUrl &&
 sizeMode === "best" &&
 finalSize !== null && (
  <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-center backdrop-blur-xl">
    <p className="text-sm text-cyan-300 font-semibold">
      Maximum quality reached
    </p>

    <p className="mt-2 text-slate-300">
      This image can reach a maximum of{" "}
      <span className="font-bold text-white">
        {finalSize.toFixed(2)} KB
      </span>{" "}
      at {width} × {height} px.
    </p>

    <p className="mt-2 text-xs text-slate-400">
      If you need an exact file size like 20 KB, 30 KB or 50 KB,
      switch to <span className="text-cyan-300 font-semibold">Exact KB</span> mode.
    </p>
  </div>
)}

          {downloadUrl && finalSize !== null && (

  <ResultCard
    title="Signature Ready"
    description="Your signature has been resized successfully."
  >

    <div className="mb-6 flex justify-center">
      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300">
        ✅ Ready to Download
      </span>
    </div>

    <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

      <h3 className="mb-6 text-center text-xl font-bold text-cyan-300">
        Signature Information
      </h3>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase text-slate-500">
            File Name
          </p>

          <p className="mt-2 break-all text-sm font-bold text-white">
            {file?.name}
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase text-slate-500">
            Dimensions
          </p>

          <p className="mt-2 font-bold text-white">
            {width} × {height}px
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase text-slate-500">
            Output Size
          </p>

          <p className="mt-2 font-bold text-cyan-300">
            {finalSize.toFixed(2)} KB
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase text-slate-500">
            Mode
          </p>

          <p className="mt-2 font-bold text-white">
            {sizeMode === "best"
              ? "Best Quality"
              : "Exact KB"}
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase text-slate-500">
            Format
          </p>

          <p className="mt-2 font-bold text-emerald-300">
            JPG
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase text-slate-500">
            Status
          </p>

          <p className="mt-2 font-bold text-emerald-300">
            Ready
          </p>
        </div>

      </div>

    </div>

    <div className="space-y-4">

      <a
        href={downloadUrl}
        download="novatools-signature.jpg"
        className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
      >
        ⬇ Download Signature
      </a>

      <button
        type="button"
        onClick={resetAll}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
      >
        🔄 Resize Another Signature
      </button>

    </div>

  </ResultCard>

)}

<div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h2 className="mb-5 text-2xl font-bold">
    How to Resize Signature
  </h2>

  <ol className="mt-5 space-y-3 text-slate-300">
    <li>1. Upload your signature image.</li>
    <li>2. Enter the required width and height.</li>
    <li>3. Select the required KB size.</li>
    <li>4. Choose Best Quality or Exact KB mode.</li>
    <li>5. Click Resize & Compress Signature.</li>
    <li>6. Download the resized signature.</li>
  </ol>

</div>

<div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h2 className="text-3xl font-bold text-white">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-8">

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can I resize my signature to 20KB?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. Choose the 20KB preset or enter your own custom target size. Nova Tools will compress the signature while keeping the best possible quality.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can I create an exact 20KB or 50KB signature?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. Switch to Exact KB mode to generate signatures that closely match your required file size.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Which image formats are supported?
      </h3>

      <p className="mt-2 text-slate-300">
        JPG, JPEG and PNG signature images are supported.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is this signature resizer free?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. You can resize and compress signature images online for free without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Are my signature images secure?
      </h3>

      <p className="mt-2 text-slate-300">
        Your signature images are processed securely inside your browser and are not permanently stored.
      </p>
    </div>

  </div>

</div>

</div>

</section>  {/* closes section */}

<RelatedTools current="/signature-resizer" />

<SiteFooter />

 <NovaAssistant state={robotState} />
</main>
</>
);
}