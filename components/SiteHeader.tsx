"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Heart,
  LogIn,
  UserPlus,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";

export default function SiteHeader() {
  const router = useRouter();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/icon.png"
            alt="Nova Tools"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl object-cover shadow-md transition-transform group-hover:scale-105"
          />

          <div>
            <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Nova</span> <span className="text-cyan-400">Tools</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20 font-normal">
                250+ Tools
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              A product by Nova Code Tech
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-semibold text-slate-300">
          <Link
            href="/#tools"
            className="transition hover:text-cyan-400 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>All Tools</span>
          </Link>

          <Link
            href="/favorites"
            className="flex items-center gap-1.5 text-slate-300 hover:text-pink-400 transition-colors"
            title="Saved Tools"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>Favorites</span>
          </Link>

          <Link
            href="/pricing"
            className="transition hover:text-cyan-400 font-semibold"
          >
            Pricing
          </Link>

          <Link
            href="/#about"
            className="transition hover:text-cyan-400"
          >
            About
          </Link>

          <Link
            href="/#contact"
            className="transition hover:text-cyan-400"
          >
            Contact
          </Link>

          {/* Admin link badge if admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {/* Auth State Desktop */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-white transition-all text-xs font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[11px] font-bold uppercase text-white shadow-inner">
                    {profile?.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {profile?.displayName || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl divide-y divide-slate-800/80 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-white truncate">
                        {profile?.displayName || "Nova User"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                            isAdmin
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}
                        >
                          {isAdmin ? "Admin Role" : "Free Tier"}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        <span>Saved Favorites</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors font-semibold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/auth/signup"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:scale-105 text-white text-xs font-bold shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAdmin && (
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400"
              title="Admin"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-6 py-4 space-y-4 backdrop-blur-2xl">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-300">
            <Link
              href="/#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>All 250+ Tools</span>
            </Link>

            <Link
              href="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-900 flex items-center gap-2 text-pink-400"
            >
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-900"
            >
              Pricing &amp; Plans
            </Link>

            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-900"
            >
              About
            </Link>

            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-900"
            >
              Contact
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-2 font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-800/80">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold uppercase text-white">
                    {profile?.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {profile?.displayName || "Nova User"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-400"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-white text-center"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 text-xs font-bold text-white text-center"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}