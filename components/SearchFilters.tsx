"use client";

import React from "react";
import { SearchCategory, SearchFilterState, SearchSortOption } from "@/types/search";
import { VerificationStatus, EventFormat } from "@/types/common";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";
import { SlidersHorizontal, RotateCcw, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  filters: SearchFilterState;
  onFilterChange: (newFilters: SearchFilterState) => void;
  onResetFilters: () => void;
  className?: string;
}

const COMMON_TECH_STACKS = [
  "Python",
  "Generative AI",
  "React",
  "Next.js",
  "TypeScript",
  "Go",
  "Rust",
  "Docker",
  "Kubernetes",
  "Web3",
  "Solidity",
  "IoT Sensors",
  "Agritech",
  "Embedded C++",
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  className,
}) => {
  const toggleTech = (tech: string) => {
    const exists = filters.technologies.includes(tech);
    const updated = exists
      ? filters.technologies.filter((t) => t !== tech)
      : [...filters.technologies, tech];
    onFilterChange({ ...filters, technologies: updated });
  };

  return (
    <div className={cn("bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900 dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>Filters & Discovery</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label htmlFor="sort-by" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          Sort Results By
        </label>
        <select
          id="sort-by"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as SearchSortOption })}
          className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
        >
          <option value="relevance">Most Relevant First</option>
          <option value="distance_asc">Nearest Distance First</option>
          <option value="date_asc">Event Date: Earliest First</option>
          <option value="date_desc">Event Date: Latest First</option>
          <option value="deadline_soon">Registration Closing Soon</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {(["ALL", "HACKATHONS", "COLLEGES", "UNIVERSITIES", "COMPANIES", "COMMUNITIES"] as SearchCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onFilterChange({ ...filters, category: cat })}
              className={cn(
                "py-1.5 px-2 rounded-lg border text-left font-medium transition-colors",
                filters.category === cat
                  ? "bg-brand-50 text-brand-900 border-brand-300 dark:bg-brand-950/60 dark:text-brand-200 dark:border-brand-800"
                  : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50"
              )}
            >
              {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Karnataka District */}
      <div>
        <label htmlFor="filter-district" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          District (Karnataka)
        </label>
        <select
          id="filter-district"
          value={filters.district || "ALL"}
          onChange={(e) => onFilterChange({ ...filters, district: e.target.value === "ALL" ? undefined : e.target.value })}
          className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
        >
          <option value="ALL">All 31 Karnataka Districts</option>
          {KARNATAKA_DISTRICTS.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Distance Radius */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Distance Radius
          </label>
          <span className="text-xs text-brand-600 font-medium">
            {filters.radiusKm ? `${filters.radiusKm} km radius` : "Statewide"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[10, 25, 50, 100].map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => onFilterChange({ ...filters, radiusKm: filters.radiusKm === km ? undefined : km })}
              className={cn(
                "py-1 px-2 text-xs rounded-md border font-medium",
                filters.radiusKm === km
                  ? "bg-brand-600 text-white border-brand-700"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
              )}
            >
              &le;{km} km
            </button>
          ))}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, radiusKm: undefined })}
            className={cn(
              "py-1 px-2 text-xs rounded-md border font-medium",
              !filters.radiusKm
                ? "bg-brand-600 text-white border-brand-700"
                : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
            )}
          >
            All
          </button>
        </div>
      </div>

      {/* Event Format */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          Event Format
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(["ALL", "OFFLINE", "ONLINE", "HYBRID"] as (EventFormat | "ALL")[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onFilterChange({ ...filters, eventFormat: fmt })}
              className={cn(
                "py-1 px-2.5 text-xs rounded-lg border font-medium",
                (filters.eventFormat || "ALL") === fmt
                  ? "bg-brand-600 text-white border-brand-700"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
              )}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Status */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          Verification Level
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { label: "All Items", value: "ALL" },
            { label: "Verified Only", value: "VERIFIED" },
            { label: "Pending Review", value: "PENDING" },
            { label: "Needs Update", value: "STALE_NEEDS_UPDATE" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer text-neutral-700 dark:text-neutral-300">
              <input
                type="radio"
                name="verificationStatus"
                checked={(filters.verificationStatus || "ALL") === item.value}
                onChange={() => onFilterChange({ ...filters, verificationStatus: item.value as any })}
                className="w-3.5 h-3.5 text-brand-600 rounded-full focus:ring-brand-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Technologies Filter */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          Technologies
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_TECH_STACKS.map((tech) => {
            const isSelected = filters.technologies.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={cn(
                  "py-1 px-2 text-xs rounded-md border font-medium flex items-center gap-1 transition-colors",
                  isSelected
                    ? "bg-brand-600 text-white border-brand-700"
                    : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{tech}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
