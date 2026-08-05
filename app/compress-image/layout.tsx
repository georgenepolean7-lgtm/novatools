import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Image to 20KB, 50KB, 100KB Online Free",
  description:
    "Compress JPG, JPEG, PNG and WebP images online for free. Reduce image size to 20KB, 50KB, 100KB or any custom size without installing software.",

  keywords: [
    "compress image",
    "compress image online",
    "compress image to 20kb",
    "compress image to 50kb",
    "compress image to 100kb",
    "image compressor",
    "reduce image size",
    "compress jpg",
    "compress jpeg",
    "compress png",
    "free image compressor",
  ],

  alternates: {
    canonical: "/compress-image",
  },

  openGraph: {
    title: "Compress Image Online Free",
    description:
      "Reduce image file size online without losing quality.",
    url: "https://novacodetool.in/compress-image",
    type: "website",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}