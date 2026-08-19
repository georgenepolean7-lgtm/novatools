import { NextResponse } from "next/server";
import { createSupabaseServerClient, verifyAdminSession, getServerSystemSettings } from "@/lib/supabase/server";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const settings = await getServerSystemSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const { isAdmin, user } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();
    const now = new Date().toISOString();

    const settingsRows = [
      {
        key: "payment_enabled",
        value: { enabled: !!body.paymentEnabled },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "premium_enabled",
        value: { enabled: !!body.premiumEnabled },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "premium_amount_inr",
        value: { amount: Number(body.premiumAmountInr) || 99 },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "ad_free_access",
        value: { enabled: !!body.adFreeAccess },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "maintenance_mode",
        value: { enabled: !!body.maintenanceMode },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "updf_affiliate_enabled",
        value: { enabled: body.updfAffiliateEnabled !== undefined ? !!body.updfAffiliateEnabled : true },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "updf_affiliate_url",
        value: { url: String(body.updfAffiliateUrl || "https://www.dpbolvw.net/click-101855940-15717946").trim() },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "updf_cta_text",
        value: { text: String(body.updfCtaText || "Explore UPDF").trim() },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "updf_disclosure_enabled",
        value: { enabled: body.updfDisclosureEnabled !== undefined ? !!body.updfDisclosureEnabled : true },
        updated_at: now,
        updated_by: user?.id || null,
      },
      {
        key: "updf_banner_enabled",
        value: { enabled: body.updfBannerEnabled !== undefined ? !!body.updfBannerEnabled : true },
        updated_at: now,
        updated_by: user?.id || null,
      },
    ];

    const { error: updateError } = await supabase
      .from("admin_settings")
      .upsert(settingsRows, { onConflict: "key" });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Insert audit log in audit_logs (and admin_audit_logs if present)
    if (user?.id) {
      const auditEntry = {
        admin_id: user.id,
        user_id: user.id,
        action: "UPDATE_SYSTEM_SETTINGS",
        target_type: "SYSTEM_SETTINGS",
        target_id: "admin_settings",
        metadata: body,
        details: body,
        created_at: now,
      };
      const { error: auditErr } = await supabase.from("audit_logs").insert(auditEntry);
      if (auditErr) {
        await supabase.from("admin_audit_logs").insert({
          admin_id: user.id,
          action: "UPDATE_SYSTEM_SETTINGS",
          target_type: "SYSTEM_SETTINGS",
          target_id: "admin_settings",
          metadata: body,
          created_at: now,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
