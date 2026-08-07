"use client";

import { useRef } from "react";

import HeroSection from "./HeroSection";
import ToolsSection from "./ToolsSection";
import AboutSection from "./AboutSection";
import CompanySection from "./CompanySection";
import SiteFooter from "@/components/SiteFooter";

export default function HomeClient() {
  const aboutRef = useRef(null);

  return (
    <>
      <HeroSection />

      <ToolsSection />

      <AboutSection aboutRef={aboutRef} />

      <CompanySection />

      <SiteFooter />
    </>
  );
}