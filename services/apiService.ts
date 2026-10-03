/**
 * CLEAN API SERVICE LAYER
 * 
 * IMPORTANT ARCHITECTURE NOTE:
 * This layer encapsulates all communication with the backend.
 * Currently backed by typed, isolated mock data fixtures while backend endpoints are being implemented by Claude Code.
 * 
 * When backend endpoints are deployed, toggle USE_REAL_BACKEND to true or configure NEXT_PUBLIC_API_URL.
 * No UI component imports mock data directly; all components consume this service interface.
 */

import { ApiResponse, PaginatedResponse, VerificationStatus } from "@/types/common";
import { SearchFilterState, SearchResultPayload, SearchSuggestion, UnifiedSearchResultItem } from "@/types/search";
import { Hackathon } from "@/types/hackathon";
import { Institution } from "@/types/institution";
import { Company } from "@/types/company";
import { Community } from "@/types/community";
import { StudentProfile, StudentRegistration, StudentTeam, StudentNotification } from "@/types/student";
import { OrganizerProfile, CreateHackathonInput, ParticipantRecord, OrganizerTeamRecord, OrganizerAnnouncement } from "@/types/organizer";
import { AdminPlatformStats, VerificationRequestItem, ModerationItem, AuditLogEntry, DataSourceStatus, SystemHealthMetric } from "@/types/admin";

import { MOCK_HACKATHONS } from "@/lib/mockData/hackathons";
import { MOCK_INSTITUTIONS } from "@/lib/mockData/institutions";
import { MOCK_COMPANIES } from "@/lib/mockData/companies";
import { MOCK_COMMUNITIES } from "@/lib/mockData/communities";
import {
  MOCK_STUDENT_PROFILE,
  MOCK_STUDENT_REGISTRATIONS,
  MOCK_STUDENT_TEAMS,
  MOCK_STUDENT_NOTIFICATIONS,
} from "@/lib/mockData/studentData";
import {
  MOCK_ORGANIZER_PROFILE,
  MOCK_ORGANIZER_PARTICIPANTS,
  MOCK_ORGANIZER_TEAMS,
  MOCK_ORGANIZER_ANNOUNCEMENTS,
} from "@/lib/mockData/organizerData";
import {
  MOCK_ADMIN_STATS,
  MOCK_VERIFICATION_REQUESTS,
  MOCK_MODERATION_ITEMS,
  MOCK_AUDIT_LOGS,
  MOCK_DATA_SOURCES,
  MOCK_SYSTEM_HEALTH,
} from "@/lib/mockData/adminData";
import { calculateDistanceKm } from "@/lib/utils";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";

