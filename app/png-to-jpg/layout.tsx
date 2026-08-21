import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PNG to JPG - Fast Image Converter",
  description:
    "Convert PNG images to JPG/JPEG format online for free. Custom background colors, quality adjustment, and batch conversion.",
  keywords: [
    "PNG to JPG",
    "PNG to JPEG",
    "convert PNG to JPG",
    "image converter",
    "free online converter",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/png-to-jpg",
  },
  openGraph: {
    title: "PNG to JPG Converter - Free Online Image Converter | Nova Tools",
    description:
      "Convert PNG images to JPG/JPEG format online with custom quality and background color.",
    url: "https://novatool.in/png-to-jpg",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PngToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
