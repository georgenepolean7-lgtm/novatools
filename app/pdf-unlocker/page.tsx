"use client";

import { ChangeEvent, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import { decryptPdfWithQpdf } from "@/lib/qpdf";
import { saveAs } from "file-saver";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function PdfUnlockerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("" );
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) {
      loadFile(selected);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) {
      loadFile(dropped);
    }
  }

  function loadFile(pdfFile: File) {
    if (pdfFile.type !== "application/pdf" && !pdfFile.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Please upload a valid PDF document (.pdf).");
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      return;
    }

    if (pdfFile.size > 50 * 1024 * 1024) {
      setMessage("File exceeds maximum 50MB limit for in-browser decryption.");
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      return;
    }

    setFile(pdfFile);
    setPassword("");
    setResultBlob(null);
    setResultSize(null);
    setMessage("");
    setRobotState("idle");
  }

  async function handleUnlock() {
    if (!file) {
      setMessage("Please select a PDF document first.");
      return;
    }

    if (!password) {
      setMessage("Please enter the password for this PDF document.");
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2000);
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Initializing in-browser QPDF decryption engine...");

    try {
      const buffer = await file.arrayBuffer();
      const inputBytes = new Uint8Array(buffer);

      setMessage("Decrypting PDF with QPDF WebAssembly...");
      const decryptedBytes = await decryptPdfWithQpdf(inputBytes, password);

      const blob = new Blob([decryptedBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      setResultBlob(blob);
      setResultSize(blob.size);
      setMessage("PDF successfully unlocked! Password protection has been removed.");
      setProcessing(false);
      setRobotState("success");
    } catch (err: unknown) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      const errMessage =
        err instanceof Error
          ? err.message
          : "Failed to unlock PDF. Please verify your password and try again.";
      setMessage(errMessage);
      setTimeout(() => setRobotState("idle"), 3500);
    }
  }

  function handleDownload() {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/-protected$/, "");
    saveAs(resultBlob, `${baseName}-unlocked.pdf`);
  }

  function resetTool() {
    setFile(null);
    setPassword("");
    setShowPassword(false);
    setResultBlob(null);
    setResultSize(null);
    setMessage("");
    setProcessing(false);
    setRobotState("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <ToolSEO
        name="PDF Password Unlocker"
        path="/pdf-unlocker"
        description="Permanently remove known passwords and encryption from PDF files online. 100% private in-browser QPDF WebAssembly decryption."
        faqs={[
          {
            question: "Can this tool unlock a PDF without knowing the password?",
            answer:
              "No. To protect document privacy and security, this tool decrypts and removes passwords only when the valid password is provided by the document owner.",
          },
          {
            question: "Is my document uploaded to a server to decrypt?",
            answer:
              "No! The entire decryption process runs inside your web browser using QPDF compiled to WebAssembly. No files or passwords ever leave your machine.",
          },
          {
            question: "Will the resulting PDF ask for a password again?",
            answer:
              "No. The downloaded PDF will have all password protection and permissions restrictions permanently removed.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="SECURITY TOOL"
          title="PDF Password Unlocker"
          description="Remove known passwords and security restrictions from PDF documents completely client-side."
        >
          {!file && (
            <UploadCard
              title="Select Protected PDF"
              description="Upload the password-protected PDF document you wish to unlock."
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/15 bg-white/5 hover:border-cyan-400/40 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-inner">
                  🔓
                </div>
                <p className="mt-4 text-base font-bold text-white">
                  Drag &amp; drop your protected PDF here
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  100% Private Client-Side Decryption via QPDF WebAssembly
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-unlock-upload"
                  aria-label="Upload protected PDF document"
                />

                <label
                  htmlFor="pdf-unlock-upload"
                  className="mt-6 cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
                >
                  Choose PDF File
                </label>
              </div>
            </UploadCard>
          )}

          {file && !resultBlob && (
            <UploadCard
              title="Enter Document Password"
              description="Provide the password to decrypt and permanently remove security from this PDF."
            >
              <div className="space-y-6">
                {/* File summary badge */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Protected Document
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Change File
                  </button>
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Document Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the PDF password..."
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                      aria-label="Enter PDF password to unlock"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {message && (
                  <p className="text-center text-xs font-medium text-amber-400">
                    {message}
                  </p>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    disabled={processing || !password}
                    onClick={handleUnlock}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-40"
                  >
                    {processing ? "Decrypting PDF..." : "🔓 Unlock & Decrypt PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </UploadCard>
          )}

          {resultBlob && (
            <ResultCard
              title="PDF Unlocked Successfully! 🔓"
              description="Password protection has been permanently removed. Your new PDF can now be opened without any password."
            >
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-4xl text-emerald-400 shadow-xl">
                  ✓
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    {file?.name.replace(/\.[^/.]+$/, "").replace(/-protected$/, "")}-unlocked.pdf
                  </p>
                  <p className="text-xs text-slate-400">
                    Unlocked Size: {((resultSize || 0) / (1024 * 1024)).toFixed(2)} MB • Unencrypted
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-3.5 font-bold text-white shadow-xl transition hover:scale-105"
                  >
                    Download Unlocked PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Unlock Another PDF
                  </button>
                </div>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Remove Password from a PDF</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your password-protected PDF document.</li>
              <li>Type the correct password into the security box.</li>
              <li>Click &quot;Unlock &amp; Decrypt PDF&quot; to decrypt the file in browser memory.</li>
              <li>Download your unlocked PDF file with password protection permanently removed.</li>
            </ol>
          </div>

          <RelatedTools current="/pdf-unlocker" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
