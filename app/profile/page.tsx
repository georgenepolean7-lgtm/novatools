"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { User, Mail, Sparkles, Check, ArrowLeft, Heart } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, isLoading, isConfigured, refreshProfile, signOut } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user && isConfigured) {
      router.push("/auth/login");
    }
  }, [user, isLoading, isConfigured, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
      } else {
        setSaved(true);
        await refreshProfile();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading profile...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>USER PROFILE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Account Settings</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/favorites"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-xs font-semibold text-pink-300 flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500/20" />
              <span>Favorites</span>
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg shadow-cyan-500/20">
              {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{profile?.displayName || "User"}</h2>
                {profile?.role === "admin" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    profile?.role === "admin"
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                      : "bg-slate-800 text-cyan-400"
                  }`}
                >
                  Role: {profile?.role || "user"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  {profile?.isPremium ? "Premium Member" : "Free Plan"}
                </span>
                {profile?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="ml-2 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-sm transition-all"
                  >
                    Open Admin Dashboard →
                  </Link>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-slate-800">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}
            {saved && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Display Name</span>
              </label>
              <input
                type="text"
                value={displayName || profile?.displayName || ""}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Email (Read-only)</span>
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 font-mono text-sm cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </form>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Nova Tools</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
