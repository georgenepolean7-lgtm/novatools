import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GIF to PNG Converter - Extract High-Quality PNG Frames | Nova Tools",
  description:
    "Convert animated or static GIF images to lossless PNG format online. High-resolution in-browser conversion with alpha transparency support.",
  keywords: [
    "gif to png",
    "convert gif to png",
    "extract gif frame",
    "gif to png converter online",
    "free image converter",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/gif-to-png",
  },
  openGraph: {
    title: "GIF to PNG Converter - Extract PNG Frames | Nova Tools",
    description:
      "Convert GIF files to crystal-clear lossless PNG images with 100% privacy.",
    url: "https://novatool.in/gif-to-png",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function GifToPngLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
