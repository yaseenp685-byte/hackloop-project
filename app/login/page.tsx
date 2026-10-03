import React from "react";
import Link from "next/link";
import { GraduationCap, Award, Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const ROLES = [
    {
      title: "Student Portal",
      description: "Discover hackathons, form college teams, accept invites, track submissions & recommendations.",
      href: "/login/student",
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      color: "border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 hover:border-blue-500",
      cta: "Student Login & Dashboard",
    },
    {
      title: "Organizer Portal",
      description: "Publish hackathons, coordinate participants, manage team reviews, announcements & judging.",
      href: "/login/organizer",
      icon: <Award className="w-8 h-8 text-amber-600" />,
      color: "border-amber-200 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/20 hover:border-amber-500",
      cta: "Organizer Login & Dashboard",
    },
    {
      title: "Administrator Console",
      description: "Manage statewide verification queues, moderation items, system health, audit logs and sync feeds.",
      href: "/login/admin",
      icon: <Shield className="w-8 h-8 text-red-600" />,
      color: "border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/20 hover:border-red-500",
      cta: "Admin Console Login",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Choose Your Portal
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Select your portal to access specialized dashboards for students, organizers, or administrators across Karnataka.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {ROLES.map((role) => (
          <div
            key={role.title}
            className={`p-6 rounded-3xl border ${role.color} transition-all duration-200 flex flex-col justify-between shadow-xs`}
          >
            <div>
              <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-2xs w-fit mb-4">
                {role.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                {role.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                {role.description}
              </p>
            </div>

            <Link
              href={role.href}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs text-center flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <span>{role.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
