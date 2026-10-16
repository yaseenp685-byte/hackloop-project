"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RealtimeStatusBadge } from "./RealtimeStatusBadge";
import { NotificationPanel } from "./NotificationPanel";
import { MOCK_STUDENT_NOTIFICATIONS } from "@/lib/mockData/studentData";
import {
  Search,
  Menu,
  X,
  Compass,
  GraduationCap,
  Building,
  Users,
  Shield,
  User,
  Sparkles,
  Award,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  // If in admin dashboard, we will render a tailored admin layout, but navbar handles public & portal routing
  const isAdminRoute = pathname?.startsWith("/admin");

  const NAV_LINKS = [
    { label: "Search Engine", href: "/search", icon: <Search className="w-4 h-4" /> },
    { label: "Hackathons", href: "/search?category=HACKATHONS", icon: <Award className="w-4 h-4" /> },
    { label: "Colleges & Unis", href: "/institutions", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Companies", href: "/companies", icon: <Building className="w-4 h-4" /> },
    { label: "Communities", href: "/communities", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Karnataka Emblem Colors Accent Badge */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-karnataka-red via-red-600 to-karnataka-yellow flex items-center justify-center shadow-xs">
                <span className="font-black text-white text-base tracking-tighter">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white leading-none">
                  Karnataka Hackathons
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                  State Community & Discovery Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real-time Status Badge */}
            <div className="hidden sm:block">
              <RealtimeStatusBadge showSimulateTrigger={false} />
            </div>

            {/* Notifications for logged-in preview */}
            <NotificationPanel notifications={MOCK_STUDENT_NOTIFICATIONS} />

            {/* Sign Up Direct Action Button */}
            <Link
              href="/signup"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-brand-500 hover:text-brand-600 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sign Up</span>
            </Link>

            {/* 3 Primary Login Experiences Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
                aria-expanded={loginDropdownOpen}
                aria-haspopup="true"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portals / Login</span>
                <span className="sm:hidden">Login</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
              </button>

              {loginDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 p-2 text-xs divide-y divide-neutral-100 dark:divide-neutral-800"
                  onMouseLeave={() => setLoginDropdownOpen(false)}
                >
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Sign In & Accounts
                    </span>
                    <Link
                      href="/signup"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Create Account</span>
                    </Link>
                  </div>

                  <div className="py-1 space-y-1">
                    {/* Unified Auth */}
                    <Link
                      href="/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-800 dark:text-neutral-200 font-medium"
                    >
                      <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          <span>Unified Sign In / Sign Up</span>
                          <span className="px-1 py-0.2 bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-[9px] font-bold rounded">New</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">Quick tab switcher & database auth</div>
                      </div>
                    </Link>

                    {/* Student Login */}
                    <Link
                      href="/login/student"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-800 dark:text-neutral-200 font-medium"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Student Portal</div>
                        <div className="text-[10px] text-neutral-500">Registrations, Teams, Profiles</div>
                      </div>
                    </Link>

                    {/* Organizer Login */}
                    <Link
                      href="/login/organizer"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-800 dark:text-neutral-200 font-medium"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Organizer Portal</div>
                        <div className="text-[10px] text-neutral-500">Publish Hackathons, Manage Teams</div>
                      </div>
                    </Link>

                    {/* Admin Login */}
                    <Link
                      href="/login/admin"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-800 dark:text-neutral-200 font-medium"
                    >
                      <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Administrator Console</div>
                        <div className="text-[10px] text-neutral-500">Verification & Platform Health</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-2 pb-6 space-y-3">
          <div className="py-2">
            <RealtimeStatusBadge />
          </div>

          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 text-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 text-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <Link
                href="/login/student"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-[11px] font-semibold"
              >
                Student
              </Link>
              <Link
                href="/login/organizer"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[11px] font-semibold"
              >
                Organizer
              </Link>
              <Link
                href="/login/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-center rounded-xl bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-[11px] font-semibold"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
