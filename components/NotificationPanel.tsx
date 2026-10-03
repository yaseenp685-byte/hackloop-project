"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentNotification } from "@/types/student";
import { formatRelativeTime } from "@/lib/utils";
import { Bell, Check, Clock, Trophy, AlertTriangle, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  notifications: StudentNotification[];
  onMarkAllRead?: () => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications: initialNotifications,
  onMarkAllRead,
  className,
}) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const getIcon = (type: StudentNotification["type"]) => {
    switch (type) {
      case "DEADLINE":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "INVITATION":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "RESULT":
        return <Trophy className="w-4 h-4 text-emerald-500" />;
      case "ANNOUNCEMENT":
      default:
        return <Bell className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800">
          <div className="p-3.5 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-neutral-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={cn(
                    "p-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-start gap-3 cursor-pointer",
                    !n.read && "bg-blue-50/40 dark:bg-blue-950/20"
                  )}
                >
                  <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    {n.linkUrl && (
                      <Link
                        href={n.linkUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-block mt-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        View &rarr;
                      </Link>
                    )}
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
