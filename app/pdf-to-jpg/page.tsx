"use client";

import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";

import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";

import {
  UploadCloud,
  FileText,
} from "lucide-react";

import JSZip from "jszip";
import { saveAs } from "file-saver";

type RobotState =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export default function PdfToJpgPage() {
      const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [images, setImages] =
    useState<string[]>([]);

  const [processing, setProcessing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [robotState, setRobotState] =
    useState<RobotState>("idle");

  const fileInputRef =
    useRef<HTMLInputElement>(null);
      useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.startsWith("blob:")) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [images]);
  function handleFile(
  event: ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    setMessage("Please select a valid PDF file.");
    return;
  }

  setRobotState("uploading");

  setPdfFile(file);

  setImages([]);

  setMessage("");

  setTimeout(() => {
    setRobotState("idle");
  }, 1000);
}

function resetAll() {
  images.forEach((image) => {
    if (image.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }
  });

  setPdfFile(null);
  setImages([]);
  setProcessing(false);
  setMessage("");
  setRobotState("idle");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}

async function downloadZip() {
  if (images.length === 0) return;

  const zip = new JSZip();

  for (let i = 0; i < images.length; i++) {
    const response = await fetch(images[i]);

    const blob = await response.blob();

    zip.file(`page-${i + 1}.jpg`, blob);
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
  });

  saveAs(zipBlob, "novatools-images.zip");
}
async function convertPdfToImages() {
  if (!pdfFile) {
    setMessage("Please upload a PDF file.");
    return;
  }

  setProcessing(true);
  setRobotState("processing");
  setMessage("Loading PDF...");

  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

   pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

    const bytes = await pdfFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: bytes,
    }).promise;

    const output: string[] = [];

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      setMessage(
        `Converting page ${pageNo} of ${pdf.numPages}...`
      );

      const page = await pdf.getPage(pageNo);

      const viewport = page.getViewport({
        scale: 2,
      });

      const canvas = document.createElement("canvas");

      const context = canvas.getContext("2d");

      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      output.push(
        canvas.toDataURL("image/jpeg", 1)
      );
    }

    setImages(output);

    setRobotState("success");

    setMessage(
      `Successfully converted ${output.length} page(s).`
    );

    setTimeout(() => {
      setRobotState("idle");
    }, 2500);

  } catch (error) {
    console.error(error);

    setRobotState("error");
setTimeout(() => {
  setRobotState("idle");
}, 2500);

    setMessage(
      "Failed to convert PDF."
    );

  } finally {
    setProcessing(false);
  }
}
return (
  <>
 <ToolSEO
  name="PDF to JPG"
  path="/pdf-to-jpg"
  description="Convert PDF pages into high quality JPG images online for free."
  faqs={[
    {
      question: "How do I convert PDF to JPG?",
      answer:
        "Upload your PDF, click Convert PDF to JPG and download the generated images.",
    },
    {
      question: "Can I download all pages together?",
      answer:
        "Yes. Nova Tools lets you download all converted images as a ZIP file.",
    },
    {
      question: "Is PDF to JPG free?",
      answer:
        "Yes. This tool is completely free to use.",
    },
    {
      question: "Are my PDF files secure?",
      answer:
        "Your uploaded PDF files are processed securely and are not permanently stored.",
    },
  ]}
/>

<main className="min-h-screen bg-[#030712] text-white">
    

    <ToolLayout
      badge="FREE PDF TOOL"
      title="PDF to JPG"
      description="Convert every PDF page into high quality JPG images instantly."
    >

      <UploadCard
        title="Upload PDF"
        description="Upload a PDF and convert every page into JPG images."
      >

        <label
          htmlFor="pdf-upload"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-12 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:bg-slate-900/70"
        >

          <UploadCloud className="h-16 w-16 text-cyan-400 transition-all duration-300 group-hover:scale-110" />

          <h2 className="mt-6 text-3xl font-bold">
            Select PDF File
          </h2>

          <p className="mt-3 text-center text-slate-400">
            Click here to choose your PDF document
          </p>

          <input
            id="pdf-upload"
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />

        </label>

        {pdfFile && (

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/5 shadow-xl shadow-cyan-500/10 p-6 backdrop-blur-xl">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20">

               <FileText className="h-7 w-7 text-red-400" />

              </div>

              <div className="flex-1">

                <h3 className="break-all text-sm font-bold text-white">
                  {pdfFile.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {(pdfFile.size / 1024).toFixed(2)} KB
                </p>

              </div>

            </div>

          </div>

        )}

        <button
          type="button"
          onClick={convertPdfToImages}
          disabled={!pdfFile || processing}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing
            ? "Converting PDF..."
            : "Convert PDF to JPG"}
        </button>

        {message && (

          <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-center font-medium text-cyan-300">

            {message}

          </div>

        )}

        
                {images.length > 0 && (
          <ResultCard
            title="JPG Images Ready"
            description={`Successfully converted ${images.length} page${
              images.length > 1 ? "s" : ""
            }.`}
          >
<div className="mb-5 flex justify-center">
  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300">
    ⚡ Converted Successfully
  </span>
</div>
            <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

              <h3 className="mb-6 text-center text-xl font-bold text-cyan-300">
                Conversion Details
              </h3>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    PDF File
                  </p>

                  <p className="mt-2 break-all text-sm font-bold text-white">
                    {pdfFile?.name}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Pages
                  </p>

                  <p className="mt-2 text-2xl font-bold text-cyan-300">
                    {images.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Output
                  </p>

                  <p className="mt-2 font-bold text-emerald-300">
                    JPG
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Quality
                  </p>

                  <p className="mt-2 font-bold text-white">
                    High
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    ZIP Download
                  </p>

                  <p className="mt-2 font-bold text-violet-300">
                    Supported
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

<div className="rounded-2xl bg-black/20 p-4">
  <p className="text-xs uppercase text-slate-500">
    Resolution
  </p>

  <p className="mt-2 font-bold text-cyan-300">
    2X
  </p>
</div>

<div className="rounded-2xl bg-black/20 p-4">
  <p className="text-xs uppercase text-slate-500">
    Browser
  </p>

  <p className="mt-2 font-bold text-emerald-300">
    Local Processing
  </p>
</div>

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {images.map((image, index) => (
                <ImageCard
                  key={index}
                  image={image}
                  index={index}
                />
              ))}

            </div>

            <button
              type="button"
              onClick={downloadZip}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              📦 Download All Pages as ZIP
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
            >
              🔄 Convert Another PDF
            </button>

          </ResultCard>
        )}

      </UploadCard>

<div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h2 className="text-3xl font-bold text-white">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-6">

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is PDF to JPG free?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. Convert PDF pages to JPG images without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can I download all pages together?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. All converted images can be downloaded as a ZIP file.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Are my PDF files secure?
      </h3>

      <p className="mt-2 text-slate-300">
        Your uploaded files are processed securely and are not permanently stored.
      </p>
    </div>

  </div>

</div>

            <div className="mt-12">

        <h2 className="text-2xl font-bold">
          How to Convert PDF to JPG
        </h2>

        <ol className="mt-6 space-y-3 text-slate-400">

          <li>1. Select your PDF file.</li>

          <li>2. Click &quot;Convert PDF to JPG&quot;.</li>

          <li>3. Wait for all pages to be converted.</li>

          <li>4. Preview every JPG image.</li>

          <li>5. Download individual JPG files.</li>

          <li>6. Or download all images as one ZIP file.</li>

        </ol>

      </div>

    </ToolLayout>
<RelatedTools current="/pdf-to-jpg" />
    <SiteFooter />

    <NovaAssistant
      state={robotState}
    />

  </main>
  </>
);
}
type ImageCardProps = {
  image: string;
  index: number;
};

function ImageCard({
  image,
  index,
}: ImageCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">

      <img
        src={image}
        alt={`Page ${index + 1}`}
        className="h-56 w-full rounded-2xl bg-black/20 object-contain transition-transform duration-300 group-hover:scale-105"
      />

      <div className="mt-4">

        <p className="text-center text-lg font-bold text-white">
          Page {index + 1}
        </p>

        <div className="mt-3 flex justify-center">

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
            High Quality JPG
          </span>

        </div>

      </div>

      <a
        href={image}
        download={`page-${index + 1}.jpg`}
        className="mt-5 block rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-center font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
      >
        ⬇ Download Page {index + 1}
      </a>

    </div>
  );
}