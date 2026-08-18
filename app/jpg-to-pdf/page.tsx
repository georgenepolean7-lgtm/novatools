"use client";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import SiteFooter from "@/components/SiteFooter";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import { UploadCloud } from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


type PageMode = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>("a4");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
const [orientation, setOrientation] =
  useState<Orientation>("portrait");
const [robotState, setRobotState] = useState<
  "idle" | "uploading" | "processing" | "success" | "error"
>("idle");
const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);

    const validImages = selected.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length === 0) {
      setMessage("Please select JPG or PNG images.");
      return;
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

setRobotState("uploading");
setTimeout(() => {
  setRobotState("idle");
  
}, 1200);
    setFiles(validImages);
    setDownloadUrl(null);
    setPdfSize(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  function removeImage(index: number) {
    const updated = files.filter((_, i) => i !== index);

    setFiles(updated);
    setDownloadUrl(null);
    setPdfSize(null);
  }

  const resetAll = () => {
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
  }

  setFiles([]);
  setDownloadUrl(null);
  setPdfSize(null);
  setMessage("");

  setPageMode("a4");
  setOrientation("portrait");

  setProcessing(false);
  setRobotState("idle");
};

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setFiles((items) => {
    const oldIndex = items.findIndex(
      (file) => file.name === active.id
    );

    const newIndex = items.findIndex(
      (file) => file.name === over.id
    );

    return arrayMove(items, oldIndex, newIndex);
  });
}
  async function convertToPdf() {
    if (files.length === 0) {
      setMessage("Please select at least one image.");
      return;
    }

   setProcessing(true);

setRobotState("processing");
setMessage("Creating PDF...");

setDownloadUrl(null);
setPdfSize(null);
    setDownloadUrl(null);
    setPdfSize(null);

    try {
      const pdf = await PDFDocument.create();

      for (let index = 0; index < files.length; index++) {
        setMessage(
          `Processing image ${index + 1} of ${files.length}...`
        );

        const file = files[index];
        const bytes = new Uint8Array(await file.arrayBuffer());

        let image;

        const type = file.type.toLowerCase();

if (type === "image/png") {
  image = await pdf.embedPng(bytes);
} else if (
  type === "image/jpeg" ||
  type === "image/jpg"
) {
  image = await pdf.embedJpg(bytes);
} else {
  throw new Error("Unsupported image format");
}

        const imageWidth = image.width;
        const imageHeight = image.height;

        if (pageMode === "fit") {
          const page = pdf.addPage([
            imageWidth,
            imageHeight,
          ]);

          page.drawImage(image, {
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
          });

        } else {
        let pageWidth = 595.28;
let pageHeight = 841.89;

if (pageMode === "letter") {
  pageWidth = 612;
  pageHeight = 792;
}

if (orientation === "landscape") {
  [pageWidth, pageHeight] = [pageHeight, pageWidth];
}
const margin = 30;

const availableWidth = pageWidth - margin * 2;
const availableHeight = pageHeight - margin * 2;

const scale = Math.min(
  availableWidth / imageWidth,
  availableHeight / imageHeight
);

const drawWidth = imageWidth * scale;
const drawHeight = imageHeight * scale;

const x = (pageWidth - drawWidth) / 2;
const y = (pageHeight - drawHeight) / 2;

const page = pdf.addPage([
  pageWidth,
  pageHeight,
]);

page.drawImage(image, {
  x,
  y,
  width: drawWidth,
  height: drawHeight,
});
} // closes else block

} // closes for loop

     const pdfBytes = await pdf.save({
  useObjectStreams: true,
  addDefaultPage: false,
});

setMessage("PDF created successfully!");
setRobotState("success");

setTimeout(() => {
  setRobotState("idle");
}, 2500);

const safeBytes = new Uint8Array(pdfBytes.length);
safeBytes.set(pdfBytes);

      const blob = new Blob([safeBytes.buffer], {
        type: "application/pdf",
      });

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setPdfSize(blob.size / 1024);
      setMessage("PDF created successfully.");
      

setTimeout(() => {
  setRobotState("idle");
}, 2500);
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not create the PDF. Please use JPG or PNG images."
      );
      setRobotState("error");

setTimeout(() => {
  setRobotState("idle");
}, 2500);
    } finally {
      setProcessing(false);
    }
  }


  return (
    <>
   <ToolSEO
  name="JPG to PDF"
  path="/jpg-to-pdf"
  description="Convert JPG and PNG images into PDF documents online for free."
  faqs={[
    {
      question: "How do I convert JPG to PDF?",
      answer:
        "Upload one or more JPG or PNG images, choose your page settings and click Convert to PDF.",
    },
    {
      question: "Can I combine multiple images into one PDF?",
      answer:
        "Yes. Upload multiple images and they will be combined into a single PDF document.",
    },
    {
      question: "Is JPG to PDF free?",
      answer:
        "Yes. Nova Tools lets you convert images to PDF online for free.",
    },
    {
      question: "Are my images secure?",
      answer:
        "Your uploaded images are processed securely and are not permanently stored.",
    },
  ]}
/>

<main className="min-h-screen bg-[#030712] text-white">

      <ToolLayout
  badge="FREE PDF TOOL"
  title="JPG to PDF"
  description="Convert JPG and PNG images into high-quality PDF documents instantly."
>
       
       <UploadCard
  title="Upload Images"
  description="Upload one or multiple JPG / PNG images."
>
         <label
  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-12 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-900/70"
>
  <UploadCloud className="h-14 w-14 text-cyan-400 transition group-hover:scale-110" />

  <h3 className="mt-6 text-2xl font-bold text-white">
    Drag & Drop Images
  </h3>

<p className="mt-2 text-center text-sm font-semibold text-cyan-300">
  Multiple Images Supported
</p>


  <p className="mt-3 text-center text-slate-400">
    or click to browse JPG / PNG images
  </p>

  <input
  ref={fileInputRef}
    type="file"
    accept="image/jpeg,image/png"
    multiple
    onChange={handleFiles}
    className="hidden"
  />
</label>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  Selected images
                </p>

                <p className="text-sm text-slate-500">
                  {files.length} file{files.length > 1 ? "s" : ""}
                </p>
              </div>

              <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={files.map((file) => file.name)}
    strategy={verticalListSortingStrategy}
  >
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file, index) => (
        <SortableImageCard
          key={file.name}
          file={file}
          index={index}
          removeImage={removeImage}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>
   </div>         
)}

          <div className="mt-8">
            <p className="mb-3 font-semibold">
              PDF page size
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPageMode("a4")}
                className={`rounded-xl border px-4 py-4 font-semibold transition ${
                  pageMode === "a4"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                A4 Document
              </button>
<button
  type="button"
  onClick={() => setPageMode("letter")}
  className={`rounded-xl border px-4 py-4 font-semibold transition ${
    pageMode === "letter"
      ? "border-cyan-500 bg-cyan-500 text-slate-950"
      : "border-slate-700 bg-slate-900 text-white hover:border-cyan-400"
  }`}
>
  Letter
</button>
              <button
                type="button"
                onClick={() => setPageMode("fit")}
                className={`rounded-xl border px-4 py-4 font-semibold transition ${
                  pageMode === "fit"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-white/10 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-500/10"
                }`}
              >
                Fit to Image
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {pageMode === "a4"
                ? "Recommended for documents, applications and printing."
                : "Each PDF page will match the original image dimensions."}
            </p>
            <div className="mt-8">
  <p className="mb-3 font-semibold text-white">
    Orientation
  </p>

  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => setOrientation("portrait")}
      className={`rounded-xl px-4 py-3 font-semibold transition ${
        orientation === "portrait"
          ? "bg-cyan-500 text-slate-950"
          : "bg-slate-800 text-white"
      }`}
    >
      Portrait
    </button>

    <button
      type="button"
      onClick={() => setOrientation("landscape")}
      className={`rounded-xl px-4 py-3 font-semibold transition ${
        orientation === "landscape"
          ? "bg-cyan-500 text-slate-950"
          : "bg-slate-800 text-white"
      }`}
    >
      Landscape
    </button>
  </div>
</div>
          </div>

          <button
            type="button"
            onClick={convertToPdf}
            disabled={files.length === 0 || processing}
           className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Creating PDF..." : "Convert to PDF"}
          </button>

          {message && (
          <p className="mt-5 text-center text-sm font-medium text-cyan-300">
              {message}
            </p>
          )}

          {downloadUrl && pdfSize !== null && (
  <ResultCard
    title="PDF Ready"
    description={`${files.length} page${files.length > 1 ? "s" : ""} • ${pdfSize.toFixed(2)} KB`}
  >
<button
  onClick={resetAll}
  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10"
>
  🔄 Convert Another PDF
</button>


<div className="mb-6 flex justify-center">
  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300">
    ✓ Ready to Download
  </span>
</div>

<div className="mb-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

  <h3 className="mb-5 text-center text-xl font-bold text-cyan-300">
    PDF Information
  </h3>

<div className="mb-6 flex justify-center">
  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300">
    ✅ PDF Generated Successfully
  </span>
</div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

    <div>
      <p className="text-xs uppercase text-slate-500">
        Images
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {files.length}
      </p>
    </div>

    <div>
      <p className="text-xs uppercase text-slate-500">
        Pages
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {files.length}
      </p>
    </div>

    <div>
      <p className="text-xs uppercase text-slate-500">
        Page Size
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {pageMode.toUpperCase()}
      </p>
    </div>

    <div>
      <p className="text-xs uppercase text-slate-500">
        Orientation
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {orientation}
      </p>
    </div>

    <div>
      <p className="text-xs uppercase text-slate-500">
        PDF Size
      </p>

      <p className="mt-1 text-lg font-bold text-cyan-300">
        {pdfSize.toFixed(2)} KB
      </p>
    </div>

  </div>

</div>

    <a
      href={downloadUrl}
      download="novatools-images.pdf"
     className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
    >
   ⬇ Download High Quality PDF
    </a>
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
        Can I convert multiple JPG files into one PDF?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. Upload multiple images and Nova Tools will combine them into one PDF.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is JPG to PDF free?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. You can convert JPG and PNG images to PDF without creating an account.
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
        <div className="mt-12">
          <h2 className="text-2xl font-bold">
            How to convert JPG to PDF
          </h2>

         <ol className="mt-5 space-y-3 text-slate-300">
            <li>1. Select one or multiple JPG or PNG images.</li>
            <li>2. Choose A4 Document or Fit to Image.</li>
            <li>3. Press Convert to PDF.</li>
            <li>4. Download your PDF.</li>
          </ol>
        </div>
      </ToolLayout>
      <RelatedTools current="/jpg-to-pdf" />
      <SiteFooter />
      <NovaAssistant state={robotState} />
    </main>
    </>
  );
}
type SortableImageCardProps = {
  file: File;
  index: number;
  removeImage: (index: number) => void;
};

function SortableImageCard({
  file,
  index,
  removeImage,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: file.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
     className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 cursor-grab active:cursor-grabbing"
    >
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="h-40 w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="mt-3">
        <p className="break-all text-sm font-semibold text-white">
          {index + 1}. {file.name}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {(file.size / 1024).toFixed(2)} KB
        </p>
      </div>

      <button
        type="button"
        onClick={() => removeImage(index)}
        className="mt-4 w-full rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
}
