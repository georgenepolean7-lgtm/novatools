import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter Online",
  description:
    "Convert text case online instantly. Convert to UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Case, and Alternating Case. 100% free and private.",
  keywords: [
    "case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "sentence case converter",
    "text case changer",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/case-converter",
  },
  openGraph: {
    title: "Case Converter - Change Text Case Online | Nova Tools",
    description:
      "Transform text into UPPERCASE, lowercase, Title Case, and Sentence case with instant copy.",
    url: "https://novatool.in/case-converter",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function CaseConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
