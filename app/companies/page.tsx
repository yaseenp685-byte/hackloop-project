"use client";

import React, { useState, useEffect } from "react";
import { ApiService } from "@/services/apiService";
import { Company } from "@/types/company";
import { CompanyCard } from "@/components/CompanyCard";
import { CardGridSkeleton } from "@/components/LoadingSkeleton";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";
import { Building, MapPin, Search } from "lucide-react";

export default function CompaniesDirectoryPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    ApiService.getCompanies().then((res) => {
      if (res.success && res.data) {
        setCompanies(res.data.data);
      }
      setIsLoading(false);
    });
  }, []);

  const filtered = companies.filter((c) => {
    if (districtFilter !== "ALL" && !c.district.includes(districtFilter)) return false;
    if (searchTerm) {
      const match = `${c.name} ${c.industry} ${c.technologyAreas.join(" ")} ${c.district}`.toLowerCase();
      if (!match.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-semibold mb-3">
          <Building className="w-4 h-4" />
          <span>Industry Ecosystem &amp; Sponsors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Companies Participating in Karnataka Hackathons
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Discover enterprises, tech startups, and innovation labs providing challenge statements, mentorship, and career opportunities across Karnataka.
        </p>
      </div>

      {/* Filter strip */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name, industry (e.g. Fintech, AI, IoT) or technology stack..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0 w-full sm:w-auto">
          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
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

      {/* Grid */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-sm text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
          No companies found matching the selected parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <CompanyCard key={comp.id} company={comp} />
          ))}
        </div>
      )}
    </div>
  );
}
