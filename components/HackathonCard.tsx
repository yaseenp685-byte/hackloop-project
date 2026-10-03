import React from "react";
import Link from "next/link";
import { Hackathon } from "@/types/hackathon";
import { VerificationBadge } from "./VerificationBadge";
import { StatusBadge } from "./StatusBadge";
import { Calendar, MapPin, Users, Trophy, Bookmark, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface HackathonCardProps {
  hackathon: Hackathon;
  onBookmarkToggle?: (id: string) => void;
  isBookmarked?: boolean;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  return (
    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={hackathon.status} size="sm" />
            <VerificationBadge status={hackathon.verificationStatus} source={hackathon.source} />
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              {hackathon.format}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onBookmarkToggle?.(hackathon.id);
              }}
              className="p-1.5 text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={isBookmarked ? "Remove bookmark" : "Save hackathon"}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-brand-600 text-brand-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <Link href={`/hackathons/${hackathon.slug}`} className="focus:outline-hidden">
            {hackathon.title}
          </Link>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
          {hackathon.tagline}
        </p>

        {/* Organizer */}
        <div className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
          <span className="text-neutral-400">By</span>
          <span className="truncate">{hackathon.organizer.name}</span>
        </div>

        {/* Dates & Location */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{formatDate(hackathon.startDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{hackathon.location.district}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{hackathon.minTeamSize}-{hackathon.maxTeamSize} per team</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold truncate">
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span>{hackathon.prizes[0]?.amount || "Prizes announced"}</span>
          </div>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {hackathon.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              {tech}
            </span>
          ))}
          {hackathon.technologies.length > 4 && (
            <span className="text-[10px] text-neutral-400">+{hackathon.technologies.length - 4}</span>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-[11px] text-neutral-400">
          {hackathon.registrationCount} registered
        </span>
        <Link
          href={`/hackathons/${hackathon.slug}`}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-colors"
        >
          View Hackathon
        </Link>
      </div>
    </div>
  );
};
