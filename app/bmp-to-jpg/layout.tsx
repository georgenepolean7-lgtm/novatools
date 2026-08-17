import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMP to JPG Converter - Convert BMP Images to Compact JPEG | Nova Tools",
  description:
    "Convert large uncompressed BMP bitmap images to lightweight JPG photos online. Adjust compression quality and reduce file sizes by up to 90%.",
  keywords: [
    "bmp to jpg",
    "convert bmp to jpg",
    "bitmap to jpeg",
    "bmp converter online",
    "compress bmp",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/bmp-to-jpg",
  },
  openGraph: {
    title: "BMP to JPG Converter - Convert BMP to Compact JPEG | Nova Tools",
    description:
      "Convert heavy bitmap BMP images to compact, lightweight JPG photos with 100% in-browser processing.",
    url: "https://novatool.in/bmp-to-jpg",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function BmpToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
