"use client";

import { ChangeEvent, useState } from "react";


import { PDFDocument } from "pdf-lib";

import JSZip from "jszip";

import { saveAs } from "file-saver";

import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";

export default function SplitPdfPage() {

  const [file, setFile] = useState<File | null>(null);

  const [pageCount, setPageCount] = useState(0);
const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const [previewName, setPreviewName] = useState("");

  const [startPage, setStartPage] = useState(1);

  const [endPage, setEndPage] = useState(1);

  const [customPages, setCustomPages] = useState("");

  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState("");

  const [robotState, setRobotState] = useState<
    "idle" |
    "uploading" |
    "processing" |
    "success" |
    "error"
  >("idle");
  async function handleFile(
  event: ChangeEvent<HTMLInputElement>
) {

  const selectedFile =
    event.target.files?.[0];

  if (!selectedFile) return;

  if (
    selectedFile.type !==
    "application/pdf"
  ) {

    setMessage(
      "Please select a PDF file."
    );

    return;

  }

  setRobotState("uploading");

  setProcessing(true);

  setMessage("");

  try {

    const bytes =
      await selectedFile.arrayBuffer();

    const pdf =
      await PDFDocument.load(bytes);

    const totalPages =
      pdf.getPageCount();

    setFile(selectedFile);

    setPreviewName(
      selectedFile.name
    );

    setPageCount(totalPages);
setSelectedPages(
  Array.from(
    { length: totalPages },
    (_, i) => i + 1
  )
);

    setStartPage(1);

    setEndPage(totalPages);

    setRobotState("success");

    setMessage(
      `${totalPages} pages detected.`
    );

    setTimeout(() => {

      setRobotState("idle");

    }, 1500);

  } catch {

    setRobotState("error");

    setMessage(
      "Invalid PDF file."
    );

  } finally {

    setProcessing(false);

  }

}
function resetTool() {

  setFile(null);

  setPreviewName("");

  setPageCount(0);

  setStartPage(1);

  setEndPage(1);

  setMessage("");

  setProcessing(false);

  setRobotState("idle");

}

   async function splitPdf() {

  if (!file) {

    setMessage(
      "Please upload a PDF."
    );

    return;

  }

  if (
    startPage < 1 ||
    endPage > pageCount ||
    startPage > endPage
  ) {

    setMessage(
      "Please enter a valid page range."
    );

    return;

  }

  setProcessing(true);

  setRobotState("processing");

  setMessage("");

  try {

    const bytes =
      await file.arrayBuffer();

    const sourcePdf =
      await PDFDocument.load(bytes);

    const newPdf =
      await PDFDocument.create();

    let pages: number[] = [];

if (customPages.trim()) {

 pages = [
  ...new Set(
    customPages
      .split(",")
      .map((p) => Number(p.trim()))
      .filter(
        (p) =>
          !Number.isNaN(p) &&
          p >= 1 &&
          p <= pageCount
      )
  ),
].sort((a, b) => a - b);
} else {

  for (
    let i = startPage;
    i <= endPage;
    i++
  ) {

    pages.push(i);

  }

}

for (const pageNumber of pages) {

  const [page] =
    await newPdf.copyPages(
      sourcePdf,
      [pageNumber - 1]
    );

  newPdf.addPage(page);

}

    const pdfBytes = await newPdf.save();

const blob = new Blob(
  [
    new Uint8Array(pdfBytes).slice().buffer as ArrayBuffer,
  ],
  {
    type: "application/pdf",
  }
);

    saveAs(
      blob,
      `split-pages-${startPage}-${endPage}.pdf`
    );

    setRobotState("success");

    setMessage(
      "PDF split completed successfully."
    );

    setTimeout(() => {

      setRobotState("idle");

    }, 2000);

  } catch (error) {

    console.error(error);

    setRobotState("error");

    setMessage(
      "Failed to split PDF."
    );

  } finally {

    setProcessing(false);

  }

}

return (
  <>

<ToolSEO
  name="Split PDF"
  path="/split-pdf"
  description="Split PDF files online and extract selected pages for free."
  faqs={[
    {
      question: "How do I split a PDF?",
      answer:
        "Upload your PDF, choose the page range or custom pages, then click Split PDF.",
    },
    {
      question: "Is this PDF splitter free?",
      answer:
        "Yes. Nova Tools lets you split PDF files online for free.",
    },
    {
      question: "Can I extract only selected pages?",
      answer:
        "Yes. You can extract a page range or specific pages.",
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
      title="Split PDF"
      description="Extract selected pages from your PDF instantly."
    >

      <UploadCard
        title="Upload PDF"
        description="Select a PDF file to split."
      >

        <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-cyan-500/30 bg-white/5 p-10 text-center transition hover:border-cyan-400">

          <div className="text-6xl">
            📄
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            Upload PDF
          </h2>

          <p className="mt-3 text-slate-400">
            Click here to select a PDF
          </p>

          <input
            hidden
            type="file"
            accept="application/pdf"
            onChange={handleFile}
          />

        </label>
                {file && (

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

            <h3 className="mb-6 text-2xl font-bold text-cyan-300">
              PDF Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl bg-black/20 p-5">

                <p className="text-xs uppercase text-slate-500">
                  File Name
                </p>

                <p className="mt-2 break-all font-bold">
                  {previewName}
                </p>

              </div>

              <div className="rounded-2xl bg-black/20 p-5">

                <p className="text-xs uppercase text-slate-500">
                  Total Pages
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {pageCount}
                </p>

              </div>

            </div>

          </div>

        )}
                {file && (

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

           <h3 className="mb-6 text-2xl font-bold text-cyan-300">
  Split Pages
</h3>

<div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Start Page
                </label>

                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={startPage}
                  onChange={(e) =>
                    setStartPage(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  End Page
                </label>
<div className="md:col-span-2">

  <label className="mb-2 block text-sm font-semibold">
    Custom Pages (Optional)
  </label>

  <input
    type="text"
    value={customPages}
    onChange={(e) =>
      setCustomPages(e.target.value)
    }
    placeholder="Example: 1,3,5,8"
    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-cyan-400"
  />

  <p className="mt-2 text-sm text-slate-400">
    Leave empty to use Start Page and End Page.
  </p>

</div>
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={endPage}
                  onChange={(e) =>
                    setEndPage(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>

            </div>

            <button
              type="button"
              onClick={splitPdf}
              disabled={processing}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:scale-[1.02] disabled:opacity-50"
            >
              ✂ Split PDF
            </button>

          </div>

        )}
     
        {message && (

          <ResultCard
            title="Status"
            description={message}
          >

            <div className="rounded-2xl bg-cyan-500/10 p-5 text-center">

              <p className="text-lg font-semibold text-cyan-300">
                {message}
              </p>

            </div>

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
        Is this PDF splitter free?
      </h3>
      <p className="mt-2 text-slate-300">
        Yes. You can split PDF files online for free without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can I extract only selected pages?
      </h3>
      <p className="mt-2 text-slate-300">
        Yes. Choose a page range or enter custom page numbers.
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
  </div>
</div>
    </ToolLayout>

    <RelatedTools current="/split-pdf" />

    <SiteFooter />

    <NovaAssistant
      state={robotState}
    />

  </main>
</>
);

}