import {
  AdminPlatformStats,
  VerificationRequestItem,
  ModerationItem,
  AuditLogEntry,
  DataSourceStatus,
  SystemHealthMetric,
} from "@/types/admin";

/**
 * MOCK DATA - ISOLATED FOR UI DEVELOPMENT ONLY
 * Administrative monitoring, verification queue, and platform audit records.
 */
export const MOCK_ADMIN_STATS: AdminPlatformStats = {
  totalStudents: 14280,
  totalOrganizers: 312,
  totalHackathons: 58,
  activeHackathonsCount: 14,
  totalColleges: 218,
  totalUniversities: 34,
  totalCompanies: 86,
  pendingVerificationsCount: 9,
  flaggedItemsCount: 2,
  dailyActiveSearches: 5420,
};

export const MOCK_VERIFICATION_REQUESTS: VerificationRequestItem[] = [
  {
    id: "ver-req-01",
    entityType: "HACKATHON",
    entityId: "hack-community-unverified-07",
    entityName: "Kalyana Karnataka Web3 & Cyber Sprint",
    submittedBy: "Kalaburagi Student Developer Guild",
    submittedAt: "2026-09-28T16:00:00Z",
    documentsProvided: ["Student_Council_Letter.pdf", "Faculty_Advisor_Endorsement.pdf"],
    currentStatus: "PENDING",
    notes: "Requires confirmation from PDA College Dean of Student Affairs.",
  },
  {
    id: "ver-req-02",
    entityType: "INSTITUTION",
    entityId: "inst-pda-kalaburagi-08",
    entityName: "Poojya Doddappa Appa College of Engineering",
    submittedBy: "Prof. S. R. Patil (HOD CSE)",
    submittedAt: "2026-09-25T11:20:00Z",
    documentsProvided: ["AICTE_Approval_2026.pdf", "VTU_Affiliation_Certificate.pdf"],
    currentStatus: "PENDING",
    notes: "AICTE extension of approval submitted, awaiting automatic registry checksum match.",
  },
  {
    id: "ver-req-03",
    entityType: "ORGANIZER",
    entityId: "org-new-challenger",
    entityName: "Mysuru Innovation Collective",
    submittedBy: "Vikram Simha",
    submittedAt: "2026-09-29T18:00:00Z",
    documentsProvided: ["Society_Registration_Karnataka.pdf"],
    currentStatus: "PENDING",
    notes: "District registrar certificate attached.",
  },
  {
    id: "ver-req-04",
    entityType: "HACKATHON",
    entityId: "hack-stale-sample-08",
    entityName: "Bengaluru Urban IoT Challenge (Past Edition)",
    submittedBy: "System Auditor Bot",
    submittedAt: "2026-09-15T00:00:00Z",
    documentsProvided: ["Stale_Data_Trigger_Log.json"],
    currentStatus: "STALE_NEEDS_UPDATE",
    notes: "Listing hasn't been updated for >365 days. Needs organizer re-confirmation or archival.",
  },
];

export const MOCK_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: "mod-01",
    itemType: "HACKATHON_LISTING",
    itemId: "hack-unverified-spam-mock",
    itemTitle: "Crypto Moon Giveaway Hack 2026",
    reason: "Suspicious prize claim without verifiable institutional or corporate sponsor.",
    reportedBy: "Student Moderation Watch",
    reportedAt: "2026-09-30T07:15:00Z",
    status: "OPEN",
  },
  {
    id: "mod-02",
    itemType: "TEAM_NAME",
    itemId: "team-inappropriate-sample",
    itemTitle: "Reported offensive team nickname #99",
    reason: "Breach of community code of conduct.",
    reportedBy: "Automated Lexical Filter",
    reportedAt: "2026-09-29T22:00:00Z",
    status: "RESOLVED",
  },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-101",
    action: "STATUS_VERIFIED",
    performedBy: "admin@karnatakahackathons.gov.in",
    targetEntity: "HACKATHON",
    targetId: "hack-kar-ai-summit",
    timestamp: "2026-09-28T10:14:00Z",
    ipAddress: "14.139.155.10",
    details: { approvedBy: "KDEM Technical Advisory Board" },
  },
  {
    id: "audit-102",
    action: "INSTITUTION_METRICS_SYNCED",
    performedBy: "VTU_Affiliation_Feed_Worker",
    targetEntity: "INSTITUTION",
    targetId: "inst-rvce-01",
    timestamp: "2026-09-29T02:00:00Z",
    ipAddress: "10.0.4.12",
  },
  {
    id: "audit-103",
    action: "ORGANIZER_ROLE_GRANTED",
    performedBy: "admin@karnatakahackathons.gov.in",
    targetEntity: "ORGANIZER",
    targetId: "org-rvce-coding",
    timestamp: "2026-09-25T15:30:00Z",
  },
];

export const MOCK_DATA_SOURCES: DataSourceStatus[] = [
  {
    id: "ds-01",
    name: "Karnataka Higher Education Council (KSHEC) Registry",
    type: "COLLEGE_PORTAL_SYNC",
    status: "HEALTHY",
    lastSyncTime: "2026-09-30T04:00:00Z",
    recordsSynced: 218,
    frequency: "Daily at 04:00 AM",
  },
  {
    id: "ds-02",
    name: "VTU Affiliation & College Code Stream",
    type: "VTU_AFFILIATION_FEED",
    status: "HEALTHY",
    lastSyncTime: "2026-09-30T02:00:00Z",
    recordsSynced: 184,
    frequency: "Daily at 02:00 AM",
  },
  {
    id: "ds-03",
    name: "KDEM Tech Ecosystem Events Feed",
    type: "TECH_COMMUNITY_SCRAPER",
    status: "SYNCING",
    lastSyncTime: "2026-09-30T11:00:00Z",
    recordsSynced: 42,
    frequency: "Every 6 Hours",
  },
  {
    id: "ds-04",
    name: "Autonomous College Manual Registrations",
    type: "MANUAL_SUBMISSION",
    status: "HEALTHY",
    lastSyncTime: "2026-09-30T11:45:00Z",
    recordsSynced: 15,
    frequency: "Real-time moderation queue",
  },
];

export const MOCK_SYSTEM_HEALTH: SystemHealthMetric[] = [
  { service: "Universal Search Indexer (Elastic/Postgres Fulltext)", status: "OPERATIONAL", latencyMs: 24, uptimePercentage: 99.98 },
  { service: "Geo-Proximity Distance Engine", status: "OPERATIONAL", latencyMs: 8, uptimePercentage: 100 },
  { service: "Realtime WebSocket Hub", status: "OPERATIONAL", latencyMs: 14, uptimePercentage: 99.94 },
  { service: "VTU & KSHEC Data Sync Worker", status: "OPERATIONAL", latencyMs: 310, uptimePercentage: 99.85 },
];
