import { VerificationStatus, EventFormat, GeoLocation } from "./common";
import { HackathonLiveStatus, PrizeItem, ProblemStatement } from "./hackathon";

export interface OrganizerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organizationName: string;
  organizationType: "COLLEGE" | "UNIVERSITY" | "COMPANY" | "COMMUNITY" | "GOVERNMENT";
  designation: string;
  district: string;
  verificationStatus: VerificationStatus;
}

export interface OrganizerHackathonStats {
  id: string;
  title: string;
  status: HackathonLiveStatus;
  registrationsCount: number;
  teamsCount: number;
  submissionsCount: number;
  checkedInCount: number;
  daysUntilEvent: number;
}

export interface ParticipantRecord {
  id: string;
  name: string;
  email: string;
  college: string;
  district: string;
  teamName?: string;
  status: "CONFIRMED" | "WAITLISTED" | "CHECKED_IN" | "DISQUALIFIED";
  registeredAt: string;
}

export interface OrganizerTeamRecord {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  memberCount: number;
  problemStatement?: string;
  submissionStatus: "PENDING" | "SUBMITTED" | "EVALUATED";
  score?: number;
}

export interface OrganizerAnnouncement {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  title: string;
  content: string;
  priority: "NORMAL" | "HIGH" | "URGENT";
  publishedAt: string;
  sentToEmail: boolean;
}

export interface CreateHackathonInput {
  title: string;
  tagline: string;
  format: EventFormat;
  district: string;
  venueAddress?: string;
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
  problemStatements: Omit<ProblemStatement, "id">[];
  prizes: PrizeItem[];
}
