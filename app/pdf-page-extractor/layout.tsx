import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pdf Page Extractor Online",
  description:
    "Extract specific pages or page ranges from PDF documents online. 100% private in-browser page extraction preserving original vector quality.",
  keywords: [
    "pdf page extractor",
    "extract pages from pdf",
    "split pdf pages",
    "pdf page separator",
    "free pdf tool",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/pdf-page-extractor",
  },
  openGraph: {
    title: "PDF Page Extractor - Extract Pages Online | Nova Tools",
    description:
      "Select and extract individual pages or custom ranges from any PDF document.",
    url: "https://novatool.in/pdf-page-extractor",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PdfPageExtractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
