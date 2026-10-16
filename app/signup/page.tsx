import React, { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";
import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create Account | Karnataka Hackathon Discovery Portal",
  description: "Register as a student or organizer to participate in hackathons across Karnataka's 31 districts.",
};

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Background radial accent */}
      <div className="w-full max-w-4xl mx-auto mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Karnataka State Technology Portal Registration</span>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-sm text-neutral-500">Loading registration form...</div>}>
        <AuthCard initialTab="signup" />
      </Suspense>

      {/* Security & Regulatory Footer Note */}
      <div className="mt-8 text-center text-xs text-neutral-400 max-w-md">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Protected with bcrypt password hashing & secure HTTP-only cookies.</span>
        </p>
        <p className="mt-1">
          Need help? Return to <Link href="/" className="text-brand-600 hover:underline">Portal Home</Link> or view our <Link href="/search" className="text-brand-600 hover:underline">Public Search Directory</Link>.
        </p>
      </div>
    </div>
  );
}

