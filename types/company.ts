import { VerificationStatus, GeoLocation } from "./common";

export interface CompanyOpportunity {
  id: string;
  title: string;
  type: "INTERNSHIP" | "FULL_TIME" | "GRANT" | "MENTORSHIP" | "CHALLENGE";
  location: string;
  technologies: string[];
  link?: string;
  deadline?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  industry: string;
  district: string;
  location: GeoLocation;
  distanceKm?: number;
  description: string;
  technologyAreas: string[];
  hackathonsSponsoredCount: number;
  hackathonsOrganizedCount: number;
  associatedHackathons: {
    id: string;
    title: string;
    role: "SPONSOR" | "PROBLEM_PARTNER" | "ORGANIZER" | "HIRING_PARTNER";
    year: number;
  }[];
  opportunities: CompanyOpportunity[];
  verificationStatus: VerificationStatus;
  source: string;
  lastUpdated: string;
}
