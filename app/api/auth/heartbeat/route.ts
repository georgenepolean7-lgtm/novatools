import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });
    }

    const now = new Date().toISOString();

    const { error: presenceErr } = await supabase.from("user_presence").upsert({
      user_id: user.id,
      last_seen_at: now,
      updated_at: now,
    }, { onConflict: "user_id" });

    if (presenceErr) {
      return NextResponse.json({ ok: false, error: presenceErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, timestamp: now });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
