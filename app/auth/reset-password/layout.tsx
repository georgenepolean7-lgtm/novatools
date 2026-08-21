import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Account Recovery",
  description: "Reset your Nova Tools account password securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
