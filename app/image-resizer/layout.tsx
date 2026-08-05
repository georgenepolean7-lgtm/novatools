import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Image Resizer Online Free | Resize JPG & PNG",
  description:
    "Resize JPG, PNG and other images online for free while maintaining high quality.",
  path: "/image-resizer",
  keywords: [
    "image resizer",
    "resize image",
    "resize jpg",
    "resize png",
    "online image resizer",
    "photo resizer",
    "free image resizer",
  ],
});

export default function ImageResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}