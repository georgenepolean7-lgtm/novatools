import Link from "next/link";
import { relatedTools } from "@/lib/seo/relatedTools";
import { isPdfRelatedTool } from "@/lib/affiliate/updf-config";
import UPDFRecommendation from "@/components/affiliate/UPDFRecommendation";

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
  {
    title: "JPG to PNG",
    href: "/jpg-to-png",
  },
  {
    title: "PNG to JPG",
    href: "/png-to-jpg",
  },
  {
    title: "WebP Converter",
    href: "/webp-converter",
  },
  {
    title: "Image Cropper",
    href: "/image-cropper",
  },
  {
    title: "Image Rotator",
    href: "/image-rotator",
  },
  {
    title: "Image to Base64",
    href: "/image-to-base64",
  },
  {
    title: "Image to PDF",
    href: "/image-to-pdf",
  },
  {
    title: "Image Metadata",
    href: "/image-metadata",
  },
  {
    title: "GIF to PNG",
    href: "/gif-to-png",
  },
  {
    title: "BMP to JPG",
    href: "/bmp-to-jpg",
  },
  {
    title: "PDF Page Extractor",
    href: "/pdf-page-extractor",
  },
  {
    title: "PDF Page Deleter",
    href: "/pdf-page-deleter",
  },
  {
    title: "PDF Watermark",
    href: "/pdf-watermark",
  },
  {
    title: "PDF Password Protector",
    href: "/pdf-password-protect",
  },
  {
    title: "PDF Unlocker",
    href: "/pdf-unlocker",
  },
  {
    title: "Word Counter",
    href: "/word-counter",
  },
  {
    title: "Character Counter",
    href: "/character-counter",
  },
  {
    title: "Case Converter",
    href: "/case-converter",
  },
  {
    title: "Text Cleaner",
    href: "/text-cleaner",
  },
  {
    title: "Lorem Ipsum Generator",
    href: "/lorem-ipsum-generator",
  },
];

export default function RelatedTools({
  current,
}: {
  current: string;
}) {
 

const related = (
  relatedTools[current.replace("/", "") as keyof typeof relatedTools] ?? []
)
  .map((slug) =>
  tools.find((tool) => tool.href === `/${slug}`)
)
  .filter(
    (
      tool
    ): tool is {
      title: string;
      href: string;
    } => tool !== undefined
  );
  return (
    <>
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

      {/* Render UPDF affiliate recommendation exclusively for PDF utilities */}
      {isPdfRelatedTool(undefined, current.replace("/", "")) && (
        <div className="mt-6">
          <UPDFRecommendation toolSlug={current.replace("/", "")} />
        </div>
      )}
    </>
  );
}