import {
  OrganizerProfile,
  ParticipantRecord,
  OrganizerTeamRecord,
  OrganizerAnnouncement,
} from "@/types/organizer";

/**
 * MOCK DATA - ISOLATED FOR UI DEVELOPMENT ONLY
 * Represents an authenticated Hackathon Organizer from Karnataka.
 */
export const MOCK_ORGANIZER_PROFILE: OrganizerProfile = {
  id: "org-rvce-coding",
  name: "Dr. Sandhya V.",
  email: "sandhya.v@rvce.edu.in",
  phone: "+91 98450 12345",
  organizationName: "Department of Computer Science & Engg, RVCE",
  organizationType: "COLLEGE",
  designation: "Professor & Faculty Coordinator, 8th Mile Hackathon",
  district: "Bengaluru Urban",
  verificationStatus: "VERIFIED",
};

export const MOCK_ORGANIZER_PARTICIPANTS: ParticipantRecord[] = [
  {
    id: "part-01",
    name: "Karan Gowda",
    email: "karan.gowda@rvce.edu.in",
    college: "R.V. College of Engineering",
    district: "Bengaluru Urban",
    teamName: "RV ByteForce",
    status: "CONFIRMED",
    registeredAt: "2026-09-28T09:30:00Z",
  },
  {
    id: "part-02",
    name: "Ananya Deshpande",
    email: "ananya.d@bmsce.ac.in",
    college: "B.M.S. College of Engineering",
    district: "Bengaluru Urban",
    teamName: "Basavanagudi Neural Squad",
    status: "CONFIRMED",
    registeredAt: "2026-09-27T14:15:00Z",
  },
  {
    id: "part-03",
    name: "Naveen Nayak",
    email: "naveen.n@nitk.edu.in",
    college: "NITK Surathkal",
    district: "Dakshina Kannada (Mangaluru)",
    teamName: "Coastal Cyber Team",
    status: "CONFIRMED",
    registeredAt: "2026-09-26T16:40:00Z",
  },
  {
    id: "part-04",
    name: "Aishwarya Patil",
    email: "aishwarya.p@kletech.ac.in",
    college: "KLE Technological University",
    district: "Dharwad (Hubballi-Dharwad)",
    teamName: "Hubballi Bytes",
    status: "WAITLISTED",
    registeredAt: "2026-09-29T10:00:00Z",
  },
];

export const MOCK_ORGANIZER_TEAMS: OrganizerTeamRecord[] = [
  {
    id: "team-rv-cyber",
    teamName: "RV ByteForce",
    leaderName: "Karan Gowda",
    leaderEmail: "karan.gowda@rvce.edu.in",
    memberCount: 4,
    problemStatement: "Decentralized Electric Vehicle Charging Grid P2P Settlement",
    submissionStatus: "SUBMITTED",
    score: 88,
  },
  {
    id: "team-bms-neural",
    teamName: "Basavanagudi Neural Squad",
    leaderName: "Ananya Deshpande",
    leaderEmail: "ananya.d@bmsce.ac.in",
    memberCount: 4,
    problemStatement: "Decentralized Electric Vehicle Charging Grid P2P Settlement",
    submissionStatus: "EVALUATED",
    score: 92,
  },
  {
    id: "team-coastal",
    teamName: "Coastal Cyber Team",
    leaderName: "Naveen Nayak",
    leaderEmail: "naveen.n@nitk.edu.in",
    memberCount: 3,
    problemStatement: "Decentralized Electric Vehicle Charging Grid P2P Settlement",
    submissionStatus: "PENDING",
  },
];

export const MOCK_ORGANIZER_ANNOUNCEMENTS: OrganizerAnnouncement[] = [
  {
    id: "ann-01",
    hackathonId: "hack-rvce-2026",
    hackathonTitle: "RVCE 8th Mile National Tech Hackathon",
    title: "Registration Closing Reminder - 4 Days Remaining",
    content: "Please ensure all members have submitted their college ID cards for physical campus entry passes.",
    priority: "HIGH",
    publishedAt: "2026-09-30T09:00:00Z",
    sentToEmail: true,
  },
  {
    id: "ann-02",
    hackathonId: "hack-rvce-2026",
    hackathonTitle: "RVCE 8th Mile National Tech Hackathon",
    title: "Hardware Kits Distribution Timetable Released",
    content: "ESP32 kits and CAN-bus adapters can be collected from CSE Seminar Hall on October 18 at 09:30 AM.",
    priority: "NORMAL",
    publishedAt: "2026-09-28T14:00:00Z",
    sentToEmail: false,
  },
];
