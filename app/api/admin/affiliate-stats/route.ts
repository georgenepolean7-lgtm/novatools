import { NextResponse } from "next/server";
import { createSupabaseServerClient, verifyAdminSession } from "@/lib/supabase/server";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("id, target_id, details, created_at")
      .eq("action", "AFFILIATE_CLICK")
      .eq("target_id", "updf")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({
        totalClicks: 0,
        lastClickAt: null,
        recentClicks: [],
      });
    }

    const totalClicks = logs ? logs.length : 0;
    const lastClickAt = logs && logs.length > 0 ? logs[0].created_at : null;
    const recentClicks = (logs || []).map((l) => ({
      id: l.id,
      toolSlug: (l.details as { tool_slug?: string })?.tool_slug || "pdf-tool",
      clickedAt: l.created_at,
    }));

    return NextResponse.json({
      totalClicks,
      lastClickAt,
      recentClicks,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
