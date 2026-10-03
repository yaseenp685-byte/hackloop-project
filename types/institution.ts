import { VerificationStatus, GeoLocation } from "./common";

export type InstitutionType = "COLLEGE" | "UNIVERSITY" | "AUTONOMOUS_INSTITUTE";

export interface Institution {
  id: string;
  name: string;
  shortCode: string;
  type: InstitutionType;
  universityAffiliation?: string;
  district: string;
  location: GeoLocation;
  distanceKm?: number;
  establishedYear?: number;
  websiteUrl?: string;
  logoUrl?: string;
  coursesAvailable: string[];
  technologyClubs: {
    name: string;
    focus: string[];
    memberCount?: number;
  }[];
  hackathonsHostedCount: number;
  hackathonsParticipatedCount: number;
  upcomingEvents: {
    id: string;
    title: string;
    date: string;
    format: string;
  }[];
  verificationStatus: VerificationStatus;
  source: string;
  lastUpdated: string;
}
