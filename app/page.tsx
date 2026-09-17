import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import QuickCategoryShortcuts from "@/components/home/QuickCategoryShortcuts";
import FeaturedToolsSection from "@/components/home/FeaturedToolsSection";
import ExploreNovaSection from "@/components/home/ExploreNovaSection";
import AllToolsSection from "@/components/AllToolsSection";
import ToolsSection from "@/components/home/ToolsSection";
import CategoryDirectorySection from "@/components/home/CategoryDirectorySection";
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
      {/* 1. Hero Section with Live Search & Direct #all-tools CTA */}
      <HeroSection />

      {/* 2. Top Balanced Ad Slot */}
      <AdSenseBanner slotId="home-hero-bottom" className="my-4" />

      {/* 3. Quick Category Shortcuts (High-Level Orientation) */}
      <QuickCategoryShortcuts />

      {/* 4. Featured Tools by Category (Curated Representative Workflows) */}
      <FeaturedToolsSection />

      {/* 5. Why Choose Nova Tools (In-Browser Architecture, Privacy & Speed) */}
      <ExploreNovaSection />

      {/* 6. Complete 251-Tool Directory (Primary #all-tools Search & Filter Hub) */}
      <AllToolsSection />

      {/* 7. Interactive Spotlight (Secondary Popular Tools Quick Launcher) */}
      <ToolsSection />

      {/* 8. Active Category Directory (251 Tools Across 16 Categories - No Empty Cards) */}
      <CategoryDirectorySection />

      {/* 9. Technical Guides & Editorial Tutorials */}
      <HomeGuidesSection />

      {/* 10. Bottom Balanced Ad Slot */}
      <AdSenseBanner slotId="home-directory-bottom" className="my-4" />

      {/* 11. FAQ Accordion & Google Rich Snippets Schema */}
      <SeoFaqSection />

      {/* 12. About & Founder Trust Section (#about and #company preserved) */}
      <AboutSection />
      <CompanySection />

      {/* 13. Approved Partner Recommendation (UPDF with Full Disclosure) */}
      <AffiliateRecommendations />

      {/* 14. Site Footer */}
      <SiteFooter />
    </div>
  );
}