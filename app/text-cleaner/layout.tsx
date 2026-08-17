import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Cleaner - Remove Extra Spaces, Blank Lines & Format Text | Nova Tools",
  description:
    "Clean, trim, and format messy text online. Remove extra spaces, delete empty lines, remove duplicate lines, and normalize whitespace with 100% in-browser privacy.",
  keywords: [
    "text cleaner",
    "remove extra spaces",
    "remove empty lines",
    "trim lines",
    "remove duplicate lines",
    "text formatter online",
    "Nova Tools",
  ],
  alternates: {
    canonical: "/text-cleaner",
  },
  openGraph: {
    title: "Text Cleaner - Clean & Format Text Online | Nova Tools",
    description:
      "Clean messy text, remove extra spaces, empty lines, and duplicates in your browser.",
    url: "https://novatool.in/text-cleaner",
    siteName: "Nova Tools",
    type: "website",
  },
};

export default function TextCleanerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
