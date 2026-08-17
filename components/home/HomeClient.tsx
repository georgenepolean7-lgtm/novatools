"use client";

import { useRef } from "react";

import HeroSection from "./HeroSection";
import ToolsSection from "./ToolsSection";
import AllToolsSection from "@/components/AllToolsSection";
import AboutSection from "./AboutSection";
import CompanySection from "./CompanySection";
import SiteFooter from "@/components/SiteFooter";
import AffiliateRecommendations from "@/components/affiliate/AffiliateRecommendations";

export default function HomeClient() {
  const aboutRef = useRef(null);

  return (
    <>
      <HeroSection />

      <ToolsSection />

      <AllToolsSection />

      <AboutSection aboutRef={aboutRef} />

      <CompanySection />

<AffiliateRecommendations />

      <SiteFooter />
    </>
  );
}