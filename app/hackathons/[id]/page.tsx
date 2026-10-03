"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ApiService } from "@/services/apiService";
import { Hackathon } from "@/types/hackathon";
import { StatusBadge } from "@/components/StatusBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatDate, formatDateTime, formatRelativeTime } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Bookmark,
  Share2,
  Clock,
  ShieldCheck,
  FileText,
  Building,
  GraduationCap,
  ExternalLink,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Check,
} from "lucide-react";

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.id as string;

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    ApiService.getHackathonBySlug(slug).then((res) => {
      if (res.success && res.data) {
        setHackathon(res.data);
      }
      setIsLoading(false);
    });
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Retrieving hackathon record from Karnataka index...</p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Hackathon Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2">
          The requested hackathon listing could not be located in the current database.
        </p>
        <Link
          href="/search"
          className="mt-6 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm"
        >
          Return to Search
        </Link>
      </div>
    );
  }

  const isRegistrationAvailable =
    hackathon.status === "Registration Open" || hackathon.status === "Registration Closing Soon";

  return (
    <div className="w-full pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-brand-600"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-brand-600 text-brand-600" : ""}`} />
              <span>{isBookmarked ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
            >
              {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{shareCopied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hackathon Header Hero */}
      <header className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto">
          {/* Status & Verification Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <StatusBadge status={hackathon.status} size="md" />
            <VerificationBadge status={hackathon.verificationStatus} source={hackathon.source} />
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
              {hackathon.format}
            </span>
            <span className="text-xs font-mono text-neutral-400 ml-auto">
              Last verified: {formatRelativeTime(hackathon.lastUpdated)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {hackathon.title}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-neutral-300 max-w-3xl">
            {hackathon.tagline}
          </p>

          {/* Organizer Attribution */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 border-t border-neutral-800 pt-5">
            <div>
              <span className="text-neutral-400">Organized by: </span>
              <strong className="text-white">{hackathon.organizer.name}</strong>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Entity Registry</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Layout: 2 Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Details, Problem Statements, Schedule, Rules */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
              About the Hackathon
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {hackathon.description}
            </p>

            {/* Themes */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Themes &amp; Tracks
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {hackathon.theme.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Technologies &amp; Tools Recommended
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {hackathon.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Problem Statements */}
          {hackathon.problemStatements.length > 0 && (
            <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <span>Problem Statements &amp; Challenges</span>
                </h2>
                <span className="text-xs text-neutral-400 font-medium">
                  {hackathon.problemStatements.length} Active Challenges
                </span>
              </div>

              <div className="space-y-4">
                {hackathon.problemStatements.map((ps) => (
                  <div
                    key={ps.id}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                          {ps.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1">
                          {ps.title}
                        </h3>
                      </div>
                      {ps.trackPrize && (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md shrink-0">
                          {ps.trackPrize}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {ps.description}
                    </p>
                    {ps.sponsorOrCompany && (
                      <div className="text-[11px] text-neutral-500 font-medium">
                        Sponsored Partner: <strong className="text-neutral-700 dark:text-neutral-200">{ps.sponsorOrCompany}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prizes Section */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Prizes &amp; Rewards</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hackathon.prizes.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20"
                >
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    {p.place}
                  </div>
                  <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                    {p.amount}
                  </div>
                  {p.perks && p.perks.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                      {p.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Schedule Timeline */}
          {hackathon.schedule.length > 0 && (
            <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>Event Timeline &amp; Schedule</span>
              </h2>

              <div className="space-y-4 relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 pl-5">
                {hackathon.schedule.map((item) => (
                  <div key={item.id} className="relative">
                    <span
                      className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 ${
                        item.isCompleted
                          ? "bg-emerald-500 border-emerald-500"
                          : item.isCurrent
                          ? "bg-brand-600 border-white ring-4 ring-brand-100"
                          : "bg-neutral-300 border-neutral-300"
                      }`}
                    />
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {item.date} • {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rules & Eligibility */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                Eligibility
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                {hackathon.eligibility}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                Guidelines &amp; Rules
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                {hackathon.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <span className="font-bold text-neutral-400 mt-0.5">{rIdx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Participating Institutions & Sponsors */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Participating Institutions &amp; Corporate Partners
            </h2>

            {hackathon.participatingInstitutions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Academic Partners
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hackathon.participatingInstitutions.map((inst) => (
                    <span
                      key={inst.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                      <span>{inst.name} ({inst.district})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hackathon.partnerCompanies && hackathon.partnerCompanies.length > 0 && (
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Industry Problem Statement &amp; Hiring Sponsors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hackathon.partnerCompanies.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium"
                    >
                      <Building className="w-3.5 h-3.5 text-purple-600" />
                      <span>{c.name} ({c.industry})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right 1 Col: Quick Registration Action Card & Key Metadata */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-md sticky top-20 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Registration Status
              </span>
              <div className="mt-1">
                <StatusBadge status={hackathon.status} size="md" />
              </div>
            </div>

            {/* Quick Registration CTA */}
            <div>
              {isRegistered ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>You are registered for this event!</span>
                </div>
              ) : isRegistrationAvailable ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistered(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all text-center"
                >
                  Register as Student Team
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-neutral-200 text-neutral-500 dark:bg-neutral-800 font-bold text-sm cursor-not-allowed text-center"
                >
                  {hackathon.status}
                </button>
              )}
            </div>

            {/* Crucial Dates Table */}
            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Registration Deadline:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formatDate(hackathon.registrationDeadline)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Event Start Date:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formatDate(hackathon.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Event End Date:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formatDate(hackathon.endDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Allowed Team Size:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {hackathon.minTeamSize} to {hackathon.maxTeamSize} Members
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Karnataka District:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {hackathon.location.district}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Registered Count:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {hackathon.registrationCount} Participants
                </span>
              </div>
            </div>

            {/* Venue Details */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Venue Location
              </span>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 font-medium">
                {hackathon.location.address || `${hackathon.location.district}, Karnataka`}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
