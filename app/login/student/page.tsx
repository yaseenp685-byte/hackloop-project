"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowRight, Mail, Lock, UserCheck, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { ApiService } from "@/services/apiService";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("karan.gowda@rvce.edu.in");
  const [password, setPassword] = useState("Password@123");
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
      router.push("/dashboard/student");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please verify your student email and password.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await ApiService.login({
        email: "karan.gowda@rvce.edu.in",
        password: "Password@123",
      });
      router.push("/dashboard/student");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in to demo account.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
            Student Login
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Access hackathons, registrations, teams and opportunities across Karnataka institutions.
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
        <div className="mb-6 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-900 dark:text-blue-200">
              Demo Account (RVCE Student)
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
              Pre-filled
            </span>
          </div>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
            Logged in as Karan Gowda (B.E. CSE, RVCE Bengaluru).
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>1-Click Student Demo Access</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              College Email or USN / Roll Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usn@college.edu.in"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Password
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
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/signup?role=student"
            className="text-xs text-brand-600 font-bold hover:underline"
          >
            New Student? Create an account (Sign Up) →
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
          Looking for other portals?{" "}
          <Link href="/login/organizer" className="text-brand-600 font-semibold hover:underline">
            Organizer
          </Link>{" "}
          •{" "}
          <Link href="/login/admin" className="text-brand-600 font-semibold hover:underline">
            Admin
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
