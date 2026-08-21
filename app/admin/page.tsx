import React from "react";
import type { Metadata } from "next";
import { verifyAdminSession, getServerSystemSettings } from "@/lib/supabase/server";
import { AdminClient } from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Panel - System Operations",
  description: "Administrative dashboard for Nova Tools platform operations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const { isAdmin, user } = await verifyAdminSession();
  const settings = await getServerSystemSettings();

  return (
    <AdminClient
      initialSettings={settings}
      isAdmin={isAdmin}
      userEmail={user?.email || null}
    />
  );
}
