import React from "react";
import Link from "next/link";
import { Company } from "@/types/company";
import { VerificationBadge } from "./VerificationBadge";
import { Building, MapPin, Briefcase, Award, ExternalLink, ArrowRight } from "lucide-react";

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            {company.industry}
          </span>
          <VerificationBadge status={company.verificationStatus} source={company.source} />
        </div>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
          <Link href={`/companies/${company.id}`} className="hover:text-brand-600 transition-colors">
            {company.name}
          </Link>
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{company.district}</span>
          {company.location.locality && <span>• {company.location.locality}</span>}
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2.5 line-clamp-2">
          {company.description}
        </p>

        {/* Tech areas */}
        <div className="flex flex-wrap gap-1 mt-3">
          {company.technologyAreas.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Open Opportunities Badge */}
        {company.opportunities.length > 0 && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="font-semibold">{company.opportunities.length} Open Tech Opportunities</span>
            </div>
            <span className="text-[10px] font-mono">Hiring</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-neutral-500">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{company.hackathonsSponsoredCount} Sponsored</span>
        </div>

        <Link
          href={`/companies/${company.id}`}
          className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
        >
          <span>View Company</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
