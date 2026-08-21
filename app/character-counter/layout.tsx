import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Counter Online",
  description:
    "Count characters with and without spaces, words, lines, and social media post limits in real-time. Unicode & Tamil-friendly in-browser counter.",
  keywords: [
    "character counter",
    "letter counter",
    "count characters online",
    "twitter character counter",
    "tamil character count",
    "unicode character counter",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/character-counter",
  },
  openGraph: {
    title: "Character Counter - Free Online Letter Counter | Nova Tools",
    description:
      "Count characters with and without spaces, words, lines, and social limits online with 100% privacy.",
    url: "https://novatool.in/character-counter",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function CharacterCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
