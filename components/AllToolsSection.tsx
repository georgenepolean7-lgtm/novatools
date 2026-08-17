"use client";

import { useMemo, useState } from "react";
import ToolCard from "./ToolCard";

const imageTools = [
  {
    title: "Compress Image",
    description: "Reduce image size without losing quality.",
    icon: "🖼️",
    href: "/compress-image",
  },
  {
    title: "Image Resizer",
    description: "Resize JPG and PNG images instantly.",
    icon: "📐",
    href: "/image-resizer",
  },
  {
    title: "Signature Resizer",
    description: "Resize signatures for documents and exams.",
    icon: "✍️",
    href: "/signature-resizer",
  },
  {
    title: "JPG to PNG",
    description: "Convert JPG and JPEG images to lossless PNG format.",
    icon: "🖼️",
    href: "/jpg-to-png",
  },
  {
    title: "PNG to JPG",
    description: "Convert PNG images to compact JPG format.",
    icon: "📷",
    href: "/png-to-jpg",
  },
  {
    title: "WebP Converter",
    description: "Convert images to and from ultra-compact WebP format.",
    icon: "⚡",
    href: "/webp-converter",
  },
  {
    title: "Image Cropper",
    description: "Crop photos with custom rectangles and aspect ratios.",
    icon: "✂️",
    href: "/image-cropper",
  },
  {
    title: "Image Rotator",
    description: "Rotate 90°, 180° or fine angles with auto-fit.",
    icon: "🔄",
    href: "/image-rotator",
  },
  {
    title: "Image to Base64",
    description: "Convert images to Base64 text strings and Data URIs.",
    icon: "🔡",
    href: "/image-to-base64",
  },
  {
    title: "Image Metadata",
    description: "View and strip EXIF camera & GPS metadata from photos.",
    icon: "🔍",
    href: "/image-metadata",
  },
  {
    title: "GIF to PNG",
    description: "Extract lossless PNG frames from GIF images.",
    icon: "🎬",
    href: "/gif-to-png",
  },
  {
    title: "BMP to JPG",
    description: "Convert uncompressed BMP bitmaps to optimized JPG.",
    icon: "🖼️",
    href: "/bmp-to-jpg",
  },
];

const pdfTools = [
  {
    title: "Compress PDF",
    description: "Reduce PDF size while preserving clarity.",
    icon: "📕",
    href: "/compress-pdf",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    icon: "📄",
    href: "/merge-pdf",
  },
  {
    title: "Split PDF",
    description: "Extract selected PDF pages into separate files.",
    icon: "✂️",
    href: "/split-pdf",
  },
  {
    title: "Rotate PDF",
    description: "Rotate all or selected pages permanently.",
    icon: "🔄",
    href: "/rotate-pdf",
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images into high quality PDF.",
    icon: "🖼️",
    href: "/jpg-to-pdf",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages into crisp JPG images.",
    icon: "📷",
    href: "/pdf-to-jpg",
  },
  {
    title: "Image to PDF",
    description: "Combine multiple JPG, PNG, and WebP images into PDF.",
    icon: "📑",
    href: "/image-to-pdf",
  },
  {
    title: "PDF Page Extractor",
    description: "Extract specific pages or page ranges from PDF.",
    icon: "✂️",
    href: "/pdf-page-extractor",
  },
  {
    title: "PDF Page Deleter",
    description: "Permanently delete unwanted pages from PDF files.",
    icon: "🗑️",
    href: "/pdf-page-deleter",
  },
  {
    title: "PDF Watermark",
    description: "Stamp custom text watermarks onto all PDF pages.",
    icon: "💧",
    href: "/pdf-watermark",
  },
  {
    title: "PDF Password Protector",
    description: "Password protect and encrypt PDF files with 256-bit AES.",
    icon: "🔒",
    href: "/pdf-password-protect",
  },
  {
    title: "PDF Unlocker",
    description: "Remove passwords and decrypt PDF documents instantly.",
    icon: "🔓",
    href: "/pdf-unlocker",
  },
];

