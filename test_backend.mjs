import { PrismaClient } from "@prisma/client";
import { AuthService } from "./lib/services/auth.service.js";
import { SearchService } from "./lib/services/search.service.js";
import { HackathonService } from "./lib/services/hackathon.service.js";
import { TeamService } from "./lib/services/team.service.js";
import { SubmissionService } from "./lib/services/submission.service.js";
import { InstitutionService } from "./lib/services/institution.service.js";
import { CompanyService } from "./lib/services/company.service.js";
import { CommunityService } from "./lib/services/community.service.js";
import { AdminService } from "./lib/services/admin.service.js";
import { eventBus } from "./lib/events/eventBus.js";
import { verifyToken } from "./lib/auth/jwt.js";

const prisma = new PrismaClient();

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    failedTests++;
    throw new Error(message);
  } else {
    console.log(`  ✅ PASSED: ${message}`);
    passedTests++;
  }
}

async function runTestSuite() {
  console.log("\n========================================================");
  console.log("🧪 STARTING COMPREHENSIVE BACKEND QA & INTEGRATION TESTS");
  console.log("========================================================\n");

  // TEST SUITE 1: AUTHENTICATION & ACCESS CONTROL
  console.log("--- 1. Authentication & Security Primitives ---");
  try {
    // 1.1 Student Login
    const studentAuth = await AuthService.login({
      email: "karan.gowda@rvce.edu.in",
      password: "Password@123",
    });
    assert(Boolean(studentAuth.token), "Student login generates JWT auth token");
    assert(studentAuth.user.role === "STUDENT", "Student user role correctly returned");

    const decoded = verifyToken(studentAuth.token);
    assert(decoded.userId === studentAuth.user.id, "JWT payload contains valid userId");
    assert(decoded.role === "STUDENT", "JWT payload contains correct role");

    // 1.2 Invalid Credentials Rejection
    try {
      await AuthService.login({
        email: "karan.gowda@rvce.edu.in",
        password: "WrongPassword999!",
      });
      assert(false, "Invalid password should throw error");
    } catch (e) {
      assert(e.statusCode === 401, "Invalid password correctly rejected with 401 Unauthorized");
    }

    // 1.3 Organizer Login
    const orgAuth = await AuthService.login({
      email: "sandhya.v@rvce.edu.in",
      password: "Password@123",
    });
    assert(orgAuth.user.role === "ORGANIZER", "Organizer user role correctly validated");

    // 1.4 Admin Login
    const adminAuth = await AuthService.login({
      email: "admin@karnatakahackathons.gov.in",
      password: "Admin@123",
    });
    assert(adminAuth.user.role === "ADMIN", "Admin user role correctly validated");
  } catch (err) {
    console.error("Auth Suite Failed:", err);
  }

  // TEST SUITE 2: DASHBOARDS
  console.log("\n--- 2. Role-Based Dashboards & Data Integrity ---");
  try {
    const student = await prisma.user.findUnique({ where: { email: "karan.gowda@rvce.edu.in" } });
    const studentDash = await AuthService.getStudentDashboard(student.id);
    assert(studentDash.profile.usnOrRollNo === "1RV22CS088", "Student USN loaded accurately");
    assert(studentDash.registrations.length > 0, "Student registrations retrieved");
    assert(studentDash.teams.length > 0, "Student team memberships retrieved");

    const organizer = await prisma.user.findUnique({ where: { email: "sandhya.v@rvce.edu.in" } });
    const organizerDash = await AuthService.getOrganizerDashboard(organizer.id);
    assert(organizerDash.hackathons.length > 0, "Organizer hackathons list populated");
    assert(organizerDash.participants.length > 0, "Organizer participant records aggregated");

    const adminDash = await AuthService.getAdminDashboard();
    assert(adminDash.stats.totalUsers >= 3, "Admin platform stats counted active users");
    assert(adminDash.verificationRequests.length > 0, "Admin pending verifications queue populated");
  } catch (err) {
    console.error("Dashboard Suite Failed:", err);
  }

  // TEST SUITE 3: UNIVERSAL SEARCH ENGINE
  console.log("\n--- 3. Universal Search & Haversine Distance Filters ---");
  try {
    // 3.1 All results search
    const allResults = await SearchService.search({ query: "", filters: { category: "ALL" } });
    assert(allResults.totalResults >= 8, `Universal search returns cross-entity results (Total: ${allResults.totalResults})`);

    // 3.2 Query matching "AI"
    const aiResults = await SearchService.search({ query: "AI" });
    assert(aiResults.totalResults > 0, "Keyword search matches 'AI' across titles, descriptions, and technologies");

    // 3.3 District Filtering: Bengaluru Urban
    const bengaluruResults = await SearchService.search({ filters: { district: "Bengaluru Urban" } });
    const allInBlr = bengaluruResults.results.every((r) => r.location.district === "Bengaluru Urban");
    assert(allInBlr, "District filter correctly restricts results to Bengaluru Urban");

    // 3.4 District Filtering: Mysuru
    const mysuruResults = await SearchService.search({ filters: { district: "Mysuru" } });
    assert(mysuruResults.results.some((r) => r.location.district === "Mysuru"), "District filter finds Mysuru entities");

    // 3.5 Haversine Distance & Radius Filter
    // Point: Bangalore City Centre (12.9716, 77.5946) with 25 km radius
    const nearbyResults = await SearchService.search({
      filters: {
        userCoords: { latitude: 12.9716, longitude: 77.5946 },
        radiusKm: 25,
      },
    });
    assert(nearbyResults.results.length > 0, "Haversine distance calculated for nearby items");
    const allWithinRadius = nearbyResults.results.every((r) => r.distanceKm !== undefined && r.distanceKm <= 25);
    assert(allWithinRadius, "Radius filter strictly excludes entities beyond 25 km");

    // 3.6 Autocomplete Suggestions
    const suggestions = await SearchService.suggestions("RVCE");
    assert(suggestions.length > 0, "Autocomplete suggestions return relevant match for 'RVCE'");
  } catch (err) {
    console.error("Search Suite Failed:", err);
  }

  // TEST SUITE 4: HACKATHON LIFECYCLE & STATE MACHINE
  console.log("\n--- 4. Hackathon Lifecycle & State Machine Transitions ---");
  try {
    const organizer = await prisma.user.findUnique({ where: { email: "sandhya.v@rvce.edu.in" } });
    const admin = await prisma.user.findUnique({ where: { email: "admin@karnatakahackathons.gov.in" } });

    // 4.1 Create new hackathon in DRAFT state
    const newHackathon = await HackathonService.create(organizer.id, {
      title: "Karnataka Green Energy Hackathon 2026",
      tagline: "Clean Tech & Solar Innovation for Rural Karnataka",
      district: "Tumakuru",
      city: "Tumakuru",
      format: "HYBRID",
      description: "Building next-generation smart micro-grid and solar energy telemetry systems.",
      theme: ["CleanTech", "IoT", "Solar"],
      technologies: ["Rust", "Python", "MQTT", "React"],
      eligibility: "Open to all Karnataka engineering students.",
      registrationDeadline: new Date(Date.now() + 10 * 86400000).toISOString(),
      startDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 17 * 86400000).toISOString(),
    });
    assert(newHackathon.status === "DRAFT", "New hackathon initialized in DRAFT state");

    // 4.2 Legal State Transition: DRAFT -> Registration Open
    const updatedStatus = await HackathonService.updateStatus(
      newHackathon.id,
      organizer.id,
      "ORGANIZER",
      "Registration Open"
    );
    assert(updatedStatus.status === "Registration Open", "Legal transition to 'Registration Open' succeeds");

    // 4.3 Illegal State Transition Prevention
    try {
      // From "Registration Open", jump directly to "Results Published" is forbidden
      await HackathonService.updateStatus(
        newHackathon.id,
        organizer.id,
        "ORGANIZER",
        "Results Published"
      );
      assert(false, "Illegal status jump should throw 400 Bad Request");
    } catch (e) {
      assert(e.statusCode === 400, "Illegal status jump correctly blocked by state machine");
    }

    // 4.4 Announcements & Push
    const ann = await HackathonService.createAnnouncement(
      newHackathon.id,
      organizer.id,
      "ORGANIZER",
      {
        title: "Mentorship Sessions Schedule Released",
        content: "Join the clean energy workshop on Saturday at 10 AM.",
        priority: "NORMAL",
        sentToEmail: true,
      }
    );
    assert(ann.title === "Mentorship Sessions Schedule Released", "Announcement created and persisted");
  } catch (err) {
    console.error("Hackathon Lifecycle Suite Failed:", err);
  }

  // TEST SUITE 5: TEAM FORMATION & DUPLICATE RESTRICTION
  console.log("\n--- 5. Team Formation, Invite Codes & Duplicate Guards ---");
  try {
    const student = await prisma.user.findUnique({ where: { email: "karan.gowda@rvce.edu.in" } });
    const hackathon = await prisma.hackathon.findFirst({ where: { status: "Registration Open" } });

    // 5.1 Join Team by Invite Code
    const team = await prisma.team.findFirst({ where: { hackathonId: hackathon.id } });
    assert(team.inviteCode === "CAUV26", "Team invite code verified");

    // 5.2 Capacity & Duplicate Check: Karan is already in Team CodeCauvery
    try {
      await TeamService.joinByCode(student.id, team.inviteCode);
      assert(false, "Duplicate team join should fail");
    } catch (e) {
      assert(e.statusCode === 409, "Duplicate team join correctly rejected with 409 Conflict");
    }

    // 5.3 Team Detail View
    const teamDetails = await TeamService.getTeam(team.id);
    assert(teamDetails.members.length >= 2, "Team member list accurately populated");
    assert(teamDetails.inviteCode === "CAUV26", "Invite code available to team leader");
  } catch (err) {
    console.error("Team Suite Failed:", err);
  }

  // TEST SUITE 6: REAL-TIME EVENT STREAM & OUTBOX
  console.log("\n--- 6. Real-Time Event Bus & Outbox Persistence ---");
  try {
    let capturedEvent = null;
    const testListener = (evt) => {
      capturedEvent = evt;
    };
    eventBus.once("TEST_QA_PING", testListener);

    await eventBus.publish({
      type: "TEST_QA_PING",
      entityType: "SYSTEM",
      entityId: "qa_node_1",
      payload: { ping: "pong", timestamp: Date.now() },
      scope: "PUBLIC",
    });

    assert(capturedEvent !== null, "Real-time event broadcast caught by active event listener");
    assert(capturedEvent.payload.ping === "pong", "Event payload delivered with full fidelity");

    const outboxRecord = await prisma.eventOutbox.findFirst({
      where: { eventType: "TEST_QA_PING" },
      orderBy: { createdAt: "desc" },
    });
    assert(Boolean(outboxRecord), "Event persistently recorded in database EventOutbox table for reliable delivery");
  } catch (err) {
    console.error("Event Bus Suite Failed:", err);
  }

  // TEST SUITE 7: ADMIN AUDIT & HEALTH
  console.log("\n--- 7. Admin Moderation, Verification & Health ---");
  try {
    const admin = await prisma.user.findUnique({ where: { email: "admin@karnatakahackathons.gov.in" } });
    const health = await AdminService.getHealth();
    assert(health.status === "HEALTHY", "Platform health check reports HEALTHY");
    assert(health.components.length >= 3, "Database, EventBus, and Search components monitored");

    const stats = await AdminService.getStats();
    assert(stats.totalHackathons >= 3, "Platform stats aggregate verified hackathons");

    const auditLogs = await AdminService.getAuditLogs(10);
    assert(auditLogs.length > 0, "Audit logs track system security and lifecycle modifications");
  } catch (err) {
    console.error("Admin Suite Failed:", err);
  }

  console.log("\n========================================================");
  console.log(`📊 TEST EXECUTION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("========================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite()
  .catch((e) => {
    console.error("❌ Fatal Test Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
