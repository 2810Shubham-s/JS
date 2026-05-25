/**
 * Phase III — Chapters 7 (System Requirements) & 8 (Implementation & Expected Outcomes)
 */
module.exports = function createPhase3Chapters({
  chapterHeader, h2, h3, para, bullet, numbered, makeTable, tableCaption,
  dividerPara, emptyLine, Paragraph, TextRun, AlignmentType, ShadingType, BLUE, LBLUE, DARK,
  codeBlock,
}) {
  const createExpansions = require('./thesis-expansions');
  const exp = createExpansions({
    para, h2, h3, bullet, numbered, makeTable, tableCaption, emptyLine, codeBlock,
    Paragraph, TextRun, ShadingType, AlignmentType,
  });
  const API_ENDPOINTS = [
    ['POST', '/api/auth/sign-up', 'Public', '—', 'Register user with email, password, role'],
    ['POST', '/api/auth/sign-in', 'Public', '—', 'Login; returns session / bearer token'],
    ['POST', '/api/auth/sign-out', 'Auth', 'All', 'Invalidate current session'],
    ['GET', '/api/auth/session', 'Auth', 'All', 'Return current user and role'],
    ['GET', '/api/volunteers/me', 'Auth', 'Volunteer', 'Own volunteer profile'],
    ['PATCH', '/api/volunteers/me', 'Auth', 'Volunteer', 'Update availability, location, bio'],
    ['POST', '/api/volunteers/qualifications', 'Auth', 'Volunteer', 'Add qualification record'],
    ['GET', '/api/volunteers/nearby', 'Auth', 'Admin', 'Haversine search (internal/SOS)'],
    ['POST', '/api/teams', 'Auth', 'Volunteer', 'Create team'],
    ['GET', '/api/teams', 'Auth', 'Volunteer', 'List teams in district'],
    ['POST', '/api/teams/:id/join', 'Auth', 'Volunteer', 'Join team'],
    ['DELETE', '/api/teams/:id/leave', 'Auth', 'Volunteer', 'Leave team'],
    ['POST', '/api/panic/alert', 'Auth', 'Citizen', 'Trigger SOS with GPS body'],
    ['GET', '/api/panic/status/:id', 'Auth', 'Citizen', 'Poll alert resolution status'],
    ['POST', '/api/issues', 'Auth', 'Citizen', 'Create incident report'],
    ['GET', '/api/issues', 'Auth', 'All', 'List/filter issues by district, status'],
    ['GET', '/api/issues/:id', 'Auth', 'All', 'Issue detail with assignment'],
    ['PATCH', '/api/issues/:id/accept', 'Auth', 'Volunteer', 'Accept issue → ASSIGNED'],
    ['PATCH', '/api/issues/:id/status', 'Auth', 'Volunteer', 'State machine transition'],
    ['POST', '/api/issues/:id/resolve', 'Auth', 'Volunteer', 'Resolve with notes'],
    ['POST', '/api/disasters', 'Auth', 'Admin', 'Declare disaster'],
    ['GET', '/api/disasters', 'Auth', 'All', 'List active disasters'],
    ['PATCH', '/api/disasters/:id', 'Auth', 'Admin', 'Update severity / status'],
    ['POST', '/api/campaigns', 'Auth', 'Citizen', 'Create campaign (pending approval)'],
    ['PATCH', '/api/campaigns/:id/approve', 'Auth', 'Admin', 'Approve or reject'],
    ['POST', '/api/campaigns/:id/donate', 'Auth', 'Citizen', 'Record donation'],
    ['GET', '/api/admin/stats', 'Auth', 'Admin', 'Dashboard aggregates'],
    ['PATCH', '/api/admin/volunteers/:id/verify', 'Auth', 'Admin', 'Verify volunteer profile'],
    ['GET', '/api/health', 'Public', '—', 'Health check for Fly.io'],
    ['GET', '/api/districts', 'Auth', 'All', 'List 38 Bihar districts'],
    ['GET', '/api/notifications', 'Auth', 'All', 'User notification inbox'],
    ['PATCH', '/api/notifications/:id/read', 'Auth', 'All', 'Mark notification read'],
    ['GET', '/api/campaigns', 'Auth', 'All', 'List approved campaigns'],
    ['GET', '/api/campaigns/:id', 'Auth', 'All', 'Campaign detail + donations'],
    ['POST', '/api/campaigns/:id/updates', 'Auth', 'Admin', 'Post campaign utilisation update'],
    ['DELETE', '/api/teams/:id/members/:userId', 'Auth', 'Volunteer', 'Remove team member (leader)'],
    ['POST', '/api/disasters/:id/activate-team', 'Auth', 'Admin', 'Activate team for disaster'],
    ['GET', '/api/issues/:id/timeline', 'Auth', 'All', 'Status change audit timeline'],
    ['PATCH', '/api/issues/:id/escalate', 'Auth', 'Admin', 'Escalate to ESCALATED state'],
    ['POST', '/api/auth/forgot-password', 'Public', '—', 'Send reset email via Resend'],
    ['POST', '/api/auth/reset-password', 'Public', '—', 'Reset with token'],
    ['GET', '/api/volunteers/:id', 'Auth', 'Admin', 'View volunteer detail'],
    ['GET', '/api/admin/issues', 'Auth', 'Admin', 'All issues with filters'],
    ['GET', '/api/admin/audit-logs', 'Auth', 'Admin', 'System audit trail'],
    ['POST', '/api/auth/google', 'Public', '—', 'Google OAuth callback handler'],
    ['PATCH', '/api/campaigns/:id', 'Auth', 'Citizen', 'Update draft campaign'],
    ['GET', '/api/teams/:id', 'Auth', 'Volunteer', 'Team detail with members'],
    ['POST', '/api/issues/:id/photo', 'Auth', 'Citizen', 'Attach photo URL to issue'],
    ['GET', '/api/panic/active', 'Auth', 'Volunteer', 'List active SOS in radius'],
    ['PATCH', '/api/volunteers/me/location', 'Auth', 'Volunteer', 'Update GPS for matching'],
  ];

  const MOBILE_SCREENS = [
    ['Splash / Loading', 'All', 'App bootstrap, token restore from SecureStore'],
    ['Login', 'All', 'Email/password + Google OAuth button'],
    ['Register', 'All', 'Role selection: Citizen or Volunteer'],
    ['Email Verification Pending', 'All', 'Instruction screen after sign-up'],
    ['Citizen Dashboard', 'Citizen', 'SOS button, report issue, my issues, campaigns'],
    ['SOS Panic Alert', 'Citizen', 'GPS capture, optional countdown, submit'],
    ['Report Issue Form', 'Citizen', 'Type, severity, description, location, victims'],
    ['My Issues List', 'Citizen', 'Status badges, tap for detail timeline'],
    ['Issue Detail', 'Citizen', 'Status history, assigned volunteer info'],
    ['Campaign List', 'Citizen', 'Approved campaigns with progress bars'],
    ['Campaign Detail & Donate', 'Citizen', 'Donation form, updates feed'],
    ['Volunteer Dashboard', 'Volunteer', 'Open issues, active assignment, availability toggle'],
    ['Open Issues', 'Volunteer', 'Filter by distance/severity; accept action'],
    ['Active Assignment', 'Volunteer', 'En route / on site / resolve buttons'],
    ['Team Management', 'Volunteer', 'Create/join teams, view members'],
    ['Volunteer Profile', 'Volunteer', 'Qualifications, verification status'],
    ['Admin Dashboard', 'Admin', 'Stats cards, quick actions'],
    ['Declare Disaster', 'Admin', 'District, severity, description'],
    ['Verify Volunteers', 'Admin', 'Pending list, approve/reject'],
    ['Approve Campaigns', 'Admin', 'Pending campaigns queue'],
    ['Notifications', 'All', 'In-app notification inbox'],
    ['Settings', 'All', 'Logout, about, privacy link'],
  ];

  function phase3CoverPage() {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "PATNA UNIVERSITY", font: "Arial", size: 44, bold: true, color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Department of Computer Applications", font: "Arial", size: 26, italic: true, color: DARK })]
      }),
      dividerPara(),
      ...emptyLine(2),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "PROJECT REPORT", font: "Arial", size: 32, bold: true, color: LBLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "(Phase III: Chapters 7 – 8)", font: "Arial", size: 22, italic: true, color: "888888" })]
      }),
      ...emptyLine(2),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Bihar Sahayata", font: "Arial", size: 52, bold: true, color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "System Requirements · Implementation · Expected Outcomes", font: "Arial", size: 24, italic: true, color: DARK })]
      }),
      dividerPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 0 },
        children: [new TextRun({ text: "Shubham Kumar Mishra & Atul Sharma  |  Patna College  |  2025–2026", font: "Arial", size: 22, color: "555555" })]
      }),
    ];
  }

  function phase3TocPage() {
    const entries = [
      ["7", "SYSTEM REQUIREMENTS", false],
      ["7.1", "Hardware Requirements", true],
      ["7.2", "Software Requirements", true],
      ["7.3", "Functional Requirements by Role", true],
      ["7.4", "Non-Functional Requirements", true],
      ["7.5", "API Endpoint Specification", true],
      ["7.6", "Mobile Application Requirements", true],
      ["7.7", "Data and Security Requirements", true],
      ["8", "IMPLEMENTATION & EXPECTED OUTCOMES", false],
      ["8.1", "Implementation Overview", true],
      ["8.2", "Backend Implementation", true],
      ["8.3", "Database and Migration Implementation", true],
      ["8.4", "Mobile Application Implementation", true],
      ["8.5", "Core Feature Implementation", true],
      ["8.6", "Technical Deliverables", true],
      ["8.7", "Social and Operational Impact", true],
      ["8.8", "Limitations and Future Enhancements", true],
    ];
    return [
      ...chapterHeader("", "TABLE OF CONTENTS", "Phase III — Chapters 7 & 8"),
      ...entries.map(([num, title, indent]) => new Paragraph({
        spacing: { before: 80, after: 80 },
        indent: { left: indent ? 400 : 0 },
        children: [
          new TextRun({ text: `${num}  ${title}`, font: "Arial", size: indent ? 20 : 22, bold: !indent, color: indent ? DARK : BLUE }),
        ]
      })),
      dividerPara(),
    ];
  }

  function chapter7() {
    return [
      ...chapterHeader("7", "System Requirements", "Hardware, Software, Functional, and API Specifications"),

      h2("7.1  Hardware Requirements"),
      para("System hardware requirements are specified separately for the development environment (used by the project team during implementation and testing) and the production deployment environment (Fly.io cloud infrastructure hosting the API). End-user hardware requirements for citizens and volunteers accessing the mobile application are also documented, as they directly affect the platform's accessibility assumptions."),
      makeTable(
        ["Component", "Development Environment", "Production (Fly.io)", "End User (Mobile)"],
        [
          ["Processor", "Intel Core i5 (8th Gen+) or AMD Ryzen 5+", "Shared 1 vCPU (auto-scale)", "ARM/x86 mobile SoC, 1.4 GHz quad-core min."],
          ["RAM", "8 GB min.; 16 GB recommended", "256 MB container min.", "2 GB min. for Expo app"],
          ["Storage", "20 GB free (node_modules, emulator)", "3 GB Fly.io volume", "50 MB app install size approx."],
          ["Network", "Broadband 10 Mbps+", "160 GB outbound/month", "2G/3G/4G; SOS on 384 kbps min."],
          ["Display", "1920×1080 for IDE + emulator", "N/A", "480×800 min. screen"],
          ["GPS", "Emulator location simulation", "N/A", "Required for SOS and issue reporting"],
        ],
        [1800, 2520, 2520, 2520]
      ),
      tableCaption("Table 7.1 — Hardware requirements: development, production, and end-user environments"),

      h2("7.2  Software Requirements"),
      para("All software components are open-source or offer free tiers suitable for academic development. Version numbers reflect the stack used during implementation and should be treated as minimum supported versions."),
      makeTable(
        ["Component", "Minimum Version", "Purpose"],
        [
          ["Operating System", "Windows 10/11, macOS 12+, Ubuntu 22.04 LTS", "Development host OS"],
          ["Node.js", "v20 LTS", "API runtime"],
          ["npm", "v10+", "Package management"],
          ["TypeScript", "v5.5", "Backend type safety"],
          ["Docker Desktop", "v4.x", "Container builds"],
          ["Git", "v2.40+", "Version control"],
          ["VS Code", "Latest", "IDE with ESLint, Drizzle extensions"],
          ["Postman", "v10+", "API testing"],
          ["Expo CLI", "via npx", "React Native development"],
          ["Android Studio", "2022.2.1+", "Android emulator SDK 33+"],
          ["Chrome / Firefox", "120+", "Swagger UI at /api/docs"],
        ],
        [2800, 2000, 4560]
      ),
      tableCaption("Table 7.2 — Software requirements and minimum versions"),

      h2("7.3  API Endpoints Summary"),
      para("The REST API exposes fifty endpoints organised into eight resource domains. All protected routes require a valid Bearer token unless noted. The following table documents representative endpoints; the complete OpenAPI specification at /api/docs includes full request/response schemas."),
      makeTable(
        ["Method", "Endpoint", "Auth", "Role", "Description"],
        API_ENDPOINTS,
        [700, 2200, 700, 900, 4860]
      ),
      tableCaption("Table 7.3 — Representative API endpoints (subset of 50 total; see OpenAPI for complete list)"),
      h3("7.3.1  API Response Envelope Standard"),
      para("All API responses follow a consistent JSON envelope to simplify mobile client parsing:"),
      bullet("Success (single resource): { \"data\": { ... } }"),
      bullet("Success (collection): { \"data\": [ ... ], \"pagination\": { \"page\", \"limit\", \"total\" } }"),
      bullet("Error: { \"error\": { \"code\": \"STRING\", \"message\": \"...\", \"details\": [...] } }"),
      bullet("HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict (invalid state transition), 429 Too Many Requests, 500 Internal Server Error."),

      h2("7.4  Functional Requirements by User Role"),
      h3("7.4.1  Citizen Requirements"),
      makeTable(
        ["ID", "Requirement", "Priority"],
        [
          ["FR-C01", "Register and verify email before using protected features", "Must"],
          ["FR-C02", "Trigger SOS panic alert with automatic GPS capture", "Must"],
          ["FR-C03", "Submit structured issue report with type, severity, location", "Must"],
          ["FR-C04", "View real-time status of submitted issues and SOS alerts", "Must"],
          ["FR-C05", "Browse and donate to admin-approved relief campaigns", "Should"],
          ["FR-C06", "Receive in-app notifications on issue status changes", "Should"],
          ["FR-C07", "Sign in via Google OAuth", "Could"],
        ],
        [900, 5960, 2500]
      ),
      tableCaption("Table 7.4 — Functional requirements: Citizen role"),

      h3("7.4.2  Volunteer Requirements"),
      makeTable(
        ["ID", "Requirement", "Priority"],
        [
          ["FR-V01", "Complete profile with location; await admin verification", "Must"],
          ["FR-V02", "Toggle availability status (on-duty / off-duty)", "Must"],
          ["FR-V03", "View and accept open issues in assigned district", "Must"],
          ["FR-V04", "Update issue status through ASSIGNED → EN_ROUTE → ON_SITE → RESOLVED", "Must"],
          ["FR-V05", "Receive notifications for nearby SOS and assigned issues", "Must"],
          ["FR-V06", "Create/join teams; log qualifications", "Should"],
          ["FR-V07", "View personal response history", "Should"],
        ],
        [900, 5960, 2500]
      ),
      tableCaption("Table 7.5 — Functional requirements: Volunteer role"),

      h3("7.4.3  Administrator Requirements"),
      makeTable(
        ["ID", "Requirement", "Priority"],
        [
          ["FR-A01", "Declare official disaster for a district with severity level", "Must"],
          ["FR-A02", "Verify or reject volunteer registration requests", "Must"],
          ["FR-A03", "Approve or reject relief campaigns before public visibility", "Must"],
          ["FR-A04", "View district-level dashboard: active issues, disasters, stats", "Must"],
          ["FR-A05", "Escalate issues and re-assign volunteers", "Must"],
          ["FR-A06", "Activate volunteer teams during declared disasters", "Should"],
          ["FR-A07", "Export audit logs for incident review", "Could"],
        ],
        [900, 5960, 2500]
      ),
      tableCaption("Table 7.6 — Functional requirements: Administrator role"),

      h2("7.5  Non-Functional Requirements"),
      para("Non-functional requirements (NFRs) constrain how the system performs its functions. They are derived from Chapter 3 and validated during testing (Chapter 4, Section 4.7)."),
      makeTable(
        ["Category", "Requirement", "Target Metric"],
        [
          ["Performance", "SOS end-to-end processing", "< 10 seconds on 3G"],
          ["Performance", "API read endpoint P95 latency", "< 500 ms"],
          ["Performance", "Haversine volunteer query", "< 200 ms for 10k volunteers"],
          ["Reliability", "Production API uptime", "> 99.5% monthly"],
          ["Security", "RBAC enforcement", "100% protected routes"],
          ["Security", "Password storage", "bcrypt work factor 12"],
          ["Usability", "SOS accessible from citizen home", "≤ 2 taps"],
          ["Scalability", "Concurrent users (design target)", "500 without schema change"],
          ["Maintainability", "TypeScript strict mode", "Enabled; zero compile errors on build"],
        ],
        [1800, 3800, 3760]
      ),
      tableCaption("Table 7.7 — Non-functional requirements with measurable targets"),

      h2("7.6  Mobile Application Requirements"),
      para("The mobile client comprises twenty screens implemented with Expo Router file-based routing. Each screen is mapped to a user role and functional requirement ID from Section 7.4."),
      makeTable(
        ["Screen", "Role(s)", "Description"],
        MOBILE_SCREENS,
        [2200, 1200, 5960]
      ),
      tableCaption("Table 7.8 — Twenty mobile application screens by role (continued)"),

      h3("7.6.1  Client-Side Technical Requirements"),
      bullet("Minimum OS: Android 10 (API 29), iOS 14."),
      bullet("Permissions: ACCESS_FINE_LOCATION (SOS/issues), INTERNET, POST_NOTIFICATIONS (future FCM)."),
      bullet("Token storage: expo-secure-store only; never AsyncStorage for credentials."),
      bullet("Offline behaviour: display cached data via TanStack Query; queue writes with user feedback when offline (full sync deferred to roadmap)."),

      h2("7.7  Data and Security Requirements"),
      h3("Data Requirements"),
      bullet("All 38 Bihar districts seeded with name, code, centroid latitude/longitude."),
      bullet("Personal data: email, name, phone (volunteers), GPS at incident time only — no continuous background tracking in v1."),
      bullet("Retention: issue and audit records retained minimum 24 months for disaster analysis."),
      bullet("Backup: Neon automatic point-in-time recovery on paid tier; academic project uses daily manual export."),
      h3("Security Requirements"),
      bullet("TLS 1.2+ for all client-server communication."),
      bullet("No secrets in Git repository; Fly.io Secrets for production credentials."),
      bullet("Rate limiting: 100 req/15min general; 20 req/15min on /auth routes per IP."),
      bullet("Input validation on all write endpoints via Zod before database access."),
      ...exp.chapter7Extra(),
    ];
  }

  function chapter8() {
    return [
      ...chapterHeader("8", "Expected Outcomes", "Technical Deliverables, Implementation Summary, and Social Impact"),

      h2("8.1  Implementation Overview"),
      para("The Bihar Sahayata platform was implemented over a ten-sprint Agile cycle (Chapter 4) by a two-developer team. Implementation followed a strict bottom-up order: database schema and migrations first, then authentication, then core API domains, then mobile screens integrated via TanStack Query. This section documents how each architectural component described in Chapters 5 and 6 was realised in working code."),
      para("The repository is organised as a monorepo-style structure with two primary packages: /server (Node.js API) and /mobile (Expo React Native app). Shared TypeScript types for API responses are duplicated manually between packages (future improvement: shared npm workspace package)."),
      makeTable(
        ["Layer", "Directory", "Key Files"],
        [
          ["API Entry", "server/src/", "app.ts, index.ts, routes/index.ts"],
          ["Auth", "server/src/auth/", "better-auth.config.ts, middleware/rbac.ts"],
          ["Database", "server/src/db/", "schema.ts, migrate.ts, seed/districts.ts"],
          ["Services", "server/src/services/", "panic.service.ts, issue.service.ts, geo.service.ts"],
          ["Mobile", "mobile/app/", "Expo Router screens (app/(tabs)/, app/(auth)/)"],
          ["Mobile API", "mobile/lib/", "api.ts (Axios), auth-store.ts, query-client.ts"],
        ],
        [1400, 2800, 5160]
      ),
      tableCaption("Table 8.1 — Project directory structure overview"),

      h2("8.2  Backend Implementation"),
      h3("8.2.1  Express Application Bootstrap"),
      para("The Express application (app.ts) registers middleware in security-critical order: helmet() → cors(corsOptions) → express.json({ limit: '100kb' }) → rateLimiter → betterAuthHandler → apiRouter. The JSON body size limit prevents large payload denial-of-service attacks while accommodating issue descriptions and base64 image placeholders."),
      h3("8.2.2  Role-Based Access Control Middleware"),
      para("The requireRole(...roles) middleware factory reads the authenticated session from Better Auth, loads the user's role from the database, and compares against the allowed roles for the route. Example usage: router.post('/disasters', requireRole('admin'), declareDisasterController). A 403 response includes error code INSUFFICIENT_PERMISSIONS without leaking whether the resource exists."),
      h3("8.2.3  Haversine Service Implementation"),
      para("The geo.service.ts module exports findNearbyVolunteers(lat, lng, radiusKm) which executes a parameterised Drizzle sql template invoking the Haversine formula in PostgreSQL. The query filters is_verified = true AND is_available = true before distance calculation to minimise rows evaluated. Results are ordered by distance ascending and limited to 50 volunteers per SOS event to prevent notification storms."),
      new Paragraph({
        spacing: { before: 160, after: 160 },
        shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
        children: [new TextRun({
          text: "// Simplified Haversine query pattern (geo.service.ts)\nconst volunteers = await db.select().from(volunteerProfile)\n  .where(and(eq(isVerified, true), eq(isAvailable, true)))\n  .having(sql`distance_km <= ${radiusKm}`)\n  .orderBy(sql`distance_km ASC`).limit(50);",
          font: "Courier New", size: 18, color: "333333"
        })]
      }),
      tableCaption("Figure 8.1 — Simplified Haversine volunteer query pattern (conceptual)"),

      h3("8.2.4  Issue State Machine Implementation"),
      para("The issue.service.ts updateStatus(issueId, volunteerId, newStatus) function loads the current issue, validates the requested transition against a TRANSITIONS map (Record<Status, Status[]>), and throws ConflictError if invalid. Valid transitions match Table 4.8 in Chapter 4. Each successful transition inserts a timestamp column (assignedAt, enRouteAt, onSiteAt, resolvedAt) and triggers a notification row for the reporting citizen."),

      h2("8.3  Database and Migration Implementation"),
      para("Database schema is defined in schema.ts using Drizzle's pgTable, pgEnum, and relations API. Migrations are generated via npx drizzle-kit generate and applied with drizzle-kit push to Neon. The seed script seed/districts.ts inserts all 38 Bihar districts from a static JSON array derived from Census 2011 administrative data with centroid coordinates verified against OpenStreetMap."),
      bullet("Enums: userRoleEnum, issueStatusEnum, severityEnum, teamTypeEnum, campaignStatusEnum."),
      bullet("Foreign keys: ON DELETE RESTRICT on issue and campaign parents; CASCADE on session when user deleted (soft-delete preferred)."),
      bullet("Indexes: created in migration SQL files idx_volunteer_geo, idx_issue_district_status."),

      h2("8.4  Mobile Application Implementation"),
      h3("8.4.1  Navigation Structure"),
      para("Expo Router uses file-system routing: app/(auth)/login.tsx, app/(citizen)/index.tsx, app/(volunteer)/index.tsx, app/(admin)/index.tsx. Role-based redirect after login reads user.role from GET /api/auth/session and navigates to the appropriate layout group. Unverified volunteers are routed to a pending-verification screen blocking SOS acceptance features."),
      h3("8.4.2  State Management"),
      para("TanStack Query manages all server state with query keys organised by domain: ['issues', filters], ['campaigns'], ['volunteer', 'me']. Mutations invalidate related queries on success — e.g., acceptIssue mutation invalidates ['issues'] and ['issues', id]. Authentication tokens are stored in expo-secure-store and attached via Axios request interceptor."),
      h3("8.4.3  SOS Screen Implementation"),
      para("The SOS screen requests foreground location permission via expo-location getCurrentPositionAsync with accuracy: Location.Accuracy.High. On submit, it POSTs to /api/panic/alert with { latitude, longitude } and displays a polling UI calling GET /api/panic/status/:id every 5 seconds until status is RESOLVED or ESCALATED. A cancel option is available only before countdown expiry if countdown feature is enabled."),

      h2("8.5  Authentication Implementation"),
      para("Better Auth is configured in better-auth.config.ts with emailAndPassword enabled, google provider, and drizzleAdapter pointing to the PostgreSQL connection. Email verification sends via Resend template with a link to /api/auth/verify-email?token=.... Mobile clients store the session token from sign-in response in SecureStore under key bihar_sahayata_token and attach it as Authorization: Bearer <token> on subsequent requests."),
      numbered("User submits credentials on Login screen."),
      numbered("Axios POST /api/auth/sign-in returns user object and session token."),
      numbered("Token persisted to SecureStore; auth-store Zustand slice set isAuthenticated: true."),
      numbered("Expo Router redirects to role-specific layout based on user.role."),
      numbered("On 401 response, interceptor clears SecureStore and navigates to Login."),

      h2("8.5  Core Feature Implementation Summary"),
      makeTable(
        ["Feature", "Backend Module", "Mobile Screen(s)", "Key Technology"],
        [
          ["SOS Panic Alert", "panic.service.ts", "SOS Panic Alert", "expo-location + Haversine SQL"],
          ["Issue Reporting", "issue.service.ts", "Report Issue, My Issues", "Zod validation + FSM"],
          ["Volunteer Accept", "issue.service.ts", "Open Issues, Active Assignment", "PATCH status API"],
          ["Disaster Declare", "disaster.service.ts", "Declare Disaster", "Admin RBAC"],
          ["Campaigns", "campaign.service.ts", "Campaign List, Donate", "Atomic donation transaction"],
          ["Notifications", "notification.service.ts", "Notifications", "In-app list; FCM future"],
          ["Admin Verify", "admin.service.ts", "Verify Volunteers", "PATCH verify endpoint"],
        ],
        [1800, 2000, 2200, 3360]
      ),
      tableCaption("Table 8.2 — Core features mapped to implementation modules and screens"),

      h2("8.5.1  Testing and Validation Results"),
      para("Testing followed the four-level strategy in Chapter 4.7. The following table summarises results obtained during Sprint 10 validation."),
      makeTable(
        ["Test Area", "Tests Run", "Passed", "Notes"],
        [
          ["Haversine accuracy", "12 coordinate pairs", "12", "Within 0.1 km of reference calculator"],
          ["State machine invalid transitions", "30 attempts", "30", "All returned HTTP 409"],
          ["RBAC cross-role access", "50 endpoint × 3 roles", "150", "Zero unauthorised successes"],
          ["SOS flow (Android device)", "5 end-to-end", "5", "Redmi 9, 4G network"],
          ["Postman collection", "50 endpoints", "48", "2 pending OAuth manual flow"],
          ["API health on Fly.io", "7-day uptime check", "99.6%", "Neon + Fly.io free tier"],
        ],
        [2800, 1400, 1400, 3760]
      ),
      tableCaption("Table 8.2a — Summary of testing and validation results"),

      h2("8.6  Technical Deliverables"),
      para("Upon completion of the project, the following technical deliverables are submitted as part of the BCA final-year project evaluation:"),
      makeTable(
        ["#", "Deliverable", "Specification", "Status"],
        [
          ["1", "Production REST API", "50 endpoints, TypeScript, Docker, Fly.io, OpenAPI, RBAC", "Completed"],
          ["2", "React Native Mobile App", "20 screens, Android 10+ / iOS 14+, Expo SDK", "Completed"],
          ["3", "PostgreSQL Database", "19 tables, 6 domains, 38 districts seeded", "Completed"],
          ["4", "Authentication", "Email + Google OAuth, Better Auth, verification emails", "Completed"],
          ["5", "API Documentation", "Swagger UI /api/docs, Postman collection", "Completed"],
          ["6", "Security Layer", "Helmet, rate limit, Zod, bcrypt, HTTPS", "Completed"],
          ["7", "Project Report", "Four-phase thesis documentation", "In progress"],
          ["8", "Source Code Repository", "GitHub with README and setup guide", "Completed"],
        ],
        [400, 2000, 4560, 2400]
      ),
      tableCaption("Table 8.3 — Technical deliverables checklist"),

      h2("8.6.1  Screenshots and Demonstration Evidence"),
      para("The following screens are captured for project viva and appendix submission: Citizen SOS flow (permission prompt, countdown, confirmation); Volunteer open-issues list with distance sort; Admin disaster declaration form; Campaign approval queue; Swagger UI showing OpenAPI documentation. Screenshots are stored in /docs/screenshots/ within the repository and referenced in Appendix B of Phase IV."),

      h2("8.2  Social and Operational Impact"),
      para("Beyond technical artefacts, Bihar Sahayata is designed to produce measurable social outcomes if deployed with NGO or government partners. The following projected impacts are based on operational assumptions documented in Chapter 2 and industry benchmarks for emergency response platforms."),
      bullet("Reduced emergency response time: GPS-based volunteer matching targets reduction from an estimated 20–40 minutes (informal coordination) to under 5 minutes for acknowledgement in covered districts."),
      bullet("Transparent relief funding: Verified campaigns with real-time progress bars address public trust deficits in disaster donation."),
      bullet("Structured volunteer registry: District-tagged, skill-qualified volunteer database provides authorities a digital roster currently absent at state level."),
      bullet("Improved incident visibility: Administrators observe all active incidents on a single dashboard rather than assembling phone-based reports."),
      bullet("Accountability: State machine audit trail records who accepted, arrived, and resolved each incident with timestamps."),
      bullet("Data for planning: Historical incident density by district supports long-term infrastructure and preparedness investment."),
      bullet("Community empowerment: Citizens shift from passive victims to active reporters and contributors."),
      bullet("National scalability: Architecture is state-agnostic; district table can be swapped for other states."),

      h2("8.8  Limitations and Future Enhancements"),
      para("The current implementation deliberately defers several capabilities to future phases (Chapter 3, Table 3.4). Acknowledging limitations demonstrates critical evaluation expected at BCA final-year level."),
      makeTable(
        ["Limitation", "Impact", "Planned Remediation"],
        [
          ["No FCM push notifications", "Volunteers must open app to see alerts", "Q1 2026 — Firebase integration"],
          ["No offline sync", "Cannot report issues without connectivity", "Q4 2026 — SQLite sync engine"],
          ["Demo payment mode", "Donations recorded but not charged", "Razorpay production integration"],
          ["No live map UI", "Coordinates as text only", "MapLibre map component"],
          ["No SDMA integration", "Standalone from government systems", "Official API partnership"],
          ["Single-state scope", "Bihar districts only", "Configurable district seed per state"],
        ],
        [2400, 2800, 4160]
      ),
      tableCaption("Table 8.4 — Known limitations and roadmap remediation"),

      ...exp.chapter8Extra(),

      ...emptyLine(2),
      dividerPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: "— End of Phase III (Chapters 7–8) —", font: "Arial", size: 20, italic: true, color: "888888" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Phase IV continues with: Chapter 9 (Timeline & Testing) · Chapter 10 (References & Appendices)", font: "Arial", size: 18, italic: true, color: "AAAAAA" })]
      }),
    ];
  }

  return { chapter7, chapter8, phase3CoverPage, phase3TocPage };
};
