import { NextResponse } from "next/server";
import { createSupabaseServerClient, verifyAdminSession } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Try calling the RPC function get_admin_metrics if available
    let rpcMetrics: Record<string, unknown> | null = null;
    try {
      const { data, error } = await supabase.rpc("get_admin_metrics");
      if (!error && data && typeof data === "object") {
        rpcMetrics = data as Record<string, unknown>;
      }
    } catch {
      // RPC fallback to direct queries
    }

    // 2. Fetch profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, role, created_at");

    const profileList = profiles || [];
    const totalUsers = profileList.length;
    const adminUsers = profileList.filter((p) => p.role === "admin").length;
    const normalUsers = profileList.filter((p) => p.role !== "admin").length;

    const registrationsToday = profileList.filter(
      (p) => p.created_at && new Date(p.created_at) >= new Date(oneDayAgo)
    ).length;
    const registrations7d = profileList.filter(
      (p) => p.created_at && new Date(p.created_at) >= new Date(sevenDaysAgo)
    ).length;
    const registrations30d = profileList.filter(
      (p) => p.created_at && new Date(p.created_at) >= new Date(thirtyDaysAgo)
    ).length;

    // 3. Fetch Online Now from user_presence (last_seen_at >= now() - 5 minutes)
    const { data: activePresence } = await supabase
      .from("user_presence")
      .select("user_id, last_seen_at")
      .gte("last_seen_at", fiveMinutesAgo);

    const onlineNow = activePresence ? activePresence.length : 0;

    // 4. Fetch Subscriptions & Premium counts
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("id, status, plan");

    const activeSubscriptionsList = (subscriptions || []).filter(
      (s) => s.status === "active"
    );
    const activeSubscriptions = activeSubscriptionsList.length;
    const premiumCustomers = activeSubscriptions;
    const freeUsers = Math.max(0, totalUsers - premiumCustomers);

    // Merge with RPC metrics if provided
    const metrics = {
      totalUsers: (rpcMetrics?.total_users as number) ?? totalUsers,
      normalUsers: (rpcMetrics?.normal_users as number) ?? normalUsers,
      adminUsers: (rpcMetrics?.admin_users as number) ?? adminUsers,
      confirmedUsers: (rpcMetrics?.confirmed_users as number) ?? totalUsers,
      registrationsToday: (rpcMetrics?.registrations_24h as number) ?? registrationsToday,
      registrations7d: (rpcMetrics?.registrations_7d as number) ?? registrations7d,
      registrations30d: (rpcMetrics?.registrations_30d as number) ?? registrations30d,
      loginActivity24h: (rpcMetrics?.logins_24h as number) ?? (onlineNow > 0 ? onlineNow : registrationsToday),
      loginActivity7d: (rpcMetrics?.logins_7d as number) ?? registrations7d,
      loginActivity30d: (rpcMetrics?.logins_30d as number) ?? registrations30d,
      onlineNow: (rpcMetrics?.online_now as number) ?? onlineNow,
      premiumCustomers: (rpcMetrics?.premium_customers as number) ?? premiumCustomers,
      activeSubscriptions: (rpcMetrics?.active_subscriptions as number) ?? activeSubscriptions,
      freeUsers: (rpcMetrics?.free_users as number) ?? freeUsers,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ metrics });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
