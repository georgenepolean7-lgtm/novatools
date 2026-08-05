import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "JPG to PDF Online Free | Convert Images to PDF",
  description:
    "Convert JPG and PNG images to PDF online for free. Create high quality PDF documents instantly with Nova Tools.",
  path: "/jpg-to-pdf",
  keywords: [
    "jpg to pdf",
    "jpg to pdf online",
    "image to pdf",
    "png to pdf",
    "convert image to pdf",
    "free jpg to pdf",
    "online jpg converter",
  ],
});

export default function JpgToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}