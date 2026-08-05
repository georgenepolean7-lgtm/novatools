import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Rotate PDF Online Free | Rotate PDF Pages",
  description:
    "Rotate PDF pages online for free. Rotate all pages or selected pages by 90°, 180° or 270° with Nova Tools.",
  path: "/rotate-pdf",
  keywords: [
    "rotate pdf",
    "rotate pdf online",
    "rotate pdf pages",
    "rotate pdf free",
    "rotate pdf 90 degrees",
    "rotate pdf 180 degrees",
    "rotate pdf 270 degrees",
  ],
});

export default function RotatePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}