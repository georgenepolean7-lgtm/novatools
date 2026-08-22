import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Tamil OCR - Tamil Image to Text",
  description:
    "Extract Tamil and English text from images online using OCR. Convert screenshots, scanned documents and photos into editable text with Nova Tools.",
  path: "/tamil-image-to-text",
  keywords: [
    "tamil ocr",
    "tamil image to text",
    "extract tamil text from image",
    "tamil optical character recognition",
    "tamil text scanner",
  ],
});

export default function TamilImageToTextLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}