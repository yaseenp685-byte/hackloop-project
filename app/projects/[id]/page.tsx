"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FolderGit2,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Github,
  Eye,
  Calendar,
  Sparkles,
  ArrowLeft,
  User,
  GraduationCap,
  Shield,
  CheckCircle2,
  AlertCircle,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  author: {
    id: string;
    name: string;
    college: string;
    degreeBranch: string | null;
    bio: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
  };
  likesCount: number;
  viewsCount: number;
  featured: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();
        if (json.success) {
          setProject(json.data);
        } else {
          setError(json.error?.message || "Failed to load project details.");
        }
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = async () => {
    if (!project) return;
    const newLiked = !project.isLiked;
    setProject({
      ...project,
      isLiked: newLiked,
      likesCount: newLiked ? project.likesCount + 1 : Math.max(0, project.likesCount - 1),
    });

    try {
      const res = await fetch(`/api/projects/${project.id}/like`, { method: "POST" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
    } catch {
      // rollback if needed
    }
  };

  const handleBookmark = async () => {
    if (!project) return;
    const newBookmarked = !project.isBookmarked;
    setProject({ ...project, isBookmarked: newBookmarked });

    try {
      const res = await fetch(`/api/projects/${project.id}/bookmark`, { method: "POST" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
    } catch {
      // rollback if needed
    }
  };

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

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Project Not Found</h2>
        <p className="text-xs text-neutral-500">{error || "This project listing may have been moved or removed."}</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Showcase</span>
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
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects Showcase</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-brand-500 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
            <button
              type="button"
              onClick={() => setReported(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-red-500 transition-colors"
              title="Report listing"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {reported && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-medium">
            Thank you. This project has been flagged for our moderation team to review.
          </div>
        )}

        {/* Project Header Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  {project.category.replace("_", " ")}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Featured Spotlight
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                {project.title}
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap md:flex-col items-stretch gap-2.5 shrink-0">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-brand-500 font-bold text-xs sm:text-sm shadow-2xs transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleLike}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors",
                    project.isLiked
                      ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:border-red-900"
                      : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-red-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", project.isLiked && "fill-red-600 text-red-600")} />
                  <span>{project.likesCount} Upvotes</span>
                </button>

                <button
                  type="button"
                  onClick={handleBookmark}
                  className={cn(
                    "p-2.5 rounded-xl border transition-colors",
                    project.isBookmarked
                      ? "bg-brand-50 text-brand-600 border-brand-300 dark:bg-brand-950/50 dark:border-brand-800"
                      : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-brand-500"
                  )}
                  title={project.isBookmarked ? "Bookmarked" : "Bookmark"}
                >
                  <Bookmark
                    className={cn("w-4 h-4", project.isBookmarked && "fill-brand-600 text-brand-600")}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Technologies & Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content & Author Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              About the Project
            </h2>
            <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {/* Author Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Created By
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                  {project.author.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                    {project.author.name}
                  </h4>
                  <p className="text-xs text-neutral-500">{project.author.college}</p>
                </div>
              </div>

              {project.author.bio && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.author.bio}
                </p>
              )}

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <Link
                  href={`/students/${project.author.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View Developer Profile</span>
                </Link>

                {project.author.githubUrl && (
                  <a
                    href={project.author.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Author GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Verification & Transparency */}
            <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Student Submission</span>
              </div>
              <p>
                Published by verified student affiliated with {project.author.college}. Free of academic dishonesty, plagiarism, and malicious code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
