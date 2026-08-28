import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/server";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  INDEXNOW_HOST,
  getPublicIndexableUrls,
  submitToIndexNow,
} from "@/lib/seo/indexnow";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const publicUrls = getPublicIndexableUrls();

  return NextResponse.json({
    status: "configured",
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    totalPublicUrls: publicUrls.length,
    sampleUrls: publicUrls.slice(0, 10),
  });
}

export async function POST(request: Request) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    let customUrls: string[] | undefined;
    try {
      const body = await request.json();
      if (Array.isArray(body?.urls) && body.urls.length > 0) {
        customUrls = body.urls;
      }
    } catch {
      // Body is optional; if omitted, all public URLs will be submitted
    }

    const result = await submitToIndexNow(customUrls);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
