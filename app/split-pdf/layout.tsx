import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Split PDF - Separate PDF Pages",
  description:
    "Split PDF files online for free. Extract selected pages or page ranges instantly with Nova Tools.",
  path: "/split-pdf",
  keywords: [
    "split pdf",
    "split pdf online",
    "extract pdf pages",
    "pdf splitter",
    "split pdf free",
    "extract pages from pdf",
    "online pdf splitter",
  ],
});

export default function SplitPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}