import { VerificationStatus, EventFormat } from "./common";

export type SearchCategory =
  | "ALL"
  | "HACKATHONS"
  | "COLLEGES"
  | "UNIVERSITIES"
  | "COMPANIES"
  | "COMMUNITIES"
  | "TECHNOLOGIES"
  | "ORGANIZERS";

export type SearchSortOption =
  | "relevance"
  | "date_asc"
  | "date_desc"
  | "distance_asc"
  | "deadline_soon"
  | "popular";

export interface SearchFilterState {
  category: SearchCategory;
  district?: string;
  radiusKm?: number;
  userCoords?: { latitude: number; longitude: number };
  technologies: string[];
  eventFormat?: EventFormat | "ALL";
  verificationStatus?: VerificationStatus | "ALL";
  dateRange?: {
    from?: string;
    to?: string;
  };
  onlyOpenRegistrations?: boolean;
  sortBy: SearchSortOption;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  slug?: string;
  url?: string;
  highlightMatch?: string;
}

export interface UnifiedSearchResultItem {
  id: string;
  title: string;
  category: SearchCategory;
  categoryLabel: string;
  slug: string;
  description: string;
  location: {
    district: string;
    city?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  distanceKm?: number;
  technologies: string[];
  eventDate?: string;
  registrationDeadline?: string;
  registrationStatus?: string;
  verificationStatus: VerificationStatus;
  source: string;
  lastUpdated: string;
  metaBadge?: string;
  actionUrl: string;
}

export interface SearchResultPayload {
  query: string;
  appliedFilters: SearchFilterState;
  results: UnifiedSearchResultItem[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
  searchDurationMs: number;
  nearbySuggestions?: UnifiedSearchResultItem[];
}
