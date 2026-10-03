"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ApiService } from "@/services/apiService";
import { StudentProfile, StudentRegistration, StudentTeam, TeamInvitation, StudentNotification } from "@/types/student";
import { Hackathon } from "@/types/hackathon";
import { VerificationBadge } from "@/components/VerificationBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardCard } from "@/components/DashboardCard";
import { DataTable, Column } from "@/components/DataTable";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  Trophy,
  Bell,
  Sparkles,
  MapPin,
  CheckCircle,
  ExternalLink,
  Plus,
  Send,
  Ticket,
  Code2,
  FolderGit2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [teams, setTeams] = useState<StudentTeam[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [recommendedHackathons, setRecommendedHackathons] = useState<Hackathon[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "registrations" | "teams" | "submissions" | "profile">("overview");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    ApiService.getStudentDashboardData().then((data) => {
      setProfile(data.profile);
      setRegistrations(data.registrations);
      setTeams(data.teams);
      setNotifications(data.notifications);
    });

    ApiService.getHackathons().then((res) => {
      if (res.success && res.data) {
        setRecommendedHackathons(res.data.data.slice(0, 3));
      }
    });
  }, []);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteModalOpen(false);
      setInviteEmail("");
      setInviteSuccess(false);
    }, 1200);
  };

  const registrationColumns: Column<StudentRegistration>[] = [
    {
      header: "Hackathon",
      mobileLabel: "Hackathon",
      cell: (item) => (
        <div>
          <span className="font-bold text-neutral-900 dark:text-white block">{item.hackathonTitle}</span>
          <span className="text-xs text-neutral-500">Ticket: #{item.ticketNumber}</span>
        </div>
      ),
    },
    {
      header: "Event Dates",
      mobileLabel: "Dates",
      accessorKey: "eventDate",
    },
    {
      header: "Team & Role",
      mobileLabel: "Team",
      cell: (item) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          {item.teamName || "Individual"} ({item.userRole})
        </span>
      ),
    },
    {
      header: "Status",
      mobileLabel: "Status",
      cell: (item) => (
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
          {item.registrationStatus}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (item) => (
        <Link
          href={`/hackathons/${item.hackathonId}`}
          className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1"
        >
          <span>View Hub</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Student Welcome Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                {profile.name}
              </h1>
              <VerificationBadge status={profile.verificationStatus} source="KSHEC Verified USN" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {profile.degreeBranch} • <strong className="text-neutral-700 dark:text-neutral-300">{profile.collegeName}</strong> ({profile.district})
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mt-1">
              <span>USN: {profile.usnOrRollNo}</span>
              <span>• Graduating {profile.graduationYear}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/search"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Explore Karnataka Hackathons
          </Link>
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-50 transition-colors"
          >
            + Invite Teammate
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-semibold scrollbar-none">
        {[
          { id: "overview", label: "Dashboard Overview" },
          { id: "registrations", label: `Registrations (${registrations.length})` },
          { id: "teams", label: `Teams & Invites (${teams.length})` },
          { id: "submissions", label: "Project Submissions" },
          { id: "profile", label: "Student Skills & Bio" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-xl transition-all shrink-0",
              activeTab === tab.id
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW (Prioritizing Upcoming registered hackathons, Team activity, Deadlines, Recommended hackathons, Notifications, Nearby opportunities) */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Top Priority Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Active Registrations"
              value={registrations.length}
              subtitle="Confirmed for state events"
              icon={<Ticket className="w-5 h-5 text-brand-600" />}
            />
            <DashboardCard
              title="Teams Active"
              value={teams.length}
              subtitle="Kaveri Coders (Lead)"
              icon={<Users className="w-5 h-5 text-purple-600" />}
            />
            <DashboardCard
              title="Upcoming Deadline"
              value="4 Days"
              subtitle="RVCE 8th Mile Code Freeze"
              icon={<Clock className="w-5 h-5 text-amber-600" />}
            />
            <DashboardCard
              title="Recommendations"
              value={recommendedHackathons.length}
              subtitle="Matching Python & AI skills"
              icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Upcoming registered hackathons & Team Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Registered Hackathons Section */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-600" />
                    <span>Your Confirmed Hackathons</span>
                  </h2>
                  <span className="text-xs text-brand-600 font-semibold">{registrations.length} Events</span>
                </div>

                <div className="space-y-3">
                  {registrations.map((reg) => (
                    <div
                      key={reg.registrationId}
                      className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                            {reg.registrationStatus}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            Ticket #{reg.ticketNumber}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                          {reg.hackathonTitle}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {reg.eventDate} • Team: <strong className="text-neutral-700 dark:text-neutral-300">{reg.teamName}</strong> ({reg.userRole})
                        </p>
                      </div>

                      <Link
                        href={`/hackathons/${reg.hackathonId}`}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shrink-0 text-center"
                      >
                        Enter Event Hub
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Activity */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Team Roster &amp; Collaboration</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(true)}
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite Teammate</span>
                  </button>
                </div>

                {teams.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{t.name}</h4>
                        <div className="text-xs text-neutral-500">{t.hackathonTitle}</div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        Invite Code: {t.inviteCode}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {t.members.map((m) => (
                        <div key={m.id} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-xs space-y-1">
                          <div className="font-bold text-neutral-900 dark:text-white truncate">{m.name}</div>
                          <div className="text-neutral-500 truncate text-[11px]">{m.college}</div>
                          <span className="inline-block text-[10px] font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 px-1.5 py-0.2 rounded">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Hackathons based on skills */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Recommended For You in Karnataka</span>
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Curated based on your interests in {profile.skills.slice(0, 3).join(", ")}.
                    </p>
                  </div>
                  <Link href="/search" className="text-xs font-bold text-brand-600 hover:underline">
                    View More &rarr;
                  </Link>
                </div>

                <div className="space-y-3">
                  {recommendedHackathons.map((h) => (
                    <div
                      key={h.id}
                      className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={h.status} size="sm" />
                          <span className="text-xs text-neutral-400 font-medium">{h.location.district}</span>
                        </div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white mt-1">
                          {h.title}
                        </h4>
                      </div>
                      <Link
                        href={`/hackathons/${h.slug}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 text-neutral-800 dark:text-neutral-200 shrink-0"
                      >
                        Explore
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Notifications, Deadlines & Nearby Opportunities */}
            <div className="space-y-8">
              {/* Notifications & System Announcements */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>Notifications</span>
                  </h2>
                  <span className="text-xs text-neutral-400">{notifications.length} alerts</span>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 shrink-0">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Opportunities in Bengaluru / Mysuru */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Nearby Opportunities ({profile.district})</span>
                </h2>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">PhonePe High-Throughput Challenge</span>
                    <span className="text-neutral-500">Internship Track for Bengaluru Hackathon Winners</span>
                  </div>
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Thoughtworks Diverse Minds Grant</span>
                    <span className="text-neutral-500">Mentorship cohort for undergraduate teams</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: REGISTRATIONS */}
      {activeTab === "registrations" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Confirmed Event Registrations
            </h2>
            <Link
              href="/search"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-brand-600 text-white"
            >
              + Find More Hackathons
            </Link>
          </div>
          <DataTable
            columns={registrationColumns}
            data={registrations}
            keyExtractor={(item) => item.registrationId}
          />
        </div>
      )}

      {/* TAB: TEAMS */}
      {activeTab === "teams" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Hackathon Teams &amp; Invitations
            </h2>
            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-brand-600 text-white"
            >
              + Invite Teammate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((t) => (
              <div key={t.id} className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {t.status}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Code: {t.inviteCode}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{t.name}</h3>
                <p className="text-xs text-neutral-500">{t.description}</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-neutral-400">Team Roster</h4>
                  {t.members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60">
                      <div>
                        <div className="font-bold">{m.name}</div>
                        <div className="text-neutral-500 text-[11px]">{m.college}</div>
                      </div>
                      <span className="text-brand-600 font-semibold">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Hackathon Project Submissions &amp; Results
          </h2>
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded">
                UNDER REVIEW
              </span>
              <span className="text-xs text-neutral-400">Submitted Sep 29, 2026</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">KaranMatch-Engine-v1</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Ultra-low latency C++20 lock-free ring buffer trading order engine for PES HashCode 2026.
            </p>
            <div className="flex gap-4 pt-2 text-xs font-semibold text-brand-600">
              <a href="https://demo.karanmatch.dev" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROFILE & SKILLS */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Verified Student Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block">Full Name</span>
              <strong className="text-sm text-neutral-900 dark:text-white">{profile.name}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block">College USN / Roll No</span>
              <strong className="text-sm text-neutral-900 dark:text-white">{profile.usnOrRollNo}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block">Institution</span>
              <strong className="text-sm text-neutral-900 dark:text-white">{profile.collegeName}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block">District</span>
              <strong className="text-sm text-neutral-900 dark:text-white">{profile.district}</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Skills &amp; Technologies</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.technologies.map((t) => (
                <span key={t} className="px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal Dialog */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Invite Student Teammate
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Send an invite to any engineering student across Karnataka via their college email or USN.
            </p>

            {inviteSuccess ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Invitation dispatched successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Student College Email or USN
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="friend@college.edu.in"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    Send Team Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
