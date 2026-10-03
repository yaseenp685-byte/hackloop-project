import { VerificationStatus } from "./common";

export interface AdminPlatformStats {
  totalStudents: number;
  totalOrganizers: number;
  totalHackathons: number;
  activeHackathonsCount: number;
  totalColleges: number;
  totalUniversities: number;
  totalCompanies: number;
  pendingVerificationsCount: number;
  flaggedItemsCount: number;
  dailyActiveSearches: number;
}

export interface VerificationRequestItem {
  id: string;
  entityType: "HACKATHON" | "ORGANIZER" | "INSTITUTION" | "COMPANY" | "STUDENT_LEADER";
  entityId: string;
  entityName: string;
  submittedBy: string;
  submittedAt: string;
  documentsProvided: string[];
  currentStatus: VerificationStatus;
  notes?: string;
}

export interface ModerationItem {
  id: string;
  itemType: "HACKATHON_LISTING" | "ANNOUNCEMENT" | "USER_PROFILE" | "TEAM_NAME";
  itemId: string;
  itemTitle: string;
  reason: string;
  reportedBy: string;
  reportedAt: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  targetEntity: string;
  targetId: string;
  timestamp: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  type: "COLLEGE_PORTAL_SYNC" | "VTU_AFFILIATION_FEED" | "TECH_COMMUNITY_SCRAPER" | "MANUAL_SUBMISSION";
  status: "HEALTHY" | "SYNCING" | "DEGRADED" | "OFFLINE";
  lastSyncTime: string;
  recordsSynced: number;
  frequency: string;
}

export interface SystemHealthMetric {
  service: string;
  status: "OPERATIONAL" | "DEGRADED" | "DOWN";
  latencyMs: number;
  uptimePercentage: number;
}
