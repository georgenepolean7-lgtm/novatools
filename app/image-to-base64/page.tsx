"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type FormatMode = "data-uri" | "raw" | "html" | "css";
type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function ImageToBase64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string>("");
  const [rawBase64, setRawBase64] = useState<string>("");
  const [formatMode, setFormatMode] = useState<FormatMode>("data-uri");
  const [copied, setCopied] = useState(false);
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null);

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/") && !selected.name.endsWith(".svg")) {
      setMessage("Please select a valid image file (JPG, PNG, WebP, GIF, SVG).");
      return;
    }

    processImageFile(selected);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;

    if (!dropped.type.startsWith("image/") && !dropped.name.endsWith(".svg")) {
      setMessage("Please drop a valid image file.");
      return;
    }

    processImageFile(dropped);
  }

  function processImageFile(imageFile: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(imageFile);
    setProcessing(true);
    setRobotState("uploading");
    setMessage("");
    setCopied(false);

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fullDataUri = (event.target?.result as string) || "";
      const raw = fullDataUri.split(",")[1] || "";

      setBase64String(fullDataUri);
      setRawBase64(raw);
      setProcessing(false);
      setRobotState("success");
      setMessage("Image converted to Base64 successfully.");
      setTimeout(() => setRobotState("idle"), 2500);
    };

    reader.onerror = () => {
      setProcessing(false);
      setRobotState("error");
      setMessage("Failed to read the image file.");
      setTimeout(() => setRobotState("idle"), 2500);
    };

    reader.readAsDataURL(imageFile);
  }

  function getFormattedOutput(): string {
    if (!base64String) return "";
    switch (formatMode) {
      case "raw":
        return rawBase64;
      case "html":
        return `<img src="${base64String}" alt="${file?.name || "image"}" />`;
      case "css":
        return `background-image: url("${base64String}");`;
      case "data-uri":
      default:
        return base64String;
    }
  }

  async function copyToClipboard() {
    const text = getFormattedOutput();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setMessage("Failed to copy to clipboard.");
    }
  }

  function downloadAsTxt() {
    const text = getFormattedOutput();
    if (!text || !file) return;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(/\.[^/.]+$/, "")}-base64.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function resetAll() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(null);
    setPreviewUrl(null);
    setBase64String("");
    setRawBase64("");
    setImageDims(null);
    setMessage("");
    setCopied(false);
    setProcessing(false);
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const outputContent = getFormattedOutput();
  const charCount = outputContent.length;
  const originalSizeKB = file ? file.size / 1024 : 0;
  const encodedSizeKB = (charCount * 0.75) / 1024;

  return (
    <>
      <ToolSEO
        name="Image to Base64 Converter"
        path="/image-to-base64"
        description="Convert JPG, PNG, WebP, GIF and SVG images to Base64 strings online. 100% private in-browser encoding with HTML & CSS snippets."
        faqs={[
          {
            question: "What is Image to Base64 conversion?",
            answer:
              "Base64 encoding transforms binary image data into an ASCII text string, allowing you to embed images directly into HTML, CSS, or JSON without separate HTTP file requests.",
          },
          {
            question: "How do I embed a Base64 image in HTML?",
            answer:
              "Select 'HTML <img>' format mode and copy the generated snippet directly into your HTML code.",
          },
          {
            question: "Is my image uploaded to any server?",
            answer:
              "No. Encoding is done entirely in your browser using standard HTML5 FileReader APIs, keeping your files 100% private.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        

        <ToolLayout
          badge="FREE DEVELOPER TOOL"
          title="Image to Base64 Converter"
          description="Encode JPG, PNG, WebP, GIF, and SVG images into Base64 strings and Data URIs instantly."
        >
          <UploadCard
            title="Upload Image to Encode"
            description="Select or drop any image file."
          >
            {!base64String ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/50"
                }`}
              >
                <div className="text-5xl">🔡</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Choose an image to convert
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Supports JPG, PNG, WebP, GIF, SVG, BMP
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Browse Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">
                    {file?.name}
                  </span>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    Change Image
                  </button>
                </div>

                {/* Quick Details Bar */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                    <p className="text-xs text-slate-400">MIME Type</p>
                    <p className="mt-1 truncate text-xs font-bold text-white">
                      {file?.type || "image/png"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                    <p className="text-xs text-slate-400">Original Size</p>
                    <p className="mt-1 text-xs font-bold text-white">
                      {originalSizeKB.toFixed(1)} KB
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                    <p className="text-xs text-slate-400">Encoded Characters</p>
                    <p className="mt-1 text-xs font-bold text-cyan-300">
                      {charCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                    <p className="text-xs text-slate-400">Dimensions</p>
                    <p className="mt-1 text-xs font-bold text-white">
                      {imageDims ? `${imageDims.width}×${imageDims.height}` : "-"}
                    </p>
                  </div>
                </div>

                {/* Format Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Output Format
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { id: "data-uri", label: "Data URI" },
                      { id: "raw", label: "Raw Base64" },
                      { id: "html", label: "HTML <img>" },
                      { id: "css", label: "CSS Background" },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormatMode(fmt.id as FormatMode)}
                        className={`rounded-xl border py-2 text-xs font-semibold transition ${
                          formatMode === fmt.id
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-md"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Base64 Output Text Area */}
                <div>
                  <textarea
                    readOnly
                    value={outputContent}
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-slate-300 outline-none focus:border-cyan-400"
                  />
                  {charCount > 500000 && (
                    <p className="mt-1 text-xs text-amber-400">
                      ⚠️ Note: This is a large image string ({charCount.toLocaleString()} chars). Downloading as text is recommended for very large files.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    <span>📋</span> {copied ? "Copied to Clipboard! ✓" : "Copy to Clipboard"}
                  </button>

                  <button
                    type="button"
                    onClick={downloadAsTxt}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3.5 font-bold text-white transition hover:border-cyan-400 hover:bg-cyan-500/10"
                  >
                    <span>💾</span> Download as .TXT
                  </button>
                </div>
              </div>
            )}

            {message && !base64String && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {previewUrl && (
            <ResultCard
              title="Image Preview"
              description="Visual verification of your uploaded image asset."
            >
              <div className="space-y-4 text-center">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4">
                  <img
                    src={previewUrl}
                    alt="Encoded preview"
                    className="mx-auto max-h-60 rounded-xl object-contain"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Estimated encoded string size: ~{encodedSizeKB.toFixed(1)} KB
                </p>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to Convert Image to Base64</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload or drag and drop your image file.</li>
              <li>Select your preferred format: Data URI, Raw Base64 string, HTML tag, or CSS rule.</li>
              <li>Click &quot;Copy to Clipboard&quot; or &quot;Download as .TXT&quot;.</li>
            </ol>
          </div>

          <RelatedTools current="/image-to-base64" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
