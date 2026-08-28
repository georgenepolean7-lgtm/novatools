import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/server";
import {
  INDEXNOW_HOST,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  getPublicIndexableUrls,
  submitToIndexNow,
} from "@/lib/seo/indexnow";

export async function GET() {
  const { isAdmin, user } = await verifyAdminSession();
  if (!isAdmin || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicUrls = getPublicIndexableUrls();

  return NextResponse.json({
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    totalPublicUrls: publicUrls.length,
    sampleUrls: publicUrls.slice(0, 5),
  });
}

export async function POST(req: NextRequest) {
  const { isAdmin, user } = await verifyAdminSession();
  if (!isAdmin || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let customUrls: string[] | undefined;
    try {
      const body = await req.json();
      if (body && Array.isArray(body.urls)) {
        customUrls = body.urls;
      }
    } catch {
      // Empty body is allowed - defaults to all public URLs
    }

    const result = await submitToIndexNow(customUrls);
    return NextResponse.json(result, {
      status: result.success ? 200 : 502,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to execute IndexNow submission",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
