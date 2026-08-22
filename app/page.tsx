import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ToolsSection from "@/components/home/ToolsSection";
import AllToolsSection from "@/components/AllToolsSection";
import SeoFaqSection from "@/components/home/SeoFaqSection";
import AboutSection from "@/components/home/AboutSection";
import CompanySection from "@/components/home/CompanySection";
import SiteFooter from "@/components/SiteFooter";
import AffiliateRecommendations from "@/components/affiliate/AffiliateRecommendations";
import AdSenseBanner from "@/components/ads/AdSenseBanner";

export const metadata: Metadata = {
  title: "Nova Tools - Free Online Image & PDF Tools",
  description:
    "Free online tools to compress images, resize photos, resize signatures, compress PDFs, convert JPG to PDF and extract Tamil text from images.",
  alternates: {
    canonical: "https://novatool.in",
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
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* 1. Hero Section with 250+ Tools Search */}
      <HeroSection />

      {/* 2. Top Ad Area */}
      <AdSenseBanner slotId="home-hero-bottom" className="my-6" />

      {/* 3. Featured / Popular Tools Section */}
      <ToolsSection />

      {/* 4. Mid Ad Area */}
      <AdSenseBanner slotId="home-directory-top" className="my-6" />

      {/* 5. Complete All Tools Directory with 30-Tool Pagination */}
      <AllToolsSection />

      {/* 6. Bottom Ad Area */}
      <AdSenseBanner slotId="home-directory-bottom" className="my-6" />

      {/* 7. SEO Content, Crawlable Category Tree & FAQ Schema (Server Component) */}
      <SeoFaqSection />

      {/* 8. About & Company Highlights (Server Components) */}
      <AboutSection />
      <CompanySection />
      <AffiliateRecommendations />

      {/* 9. Site Footer (Server Component) */}
      <SiteFooter />
    </div>
  );
}