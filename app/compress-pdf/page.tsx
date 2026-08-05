"use client";

import { ChangeEvent, useState } from "react";
import { PDFDocument } from "pdf-lib";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NovaAssistant from "@/components/NovaAssistant";
import FAQSchema from "@/components/seo/FAQSchema";
import SoftwareSchema from "@/components/seo/SoftwareSchema";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSEO from "@/components/seo/ToolSEO";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState(200);
  const [compressionMode, setCompressionMode] = useState<
  "high" | "balanced" | "maximum"
>("balanced");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
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

    if (selectedFile.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      return;
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
setRobotState("uploading");

setTimeout(() => {
  setRobotState("idle");
}, 1200);

    setFile(selectedFile);
    setOriginalSize(selectedFile.size / 1024);
    setCompressedSize(null);
    setDownloadUrl(null);
    setMessage("");
  }

 function resetAll() {
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
  }

  setFile(null);
  setOriginalSize(null);
  setCompressedSize(null);
  setDownloadUrl(null);
  setMessage("");
  setTargetKB(200);
  setCompressionMode("balanced");
  setProcessing(false);
  setRobotState("idle");
}

 async function compressPdf() {
  if (!file) {
    setMessage("Please select a PDF first.");
    return;
  }

  if (targetKB <= 0) {
    setMessage("Please enter a valid target size.");
    return;
  }
setProcessing(true);

setRobotState("processing");

  setMessage("Reading PDF...");
  setCompressedSize(null);
  setDownloadUrl(null);

  try {
    const pdfjsLib = await import("pdfjs-dist");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
  const originalBytes = new Uint8Array(
      await file.arrayBuffer()
    );

    const originalBytesSize = originalBytes.length;
    const targetBytes = targetKB * 1024;

    const loadingTask = pdfjsLib.getDocument({
      data: originalBytes,
    });

    const sourcePdf = await loadingTask.promise;

    if (sourcePdf.numPages === 0) {
      throw new Error("PDF has no pages.");
    }

    type Candidate = {
      bytes: Uint8Array;
      size: number;
      scale: number;
      quality: number;
    };

    let bestUnderTarget: Candidate | null = null;
    let bestReadable: Candidate | null = null;

    // We deliberately avoid very low resolution.
    // Readability is more important than forcing
    // every PDF under the requested size.
    const modeSettings = {
  high: {
    scales: [2.0, 1.8, 1.6, 1.5],
    minQuality: 0.75,
    maxQuality: 0.95,
  },

  balanced: {
    scales: [1.6, 1.4, 1.25, 1.1],
    minQuality: 0.6,
    maxQuality: 0.9,
  },

  maximum: {
    scales: [1.2, 1.0, 0.85, 0.7],
    minQuality: 0.4,
    maxQuality: 0.8,
  },
};

const settings = modeSettings[compressionMode];
const scales = settings.scales;

    async function buildPdf(
      scale: number,
      jpegQuality: number
    ): Promise<Candidate> {
      const outputPdf = await PDFDocument.create();

      for (
        let pageNumber = 1;
        pageNumber <= sourcePdf.numPages;
        pageNumber++
      ) {
        setMessage(
          `Processing page ${pageNumber} of ${sourcePdf.numPages}...`
        );

        const page = await sourcePdf.getPage(pageNumber);

        const originalViewport = page.getViewport({
          scale: 1,
        });

        const renderViewport = page.getViewport({
          scale,
        });

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d", {
          alpha: false,
        });

        if (!context) {
          throw new Error("Canvas unavailable.");
        }

        canvas.width = Math.max(
          1,
          Math.round(renderViewport.width)
        );

        canvas.height = Math.max(
          1,
          Math.round(renderViewport.height)
        );

        context.fillStyle = "#ffffff";

        context.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

       await page.render({
  canvasContext: context,
  viewport: renderViewport,
}).promise;

        const jpegBlob =
          await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(
              (result) => resolve(result),
              "image/jpeg",
              jpegQuality
            );
          });

        if (!jpegBlob) {
          throw new Error(
            `Could not process page ${pageNumber}.`
          );
        }

        const jpegBytes = new Uint8Array(
          await jpegBlob.arrayBuffer()
        );

        const image =
          await outputPdf.embedJpg(jpegBytes);

        const outputPage = outputPdf.addPage([
          originalViewport.width,
          originalViewport.height,
        ]);

        outputPage.drawImage(image, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        });

        page.cleanup();
      }

      const generated = await outputPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const bytes = new Uint8Array(generated);

      return {
        bytes,
        size: bytes.length,
        scale,
        quality: jpegQuality,
      };
    }

    /*
      For every readable resolution, binary search
      the JPEG quality.

      Minimum quality is intentionally 0.55.
      We do not use extreme 0.2 / 0.3 quality.
    */
    for (const scale of scales) {
      let low = settings.minQuality;
let high = settings.maxQuality;

      let smallestAtThisScale: Candidate | null = null;

      for (let attempt = 0; attempt < 6; attempt++) {
        const quality = (low + high) / 2;

        setMessage(
          `Finding best readable compression... ${Math.round(
            quality * 100
          )}% quality`
        );

        const candidate = await buildPdf(
          scale,
          quality
        );

        // Never consider a generated PDF that is
        // larger than the original as an improvement.
        if (candidate.size < originalBytesSize) {
          if (
            !bestReadable ||
            candidate.size < bestReadable.size
          ) {
            bestReadable = candidate;
          }
        }

        if (candidate.size <= targetBytes) {
          /*
            Candidate fits.

            Keep the largest file under target because
            it normally preserves more information.
          */
          if (
            !bestUnderTarget ||
            candidate.size > bestUnderTarget.size
          ) {
            bestUnderTarget = candidate;
          }

          low = quality;
        } else {
          if (
            !smallestAtThisScale ||
            candidate.size < smallestAtThisScale.size
          ) {
            smallestAtThisScale = candidate;
          }

          high = quality;
        }
      }

      /*
        If we already found a result close to target,
        no need to reduce resolution further.
      */
      if (
        bestUnderTarget &&
        bestUnderTarget.size >= targetBytes * 0.85
      ) {
        break;
      }
    }

    let finalBytes: Uint8Array;
    let resultType: "target" | "readable" | "original";

    if (bestUnderTarget) {
      finalBytes = bestUnderTarget.bytes;
      resultType = "target";
    } else if (bestReadable) {
      finalBytes = bestReadable.bytes;
      resultType = "readable";
    } else {
  finalBytes = new Uint8Array(
    await file.arrayBuffer()
  );
  resultType = "original";
}
let blob: Blob;

