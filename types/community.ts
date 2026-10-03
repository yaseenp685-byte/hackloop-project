import { VerificationStatus, GeoLocation } from "./common";

export type CommunityType = "STUDENT_CLUB" | "TECH_COMMUNITY" | "OPEN_SOURCE" | "HACKATHON_COMMUNITY";

export interface Community {
  id: string;
  name: string;
  type: CommunityType;
  associatedInstitution?: string;
  district: string;
  location: GeoLocation;
  leadName: string;
  memberCount: number;
  description: string;
  technologies: string[];
  activeEventsCount: number;
  socialLinks?: {
    github?: string;
    discord?: string;
    twitter?: string;
    website?: string;
  };
  verificationStatus: VerificationStatus;
  source: string;
  lastUpdated: string;
}
