"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";

import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";


import { PDFDocument } from "pdf-lib";

import {
  UploadCloud,
  FileText,
} from "lucide-react";

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

import {
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export default function MergePdfPage() {

  const [files, setFiles] = useState<File[]>([]);

  const [downloadUrl, setDownloadUrl] =
    useState<string | null>(null);

  const [pdfSize, setPdfSize] =
    useState<number | null>(null);

  const [processing, setProcessing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [robotState, setRobotState] =
    useState<
      "idle" |
      "uploading" |
      "processing" |
      "success" |
      "error"
    >("idle");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);
  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
  const selected = Array.from(event.target.files ?? []);

  const validFiles = selected.filter(
    (file) => file.type === "application/pdf"
  );

  if (validFiles.length === 0) {
    setMessage("Please select PDF files.");
    return;
  }

  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
  }

  setRobotState("uploading");

  setTimeout(() => {
    setRobotState("idle");
  }, 1200);

  setFiles(validFiles);
  setDownloadUrl(null);
  setPdfSize(null);
  setMessage("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}

function removePdf(index: number) {
  const updated = files.filter(
    (_, i) => i !== index
  );

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
  setProcessing(false);
  setRobotState("idle");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id) {
    return;
  }

  setFiles((items) => {
    const oldIndex = items.findIndex(
      (file) => file.name === active.id
    );

    const newIndex = items.findIndex(
      (file) => file.name === over.id
    );

    return arrayMove(
      items,
      oldIndex,
      newIndex
    );
  });
}
async function mergePdf() {
  if (files.length < 2) {
    setMessage("Please select at least 2 PDF files.");
    return;
  }

  setProcessing(true);

  setRobotState("processing");

  setMessage("Merging PDF files...");

  setDownloadUrl(null);
  setPdfSize(null);

  try {
    const mergedPdf = await PDFDocument.create();

    for (let index = 0; index < files.length; index++) {
      setMessage(
        `Processing PDF ${index + 1} of ${files.length}...`
      );

      const file = files[index];

      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      const copiedPages =
        await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedBytes =
      await mergedPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

    const safeBytes = new Uint8Array(
      mergedBytes.length
    );

    safeBytes.set(mergedBytes);

    const blob = new Blob(
      [safeBytes.buffer],
      {
        type: "application/pdf",
      }
    );

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    const url =
      URL.createObjectURL(blob);

    setDownloadUrl(url);

    setPdfSize(blob.size / 1024);

    setMessage(
      "PDF merged successfully."
    );

    setRobotState("success");

    setTimeout(() => {
      setRobotState("idle");
    }, 2500);

  } catch (error) {

    console.error(error);

    setMessage(
      "Unable to merge these PDF files."
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
  name="Merge PDF"
  path="/merge-pdf"
  description="Merge multiple PDF files into one document online for free."
  faqs={[
    {
      question: "How do I merge PDF files?",
      answer:
        "Upload two or more PDF files, arrange them in the correct order and click Merge PDF.",
    },
    {
      question: "Is this PDF merger free?",
      answer:
        "Yes. Nova Tools lets you merge PDF files online for free.",
    },
    {
      question: "Are my PDF files secure?",
      answer:
        "Your uploaded PDF files are processed securely and are not permanently stored.",
    },
    {
      question: "Can I rearrange pages before merging?",
      answer:
        "Yes. Drag and drop the uploaded PDF files to change their order before merging.",
    },
  ]}
/>

<main className="min-h-screen bg-[#030712] text-white">

    

    <ToolLayout
      badge="FREE PDF TOOL"
      title="Merge PDF"
      description="Combine multiple PDF files into one high quality PDF document."
    >

      <UploadCard
        title="Upload PDF Files"
        description="Upload two or more PDF files to merge them into a single PDF."
      >

        <label
          className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-12 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-900/70"
        >

          <UploadCloud className="h-16 w-16 text-cyan-400 transition group-hover:scale-110" />

          <h2 className="mt-6 text-2xl font-bold">
            Drag & Drop PDF Files
          </h2>

          <p className="mt-3 text-center text-slate-400">
            or click to browse PDF documents
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFiles}
            className="hidden"
          />

        </label>

        {files.length > 0 && (

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

            <h3 className="text-xl font-bold text-cyan-300">
              Selected PDF Files
            </h3>

            <p className="mt-2 text-slate-400">
              Drag files to change merge order.
            </p>

            <div className="mt-6">

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >

                <SortableContext
                  items={files.map((file) => file.name)}
                  strategy={verticalListSortingStrategy}
                >
                                    {files.map((file, index) => (
                    <SortablePdfCard
                      key={file.name}
                      file={file}
                      index={index}
                      removePdf={removePdf}
                    />
                  ))}

                </SortableContext>

              </DndContext>

            </div>

          </div>

        )}

        <button
          type="button"
          onClick={mergePdf}
          disabled={files.length < 2 || processing}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing
            ? "Merging PDFs..."
            : "Merge PDF"}
        </button>

        {message && (
          <p className="mt-6 text-center font-medium text-cyan-300">
            {message}
          </p>
        )}

        {downloadUrl && (
          <ResultCard
            title="Merged PDF Ready"
            description="Your PDF files have been merged successfully."
          >

            <div className="mb-6 flex justify-center">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300">
                ✅ Ready to Download
              </span>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

              <h3 className="mb-6 text-center text-xl font-bold text-cyan-300">
                Merge Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    PDF Files
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {files.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Output
                  </p>

                  <p className="mt-2 font-bold text-emerald-300">
                    PDF
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Size
                  </p>

                  <p className="mt-2 font-bold text-cyan-300">
                    {pdfSize?.toFixed(2)} KB
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
                        <div className="mt-8 space-y-4">

              <a
                href={downloadUrl}
                download="novatools-merged.pdf"
                className="block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/50"
              >
                ⬇ Download Merged PDF
              </a>

              <button
                type="button"
                onClick={resetAll}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                🔄 Merge Another PDF
              </button>

            </div>

          </ResultCard>

        )}

      </UploadCard>

      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <h2 className="text-3xl font-bold">
          How to Merge PDF Files
        </h2>
<div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
  <h2 className="text-3xl font-bold text-white">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-6">
    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is this PDF merger free?
      </h3>
      <p className="mt-2 text-slate-300">
        Yes. You can merge multiple PDF files online without creating an account.
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
        Can I change the file order?
      </h3>
      <p className="mt-2 text-slate-300">
        Yes. Drag and drop the uploaded files to choose the merge order before creating the final PDF.
      </p>
    </div>
  </div>
</div>
        <ol className="mt-6 space-y-4 text-slate-300">

          <li>1. Upload two or more PDF files.</li>

          <li>2. Drag files to change the merge order.</li>

          <li>3. Click Merge PDF.</li>

          <li>4. Wait while NovaTools combines the documents.</li>

          <li>5. Download your merged PDF.</li>

        </ol>

      </div>

    </ToolLayout>
<RelatedTools current="/merge-pdf" />
    <SiteFooter />

    <NovaAssistant
      state={robotState}
    />

  </main>
  </>
);
}

type SortablePdfCardProps = {
  file: File;
  index: number;
  removePdf: (index: number) => void;
};

function SortablePdfCard({
  file,
  index,
  removePdf,
}: SortablePdfCardProps) {
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
      className="group relative mb-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <FileText className="h-7 w-7 text-red-400" />
          </div>

          <div>

            <p className="break-all text-sm font-semibold text-white">
              {index + 1}. {file.name}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {(file.size / 1024).toFixed(2)} KB
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() => removePdf(index)}
          className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
        >
          Remove
        </button>

      </div>

    </div>
  );
}