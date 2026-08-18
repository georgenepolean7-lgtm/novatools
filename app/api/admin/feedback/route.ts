import { NextResponse } from "next/server";
import { createSupabaseServerClient, verifyAdminSession } from "@/lib/supabase/server";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: feedback, error } = await supabase
      .from("tool_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ feedback: [] });
    }
    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json({ feedback: [] });
  }
}
