"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ApiService } from "@/services/apiService";
import { Institution } from "@/types/institution";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatRelativeTime } from "@/lib/utils";
import {
  GraduationCap,
  MapPin,
  Globe,
  Award,
  Users,
  Calendar,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function InstitutionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    ApiService.getInstitutionById(id).then((res) => {
      if (res.success && res.data) {
        setInstitution(res.data);
      }
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Loading institution records...</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Institution Record Not Found</h2>
        <Link href="/institutions" className="mt-4 inline-block text-brand-600 text-sm font-semibold">
          &larr; Back to Institutions Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Institutions Directory</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wide">
              {institution.type}
            </span>
            <VerificationBadge status={institution.verificationStatus} source={institution.source} />
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Last verified: {formatRelativeTime(institution.lastUpdated)}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
            {institution.name} ({institution.shortCode})
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Affiliated to: <strong className="text-neutral-800 dark:text-neutral-200">{institution.universityAffiliation || "Autonomous"}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span>{institution.location.address || institution.district}</span>
          </div>
          {institution.establishedYear && (
            <div>Estd: <strong>{institution.establishedYear}</strong></div>
          )}
          {institution.websiteUrl && (
            <a
              href={institution.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Official Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
          <div className="text-2xl font-black text-brand-600 tabular-nums">
            {institution.hackathonsHostedCount}
          </div>
          <div className="text-xs font-semibold text-neutral-500 mt-1">Hackathons Hosted</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
          <div className="text-2xl font-black text-emerald-600 tabular-nums">
            {institution.hackathonsParticipatedCount}
          </div>
          <div className="text-xs font-semibold text-neutral-500 mt-1">Events Participated</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
          <div className="text-2xl font-black text-purple-600 tabular-nums">
            {institution.technologyClubs.length}
          </div>
          <div className="text-xs font-semibold text-neutral-500 mt-1">Active Tech Clubs</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
          <div className="text-2xl font-black text-amber-600 tabular-nums">
            {institution.upcomingEvents.length}
          </div>
          <div className="text-xs font-semibold text-neutral-500 mt-1">Upcoming Events</div>
        </div>
      </div>

      {/* 2 Column Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technology Clubs & Developer Groups */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            <span>Student Technology &amp; Coding Clubs</span>
          </h2>

          <div className="space-y-3">
            {institution.technologyClubs.map((club) => (
              <div
                key={club.name}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{club.name}</h4>
                  {club.memberCount && (
                    <span className="text-xs text-neutral-500 font-medium">
                      {club.memberCount} members
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {club.focus.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses & Departments Available */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Academic Programs &amp; Engineering Disciplines</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {institution.coursesAvailable.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Upcoming events hosted */}
          {institution.upcomingEvents.length > 0 && (
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Upcoming Hackathons &amp; Sprints
              </h3>
              <div className="space-y-2">
                {institution.upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white">{evt.title}</div>
                      <div className="text-neutral-500">{evt.date} • {evt.format}</div>
                    </div>
                    <Link
                      href={`/search?q=${encodeURIComponent(evt.title)}`}
                      className="font-semibold text-brand-600 hover:underline"
                    >
                      View &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