if (resultType === "original") {
  blob = new Blob([await file.arrayBuffer()], {
    type: "application/pdf",
  });
} else {
  const safeFinalBytes = finalBytes.slice();

  blob = new Blob([safeFinalBytes.buffer], {
    type: "application/pdf",
  });
}

await loadingTask.destroy();

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    const url = URL.createObjectURL(blob);
    const resultKB = blob.size / 1024;

    setDownloadUrl(url);
    setCompressedSize(resultKB);

setRobotState("success");

setTimeout(() => {
  setRobotState("idle");
}, 2500);


    if (resultType === "target") {
      setMessage(
        `PDF compressed successfully to ${resultKB.toFixed(
          2
        )} KB while keeping a readable quality level.`
      );
    } else if (resultType === "readable") {
      setMessage(
        `${targetKB} KB could not be reached at our minimum readable quality. Best readable result: ${resultKB.toFixed(
          2
        )} KB.`
      );
    } else {
      setMessage(
        "Compression would make this PDF larger or reduce quality too much, so the original PDF was kept."
      );
    }
  } catch (error) {
    console.error(error);

setRobotState("error");

setTimeout(() => {
  setRobotState("idle");
}, 2500);

    setMessage(
      "Could not process this PDF. The file may be encrypted, damaged or unsupported."
    );
  } finally {
    setProcessing(false);
  }
}

  return (
    <>
   
<ToolSEO
  name="Compress PDF"
  path="/compress-pdf"
  description="Compress PDF files online for free while keeping them readable."
  faqs={[
    {
      question: "How do I compress a PDF online?",
      answer: "Upload your PDF, choose a target size and click Compress PDF.",
    },
    {
      question: "Is this PDF compressor free?",
      answer: "Yes. Nova Tools provides free online PDF compression.",
    },
    {
      question: "Are my PDF files secure?",
      answer: "Yes. Files are processed securely and are not permanently stored.",
    },
    {
      question: "Can I compress scanned PDFs?",
      answer: "Yes. Most scanned PDF files can also be compressed.",
    },
  ]}
/>

<main className="min-h-screen bg-slate-950 text-white">
     
     <SiteHeader />
      <section className="relative mx-auto max-w-5xl px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
  <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-[140px]" />
  <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[140px]" />
  <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[140px]" />
</div>

<div className="relative z-10"></div>

        <div className="text-center">
          <p className="font-semibold text-blue-600">
            Free Online PDF Tool
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Compress PDF
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Reduce PDF file size for online applications, forms and
            document uploads.
          </p>
        </div>

        <div className="group relative mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/20 sm:p-10">
          
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-cyan-400/20"></div>

<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
  <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-3xl animate-lightSweep"></div>
</div>

<div className="relative z-10"></div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
  <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-3xl animate-lightSweep"></div>
</div>

<div className="relative z-10"></div>
          <label className="group relative block cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-slate-900/30 to-violet-500/10 p-14 text-center transition-all duration-500 hover:scale-[1.02] hover:border-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]">
            <div className="text-4xl">📄</div>

            <div className="mt-4 text-lg font-bold">
              Choose a PDF
            </div>

            <div className="mt-2 text-sm text-cyan-300">
              Select a PDF from your device
            </div>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="break-all font-semibold">
                {file.name}
              </p>

              {originalSize !== null && (
                <p className="mt-1 text-sm text-slate-500">
                  Original size: {originalSize.toFixed(2)} KB
                </p>
              )}
            </div>
          )}

