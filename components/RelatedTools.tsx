import Link from "next/link";

const tools = [
  {
    title: "Compress Image",
    href: "/compress-image",
  },
  {
    title: "Compress PDF",
    href: "/compress-pdf",
  },
  {
    title: "Merge PDF",
    href: "/merge-pdf",
  },
  {
    title: "Split PDF",
    href: "/split-pdf",
  },
  {
    title: "Rotate PDF",
    href: "/rotate-pdf",
  },
  {
    title: "JPG to PDF",
    href: "/jpg-to-pdf",
  },
  {
    title: "PDF to JPG",
    href: "/pdf-to-jpg",
  },
  {
    title: "Image Resizer",
    href: "/image-resizer",
  },
  {
    title: "Signature Resizer",
    href: "/signature-resizer",
  },
  {
    title: "Tamil Image to Text",
    href: "/tamil-image-to-text",
  },
];

export default function RelatedTools({
  current,
}: {
  current: string;
}) {
 const relatedMap: Record<string, string[]> = {
  "/compress-image": [
    "/image-resizer",
    "/signature-resizer",
    "/jpg-to-pdf",
    "/compress-pdf",
    "/pdf-to-jpg",
  ],

  "/compress-pdf": [
    "/merge-pdf",
    "/split-pdf",
    "/rotate-pdf",
    "/pdf-to-jpg",
    "/jpg-to-pdf",
  ],

  "/merge-pdf": [
    "/split-pdf",
    "/rotate-pdf",
    "/compress-pdf",
    "/pdf-to-jpg",
    "/jpg-to-pdf",
  ],

  "/split-pdf": [
    "/merge-pdf",
    "/rotate-pdf",
    "/compress-pdf",
    "/pdf-to-jpg",
    "/jpg-to-pdf",
  ],

  "/rotate-pdf": [
    "/merge-pdf",
    "/split-pdf",
    "/compress-pdf",
    "/pdf-to-jpg",
    "/jpg-to-pdf",
  ],

  "/jpg-to-pdf": [
    "/pdf-to-jpg",
    "/compress-image",
    "/compress-pdf",
    "/image-resizer",
    "/signature-resizer",
  ],

  "/pdf-to-jpg": [
    "/jpg-to-pdf",
    "/compress-pdf",
    "/merge-pdf",
    "/split-pdf",
    "/rotate-pdf",
  ],

  "/image-resizer": [
    "/compress-image",
    "/signature-resizer",
    "/jpg-to-pdf",
    "/pdf-to-jpg",
    "/compress-pdf",
  ],

  "/signature-resizer": [
    "/image-resizer",
    "/compress-image",
    "/jpg-to-pdf",
    "/compress-pdf",
    "/pdf-to-jpg",
  ],

  "/tamil-image-to-text": [
    "/compress-image",
    "/image-resizer",
    "/jpg-to-pdf",
    "/pdf-to-jpg",
    "/compress-pdf",
  ],
};

const related = (relatedMap[current] ?? [])
  .map((href) => tools.find((tool) => tool.href === href))
  .filter(
    (
      tool
    ): tool is {
      title: string;
      href: string;
    } => tool !== undefined
  );
  return (
    <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <h2 className="text-3xl font-bold text-white">
        Related Tools
      </h2>

      <p className="mt-3 text-slate-400">
        Try these free tools from Nova Tools.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400 hover:bg-cyan-500/10"
          >
            <h3 className="font-semibold text-white">
              {tool.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Open Tool →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}