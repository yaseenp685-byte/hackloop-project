import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UnifiedSearchResultItem } from "@/types/search";
import { VerificationBadge } from "./VerificationBadge";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import { MapPin, Calendar, Clock, ExternalLink, Database, Tag, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  item: UnifiedSearchResultItem;
  viewMode?: "list" | "grid";
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  viewMode = "list",
}) => {
  const router = useRouter();
  const isGrid = viewMode === "grid";
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarkLoading) return;
    setBookmarkLoading(true);

    try {
      const res = await fetch(`/api/hackathons/${item.id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.data.bookmarked);
      }
    } catch {
      // silent fallback
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between",
        !isGrid && "sm:flex-row sm:items-start gap-5"
      )}
    >
      <div className="flex-1 min-w-0">
        {/* Top Meta Header: Category, Verification Status, Live Status */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
            {item.categoryLabel}
          </span>

          <VerificationBadge status={item.verificationStatus} source={item.source} />

          {item.registrationStatus && item.category === "HACKATHONS" ? (
            <StatusBadge status={item.registrationStatus} size="sm" />
          ) : item.metaBadge ? (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {item.metaBadge}
            </span>
          ) : null}

          {/* Distance indicator when location coords are present */}
          {item.distanceKm !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              {item.distanceKm} km away
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <Link href={item.actionUrl} className="focus:outline-hidden">
            {item.title}
          </Link>
        </h3>

        {/* Location & Dates */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              {item.location.address ? `${item.location.district} (${item.location.city || "Karnataka"})` : item.location.district}
            </span>
          </div>

          {item.eventDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{item.eventDate}</span>
            </div>
          )}

          {item.registrationDeadline && (
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Deadline: {new Date(item.registrationDeadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mt-2.5 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Technology Tags */}
        {item.technologies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
            <Tag className="w-3 h-3 text-neutral-400 shrink-0 mr-0.5" />
            {item.technologies.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 6 && (
              <span className="text-[11px] text-neutral-400 font-medium">
                +{item.technologies.length - 6} more
              </span>
            )}
          </div>
        )}

        {/* Source & Last Updated Transparency Footer */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3 text-neutral-400" />
            <span className="truncate max-w-xs">Source: {item.source}</span>
          </div>
          <span>•</span>
          <div>Last verified: {formatRelativeTime(item.lastUpdated)}</div>
        </div>
      </div>

      {/* Action CTA */}
      <div className={cn("mt-4 shrink-0 flex items-center justify-end sm:flex-col sm:justify-start gap-2", !isGrid && "sm:mt-0")}>
        <div className="flex items-center gap-2">
          {item.category === "HACKATHONS" && (
            <button
              type="button"
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              title={isBookmarked ? "Remove Bookmark" : "Save / Bookmark"}
              className={cn(
                "p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center",
                isBookmarked
                  ? "bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-brand-500 hover:text-brand-600"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-brand-600 text-brand-600")} />
            </button>
          )}
          <Link
            href={item.actionUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-all shadow-xs"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
