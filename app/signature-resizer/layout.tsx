import { createToolMetadata } from "@/components/seo/ToolMetadata";

export const metadata = createToolMetadata({
  title: "Signature Resizer Online Free | Resize Signature to 20KB, 50KB",
  description:
    "Resize and compress signature images online for passport, SSC, UPSC, TNPSC and government application forms.",
  path: "/signature-resizer",
  keywords: [
    "signature resizer",
    "resize signature",
    "20kb signature",
    "50kb signature",
    "online signature resizer",
    "passport signature",
    "government form signature",
  ],
});

export default function SignatureResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}