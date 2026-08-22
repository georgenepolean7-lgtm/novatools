import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Create Account",
  description: "Create a free Nova Tools account to save favorite tools, sync preferences, and access advanced features.",
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

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
