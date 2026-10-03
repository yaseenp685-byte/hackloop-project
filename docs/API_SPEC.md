# Karnataka Hackathon Community & Discovery Portal — Comprehensive API Specification

## 1. Protocol Standards & Envelopes

### 1.1 Base URL & Content Negotiation
- **Base URL**: `/api`
- **Transport**: HTTPS / TLS 1.3
- **Headers**:
  - `Content-Type: application/json` (except SSE streams: `text/event-stream`)
  - `Authorization: Bearer <jwt_token>` (or `auth_token` HTTP-only cookie)

### 1.2 Standard Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestamp": "2026-09-30T18:00:00.000Z",
    "source": "Karnataka Universal Discovery Index",
    "latencyMs": 14
  }
}
```

### 1.3 Standard Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | BAD_REQUEST | INTERNAL_SERVER_ERROR",
    "message": "Human readable error summary",
    "details": { ... }
  }
}
```

---

## 2. Authentication & Session Endpoints

### 2.1 Register User
- **Method**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "student@rvce.edu.in",
  "password": "Password@123",
  "name": "Karan Gowda",
  "role": "STUDENT",
  "phone": "+91 98450 12345",
  "usnOrRollNo": "1RV22CS088",
  "collegeName": "R.V. College of Engineering",
  "universityName": "Visvesvaraya Technological University (VTU)",
  "district": "Bengaluru Urban",
  "graduationYear": 2026,
  "degreeBranch": "Computer Science & Engineering"
}
```
- **Response**: `201 Created` with JWT token in payload and `auth_token` secure cookie.

### 2.2 Login User
- **Method**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "karan.gowda@rvce.edu.in",
  "password": "Password@123"
}
```
- **Response**: `200 OK` with token and user profile object.

### 2.3 Get Current User Session
- **Method**: `GET /api/auth/me`
- **Access**: Authenticated (`STUDENT | ORGANIZER | ADMIN`)
- **Response**: `200 OK` with user details, role, and linked profile.

### 2.4 Logout
- **Method**: `POST /api/auth/logout`
- **Access**: Authenticated
- **Response**: `200 OK`, clears `auth_token` cookie.

---

## 3. Universal Search Engine Endpoints

### 3.1 Unified Multi-Entity Discovery
- **Method**: `GET /api/search` or `POST /api/search`
- **Access**: Public
- **Query / Body Parameters**:
  - `query` / `q` (string): Keyword matching across titles, descriptions, districts, technologies.
  - `filters.category` (string): `"ALL" | "HACKATHONS" | "COLLEGES" | "UNIVERSITIES" | "COMPANIES" | "COMMUNITIES"`
  - `filters.district` (string): Karnataka district name (e.g. `"Bengaluru Urban"`, `"Mysuru"`, `"Dakshina Kannada"`).
  - `filters.radiusKm` (number): Maximum distance radius in kilometers (1 - 500 km).
  - `filters.userCoords` (`{ latitude, longitude }`): User device GPS or selected center coordinates.
  - `filters.technologies` (string[]): Filter by tech stacks (e.g. `["Next.js", "Python", "Rust"]`).
  - `filters.eventFormat` (string): `"ALL" | "ONLINE" | "OFFLINE" | "HYBRID"`.
  - `filters.sortBy` (string): `"relevance" | "distance_asc" | "date_asc" | "date_desc"`.
  - `page` (number, default: 1)
  - `pageSize` (number, default: 10)

- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "query": "AI",
    "appliedFilters": { ... },
    "results": [
      {
        "id": "hackathon-1",
        "title": "Karnataka Smart Governance & AI Hackathon 2026",
        "category": "HACKATHONS",
        "categoryLabel": "Hackathon",
        "slug": "karnataka-smart-governance-ai-2026",
        "description": "...",
        "location": {
          "district": "Bengaluru Urban",
          "city": "Bengaluru",
          "latitude": 12.9237,
          "longitude": 77.4987
        },
        "distanceKm": 4.2,
        "technologies": ["Next.js", "TypeScript", "Python"],
        "eventDate": "2026-10-20 to 2026-10-22",
        "registrationStatus": "Registration Open",
        "verificationStatus": "VERIFIED",
        "source": "Karnataka IT/BT Innovation Council",
        "metaBadge": "HYBRID",
        "actionUrl": "/hackathons/karnataka-smart-governance-ai-2026"
      }
    ],
    "totalResults": 15,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2,
    "searchDurationMs": 12
  }
}
```

### 3.2 Search Suggestions & Autocomplete
- **Method**: `GET /api/search/suggestions?q=RVCE`
- **Access**: Public
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "inst-rvce",
      "title": "R.V. College of Engineering (RVCE)",
      "subtitle": "COLLEGE • Bengaluru Urban",
      "category": "COLLEGES",
      "slug": "inst-rvce",
      "url": "/institutions/inst-rvce"
    }
  ]
}
```

---

## 4. Hackathon Management Endpoints

### 4.1 List Hackathons
- **Method**: `GET /api/hackathons?page=1&district=Bengaluru+Urban&status=Registration+Open`
- **Access**: Public

### 4.2 Get Hackathon by Slug or ID
- **Method**: `GET /api/hackathons/[id]` (supports slug: e.g. `/api/hackathons/karnataka-smart-governance-ai-2026`)
- **Access**: Public
- **Returns**: Complete hackathon document including problem statements, prizes, schedule timeline, and organizer profile.

