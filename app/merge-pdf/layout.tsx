import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Merge PDF - Combine PDF Files",
  description:
    "Merge multiple PDF files into one document online for free. Fast, secure and easy to use with Nova Tools.",
  path: "/merge-pdf",
  keywords: [
    "merge pdf",
    "merge pdf online",
    "combine pdf",
    "combine pdf online",
    "join pdf",
    "join pdf online",
    "free pdf merger",
    "merge multiple pdf files",
  ],
});

export default function MergePdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}