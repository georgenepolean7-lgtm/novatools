import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Page Deleter - Remove Unwanted Pages from PDF Online | Nova Tools",
  description:
    "Delete unwanted pages from PDF files online. Select and remove pages instantly while preserving original vector formatting and layout.",
  keywords: [
    "delete pdf pages",
    "remove pages from pdf",
    "pdf page remover",
    "delete pages in pdf",
    "free pdf page deleter",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/pdf-page-deleter",
  },
  openGraph: {
    title: "PDF Page Deleter - Remove Pages Online | Nova Tools",
    description:
      "Easily delete unwanted pages from PDF documents with 100% in-browser privacy.",
    url: "https://novatool.in/pdf-page-deleter",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PdfPageDeleterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
