import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to PNG Converter - Free Online Image Converter | Nova Tools",
  description:
    "Convert JPG and JPEG images to high-quality PNG format online for free. Fast, secure, and 100% private in-browser conversion.",
  keywords: [
    "JPG to PNG",
    "JPEG to PNG",
    "convert JPG to PNG",
    "image converter",
    "free online converter",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/jpg-to-png",
  },
  openGraph: {
    title: "JPG to PNG Converter - Free Online Image Converter | Nova Tools",
    description:
      "Convert JPG and JPEG images to high-quality PNG format online for free.",
    url: "https://novatool.in/jpg-to-png",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function JpgToPngLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
