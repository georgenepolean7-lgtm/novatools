import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protect PDF - Encrypt PDF Password",
  description:
    "Secure and password protect your PDF documents. Learn about client-side PDF security standards and encryption capabilities.",
  keywords: [
    "pdf password protector",
    "encrypt pdf",
    "password protect pdf",
    "pdf security",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/pdf-password-protect",
  },
  openGraph: {
    title: "PDF Password Protector | Nova Tools",
    description:
      "PDF encryption capabilities and document security status.",
    url: "https://novatool.in/pdf-password-protect",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function PdfPasswordProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
