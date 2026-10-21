"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  UserPlus,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Calendar,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamItem {
  id: string;
  name: string;
  description: string | null;
  projectIdea: string | null;
  requiredRoles: string[];
  isOpenForMembers: boolean;
  maxMembers: number;
  currentMembersCount: number;
  hackathon: {
    id: string;
    title: string;
    slug: string;
    district: string;
    format: string;
    startDate: string;
    endDate: string;
  };
  leader: {
    id: string;
    name: string;
    college: string;
  } | null;
  members: {
    id: string;
    name: string;
    role: string;
    college: string;
  }[];
  isLeader: boolean;
  isMember: boolean;
  myRequestStatus: string | null;
  createdAt: string;
}

const ROLE_OPTIONS = [
  "ALL",
  "Frontend",
  "Backend",
  "Fullstack",
  "AI/ML",
  "UI/UX",
  "Mobile",
  "DevOps",
];

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  // Join Request Modal State
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);
  const [requestRole, setRequestRole] = useState("Frontend");
  const [requestMessage, setRequestMessage] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedRole !== "ALL") params.set("role", selectedRole);

      const res = await fetch(`/api/teams/recruit?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setTeams(json.data);
      } else {
        setError(json.error?.message || "Failed to load recruiting teams.");
      }
    } catch {
      setError("Unable to connect to the recruitment service.");
    } finally {
      setLoading(false);
    }
  }, [search, selectedRole]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeams();
  };

  const handleOpenJoinModal = (team: TeamItem) => {
    setSelectedTeam(team);
    setRequestRole(team.requiredRoles[0] || "Frontend");
    setRequestMessage("");
    setRequestSuccess(null);
    setRequestError(null);
  };

  const handleSubmitJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    setSubmittingRequest(true);
    setRequestError(null);
    setRequestSuccess(null);

    try {
      const res = await fetch("/api/teams/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedTeam.id,
          role: requestRole,
          message: requestMessage.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (json.success) {
        setRequestSuccess("Your join request has been sent to the team leader!");
        setTimeout(() => {
          setSelectedTeam(null);
          fetchTeams();
        }, 1500);
      } else {
        setRequestError(json.error?.message || "Failed to submit join request.");
      }
    } catch {
      setRequestError("Network error. Please try again.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Teammate Matchmaking</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                Find a Hackathon Team
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                Connect with passionate student developers, UI/UX designers, and AI engineers across Karnataka institutions looking for team members to compete in upcoming hackathons.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/dashboard/student?tab=teams"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Manage My Teams</span>
              </Link>
              <Link
                href="/search?category=HACKATHONS"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-brand-500 font-bold text-xs sm:text-sm shadow-2xs transition-all"
              >
                <span>Browse Hackathons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Search & Role Filters */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams by project idea, stack, or hackathon..."
                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Role Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Roles:
              </span>
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs",
                    selectedRole === role
                      ? "bg-brand-600 text-white"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-brand-500 hover:text-brand-600"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center text-red-700 dark:text-red-300">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchTeams}
              className="mt-3 px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center space-y-4">
            <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No Teams Currently Recruiting
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                No teams match your current search criteria. Try changing the role filter or create your own team for an upcoming hackathon!
              </p>
            </div>
            <Link
              href="/search?category=HACKATHONS"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              <span>Explore Hackathons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const isFull = team.currentMembersCount >= team.maxMembers;
              const hasRequested = !!team.myRequestStatus;

              return (
                <div
                  key={team.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Team Name & Slots Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white leading-tight">
                          {team.name}
                        </h3>
                        {team.leader && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Led by <span className="font-medium text-neutral-700 dark:text-neutral-300">{team.leader.name}</span> ({team.leader.college})
                          </p>
                        )}
                      </div>

                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold shrink-0",
                          isFull
                            ? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                            : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        )}
                      >
                        {team.currentMembersCount}/{team.maxMembers} Members
                      </span>
                    </div>

                    {/* Hackathon Affiliation */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                        <Link
                          href={`/hackathons/${team.hackathon.slug}`}
                          className="hover:underline line-clamp-1"
                        >
                          {team.hackathon.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {team.hackathon.district}
                        </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {team.hackathon.format}
                        </span>
                      </div>
                    </div>

                    {/* Project Idea Pitch */}
                    {team.projectIdea && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                          Project Focus
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
                          {team.projectIdea}
                        </p>
                      </div>
                    )}

                    {/* Looking For Roles */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Open Positions Needed
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {team.requiredRoles.length > 0 ? (
                          team.requiredRoles.map((role) => (
                            <span
                              key={role}
                              className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900"
                            >
                              +{role}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-500 italic">Open to all contributors</span>
                        )}
                      </div>
                    </div>

                    {/* Existing Members Roster */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Current Roster
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                        {team.members.map((m, idx) => (
                          <span
                            key={m.id}
                            className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-[11px]"
                          >
                            <span className="font-medium">{m.name}</span>
                            {m.role === "LEADER" && (
                              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                                (Lead)
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                    {team.isLeader ? (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>You lead this team</span>
                      </span>
                    ) : team.isMember ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>You are in this team</span>
                      </span>
                    ) : team.myRequestStatus === "PENDING" ? (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Request Pending</span>
                      </span>
                    ) : team.myRequestStatus === "ACCEPTED" ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Request Accepted!</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenJoinModal(team)}
                        disabled={isFull}
                        className={cn(
                          "w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5",
                          isFull
                            ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed"
                            : "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20"
                        )}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isFull ? "Team Full" : "Request to Join Team"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedTeam(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  Join Request
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  Join {selectedTeam.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Hackathon: {selectedTeam.hackathon.title}
                </p>
              </div>

              {requestSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{requestSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitJoinRequest} className="space-y-4 pt-2">
                  {requestError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                      {requestError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Your Primary Role
                    </label>
                    <select
                      value={requestRole}
                      onChange={(e) => setRequestRole(e.target.value)}
                      className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    >
                      {ROLE_OPTIONS.filter((r) => r !== "ALL").map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Short Pitch / Message to Leader (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Mention your relevant skills, prior hackathon projects, or what you'd like to build together..."
                      className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTeam(null)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingRequest ? "Sending..." : "Submit Join Request"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
