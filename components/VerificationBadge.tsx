import React from "react";
import { VerificationStatus } from "@/types/common";
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  status: VerificationStatus;
  source?: string;
  className?: string;
  showSourceTooltip?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  source,
  className,
  showSourceTooltip = true,
}) => {
  switch (status) {
    case "VERIFIED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
            className
          )}
          title={source ? `Verified Source: ${source}` : "Verified by Karnataka Portal Admin"}
          aria-label="Verified listing"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>VERIFIED</span>
        </span>
      );

    case "PENDING":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            className
          )}
          title="Submitted and awaiting administrative review"
          aria-label="Pending verification"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>PENDING REVIEW</span>
        </span>
      );

    case "STALE_NEEDS_UPDATE":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
            className
          )}
          title="Data has not been renewed in over 12 months. Requires organizer update."
          aria-label="Stale data, needs update"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          <span>STALE / NEEDS UPDATE</span>
        </span>
      );

    case "UNVERIFIED":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
            className
          )}
          title="Unverified community or external submission"
          aria-label="Unverified listing"
        >
          <HelpCircle className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
          <span>UNVERIFIED</span>
        </span>
      );
  }
};
