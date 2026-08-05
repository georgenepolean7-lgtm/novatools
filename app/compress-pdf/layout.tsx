import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Compress PDF Online Free | Reduce PDF Size to 100KB, 200KB, 500KB",
  description:
    "Compress PDF files online for free. Reduce PDF size to 100KB, 200KB, 500KB or a custom size while keeping documents readable.",
  path: "/compress-pdf",
  keywords: [
    "compress pdf",
    "compress pdf online",
    "pdf compressor",
    "reduce pdf size",
    "compress pdf to 100kb",
    "compress pdf to 200kb",
    "compress pdf to 500kb",
    "free pdf compressor",
  ],
});

export default function CompressPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}