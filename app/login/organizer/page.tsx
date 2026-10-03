"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Award, ArrowRight, Mail, Lock, Building, UserCheck } from "lucide-react";

export default function OrganizerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sandhya.v@rvce.edu.in");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard/organizer");
    }, 400);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard/organizer");
    }, 250);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
            Organizer Portal Login
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Publish hackathons, verify student registrations, broadcast announcements &amp; evaluate team submissions.
          </p>
        </div>

        {/* 1-Click Demo Evaluation Shortcut */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              Demo Account (RVCE 8th Mile Faculty Lead)
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
              Pre-filled
            </span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
            Logged in as Dr. Sandhya V. (Faculty Coordinator, RVCE Bengaluru).
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1-Click Organizer Demo Access</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Institutional / Corporate Email
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
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Organizer Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
          Looking for other portals?{" "}
          <Link href="/login/student" className="text-brand-600 font-semibold hover:underline">
            Student
          </Link>{" "}
          •{" "}
          <Link href="/login/admin" className="text-brand-600 font-semibold hover:underline">
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
