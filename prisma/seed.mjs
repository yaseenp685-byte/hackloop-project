import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Karnataka Hackathon Portal database seeding...");

  // 1. Clean existing records in correct foreign key order
  console.log("🧹 Clearing previous demo data...");
  await prisma.auditLog.deleteMany({});
  await prisma.eventOutbox.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.teamInvitation.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.hackathonRegistration.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.scheduleItem.deleteMany({});
  await prisma.prize.deleteMany({});
  await prisma.problemStatement.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.hackathon.deleteMany({});
  await prisma.companyOpportunity.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.community.deleteMany({});
  await prisma.verificationRequest.deleteMany({});
  await prisma.moderationItem.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.organizerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const studentPasswordHash = bcrypt.hashSync("Password@123", 10);
  const organizerPasswordHash = bcrypt.hashSync("Password@123", 10);
  const adminPasswordHash = bcrypt.hashSync("Admin@123", 10);

  // 2. Seed Users & Profiles
  console.log("👤 Seeding authenticated users...");
  const studentUser = await prisma.user.create({
    data: {
      email: "karan.gowda@rvce.edu.in",
      passwordHash: studentPasswordHash,
      name: "Karan Gowda",
      role: "STUDENT",
      phone: "+91 98450 12345",
      studentProfile: {
        create: {
          usnOrRollNo: "1RV22CS088",
          collegeName: "R.V. College of Engineering",
          universityName: "Visvesvaraya Technological University (VTU)",
          district: "Bengaluru Urban",
          graduationYear: 2026,
          degreeBranch: "Computer Science & Engineering",
          skills: JSON.stringify(["Fullstack Web", "Distributed Systems", "Cloud Native", "FastAPI"]),
          technologies: JSON.stringify(["Next.js", "TypeScript", "Python", "PostgreSQL", "Docker", "PyTorch"]),
          interests: JSON.stringify(["GovTech", "Generative AI", "Smart Mobility", "Civic Tech"]),
          githubUrl: "https://github.com/karangowda-karnataka",
          linkedinUrl: "https://linkedin.com/in/karangowda-rvce",
          portfolioUrl: "https://karangowda.dev",
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: "priya.k@pes.edu",
      passwordHash: studentPasswordHash,
      name: "Priya Krishnamurthy",
      role: "STUDENT",
      phone: "+91 98451 54321",
      studentProfile: {
        create: {
          usnOrRollNo: "PES1UG22CS340",
          collegeName: "PES University",
          universityName: "PES University (State Autonomous)",
          district: "Bengaluru Urban",
          graduationYear: 2026,
          degreeBranch: "Artificial Intelligence & Machine Learning",
          skills: JSON.stringify(["Deep Learning", "Computer Vision", "React", "Node.js"]),
          technologies: JSON.stringify(["PyTorch", "TensorFlow", "FastAPI", "React", "TypeScript"]),
          interests: JSON.stringify(["Healthcare AI", "AgriTech", "Local Language LLMs"]),
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  const organizerUser = await prisma.user.create({
    data: {
      email: "sandhya.v@rvce.edu.in",
      passwordHash: organizerPasswordHash,
      name: "Dr. Sandhya V.",
      role: "ORGANIZER",
      phone: "+91 94480 99887",
      organizerProfile: {
        create: {
          organizationName: "RVCE Centre for Innovation & Entrepreneurship",
          organizationType: "COLLEGE",
          designation: "Head of Innovation & Hackathons",
          district: "Bengaluru Urban",
          verificationStatus: "VERIFIED",
        },
      },
    },
    include: { organizerProfile: true },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@karnatakahackathons.gov.in",
      passwordHash: adminPasswordHash,
      name: "Karnataka Portal Administrator",
      role: "ADMIN",
      phone: "+91 80 2200 4455",
    },
  });

  // 3. Seed Colleges and Universities
  console.log("🏫 Seeding Karnataka colleges and universities...");
  const rvce = await prisma.institution.create({
    data: {
      id: "inst-rvce",
      name: "R.V. College of Engineering",
      shortCode: "RVCE",
      type: "COLLEGE",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "Mysore Road",
      address: "Mysore Rd, RV Vidyanikethan Post, Bengaluru, Karnataka 560059",
      latitude: 12.9237,
      longitude: 77.4987,
      universityAffiliation: "Visvesvaraya Technological University (VTU)",
      coursesAvailable: JSON.stringify(["Computer Science", "Information Science", "AI & ML", "Cyber Security", "ECE"]),
      technologyClubs: JSON.stringify([
        { name: "Coding Club RVCE", focus: ["Competitive Programming", "Web Dev"] },
        { name: "Astra Robotics", focus: ["Autonomous Systems", "ROS"] },
        { name: "DSC RVCE", focus: ["Cloud", "Machine Learning"] },
      ]),
      hackathonsHostedCount: 18,
      hackathonsParticipatedCount: 42,
      websiteUrl: "https://www.rvce.edu.in",
      verificationStatus: "VERIFIED",
      source: "Karnataka State Higher Education Council (KSHEC)",
    },
  });

  const pes = await prisma.institution.create({
    data: {
      id: "inst-pes",
      name: "PES University (Ring Road Campus)",
      shortCode: "PESU",
      type: "UNIVERSITY",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "Banashankari 3rd Stage",
      address: "100 Feet Ring Road, BSK III Stage, Bengaluru, Karnataka 560085",
      latitude: 12.9344,
      longitude: 77.5345,
      universityAffiliation: "State Private Autonomous University",
      coursesAvailable: JSON.stringify(["B.Tech CSE", "B.Tech AI & Data Science", "B.Tech ECE", "M.Tech Cloud"]),
      technologyClubs: JSON.stringify([
        { name: "ACM PESU", focus: ["Algorithms", "Hackathons"] },
        { name: "HackerSpace PES", focus: ["Open Source", "Cybersecurity"] },
      ]),
      hackathonsHostedCount: 14,
      hackathonsParticipatedCount: 35,
      websiteUrl: "https://www.pes.edu",
      verificationStatus: "VERIFIED",
      source: "KSHEC Official Register",
    },
  });

  const nitk = await prisma.institution.create({
    data: {
      id: "inst-nitk",
      name: "National Institute of Technology Karnataka, Surathkal",
      shortCode: "NITK",
      type: "COLLEGE",
      district: "Dakshina Kannada",
      city: "Surathkal, Mangaluru",
      locality: "Srinivasnagar",
      address: "NH 66, Srinivasnagar, Surathkal, Mangaluru, Karnataka 575025",
      latitude: 13.0108,
      longitude: 74.7943,
      universityAffiliation: "Institute of National Importance (INI)",
      coursesAvailable: JSON.stringify(["Computer Science", "Information Technology", "AI", "Electronics"]),
      technologyClubs: JSON.stringify([
        { name: "Web Club NITK", focus: ["Full Stack", "Distributed Systems"] },
        { name: "IEEE NITK", focus: ["Hardware", "Edge AI"] },
      ]),
      hackathonsHostedCount: 12,
      hackathonsParticipatedCount: 29,
      websiteUrl: "https://www.nitk.ac.in",
      verificationStatus: "VERIFIED",
      source: "Ministry of Education & KSHEC",
    },
  });

  const uom = await prisma.institution.create({
    data: {
      id: "inst-uom",
      name: "University of Mysore (Manasagangotri)",
      shortCode: "UoM",
      type: "UNIVERSITY",
      district: "Mysuru",
      city: "Mysuru",
      locality: "Manasagangotri",
      address: "Manasagangotri, Mysuru, Karnataka 570006",
      latitude: 12.3052,
      longitude: 76.6206,
      universityAffiliation: "State Public University",
      coursesAvailable: JSON.stringify(["M.Sc Computer Science", "MCA", "Data Analytics", "Information Tech"]),
      technologyClubs: JSON.stringify([
        { name: "Mysuru Open Source Guild", focus: ["Kannada NLP", "Data Science"] },
      ]),
      hackathonsHostedCount: 8,
      hackathonsParticipatedCount: 18,
      websiteUrl: "https://uni-mysore.ac.in",
      verificationStatus: "VERIFIED",
      source: "KSHEC Official Register",
    },
  });

  const kle = await prisma.institution.create({
    data: {
      id: "inst-kletech",
      name: "KLE Technological University (BVB College)",
      shortCode: "KLETECH",
      type: "UNIVERSITY",
      district: "Dharwad",
      city: "Hubballi",
      locality: "Vidyanagar",
      address: "B. V. Bhoomaraddi Campus, Vidyanagar, Hubballi, Karnataka 580031",
      latitude: 15.3647,
      longitude: 75.1240,
      universityAffiliation: "State Autonomous University",
      coursesAvailable: JSON.stringify(["Computer Science", "Automation", "Robotics", "IoT"]),
      technologyClubs: JSON.stringify([
        { name: "KLE MakerSpace", focus: ["IoT", "Hardware Hackathons"] },
      ]),
      hackathonsHostedCount: 9,
      hackathonsParticipatedCount: 22,
      websiteUrl: "https://kletech.ac.in",
      verificationStatus: "VERIFIED",
      source: "KSHEC Official Register",
    },
  });

  // 4. Seed Companies and Opportunities
  console.log("🏢 Seeding technology companies and hackathon sponsors...");
  const phonepe = await prisma.company.create({
    data: {
      id: "comp-phonepe",
      name: "PhonePe Private Limited",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "Bellandur",
      address: "Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
      latitude: 12.9260,
      longitude: 77.6762,
      industry: "FinTech & Digital Payments",
      description: "India's leading digital payments and financial services platform headquartered in Bengaluru.",
      websiteUrl: "https://www.phonepe.com",
      technologyAreas: JSON.stringify(["Distributed Systems", "High-Throughput APIs", "Kafka", "Golang", "Java", "Kubernetes"]),
      hackathonsSponsoredCount: 16,
      hackathonsOrganizedCount: 4,
      verificationStatus: "VERIFIED",
      source: "KDEM Tech Directory",
      opportunities: {
        create: [
          {
            title: "Summer Software Engineering Intern - Core Payments",
            type: "INTERNSHIP",
            location: "Bengaluru Urban (Hybrid)",
            technologies: JSON.stringify(["Java", "Golang", "PostgreSQL", "Kafka"]),
            link: "https://phonepe.com/careers/interns",
          },
          {
            title: "Fullstack Platform Engineer (New Grad 2026)",
            type: "FULL_TIME",
            location: "Bengaluru Urban",
            technologies: JSON.stringify(["React", "TypeScript", "Golang", "Docker"]),
            link: "https://phonepe.com/careers/graduates",
          },
        ],
      },
    },
  });

  const infosys = await prisma.company.create({
    data: {
      id: "comp-infosys",
      name: "Infosys Limited",
      district: "Mysuru",
      city: "Mysuru",
      locality: "Hebbal Electronic City",
      address: "No. 350, Hebbal Electronics City, Hootagalli, Mysuru, Karnataka 570027",
      latitude: 12.3556,
      longitude: 76.5894,
      industry: "AI, Cloud Computing & Digital Transformation",
      description: "Global leader in next-generation digital services and consulting with global education center in Mysuru.",
      websiteUrl: "https://www.infosys.com",
      technologyAreas: JSON.stringify(["Generative AI", "Topaz AI", "Cloud Migration", "Python", "Java", "DevOps"]),
      hackathonsSponsoredCount: 22,
      hackathonsOrganizedCount: 6,
      verificationStatus: "VERIFIED",
      source: "KDEM Mysuru Tech Cluster",
      opportunities: {
        create: [
          {
            title: "Infosys Springboard AI Innovation Fellowship",
            type: "GRANT",
            location: "Mysuru Campus (Hybrid)",
            technologies: JSON.stringify(["PyTorch", "HuggingFace", "Python", "Docker"]),
            link: "https://springboard.infosys.com",
          },
        ],
      },
    },
  });

  const razorpay = await prisma.company.create({
    data: {
      id: "comp-razorpay",
      name: "Razorpay Software Private Limited",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "Koramangala",
      address: "SJR Cyber Linc, Koramangala, Bengaluru, Karnataka 560095",
      latitude: 12.9352,
      longitude: 77.6245,
      industry: "FinTech & Banking Infrastructure",
      description: "Converged payments solution company powering transactions for thousands of Indian businesses.",
      websiteUrl: "https://razorpay.com",
      technologyAreas: JSON.stringify(["Python", "Go", "React", "Kafka", "PostgreSQL", "AWS"]),
      hackathonsSponsoredCount: 11,
      hackathonsOrganizedCount: 3,
      verificationStatus: "VERIFIED",
      source: "KDEM Tech Directory",
      opportunities: {
        create: [
          {
            title: "Backend Engineer Intern - Payments API",
            type: "INTERNSHIP",
            location: "Bengaluru Urban",
            technologies: JSON.stringify(["Go", "Python", "PostgreSQL"]),
            link: "https://razorpay.com/jobs/intern-backend",
          },
        ],
      },
    },
  });

  // 5. Seed Developer Communities
  console.log("👥 Seeding Karnataka developer communities...");
  await prisma.community.create({
    data: {
      id: "comm-bdc",
      name: "Bangalore Dev Community (BDC)",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      leadName: "Anand R. & Kavya Gowda",
      type: "TECH_COMMUNITY",
      technologies: JSON.stringify(["Web3", "Next.js", "AI Agents", "Rust", "Golang"]),
      memberCount: 3400,
      activeEventsCount: 6,
      description: "Karnataka's largest open grassroots software developer community organizing monthly hack nights.",
      socialLinks: JSON.stringify({
        discord: "https://discord.gg/bangaloredevs",
        meetup: "https://meetup.com/bangalore-devs",
        twitter: "https://twitter.com/BangaloreDevs",
      }),
      verificationStatus: "VERIFIED",
      source: "Karnataka Developer Network",
    },
  });

  await prisma.community.create({
    data: {
      id: "comm-foss-karnataka",
      name: "FOSS United Karnataka",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      leadName: "Siddharth Rao",
      type: "STUDENT_CLUB",
      technologies: JSON.stringify(["Python", "Linux", "Open Hardware", "Privacy", "Rust"]),
      memberCount: 1850,
      activeEventsCount: 4,
      description: "Dedicated to fostering Free and Open Source Software (FOSS) adoption across Karnataka colleges.",
      socialLinks: JSON.stringify({
        telegram: "https://t.me/fosskarnataka",
        github: "https://github.com/fossunited-karnataka",
      }),
      verificationStatus: "VERIFIED",
      source: "Karnataka Developer Network",
    },
  });

  await prisma.community.create({
    data: {
      id: "comm-mysuru-devs",
      name: "Mysuru Developers Circle",
      district: "Mysuru",
      city: "Mysuru",
      leadName: "Chethan Kumar",
      type: "TECH_COMMUNITY",
      technologies: JSON.stringify(["Python", "Generative AI", "Mobile Dev", "Cloud"]),
      memberCount: 920,
      activeEventsCount: 3,
      description: "Connecting developers, researchers, and students across Mysuru and Chamrajnagar regions.",
      socialLinks: JSON.stringify({
        meetup: "https://meetup.com/mysuru-devs",
      }),
      verificationStatus: "VERIFIED",
      source: "KDEM Mysuru Chapter",
    },
  });

  await prisma.community.create({
    data: {
      id: "comm-coastal-hackers",
      name: "Coastal Karnataka Tech Alliance",
      district: "Dakshina Kannada",
      city: "Mangaluru",
      leadName: "Ashwin Shenoy",
      type: "TECH_COMMUNITY",
      technologies: JSON.stringify(["FinTech", "IoT", "Cybersecurity", "React", "Rust"]),
      memberCount: 780,
      activeEventsCount: 2,
      description: "Premier builder network for student engineers across Mangaluru, Udupi, and Surathkal.",
      socialLinks: JSON.stringify({
        discord: "https://discord.gg/coastaldevs",
      }),
      verificationStatus: "VERIFIED",
      source: "KDEM Mangaluru Cluster",
    },
  });

  // 6. Seed Hackathons
  console.log("🚀 Seeding Karnataka flagship hackathons...");
  const hackathon1 = await prisma.hackathon.create({
    data: {
      slug: "karnataka-smart-governance-ai-2026",
      title: "Karnataka Smart Governance & AI Hackathon 2026",
      tagline: "Build AI-Powered Civic Infrastructure for 70 Million Karnataka Citizens",
      organizerId: organizerUser.organizerProfile.id,
      organizerName: "RVCE Centre for Innovation & IT/BT Dept Karnataka",
      organizerType: "COLLEGE",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      locality: "Mysore Road",
      address: "RVCE Campus, Mysore Road, Bengaluru, Karnataka 560059",
      latitude: 12.9237,
      longitude: 77.4987,
      format: "HYBRID",
      status: "Registration Open",
      description:
        "The Karnataka Smart Governance Hackathon brings together over 1,500 collegiate developers, AI researchers, and government domain experts to develop high-impact digital solutions for civic administration, water resource management, Kannada language LLM tooling, and urban traffic decongestion.",
      theme: JSON.stringify(["GovTech", "Generative AI", "Smart Mobility", "Civic Tech", "Kannada NLP"]),
      technologies: JSON.stringify(["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "PyTorch", "Docker"]),
      eligibility: "Open to all enrolled undergraduate & postgraduate students from recognized colleges/universities in Karnataka.",
      minTeamSize: 2,
      maxTeamSize: 4,
      registrationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      rules: JSON.stringify([
        "All code must be authored during the 36-hour sprint period.",
        "Use of open-source frameworks and public government APIs is encouraged.",
        "Plagiarism or submission of pre-built commercial solutions results in immediate disqualification.",
        "Every team must submit an executable GitHub repo and a 3-minute video walkthrough.",
      ]),
      featured: true,
      registrationCount: 142,
      viewsCount: 3200,
      bookmarksCount: 65,
      verificationStatus: "VERIFIED",
      source: "Karnataka IT/BT Innovation Council",
      problemStatements: {
        create: [
          {
            title: "Real-Time Bengaluru Traffic Signal Optimization using Edge Vision",
            category: "Smart Mobility",
            description: "Design an intelligent algorithm using traffic camera feeds to dynamically balance junction green times and clear emergency ambulance corridors.",
            sponsorOrCompany: "Karnataka Transport Dept & Bosch",
            deliverables: JSON.stringify(["Working Algorithm/API", "Edge Simulation", "Interactive Dashboard"]),
            trackPrize: "₹75,000 Special Track Award",
          },
          {
            title: "Kannada Dialect Voice Assistant for Rural Citizen Services (Seva Sindhu)",
            category: "Kannada NLP & GovTech",
            description: "Build an accessible, voice-enabled assistant capable of understanding regional Kannada dialects for applying to welfare schemes.",
            sponsorOrCompany: "Centre for e-Governance & PhonePe",
            deliverables: JSON.stringify(["Voice Pipeline", "STT/TTS Adapter", "Seva Sindhu Mock Integration"]),
            trackPrize: "₹75,000 Special Track Award",
          },
        ],
      },
      prizes: {
        create: [
          {
            place: "1st Place (Grand Champion)",
            amount: "₹1,50,000",
            perks: JSON.stringify(["KDEM Incubation Grant", "Fast-track interview at PhonePe", "Direct VTU credits"]),
            description: "Awarded to the most impactful, technically sound, and deployment-ready project.",
          },
          {
            place: "2nd Place (Runner Up)",
            amount: "₹1,00,000",
            perks: JSON.stringify(["Mentorship by Thoughtworks", "Cloud credits worth $5,000"]),
            description: "Awarded to the second best innovation overall.",
          },
          {
            place: "3rd Place (Innovation Award)",
            amount: "₹50,000",
            perks: JSON.stringify(["Hardware maker kits", "Certificate of Merit by IT/BT Minister"]),
            description: "Recognizing outstanding creative engineering.",
          },
        ],
      },
      schedule: {
        create: [
          {
            title: "Registrations & Team Formation Close",
            time: "23:59 IST",
            date: "Day 0",
            sortOrder: 1,
            description: "Final team roster lock on portal.",
          },
          {
            title: "Opening Ceremony & Problem Statement Briefing",
            time: "09:00 IST",
            date: "Day 1",
            sortOrder: 2,
            isCurrent: true,
            description: "Keynote address by Department of Electronics & IT leaders.",
          },
          {
            title: "36-Hour Hackathon Hacking Commences",
            time: "10:30 IST",
            date: "Day 1",
            sortOrder: 3,
            description: "Live mentors check-in round 1.",
          },
          {
            title: "Midway Code Review & Mentor Feedback",
            time: "20:00 IST",
            date: "Day 1",
            sortOrder: 4,
            description: "Constructive architectural evaluations.",
          },
          {
            title: "Final Submissions Freeze",
            time: "12:00 IST",
            date: "Day 2",
            sortOrder: 5,
            description: "Code repos pushed and test builds verified.",
          },
          {
            title: "Jury Demonstrations & Grand Valedictory Ceremony",
            time: "16:00 IST",
            date: "Day 2",
            sortOrder: 6,
            description: "Winners announced with prize distribution.",
          },
        ],
      },
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      slug: "coastal-tech-innovate-mangalore-2026",
      title: "Coastal Karnataka Tech Innovate 2026",
      tagline: "Marine IoT, Fintech and Coastal Eco-Tech Solutions",
      organizerId: organizerUser.organizerProfile.id,
      organizerName: "NITK Surathkal & Mangaluru Innovation Cluster",
      organizerType: "COLLEGE",
      district: "Dakshina Kannada",
      city: "Mangaluru",
      locality: "Surathkal",
      address: "NITK Campus, Srinivasnagar, Surathkal, Mangaluru 575025",
      latitude: 13.0108,
      longitude: 74.7943,
      format: "OFFLINE",
      status: "Registration Closing Soon",
      description: "A high-energy coastal hackathon bringing engineers from Udupi, Mangaluru, Kasaragod, and Bengaluru to build sustainable maritime and fintech tech.",
      theme: JSON.stringify(["Marine Tech", "FinTech", "IoT", "Cybersecurity"]),
      technologies: JSON.stringify(["Go", "Rust", "Embedded C", "React", "Python", "MQTT"]),
      eligibility: "Engineering and Polytechnic students across Karnataka.",
      minTeamSize: 2,
      maxTeamSize: 4,
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      featured: true,
      registrationCount: 88,
      viewsCount: 1950,
      bookmarksCount: 38,
      verificationStatus: "VERIFIED",
      source: "NITK Surathkal Tech Council",
      problemStatements: {
        create: [
          {
            title: "Automated Coastal Water Quality Monitoring Network using LoRaWAN",
            category: "Marine Tech",
            description: "Deploy solar-powered IoT sensor telemetry for real-time salinity and pollutant detection.",
            sponsorOrCompany: "Karnataka State Pollution Control Board",
            trackPrize: "₹50,000",
          },
        ],
      },
      prizes: {
        create: [
          { place: "1st Place", amount: "₹1,00,000", description: "Coastal Grand Trophy + Cash" },
          { place: "2nd Place", amount: "₹60,000", description: "Runner Up Cash Prize" },
        ],
      },
    },
  });

  const hackathon3 = await prisma.hackathon.create({
    data: {
      slug: "mysuru-heritage-civic-sprint-2026",
      title: "Heritage to Cloud: Mysuru Civic Hackathon",
      tagline: "Preserving Cultural Heritage and Tourism through Modern Web & AR Tech",
      organizerId: organizerUser.organizerProfile.id,
      organizerName: "University of Mysore & Mysuru Tech Guild",
      organizerType: "UNIVERSITY",
      district: "Mysuru",
      city: "Mysuru",
      locality: "Manasagangotri",
      address: "Manasagangotri Campus, Mysuru, Karnataka 570006",
      latitude: 12.3052,
      longitude: 76.6206,
      format: "OFFLINE",
      status: "Event Live",
      description: "Developing next-generation augmented reality, geospatial mapping, and smart tourist management tools for Karnataka's heritage capital.",
      theme: JSON.stringify(["AR/VR", "Tourism Tech", "Geospatial", "Cloud Native"]),
      technologies: JSON.stringify(["Three.js", "WebXR", "Next.js", "Python", "GIS"]),
      eligibility: "Open to all university students across India.",
      minTeamSize: 1,
      maxTeamSize: 4,
      registrationDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      featured: false,
      registrationCount: 64,
      viewsCount: 1400,
      bookmarksCount: 22,
      verificationStatus: "VERIFIED",
      source: "University of Mysore IT Board",
    },
  });

  // 7. Seed Team, Registrations, Project Submission and Evaluations
  console.log("🤝 Seeding team formation, registration and project submission...");
  const team = await prisma.team.create({
    data: {
      hackathonId: hackathon1.id,
      name: "Team CodeCauvery",
      description: "AI-driven civic and traffic optimization platform built for Bengaluru Urban.",
      maxMembers: 4,
      inviteCode: "CAUV26",
      status: "SUBMITTED",
      members: {
        create: [
          {
            studentId: studentUser.id,
            role: "LEADER",
            status: "ACTIVE",
          },
          {
            studentId: studentUser2.id,
            role: "MEMBER",
            status: "ACTIVE",
          },
        ],
      },
    },
  });

  await prisma.hackathonRegistration.create({
    data: {
      hackathonId: hackathon1.id,
      studentId: studentUser.id,
      teamId: team.id,
      role: "LEADER",
      ticketNumber: "KAR-AI26-2026-101",
      registrationStatus: "CONFIRMED",
    },
  });

  await prisma.hackathonRegistration.create({
    data: {
      hackathonId: hackathon1.id,
      studentId: studentUser2.id,
      teamId: team.id,
      role: "MEMBER",
      ticketNumber: "KAR-AI26-2026-102",
      registrationStatus: "CONFIRMED",
    },
  });

  const firstProblem = await prisma.problemStatement.findFirst({
    where: { hackathonId: hackathon1.id },
  });

  const submission = await prisma.submission.create({
    data: {
      hackathonId: hackathon1.id,
      teamId: team.id,
      problemStatementId: firstProblem?.id,
      projectTitle: "CauveryFlow: Dynamic Green Wave Ambulance Transit System",
      tagline: "Edge vision and audio siren triangulation for immediate emergency vehicle preemption",
      description:
        "CauveryFlow leverages real-time video feeds and acoustic siren detectors to clear arterial road bottlenecks in Bengaluru Urban 4 minutes before emergency vehicles arrive at traffic junctions.",
      demoUrl: "https://cauveryflow-demo.karnatakahackathons.dev",
      repoUrl: "https://github.com/karangowda-karnataka/cauveryflow-smart-traffic",
      status: "UNDER_REVIEW",
      score: 92.5,
      feedback: "Exceptional architecture with strong integration into real Bengaluru traffic camera protocols.",
      evaluations: {
        create: [
          {
            judgeId: organizerUser.id,
            score: 92.5,
            criteriaBreakdown: JSON.stringify({
              technicalComplexity: 95,
              civicImpact: 92,
              codeQuality: 90,
              presentation: 93,
            }),
            notes: "Outstanding edge computer vision prototype tested with Bangalore City Traffic Police sample footage.",
          },
        ],
      },
    },
  });

  await prisma.announcement.create({
    data: {
      hackathonId: hackathon1.id,
      title: "API Keys for Karnataka Open Data Portal now available",
      content: "All registered teams can now request direct access tokens for the Karnataka State GIS and Transport API sandbox in their dashboard.",
      priority: "HIGH",
      sentToEmail: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      title: "Registration Confirmed: Karnataka Smart Governance Hackathon",
      message: "Your ticket number is KAR-AI26-2026-101. Join the official Discord channel before the opening ceremony.",
      type: "SYSTEM",
      linkUrl: `/hackathons/${hackathon1.slug}`,
    },
  });

  await prisma.bookmark.create({
    data: {
      userId: studentUser.id,
      hackathonId: hackathon1.id,
    },
  });

  // 8. Seed Admin Verification Requests and Moderation Items
  console.log("🛡️ Seeding verification requests and platform audit logs...");
  await prisma.verificationRequest.create({
    data: {
      entityType: "INSTITUTION",
      entityId: rvce.id,
      entityName: "R.V. College of Engineering (Autonomous)",
      submittedBy: "principal@rvce.edu.in",
      documentsProvided: JSON.stringify(["KSHEC_Affiliation_2026.pdf", "VTU_Autonomous_Decree.pdf"]),
      currentStatus: "VERIFIED",
      notes: "Direct accreditation match with KSHEC state records.",
      reviewedBy: adminUser.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.verificationRequest.create({
    data: {
      entityType: "INSTITUTION",
      entityId: kle.id,
      entityName: "KLE Technological University (Hubballi)",
      submittedBy: "registrar@kletech.ac.in",
      documentsProvided: JSON.stringify(["KLETECH_Autonomous_Decree_2026.pdf", "State_Gazette_Notification.pdf"]),
      currentStatus: "PENDING",
      notes: "Pending state-level registry verification by admin.",
    },
  });

  await prisma.moderationItem.create({
    data: {
      itemType: "HACKATHON",
      itemId: hackathon1.id,
      itemTitle: "Karnataka Smart Governance & AI Hackathon 2026",
      reason: "Request to verify external sponsor banner compliance with state e-governance guidelines.",
      reportedBy: "compliance-bot@karnataka.gov.in",
      status: "OPEN",
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "PLATFORM_INITIALIZED",
      performedBy: adminUser.id,
      targetEntity: "SYSTEM",
      targetId: "sys_core",
      ipAddress: "127.0.0.1",
      details: JSON.stringify({
        version: "2.0.0-prod",
        districtsCovered: 31,
        mode: "PRODUCTION_HYBRID",
      }),
    },
  });

  console.log("✅ Karnataka Hackathon Portal database seeding complete!");
  console.log("🔑 Default Test Accounts:");
  console.log("   Student:   karan.gowda@rvce.edu.in  (Password: Password@123)");
  console.log("   Organizer: sandhya.v@rvce.edu.in    (Password: Password@123)");
  console.log("   Admin:     admin@karnatakahackathons.gov.in (Password: Admin@123)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