### 4.3 Create Hackathon
- **Method**: `POST /api/hackathons`
- **Access**: `ORGANIZER | ADMIN`
- **Request Body**: Validated against `CreateHackathonSchema`. Initializes in `"DRAFT"` state.

### 4.4 Transition Hackathon Status (State Machine)
- **Method**: `PATCH /api/hackathons/[id]/status`
- **Access**: Hackathon Owner (`ORGANIZER`) or `ADMIN`
- **Request Body**:
```json
{
  "status": "Registration Open"
}
```
- **Enforcement**: Strictly blocks illegal status skips (e.g. `DRAFT -> RESULTS_PUBLISHED` throws `400 Bad Request`).

### 4.5 Register for Hackathon
- **Method**: `POST /api/hackathons/[id]/register`
- **Access**: Authenticated (`STUDENT`)
- **Response**: Generates unique ticket number (`KAR-AI26-2026-101`) and confirms registration.

### 4.6 Publish Announcement
- **Method**: `POST /api/hackathons/[id]/announcements`
- **Access**: Hackathon Owner (`ORGANIZER`) or `ADMIN`
- **Request Body**:
```json
{
  "title": "Jury Evaluation Timings Announced",
  "content": "Jury rounds will commence at 14:00 IST on Day 2.",
  "priority": "HIGH",
  "sentToEmail": true
}
```

### 4.7 Submit Project
- **Method**: `POST /api/hackathons/[id]/submissions`
- **Access**: Team Member (`STUDENT`)
- **Request Body**:
```json
{
  "teamId": "team-cauvery-1",
  "projectTitle": "CauveryFlow Traffic Optimizer",
  "tagline": "Real-time edge computer vision traffic signal balancer",
  "description": "...",
  "demoUrl": "https://demo.cauveryflow.dev",
  "repoUrl": "https://github.com/cauveryflow/repo"
}
```

---

## 5. Team Formation Endpoints

### 5.1 Create Team
- **Method**: `POST /api/teams`
- **Access**: Authenticated (`STUDENT`)
- **Request Body**:
```json
{
  "hackathonId": "hackathon-1",
  "name": "Team CodeCauvery",
  "description": "AI-driven civic infrastructure platform"
}
```
- **Response**: Generates unique 6-character invite code (e.g. `CAUV26`) and assigns creator as `LEADER`.

### 5.2 Join Team by Invite Code
- **Method**: `POST /api/teams/join`
- **Access**: Authenticated (`STUDENT`)
- **Request Body**:
```json
{
  "inviteCode": "CAUV26"
}
```
- **Validation**:
  - Rejects if team capacity reached (`400 Bad Request`).
  - Rejects if user already in a team for this hackathon (`409 Conflict`).

### 5.3 Get Team Details
- **Method**: `GET /api/teams/[id]`
- **Access**: Public / Authenticated

---

## 6. Dashboards & Administrative Endpoints

| Endpoint | Method | Role Required | Description |
|---|---|---|---|
| `/api/dashboard/student` | `GET` | `STUDENT \| ADMIN` | Returns student academic profile, confirmed registrations, teams, notifications. |
| `/api/dashboard/organizer` | `GET` | `ORGANIZER \| ADMIN` | Returns organizer profile, hosted hackathons, participant records, teams. |
| `/api/admin/stats` | `GET` | `ADMIN` | Aggregated platform counts (users, hackathons, institutions, companies). |
| `/api/admin/verifications` | `GET` | `ADMIN` | Pending KYC and accreditation verification requests. |
| `/api/admin/verifications/[id]` | `PATCH` | `ADMIN` | Approves or rejects verification badge request with audit logging. |
| `/api/admin/moderation` | `GET` | `ADMIN` | Open community reports and content escalations. |
| `/api/admin/moderation/[id]` | `PATCH` | `ADMIN` | Resolves moderation report. |
| `/api/admin/audit-logs` | `GET` | `ADMIN` | Immutable security log entries. |
| `/api/admin/health` | `GET` | Public / `ADMIN` | Database connectivity, latency, outbox queue size, and uptime metrics. |

---

## 7. Real-Time Server-Sent Events (SSE) Stream

### Endpoint: `GET /api/realtime/stream`
- **Protocol**: HTTP/2 or HTTP/1.1 Server-Sent Events (`text/event-stream`)
- **Authorization**: Optional `?token=<jwt>` query param or `auth_token` cookie.
- **Scoping Matrix**:
  - `PUBLIC`: Delivered to all connected clients (e.g., `HACKATHON_CREATED`, `ANNOUNCEMENT_PUBLISHED`).
  - `ROLE_STUDENT`: Delivered to authenticated students (e.g., `REGISTRATION_OPEN`).
  - `ROLE_ORGANIZER`: Delivered to hackathon organizers (e.g., `PROJECT_SUBMITTED`, `REGISTRATION_CREATED`).
  - `ROLE_ADMIN`: Delivered to platform administrators (all events).
  - `USER`: Delivered exclusively to `targetUserId` (e.g., `INVITATION_RECEIVED`, `EVALUATION_RECORDED`).

- **Heartbeat**: Emits `: ping\n\n` comment every 15 seconds to prevent TCP proxy timeouts.
