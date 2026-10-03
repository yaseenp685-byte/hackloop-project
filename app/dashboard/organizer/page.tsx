"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ApiService } from "@/services/apiService";
import { OrganizerProfile, ParticipantRecord, OrganizerTeamRecord, OrganizerAnnouncement, CreateHackathonInput } from "@/types/organizer";
import { Hackathon } from "@/types/hackathon";
import { DashboardCard } from "@/components/DashboardCard";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Award,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Send,
  Building,
  FileCheck,
  Megaphone,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrganizerDashboardPage() {
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [participants, setParticipants] = useState<ParticipantRecord[]>([]);
  const [teams, setTeams] = useState<OrganizerTeamRecord[]>([]);
  const [announcements, setAnnouncements] = useState<OrganizerAnnouncement[]>([]);

  const [activeTab, setActiveTab] = useState<"overview" | "hackathons" | "create" | "participants" | "judging" | "announcements">("overview");

  // Create Hackathon Form State
  const [createForm, setCreateForm] = useState<CreateHackathonInput>({
    title: "",
    tagline: "",
    format: "HYBRID",
    district: "Bengaluru Urban",
    description: "",
    theme: ["Generative AI", "Agritech"],
    technologies: ["Python", "Next.js"],
    eligibility: "Bonafide students of Karnataka colleges",
    minTeamSize: 2,
    maxTeamSize: 4,
    registrationDeadline: "2026-11-15T23:59:59Z",
    startDate: "2026-11-25T09:00:00Z",
    endDate: "2026-11-27T18:00:00Z",
    rules: ["Original code developed during event."],
    problemStatements: [],
    prizes: [{ place: "1st Place", amount: "₹1,50,000" }],
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  // New Announcement Form State
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementPriority, setAnnouncementPriority] = useState<"NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [announcementSent, setAnnouncementSent] = useState(false);

  useEffect(() => {
    ApiService.getOrganizerDashboardData().then((data) => {
      setProfile(data.profile);
      setHackathons(data.hackathons);
      setParticipants(data.participants);
      setTeams(data.teams);
      setAnnouncements(data.announcements);
    });
  }, []);

  const handleCreateHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSuccess(true);
    setTimeout(() => {
      setActiveTab("hackathons");
      setCreateSuccess(false);
    }, 1200);
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementContent) return;

    const newAnn: OrganizerAnnouncement = {
      id: `ann-${Date.now()}`,
      hackathonId: "hack-rvce-2026",
      hackathonTitle: "RVCE 8th Mile National Tech Hackathon",
      title: announcementTitle,
      content: announcementContent,
      priority: announcementPriority,
      publishedAt: new Date().toISOString(),
      sentToEmail: true,
    };

    setAnnouncements([newAnn, ...announcements]);
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setAnnouncementSent(false);
    }, 1500);
  };

  // Participant DataTable columns
  const participantColumns: Column<ParticipantRecord>[] = [
    {
      header: "Participant Name",
      mobileLabel: "Name",
      cell: (p) => (
        <div>
          <span className="font-bold text-neutral-900 dark:text-white block">{p.name}</span>
          <span className="text-xs text-neutral-500">{p.email}</span>
        </div>
      ),
    },
    {
      header: "College & District",
      mobileLabel: "College",
      cell: (p) => (
        <span className="text-xs text-neutral-700 dark:text-neutral-300">
          {p.college} ({p.district})
        </span>
      ),
    },
    {
      header: "Assigned Team",
      mobileLabel: "Team",
      cell: (p) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
          {p.teamName || "Unassigned"}
        </span>
      ),
    },
    {
      header: "Check-in Status",
      mobileLabel: "Status",
      cell: (p) => (
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            p.status === "CONFIRMED"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
          )}
        >
          {p.status}
        </span>
      ),
    },
  ];

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Loading organizer management console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                {profile.name}
              </h1>
              <VerificationBadge status={profile.verificationStatus} source="KSHEC Faculty Registry" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {profile.designation} • <strong className="text-neutral-700 dark:text-neutral-300">{profile.organizationName}</strong> ({profile.district})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("create")}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Hackathon</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-semibold scrollbar-none">
        {[
          { id: "overview", label: "Organizer Overview" },
          { id: "hackathons", label: `Manage Hackathons (${hackathons.length})` },
          { id: "create", label: "+ Create Hackathon" },
          { id: "participants", label: `Participants (${participants.length})` },
          { id: "judging", label: `Judging & Scoring (${teams.length} Teams)` },
          { id: "announcements", label: `Announcements (${announcements.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-xl transition-all shrink-0",
              activeTab === tab.id
                ? "bg-amber-600 text-white shadow-xs font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Active Hackathons"
              value={hackathons.length}
              subtitle="Published in Karnataka portal"
              icon={<Award className="w-5 h-5 text-amber-600" />}
            />
            <DashboardCard
              title="Total Registrations"
              value="890"
              subtitle="+142 this week"
              trend={{ value: "+19%", isPositive: true }}
              icon={<Users className="w-5 h-5 text-brand-600" />}
            />
            <DashboardCard
              title="Formed Teams"
              value="182"
              subtitle="Average team size: 3.8"
              icon={<Layers className="w-5 h-5 text-purple-600" />}
            />
            <DashboardCard
              title="Pending Actions"
              value="3"
              subtitle="Submissions awaiting evaluation"
              icon={<Clock className="w-5 h-5 text-red-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Events & Active Listings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <span>Your Active Hackathon Listings</span>
                  </h2>
                  <span className="text-xs text-neutral-400">{hackathons.length} Active</span>
                </div>

                <div className="space-y-4">
                  {hackathons.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={h.status} size="sm" />
                          <VerificationBadge status={h.verificationStatus} source={h.source} />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1.5">
                          {h.title}
                        </h3>
                        <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                          <span>{h.location.district}</span>
                          <span>• {h.registrationCount} Registered</span>
                          <span>• Deadline: {formatDate(h.registrationDeadline)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/hackathons/${h.slug}`}
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 text-neutral-800 dark:text-neutral-200"
                        >
                          Public Page
                        </Link>
                        <button
                          type="button"
                          onClick={() => setActiveTab("participants")}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements stream */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-blue-600" />
                    <span>Recent Broadcast Announcements</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("announcements")}
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    + New Broadcast
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white">{ann.title}</span>
                        <span className="text-[10px] text-neutral-400">{formatRelativeTime(ann.publishedAt)}</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Deadlines & Live Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Upcoming Deadlines</span>
                </h2>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">Registration Closure</span>
                    <span className="text-neutral-500">RVCE 8th Mile closes in 4 days (Oct 04)</span>
                  </div>
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="font-bold text-neutral-900 dark:text-neutral-200 block">Jury Score Consolidation</span>
                    <span className="text-neutral-500">Phase 1 shortlisted teams review</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">Quick Actions</h2>
                <div className="space-y-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("create")}
                    className="w-full text-left p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between"
                  >
                    <span>+ Publish Challenge Statement</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("judging")}
                    className="w-full text-left p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between"
                  >
                    <span>Score Project Submissions</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CREATE HACKATHON */}
      {activeTab === "create" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Publish New Karnataka Hackathon
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Listings will automatically be routed to the KSHEC portal index and district discovery engine.
            </p>
          </div>

          {createSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Hackathon submitted! Listed as PENDING administrative state verification.</span>
            </div>
          ) : (
            <form onSubmit={handleCreateHackathon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hackathon Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mysuru CleanTech Code Marathon 2026"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 36-hour sprint for sustainable waste & energy intelligence"
                  value={createForm.tagline}
                  onChange={(e) => setCreateForm({ ...createForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Format</label>
                  <select
                    value={createForm.format}
                    onChange={(e) => setCreateForm({ ...createForm, format: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="HYBRID">Hybrid (Online &amp; On-Campus)</option>
                    <option value="OFFLINE">Offline (In-Person)</option>
                    <option value="ONLINE">Online Virtual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Karnataka District</label>
                  <select
                    value={createForm.district}
                    onChange={(e) => setCreateForm({ ...createForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    {KARNATAKA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description &amp; Objective</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline challenge goals, rules, and student background requirements..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                Submit Hackathon for Verification &amp; Publishing
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB: PARTICIPANTS */}
      {activeTab === "participants" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Participant Registry &amp; Check-ins
              </h2>
              <p className="text-xs text-neutral-500">
                Manage registered college students, waitlist status, and physical venue badge printing.
              </p>
            </div>
          </div>
          <DataTable
            columns={participantColumns}
            data={participants}
            keyExtractor={(p) => p.id}
          />
        </div>
      )}

      {/* TAB: JUDGING */}
      {activeTab === "judging" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-600" />
            <span>Project Submissions &amp; Jury Evaluation</span>
          </h2>

          <div className="space-y-4">
            {teams.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      {t.submissionStatus}
                    </span>
                    {t.score && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Score: {t.score}/100
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-neutral-900 dark:text-white mt-1">
                    {t.teamName}
                  </h4>
                  <div className="text-xs text-neutral-500">
                    Leader: {t.leaderName} ({t.leaderEmail}) • Problem: {t.problemStatement}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={t.score || 85}
                    min={0}
                    max={100}
                    className="w-16 px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-bold text-center"
                  />
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90"
                  >
                    Save Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" />
            <span>Broadcast Announcement to Participants</span>
          </h2>

          {announcementSent ? (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Announcement dispatched to student inboxes &amp; live stream!</span>
            </div>
          ) : (
            <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WiFi Passwords & Lunch Timing Update"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Broadcast Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type message text..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
              >
                Send Announcement to All Teams
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