<div className="mt-8">
  <p className="mb-3 font-semibold">
    Compression quality
  </p>

  <div className="grid gap-3 sm:grid-cols-3">
    <button
      type="button"
      onClick={() => setCompressionMode("high")}
      className={`rounded-xl border px-4 py-4 font-semibold transition ${
        compressionMode === "high"
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-white/10 bg-white/5 text-white hover:border-emerald-400 hover:bg-emerald-500/10"
      }`}
    >
      High Quality
    </button>

    <button
      type="button"
      onClick={() => setCompressionMode("balanced")}
      className={`rounded-xl border px-4 py-4 font-semibold transition ${
        compressionMode === "balanced"
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-white/10 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-500/10"
      }`}
    >
      Balanced
    </button>

    <button
      type="button"
      onClick={() => setCompressionMode("maximum")}
      className={`rounded-xl border px-4 py-4 font-semibold transition ${
        compressionMode === "maximum"
          ? "border-blue-600 bg-blue-600 text-white"
         : "border-white/10 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-500/10"
      }`}
    >
      Maximum Compression
    </button>
  </div>

  <p className="mt-3 text-sm text-slate-500">
    {compressionMode === "high" &&
      "Best readability. File size may be larger."}

    {compressionMode === "balanced" &&
      "Recommended balance between readability and file size."}

    {compressionMode === "maximum" &&
      "Smallest file size. Image and text quality may be reduced."}
  </p>
</div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">
              Target size
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[100, 200, 500, 1000].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTargetKB(size)}
                  className={`rounded-xl border px-4 py-3 font-semibold transition ${
                    targetKB === size
                      ? "border-blue-600 bg-blue-600 text-white"
                     : "border-white/10 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-500/10"
                  }`}
                >
                  {size === 1000 ? "1 MB" : `${size} KB`}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Or enter custom target size
              </label>

              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 backdrop-blur-xl">
                <input
                  type="number"
                  min="1"
                  value={targetKB}
                  onChange={(event) =>
                    setTargetKB(Number(event.target.value))
                  }
                  className="w-full bg-transparent py-3 text-white outline-none"
                />

               <span className="font-semibold text-cyan-300">
  KB
