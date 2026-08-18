"use client";

import { ChangeEvent, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import { encryptPdfWithQpdf, QpdfEncryptionStrength } from "@/lib/qpdf";
import { saveAs } from "file-saver";

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function PdfPasswordProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [encryptionStrength, setEncryptionStrength] = useState<QpdfEncryptionStrength>("256");

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
      setMessage("File exceeds maximum 50MB limit for in-browser encryption.");
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2500);
      return;
    }

    setFile(pdfFile);
    setResultBlob(null);
    setResultSize(null);
    setMessage("");
    setRobotState("idle");
  }

  async function handleEncrypt() {
    if (!file) {
      setMessage("Please select a PDF document first.");
      return;
    }

    if (!password || password.length < 3) {
      setMessage("Please enter a password of at least 3 characters.");
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2000);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please verify and confirm your password.");
      setRobotState("error");
      setTimeout(() => setRobotState("idle"), 2000);
      return;
    }

    setProcessing(true);
    setRobotState("processing");
    setMessage("Initializing in-browser QPDF encryption engine...");

    try {
      const buffer = await file.arrayBuffer();
      const inputBytes = new Uint8Array(buffer);

      setMessage(`Applying ${encryptionStrength}-bit AES encryption client-side...`);
      const encryptedBytes = await encryptPdfWithQpdf(
        inputBytes,
        password,
        password,
        encryptionStrength
      );

      const blob = new Blob([encryptedBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      setResultBlob(blob);
      setResultSize(blob.size);
      setMessage("PDF successfully encrypted with ISO 32000 standard AES security!");
      setProcessing(false);
      setRobotState("success");
    } catch (err: unknown) {
      console.error(err);
      setProcessing(false);
      setRobotState("error");
      const errMessage =
        err instanceof Error
          ? err.message
          : "Failed to encrypt PDF. Please verify your file and try again.";
      setMessage(errMessage);
      setTimeout(() => setRobotState("idle"), 3000);
    }
  }

  function handleDownload() {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    saveAs(resultBlob, `${baseName}-protected.pdf`);
  }

  function resetTool() {
    setFile(null);
    setPassword("");
    setConfirmPassword("");
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
        name="PDF Password Protector"
        path="/pdf-password-protect"
        description="Password protect and encrypt PDF files online using standard 256-bit AES encryption with 100% in-browser privacy."
        faqs={[
          {
            question: "How does Nova Tools encrypt PDFs without a server?",
            answer:
              "We run QPDF compiled to WebAssembly directly inside an isolated browser Web Worker. Your PDF bytes and passwords never leave your computer.",
          },
          {
            question: "What encryption standard is applied?",
            answer:
              "We apply ISO 32000 standard 256-bit AES (Advanced Encryption Standard) encryption with revision 6 security handlers, compatible with all modern PDF readers including Adobe Acrobat, Chrome, and Apple Preview.",
          },
          {
            question: "Are my passwords stored or logged anywhere?",
            answer:
              "Never. Passwords exist only in temporary browser memory during the WebAssembly execution and are discarded immediately after processing.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="SECURITY TOOL"
          title="PDF Password Protector"
          description="Protect and encrypt PDF documents with military-grade 256-bit AES encryption completely client-side."
        >
          {!file && (
            <UploadCard
              title="Select PDF Document"
              description="Upload the PDF file you want to password protect (Max 50MB)."
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
                  🔒
                </div>
                <p className="mt-4 text-base font-bold text-white">
                  Drag &amp; drop your PDF document here
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  100% Private In-Browser QPDF WebAssembly Encryption
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-password-upload"
                  aria-label="Upload PDF document to password protect"
                />

                <label
                  htmlFor="pdf-password-upload"
                  className="mt-6 cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
                >
                  Choose PDF File
                </label>
              </div>
            </UploadCard>
          )}

          {file && !resultBlob && (
            <UploadCard
              title="Set Document Password"
              description="Enter and confirm the password required to open this PDF."
            >
              <div className="space-y-6">
                {/* File summary badge */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
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

                {/* Password input fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Enter Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password..."
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                        aria-label="Enter password for PDF"
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

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password to confirm..."
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                      aria-label="Confirm password for PDF"
                    />
                  </div>

                  {/* Encryption Strength Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Encryption Strength
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEncryptionStrength("256")}
                        className={`rounded-2xl border p-3 text-left transition ${
                          encryptionStrength === "256"
                            ? "border-cyan-400 bg-cyan-500/10 text-white"
                            : "border-white/10 bg-black/20 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">256-bit AES (Recommended)</p>
                        <p className="text-[11px] text-slate-400">Military-grade ISO 32000 standard</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEncryptionStrength("128")}
                        className={`rounded-2xl border p-3 text-left transition ${
                          encryptionStrength === "128"
                            ? "border-cyan-400 bg-cyan-500/10 text-white"
                            : "border-white/10 bg-black/20 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">128-bit AES</p>
                        <p className="text-[11px] text-slate-400">Legacy reader compatibility</p>
                      </button>
                    </div>
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
                    disabled={processing || !password || !confirmPassword}
                    onClick={handleEncrypt}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-40"
                  >
                    {processing ? "Encrypting PDF..." : "🔒 Encrypt PDF Document"}
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
              title="PDF Protected Successfully! 🔒"
              description="Your PDF is now encrypted with 256-bit AES. It cannot be opened without the password."
            >
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-4xl text-emerald-400 shadow-xl">
                  ✓
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    {file?.name.replace(/\.[^/.]+$/, "")}-protected.pdf
                  </p>
                  <p className="text-xs text-slate-400">
                    Protected Size: {((resultSize || 0) / (1024 * 1024)).toFixed(2)} MB • {encryptionStrength}-bit AES
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-slate-300">
                  💡 <strong>Important:</strong> Keep your password safe. Without the password, no one (including Nova Tools) can recover the document.
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-3.5 font-bold text-white shadow-xl transition hover:scale-105"
                  >
                    Download Encrypted PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Protect Another PDF
                  </button>
                </div>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Password Protect a PDF</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Select and upload your PDF file from your device.</li>
              <li>Type and confirm your password with 256-bit AES encryption selected.</li>
              <li>Click &quot;Encrypt PDF Document&quot; to perform client-side encryption.</li>
              <li>Download your secure password-protected PDF document immediately.</li>
            </ol>
          </div>

          <RelatedTools current="/pdf-password-protect" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
