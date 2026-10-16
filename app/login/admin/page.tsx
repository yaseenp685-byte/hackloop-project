"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowRight, Mail, Lock, UserCheck, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { ApiService } from "@/services/apiService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@karnatakahackathons.gov.in");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await ApiService.login({
        email: email.trim().toLowerCase(),
        password,
      });
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid administrative credentials or insufficient access privileges.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await ApiService.login({
        email: "admin@karnatakahackathons.gov.in",
        password: "Admin@123",
      });
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in to administrator console.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
            Administrator Console
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Access state verification queues, moderation items, crawler ingestion feeds and platform health telemetry.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Evaluation Shortcut */}
        <div className="mb-6 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-red-900 dark:text-red-200">
              Demo Platform Admin
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300">
              Superadmin
            </span>
          </div>
          <p className="text-[11px] text-red-700 dark:text-red-300 mt-1">
            Pre-authenticated with KSHEC / State Technical Oversight access.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>1-Click Admin Console Access</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Admin Identity / Security Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Security Token / Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-red-700 text-white font-semibold text-sm hover:bg-red-800 transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
          Looking for other portals?{" "}
          <Link href="/login/student" className="text-brand-600 font-semibold hover:underline">
            Student
          </Link>{" "}
          •{" "}
          <Link href="/login/organizer" className="text-brand-600 font-semibold hover:underline">
            Organizer
          </Link>{" "}
          •{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Unified Login
          </Link>
        </div>
      </div>
    </div>
  );
}
