export type VerificationStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "PENDING"
  | "STALE_NEEDS_UPDATE";

export type EventFormat = "ONLINE" | "OFFLINE" | "HYBRID";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  district: string;
  city?: string;
  locality?: string;
  address?: string;
  pincode?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: string;
    source: string;
    cached?: boolean;
    latencyMs?: number;
  };
}
