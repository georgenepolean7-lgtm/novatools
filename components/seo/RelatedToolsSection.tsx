import Link from "next/link";

type Props = {
  currentSlug: string;
};

const relatedTools = [
  {
    slug: "compress-image-to-20kb",
    title: "Compress Image to 20KB",
  },
  {
    slug: "compress-image-to-50kb",
    title: "Compress Image to 50KB",
  },
  {
    slug: "compress-image-to-100kb",
    title: "Compress Image to 100KB",
  },
  {
    slug: "resize-signature-to-20kb",
    title: "Resize Signature to 20KB",
  },
  {
    slug: "convert-pdf-to-jpg-online",
    title: "Convert PDF to JPG Online",
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
              href={`/tools/${tool.slug}`}
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