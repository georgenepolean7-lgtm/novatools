import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Placeholder Text Tool | Nova Tools",
  description:
    "Generate dummy placeholder text for mockups, graphic designs, and web layouts. Generate custom paragraphs, sentences, or words online instantly.",
  keywords: [
    "lorem ipsum generator",
    "dummy text generator",
    "placeholder text tool",
    "lorem ipsum words",
    "free lorem ipsum",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/lorem-ipsum-generator",
  },
  openGraph: {
    title: "Lorem Ipsum Generator - Placeholder Text Tool | Nova Tools",
    description:
      "Generate dummy placeholder text by words, sentences, or paragraphs instantly.",
    url: "https://novatool.in/lorem-ipsum-generator",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function LoremIpsumGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
