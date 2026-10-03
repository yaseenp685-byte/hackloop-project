"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchResultCard } from "@/components/SearchResultCard";
import { LocationSelector } from "@/components/LocationSelector";
import { SearchResultSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { useLocation } from "@/hooks/useLocation";
import { ApiService } from "@/services/apiService";
import { SearchCategory, SearchFilterState, UnifiedSearchResultItem, SearchResultPayload } from "@/types/search";
import { List, LayoutGrid, Map, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationHook = useLocation();

  // Search Query & Filters
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as SearchCategory) || "ALL";
  const initialDistrict = searchParams.get("district") || undefined;
  const initialRadius = searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined;
  const initialTech = searchParams.get("tech") ? [searchParams.get("tech")!] : [];

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilterState>({
    category: initialCategory,
    district: initialDistrict,
    radiusKm: initialRadius,
    technologies: initialTech,
    sortBy: "relevance",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "map">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search Results State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPayload, setSearchPayload] = useState<SearchResultPayload | null>(null);

  // Sync coords from location hook to filters
  useEffect(() => {
    if (locationHook.coords) {
      setFilters((prev) => ({
        ...prev,
        userCoords: locationHook.coords || undefined,
        district: locationHook.selectedDistrict || prev.district,
        radiusKm: locationHook.radiusKm || prev.radiusKm,
      }));
    }
  }, [locationHook.coords, locationHook.selectedDistrict, locationHook.radiusKm]);

  // Execute Search
  const executeSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiService.search({
        q: query,
        filters,
        page: currentPage,
        pageSize: 8,
      });

      if (res.success && res.data) {
        setSearchPayload(res.data);
      } else {
        setError(res.error?.message || "Search service returned an unexpected response.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to contact search service.");
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, currentPage]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const handleResetFilters = () => {
    setQuery("");
    setFilters({
      category: "ALL",
      district: undefined,
      radiusKm: undefined,
      technologies: [],
      sortBy: "relevance",
    });
    setCurrentPage(1);
    locationHook.clearLocation();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Search Header Bar */}
      <div className="mb-6">
        <SearchBar
          initialQuery={query}
          initialCategory={filters.category}
          onSearchSubmit={(newQuery, newCat) => {
            setQuery(newQuery);
            setFilters((prev) => ({ ...prev, category: newCat }));
            setCurrentPage(1);
          }}
        />

        {/* Location selector strip below search */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            <LocationSelector
              selectedDistrict={locationHook.selectedDistrict || filters.district || null}
              radiusKm={locationHook.radiusKm || filters.radiusKm || null}
              isUsingBrowserLocation={locationHook.isUsingBrowserLocation}
              permissionState={locationHook.permissionState}
              errorMessage={locationHook.errorMessage}
              onRequestBrowserLocation={locationHook.requestBrowserLocation}
              onSelectDistrict={(dist) => {
                locationHook.selectDistrict(dist);
                setFilters((prev) => ({ ...prev, district: dist || undefined }));
                setCurrentPage(1);
              }}
              onSetRadiusKm={(rad) => {
                locationHook.setRadiusKm(rad);
                setFilters((prev) => ({ ...prev, radiusKm: rad || undefined }));
                setCurrentPage(1);
              }}
              onClearLocation={() => {
                locationHook.clearLocation();
                setFilters((prev) => ({ ...prev, district: undefined, radiusKm: undefined }));
                setCurrentPage(1);
              }}
            />

            {filters.technologies.length > 0 && (
              <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
                Tech: {filters.technologies.join(", ")}
              </span>
            )}
          </div>

          {/* View mode toggle & Mobile Filter Button */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile Filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* List / Grid / Map Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-medium transition-colors",
                  viewMode === "list" && "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                )}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-medium transition-colors",
                  viewMode === "grid" && "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                )}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-medium transition-colors",
                  viewMode === "map" && "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                )}
                title="Map-Ready Layout"
                aria-label="Map-Ready Layout"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-20">
          <SearchFilters
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Mobile Filters Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-6">
            <SearchFilters
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Search Results Area */}
        <main className="col-span-1 lg:col-span-3 space-y-4">
          {/* Results Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            <div>
              {isLoading ? (
                <span>Searching Karnataka Registry...</span>
              ) : searchPayload ? (
                <span>
                  Showing <strong className="text-neutral-900 dark:text-white">{searchPayload.results.length}</strong> of{" "}
                  <strong className="text-neutral-900 dark:text-white">{searchPayload.totalResults}</strong> results
                  {query && <span> for &ldquo;{query}&rdquo;</span>}
                  {searchPayload.searchDurationMs !== undefined && (
                    <span className="ml-1 text-neutral-400">({searchPayload.searchDurationMs}ms)</span>
                  )}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5">
              <span>Sorted by:</span>
              <strong className="text-neutral-800 dark:text-neutral-200 capitalize">
                {filters.sortBy.replace("_", " ")}
              </strong>
            </div>
          </div>

          {/* Loading Skeleton State */}
          {isLoading && (
            <div className="space-y-4">
              <SearchResultSkeleton />
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState message={error} onRetry={executeSearch} />
          )}

          {/* Empty State */}
          {!isLoading && !error && searchPayload && searchPayload.results.length === 0 && (
            <EmptyState
              title="No results match your criteria"
              description="We could not find any hackathons, colleges, or companies matching your query and filters. Try adjusting the Karnataka district, expanding the distance radius, or clearing technology tags."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}

          {/* Results Display: List / Grid */}
          {!isLoading && !error && searchPayload && searchPayload.results.length > 0 && viewMode !== "map" && (
            <div
              className={cn(
                "gap-4",
                viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2" : "flex flex-col space-y-4"
              )}
            >
              {searchPayload.results.map((item) => (
                <SearchResultCard key={`${item.category}-${item.id}`} item={item} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Map-Ready Layout (Split View with Interactive Map Pins Simulator) */}
          {!isLoading && !error && searchPayload && searchPayload.results.length > 0 && viewMode === "map" && (
            <div className="space-y-4">
              {/* Map Representation Canvas */}
              <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-inner flex flex-col justify-between p-4">
                {/* Simulated Karnataka Map Surface */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/90 border border-neutral-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Karnataka Map View Coordinates</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Center: 12.9716&deg; N, 77.5946&deg; E
                  </span>
                </div>

                {/* Map Pins on Canvas */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2 py-4">
                  {searchPayload.results.slice(0, 6).map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-xl bg-neutral-800/95 border border-neutral-700 text-white text-xs shadow-lg flex items-start gap-2 backdrop-blur-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center font-bold text-[10px] shrink-0 text-white">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <div className="font-bold truncate">{item.title}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{item.location.district}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 text-[11px] text-neutral-400 bg-neutral-950/80 p-2 rounded-lg border border-neutral-800">
                  Ready for Leaflet/Mapbox vector layer integration via backend tile provider.
                </div>
              </div>

              {/* Accompanying cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchPayload.results.map((item) => (
                  <SearchResultCard key={`map-${item.id}`} item={item} viewMode="grid" />
                ))}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && searchPayload && searchPayload.totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-medium text-neutral-500">
                Page <strong className="text-neutral-900 dark:text-white">{currentPage}</strong> of{" "}
                <strong className="text-neutral-900 dark:text-white">{searchPayload.totalPages}</strong>
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= searchPayload.totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading search index...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
