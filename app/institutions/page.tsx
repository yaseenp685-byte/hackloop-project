"use client";

import React, { useState, useEffect } from "react";
import { ApiService } from "@/services/apiService";
import { Institution } from "@/types/institution";
import { InstitutionCard } from "@/components/InstitutionCard";
import { SearchBar } from "@/components/SearchBar";
import { CardGridSkeleton } from "@/components/LoadingSkeleton";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";
import { GraduationCap, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InstitutionsDirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [districtFilter, setDistrictFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    ApiService.getInstitutions().then((res) => {
      if (res.success && res.data) {
        setInstitutions(res.data.data);
      }
      setIsLoading(false);
    });
  }, []);

  const filtered = institutions.filter((item) => {
    if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
    if (districtFilter !== "ALL" && !item.district.includes(districtFilter)) return false;
    if (searchTerm) {
      const match = `${item.name} ${item.shortCode} ${item.district} ${item.coursesAvailable.join(" ")}`.toLowerCase();
      if (!match.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Karnataka Higher Education Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Searchable Colleges &amp; Universities
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Discover verified engineering colleges and universities in Karnataka hosting hackathons, active coding clubs, and technical innovation centers.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by college name, shortcode (e.g. RVCE, NITK, BMSCE), course or keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Institution Type Tabs */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {[
              { label: "All Institutions", value: "ALL" },
              { label: "Colleges", value: "COLLEGE" },
              { label: "Universities", value: "UNIVERSITY" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setTypeFilter(tab.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border transition-colors",
                  typeFilter === tab.value
                    ? "bg-brand-600 text-white border-brand-700"
                    : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Karnataka Districts</option>
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-sm text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
          No institutions match the chosen filters. Try clearing your search term or district filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      )}
    </div>
  );
}
