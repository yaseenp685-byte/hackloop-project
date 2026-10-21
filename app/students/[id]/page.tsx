"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  User,
  GraduationCap,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Share2,
  Award,
  FolderGit2,
  Heart,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Tag,
  Ticket,
} from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import { cn } from "@/lib/utils";

interface StudentData {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  usnOrRollNo: string;
  collegeName: string;
  universityName: string;
  district: string;
  graduationYear: number;
  degreeBranch: string;
  skills: string[];
  technologies: string[];
  interests: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  verificationStatus: string;
  projects: {
    id: string;
    title: string;
    tagline: string;
    category: string;
    technologies: string[];
    likesCount: number;
    repoUrl: string | null;
    demoUrl: string | null;
  }[];
  hackathons: {
    id: string;
    title: string;
    slug: string;
    startDate: string;
    mode: string;
    district: string;
    role: string;
    registrationStatus: string;
    ticketNumber: string;
  }[];
}

export default function StudentProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "hackathons">("projects");

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/students/${id}`);
        const json = await res.json();
        if (json.success) {
          setStudent(json.data);
        } else {
          setError(json.error?.message || "Failed to load student profile.");
        }
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Profile Not Found</h2>
        <p className="text-xs text-neutral-500">{error || "Could not find a student record for this identifier."}</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-brand-500 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Profile Link Copied!" : "Share Profile"}</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar Icon */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center shadow-md">
                {student.name.charAt(0)}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                    {student.name}
                  </h1>
                  <VerificationBadge status={student.verificationStatus as any} source="VTU / KSHEC" />
                </div>

                <p className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {student.degreeBranch} • Class of {student.graduationYear}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    {student.collegeName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {student.district}
                  </span>
                  {student.usnOrRollNo && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-400">
                        USN: {student.usnOrRollNo}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="flex items-center gap-2">
              {student.githubUrl && (
                <a
                  href={student.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:text-brand-600 transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {student.linkedinUrl && (
                <a
                  href={student.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:text-blue-600 transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {student.portfolioUrl && (
                <a
                  href={student.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:text-emerald-600 transition-colors"
                  title="Portfolio Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          {student.bio && (
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                About
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {student.bio}
              </p>
            </div>
          )}

          {/* Skills & Technologies */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.skills.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Key Skills & Domains
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {student.technologies.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Technical Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {student.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Portfolio Navigation: Projects vs Hackathons */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={cn(
                "flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all -mb-3.5",
                activeTab === "projects"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Showcase Projects ({student.projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("hackathons")}
              className={cn(
                "flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all -mb-3.5",
                activeTab === "hackathons"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Award className="w-4 h-4" />
              <span>Hackathon Participations ({student.hackathons.length})</span>
            </button>
          </div>

          {/* Tab 1: Projects Showcase */}
          {activeTab === "projects" && (
            <div>
              {student.projects.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-500">
                  No public projects published yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {student.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-brand-500 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {proj.category.replace("_", " ")}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                            <Heart className="w-3 h-3 fill-red-500" />
                            {proj.likesCount}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                          <Link href={`/projects/${proj.id}`} className="hover:text-brand-600">
                            {proj.title}
                          </Link>
                        </h4>

                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {proj.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <Link
                          href={`/projects/${proj.id}`}
                          className="text-xs font-bold text-brand-600 hover:underline"
                        >
                          View Project &rarr;
                        </Link>

                        <div className="flex items-center gap-2">
                          {proj.repoUrl && (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Hackathons */}
          {activeTab === "hackathons" && (
            <div>
              {student.hackathons.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-500">
                  No hackathons registered yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {student.hackathons.map((hack) => (
                    <div
                      key={hack.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            {hack.mode}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {new Date(hack.startDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                          <Link href={`/hackathons/${hack.slug}`} className="hover:text-brand-600">
                            {hack.title}
                          </Link>
                        </h4>

                        <p className="text-xs text-neutral-500">
                          {hack.district} • Role: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{hack.role}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          <Ticket className="w-3 h-3 inline mr-1 text-brand-600" />
                          {hack.ticketNumber}
                        </span>

                        <Link
                          href={`/hackathons/${hack.slug}`}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-colors"
                        >
                          Event Page
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
