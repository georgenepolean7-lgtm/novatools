import HeroSection from "./HeroSection";
import ToolsSection from "./ToolsSection";
import AllToolsSection from "@/components/AllToolsSection";
import SeoFaqSection from "./SeoFaqSection";
import AboutSection from "./AboutSection";
import CompanySection from "./CompanySection";
import SiteFooter from "@/components/SiteFooter";
import AffiliateRecommendations from "@/components/affiliate/AffiliateRecommendations";
import AdSenseBanner from "@/components/ads/AdSenseBanner";

export default function HomeClient() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* 1. Hero Section with 250+ Tools Search */}
      <HeroSection />

      {/* 2. Top Ad Area (Clean reserved container) */}
      <AdSenseBanner slotId="home-hero-bottom" className="my-6" />

      {/* 3. Featured / Popular Tools Section */}
      <ToolsSection />

      {/* 4. Mid Ad Area (Separating Featured from Full Directory) */}
      <AdSenseBanner slotId="home-directory-top" className="my-6" />

      {/* 5. Complete All Tools Directory with 30-Tool Pagination */}
      <AllToolsSection />

      {/* 6. Bottom Ad Area */}
      <AdSenseBanner slotId="home-directory-bottom" className="my-6" />

      {/* 7. SEO Content, Crawlable Category Tree & FAQ Schema */}
      <SeoFaqSection />

      {/* 8. About & Company Highlights */}
      <AboutSection />
      <CompanySection />
      <AffiliateRecommendations />

      {/* 9. Site Footer */}
      <SiteFooter />
    </div>
  );
}