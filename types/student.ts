import { Hackathon } from "./hackathon";
import { VerificationStatus } from "./common";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  usnOrRollNo?: string;
  collegeName: string;
  universityName?: string;
  district: string;
  graduationYear: number;
  degreeBranch: string;
  skills: string[];
  technologies: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  verificationStatus: VerificationStatus;
}

export interface StudentRegistration {
  registrationId: string;
  hackathonId: string;
  hackathonTitle: string;
  eventDate: string;
  registrationStatus: "CONFIRMED" | "WAITLISTED" | "ATTENDED" | "CANCELLED";
  teamId?: string;
  teamName?: string;
  userRole: "LEADER" | "MEMBER";
  ticketNumber: string;
  registeredAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  college: string;
  role: "LEADER" | "MEMBER";
  skills: string[];
  status: "ACTIVE" | "PENDING_INVITE";
}

export interface StudentTeam {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  name: string;
  description?: string;
  members: TeamMember[];
  maxMembers: number;
  inviteCode: string;
  submissionId?: string;
  status: "FORMING" | "READY" | "SUBMITTED" | "DISQUALIFIED";
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  hackathonTitle: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

export interface StudentSubmission {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  problemStatementTitle: string;
  projectTitle: string;
  tagline: string;
  demoUrl?: string;
  repoUrl?: string;
  submittedAt: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "FINALIST" | "WINNER" | "PARTICIPANT";
  rank?: string;
  judgeFeedback?: string;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  type: "DEADLINE" | "INVITATION" | "RESULT" | "ANNOUNCEMENT" | "SYSTEM";
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}
