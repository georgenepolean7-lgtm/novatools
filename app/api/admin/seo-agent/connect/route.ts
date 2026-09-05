import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/server";

const COMPOSIO_BASE_URL = "https://backend.composio.dev/api/v3.1";

const PROVIDERS = {
  gsc: {
    toolkitSlug: "google_search_console",
    label: "Google Search Console",
  },
  ga4: {
    toolkitSlug: "google_analytics",
    label: "Google Analytics 4",
  },
} as const;

type ProviderKey = keyof typeof PROVIDERS;

export async function GET(req: NextRequest) {
  const { isAdmin, user } = await verifyAdminSession();

  if (!isAdmin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user?.id) {
    return NextResponse.json(
      { error: "Authenticated admin user is required before connecting telemetry." },
      { status: 401 }
    );
  }

  const provider = new URL(req.url).searchParams.get("provider") as ProviderKey | null;
  if (!provider || !(provider in PROVIDERS)) {
    return NextResponse.json(
      { error: "Invalid provider. Use provider=gsc or provider=ga4." },
      { status: 400 }
    );
  }

  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "COMPOSIO_API_KEY is not configured on the production server." },
      { status: 503 }
    );
  }

  const { toolkitSlug, label } = PROVIDERS[provider];

  try {
    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    };

    const existingRes = await fetch(
      `${COMPOSIO_BASE_URL}/connected_accounts?toolkit_slugs=${encodeURIComponent(toolkitSlug)}&user_ids=${encodeURIComponent(user.id)}&statuses=ACTIVE&limit=10`,
      { headers, cache: "no-store" }
    );

    if (existingRes.ok) {
      const existing = await existingRes.json();
      const activeAccounts = Array.isArray(existing?.items) ? existing.items : [];
      if (activeAccounts.length > 0) {
        return NextResponse.redirect(
          new URL(`/admin/seo?seo_connected=${provider}&already_connected=1`, req.url)
        );
      }
    }

    const authConfigRes = await fetch(
      `${COMPOSIO_BASE_URL}/auth_configs?toolkit_slug=${encodeURIComponent(toolkitSlug)}&is_composio_managed=true&show_disabled=false&limit=20`,
      { headers, cache: "no-store" }
    );

    if (!authConfigRes.ok) {
      const details = await authConfigRes.text();
      return NextResponse.json(
        { error: `Unable to load the Composio auth configuration for ${label}.`, details: details.slice(0, 500) },
        { status: 502 }
      );
    }

    const authConfigData = await authConfigRes.json();
    const authConfig = (authConfigData?.items || []).find(
      (item: { status?: string; auth_scheme?: string }) =>
        item?.status === "ENABLED" && item?.auth_scheme === "OAUTH2"
    );

    if (!authConfig?.id) {
      return NextResponse.json(
        {
          error: `No enabled Composio OAuth configuration is available for ${label}.`,
          details: `Create or enable a Composio-managed OAuth auth config for toolkit ${toolkitSlug}.`,
        },
        { status: 503 }
      );
    }

    const callbackUrl = new URL(
      `/admin/seo?seo_connected=${provider}`,
      req.url
    ).toString();

    const linkRes = await fetch(`${COMPOSIO_BASE_URL}/connected_accounts/link`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        auth_config_id: authConfig.id,
        user_id: user.id,
        alias: `novatools-seo-${provider}`,
        callback_url: callbackUrl,
      }),
      cache: "no-store",
    });

    if (!linkRes.ok) {
      const details = await linkRes.text();
      return NextResponse.json(
        {
          error: `Unable to start the ${label} authorization flow.`,
          details: details.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const linkData = await linkRes.json();
    if (!linkData?.redirect_url) {
      return NextResponse.json(
        { error: `Composio did not return an authorization URL for ${label}.` },
        { status: 502 }
      );
    }

    return NextResponse.redirect(linkData.redirect_url);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Telemetry connection request failed for ${label}.`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}
