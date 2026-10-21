import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HackLoop feature data (Projects, Teams with recruitment, Opportunities)...");

  // Fetch student users
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { studentProfile: true },
  });

  if (students.length === 0) {
    console.log("⚠️ No students found, skipping feature seeding.");
    return;
  }

  const karan = students.find((s) => s.email.includes("karan")) || students[0];
  const priya = students.find((s) => s.email.includes("priya")) || students[Math.min(1, students.length - 1)];

  // Update bios in studentProfile if not set
  if (karan.studentProfile) {
    await prisma.studentProfile.update({
      where: { id: karan.studentProfile.id },
      data: {
        bio: "Passionate full-stack developer & systems enthusiast from RVCE. Building open-source tools for Karnataka's civic infrastructure and high-performance Web apps.",
      },
    });
  }

  if (priya.studentProfile) {
    await prisma.studentProfile.update({
      where: { id: priya.studentProfile.id },
      data: {
        bio: "AI/ML researcher and developer at PES University. Focused on Kannada speech models, computer vision for agriculture, and privacy-preserving healthcare AI.",
      },
    });
  }

  // 1. Seed Projects
  console.log("🚀 Seeding Showcase Projects...");
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.create({
      data: {
        title: "NammaTraffic AI: Smart Corridor Signals",
        tagline: "Computer vision and real-time edge AI to dynamically synchronize Bengaluru traffic junctions.",
        description:
          "NammaTraffic AI utilizes YOLOv8 on roadside camera feeds to count vehicles, estimate queue delays, and adjust green light cycles in real-time. Built specifically for high-congestion corridors like Silk Board and Marathahalli with emergency green-wave routing for ambulances.",
        category: "AI_ML",
        technologies: JSON.stringify(["Python", "YOLOv8", "FastAPI", "React", "TypeScript", "Docker"]),
        repoUrl: "https://github.com/karangowda-karnataka/nammatraffic-ai",
        demoUrl: "https://nammatraffic.demo.hackloop.in",
        authorId: karan.id,
        likesCount: 42,
        viewsCount: 380,
        featured: true,
      },
    });

    await prisma.project.create({
      data: {
        title: "BhashaSetu: Kannada Voice-to-Gov Assistant",
        tagline: "Low-resource Kannada speech-to-text allowing rural citizens to access Karnataka Seva Sindhu services.",
        description:
          "BhashaSetu bridges the digital divide by offering a voice-first conversational interface in rural Kannada dialects. Integrates fine-tuned Whisper models with Karnataka state service knowledge bases to guide farmers and elders through welfare applications step-by-step.",
        category: "AI_ML",
        technologies: JSON.stringify(["PyTorch", "Whisper", "Next.js", "Tailwind CSS", "WebRTC"]),
        repoUrl: "https://github.com/priyak-pes/bhashasetu-kannada",
        demoUrl: "https://bhashasetu.demo.hackloop.in",
        authorId: priya.id,
        likesCount: 56,
        viewsCount: 520,
        featured: true,
      },
    });

    await prisma.project.create({
      data: {
        title: "KrishiNet: Decentralized Agri-Telemetry",
        tagline: "Solar-powered LoRa mesh nodes monitoring soil moisture and canopy temperature across Mandya paddy fields.",
        description:
          "KrishiNet empowers smallholder farmers with hyper-local microclimate alerts, pest risk forecasting, and automated canal valve activation using open LoRaWAN frequencies without relying on expensive cellular plans.",
        category: "IOT",
        technologies: JSON.stringify(["C++", "ESP32", "LoRaWAN", "Go", "InfluxDB", "Grafana"]),
        repoUrl: "https://github.com/karangowda-karnataka/krishinet-telemetry",
        demoUrl: "https://krishinet.demo.hackloop.in",
        authorId: karan.id,
        likesCount: 29,
        viewsCount: 240,
        featured: false,
      },
    });

    await prisma.project.create({
      data: {
        title: "VTU Ledger: Verifiable Student Credentialing",
        tagline: "Zero-knowledge cryptographic verification for university degree transcripts and hackathon certificates.",
        description:
          "VTU Ledger replaces slow paper transcript verifications with W3C Verifiable Credentials. Employers and graduate schools can instantaneously verify student diplomas with zero fraud and full cryptographic privacy.",
        category: "OPEN_SOURCE",
        technologies: JSON.stringify(["Solidity", "TypeScript", "Ethers.js", "Next.js", "Tailwind CSS"]),
        repoUrl: "https://github.com/priyak-pes/vtu-verifiable-credentials",
        demoUrl: "https://vtuledger.demo.hackloop.in",
        authorId: priya.id,
        likesCount: 37,
        viewsCount: 310,
        featured: false,
      },
    });

    console.log("✅ Seeded 4 showcase projects.");
  }

  // 2. Update existing teams or create open recruitment teams
  console.log("👥 Checking teams for Find a Team recruitment...");
  const hackathons = await prisma.hackathon.findMany({ take: 3 });
  if (hackathons.length > 0) {
    const teams = await prisma.team.findMany({ take: 3 });
    if (teams.length > 0) {
      // Update team 1
      await prisma.team.update({
        where: { id: teams[0].id },
        data: {
          projectIdea: "Real-time municipal flood alerting & urban drainage simulation using GIS heatmaps and sensor feeds.",
          requiredRoles: JSON.stringify(["Frontend", "UI/UX"]),
          isOpenForMembers: true,
        },
      });

      if (teams[1]) {
        await prisma.team.update({
          where: { id: teams[1].id },
          data: {
            projectIdea: "Autonomous medical triage assistant with offline multilingual Kannada LLM on edge hardware.",
            requiredRoles: JSON.stringify(["AI/ML", "Backend"]),
            isOpenForMembers: true,
          },
        });
      }
      console.log("✅ Updated existing teams with recruitment requirements.");
    }
  }

  // 3. Seed Verified Opportunities
  console.log("💼 Seeding Opportunities...");
  const companies = await prisma.company.findMany();
  if (companies.length > 0) {
    const comp1 = companies[0];
    const comp2 = companies.length > 1 ? companies[1] : comp1;

    const existingOps = await prisma.companyOpportunity.count();
    if (existingOps < 4) {
      await prisma.companyOpportunity.create({
        data: {
          companyId: comp1.id,
          title: "Karnataka Open Source Fellowship 2026",
          type: "GRANT",
          location: "Bengaluru Urban (Hybrid)",
          technologies: JSON.stringify(["TypeScript", "Rust", "Go", "PostgreSQL"]),
          link: "https://kdem.karnataka.gov.in/fellowships",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      await prisma.companyOpportunity.create({
        data: {
          companyId: comp2.id,
          title: "Winter AI & Machine Learning Research Residency",
          type: "INTERNSHIP",
          location: "Mysuru Tech Cluster",
          technologies: JSON.stringify(["PyTorch", "Python", "Computer Vision", "LLMs"]),
          link: "https://infosys.com/careers/internships",
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
      });

      await prisma.companyOpportunity.create({
        data: {
          companyId: comp1.id,
          title: "National FinTech Grand Challenge 2026",
          type: "CHALLENGE",
          location: "Bengaluru & Online",
          technologies: JSON.stringify(["Distributed Systems", "Kafka", "Cloud Architecture"]),
          link: "https://phonepe.com/tech-challenge",
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        },
      });

      console.log("✅ Seeded opportunities.");
    }
  }

  console.log("🎉 Feature data seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
