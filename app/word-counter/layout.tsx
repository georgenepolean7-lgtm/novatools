import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter Online",
  description:
    "Accurately count words, characters, sentences, paragraphs, and estimated reading time. Real-time in-browser analysis supporting English, Tamil, Hindi, and multilingual text.",
  keywords: [
    "word counter",
    "character counter",
    "word count tool",
    "reading time calculator",
    "tamil word counter",
    "online text statistics",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/word-counter",
  },
  openGraph: {
    title: "Word Counter - Word & Character Count Tool | Nova Tools",
    description:
      "Count words, characters, reading time, and sentences with 100% in-browser privacy.",
    url: "https://novatool.in/word-counter",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
