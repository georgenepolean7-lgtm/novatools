import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";
import { UserProfile, SystemSettings } from "./types";
import { DEFAULT_SYSTEM_SETTINGS, isSupabaseConfigured } from "./client";
export { isSupabaseConfigured };

/**
 * Server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rjnjrvemsyhaeonkvbja.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Get current authenticated user on the server.
 */
export async function getServerCurrentUser(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, role, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: user.email || "",
      displayName: profile.display_name || user.email?.split("@")[0] || "User",
      avatarUrl: null,
      role: (profile.role || "user") as "user" | "admin" | "moderator",
      isPremium: false,
      premiumExpiresAt: null,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Server-side Admin verification with database RLS check.
 * NEVER trusts client cookies or localStorage.
 */
export async function verifyAdminSession(): Promise<{ isAdmin: boolean; user: UserProfile | null }> {
  if (!isSupabaseConfigured()) {
    // In unconfigured / local development mode, allow admin dashboard preview
    return { isAdmin: true, user: null };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { isAdmin: false, user: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile || profile.role !== "admin") {
      return { isAdmin: false, user: null };
    }

    const fullUser = await getServerCurrentUser();
    return { isAdmin: true, user: fullUser };
  } catch {
    return { isAdmin: false, user: null };
  }
}

/**
 * Fetch system settings from server from public.admin_settings table.
 */
export async function getServerSystemSettings(): Promise<SystemSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SYSTEM_SETTINGS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: rows, error } = await supabase
      .from("admin_settings")
      .select("key, value, updated_at");

    if (error || !rows || rows.length === 0) {
      return DEFAULT_SYSTEM_SETTINGS;
    }

    const settingsMap = new Map<string, unknown>();
    let latestUpdatedAt = new Date().toISOString();

    for (const row of rows) {
      settingsMap.set(row.key, row.value);
      if (row.updated_at) latestUpdatedAt = row.updated_at;
    }

    const parseBool = (key: string, fallback: boolean) => {
      const val = settingsMap.get(key);
      if (val === undefined || val === null) return fallback;
      if (typeof val === "boolean") return val;
      if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        if (typeof obj.enabled === "boolean") return obj.enabled;
        if (typeof obj.value === "boolean") return obj.value;
      }
      return fallback;
    };

    const parseNum = (key: string, fallback: number) => {
      const val = settingsMap.get(key);
      if (val === undefined || val === null) return fallback;
      if (typeof val === "number") return val;
      if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        if (typeof obj.amount === "number") return obj.amount;
        if (typeof obj.value === "number") return obj.value;
        if (typeof obj.amount === "string") return Number(obj.amount) || fallback;
      }
      if (typeof val === "string") return Number(val) || fallback;
      return fallback;
    };

    const parseStr = (key: string, fallback: string) => {
      const val = settingsMap.get(key);
      if (val === undefined || val === null) return fallback;
      if (typeof val === "string") return val;
      if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        if (typeof obj.url === "string") return obj.url;
        if (typeof obj.text === "string") return obj.text;
        if (typeof obj.value === "string") return obj.value;
      }
      return fallback;
    };

    return {
      id: "default",
      paymentEnabled: parseBool("payment_enabled", false),
      premiumEnabled: parseBool("premium_enabled", false),
      premiumAmountInr: parseNum("premium_amount_inr", 99),
      adFreeAccess: parseBool("ad_free_access", true),
      maintenanceMode: parseBool("maintenance_mode", false),
      signupEnabled: parseBool("signup_enabled", true),
      updfAffiliateEnabled: parseBool("updf_affiliate_enabled", true),
      updfAffiliateUrl: parseStr("updf_affiliate_url", "https://www.dpbolvw.net/click-101855940-15717946"),
      updfCtaText: parseStr("updf_cta_text", "Explore UPDF"),
      updfDisclosureEnabled: parseBool("updf_disclosure_enabled", true),
      updfBannerEnabled: parseBool("updf_banner_enabled", true),
      updatedAt: latestUpdatedAt,
    };
  } catch {
    return DEFAULT_SYSTEM_SETTINGS;
  }
}
