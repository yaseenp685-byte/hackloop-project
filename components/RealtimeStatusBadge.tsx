"use client";

import React from "react";
import { useRealtime } from "@/hooks/useRealtime";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface RealtimeStatusBadgeProps {
  className?: string;
  showSimulateTrigger?: boolean;
}

export const RealtimeStatusBadge: React.FC<RealtimeStatusBadgeProps> = ({
  className,
  showSimulateTrigger = false,
}) => {
  const { connectionState, isLive, statusLabel, simulateUpdate } = useRealtime();

  const getStatusColor = () => {
    switch (connectionState) {
      case "LIVE":
        return "bg-emerald-500";
      case "CONNECTING":
        return "bg-blue-500 animate-pulse";
      case "RECONNECTING":
        return "bg-amber-500 animate-pulse";
      case "OFFLINE":
      default:
        return "bg-neutral-400";
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-colors",
          isLive
            ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
            : connectionState === "RECONNECTING"
            ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
            : "bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
        )}
        role="status"
        aria-live="polite"
      >
        {/* Pulsing Dot */}
        <span className="relative flex h-2 w-2">
          {isLive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", getStatusColor())}></span>
        </span>

        {/* Icon & Label */}
        {connectionState === "LIVE" ? (
          <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        ) : connectionState === "RECONNECTING" ? (
          <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-spin" />
        ) : (
          <WifiOff className="w-3 h-3 text-neutral-500" />
        )}

        <span className="tabular-nums font-mono text-[11px]">{statusLabel}</span>
      </div>

      {showSimulateTrigger && isLive && (
        <button
          type="button"
          onClick={() =>
            simulateUpdate("REGISTRATION_UPDATE", {
              hackathonId: "hack-rvce-2026",
              message: "New registration batch synced across Bengaluru zone!",
            })
          }
          className="text-[11px] underline text-blue-600 hover:text-blue-800 font-medium"
          title="Developer UI Test: Dispatch live synthetic event"
        >
          [Test Live Ping]
        </button>
      )}
    </div>
  );
};
