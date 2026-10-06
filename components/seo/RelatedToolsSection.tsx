import Link from "next/link";

type Props = {
  currentSlug: string;
};

const relatedTools = [
  {
    slug: "compress-image",
    title: "Compress Image Online",
  },
  {
    slug: "signature-resizer",
    title: "Signature Resizer",
  },
  {
    slug: "pdf-to-jpg",
    title: "Convert PDF to JPG",
  },
  {
    slug: "image-resizer",
    title: "Image Resizer",
  },
  {
    slug: "webp-converter",
    title: "WebP Converter",
  },
];

export default function RelatedToolsSection({
  currentSlug,
}: Props) {
  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-3xl font-bold">
        Related Tools
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {relatedTools
          .filter((tool) => tool.slug !== currentSlug)
          .map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-cyan-400 hover:bg-slate-800"
            >
              <h3 className="font-semibold">
                {tool.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Open this free online tool.
              </p>
            </Link>
          ))}
      </div>
    </section>
  );
}