"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ApiService } from "@/services/apiService";
import { Company } from "@/types/company";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatRelativeTime } from "@/lib/utils";
import {
  Building,
  MapPin,
  Globe,
  Briefcase,
  Award,
  ChevronLeft,
  ExternalLink,
  Code2,
} from "lucide-react";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    ApiService.getCompanyById(id).then((res) => {
      if (res.success && res.data) {
        setCompany(res.data);
      }
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Loading partner company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Company Record Not Found</h2>
        <Link href="/companies" className="mt-4 inline-block text-brand-600 text-sm font-semibold">
          &larr; Back to Companies Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Companies Directory</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 uppercase tracking-wide">
              {company.industry}
            </span>
            <VerificationBadge status={company.verificationStatus} source={company.source} />
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Last verified: {formatRelativeTime(company.lastUpdated)}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
            {company.name}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 max-w-3xl leading-relaxed">
            {company.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span>{company.location.address || `${company.district}, Karnataka`}</span>
          </div>
          {company.websiteUrl && (
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Company Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* 2 Cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Opportunities (Internships, Challenges, Grants) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span>Opportunities for Karnataka Hackathon Participants</span>
          </h2>

          {company.opportunities.length === 0 ? (
            <p className="text-xs text-neutral-500">No active job or grant listings currently published.</p>
          ) : (
            <div className="space-y-3">
              {company.opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      {opp.type}
                    </span>
                    {opp.deadline && (
                      <span className="text-[11px] text-neutral-500">Deadline: {opp.deadline}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{opp.title}</h4>
                  <div className="text-xs text-neutral-500">Location: {opp.location}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hackathon Sponsorships & Tech Focus */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-600" />
              <span>Technology Focus Areas</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {company.technologyAreas.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Associated Hackathons in Karnataka</span>
            </h2>
            <div className="space-y-2">
              {company.associatedHackathons.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">{h.title}</div>
                    <div className="text-neutral-500">Role: {h.role} • {h.year}</div>
                  </div>
                  <Link
                    href={`/search?q=${encodeURIComponent(h.title)}`}
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    View &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
