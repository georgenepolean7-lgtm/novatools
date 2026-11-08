import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/lib/supabase/database.types";

/**
 * Only run the Supabase session refresh where the server actually needs
 * an authenticated session. Public pages and tool routes must not wait on
 * Supabase, because a slow auth backend can otherwise turn into a 25s
 * middleware timeout and a Cloudflare 504.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://rjnjrvemsyhaeonkvbja.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !key ||
    url.includes("your-project") ||
    key.includes("your_supabase")
  ) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    await supabase.auth.getUser();
  } catch {
    // Authentication refresh must never take down the page.
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/callback",
  ],
};
