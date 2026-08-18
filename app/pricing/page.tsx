import type { Metadata } from "next";
import { getServerSystemSettings } from "@/lib/supabase/server";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing & Plans — Free Forever & Premium | Nova Tools",
  description:
    "Explore Nova Tools pricing. Access 250+ client-side utility tools 100% free forever, or upgrade to Premium for an ad-free experience, badges, and priority access.",
  alternates: {
    canonical: "https://novatool.in/pricing",
  },
  openGraph: {
    title: "Pricing & Plans — Nova Tools",
    description:
      "Access 250+ fast, private, in-browser developer, PDF, finance, image, and text utilities for free forever.",
    url: "https://novatool.in/pricing",
    type: "website",
  },
};

export default async function PricingPage() {
  const settings = await getServerSystemSettings();

  return (
    <PricingClient
      premiumAmountInr={settings.premiumAmountInr || 99}
      paymentEnabled={settings.paymentEnabled}
      premiumEnabled={settings.premiumEnabled}
    />
  );
}
