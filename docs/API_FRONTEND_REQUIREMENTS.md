# Frontend API Integration Requirements & Contracts
**Platform:** Karnataka Hackathon Community & Discovery Portal  
**Target Backend Engineer:** Claude Code / Backend Implementation Team  
**Architecture:** RESTful & Real-Time (SSE / WebSocket) Service Contracts  
**Standard Status Model:** Verification Status (`VERIFIED` | `UNVERIFIED` | `PENDING` | `STALE_NEEDS_UPDATE`)

---

## 1. Universal Search Engine API (`/api/search`)

### Endpoint 1.1: Universal Discovery Query
- **Endpoint:** `POST /api/search`
- **Method:** `POST`
- **Authorization:** `None` (Publicly accessible)
- **Request Body:**
```json
{
  "query": "hackathon near Bengaluru",
  "filters": {
    "category": "ALL", // "ALL" | "HACKATHONS" | "COLLEGES" | "UNIVERSITIES" | "COMPANIES" | "COMMUNITIES"
    "district": "Bengaluru Urban", // Optional Karnataka district name
    "radiusKm": 25, // Optional radius in kilometers
    "userCoords": { // Optional GPS coordinates for Haversine distance computation
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "technologies": ["Generative AI", "Python"],
    "eventFormat": "ALL", // "ALL" | "ONLINE" | "OFFLINE" | "HYBRID"
    "verificationStatus": "ALL", // "ALL" | "VERIFIED" | "PENDING" | "STALE_NEEDS_UPDATE"
    "sortBy": "relevance" // "relevance" | "distance_asc" | "date_asc" | "date_desc" | "deadline_soon"
  },
  "page": 1,
  "pageSize": 10
}
```
- **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "query": "hackathon near Bengaluru",
    "appliedFilters": { ... },
    "totalResults": 48,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "searchDurationMs": 24,
    "results": [
      {
        "id": "hack-kar-ai-summit",
        "title": "Karnataka GenAI Innovation Hackathon 2026",
        "category": "HACKATHONS",
        "categoryLabel": "Hackathon",
        "slug": "karnataka-genai-innovation-hackathon-2026",
        "description": "State-level AI solutions for Karnataka governance and agriculture...",
        "location": {
          "district": "Bengaluru Urban",
          "city": "Bengaluru",
          "address": "BIEC Campus & Virtual",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "distanceKm": 4.2,
        "technologies": ["Python", "PyTorch", "FastAPI"],
        "eventDate": "2026-10-24 to 2026-10-26",
        "registrationDeadline": "2026-10-15T23:59:59Z",
        "registrationStatus": "Registration Open",
        "verificationStatus": "VERIFIED",
        "source": "KDEM Official Gazette Feed",
        "lastUpdated": "2026-09-30T10:00:00Z",
        "metaBadge": "HYBRID",
        "actionUrl": "/hackathons/karnataka-genai-innovation-hackathon-2026"
      }
    ]
  },
  "metadata": {
    "timestamp": "2026-09-30T12:00:00Z",
    "source": "Karnataka Universal Search Cluster",
    "latencyMs": 24
  }
}
```
- **Loading State Representation:** Renders `SearchResultSkeleton` 3-card pulse blocks.
- **Error State Representation:** Renders `ErrorState` with contextual error message and retry hook.

---

### Endpoint 1.2: Search Autocomplete & Suggestions
- **Endpoint:** `GET /api/search/suggestions?q=:query`
- **Method:** `GET`
- **Authorization:** `None`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "s-1",
      "title": "Hackathons in Bengaluru Urban",
      "subtitle": "Trending Karnataka Region",
      "category": "HACKATHONS"
    }
  ]
}
```

---

## 2. Hackathons API (`/api/hackathons`)

### Endpoint 2.1: Get All Hackathons
- **Endpoint:** `GET /api/hackathons`
- **Query Params:** `district`, `status`, `format`, `page`, `pageSize`
- **Authorization:** `None`

