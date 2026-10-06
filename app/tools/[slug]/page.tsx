import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

/**
 * Explicit Doorway Page Retirement Mapping:
 * Every retired doorway page is redirected with an HTTP 301/308 permanent redirect
 * directly to its primary canonical tool destination with zero redirect chains.
 */
export const RETIRED_DOORWAY_REDIRECTS: Record<string, { target: string; reason: string }> = {
  "convert-pdf-to-jpg-online": {
    target: "/pdf-to-jpg",
    reason: "Functionality mismatch; page promised PDF-to-JPG but rendered image compressor. Redirected to canonical PDF to JPG tool.",
  },
  "resize-signature-to-20kb": {
    target: "/signature-resizer",
    reason: "Doorway duplicate; redirected to canonical Signature Resizer tool.",
  },
  "passport-signature-resizer": {
    target: "/signature-resizer",
    reason: "Doorway duplicate; redirected to canonical Signature Resizer tool.",
  },
  "compress-image-to-100kb": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-to-200kb": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-to-500kb": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-to-50kb": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-to-20kb": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-to-30kb": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-upsc": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-aadhaar": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-pan-card": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-neet": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-jee": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-without-losing-quality": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-tnpsc": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
  "compress-image-for-passport": {
    target: "/compress-image",
    reason: "Doorway variation; redirected to canonical Universal Image Compressor.",
  },
};

export async function generateStaticParams() {
  return Object.keys(RETIRED_DOORWAY_REDIRECTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const redirectInfo = RETIRED_DOORWAY_REDIRECTS[slug];

  if (!redirectInfo) {
    return {
      robots: { index: false, follow: false },
    };
  }

  return {
    robots: { index: false, follow: false },
    alternates: {
      canonical: `https://novatool.in${redirectInfo.target}`,
    },
  };
}

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const redirectInfo = RETIRED_DOORWAY_REDIRECTS[slug];

  if (redirectInfo) {
    permanentRedirect(redirectInfo.target);
  }

  notFound();
}