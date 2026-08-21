import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove PDF Password",
  description:
    "Learn about PDF decryption standards and password removal capabilities with privacy-first client-side architecture.",
  keywords: [
    "pdf unlocker",
    "remove pdf password",
    "decrypt pdf",
    "pdf password removal",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/pdf-unlocker",
  },
  openGraph: {
    title: "PDF Unlocker | Nova Tools",
    description:
      "PDF password removal capabilities and security status.",
    url: "https://novatool.in/pdf-unlocker",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PdfUnlockerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
