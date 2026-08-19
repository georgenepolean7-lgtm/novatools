import { NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = String(body.provider || "updf").slice(0, 50);
    const toolSlug = String(body.toolSlug || "unknown").slice(0, 100);
    const now = new Date().toISOString();

    // Log strictly non-sensitive analytics if Supabase is configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createSupabaseServerClient();
        // Insert non-sensitive click record into audit_logs
        await supabase.from("audit_logs").insert({
          action: "AFFILIATE_CLICK",
          target_type: "AFFILIATE_PROVIDER",
          target_id: provider,
          details: {
            provider,
            tool_slug: toolSlug,
            clicked_at: now,
          },
          created_at: now,
        });
      } catch {
        // Silently continue if audit log table is unavailable
      }
    }

    return NextResponse.json({ success: true, trackedAt: now });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
