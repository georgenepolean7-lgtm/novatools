import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/server";
import { SeoAuditStore } from "@/lib/seo-agent/audit-store";

export async function POST(req: NextRequest) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const active = Boolean(body.active);
    const store = new SeoAuditStore();
    store.setKillSwitch(active);

    return NextResponse.json({
      success: true,
      killSwitchActive: active,
      message: active
        ? "Emergency Kill Switch activated. All autonomous SEO modifications are paused."
        : "Emergency Kill Switch deactivated. Autonomous SEO operations enabled.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update kill switch", details: String(err) },
      { status: 500 }
    );
  }
}
