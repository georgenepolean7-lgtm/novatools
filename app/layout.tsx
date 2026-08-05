import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novatool.in"),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "Nova Tools - Free Online Image & PDF Tools",
    template: "%s | Nova Tools",
  },

  description:
    "Free online tools to compress images, resize photos, resize signatures, compress PDFs, convert JPG to PDF and extract Tamil text from images.",

  keywords: [
    "Nova Tools",
    "image compressor",
    "image resizer",
    "photo resizer",
    "signature resizer",
    "compress PDF",
    "PDF compressor",
    "JPG to PDF",
    "Tamil OCR",
    "Tamil Image to Text",
    "free online tools",
  ],

  authors: [
    {
      name: "Nova Code Tech",
    },
  ],

  creator: "Nova Code Tech",

  publisher: "Nova Code Tech",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Nova Tools - Free Online Image & PDF Tools",

    description:
      "Compress images, resize photos, resize signatures, compress PDFs, convert JPG to PDF and extract Tamil text online.",

    url: "https://novatool.in",

    siteName: "Nova Tools",

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Nova Tools - Free Online Image & PDF Tools",

    description:
      "Free online image, PDF and OCR tools by Nova Code Tech.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#020617]">
        {children}
      </body>
    </html>
  );
}