"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderGit2,
  Search,
  Plus,
  Heart,
  ExternalLink,
  Github,
  Eye,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  Code2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectItem {
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
    githubUrl: string | null;
  };
  likesCount: number;
  viewsCount: number;
  featured: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { key: "ALL", label: "All Categories" },
  { key: "WEB_APP", label: "Web Apps" },
  { key: "AI_ML", label: "AI & Machine Learning" },
  { key: "MOBILE", label: "Mobile Apps" },
  { key: "IOT", label: "IoT & Hardware" },
  { key: "OPEN_SOURCE", label: "Open Source" },
  { key: "CYBERSECURITY", label: "Cybersecurity" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState<"recent" | "likes" | "views">("recent");

  // Submit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("WEB_APP");
  const [formTechInput, setFormTechInput] = useState("");
  const [formRepoUrl, setFormRepoUrl] = useState("");
  const [formDemoUrl, setFormDemoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "ALL") params.set("category", category);
      params.set("sort", sort);

      const res = await fetch(`/api/projects?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
      } else {
        setError(json.error?.message || "Failed to load projects.");
      }
    } catch {
      setError("Unable to connect to the projects service.");
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleLikeToggle = async (projectId: string) => {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likesCount: newLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json.success) {
        // Rollback if failure
        fetchProjects();
      }
    } catch {
      fetchProjects();
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const techArray = formTechInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (techArray.length === 0) {
      setFormError("Please enter at least one technology (comma separated).");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          tagline: formTagline,
          description: formDescription,
          category: formCategory,
          technologies: techArray,
          repoUrl: formRepoUrl.trim() || undefined,
          demoUrl: formDemoUrl.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (json.success) {
        setFormSuccess("Project published successfully to the showcase!");
        setTimeout(() => {
          setModalOpen(false);
          // reset form
          setFormTitle("");
          setFormTagline("");
          setFormDescription("");
          setFormTechInput("");
          setFormRepoUrl("");
          setFormDemoUrl("");
          fetchProjects();
        }, 1200);
      } else {
        setFormError(json.error?.message || "Failed to submit project.");
      }
    } catch {
      setFormError("Failed to reach server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Innovations Showcase</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                Karnataka Student Project Gallery
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                Discover groundbreaking open-source tools, hackathon winners, AI agents, and civic tech applications engineered by university students across Karnataka.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Project</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Sorting */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by name, technologies, or keywords..."
                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-brand-500"
              >
                <option value="recent">Recently Added</option>
                <option value="likes">Most Upvoted</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs",
                  category === cat.key
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-brand-500 hover:text-brand-600"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center text-red-700 dark:text-red-300">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-3 px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center space-y-4">
            <FolderGit2 className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No Projects Found
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                No projects matched your criteria. Be the first to showcase your work in this category!
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Featured Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 uppercase tracking-wide">
                      {project.category.replace("_", " ")}
                    </span>

                    {project.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      <Link href={`/projects/${project.id}`}>{project.title}</Link>
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Author Meta */}
                  <div className="text-xs text-neutral-500 pt-1">
                    By{" "}
                    <Link
                      href={`/students/${project.author.id}`}
                      className="font-semibold text-neutral-800 dark:text-neutral-200 hover:text-brand-600 hover:underline"
                    >
                      {project.author.name}
                    </Link>{" "}
                    • <span className="truncate">{project.author.college}</span>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] text-neutral-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Links, Likes, Details */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Interactive Like Button */}
                    <button
                      type="button"
                      onClick={() => handleLikeToggle(project.id)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors",
                        project.isLiked
                          ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-red-600"
                      )}
                    >
                      <Heart
                        className={cn("w-3.5 h-3.5", project.isLiked && "fill-red-600 text-red-600")}
                      />
                      <span>{project.likesCount}</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs text-neutral-400 px-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{project.viewsCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        title="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.id}`}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  Student Showcase
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  Publish Your Project
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Share your hackathon build, prototype, or open-source tool with Karnataka developers and recruiters.
                </p>
              </div>

              {formSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitProject} className="space-y-4 pt-2">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., NammaTraffic AI"
                      className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      One-line Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="A short punchy sentence explaining what it does"
                      className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      >
                        {CATEGORIES.filter((c) => c.key !== "ALL").map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Technologies * (comma-separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={formTechInput}
                        onChange={(e) => setFormTechInput(e.target.value)}
                        placeholder="React, Next.js, Python, PyTorch"
                        className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Explain the problem solved, architecture, and key features..."
                      className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={formRepoUrl}
                        onChange={(e) => setFormRepoUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={formDemoUrl}
                        onChange={(e) => setFormDemoUrl(e.target.value)}
                        placeholder="https://mydemo.app"
                        className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{submitting ? "Publishing..." : "Publish to Showcase"}</span>
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
