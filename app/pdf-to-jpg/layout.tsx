import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Pdf To Jpg Online",
  description:
    "Convert PDF pages to high quality JPG images online for free with Nova Tools.",
  path: "/pdf-to-jpg",
  keywords: [
    "pdf to jpg",
    "pdf to image",
    "convert pdf to jpg",
    "pdf to jpeg",
    "pdf image converter",
    "extract images from pdf",
    "free pdf to jpg",
  ],
});

export default function PdfToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}