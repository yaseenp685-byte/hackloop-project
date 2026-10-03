import { SearchFilterState, SearchResultPayload, SearchSuggestion } from "./search";
import { Hackathon } from "./hackathon";
import { Institution } from "./institution";
import { Company } from "./company";
import { Community } from "./community";
import { StudentProfile, StudentRegistration, StudentTeam, StudentNotification } from "./student";
import { OrganizerProfile, CreateHackathonInput, ParticipantRecord, OrganizerTeamRecord } from "./organizer";
import { AdminPlatformStats, VerificationRequestItem, ModerationItem, AuditLogEntry, DataSourceStatus, SystemHealthMetric } from "./admin";
import { PaginatedResponse, ApiResponse } from "./common";

// Unified API Contract definitions for future Backend Implementation
export interface ApiEndpoints {
  // /api/search
  search(params: { q: string; filters?: Partial<SearchFilterState>; page?: number; pageSize?: number }): Promise<ApiResponse<SearchResultPayload>>;
  getSearchSuggestions(query: string): Promise<ApiResponse<SearchSuggestion[]>>;

  // /api/hackathons
  getHackathons(params?: { district?: string; status?: string; format?: string; page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<Hackathon>>>;
  getHackathonById(id: string): Promise<ApiResponse<Hackathon>>;
  createHackathon(payload: CreateHackathonInput): Promise<ApiResponse<Hackathon>>;
  bookmarkHackathon(id: string): Promise<ApiResponse<{ bookmarked: boolean }>>;

  // /api/colleges & /api/universities
  getInstitutions(params?: { type?: string; district?: string; page?: number }): Promise<ApiResponse<PaginatedResponse<Institution>>>;
  getInstitutionById(id: string): Promise<ApiResponse<Institution>>;

  // /api/companies
  getCompanies(params?: { district?: string; industry?: string; page?: number }): Promise<ApiResponse<PaginatedResponse<Company>>>;
  getCompanyById(id: string): Promise<ApiResponse<Company>>;

  // /api/communities
  getCommunities(params?: { district?: string; type?: string }): Promise<ApiResponse<PaginatedResponse<Community>>>;

  // /api/students
  getStudentProfile(id: string): Promise<ApiResponse<StudentProfile>>;
  getStudentRegistrations(studentId: string): Promise<ApiResponse<StudentRegistration[]>>;
  getStudentTeams(studentId: string): Promise<ApiResponse<StudentTeam[]>>;
  getStudentNotifications(studentId: string): Promise<ApiResponse<StudentNotification[]>>;

  // /api/organizers
  getOrganizerProfile(id: string): Promise<ApiResponse<OrganizerProfile>>;
  getOrganizerHackathons(organizerId: string): Promise<ApiResponse<Hackathon[]>>;
  getHackathonParticipants(hackathonId: string): Promise<ApiResponse<ParticipantRecord[]>>;
  getHackathonTeams(hackathonId: string): Promise<ApiResponse<OrganizerTeamRecord[]>>;

  // /api/admin
  getAdminStats(): Promise<ApiResponse<AdminPlatformStats>>;
  getVerificationRequests(): Promise<ApiResponse<VerificationRequestItem[]>>;
  getModerationItems(): Promise<ApiResponse<ModerationItem[]>>;
  getAuditLogs(): Promise<ApiResponse<AuditLogEntry[]>>;
  getDataSources(): Promise<ApiResponse<DataSourceStatus[]>>;
  getSystemHealth(): Promise<ApiResponse<SystemHealthMetric[]>>;
}
