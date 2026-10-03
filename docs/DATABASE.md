# Karnataka Hackathon Community & Discovery Portal — Database Architecture & Schema Specification

## 1. Executive Architecture Summary

The **Karnataka Hackathon Community & Discovery Portal** database is engineered to serve as a digital middle layer and discovery search engine across all 31 districts of Karnataka. It connects students, colleges, universities, tech enterprises, grassroots developer communities, hackathon organizers, and state administrators.

The data layer is powered by **Prisma ORM** with a dual target design:
- **Local Development / Sandbox**: High-speed, zero-dependency SQLite (`prisma/schema.prisma` targeting `file:./dev.db`).
- **Production Deployment**: High-concurrency **PostgreSQL** (`prisma/schema.postgresql.prisma`) equipped with native connection pooling, B-tree composite indexing, full-text gin indexes, and foreign key cascades.

---

## 2. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o| STUDENT_PROFILE : "has profile"
    USER ||--o| ORGANIZER_PROFILE : "has profile"
    USER ||--o{ HACKATHON_REGISTRATION : "registers"
    USER ||--o{ TEAM_MEMBER : "participates in"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ BOOKMARK : "saves"
    USER ||--o{ EVALUATION : "judges"

    ORGANIZER_PROFILE ||--o{ HACKATHON : "organizes"

    HACKATHON ||--o{ PROBLEM_STATEMENT : "defines"
    HACKATHON ||--o{ PRIZE : "offers"
    HACKATHON ||--o{ SCHEDULE_ITEM : "schedules"
    HACKATHON ||--o{ HACKATHON_REGISTRATION : "enrolls"
    HACKATHON ||--o{ TEAM : "hosts"
    HACKATHON ||--o{ SUBMISSION : "receives"
    HACKATHON ||--o{ ANNOUNCEMENT : "broadcasts"
    HACKATHON ||--o{ BOOKMARK : "bookmarked by"

    TEAM ||--o{ TEAM_MEMBER : "comprises"
    TEAM ||--o{ TEAM_INVITATION : "issues"
    TEAM ||--o{ SUBMISSION : "delivers"

    SUBMISSION ||--o{ EVALUATION : "evaluated by"
    PROBLEM_STATEMENT ||--o{ SUBMISSION : "addressed by"

    COMPANY ||--o{ COMPANY_OPPORTUNITY : "lists"

    INSTITUTION {
        string id PK
        string name
        string shortCode UK
        string type "COLLEGE | UNIVERSITY"
        string district
        float latitude
        float longitude
        string verificationStatus
    }

    COMPANY {
        string id PK
        string name
        string district
        string industry
        float latitude
        float longitude
        string verificationStatus
    }

    COMMUNITY {
        string id PK
        string name
        string district
        string type
        int memberCount
        string verificationStatus
    }

    EVENT_OUTBOX {
        string id PK
        string eventType
        string entityType
        string entityId
        string scope
        string status
    }

    AUDIT_LOG {
        string id PK
        string action
        string performedBy
        string targetEntity
        string targetId
        datetime timestamp
    }
```

---

## 3. Core Relational Entities & Field Definitions

### 3.1 Identity & User Profiles
| Model | Key Fields | Constraints & Indexes | Rationale |
|---|---|---|---|
| `User` | `id`, `email`, `passwordHash`, `name`, `role`, `isActive` | Unique `email`, Index `role`, `isActive` | Primary authentication anchor supporting bcrypt 12-round hashing. |
| `StudentProfile` | `userId`, `usnOrRollNo`, `collegeName`, `district`, `skills`, `technologies` | Unique `userId`, Index `district`, `verificationStatus` | Stores academic affiliation and verified USN identifier. |
| `OrganizerProfile` | `userId`, `organizationName`, `organizationType`, `district` | Unique `userId`, Index `district`, `organizationType` | Links organizer credentials to authorized institutions or firms. |

### 3.2 Discovery Entities (Institutions, Companies & Communities)
| Model | Key Fields | Constraints & Indexes | Rationale |
|---|---|---|---|
| `Institution` | `id`, `name`, `shortCode`, `type`, `district`, `latitude`, `longitude`, `technologyClubs` | Unique `shortCode`, Index `district`, `type` | Verified academic entities across Karnataka (e.g. RVCE, PES, NITK). |
| `Company` | `id`, `name`, `district`, `industry`, `technologyAreas`, `latitude`, `longitude` | Index `district`, `industry` | Tech ecosystem partners, hiring companies, and hackathon sponsors. |
| `CompanyOpportunity` | `id`, `companyId`, `title`, `type`, `location`, `technologies`, `link` | Index `companyId`, Foreign Key Cascade | Direct internship, full-time, and fellowship opportunities linked to firms. |
| `Community` | `id`, `name`, `type`, `district`, `leadName`, `technologies`, `memberCount` | Index `district`, `type` | Grassroots developer chapters (e.g., Bangalore Dev Community, FOSS United). |

### 3.3 Hackathons & Competitions
| Model | Key Fields | Constraints & Indexes | Rationale |
|---|---|---|---|
| `Hackathon` | `id`, `slug`, `title`, `status`, `format`, `district`, `latitude`, `longitude`, `registrationDeadline` | Unique `slug`, Index `status`, `district`, `format` | Central competition entity with geospatial coordinates for Haversine discovery. |
| `ProblemStatement` | `id`, `hackathonId`, `title`, `category`, `description`, `deliverables`, `trackPrize` | Index `hackathonId`, Cascade Delete | Track-specific real-world problem statements. |
| `Prize` | `id`, `hackathonId`, `place`, `amount`, `perks` | Index `hackathonId`, Cascade Delete | Cash pools, incubation grants, and partner awards. |
| `ScheduleItem` | `id`, `hackathonId`, `title`, `time`, `date`, `sortOrder`, `isCurrent` | Index `hackathonId`, Order `sortOrder` | Timeline items tracking hackathon phases. |

### 3.4 Team Collaboration & Governance
| Model | Key Fields | Constraints & Indexes | Rationale |
|---|---|---|---|
| `Team` | `id`, `hackathonId`, `name`, `inviteCode`, `maxMembers`, `status` | Unique `[hackathonId, name]`, Unique `inviteCode` | Enforces team naming per hackathon and 6-char alphanumeric invite codes. |
| `TeamMember` | `id`, `teamId`, `studentId`, `role`, `status` | Unique `[teamId, studentId]`, Cascade Delete | Prevents duplicate memberships in a team. |
| `TeamInvitation` | `id`, `teamId`, `invitedEmailOrUsn`, `expiresAt`, `status` | Index `teamId`, Index `invitedEmailOrUsn` | Secure email/USN invitations expiring in 7 days. |
| `HackathonRegistration`| `id`, `hackathonId`, `studentId`, `teamId`, `ticketNumber`, `registrationStatus` | Unique `[hackathonId, studentId]`, Unique `ticketNumber` | Guarantees atomic registration and unique `KAR-...` ticket generation. |

### 3.5 Project Submissions & Jury Evaluations
| Model | Key Fields | Constraints & Indexes | Rationale |
|---|---|---|---|
| `Submission` | `id`, `hackathonId`, `teamId`, `projectTitle`, `demoUrl`, `repoUrl`, `score`, `status` | Unique `[hackathonId, teamId]` | Strictly limits each team to one project submission per hackathon. |
| `Evaluation` | `id`, `submissionId`, `judgeId`, `score`, `criteriaBreakdown`, `notes` | Unique `[submissionId, judgeId]` | Prevents a judge from submitting duplicate evaluations; computes weighted average. |

### 3.6 Real-Time, Audit & Trust Engineering
| Model | Key Fields | Constraints & Indexes | Rationale |
|---|---|---|---|
| `EventOutbox` | `id`, `eventType`, `entityType`, `entityId`, `payload`, `scope`, `status` | Index `status`, Index `createdAt` | Transactional outbox pattern guaranteeing zero-loss event dispatch to SSE clients. |
| `VerificationRequest` | `id`, `entityType`, `entityId`, `entityName`, `submittedBy`, `currentStatus` | Index `currentStatus`, Index `entityType` | State administration review queue for official verification badges. |
| `ModerationItem` | `id`, `itemType`, `itemId`, `reason`, `reportedBy`, `status` | Index `status` | Content safety and dispute escalation log. |
| `AuditLog` | `id`, `action`, `performedBy`, `targetEntity`, `targetId`, `timestamp`, `ipAddress` | Index `[targetEntity, targetId]`, Index `timestamp` | Tamper-evident operational audit trail. |

---

## 4. Controlled Lifecycle State Machine

The hackathon lifecycle strictly enforces valid transitions:

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Organizer creates hackathon
    DRAFT --> REVIEW : Submit for state verification
    DRAFT --> Registration_Open : Direct publish (verified organizer)
    REVIEW --> DRAFT : Admin requests edits
    REVIEW --> PUBLISHED : Admin approved
    PUBLISHED --> Registration_Open : Open for students
    Registration_Open --> Registration_Closing_Soon : 3 days to deadline
    Registration_Closing_Soon --> Registration_Closed : Deadline reached
    Registration_Closed --> Event_Live : Hackathon begins
    Event_Live --> Submission_Open : Sprint starts
    Submission_Open --> Submission_Closed : Deadline reached
    Submission_Closed --> Judging : Jury scoring
    Judging --> Results_Published : Final awards
    Results_Published --> COMPLETED : Concluded
    COMPLETED --> ARCHIVED : Historical archive
```

---

## 5. Production PostgreSQL Migration Guide

To switch from local SQLite to production PostgreSQL:

1. Configure connection string in `.env`:
   ```bash
   DATABASE_URL="postgresql://karnataka_user:secure_password@postgres-primary.internal:5432/karnataka_hackathons?schema=public&sslmode=require"
   ```

2. Point Prisma to PostgreSQL schema:
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

3. Generate client & execute migrations:
   ```bash
   npx prisma migrate dev --name init_postgresql_production
   ```

4. Populate realistic Karnataka data:
   ```bash
   node prisma/seed.mjs
   ```
