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
    description: "Resize signatures for documents.",
    icon: "✍️",
    href: "/signature-resizer",
  },
];

const pdfTools = [
  {
    title: "Compress PDF",
    description: "Reduce PDF size while preserving quality.",
    icon: "📕",
    href: "/compress-pdf",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files.",
    icon: "📄",
    href: "/merge-pdf",
  },
  {
    title: "Split PDF",
    description: "Extract selected PDF pages.",
    icon: "✂️",
    href: "/split-pdf",
  },
  {
    title: "Rotate PDF",
    description: "Rotate all or selected pages.",
    icon: "🔄",
    href: "/rotate-pdf",
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images into PDF.",
    icon: "🖼️",
    href: "/jpg-to-pdf",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages into JPG images.",
    icon: "📷",
    href: "/pdf-to-jpg",
  },
];

const aiTools = [
  {
    title: "Tamil Image to Text",
    description: "Extract Tamil text using OCR.",
    icon: "🤖",
    href: "/tamil-image-to-text",
  },
];
export default function AllToolsSection() {

  const [search, setSearch] = useState("");

const filteredImageTools = useMemo(() => {

  return imageTools.filter((tool) =>
    (
      tool.title +
      tool.description
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

}, [search]);

const filteredPdfTools = useMemo(() => {

  return pdfTools.filter((tool) =>
    (
      tool.title +
      tool.description
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

}, [search]);

const filteredAiTools = useMemo(() => {

  return aiTools.filter((tool) =>
    (
      tool.title +
      tool.description
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

}, [search]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-4 text-center text-5xl font-bold text-white">
        All Tools
      </h2>
  
<div className="mx-auto mt-8 mb-12 max-w-xl">

  <input
    type="text"
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    placeholder="🔍 Search tools..."
    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400"
  />

</div>

     <p className="mb-12 text-center text-gray-400">
  Fast • Secure • Free
</p>

<h3 className="mb-6 text-3xl font-bold text-cyan-300">
  🖼️ Image Tools
</h3>

<div className="mb-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
  {filteredImageTools.map((tool) => (
    <ToolCard key={tool.title} {...tool} />
  ))}
</div>

<h3 className="mb-6 text-3xl font-bold text-cyan-300">
  📄 PDF Tools
</h3>

<div className="mb-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
  {filteredPdfTools.map((tool) => (
    <ToolCard key={tool.title} {...tool} />
  ))}
</div>

<h3 className="mb-6 text-3xl font-bold text-cyan-300">
  🤖 AI Tools
</h3>

<div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
  {filteredAiTools.map((tool) => (
    <ToolCard key={tool.title} {...tool} />
  ))}
</div>
    </section>
  );
}