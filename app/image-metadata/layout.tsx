import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Metadata Viewer & EXIF Remover - Privacy Tool | Nova Tools",
  description:
    "View and remove EXIF data, GPS location, camera details, and hidden metadata from your photos online. 100% private in-browser metadata stripper.",
  keywords: [
    "image metadata viewer",
    "exif viewer",
    "remove exif data",
    "strip photo metadata",
    "delete gps from photo",
    "privacy image tool",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/image-metadata",
  },
  openGraph: {
    title: "Image Metadata Viewer & EXIF Remover | Nova Tools",
    description:
      "Inspect photo EXIF details and strip private metadata before sharing online.",
    url: "https://novatool.in/image-metadata",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function ImageMetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
