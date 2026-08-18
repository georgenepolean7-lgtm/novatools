import { NextResponse } from "next/server";
import { createSupabaseServerClient, verifyAdminSession } from "@/lib/supabase/server";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: rawAuditLogs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && rawAuditLogs && rawAuditLogs.length > 0) {
      return NextResponse.json({ logs: rawAuditLogs });
    }

    const { data: adminLogs } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ logs: adminLogs || [] });
  } catch {
    return NextResponse.json({ logs: [] });
  }
}
