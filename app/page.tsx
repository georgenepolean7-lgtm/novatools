import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ExploreNovaSection from "@/components/home/ExploreNovaSection";
import FeaturedToolsSection from "@/components/home/FeaturedToolsSection";
import ToolsSection from "@/components/home/ToolsSection";
import AllToolsSection from "@/components/AllToolsSection";
import HomeGuidesSection from "@/components/home/HomeGuidesSection";
import SeoFaqSection from "@/components/home/SeoFaqSection";
import AboutSection from "@/components/home/AboutSection";
import CompanySection from "@/components/home/CompanySection";
import SiteFooter from "@/components/SiteFooter";
import AffiliateRecommendations from "@/components/affiliate/AffiliateRecommendations";
import AdSenseBanner from "@/components/ads/AdSenseBanner";

export const metadata: Metadata = {
  title: "Nova Tools - Free Online PDF, Image, Developer & Everyday Utilities",
  description:
    "Explore 250+ fast, client-side online tools for PDF editing, image compression, developer utilities, financial calculations, and text formatting. Private, fast, and free to use.",
  alternates: {
    canonical: "https://novatool.in",
  },
  openGraph: {
    title: "Nova Tools - Free Online PDF, Image, Developer & Everyday Utilities",
    description:
      "Explore 250+ fast, client-side online tools for PDF editing, image compression, developer utilities, financial calculations, and text formatting.",
    url: "https://novatool.in",
    siteName: "Nova Tools",
    locale: "en_IN",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* 1. Hero Section with Live Search */}
      <HeroSection />

      {/* 2. Why Choose Nova Tools (4 Benefit Cards) */}
      <ExploreNovaSection />

      {/* 3. Featured Tools by Category (6 Organized Groups) */}
      <FeaturedToolsSection />

      {/* 4. Top Ad Area */}
      <AdSenseBanner slotId="home-hero-bottom" className="my-6" />

      {/* 5. Popular Tools Quick Grid */}
      <ToolsSection />

      {/* 6. Mid Ad Area */}
      <AdSenseBanner slotId="home-directory-top" className="my-6" />

      {/* 7. Complete Tools Directory & Category Explorer */}
      <AllToolsSection />

      {/* 8. Technical Guides & Editorial Tutorials */}
      <HomeGuidesSection />

      {/* 9. Bottom Ad Area */}
      <AdSenseBanner slotId="home-directory-bottom" className="my-6" />

      {/* 10. SEO Content, Crawlable Category Tree & FAQ Schema */}
      <SeoFaqSection />

      {/* 11. About & Editorial Trust Highlights */}
      <AboutSection />
      <CompanySection />

      {/* 12. Approved Partner Recommendation (UPDF with Full Disclosure) */}
      <AffiliateRecommendations />

      {/* 13. Site Footer */}
      <SiteFooter />
    </div>
  );
}