const USE_REAL_BACKEND = process.env.NEXT_PUBLIC_USE_REAL_BACKEND === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Helper to simulate network latency realistically for UI testing
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiService {
  /**
   * UNIVERSAL SEARCH ENGINE
   * Discovers hackathons, colleges, universities, companies, and communities across Karnataka
   */
  static async search(params: {
    q: string;
    filters?: Partial<SearchFilterState>;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<SearchResultPayload>> {
    const startTime = Date.now();
    const query = (params.q || "").trim().toLowerCase();
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const filters = params.filters || {};

    if (USE_REAL_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filters, page, pageSize }),
      });
      return await res.json();
    }

    // Client-side isolated mock search implementation
    await delay(120); // realistic query latency

    const rawResults: UnifiedSearchResultItem[] = [];

    // 1. Process Hackathons
    if (!filters.category || filters.category === "ALL" || filters.category === "HACKATHONS") {
      MOCK_HACKATHONS.forEach((h) => {
        let distance: number | undefined;
        if (filters.userCoords) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            h.location.latitude,
            h.location.longitude
          );
        }

        rawResults.push({
          id: h.id,
          title: h.title,
          category: "HACKATHONS",
          categoryLabel: "Hackathon",
          slug: h.slug,
          description: h.description,
          location: {
            district: h.location.district,
            city: h.location.city,
            address: h.location.address,
            latitude: h.location.latitude,
            longitude: h.location.longitude,
          },
          distanceKm: distance,
          technologies: h.technologies,
          eventDate: `${h.startDate.slice(0, 10)} to ${h.endDate.slice(0, 10)}`,
          registrationDeadline: h.registrationDeadline,
          registrationStatus: h.status,
          verificationStatus: h.verificationStatus,
          source: h.source,
          lastUpdated: h.lastUpdated,
          metaBadge: h.format,
          actionUrl: `/hackathons/${h.slug}`,
        });
      });
    }

    // 2. Process Colleges & Universities
    if (!filters.category || filters.category === "ALL" || filters.category === "COLLEGES" || filters.category === "UNIVERSITIES") {
      MOCK_INSTITUTIONS.forEach((inst) => {
        const isUni = inst.type === "UNIVERSITY";
        if (filters.category === "COLLEGES" && isUni) return;
        if (filters.category === "UNIVERSITIES" && !isUni) return;

        let distance: number | undefined;
        if (filters.userCoords) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            inst.location.latitude,
            inst.location.longitude
          );
        }

        rawResults.push({
          id: inst.id,
          title: inst.name,
          category: isUni ? "UNIVERSITIES" : "COLLEGES",
          categoryLabel: isUni ? "University" : "College",
          slug: inst.id,
          description: `${inst.shortCode} • Affiliated to ${inst.universityAffiliation || "Autonomous"} • ${inst.coursesAvailable.join(", ")}`,
          location: {
            district: inst.location.district,
            city: inst.location.city,
            address: inst.location.address,
            latitude: inst.location.latitude,
            longitude: inst.location.longitude,
          },
          distanceKm: distance,
          technologies: inst.technologyClubs.flatMap((c) => c.focus),
          eventDate: inst.upcomingEvents[0]?.date,
          registrationStatus: inst.upcomingEvents.length > 0 ? `${inst.upcomingEvents.length} Upcoming Events` : "Active Partner",
          verificationStatus: inst.verificationStatus,
          source: inst.source,
          lastUpdated: inst.lastUpdated,
          metaBadge: `${inst.hackathonsHostedCount} Hackathons Hosted`,
          actionUrl: `/institutions/${inst.id}`,
        });
      });
    }

    // 3. Process Companies
    if (!filters.category || filters.category === "ALL" || filters.category === "COMPANIES") {
      MOCK_COMPANIES.forEach((c) => {
        let distance: number | undefined;
        if (filters.userCoords) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            c.location.latitude,
            c.location.longitude
          );
        }

        rawResults.push({
          id: c.id,
          title: c.name,
          category: "COMPANIES",
          categoryLabel: "Company / Partner",
          slug: c.id,
          description: `${c.industry} • ${c.description}`,
          location: {
            district: c.location.district,
            city: c.location.city,
            address: c.location.address,
            latitude: c.location.latitude,
            longitude: c.location.longitude,
          },
          distanceKm: distance,
          technologies: c.technologyAreas,
          registrationStatus: c.opportunities.length > 0 ? `${c.opportunities.length} Open Opportunities` : "Tech Sponsor",
          verificationStatus: c.verificationStatus,
          source: c.source,
          lastUpdated: c.lastUpdated,
          metaBadge: `${c.hackathonsSponsoredCount} Hackathons Sponsored`,
          actionUrl: `/companies/${c.id}`,
        });
      });
    }

    // 4. Process Communities
    if (!filters.category || filters.category === "ALL" || filters.category === "COMMUNITIES") {
      MOCK_COMMUNITIES.forEach((comm) => {
        let distance: number | undefined;
        if (filters.userCoords && comm.location.latitude && comm.location.longitude) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            comm.location.latitude,
            comm.location.longitude
          );
        }

        rawResults.push({
          id: comm.id,
          title: comm.name,
          category: "COMMUNITIES",
          categoryLabel: "Community",
          slug: comm.id,
          description: `${comm.leadName} • ${comm.description}`,
          location: {
            district: comm.district,
            city: comm.location.city,
          },
          distanceKm: distance,
          technologies: comm.technologies,
          registrationStatus: `${comm.memberCount} Members`,
          verificationStatus: comm.verificationStatus,
          source: comm.source,
          lastUpdated: comm.lastUpdated,
          metaBadge: `${comm.activeEventsCount} Active Events`,
          actionUrl: `/communities#${comm.id}`,
        });
      });
    }

    // Apply Filter Matching
    let filtered = rawResults.filter((item) => {
      // Query filter
      if (query) {
        const textToMatch = `${item.title} ${item.description} ${item.location.district} ${item.location.city || ""} ${item.technologies.join(" ")}`.toLowerCase();
        // Support matching phrases like "near bengaluru", "hackathon in mysuru"
        const cleanQuery = query.replace(/\bnear\b|\bin\b|\baround\b|\bfind\b/gi, "").trim();
        const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);
        const matchesAllTokens = queryTokens.every((token) => textToMatch.includes(token));
        if (!matchesAllTokens) return false;
      }

      // District filter
      if (filters.district && filters.district !== "ALL") {
        if (!item.location.district.toLowerCase().includes(filters.district.toLowerCase())) {
          return false;
        }
      }

      // Radius filter (when userCoords is active)
      if (filters.radiusKm && item.distanceKm !== undefined) {
        if (item.distanceKm > filters.radiusKm) {
          return false;
        }
      }

      // Technology filter
      if (filters.technologies && filters.technologies.length > 0) {
        const hasTech = filters.technologies.some((tech) =>
          item.technologies.some((t) => t.toLowerCase() === tech.toLowerCase())
        );
        if (!hasTech) return false;
      }

      // Verification filter
      if (filters.verificationStatus && filters.verificationStatus !== "ALL") {
        if (item.verificationStatus !== filters.verificationStatus) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === "distance_asc" && a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      if (filters.sortBy === "date_asc" && a.eventDate && b.eventDate) {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }
      if (filters.sortBy === "date_desc" && a.eventDate && b.eventDate) {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      }
      return 0; // relevance default
    });

    const totalResults = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data: {
        query: params.q,
        appliedFilters: {
          category: filters.category || "ALL",
          district: filters.district,
          radiusKm: filters.radiusKm,
          technologies: filters.technologies || [],
          sortBy: filters.sortBy || "relevance",
          verificationStatus: filters.verificationStatus,
        },
        results: paginated,
        totalResults,
        page,
        pageSize,
        totalPages: Math.ceil(totalResults / pageSize),
        searchDurationMs: Date.now() - startTime,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: "Karnataka Universal Discovery Index (Isolated Mock Layer)",
        cached: false,
        latencyMs: Date.now() - startTime,
      },
    };
  }

  /**
   * SEARCH AUTOCOMPLETE & SUGGESTIONS
   */
  static async getSearchSuggestions(query: string): Promise<ApiResponse<SearchSuggestion[]>> {
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      // Default trending searches
      return {
        success: true,
        data: [
          { id: "s-1", title: "Hackathons in Bengaluru Urban", subtitle: "Trending Karnataka Region", category: "HACKATHONS" },
          { id: "s-2", title: "Generative AI Hackathons", subtitle: "Popular Technology", category: "HACKATHONS" },
          { id: "s-3", title: "Colleges in Mysuru", subtitle: "Verified Institutions", category: "COLLEGES" },
          { id: "s-4", title: "NITK Surathkal HackVerse", subtitle: "Coastal Hackathon", category: "HACKATHONS" },
          { id: "s-5", title: "PhonePe & Thoughtworks Sponsored", subtitle: "Industry Partners", category: "COMPANIES" },
        ],
      };
    }

    const suggestions: SearchSuggestion[] = [];

    // Search hackathons
    MOCK_HACKATHONS.forEach((h) => {
      if (h.title.toLowerCase().includes(q) || h.technologies.some((t) => t.toLowerCase().includes(q))) {
        suggestions.push({
          id: h.id,
          title: h.title,
          subtitle: `Hackathon • ${h.location.district} • ${h.status}`,
          category: "HACKATHONS",
          slug: h.slug,
          url: `/hackathons/${h.slug}`,
        });
      }
    });

    // Search institutions
    MOCK_INSTITUTIONS.forEach((inst) => {
      if (inst.name.toLowerCase().includes(q) || inst.shortCode.toLowerCase().includes(q)) {
        suggestions.push({
          id: inst.id,
          title: `${inst.name} (${inst.shortCode})`,
          subtitle: `${inst.type} • ${inst.district}`,
          category: inst.type === "UNIVERSITY" ? "UNIVERSITIES" : "COLLEGES",
          slug: inst.id,
          url: `/institutions/${inst.id}`,
        });
      }
    });

    // Search companies
    MOCK_COMPANIES.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.technologyAreas.some((t) => t.toLowerCase().includes(q))) {
        suggestions.push({
          id: c.id,
          title: c.name,
          subtitle: `Company • ${c.industry} • ${c.district}`,
          category: "COMPANIES",
          slug: c.id,
          url: `/companies/${c.id}`,
        });
      }
    });

    return {
      success: true,
      data: suggestions.slice(0, 8),
    };
  }

  /**
   * HACKATHON SERVICE
   */
  static async getHackathons(): Promise<ApiResponse<PaginatedResponse<Hackathon>>> {
    await delay(100);
    return {
      success: true,
      data: {
        data: MOCK_HACKATHONS,
        total: MOCK_HACKATHONS.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  static async getHackathonBySlug(slug: string): Promise<ApiResponse<Hackathon>> {
    await delay(100);
    const hack = MOCK_HACKATHONS.find((h) => h.slug === slug || h.id === slug);
    if (!hack) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Hackathon with identifier "${slug}" was not found.` },
      };
    }
    return { success: true, data: hack };
  }

  /**
   * INSTITUTION SERVICE
   */
  static async getInstitutions(filterType?: string): Promise<ApiResponse<PaginatedResponse<Institution>>> {
    await delay(100);
    const filtered = filterType
      ? MOCK_INSTITUTIONS.filter((i) => i.type === filterType)
      : MOCK_INSTITUTIONS;
    return {
      success: true,
      data: {
        data: filtered,
        total: filtered.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  static async getInstitutionById(id: string): Promise<ApiResponse<Institution>> {
    await delay(80);
    const inst = MOCK_INSTITUTIONS.find((i) => i.id === id);
    if (!inst) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Institution "${id}" was not found.` },
      };
    }
    return { success: true, data: inst };
  }

  /**
   * COMPANY SERVICE
   */
  static async getCompanies(): Promise<ApiResponse<PaginatedResponse<Company>>> {
    await delay(80);
    return {
      success: true,
      data: {
        data: MOCK_COMPANIES,
        total: MOCK_COMPANIES.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  static async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    await delay(80);
    const comp = MOCK_COMPANIES.find((c) => c.id === id);
    if (!comp) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Company "${id}" was not found.` },
      };
    }
    return { success: true, data: comp };
  }

  /**
   * COMMUNITIES SERVICE
   */
  static async getCommunities(): Promise<ApiResponse<PaginatedResponse<Community>>> {
    await delay(80);
    return {
      success: true,
      data: {
        data: MOCK_COMMUNITIES,
        total: MOCK_COMMUNITIES.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  /**
   * STUDENT SERVICE
   */
  static async getStudentDashboardData() {
    await delay(100);
    return {
      profile: MOCK_STUDENT_PROFILE,
      registrations: MOCK_STUDENT_REGISTRATIONS,
      teams: MOCK_STUDENT_TEAMS,
      notifications: MOCK_STUDENT_NOTIFICATIONS,
    };
  }

  /**
   * ORGANIZER SERVICE
   */
  static async getOrganizerDashboardData() {
    await delay(100);
    return {
      profile: MOCK_ORGANIZER_PROFILE,
      hackathons: MOCK_HACKATHONS.filter((h) => h.organizer.id === MOCK_ORGANIZER_PROFILE.id || h.organizer.type === "COLLEGE"),
      participants: MOCK_ORGANIZER_PARTICIPANTS,
      teams: MOCK_ORGANIZER_TEAMS,
      announcements: MOCK_ORGANIZER_ANNOUNCEMENTS,
    };
  }

  /**
   * ADMIN SERVICE
   */
  static async getAdminDashboardData() {
    await delay(100);
    return {
      stats: MOCK_ADMIN_STATS,
      verificationRequests: MOCK_VERIFICATION_REQUESTS,
      moderationItems: MOCK_MODERATION_ITEMS,
      auditLogs: MOCK_AUDIT_LOGS,
      dataSources: MOCK_DATA_SOURCES,
      systemHealth: MOCK_SYSTEM_HEALTH,
    };
  }
}