### Endpoint 2.2: Get Hackathon By Slug or ID
- **Endpoint:** `GET /api/hackathons/:slug`
- **Authorization:** `None`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "hack-kar-ai-summit",
    "slug": "karnataka-genai-innovation-hackathon-2026",
    "title": "Karnataka GenAI Innovation Hackathon 2026",
    "tagline": "Build state-level AI solutions...",
    "status": "Registration Open",
    "verificationStatus": "VERIFIED",
    "format": "HYBRID",
    "location": { "district": "Bengaluru Urban", ... },
    "problemStatements": [
      {
        "id": "ps-01",
        "title": "Voice-First Agricultural Advisory in Kannada Dialects",
        "category": "Agritech & AI",
        "description": "...",
        "trackPrize": "₹1,50,000 Special Agritech Bounty"
      }
    ],
    "prizes": [
      { "place": "1st Place", "amount": "₹3,50,000", "perks": ["Direct KDEM Seed Grant"] }
    ],
    "schedule": [
      { "id": "s1", "title": "Registrations Close", "date": "2026-10-15", "time": "11:59 PM" }
    ],
    "source": "KDEM Official Gazette Feed",
    "lastUpdated": "2026-09-30T10:00:00Z"
  }
}
```

### Endpoint 2.3: Create Hackathon
- **Endpoint:** `POST /api/hackathons`
- **Authorization:** `Bearer Token` (Role: `ORGANIZER` or `ADMIN`)
- **Payload:** Matches `CreateHackathonInput` (title, tagline, format, district, description, theme, technologies, eligibility, minTeamSize, maxTeamSize, dates, problemStatements, prizes).

---

## 3. Institutions API (`/api/colleges` & `/api/universities`)

- **Endpoints:**
  - `GET /api/institutions` (Query params: `type=COLLEGE|UNIVERSITY`, `district`, `page`)
  - `GET /api/institutions/:id`
- **Authorization:** `None`
- **Payload:** Includes `shortCode`, `universityAffiliation`, `coursesAvailable`, `technologyClubs`, `hackathonsHostedCount`, `verificationStatus`, `source`, `lastUpdated`.

---

## 4. Companies API (`/api/companies`)

- **Endpoints:**
  - `GET /api/companies` (Query params: `industry`, `district`, `page`)
  - `GET /api/companies/:id`
- **Authorization:** `None`
- **Payload:** `name`, `industry`, `district`, `description`, `technologyAreas`, `hackathonsSponsoredCount`, `opportunities` (`type`, `technologies`, `deadline`), `verificationStatus`.

---

## 5. Communities API (`/api/communities`)

- **Endpoints:**
  - `GET /api/communities` (Query params: `district`, `type`)
- **Authorization:** `None`
- **Payload:** `name`, `type`, `district`, `leadName`, `memberCount`, `technologies`, `socialLinks`, `verificationStatus`.

---

## 6. Student Portal API (`/api/students`)

- **Endpoints:**
  - `GET /api/students/profile` (Auth: `Bearer Token`, Role: `STUDENT`)
  - `GET /api/students/registrations`
  - `GET /api/students/teams`
  - `POST /api/students/teams/invite` (Payload: `{ "teamId": string, "inviteeEmailOrUsn": string }`)
  - `GET /api/students/notifications`
  - `POST /api/students/notifications/:id/read`

---

## 7. Organizer Portal API (`/api/organizers`)

- **Endpoints:**
  - `GET /api/organizers/profile` (Auth: `Bearer Token`, Role: `ORGANIZER`)
  - `GET /api/organizers/hackathons`
  - `GET /api/organizers/hackathons/:id/participants`
  - `GET /api/organizers/hackathons/:id/teams`
  - `POST /api/organizers/hackathons/:id/announcements`
  - `POST /api/organizers/teams/:id/score` (Payload: `{ "score": number, "notes": string }`)

---

## 8. Administration API (`/api/admin`)

- **Endpoints:**
  - `GET /api/admin/stats` (Platform counters: students, organizers, colleges, pending verifications, queries/day)
  - `GET /api/admin/verifications`
  - `POST /api/admin/verifications/:id/decision` (Payload: `{ "decision": "VERIFIED" | "REJECTED" | "REQUEST_DOCUMENTS", "notes": string }`)
  - `GET /api/admin/moderation`
  - `POST /api/admin/moderation/:id/resolve`
  - `GET /api/admin/audit-logs`
  - `GET /api/admin/data-sources`
  - `GET /api/admin/system-health`
- **Authorization:** `Bearer Token` (Role: `PLATFORM_ADMIN`)

---

## 9. Real-Time Service Contract (`WebSocket` / `SSE`)

- **Connection URL:** `wss://api.karnatakahackathons.gov.in/v1/realtime` (or SSE `/api/realtime/stream`)
- **Events Dispatched:**
  1. `HACKATHON_CREATED`
  2. `HACKATHON_UPDATED`
  3. `STATUS_CHANGED`
  4. `REGISTRATION_UPDATE`
  5. `ANNOUNCEMENT_PUBLISHED`
  6. `VERIFICATION_UPDATED`
  7. `SYSTEM_HEARTBEAT`
- **Client Protocol:** Handled transparently by `services/realtimeService.ts` and `hooks/useRealtime.ts`.
