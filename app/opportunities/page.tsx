"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Tag,
  Filter,
} from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import { cn } from "@/lib/utils";

interface OpportunityItem {
  id: string;
  title: string;
  type: string;
  location: string;
  technologies: string[];
  link: string | null;
  deadline: string | null;
  isExpired: boolean;
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    industry: string;
    district: string;
    verificationStatus: string;
  };
  createdAt: string;
}

const TYPE_OPTIONS = [
  { key: "ALL", label: "All Opportunities" },
  { key: "INTERNSHIP", label: "Internships" },
  { key: "GRANT", label: "Fellowships & Grants" },
  { key: "CHALLENGE", label: "Coding Challenges" },
  { key: "FULL_TIME", label: "Graduate Roles" },
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (type !== "ALL") params.set("type", type);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data);
      } else {
        setError(json.error?.message || "Failed to load opportunities.");
      }
    } catch {
      setError("Unable to connect to the opportunities registry.");
    } finally {
      setLoading(false);
    }
  }, [search, type]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Career & Research Pathways</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                Verified Student Opportunities
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                Direct applications to software engineering internships, open-source fellowships, government tech residencies, and corporate hackathon hiring tracks across Karnataka tech clusters.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/companies"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-brand-500 font-bold text-xs sm:text-sm shadow-2xs transition-all"
              >
                <Building className="w-4 h-4" />
                <span>Partner Companies Directory</span>
              </Link>
            </div>
          </div>

          {/* Search Bar & Type Chips */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities by role title, technologies, or company..."
                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setType(t.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs",
                    type === t.key
                      ? "bg-brand-600 text-white"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-brand-500 hover:text-brand-600"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center text-red-700 dark:text-red-300">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchOpportunities}
              className="mt-3 px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No Opportunities Found
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                No listings matched your criteria. New corporate hackathon fellowships and openings are published weekly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2.5 flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                      {item.type.replace("_", " ")}
                    </span>

                    <VerificationBadge status={item.company.verificationStatus as any} source="KDEM / VTU" />

                    {item.isExpired && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-0.5">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {item.company.name}
                      </span>
                      <span>•</span>
                      <span>{item.company.industry}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Technologies Tags */}
                  {item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deadlines & Apply Link */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                  {item.deadline && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Deadline:{" "}
                        {new Date(item.deadline).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-400 italic">Check company portal</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
