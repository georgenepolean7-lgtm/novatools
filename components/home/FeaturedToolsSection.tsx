import React from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Type,
  Code,
  Calculator,
  FolderArchive,
  ArrowRight,
} from "lucide-react";

export default function FeaturedToolsSection() {
  const groups = [
    {
      title: "PDF Tools",
      categorySlug: "pdf",
      icon: FileText,
      badge: "Document Workflows",
      accent: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30",
      tools: [
        { name: "Merge PDF", slug: "merge-pdf", desc: "Combine multiple PDF files into one ordered document." },
        { name: "Split PDF", slug: "split-pdf", desc: "Extract specific page ranges into separate PDF files." },
        { name: "Compress PDF", slug: "compress-pdf", desc: "Reduce document size for portal uploads and emails." },
        { name: "PDF to JPG", slug: "pdf-to-jpg", desc: "Extract high-resolution JPG images from PDF pages." },
      ],
    },
    {
      title: "Image Tools",
      categorySlug: "image",
      icon: ImageIcon,
      badge: "Visual Optimization",
      accent: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
      tools: [
        { name: "Compress Image", slug: "compress-image", desc: "Target 100KB, 50KB, or 20KB for exams & government forms." },
        { name: "Image Resizer", slug: "image-resizer", desc: "Resize dimensions with aspect ratio lock and DPI settings." },
        { name: "Convert to WebP", slug: "convert-to-webp", desc: "Convert JPG/PNG to next-gen WebP for faster web loading." },
        { name: "Color Palette Extractor", slug: "image-color-palette-extractor", desc: "Extract dominant hex color codes from any image." },
      ],
    },
    {
      title: "Text Tools",
      categorySlug: "text",
      icon: Type,
      badge: "Content Formatting",
      accent: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      tools: [
        { name: "Word Counter", slug: "word-counter", desc: "Live count of words, characters, sentences & reading time." },
        { name: "Case Converter", slug: "case-converter", desc: "Transform text to UPPERCASE, lowercase, Title Case, and camelCase." },
        { name: "Remove Duplicate Lines", slug: "remove-duplicate-lines", desc: "Clean lists and dataset exports by removing duplicate rows." },
        { name: "URL Slug Generator", slug: "slug-generator", desc: "Convert article titles into clean SEO-friendly URL slugs." },
      ],
    },
    {
      title: "Developer Tools",
      categorySlug: "developer",
      icon: Code,
      badge: "Code & Encoders",
      accent: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
      tools: [
        { name: "JSON Formatter", slug: "json-formatter", desc: "Format, beautify, and validate complex JSON payloads." },
        { name: "HTML Entity Decoder", slug: "html-entity-decoder", desc: "Decode named, decimal, and hex HTML entities into clean text." },
        { name: "Base64 Encoder / Decoder", slug: "base64-encoder", desc: "Encode or decode strings and binary data in Base64." },
        { name: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", desc: "Create multi-layer CSS box shadows with live visual preview." },
      ],
    },
    {
      title: "Calculators",
      categorySlug: "calculator",
      icon: Calculator,
      badge: "Financial & Everyday",
      accent: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
      tools: [
        { name: "GST Calculator", slug: "gst-calculator", desc: "Calculate Inclusive and Exclusive GST rates (5%, 12%, 18%, 28%)." },
        { name: "Percentage Calculator", slug: "percentage-calculator", desc: "Calculate percentage changes, markups, discounts, and ratios." },
        { name: "Age Calculator", slug: "age-calculator", desc: "Calculate exact age in years, months, days, and total hours." },
        { name: "EMI Calculator", slug: "emi-calculator", desc: "Compute monthly loan payments and total interest breakdown." },
      ],
    },
    {
      title: "File & Data Tools",
      categorySlug: "file",
      icon: FolderArchive,
      badge: "Integrity & Data Conversion",
      accent: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
      tools: [
        { name: "File Hash Calculator", slug: "file-hash-calculator", desc: "Verify file integrity with SHA-256, SHA-512, and MD5 hashes." },
        { name: "CSV to JSON Converter", slug: "csv-to-json", desc: "Convert tabular CSV exports into structured JSON arrays." },
        { name: "Base64 File Converter", slug: "base64-file-converter", desc: "Encode local files into Base64 data URIs for embedding." },
        { name: "Text Diff Viewer", slug: "text-diff-viewer", desc: "Compare two text snippets side-by-side with diff highlights." },
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 [content-visibility:auto] [contain-intrinsic-size:1px_850px]">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Curated Collections
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Tools by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Organized collections of our most popular online utilities for document management, media editing, development, and everyday calculations.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>View All 25 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border bg-gradient-to-br flex items-center justify-center ${group.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {group.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {group.badge}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/categories/${group.categorySlug}`}
                      className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                      title={`Browse ${group.title}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {group.tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        className="group/tool block p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200 group-hover/tool:text-cyan-300 transition-colors">
                            {tool.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Client
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {tool.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/categories/${group.categorySlug}`}
                  className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-center text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Explore All {group.title}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
