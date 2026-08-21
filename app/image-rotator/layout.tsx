import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Rotator Online",
  description:
    "Rotate images 90°, 180°, 270° or custom angles online. Flip photos horizontally & vertically with 100% private in-browser canvas processing.",
  keywords: [
    "image rotator",
    "rotate image online",
    "flip image",
    "mirror image",
    "rotate photo",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/image-rotator",
  },
  openGraph: {
    title: "Image Rotator - Rotate & Flip Images Online Free | Nova Tools",
    description:
      "Rotate images 90°, 180°, 270° or flip horizontally and vertically online for free.",
    url: "https://novatool.in/image-rotator",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ImageRotatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
