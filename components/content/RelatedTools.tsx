import Link from "next/link";

const tools = [
  {
    name: "Compress Image",
    href: "/compress-image",
  },
  {
    name: "Image Resizer",
    href: "/image-resizer",
  },
  {
    name: "Compress PDF",
    href: "/compress-pdf",
  },
  {
    name: "Merge PDF",
    href: "/merge-pdf",
  },
  {
    name: "Split PDF",
    href: "/split-pdf",
  },
  {
    name: "PDF to JPG",
    href: "/pdf-to-jpg",
  },
  {
    name: "JPG to PDF",
    href: "/jpg-to-pdf",
  },
  {
    name: "Signature Resizer",
    href: "/signature-resizer",
  },
];

export default function RelatedTools() {
  return (
    <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold">
        Related Tools
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-slate-700 p-4 transition hover:border-cyan-500 hover:bg-slate-800"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </section>
  );
}