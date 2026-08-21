import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Cropper Online",
  description:
    "Crop images and photos online with custom crop boxes, aspect ratio presets (1:1, 4:3, 16:9, 9:16, Free), and pixel-level precision.",
  keywords: [
    "image cropper",
    "crop photo online",
    "crop image",
    "aspect ratio crop",
    "square crop",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/image-cropper",
  },
  openGraph: {
    title: "Image Cropper - Free Online Photo & Image Crop Tool | Nova Tools",
    description:
      "Crop photos and images with preset aspect ratios and custom crop rectangles online.",
    url: "https://novatool.in/image-cropper",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ImageCropperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
