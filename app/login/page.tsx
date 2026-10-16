import React, { Suspense } from "react";
import Link from "next/link";
import { GraduationCap, Award, Shield, ArrowRight, Sparkles } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";

export const metadata = {
  title: "Sign In & Access Portals | Karnataka Hackathon Discovery Portal",
  description: "Sign in to access specialized dashboards for students, organizers, or administrators across Karnataka.",
};

export default function LoginPage() {
  const PORTAL_LINKS = [
    {
      title: "Student Portal",
      description: "Discover hackathons, form college teams, accept invites, track submissions.",
      href: "/login/student",
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      color: "border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 hover:border-blue-400",
      cta: "Direct Student Login",
    },
    {
      title: "Organizer Portal",
      description: "Publish hackathons, coordinate participants, manage reviews & judging.",
      href: "/login/organizer",
      icon: <Award className="w-6 h-6 text-amber-600" />,
      color: "border-amber-200 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/20 hover:border-amber-400",
      cta: "Direct Organizer Login",
    },
    {
      title: "Administrator Console",
      description: "Manage statewide verification queues, moderation items, audit logs.",
      href: "/login/admin",
      icon: <Shield className="w-6 h-6 text-red-600" />,
      color: "border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/20 hover:border-red-400",
      cta: "Admin Security Console",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Top Main Auth Container */}
      <Suspense fallback={<div className="text-center py-12 text-sm text-neutral-500">Loading authentication portal...</div>}>
        <AuthCard initialTab="signin" />
      </Suspense>

      {/* Alternative Dedicated Role Portals Section */}
      <div className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Dedicated Role Portals & Direct Links
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Need direct access to a specific portal interface or the government oversight console?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PORTAL_LINKS.map((portal) => (
            <div
              key={portal.title}
              className={`p-5 rounded-2xl border ${portal.color} transition-all flex flex-col justify-between shadow-xs`}
            >
              <div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-2xs w-fit mb-3">
                  {portal.icon}
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {portal.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <Link
                href={portal.href}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs text-center flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span>{portal.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
