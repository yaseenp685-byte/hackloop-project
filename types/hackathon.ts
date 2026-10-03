import { VerificationStatus, EventFormat, GeoLocation } from "./common";

export type HackathonLiveStatus =
  | "Registration Open"
  | "Registration Closing Soon"
  | "Registration Closed"
  | "Event Live"
  | "Submission Open"
  | "Submission Closed"
  | "Judging"
  | "Results Published";

export interface ProblemStatement {
  id: string;
  title: string;
  category: string;
  description: string;
  sponsorOrCompany?: string;
  deliverables?: string[];
  trackPrize?: string;
}

export interface PrizeItem {
  place: string;
  amount: string;
  perks?: string[];
  description?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  date: string;
  description?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface Hackathon {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  organizer: {
    id: string;
    name: string;
    type: "COLLEGE" | "UNIVERSITY" | "COMPANY" | "COMMUNITY" | "GOVERNMENT";
    avatarUrl?: string;
    verified: boolean;
  };
  verificationStatus: VerificationStatus;
  status: HackathonLiveStatus;
  bannerImage?: string;
  format: EventFormat;
  location: GeoLocation;
  distanceKm?: number;
  description: string;
  theme: string[];
  technologies: string[];
  eligibility: string;
  minTeamSize: number;
  maxTeamSize: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  rules: string[];
  problemStatements: ProblemStatement[];
  prizes: PrizeItem[];
  schedule: ScheduleItem[];
  participatingInstitutions: {
    id: string;
    name: string;
    district: string;
    logoUrl?: string;
  }[];
  partnerCompanies?: {
    id: string;
    name: string;
    industry: string;
    logoUrl?: string;
  }[];
  featured: boolean;
  registrationCount: number;
  viewsCount: number;
  bookmarksCount: number;
  source: string;
  lastUpdated: string;
}