</span>
              </div>
            </div>
          </div>

          <button
            onClick={compressPdf}
            disabled={!file || processing}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-5 text-lg font-bold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Compressing PDF..." : "Compress PDF"}
          </button>

          {message && (
            <p className="mt-5 text-center text-sm font-medium leading-6 text-slate-600">
              {message}
            </p>
          )}

          {compressedSize !== null && (
  <div className="mt-8">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-slate-900/20"></div>

        <div className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Original
          </p>

          <h2 className="mt-4 text-5xl font-bold text-white">
            {originalSize?.toFixed(2)} KB
          </h2>
          <p className="mt-4 inline-flex items-center rounded-full border border-slate-500/20 bg-slate-500/10 px-4 py-2 text-sm font-semibold text-slate-300">
  📄 Original PDF
</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 p-8 backdrop-blur-xl">

        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent blur-3xl animate-lightSweep"></div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Compressed
          </p>

          <h2 className="mt-4 text-5xl font-bold text-emerald-300">
            {compressedSize !== null ? compressedSize.toFixed(2) : "0.00"} KB
          </h2>
          {originalSize && (
  <p className="mt-4 text-lg font-semibold text-cyan-300">
    {(
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1)}
    % Smaller
  </p>
)}
<p className="mt-4 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
  ⚡ Optimized Successfully
</p>
        </div>

      </div>

    </div>
  </div>
)}
{downloadUrl && (
  <div className="group relative mt-8 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 p-8 text-center backdrop-blur-xl">

    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent blur-3xl animate-lightSweep"></div>
    </div>

    <div className="relative z-10">

      <h3 className="text-3xl font-bold text-emerald-400">
        PDF Ready
      </h3>
      <div className="mt-6 flex items-center justify-center gap-6">

  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
    <p className="text-xs uppercase text-slate-400">Before</p>
    <p className="mt-2 text-xl font-bold text-white">
      {originalSize?.toFixed(2)} KB
    </p>
  </div>

  <div className="text-3xl text-cyan-400">→</div>

  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
    <p className="text-xs uppercase text-emerald-300">After</p>
    <p className="mt-2 text-xl font-bold text-emerald-300">
      {compressedSize?.toFixed(2)} KB
    </p>
  </div>

</div>
<p className="mt-3 text-slate-300">
  Original: <span className="font-bold text-white">
    {originalSize?.toFixed(2)} KB
  </span>

  <br />

  Compressed: <span className="font-bold text-emerald-300">
    {compressedSize?.toFixed(2)} KB
  </span>

  <br />

 {originalSize !== null && compressedSize !== null && (
  <span className="text-cyan-300 font-semibold">
    {(
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1)}
    % Size Reduced
  </span>
)}
</p>
<div className="mt-6 flex justify-center">
 <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
  {originalSize !== null &&
    compressedSize !== null &&
    (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}
  % Space Saved
</span>
</div>
      <a
        href={downloadUrl}
        download="novatools-compressed.pdf"
        className="mt-8 inline-flex items-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
      >
        ⬇ Download Compressed PDF
        
      </a>
<button
  type="button"
  onClick={resetAll}
  className="mt-4 block w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
>
  🔄 Compress Another PDF
</button>

    </div>

  </div>
)}
</div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold">
            How to compress a PDF
          </h2>
<div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
  <h2 className="text-3xl font-bold text-white">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-6">
    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is this PDF compressor free?
      </h3>
      <p className="mt-2 text-slate-300">
        Yes. You can compress PDF files online without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Are my PDF files secure?
      </h3>
      <p className="mt-2 text-slate-300">
        Your uploaded PDF files are processed securely and are not permanently stored.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can I compress scanned PDFs?
      </h3>
      <p className="mt-2 text-slate-300">
        Yes. Most scanned PDF files can also be compressed.
      </p>
    </div>
  </div>
</div>
          <ol className="mt-5 space-y-3 text-slate-600">
            <li>1. Choose your PDF file.</li>
            <li>2. Select your required target size.</li>
            <li>3. Press Compress PDF.</li>
            <li>4. Check the optimized file size.</li>
            <li>5. Download your PDF.</li>
          </ol>
        </div>
      </section>
      <RelatedTools current="/compress-pdf" />
      <SiteFooter />

<NovaAssistant
  state={robotState}
/>
    </main>
</>
);
}