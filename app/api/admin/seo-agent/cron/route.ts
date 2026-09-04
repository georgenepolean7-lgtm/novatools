import { NextRequest, NextResponse } from "next/server";
import { SeoAuditStore } from "@/lib/seo-agent/audit-store";

export async function GET(req: NextRequest) {
  // Verify Bearer Token against CRON_SECRET if configured
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }
  }

  const store = new SeoAuditStore();
  const killSwitchActive = store.isKillSwitchActive();
  const budgets = store.getBudgets();

  return NextResponse.json({
    status: "CRON_DISPATCHER_READY",
    message: "Cron trigger active. For full local Ollama / Hermes execution, run via: node scripts/run-seo-cycle.js",
    killSwitchActive,
    budgets,
    timestamp: new Date().toISOString(),
  });
}
