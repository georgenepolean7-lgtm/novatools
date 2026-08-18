import { NextResponse } from "next/server";
import { createSupabaseServerClient, verifyAdminSession } from "@/lib/supabase/server";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: flags, error } = await supabase.from("feature_flags").select("*");
    if (error) {
      return NextResponse.json({ flags: [] });
    }
    return NextResponse.json({ flags });
  } catch {
    return NextResponse.json({ flags: [] });
  }
}

export async function POST(request: Request) {
  const { isAdmin, user } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    const flagInsert = {
      key: String(body.key),
      enabled: Boolean(body.enabled),
      description: body.description ? String(body.description) : null,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase.from("feature_flags").upsert(flagInsert);

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    if (user?.id) {
      const now = new Date().toISOString();
      const auditEntry = {
        admin_id: user.id,
        user_id: user.id,
        action: "UPDATE_FEATURE_FLAG",
        target_type: "FEATURE_FLAG",
        target_id: String(body.key),
        metadata: body,
        details: body,
        created_at: now,
      };
      const { error: auditErr } = await supabase.from("audit_logs").insert(auditEntry);
      if (auditErr) {
        await supabase.from("admin_audit_logs").insert({
          admin_id: user.id,
          action: "UPDATE_FEATURE_FLAG",
          target_type: "FEATURE_FLAG",
          target_id: String(body.key),
          metadata: body,
          created_at: now,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
