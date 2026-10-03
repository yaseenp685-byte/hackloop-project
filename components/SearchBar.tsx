"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Sparkles, Clock, ArrowRight, Building, Award, GraduationCap, Users } from "lucide-react";
import { SearchCategory, SearchSuggestion } from "@/types/search";
import { ApiService } from "@/services/apiService";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: SearchCategory;
  placeholder?: string;
  autoFocus?: boolean;
  onSearchSubmit?: (query: string, category: SearchCategory) => void;
  className?: string;
  size?: "default" | "large";
}

const CATEGORY_TABS: { label: string; value: SearchCategory }[] = [
  { label: "All", value: "ALL" },
  { label: "Hackathons", value: "HACKATHONS" },
  { label: "Colleges", value: "COLLEGES" },
  { label: "Universities", value: "UNIVERSITIES" },
  { label: "Companies", value: "COMPANIES" },
  { label: "Communities", value: "COMMUNITIES" },
];

const RECENT_SEARCHES_KEY = "karnataka_portal_recent_searches";

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = "",
  initialCategory = "ALL",
  placeholder = "Search hackathons, colleges, universities, companies across Karnataka...",
  autoFocus = false,
  onSearchSubmit,
  className,
  size = "default",
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>(initialCategory);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 180);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    let isCurrent = true;
    if (debouncedQuery.trim().length > 0) {
      ApiService.getSearchSuggestions(debouncedQuery).then((res) => {
        if (isCurrent && res.success && res.data) {
          setSuggestions(res.data);
        }
      });
    } else {
      ApiService.getSearchSuggestions("").then((res) => {
        if (isCurrent && res.success && res.data) {
          setSuggestions(res.data);
        }
      });
    }
    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const handleExecuteSearch = (searchQuery: string, category: SearchCategory = activeCategory) => {
    saveRecentSearch(searchQuery);
    setIsOpen(false);

    if (onSearchSubmit) {
      onSearchSubmit(searchQuery, category);
    } else {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (category && category !== "ALL") params.set("category", category);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const item = suggestions[selectedIndex];
        handleExecuteSearch(item.title, item.category);
      } else {
        handleExecuteSearch(query);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (cat: SearchCategory) => {
    switch (cat) {
      case "HACKATHONS":
        return <Award className="w-3.5 h-3.5 text-brand-600" />;
      case "COLLEGES":
      case "UNIVERSITIES":
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case "COMPANIES":
        return <Building className="w-3.5 h-3.5 text-blue-600" />;
      case "COMMUNITIES":
        return <Users className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Category Pills (Above input for quick targeting) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        {CATEGORY_TABS.map((tab) => {
          const isSelected = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveCategory(tab.value);
                if (query.trim()) {
                  handleExecuteSearch(query, tab.value);
                }
              }}
              className={cn(
                "px-3 py-1 rounded-full font-medium transition-all shrink-0",
                isSelected
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Search Input Form */}
      <div
        className={cn(
          "relative flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-lg transition-all focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500",
          isLarge ? "h-14 sm:h-16 px-4" : "h-12 px-3"
        )}
      >
        <Search className={cn("text-neutral-400 shrink-0", isLarge ? "w-5 h-5 ml-1" : "w-4 h-4 ml-0.5")} />

        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent border-none outline-hidden px-3 text-neutral-900 dark:text-white placeholder-neutral-400",
            isLarge ? "text-base sm:text-lg" : "text-sm sm:text-base"
          )}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="search-suggestions-list"
          aria-label="Universal Search Query"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            aria-label="Clear search text"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => handleExecuteSearch(query)}
          className={cn(
            "ml-2 flex items-center justify-center font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-colors shrink-0",
            isLarge ? "px-5 py-2.5 text-sm sm:text-base gap-2" : "px-3.5 py-1.5 text-xs sm:text-sm gap-1.5"
          )}
          aria-label="Submit search"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800"
          role="listbox"
        >
          {/* Recent searches header */}
          {recentSearches.length > 0 && !query && (
            <div className="p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-1">
                <span>Recent Searches</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecentSearches([]);
                    localStorage.removeItem(RECENT_SEARCHES_KEY);
                  }}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 normal-case font-normal"
                >
                  Clear history
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      handleExecuteSearch(term);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          <div className="p-2 max-h-80 overflow-y-auto">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1">
              {query ? "Suggestions & Matches" : "Trending in Karnataka"}
            </div>
            {suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.url) {
                      router.push(item.url);
                      setIsOpen(false);
                    } else {
                      setQuery(item.title);
                      handleExecuteSearch(item.title, item.category);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors text-sm",
                    isSelected
                      ? "bg-brand-50 text-brand-900 dark:bg-brand-950/60 dark:text-brand-100"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200"
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Karnataka Example Queries Footer */}
          <div className="p-3 bg-neutral-50/70 dark:bg-neutral-900/60 text-xs text-neutral-500 flex flex-wrap items-center gap-2">
            <span className="font-medium">Try:</span>
            <button
              type="button"
              onClick={() => handleExecuteSearch("hackathon near Bengaluru")}
              className="hover:underline text-brand-600 dark:text-brand-400"
            >
              &quot;hackathon near Bengaluru&quot;
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleExecuteSearch("AI hackathon near Mysuru")}
              className="hover:underline text-brand-600 dark:text-brand-400"
            >
              &quot;AI hackathon near Mysuru&quot;
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleExecuteSearch("hackathons near RVCE")}
              className="hover:underline text-brand-600 dark:text-brand-400"
            >
              &quot;hackathons near RVCE&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
