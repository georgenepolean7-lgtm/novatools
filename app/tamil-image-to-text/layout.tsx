import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tamil Image to Text OCR Online",
  description:
    "Extract Tamil and English text from images online using OCR. Convert screenshots, scanned documents and photos into editable text with Nova Tools.",
};

export default function TamilImageToTextLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}