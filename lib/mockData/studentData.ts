import {
  StudentProfile,
  StudentRegistration,
  StudentTeam,
  TeamInvitation,
  StudentSubmission,
  StudentNotification,
} from "@/types/student";

/**
 * MOCK DATA - ISOLATED FOR UI DEVELOPMENT ONLY
 * Represents an authenticated student user from an engineering college in Karnataka.
 */
export const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: "std-karan-01",
  name: "Karan Gowda",
  email: "karan.gowda@rvce.edu.in",
  usnOrRollNo: "1RV23CS089",
  collegeName: "R.V. College of Engineering",
  universityName: "Visvesvaraya Technological University (VTU)",
  district: "Bengaluru Urban",
  graduationYear: 2027,
  degreeBranch: "B.E. Computer Science & Engineering",
  skills: ["Fullstack Development", "Distributed Systems", "Kannada NLP", "FastAPI"],
  technologies: ["TypeScript", "Next.js", "Python", "Docker", "PostgreSQL", "Tailwind CSS"],
  interests: ["AI Agents", "Civic Tech", "Agritech", "Open Source Software"],
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  portfolioUrl: "https://karan-builds.dev",
  verificationStatus: "VERIFIED",
};

export const MOCK_STUDENT_REGISTRATIONS: StudentRegistration[] = [
  {
    registrationId: "reg-01-kar-ai",
    hackathonId: "hack-kar-ai-summit",
    hackathonTitle: "Karnataka GenAI Innovation Hackathon 2026",
    eventDate: "2026-10-24 to 2026-10-26",
    registrationStatus: "CONFIRMED",
    teamId: "team-kaveri-devs",
    teamName: "Kaveri Coders",
    userRole: "LEADER",
    ticketNumber: "KAR-GENAI-2026-891",
    registeredAt: "2026-09-25T14:10:00Z",
  },
  {
    registrationId: "reg-02-rvce",
    hackathonId: "hack-rvce-2026",
    hackathonTitle: "RVCE 8th Mile National Tech Hackathon",
    eventDate: "2026-10-18 to 2026-10-20",
    registrationStatus: "CONFIRMED",
    teamId: "team-rv-cyber",
    teamName: "RV ByteForce",
    userRole: "MEMBER",
    ticketNumber: "RVCE-8THM-2026-304",
    registeredAt: "2026-09-28T09:30:00Z",
  },
];

export const MOCK_STUDENT_TEAMS: StudentTeam[] = [
  {
    id: "team-kaveri-devs",
    hackathonId: "hack-kar-ai-summit",
    hackathonTitle: "Karnataka GenAI Innovation Hackathon 2026",
    name: "Kaveri Coders",
    description: "Building Voice-First Agricultural Advisory in Kannada Dialects",
    members: [
      { id: "std-karan-01", name: "Karan Gowda", college: "RVCE Bengaluru", role: "LEADER", skills: ["Python", "FastAPI"], status: "ACTIVE" },
      { id: "std-meghana-02", name: "Meghana Rao", college: "BMSCE Bengaluru", role: "MEMBER", skills: ["Next.js", "Tailwind"], status: "ACTIVE" },
      { id: "std-prajwal-03", name: "Prajwal Hegde", college: "NITK Surathkal", role: "MEMBER", skills: ["PyTorch", "NLP"], status: "ACTIVE" },
    ],
    maxMembers: 4,
    inviteCode: "KAVERI-2026",
    status: "READY",
  },
];

export const MOCK_TEAM_INVITATIONS: TeamInvitation[] = [
  {
    id: "inv-01",
    teamId: "team-mysuru-ai",
    teamName: "Chamundi AI Labs",
    hackathonTitle: "Mysuru Heritage & Smart City Tech Sprint",
    invitedBy: "Deepak Bhat (SJCE Mysuru)",
    invitedAt: "2026-09-29T11:00:00Z",
    expiresAt: "2026-10-06T23:59:59Z",
    status: "PENDING",
  },
];

export const MOCK_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub-01",
    hackathonId: "hack-pes-hashcode",
    hackathonTitle: "PES HashCode 2026",
    problemStatementTitle: "Sub-Millisecond Order Matching Engine with Lock-Free Ring Buffers",
    projectTitle: "KaranMatch-Engine-v1",
    tagline: "Ultra-low latency C++20 lock-free ring buffer trading order engine",
    demoUrl: "https://demo.karanmatch.dev",
    repoUrl: "https://github.com/karandev/karanmatch-engine",
    submittedAt: "2026-09-29T21:40:00Z",
    status: "UNDER_REVIEW",
    rank: "Evaluation in progress",
  },
];

export const MOCK_STUDENT_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "notif-01",
    title: "Registration Confirmed!",
    message: "You and Kaveri Coders are confirmed for Karnataka GenAI Innovation Hackathon 2026.",
    type: "SYSTEM",
    read: false,
    createdAt: "2026-09-30T10:00:00Z",
    linkUrl: "/hackathons/karnataka-genai-innovation-hackathon-2026",
  },
  {
    id: "notif-02",
    title: "Pending Team Invitation",
    message: "Deepak Bhat invited you to join Chamundi AI Labs for Mysuru Heritage Tech Sprint.",
    type: "INVITATION",
    read: false,
    createdAt: "2026-09-29T15:20:00Z",
    linkUrl: "/dashboard/student?tab=teams",
  },
  {
    id: "notif-03",
    title: "Deadline Alert: RVCE 8th Mile",
    message: "Registration for RVCE 8th Mile closes in 4 days. Complete team roster verification.",
    type: "DEADLINE",
    read: true,
    createdAt: "2026-09-28T08:00:00Z",
    linkUrl: "/hackathons/rvce-8th-mile-national-tech-hackathon",
  },
];
