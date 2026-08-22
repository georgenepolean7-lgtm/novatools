import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile - Settings & Account",
  description: "Manage your Nova Tools profile and subscription settings.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
