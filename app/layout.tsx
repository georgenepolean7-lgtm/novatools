import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import SearchActionSchema from "@/components/seo/SearchActionSchema";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
};

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

icons: {
  icon: "/icon.png",
  apple: "/icon.png",
},



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
    images: [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Nova Tools",
  },
],

  },

  twitter: {
    card: "summary_large_image",

    title: "Nova Tools - Free Online Image & PDF Tools",

    description:
      "Free online image, PDF and OCR tools by Nova Code Tech.",

      images: ["/og-image.png"],
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
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7888119602395886"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>

<GoogleAnalytics />
<MicrosoftClarity />
<SearchActionSchema />
        {children}

        <CookieConsent />
        
      </body>
    </html>
  );
}