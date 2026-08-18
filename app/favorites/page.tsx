"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { getToolBySlug } from "@/lib/tools/registry";
import { Heart, ArrowLeft, ExternalLink, Trash2, Sparkles, Layers } from "lucide-react";
import { removeUserFavorite } from "@/lib/supabase/client";

export default function FavoritesPage() {
  const { user, favorites, isLoading, refreshFavorites } = useAuth();

  const handleRemove = async (slug: string) => {
    if (!user) return;
    await removeUserFavorite(user.id, slug);
    await refreshFavorites();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading saved favorites...</div>
      </main>
    );
  }

  const favoriteTools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  return (
    <main className="min-h-screen bg-slate-950 text-white py-16 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-300 mb-2">
              <Heart className="w-3.5 h-3.5 fill-pink-500/20" />
              <span>SAVED TOOLS</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Your Favorite Tools</h1>
            <p className="text-sm text-slate-400 mt-1">
              Quick access to your most frequently used utilities.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All 250 Tools</span>
          </Link>
        </div>

        {!user ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Sign In to Sync Favorites</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create a free account or sign in to save your favorite tools across all your devices.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                Sign In or Register
              </Link>
            </div>
          </div>
        ) : favoriteTools.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">No Favorites Yet</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click the star or heart icon on any of our 250 tools to add them to your personal favorites dashboard.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Explore 250 Tools
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => (
              <div
                key={tool.slug}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {tool.category}
                    </span>
                    <button
                      onClick={() => handleRemove(tool.slug)}
                      title="Remove from favorites"
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> In-browser
                  </span>
                  <Link
                    href={`/${tool.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
