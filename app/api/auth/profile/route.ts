import { NextResponse } from "next/server";
import { getServerCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userProfile = await getServerCurrentUser();
    if (!userProfile) {
      return NextResponse.json({ error: "Unauthorized or profile not found" }, { status: 401 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
