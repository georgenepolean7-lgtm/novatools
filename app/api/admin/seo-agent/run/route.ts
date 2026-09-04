import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/server";
import { SeoAgentRunner } from "@/lib/seo-agent/runner";
import { SeoAuditStore } from "@/lib/seo-agent/audit-store";

export async function POST(req: NextRequest) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let dryRun = true; // Safe default
    let confirmed = false;
    let forceSlug: string | undefined;

    try {
      const body = await req.json();
      if (body.dryRun !== undefined) dryRun = Boolean(body.dryRun);
      if (body.confirmed !== undefined) confirmed = Boolean(body.confirmed);
      if (body.slug) forceSlug = String(body.slug);
    } catch {
      // Body is optional; defaults apply
    }

    const store = new SeoAuditStore();

    // Check emergency kill switch
    if (store.isKillSwitchActive()) {
      return NextResponse.json(
        {
          error: "Emergency Kill Switch is ACTIVE",
          details: "All autonomous SEO cycle executions are paused. Deactivate the kill switch before executing.",
          killSwitchActive: true,
        },
        { status: 403 }
      );
    }

    // Explicit confirmation guardrail for live production execution
    if (!dryRun && !confirmed) {
      return NextResponse.json(
        {
          error: "Production execution requires explicit confirmation",
          details: "Live mutation requires an explicit confirmation step ({ dryRun: false, confirmed: true }).",
          confirmationRequired: true,
        },
        { status: 400 }
      );
    }

    store.setCurrentCycleStatus("RUNNING");
    const runner = new SeoAgentRunner();
    const result = await runner.runCycle({ dryRun, forceSingleSlug: forceSlug });
    store.setCurrentCycleStatus(result.status);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const store = new SeoAuditStore();
    store.setCurrentCycleStatus("IDLE");
    return NextResponse.json(
      { error: "Failed to execute SEO cycle", details: String(err) },
      { status: 500 }
    );
  }
}
