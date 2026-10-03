import React, { ReactNode } from "react";
import { SearchX, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  description = "Try adjusting your search terms, changing the Karnataka district, or widening your distance radius.",
  icon,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-12 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center max-w-lg mx-auto",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 shadow-xs mb-4">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
