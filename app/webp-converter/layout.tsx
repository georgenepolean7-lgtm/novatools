import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebP Converter - Convert WebP to JPG, PNG or Images to WebP | Nova Tools",
  description:
    "Free online WebP converter. Convert WebP to JPG/PNG or compress JPG, PNG, and GIF into modern WebP format in your browser.",
  keywords: [
    "WebP converter",
    "WebP to JPG",
    "WebP to PNG",
    "JPG to WebP",
    "PNG to WebP",
    "image converter",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/webp-converter",
  },
  openGraph: {
    title: "WebP Converter - Convert WebP to JPG, PNG or Images to WebP | Nova Tools",
    description:
      "Convert WebP to JPG/PNG or compress images into next-gen WebP format.",
    url: "https://novatool.in/webp-converter",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function WebPConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
