import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while communicating with the discovery service. Please check your network and try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-8 text-center rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 max-w-lg mx-auto flex flex-col items-center justify-center",
        className
      )}
      role="alert"
    >
      <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 mb-3">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-red-900 dark:text-red-200">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1.5 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
