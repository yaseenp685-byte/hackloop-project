import React from "react";
import Link from "next/link";
import { Institution } from "@/types/institution";
import { VerificationBadge } from "./VerificationBadge";
import { MapPin, GraduationCap, Award, ExternalLink, Users } from "lucide-react";

interface InstitutionCardProps {
  institution: Institution;
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution }) => {
  const isUni = institution.type === "UNIVERSITY";

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {isUni ? "University" : "Engineering College"}
            </span>
            <VerificationBadge status={institution.verificationStatus} source={institution.source} />
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">
            {institution.shortCode}
          </span>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
          <Link href={`/institutions/${institution.id}`} className="hover:text-brand-600 transition-colors">
            {institution.name}
          </Link>
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{institution.district}</span>
          {institution.establishedYear && (
            <span>• Estd {institution.establishedYear}</span>
          )}
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2.5 line-clamp-2">
          Affiliated to {institution.universityAffiliation || "Autonomous"}. Key courses: {institution.coursesAvailable.join(", ")}.
        </p>

        {/* Tech Clubs */}
        {institution.technologyClubs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Active Student Clubs</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {institution.technologyClubs.map((club) => (
                <span
                  key={club.name}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  {club.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>{institution.hackathonsHostedCount} Hackathons Hosted</span>
        </div>

        <Link
          href={`/institutions/${institution.id}`}
          className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
