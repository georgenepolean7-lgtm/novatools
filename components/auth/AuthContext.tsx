"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, fetchCurrentUserProfile, fetchUserFavorites, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/supabase/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  favorites: string[];
  isLoading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  favorites: [],
  isLoading: true,
  isConfigured: false,
  isAdmin: false,
  refreshProfile: async () => {},
  refreshFavorites: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const configured = isSupabaseConfigured();
  const [isLoading, setIsLoading] = useState(configured);

  const refreshProfile = useCallback(async () => {
    if (!configured) return;
    const p = await fetchCurrentUserProfile();
    setProfile(p);
  }, [configured]);

  const refreshFavorites = useCallback(async () => {
    if (!configured || !user) {
      setFavorites([]);
      return;
    }
    const favs = await fetchUserFavorites(user.id);
    setFavorites(favs);
  }, [configured, user]);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // Check active session on idle to keep initial paint fast
    const initSession = () => {
      supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        if (currentSession?.user) {
          try {
            const [p, favs] = await Promise.all([
              fetchCurrentUserProfile(),
              fetchUserFavorites(currentSession.user.id),
            ]);
            setProfile(p);
            setFavorites(favs);
          } catch {
            // Handled inside fetchers
          }
        }
        setIsLoading(false);
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const win = window as unknown as {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      };
      win.requestIdleCallback(initSession, { timeout: 1500 });
    } else {
      setTimeout(initSession, 500);
    }

    // Listen for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.user) {
          try {
            const [p, favs] = await Promise.all([
              fetchCurrentUserProfile(),
              fetchUserFavorites(newSession.user.id),
            ]);
            setProfile(p);
            setFavorites(favs);
          } catch {
            // Handled inside fetchers
          }
        } else {
          setProfile(null);
          setFavorites([]);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  // Periodic user presence heartbeat for authenticated users
  useEffect(() => {
    if (!configured || !user) return;

    const sendHeartbeat = async () => {
      try {
        await fetch("/api/auth/heartbeat", { method: "POST" });
      } catch {
        // Silent
      }
    };

    // Immediate heartbeat on session detection
    sendHeartbeat();

    // Heartbeat every 2 minutes (120,000ms)
    const interval = setInterval(sendHeartbeat, 120000);

    const onFocus = () => {
      sendHeartbeat();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [configured, user]);

  const signOut = async () => {
    if (!configured) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setFavorites([]);
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        favorites,
        isLoading,
        isConfigured: configured,
        isAdmin,
        refreshProfile,
        refreshFavorites,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