const textTools = [
  {
    title: "Word Counter",
    description: "Count words, characters, sentences, and reading time.",
    icon: "📊",
    href: "/word-counter",
  },
  {
    title: "Character Counter",
    description: "Accurate character counter with space exclusions and limits.",
    icon: "🔢",
    href: "/character-counter",
  },
  {
    title: "Case Converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case, and more.",
    icon: "🔤",
    href: "/case-converter",
  },
  {
    title: "Text Cleaner",
    description: "Remove extra spaces, empty lines, and format messy text.",
    icon: "🧹",
    href: "/text-cleaner",
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate dummy placeholder text for layouts and mockups.",
    icon: "📝",
    href: "/lorem-ipsum-generator",
  },
];

const aiTools = [
  {
    title: "Tamil Image to Text",
    description: "Extract Tamil text from images using in-browser OCR.",
    icon: "🤖",
    href: "/tamil-image-to-text",
  },
];

export default function AllToolsSection() {
  const [search, setSearch] = useState("");

  const filteredImageTools = useMemo(() => {
    return imageTools.filter((tool) =>
      (tool.title + tool.description).toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredPdfTools = useMemo(() => {
    return pdfTools.filter((tool) =>
      (tool.title + tool.description).toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredTextTools = useMemo(() => {
    return textTools.filter((tool) =>
      (tool.title + tool.description).toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredAiTools = useMemo(() => {
    return aiTools.filter((tool) =>
      (tool.title + tool.description).toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalResults =
    filteredImageTools.length +
    filteredPdfTools.length +
    filteredTextTools.length +
    filteredAiTools.length;

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
      {/* Background ambient glows matching Nova Tools theme */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(34,211,238,0.07),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(59,130,246,0.07),transparent_40%)]" />
      <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-cyan-500/5 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Complete Directory
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            All 30+ Tools,
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              100% Free &amp; Private.
            </span>
          </h2>

          <p className="mx-auto mt-4 text-base text-slate-400">
            Fast, secure in-browser utilities with zero file uploads and no registration required.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="mx-auto mt-10 mb-16 max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search tools by name or purpose (e.g. compress, pdf, convert, counter)..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-sm text-white placeholder:text-slate-500 shadow-2xl backdrop-blur-xl outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          {search && (
            <p className="mt-3 text-center text-xs text-cyan-300">
              Showing {totalResults} matching tool{totalResults === 1 ? "" : "s"}
            </p>
          )}
        </div>

        {/* Image Tools Category */}
        {filteredImageTools.length > 0 && (
          <div className="mb-20">
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="text-2xl">🖼️</span>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Image Tools
              </h3>
              <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                {filteredImageTools.length} tools
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImageTools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        )}

        {/* PDF Tools Category */}
        {filteredPdfTools.length > 0 && (
          <div className="mb-20">
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="text-2xl">📄</span>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                PDF Tools
              </h3>
              <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                {filteredPdfTools.length} tools
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPdfTools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        )}

        {/* Text Tools Category */}
        {filteredTextTools.length > 0 && (
          <div className="mb-20">
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="text-2xl">📝</span>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Text Tools
              </h3>
              <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                {filteredTextTools.length} tools
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTextTools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        )}

        {/* AI Tools Category */}
        {filteredAiTools.length > 0 && (
          <div>
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                AI &amp; OCR Tools
              </h3>
              <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                {filteredAiTools.length} tools
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAiTools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        )}

        {/* No Search Results Fallback */}
        {totalResults === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
            <p className="text-4xl">🔍</p>
            <h4 className="mt-4 text-xl font-bold text-white">No tools found</h4>
            <p className="mt-2 text-sm text-slate-400">
              No tools matched &quot;{search}&quot;. Try searching for &quot;pdf&quot;, &quot;compress&quot;, &quot;image&quot;, or &quot;counter&quot;.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}