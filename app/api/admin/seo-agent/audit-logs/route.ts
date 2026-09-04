import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/server";
import { SeoAuditStore } from "@/lib/seo-agent/audit-store";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = new SeoAuditStore();
  const status = store.getRuntimeStatus();

  return NextResponse.json({
    audits: status.recentAudits || [],
    opportunities: status.recentOpportunities || [],
    patterns: status.activeLearningPatterns || [],
  });
}
