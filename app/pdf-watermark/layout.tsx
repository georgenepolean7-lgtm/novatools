import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Watermark - Add Text Watermark to PDF Online | Nova Tools",
  description:
    "Add custom diagonal or horizontal text watermarks to all PDF pages online. Customize font size, rotation angle, color, and opacity with 100% in-browser privacy.",
  keywords: [
    "pdf watermark",
    "add watermark to pdf",
    "watermark pdf online",
    "confidential stamp pdf",
    "free pdf watermarker",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/pdf-watermark",
  },
  openGraph: {
    title: "PDF Watermark - Add Custom Watermarks Online | Nova Tools",
    description:
      "Stamp custom text watermarks onto PDF pages with full control over opacity and angle.",
    url: "https://novatool.in/pdf-watermark",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PdfWatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
