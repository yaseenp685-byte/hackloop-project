"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { LocationSelector } from "@/components/LocationSelector";
import { HackathonCard } from "@/components/HackathonCard";
import { InstitutionCard } from "@/components/InstitutionCard";
import { CompanyCard } from "@/components/CompanyCard";
import { RealtimeStatusBadge } from "@/components/RealtimeStatusBadge";
import { useLocation } from "@/hooks/useLocation";
import { ApiService } from "@/services/apiService";
import { Hackathon } from "@/types/hackathon";
import { Institution } from "@/types/institution";
import { Company } from "@/types/company";
import { Community } from "@/types/community";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Award,
  GraduationCap,
  Building,
  Users,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Shield,
  Layers,
  Code2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const locationHook = useLocation();

  const [featuredHackathons, setFeaturedHackathons] = useState<Hackathon[]>([]);
  const [colleges, setColleges] = useState<Institution[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    ApiService.getHackathons().then((res) => {
      if (res.success && res.data) {
        setFeaturedHackathons(res.data.data.slice(0, 3));
      }
    });

    ApiService.getInstitutions().then((res) => {
      if (res.success && res.data) {
        setColleges(res.data.data.slice(0, 3));
      }
    });

    ApiService.getCompanies().then((res) => {
      if (res.success && res.data) {
        setCompanies(res.data.data.slice(0, 3));
      }
    });

    ApiService.getCommunities().then((res) => {
      if (res.success && res.data) {
        setCommunities(res.data.data.slice(0, 4));
      }
    });
  }, []);

  const handleBookmarkToggle = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const executeCategorySearch = (cat: string) => {
    router.push(`/search?category=${cat}`);
  };

  const executeDistrictSearch = (district: string) => {
    router.push(`/search?district=${encodeURIComponent(district)}`);
  };

  const POPULAR_TECH = [
    "Generative AI",
    "Kannada NLP",
    "Rust",
    "Go",
    "Next.js",
    "Agritech IoT",
    "Web3",
    "Autonomous Robotics",
    "Distributed Systems",
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-700 via-brand-700 to-amber-600 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
        <span>Official State Middle Layer Connecting 31 Karnataka Districts</span>
        <span className="hidden sm:inline">• 14+ Live Hackathons &amp; 200+ Colleges Integrated</span>
      </div>

      {/* HERO SECTION WITH PROMINENT UNIVERSAL SEARCH ENGINE */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
        <div className="max-w-5xl mx-auto text-center">
          {/* Karnataka Portal Identity Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Karnataka Hackathon Community &amp; Discovery Portal</span>
          </div>

          {/* Primary Communicated Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
            Discover Hackathons, Communities, Colleges, Universities and Technology Opportunities Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-karnataka-red via-red-600 to-amber-500">Karnataka</span>.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            The centralized search engine and digital middle layer connecting students, college hackathons, premier universities, tech enterprises, and grassroots student clubs from Bengaluru to Kalaburagi.
          </p>

          {/* PROMINENT UNIVERSAL SEARCH BOX */}
          <div className="mt-8 sm:mt-10">
            <SearchBar size="large" autoFocus={false} />
          </div>

          {/* LOCATION-AWARE DISCOVERY BAR */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Compass className="w-4 h-4 text-brand-600" />
              <span className="font-semibold">Location-Aware Discovery:</span>
            </div>
            <LocationSelector
              selectedDistrict={locationHook.selectedDistrict}
              radiusKm={locationHook.radiusKm}
              isUsingBrowserLocation={locationHook.isUsingBrowserLocation}
              permissionState={locationHook.permissionState}
              errorMessage={locationHook.errorMessage}
              onRequestBrowserLocation={locationHook.requestBrowserLocation}
              onSelectDistrict={locationHook.selectDistrict}
              onSetRadiusKm={locationHook.setRadiusKm}
              onClearLocation={locationHook.clearLocation}
            />
            {locationHook.selectedDistrict && (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/search?district=${encodeURIComponent(locationHook.selectedDistrict!)}${
                      locationHook.radiusKm ? `&radius=${locationHook.radiusKm}` : ""
                    }`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-xs"
              >
                Find Opportunities in {locationHook.selectedDistrict} &rarr;
              </button>
            )}
          </div>

          {/* Quick Example Searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold">Quick Searches:</span>
            {[
              "hackathon near Bengaluru",
              "AI hackathon near Mysuru",
              "college hackathon",
              "Python hackathon",
              "hackathons near RVCE",
              "universities near Bengaluru",
              "companies participating in hackathons",
            ].map((queryText) => (
              <button
                key={queryText}
                type="button"
                onClick={() => router.push(`/search?q=${encodeURIComponent(queryText)}`)}
                className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                &ldquo;{queryText}&rdquo;
              </button>
            ))}
          </div>

          {/* Dual Primary Call-to-Actions (Student Registration CTA + Organizer CTA) */}
          <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login/student"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Registration &amp; Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login/organizer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Publish Hackathon (Organizers)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* REGIONAL HUB QUICK FILTERS */}
      <section className="py-8 bg-neutral-100/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Explore Karnataka By District &amp; Division
              </h2>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                Target tech hubs with verified institutional affiliations
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: "Bengaluru Urban", label: "Bengaluru (Tech Capital)" },
                { name: "Mysuru", label: "Mysuru Hub" },
                { name: "Dakshina Kannada (Mangaluru)", label: "Mangaluru Coastal" },
                { name: "Dharwad (Hubballi-Dharwad)", label: "Hubballi-Dharwad" },
                { name: "Belagavi", label: "Belagavi / VTU" },
                { name: "Kalaburagi (Gulbarga)", label: "Kalaburagi Region" },
              ].map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => executeDistrictSearch(d.name)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-brand-500 hover:text-brand-600 transition-colors shadow-2xs"
                >
                  <MapPin className="w-3 h-3 inline mr-1 text-red-500" />
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED & UPCOMING HACKATHONS */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Award className="w-4 h-4" />
              <span>Live &amp; Upcoming Marathons</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Featured Karnataka Hackathons
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Verified hackathons across colleges, universities, and state tech bodies with active registration tracks.
            </p>
          </div>

          <Link
            href="/search?category=HACKATHONS"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Browse All Hackathons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHackathons.map((hack) => (
            <HackathonCard
              key={hack.id}
              hackathon={hack}
              isBookmarked={bookmarkedIds.has(hack.id)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      </section>

      {/* TECHNOLOGY FILTERS & TOPIC CATEGORIES */}
      <section className="py-12 bg-neutral-100/50 dark:bg-neutral-900/40 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
              Popular Technology Themes in Karnataka
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Filter hackathons and partner company problem statements by core stack.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {POPULAR_TECH.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => router.push(`/search?tech=${encodeURIComponent(tech)}`)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-brand-500 hover:text-brand-600 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-brand-600" />
                <span>{tech}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PARTICIPATING COLLEGES & UNIVERSITIES */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Higher Education Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Participating Colleges &amp; Universities
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              VTU-affiliated autonomous institutions, state universities, and national institutes hosting hackathons.
            </p>
          </div>

          <Link
            href="/institutions"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Explore All Institutions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </section>

      {/* COMPANIES & INDUSTRY SPONSORS */}
      <section className="py-14 sm:py-20 bg-neutral-100/50 dark:bg-neutral-900/40 border-t border-neutral-200 dark:border-neutral-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                <Building className="w-4 h-4" />
                <span>Industry Partnerships &amp; Grants</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                Companies Supporting Hackathons
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Sponsoring problem statements, providing cloud credits, and hiring top student hackers.
              </p>
            </div>

            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>View All Companies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <CompanyCard key={comp.id} company={comp} />
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT COMMUNITIES SPOTLIGHT */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Users className="w-4 h-4" />
              <span>Grassroots Developer Guilds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Student &amp; Hackathon Communities
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Connect with fellow builders, find teammates, and organize local code sprints.
            </p>
          </div>

          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View All Communities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {comm.district}
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-2">
                  {comm.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {comm.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">{comm.memberCount} members</span>
                <Link href="/communities" className="text-brand-600 font-bold hover:underline">
                  Join &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSPARENCY & VERIFICATION SYSTEM PROMISE */}
      <section className="py-12 bg-neutral-900 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-800 text-emerald-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Statewide Verification Status</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Every hackathon and institution clearly displays its verification level: VERIFIED, PENDING, or STALE. No unverified submission is passed off as official.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-800 text-blue-400 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Location-Aware Haversine Engine</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Search by your exact Karnataka college or district radius (10km, 25km, 50km) with automatic distance calculation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-800 text-amber-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Real-time Data Stream Ready</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Reactive architecture ready for WebSocket/SSE updates as registration counters and judging states shift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
