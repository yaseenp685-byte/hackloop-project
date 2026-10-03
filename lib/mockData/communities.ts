import { Community } from "@/types/community";

/**
 * MOCK DATA - ISOLATED FOR UI DEVELOPMENT ONLY
 * Student clubs and grassroot tech communities across Karnataka.
 * Marked as MOCK_DATA. Will be replaced by Claude Code's real backend API endpoints.
 */
export const MOCK_COMMUNITIES: Community[] = [
  {
    id: "comm-foss-bangalore",
    name: "FOSS United Bengaluru",
    type: "OPEN_SOURCE",
    district: "Bengaluru Urban",
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "Indiranagar / Koramangala",
    },
    leadName: "Kailash Nadh & Team",
    memberCount: 3800,
    description: "A non-profit foundation aiming to promote and strengthen the Free and Open Source Software (FOSS) ecosystem in India and Karnataka.",
    technologies: ["Open Source", "Linux", "Python", "Go", "Rust", "Self-Hosting"],
    activeEventsCount: 4,
    socialLinks: {
      website: "https://fossunited.org/bangalore",
      github: "https://github.com/fossunited",
    },
    verificationStatus: "VERIFIED",
    source: "FOSS United Foundation Registry",
    lastUpdated: "2026-09-29T10:00:00Z",
  },
  {
    id: "comm-gdsc-karnataka",
    name: "Google Developer Groups Karnataka Network",
    type: "TECH_COMMUNITY",
    district: "Bengaluru Urban",
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "MG Road",
    },
    leadName: "Karnataka GDG Leads Council",
    memberCount: 6500,
    description: "Federated community connecting GDG Bengaluru, GDG Mysuru, GDG Hubballi-Dharwad, and GDG Mangaluru for joint student hackathons.",
    technologies: ["Android", "Flutter", "Google Cloud", "TensorFlow", "Firebase", "Web"],
    activeEventsCount: 6,
    socialLinks: {
      website: "https://gdg.community.dev",
    },
    verificationStatus: "VERIFIED",
    source: "Google Developer Community Directory",
    lastUpdated: "2026-09-28T16:00:00Z",
  },
  {
    id: "comm-pydata-mysuru",
    name: "PyData Mysuru",
    type: "TECH_COMMUNITY",
    district: "Mysuru",
    location: {
      latitude: 12.3142,
      longitude: 76.6135,
      district: "Mysuru",
      city: "Mysuru",
      locality: "Saraswathipuram",
    },
    leadName: "Dr. Ananya Rao & SJCE Alumni",
    memberCount: 1250,
    description: "Educational community for developers and data scientists in Mysuru interested in data management, processing, analytics, and data-science.",
    technologies: ["Python", "Pandas", "Scikit-Learn", "Computer Vision", "Polars"],
    activeEventsCount: 2,
    socialLinks: {
      website: "https://pydata.org",
    },
    verificationStatus: "VERIFIED",
    source: "NumFOCUS Verified Community",
    lastUpdated: "2026-09-21T11:00:00Z",
  },
  {
    id: "comm-hubballi-geeks",
    name: "Hubballi-Dharwad Techies Guild",
    type: "HACKATHON_COMMUNITY",
    district: "Dharwad (Hubballi-Dharwad)",
    location: {
      latitude: 15.3647,
      longitude: 75.1240,
      district: "Dharwad (Hubballi-Dharwad)",
      city: "Hubballi",
      locality: "Vidyanagar",
    },
    leadName: "Rohan Kulkarni",
    memberCount: 940,
    description: "Grassroots student community uniting engineering colleges across Belagavi and Hubballi-Dharwad divisions for regional hackathlons.",
    technologies: ["React", "FastAPI", "IoT", "Next.js", "Agritech"],
    activeEventsCount: 3,
    verificationStatus: "VERIFIED",
    source: "North Karnataka Developer Guild",
    lastUpdated: "2026-09-19T14:20:00Z",
  },
];
