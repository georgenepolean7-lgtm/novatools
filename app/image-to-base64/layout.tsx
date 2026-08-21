import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image To Base64 Online",
  description:
    "Convert JPG, PNG, WebP, GIF, and SVG images to Base64 data strings online. Copy or download Base64 text with 100% private in-browser encoding.",
  keywords: [
    "image to base64",
    "base64 encoder",
    "convert image to base64",
    "data uri converter",
    "online base64 tool",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/image-to-base64",
  },
  openGraph: {
    title: "Image to Base64 Converter - Free Online Encoder | Nova Tools",
    description:
      "Convert images to Base64 strings and Data URIs online with 100% in-browser processing.",
    url: "https://novatool.in/image-to-base64",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ImageToBase64Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
