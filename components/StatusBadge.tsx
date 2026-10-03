import React from "react";
import { HackathonLiveStatus } from "@/types/hackathon";
import { cn } from "@/lib/utils";
import { Radio, AlertCircle, CheckCircle, Clock, Trophy, Award, Lock, Sparkles } from "lucide-react";

interface StatusBadgeProps {
  status: HackathonLiveStatus | string;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = "md",
}) => {
  const isSm = size === "sm";

  const getStyle = () => {
    switch (status) {
      case "Event Live":
        return {
          bg: "bg-red-500/10 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
          icon: <Radio className={cn("animate-pulse text-red-600 dark:text-red-400", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Event Live",
        };

      case "Registration Open":
        return {
          bg: "bg-emerald-500/10 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          icon: <Sparkles className={cn("text-emerald-600 dark:text-emerald-400", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Registration Open",
        };

      case "Registration Closing Soon":
        return {
          bg: "bg-amber-500/15 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
          icon: <AlertCircle className={cn("text-amber-600 dark:text-amber-400", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Closing Soon",
        };

      case "Registration Closed":
        return {
          bg: "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
          icon: <Lock className={cn("text-neutral-500", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Registration Closed",
        };

      case "Submission Open":
        return {
          bg: "bg-blue-500/10 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
          icon: <Clock className={cn("text-blue-600 dark:text-blue-400", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Submission Open",
        };

      case "Submission Closed":
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
          icon: <CheckCircle className={cn("text-slate-500", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Submission Closed",
        };

      case "Judging":
        return {
          bg: "bg-purple-500/10 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
          icon: <Award className={cn("text-purple-600 dark:text-purple-400", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Judging In Progress",
        };

      case "Results Published":
        return {
          bg: "bg-amber-500/10 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700",
          icon: <Trophy className={cn("text-amber-600 dark:text-amber-400", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: "Results Published",
        };

      default:
        return {
          bg: "bg-neutral-100 text-neutral-800 border-neutral-300",
          icon: <Clock className={cn("text-neutral-500", isSm ? "w-3 h-3" : "w-3.5 h-3.5")} />,
          label: status,
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        isSm ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm",
        style.bg,
        className
      )}
      aria-label={`Status: ${style.label}`}
    >
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};
