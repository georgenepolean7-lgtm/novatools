import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Favorites - Starred Tools",
  description: "Quick access to your saved favorite Nova Tools.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
