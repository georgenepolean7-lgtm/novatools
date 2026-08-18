"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { addUserFavorite, removeUserFavorite } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import Link from "next/link";

interface ToolFavoriteButtonProps {
  toolSlug: string;
}

export function ToolFavoriteButton({ toolSlug }: ToolFavoriteButtonProps) {
  const { user, favorites, refreshFavorites, isConfigured } = useAuth();
  const [loading, setLoading] = useState(false);

  const isFavorite = favorites.includes(toolSlug);

  const handleToggle = async () => {
    if (!user || !isConfigured) return;
    setLoading(true);
    try {
      if (isFavorite) {
        await removeUserFavorite(user.id, toolSlug);
      } else {
        await addUserFavorite(user.id, toolSlug);
      }
      await refreshFavorites();
    } finally {
      setLoading(false);
    }
  };

  if (!user && isConfigured) {
    return (
      <Link
        href="/auth/login"
        title="Sign in to add to favorites"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/30 text-xs font-semibold text-slate-400 hover:text-pink-300 transition-colors shadow-sm"
      >
        <Heart className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Save</span>
      </Link>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={isFavorite ? "Remove from favorites" : "Save to favorites"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
        isFavorite
          ? "bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20"
          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-pink-300 hover:border-pink-500/30"
      }`}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
          isFavorite ? "fill-pink-400 text-pink-400" : ""
        }`}
      />
      <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
    </button>
  );
}
