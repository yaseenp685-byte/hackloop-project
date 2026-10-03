import { prisma } from "@/lib/db";
import { calculateDistanceKm } from "@/lib/utils";
import { SearchFilterState, UnifiedSearchResultItem, SearchResultPayload, SearchSuggestion } from "@/types/search";

export class SearchService {
  static async search(params: {
    query?: string;
    filters?: Partial<SearchFilterState>;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResultPayload> {
    const startTime = Date.now();
    const query = (params.query || "").trim().toLowerCase();
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const filters = params.filters || {};
    const category = filters.category || "ALL";


    const rawResults: UnifiedSearchResultItem[] = [];


    if (category === "ALL" || category === "HACKATHONS") {
      const hackathons = await prisma.hackathon.findMany({
        where: {
          verificationStatus: filters.verificationStatus && filters.verificationStatus !== "ALL"
            ? filters.verificationStatus
            : undefined,
          format: filters.eventFormat && filters.eventFormat !== "ALL"
            ? filters.eventFormat
            : undefined,
        },
      });


      for (const h of hackathons) {
        let distance: number | undefined;
        if (filters.userCoords) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            h.latitude,
            h.longitude
          );
        }


        const technologies: string[] = JSON.parse(h.technologies || "[]");


        rawResults.push({
          id: h.id,
          title: h.title,
          category: "HACKATHONS",
          categoryLabel: "Hackathon",
          slug: h.slug,
          description: h.description,
          location: {
            district: h.district,
            city: h.city || undefined,
            address: h.address || undefined,
            latitude: h.latitude,
            longitude: h.longitude,
          },
          distanceKm: distance,
          technologies,
          eventDate: `${h.startDate.toISOString().slice(0, 10)} to ${h.endDate.toISOString().slice(0, 10)}`,
          registrationDeadline: h.registrationDeadline.toISOString(),
          registrationStatus: h.status,
          verificationStatus: h.verificationStatus as any,
          source: h.source,
          lastUpdated: h.lastUpdated.toISOString(),
          metaBadge: h.format,
          actionUrl: `/hackathons/${h.slug}`,
        });
      }
    }


    if (category === "ALL" || category === "COLLEGES" || category === "UNIVERSITIES") {
      const institutions = await prisma.institution.findMany({
        where: {
          type: category === "COLLEGES"
            ? "COLLEGE"
            : category === "UNIVERSITIES"
            ? "UNIVERSITY"
            : undefined,
          verificationStatus: filters.verificationStatus && filters.verificationStatus !== "ALL"
            ? filters.verificationStatus
            : undefined,
        },
      });


      for (const inst of institutions) {
        let distance: number | undefined;
        if (filters.userCoords) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            inst.latitude,
            inst.longitude
          );
        }


        const techClubs: Array<{ name: string; focus: string[] }> = JSON.parse(inst.technologyClubs || "[]");
        const technologies = techClubs.flatMap((c) => c.focus);
        const isUni = inst.type === "UNIVERSITY";


        rawResults.push({
          id: inst.id,
          title: inst.name,
          category: isUni ? "UNIVERSITIES" : "COLLEGES",
          categoryLabel: isUni ? "University" : "College",
          slug: inst.id,
          description: `${inst.shortCode} • Affiliated to ${inst.universityAffiliation || "Autonomous"}`,
          location: {
            district: inst.district,
            city: inst.city || undefined,
            address: inst.address || undefined,
            latitude: inst.latitude,
            longitude: inst.longitude,
          },
          distanceKm: distance,
          technologies,
          registrationStatus: `${inst.hackathonsHostedCount} Hackathons Hosted`,
          verificationStatus: inst.verificationStatus as any,
          source: inst.source,
          lastUpdated: inst.lastUpdated.toISOString(),
          metaBadge: `${inst.hackathonsHostedCount} Hosted`,
          actionUrl: `/institutions/${inst.id}`,
        });
      }
    }


    if (category === "ALL" || category === "COMPANIES") {
      const companies = await prisma.company.findMany({
        where: {
          verificationStatus: filters.verificationStatus && filters.verificationStatus !== "ALL"
            ? filters.verificationStatus
            : undefined,
        },
        include: { opportunities: true },
      });


      for (const c of companies) {
        let distance: number | undefined;
        if (filters.userCoords) {
          distance = calculateDistanceKm(
            filters.userCoords.latitude,
            filters.userCoords.longitude,
            c.latitude,
            c.longitude
          );
        }


        const technologies: string[] = JSON.parse(c.technologyAreas || "[]");


        rawResults.push({
          id: c.id,
          title: c.name,
          category: "COMPANIES",
          categoryLabel: "Company / Partner",
          slug: c.id,
          description: `${c.industry} • ${c.description.slice(0, 150)}`,
          location: {
            district: c.district,
            city: c.city || undefined,
            address: c.address || undefined,
            latitude: c.latitude,
            longitude: c.longitude,
          },
          distanceKm: distance,
          technologies,
          registrationStatus: `${c.opportunities.length} Open Opportunities`,
          verificationStatus: c.verificationStatus as any,
          source: c.source,
          lastUpdated: c.lastUpdated.toISOString(),
          metaBadge: `${c.hackathonsSponsoredCount} Hackathons Sponsored`,
          actionUrl: `/companies/${c.id}`,
        });
      }
    }


    if (category === "ALL" || category === "COMMUNITIES") {
      const communities = await prisma.community.findMany({
        where: {
          verificationStatus: filters.verificationStatus && filters.verificationStatus !== "ALL"
            ? filters.verificationStatus
            : undefined,
        },
      });


      for (const comm of communities) {
        const technologies: string[] = JSON.parse(comm.technologies || "[]");


        rawResults.push({
          id: comm.id,
          title: comm.name,
          category: "COMMUNITIES",
          categoryLabel: "Community",
          slug: comm.id,
          description: `${comm.leadName} • ${comm.description.slice(0, 150)}`,
          location: {
            district: comm.district,
            city: comm.city || undefined,
          },
          technologies,
          registrationStatus: `${comm.memberCount} Members`,
          verificationStatus: comm.verificationStatus as any,
          source: comm.source,
          lastUpdated: comm.lastUpdated.toISOString(),
          metaBadge: `${comm.activeEventsCount} Active Events`,
          actionUrl: `/communities#${comm.id}`,
        });
      }
    }

    let filtered = rawResults.filter((item) => {
      if (query) {
        const textToMatch = `${item.title} ${item.description} ${item.location.district} ${item.location.city || ""} ${item.technologies.join(" ")}`.toLowerCase();
        const cleanQuery = query.replace(/\bnear\b|\bin\b|\baround\b|\bfindWb/gi, "").trim();
        const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);
        const matchesAllTokens = queryTokens.every((token) => textToMatch.includes(token));
        if (!matchesAllTokens) return false;
      }


      if (filters.district && filters.district !== "ALL") {
        if (!item.location.district.toLowerCase().includes(filters.district.toLowerCase())) {
          return false;
        }
      }


      if (filters.radiusKm) {
        if (item.distanceKm === undefined || item.distanceKm > filters.radiusKm) {
          return false;
        }
      }


      if (filters.technologies && filters.technologies.length > 0) {
        const hasTech = filters.technologies.some((tech) =>
          item.technologies.some((t) => t.toLowerCase() === tech.toLowerCase())
        );
        if (!hasTech) return false;
      }


      return true;
    });


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
      return 0;
    });


    const totalResults = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);


    return {
      query: params.query || "",
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
    };
  }


  static async suggestions(query: string): Promise<SearchSuggestion[]> {
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      return [
        { id: "s-1", title: "Hackathons in Bengaluru Urban", subtitle: "Trending Karnataka Region", category: "HACKATHONS" },
        { id: "s-2", title: "Generative AI Hackathons", subtitle: "Popular Technology", category: "HACKATHONS" },
        { id: "s-3", title: "Colleges in Mysuru", subtitle: "Verified Institutions", category: "COLLEGES" },
        { id: "s-4", title: "NITK-Surathkal HackVerse", subtitle: "Coastal Hackathon", category: "HACKATHONS" },
        { id: "s-5", title: "PhonePe & Thoughtworks Sponsored", subtitle: "Industry Partners", category: "COMPANIES" },
      ];
    }


    const suggestions: SearchSuggestion[] = [];


    const hackathons = await prisma.hackathon.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { technologies: { contains: q } },
        ],
      },
      take: 4,
    });


    for (const h of hackathons) {
      suggestions.push({
        id: h.id,
        title: h.title,
        subtitle: `Hackathon • ${h.district} • ${h.status}`,
        category: "HACKATHONS",
        slug: h.slug,
        url: `/hackathons/${h.slug}`,
      });
    }


    const institutions = await prisma.institution.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { shortCode: { contains: q } },
        ],
      },
      take: 3,
    });


    for (const inst of institutions) {
      suggestions.push({
        id: inst.id,
        title: `${inst.name} (${inst.shortCode})`,
        subtitle: `${inst.type} • ${inst.district}`,
        category: inst.type === "UNIVERSITY" ? "UNIVERSITIES" : "COLLEGES",
        slug: inst.id,
        url: `/institutions/${inst.id}`,
      });
    }


    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { technologyAreas: { contains: q } },
        ],
      },
      take: 3,
    });


    for (const c of companies) {
      suggestions.push({
        id: c.id,
        title: c.name,
        subtitle: `Company • ${c.industry} • ${c.district}`,
        category: "COMPANIES",
        slug: c.id,
        url: `/companies/${c.id}`,
      });
    }


    return suggestions.slice(0, 8);
  }
}
