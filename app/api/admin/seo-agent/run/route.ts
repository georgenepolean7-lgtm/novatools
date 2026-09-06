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
          success: false,
          status: "BLOCKED",
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
          success: false,
          error: "Production execution requires explicit confirmation",
          details: "Live mutation requires an explicit confirmation step ({ dryRun: false, confirmed: true }).",
          confirmationRequired: true,
        },
        { status: 400 }
      );
    }

    // 1. ADMIN API GUARDRAIL (Task 1 & Task 3):
    // When dryRun === false and the code is running in Vercel Serverless:
    // DO NOT execute live file mutations inside the serverless function (Vercel's /var/task is read-only).
    // Dispatch to the dedicated worker (scripts/run-seo-cycle.js) instead.
    const isVercelServerless = process.env.VERCEL === "1";

    if (!dryRun && isVercelServerless) {
      // Option A: GitHub Actions dispatch if configured
      const githubToken = process.env.GITHUB_DISPATCH_TOKEN || process.env.GITHUB_TOKEN;
      const githubRepo =
        process.env.GITHUB_REPOSITORY ||
        (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
          ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
          : undefined);

      if (githubToken && githubRepo) {
        try {
          const dispatchRes = await fetch(
            `https://api.github.com/repos/${githubRepo}/actions/workflows/seo-cycle.yml/dispatches`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "NovaTools-SeoAgent-Admin",
              },
              body: JSON.stringify({
                ref: "main",
                inputs: {
                  dryRun: "false",
                  slug: forceSlug || "",
                },
              }),
            }
          );

          if (dispatchRes.ok || dispatchRes.status === 204) {
            store.setCurrentCycleStatus("DISPATCHED");
            return NextResponse.json({
              success: true,
              status: "DISPATCHED",
              dispatched: true,
              target: "GITHUB_ACTIONS",
              workflow: "seo-cycle.yml",
              message: "Autonomous live mutation cycle dispatched to GitHub Actions worker workflow.",
              environment: "VERCEL_SERVERLESS",
              workerScript: "scripts/run-seo-cycle.js",
              workerCommand: `node scripts/run-seo-cycle.js${forceSlug ? ` --slug ${forceSlug}` : ""}`,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (dispatchErr) {
          console.error("[SeoAgent Run Route] GitHub Actions dispatch failed:", dispatchErr);
        }
      }

      // Option B: Dedicated worker webhook if configured
      const workerWebhookUrl = process.env.SEO_WORKER_WEBHOOK_URL;
      if (workerWebhookUrl) {
        try {
          const webhookRes = await fetch(workerWebhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(process.env.SEO_WORKER_SECRET ? { Authorization: `Bearer ${process.env.SEO_WORKER_SECRET}` } : {}),
            },
            body: JSON.stringify({
              dryRun: false,
              slug: forceSlug,
              timestamp: new Date().toISOString(),
            }),
          });

          if (webhookRes.ok) {
            store.setCurrentCycleStatus("DISPATCHED");
            return NextResponse.json({
              success: true,
              status: "DISPATCHED",
              dispatched: true,
              target: "DEDICATED_WORKER_WEBHOOK",
              message: "Autonomous live mutation cycle dispatched to dedicated worker webhook.",
              environment: "VERCEL_SERVERLESS",
              workerScript: "scripts/run-seo-cycle.js",
              workerCommand: `node scripts/run-seo-cycle.js${forceSlug ? ` --slug ${forceSlug}` : ""}`,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (webhookErr) {
          console.error("[SeoAgent Run Route] Worker webhook dispatch failed:", webhookErr);
        }
      }

      // Option C: Return clear structured guardrail response explaining dedicated worker requirement
      store.setCurrentCycleStatus("BLOCKED");
      return NextResponse.json(
        {
          success: false,
          status: "BLOCKED",
          dispatchRequired: true,
          dispatched: false,
          error: "Vercel Serverless filesystem is read-only. Worker dispatch required.",
          message:
            "Live autonomous mutations cannot execute directly inside Vercel Serverless (/var/task is read-only). Dispatch the mutation cycle to the dedicated worker in a writable repository environment via: node scripts/run-seo-cycle.js (or configure GITHUB_TOKEN / SEO_WORKER_WEBHOOK_URL for automated dispatch).",
          environment: "VERCEL_SERVERLESS",
          workerScript: "scripts/run-seo-cycle.js",
          workerCommand: `node scripts/run-seo-cycle.js${forceSlug ? ` --slug ${forceSlug}` : ""}`,
          dryRunSupported: true,
          killSwitchActive: false,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // In dryRun mode, or in standalone/local writable worker environment:
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
