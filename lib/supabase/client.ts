import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";
import { UserProfile, SystemSettings } from "./types";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  id: "default",
  paymentEnabled: false,
  premiumEnabled: false,
  premiumAmountInr: 99,
  adFreeAccess: false,
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SUPABASE_URL = "https://rjnjrvemsyhaeonkvbja.supabase.co";

/**
 * Check whether Supabase environment variables are present and configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    !!url &&
    !!key &&
    !url.includes("your-project") &&
    !key.includes("your_supabase") &&
    !key.includes("dummy")
  );
}

// Singleton browser client instance
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Get or create the Supabase browser client with Next.js SSR cookie syncing.
 */
export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rjnjrvemsyhaeonkvbja.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_dummy_fallback";

  browserClient = createBrowserClient<Database>(url, key);
  return browserClient;
}

/**
 * Fetch the current authenticated user's profile.
 */
export async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[NovaTools Auth] No active auth user:", authError?.message);
      }
      return null;
    }

    // 1. Query by authenticated user ID
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, role, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    // 2. Fallback to server route /api/auth/profile if client-side query failed
    if (profileError || !profile) {
      if (process.env.NODE_ENV === "development" && profileError) {
        console.warn("[NovaTools Auth] Browser query failed, trying server API:", profileError.message);
      }
      try {
        const res = await fetch("/api/auth/profile", { cache: "no-store" });
        if (res.ok) {
          const serverProfile = await res.json();
          if (serverProfile && serverProfile.id) {
            profile = {
              id: serverProfile.id,
              display_name: serverProfile.displayName || serverProfile.display_name,
              role: serverProfile.role,
              created_at: serverProfile.createdAt || serverProfile.created_at,
              updated_at: serverProfile.updatedAt || serverProfile.updated_at,
            };
            profileError = null;
          }
        }
      } catch (apiErr) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[NovaTools Auth] /api/auth/profile fetch failed:", apiErr);
        }
      }
    }

    if (profileError && !profile) {
      if (process.env.NODE_ENV === "development") {
        console.error("[NovaTools Auth] Profile fetch failed:", {
          authenticatedUserId: user.id,
          error: profileError.message,
          code: profileError.code,
        });
      }
      return null;
    }

    if (!profile) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[NovaTools Auth] No profile record found for user:", user.id);
      }
      return null;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[NovaTools Auth] Profile loaded successfully:", {
        authenticatedUserId: user.id,
        profileId: profile.id,
        role: profile.role,
      });
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
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[NovaTools Auth] Unexpected error in fetchCurrentUserProfile:", err);
    }
    return null;
  }
}

/**
 * Record non-sensitive tool usage.
 * NEVER sends tool input/output.
 */
export async function trackToolUsage(toolSlug: string, userId?: string | null): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = getSupabaseBrowserClient();
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }
    if (!userId) return; // Anonymous usage stays in browser

    await supabase
      .from("tool_usage")
      .upsert(
        {
          user_id: userId,
          tool_slug: toolSlug,
          last_used_at: new Date().toISOString(),
        },
        { onConflict: "user_id,tool_slug" }
      );
  } catch {
    // Non-blocking silently
  }
}

/**
 * Fetch favorite tool slugs for a user.
 */
export async function fetchUserFavorites(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !userId) return [];
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("user_tool_favorites")
      .select("tool_slug")
      .eq("user_id", userId);

    if (error || !data) return [];
    return data.map((item) => item.tool_slug);
  } catch {
    return [];
  }
}

/**
 * Add a tool to favorites.
 */
export async function addUserFavorite(userId: string, toolSlug: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !userId) return false;
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("user_tool_favorites")
      .insert({ user_id: userId, tool_slug: toolSlug });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Remove a tool from favorites.
 */
export async function removeUserFavorite(userId: string, toolSlug: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !userId) return false;
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("user_tool_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("tool_slug", toolSlug);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Submit user rating and feedback for a tool.
 */
export async function submitToolFeedback(
  toolSlug: string,
  rating: number,
  feedback?: string,
  userId?: string | null
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true }; // Graceful degradation
  }
  if (rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5 stars." };
  }
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("tool_feedback").insert({
      tool_slug: toolSlug,
      rating,
      feedback: feedback?.trim() || null,
      user_id: userId || null,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error submitting feedback." };
  }
}
