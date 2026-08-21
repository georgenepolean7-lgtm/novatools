import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image To Pdf Online",
  description:
    "Convert JPG, PNG, and WebP images to high-quality PDF documents online. Reorder pages, select A4 or Letter sizes, and customize margins.",
  keywords: [
    "image to pdf",
    "photos to pdf",
    "convert pictures to pdf",
    "combine images into pdf",
    "free pdf creator",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/image-to-pdf",
  },
  openGraph: {
    title: "Image to PDF Converter - Convert Multiple Images to PDF | Nova Tools",
    description:
      "Convert and merge multiple images into a clean, professional PDF document.",
    url: "https://novatool.in/image-to-pdf",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ImageToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
