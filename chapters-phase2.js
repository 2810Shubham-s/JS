/**
 * Phase II — Chapters 5 (System Architecture) & 6 (Tools and Technologies)
 * Factory receives helper functions from synopsis.js
 */
module.exports = function createPhase2Chapters({
  chapterHeader, h2, h3, para, bullet, numbered, makeTable, tableCaption,
  dividerPara, emptyLine, Paragraph, TextRun, AlignmentType, ShadingType, BLUE, LBLUE, DARK,
  codeBlock,
}) {
  const createExpansions = require('./thesis-expansions');
  const exp = createExpansions({
    para, h2, h3, bullet, numbered, makeTable, tableCaption, emptyLine, codeBlock,
    Paragraph, TextRun, ShadingType, AlignmentType,
  });
  const TABLES_19 = [
    ['user', 'Auth', 'id (UUID PK), email (unique), name, role (enum), emailVerified, image, createdAt, updatedAt', 'Central identity; role ∈ {citizen, volunteer, admin}'],
    ['session', 'Auth', 'id, userId (FK→user), token (unique), expiresAt, ipAddress, userAgent, createdAt', 'Active sessions for Better Auth'],
    ['account', 'Auth', 'id, userId (FK), providerId, accountId, accessToken, refreshToken, scope', 'OAuth provider linkage (Google)'],
    ['verification', 'Auth', 'id, identifier (email), value (token), expiresAt, createdAt', 'Email verification & password reset tokens'],
    ['volunteer_profile', 'Volunteer', 'id, userId (FK, unique), phone, districtId (FK), latitude, longitude, isVerified, isAvailable, bio, createdAt', 'Geolocation + verification status for Haversine queries'],
    ['volunteer_qualification', 'Volunteer', 'id, volunteerId (FK), title, issuer, certificateUrl, verifiedAt, expiresAt', 'Skills: medical, rescue, boating, etc.'],
    ['volunteer_team', 'Volunteer', 'id, name, type (enum), leaderId (FK→user), districtId (FK), description, isActive, createdAt', 'Team types: RESCUE, MEDICAL, RELIEF, GENERAL'],
    ['team_membership', 'Volunteer', 'id, teamId (FK), userId (FK), role (enum), joinedAt, leftAt', 'Membership with LEADER/MEMBER roles'],
    ['issue_type', 'Issue', 'id, code (unique), label, description, defaultSeverity', 'FLOOD, MEDICAL, RESCUE, INFRASTRUCTURE'],
    ['issue', 'Issue', 'id, reporterId (FK), typeId (FK), title, description, severity, status (enum), districtId (FK), lat, lng, victimCount, photoUrl, createdAt, resolvedAt', 'Core incident record; status FSM enforced in API'],
    ['issue_assignment', 'Issue', 'id, issueId (FK), volunteerId (FK), assignedAt, completedAt, notes', 'Links volunteer to issue; supports reassignment'],
    ['panic_alert', 'SOS', 'id, citizenId (FK), latitude, longitude, status, countdownEndsAt, resolvedAt, createdAt', 'One-tap SOS; triggers Haversine volunteer search'],
    ['disaster', 'Disaster', 'id, declaredBy (FK→user), districtId (FK), title, severity (enum), status, startDate, endDate, description', 'Official disaster declaration per district'],
    ['disaster_team_activation', 'Disaster', 'id, disasterId (FK), teamId (FK), activatedAt, deactivatedAt, activatedBy (FK)', 'Admin activates teams during disasters'],
    ['campaign', 'Campaign', 'id, creatorId (FK), districtId (FK), title, goalAmount, raisedAmount, status, approvedBy, approvedAt, deadline', 'Statuses: DRAFT, PENDING, APPROVED, REJECTED, CLOSED'],
    ['donation', 'Campaign', 'id, campaignId (FK), donorId (FK), amount, message, paymentRef, createdAt', 'Donation ledger; Razorpay-ready reference field'],
    ['campaign_update', 'Campaign', 'id, campaignId (FK), authorId (FK), content, imageUrl, createdAt', 'Transparency posts by campaign owner/admin'],
    ['notification', 'System', 'id, userId (FK), type (enum), title, body, entityType, entityId, isRead, readAt, createdAt', 'In-app notifications for SOS, assignments, disasters'],
    ['district', 'Location', 'id, name (unique), code, latitude, longitude, population, areaSqKm', 'All 38 Bihar districts seeded with centroid GPS'],
  ];

  const ER_RELATIONSHIPS = [
    ['user', '1:N', 'session', 'One user may have multiple active sessions (devices)'],
    ['user', '1:N', 'account', 'OAuth accounts linked to user'],
    ['user', '1:1', 'volunteer_profile', 'Optional one-to-one volunteer extension'],
    ['user', '1:N', 'issue', 'Citizen reports many issues'],
    ['user', '1:N', 'panic_alert', 'Citizen may trigger multiple SOS alerts over time'],
    ['volunteer_profile', '1:N', 'volunteer_qualification', 'Volunteer holds multiple qualifications'],
    ['volunteer_team', '1:N', 'team_membership', 'Team has many members'],
    ['user', '1:N', 'team_membership', 'User joins teams via membership records'],
    ['issue', 'N:1', 'issue_type', 'Each issue has one classification type'],
    ['issue', '1:N', 'issue_assignment', 'Issue may have multiple assignment records'],
    ['issue', 'N:1', 'district', 'Issue geo-tagged to one district'],
    ['disaster', '1:N', 'disaster_team_activation', 'Disaster activates multiple teams'],
    ['campaign', '1:N', 'donation', 'Campaign receives many donations'],
    ['campaign', '1:N', 'campaign_update', 'Campaign has many update posts'],
    ['user', '1:N', 'notification', 'User receives many notifications'],
  ];

  function chapter5() {
    return [
      ...chapterHeader("5", "System Architecture", "Technical Design, Database Schema, and Authentication"),

      h2("5.1  High-Level Architecture"),
      para("Bihar Sahayata implements a classical three-tier client–server architecture comprising a presentation tier (React Native mobile client), an application tier (Node.js/Express REST API), and a data tier (Neon serverless PostgreSQL). This separation of concerns is a deliberate architectural choice: each tier can be developed, tested, deployed, and scaled independently, while communicating through well-defined interfaces (HTTPS/JSON between client and API; SQL over TLS between API and database)."),
      para("The three-tier model maps directly to the operational responsibilities of the platform. The presentation tier is responsible only for user interaction, input validation at the UI level, and secure storage of session tokens on the device. The application tier owns all business logic: authentication, role-based authorisation, the issue state machine, Haversine volunteer matching, campaign approval workflows, and notification generation. The data tier owns persistence, referential integrity, indexing strategy, and geospatial query execution."),
      makeTable(
        ["Tier", "Technologies", "Responsibilities"],
        [
          ["Presentation (Client)", "React Native · Expo SDK · Expo Router · NativeWind · TanStack Query · Axios · expo-secure-store · expo-location", "Role-based UI · GPS capture · Bearer token storage · Offline-tolerant caching · Form validation (client-side)"],
          ["Application (API)", "Node.js 20 LTS · Express.js 4.x · TypeScript 5.x · Better Auth · Zod · Drizzle ORM · Helmet · express-rate-limit", "50 REST endpoints · RBAC middleware · State machine · Haversine SQL · OpenAPI docs · Docker image"],
          ["Data", "Neon PostgreSQL · Drizzle migrations · DECIMAL(10,7) coordinates · B-tree & composite indexes", "19 tables · 6 domains · FK constraints · District seed data · ACID transactions"],
        ],
        [1400, 3200, 4760]
      ),
      tableCaption("Table 5.1 — Three-tier architecture: technologies and responsibilities per tier"),

      makeTable(
        ["Communication Path", "Protocol", "Security"],
        [
          ["Mobile App → API", "HTTPS REST/JSON", "TLS 1.2+ · Bearer JWT in Authorization header"],
          ["API → PostgreSQL", "PostgreSQL wire protocol over TLS", "Connection string via Fly.io secrets · Parameterised queries only"],
          ["API → Resend", "HTTPS REST", "API key in environment variable · No PII in logs"],
          ["Future Web → API", "HTTPS REST/JSON", "HTTP-only session cookies · Same RBAC middleware"],
        ],
        [2200, 2400, 4760]
      ),
      tableCaption("Table 5.2 — Inter-tier communication paths and security controls"),

      h3("5.1.1  Architectural Design Principles"),
      bullet("Stateless API: No server-side session state in application memory; session data lives in PostgreSQL via Better Auth, enabling horizontal scaling behind a load balancer."),
      bullet("Security by Default: Every route is denied unless explicitly registered; protected routes chain authentication → RBAC → Zod validation → controller."),
      bullet("Database-First Geospatial Logic: Haversine distance filtering executes in PostgreSQL WHERE clauses, not in Node.js loops over full result sets."),
      bullet("Single Source of Schema Truth: Drizzle TypeScript schema definitions generate migrations and infer API types, eliminating schema drift."),
      bullet("Fail-Safe Error Envelope: All errors return { error: { code, message, details? } } with appropriate HTTP status; no stack traces in production responses."),
      bullet("Low-Bandwidth Optimisation: Paginated list endpoints, selective field projection, and compressed JSON payloads for mobile clients."),

      h2("5.3  HTTP Request Lifecycle"),
      para("Every inbound HTTP request traverses a fixed middleware pipeline before reaching domain-specific route handlers. Understanding this pipeline is essential for security auditing and performance profiling."),
      numbered("Helmet — applies security headers (CSP, HSTS, X-Frame-Options, etc.)."),
      numbered("CORS — restricts cross-origin requests to configured mobile/web origins."),
      numbered("Rate Limiter — IP-based throttling (stricter on /auth routes)."),
      numbered("Body Parser — JSON parsing with size limit (prevents payload bombs)."),
      numbered("Better Auth Handler — /api/auth/* routes for sign-in, OAuth, session refresh."),
      numbered("Authentication Middleware — validates Bearer token or cookie session."),
      numbered("RBAC Middleware — checks role against route's required permission."),
      numbered("Zod Validator — parses and validates req.body / req.query / req.params."),
      numbered("Controller → Service → Drizzle Query — business logic and database access."),
      numbered("Response Serializer — consistent { data } or { data, pagination } envelope."),
      makeTable(
        ["HTTP Method", "Typical Use", "Idempotent?", "Example"],
        [
          ["GET", "Read resources, lists, dashboards", "Yes", "GET /api/issues?districtId=12&status=PENDING"],
          ["POST", "Create resources, trigger SOS", "No", "POST /api/panic/alert"],
          ["PATCH", "Partial update (issue status)", "No", "PATCH /api/issues/:id/status"],
          ["PUT", "Full replace (rare)", "Yes", "PUT /api/volunteers/me/profile"],
          ["DELETE", "Soft-delete / revoke", "Yes", "DELETE /api/teams/:id/members/:userId"],
        ],
        [1200, 2800, 1200, 4160]
      ),
      tableCaption("Table 5.3 — REST verb conventions used across the Bihar Sahayata API"),

      h2("5.4  Database Domain Organisation"),
      para("The PostgreSQL schema comprises nineteen tables organised into six functional domains. Domain-driven grouping reduces cognitive load during development, clarifies ownership boundaries for migrations, and supports targeted indexing strategies per access pattern. All tables use UUID primary keys (generated via gen_random_uuid()) to support distributed ID generation without collision risk in future multi-region deployment."),
      makeTable(
        ["Domain", "Tables (Count)", "Primary Purpose"],
        [
          ["Authentication", "user, session, account, verification (4)", "Identity, sessions, OAuth, email verification"],
          ["Volunteer", "volunteer_profile, volunteer_qualification, volunteer_team, team_membership (4)", "Responder registry, skills, teams"],
          ["Issue & SOS", "issue_type, issue, issue_assignment, panic_alert (4)", "Incidents, assignments, emergency SOS"],
          ["Disaster", "disaster, disaster_team_activation (2)", "Official declarations, team mobilisation"],
          ["Campaign", "campaign, donation, campaign_update (3)", "Crowdfunding and transparency"],
          ["Location & Notifications", "district, notification (2)", "Geographic reference data, user alerts"],
        ],
        [2000, 2800, 4560]
      ),
      tableCaption("Table 5.4 — Six functional domains spanning 19 database tables"),

      h2("5.2  Database Schema Overview"),
      h3("5.2.1  Complete Database Schema — All 19 Tables"),
      para("The following master reference documents every table with its domain classification, primary columns, and design rationale. Third Normal Form (3NF) is maintained throughout: non-key attributes depend only on the primary key, and repeating groups are eliminated via separate tables (e.g., qualifications and memberships)."),
      makeTable(
        ["Table Name", "Domain", "Key Columns & Types", "Design Notes"],
        TABLES_19,
        [1500, 900, 4200, 2760]
      ),
      tableCaption("Table 5.5 — Complete schema reference for all 19 PostgreSQL tables"),

      h3("5.5.1  Auth Domain — Detailed Column Specification"),
      makeTable(
        ["Column", "Table", "Data Type", "Constraints"],
        [
          ["id", "user", "UUID", "PRIMARY KEY, DEFAULT gen_random_uuid()"],
          ["email", "user", "VARCHAR(255)", "UNIQUE, NOT NULL"],
          ["role", "user", "VARCHAR(20)", "NOT NULL, CHECK IN (citizen, volunteer, admin)"],
          ["token", "session", "TEXT", "UNIQUE, NOT NULL"],
          ["expiresAt", "session", "TIMESTAMPTZ", "NOT NULL"],
          ["providerId", "account", "VARCHAR(50)", "NOT NULL with accountId (OAuth composite)"],
          ["value", "verification", "VARCHAR(255)", "NOT NULL, single-use token"],
        ],
        [1600, 1400, 2200, 4160]
      ),
      tableCaption("Table 5.5a — Authentication domain: representative columns and constraints"),

      h3("5.5.2  Volunteer & Issue Domains — Geospatial Columns"),
      para("Geospatial accuracy is central to SOS matching. Latitude and longitude use DECIMAL(10, 7), providing approximately 1.1 cm precision at the equator — far exceeding GPS hardware accuracy on consumer smartphones (typically 3–5 metres under open sky). The Haversine query filters on these columns after an optional bounding-box pre-filter to reduce trigonometric computation load."),
      makeTable(
        ["Column", "Table", "Purpose"],
        [
          ["latitude", "volunteer_profile", "Volunteer last-known position for proximity search"],
          ["longitude", "volunteer_profile", "Paired with latitude for Haversine"],
          ["is_verified", "volunteer_profile", "Admin-approved; false excludes from SOS query"],
          ["is_available", "volunteer_profile", "Volunteer opt-in; false when off-duty"],
          ["latitude", "issue", "Incident location at report time"],
          ["longitude", "issue", "Incident location at report time"],
          ["latitude", "panic_alert", "SOS trigger coordinates (immutable after creation)"],
          ["longitude", "panic_alert", "SOS trigger coordinates"],
          ["status", "issue", "ENUM: PENDING, ASSIGNED, EN_ROUTE, ON_SITE, RESOLVED, ESCALATED"],
        ],
        [2000, 2400, 4960]
      ),
      tableCaption("Table 5.5b — Geospatial and status columns for volunteer matching and issue lifecycle"),

      h3("5.5.3  Campaign Domain — Financial Integrity"),
      para("Campaign financial data uses INTEGER or NUMERIC types for amounts stored in paise (1/100 rupee) to avoid floating-point rounding errors in donation totals. The raised_amount column is updated atomically within a database transaction alongside donation INSERT to prevent race conditions when multiple donors contribute simultaneously during high-traffic disaster appeals."),
      makeTable(
        ["Column", "Table", "Business Rule"],
        [
          ["goalAmount", "campaign", "Target in INR paise; set at creation"],
          ["raisedAmount", "campaign", "Sum of confirmed donations; never manually edited"],
          ["status", "campaign", "DRAFT → PENDING → APPROVED/REJECTED → CLOSED"],
          ["amount", "donation", "Individual donation; FK to campaign"],
          ["paymentRef", "donation", "Razorpay order_id placeholder for future integration"],
          ["approvedBy", "campaign", "Administrator user id; null until approved"],
        ],
        [2000, 2000, 5360]
      ),
      tableCaption("Table 5.5c — Campaign and donation columns ensuring financial consistency"),

      h2("5.6  Entity–Relationship Model"),
      para("The entity–relationship (ER) model captures cardinality between entities and guides foreign key placement. Bihar Sahayata uses logical relationships enforced by PostgreSQL FOREIGN KEY constraints with ON DELETE RESTRICT for core entities (preventing orphan issues) and ON DELETE CASCADE only where safe (e.g., session records when user is removed)."),
      makeTable(
        ["Parent Entity", "Cardinality", "Child Entity", "Business Rule"],
        ER_RELATIONSHIPS,
        [1600, 800, 1600, 5360]
      ),
      tableCaption("Table 5.6 — Entity–relationship cardinality matrix (selected relationships)"),

      h3("5.6.1  ER Diagram — Textual Representation"),
      para("Figure 5.1 presents a textual ER diagram suitable for academic documentation. In Phase III implementation chapters, this may be supplemented with a graphical diagram exported from dbdiagram.io or Drizzle Studio."),
      new Paragraph({
        spacing: { before: 160, after: 160 },
        shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
        children: [new TextRun({
          text: "USER ──< SESSION          USER ──< ACCOUNT          USER ──< NOTIFICATION\nUSER ──|| VOLUNTEER_PROFILE ──< VOLUNTEER_QUALIFICATION\nUSER ──< TEAM_MEMBERSHIP >── VOLUNTEER_TEAM\nUSER ──< ISSUE >── ISSUE_TYPE          DISTRICT ──< ISSUE\nISSUE ──< ISSUE_ASSIGNMENT >── USER (volunteer)\nUSER ──< PANIC_ALERT\nDISTRICT ──< DISASTER ──< DISASTER_TEAM_ACTIVATION >── VOLUNTEER_TEAM\nUSER ──< CAMPAIGN >── DISTRICT          CAMPAIGN ──< DONATION\nCAMPAIGN ──< CAMPAIGN_UPDATE",
          font: "Courier New", size: 18, color: DARK
        })]
      }),
      tableCaption("Figure 5.1 — Textual entity–relationship diagram ( cardinalities: ──< one-to-many, ──|| one-to-one )"),

      h2("5.7  Indexing and Query Optimisation Strategy"),
      para("Performance during disaster events depends on sub-second geospatial queries. The following indexes are created via Drizzle migrations:"),
      bullet("volunteer_profile (latitude, longitude) — composite B-tree supporting bounding-box pre-filter before Haversine."),
      bullet("volunteer_profile (is_verified, is_available) — partial index WHERE is_verified = true AND is_available = true."),
      bullet("issue (district_id, status) — admin dashboard filtering."),
      bullet("issue (status, created_at DESC) — volunteer open-issue lists."),
      bullet("notification (user_id, is_read, created_at) — unread notification queries."),
      bullet("donation (campaign_id) — aggregation of raised_amount."),
      bullet("session (token) UNIQUE — O(1) session lookup."),
      bullet("user (email) UNIQUE — login path optimisation."),

      h2("5.8  Authentication and Session Architecture"),
      para("Authentication is implemented using Better Auth v1.2, which provides a unified plugin architecture for email/password credentials, Google OAuth 2.0, and session management. Better Auth stores sessions in the session table rather than in-memory stores, aligning with the stateless API design while persisting session validity across server restarts and deployments."),
      h3("Registration and Email Verification Flow"),
      numbered("Citizen/Volunteer submits POST /api/auth/sign-up with email, password, name, and role."),
      numbered("Better Auth creates user record (emailVerified = false) and verification token."),
      numbered("Resend API sends verification email with time-limited link (24-hour expiry)."),
      numbered("User clicks link → GET verification endpoint → emailVerified set true."),
      numbered("User may now sign in and receive Bearer token for mobile client."),
      h3("Volunteer Verification (Administrative)"),
      para("Volunteer role registration creates a volunteer_profile with is_verified = false. Until an Administrator approves the profile via PATCH /api/admin/volunteers/:id/verify, the volunteer is excluded from Haversine SOS queries (WHERE is_verified = true). This two-stage gate prevents unvetted accounts from receiving emergency alerts."),
      makeTable(
        ["Role", "Sign-Up", "Additional Gate", "API Token Scope"],
        [
          ["Citizen", "Email verification", "None", "Citizen endpoints only"],
          ["Volunteer", "Email verification", "Admin profile verification", "Volunteer + shared endpoints"],
          ["Administrator", "Pre-seeded or admin-created", "Manual onboarding", "Full admin endpoints"],
        ],
        [1400, 1800, 2200, 3960]
      ),
      tableCaption("Table 5.7 — Role-based authentication and verification requirements"),

      h2("5.9  API Module Structure"),
      para("The Express application is organised into route modules mirroring database domains. Each module exports a Router instance mounted under /api/v1. Controllers remain thin; services encapsulate business logic (state machine, Haversine search, campaign progress calculation)."),
      makeTable(
        ["Module Path", "Endpoints", "Primary Tables"],
        [
          ["/api/auth/*", "4", "user, session, account, verification"],
          ["/api/volunteers", "7", "volunteer_profile, volunteer_qualification"],
          ["/api/teams", "7", "volunteer_team, team_membership"],
          ["/api/panic", "2", "panic_alert, notification"],
          ["/api/issues", "6", "issue, issue_assignment, issue_type"],
          ["/api/disasters", "7", "disaster, disaster_team_activation"],
          ["/api/campaigns", "5", "campaign, donation, campaign_update"],
          ["/api/admin", "12", "Cross-domain admin operations"],
        ],
        [2000, 1200, 6160]
      ),
      tableCaption("Table 5.8 — API route modules mapped to endpoint counts and primary tables"),

      h2("5.10  Deployment Architecture on Fly.io"),
      para("Production deployment packages the API as a multi-stage Docker image: Stage 1 (build) compiles TypeScript; Stage 2 (production) copies dist/ and production node_modules only. Fly.io runs the container with configured secrets (DATABASE_URL, BETTER_AUTH_SECRET, RESEND_API_KEY, GOOGLE_CLIENT_ID/SECRET). Health check GET /api/health verifies process liveness and database connectivity. Neon PostgreSQL accepts connections from Fly.io's outbound IPs via connection pooling (PgBouncer-compatible), supporting burst traffic during disasters without exhausting connection limits."),

      ...exp.chapter5Extra(),
      ...emptyLine(2),
      dividerPara(),
    ];
  }

  function chapter6() {
    return [
      ...chapterHeader("6", "Tools and Technologies", "Complete Technology Stack with Technical Justifications"),

      h2("6.1  Technology Selection Criteria"),
      para("Technology choices for Bihar Sahayata were evaluated against five criteria derived from the non-functional requirements in Chapter 3: (1) production maturity and LTS support; (2) TypeScript compatibility for end-to-end type safety; (3) suitability for low-bandwidth mobile clients; (4) operational cost within academic/free-tier budgets; and (5) alignment with BCA curriculum learning outcomes (database systems, web technologies, mobile development, cloud computing)."),
      makeTable(
        ["Criterion", "Weight", "Evaluation Method"],
        [
          ["Production Maturity", "High", "NPM download trends, LTS status, CVE history"],
          ["Type Safety", "High", "Native TypeScript or official type definitions"],
          ["Mobile / Low Bandwidth", "Critical", "Expo compatibility, payload efficiency, offline patterns"],
          ["Cost (Academic)", "Medium", "Free tier limits (Neon, Fly.io, Resend)"],
          ["Curriculum Alignment", "Medium", "Mapping to BCA syllabus units"],
        ],
        [2800, 1600, 4960]
      ),
      tableCaption("Table 6.1 — Technology selection criteria and evaluation methods"),

      h2("6.2  Backend Technology Stack"),
      para("The backend stack prioritises reliability, security, and developer velocity. Each component is selected to solve a specific disaster-response engineering problem rather than following trends alone."),
      makeTable(
        ["Technology", "Version", "Role", "Justification for Bihar Sahayata"],
        [
          ["Node.js", "v20 LTS", "JavaScript runtime", "Non-blocking I/O handles concurrent SOS requests; LTS security patches; team proficiency from BCA coursework"],
          ["Express.js", "v4.19", "HTTP framework", "Minimal overhead; mature middleware ecosystem; industry-standard for REST APIs"],
          ["TypeScript", "v5.5", "Type system", "Compile-time safety for GPS coordinates, enums, and API contracts; reduces production bugs during disasters"],
          ["Drizzle ORM", "v0.36", "Database access", "Type-safe queries; raw SQL escape hatches for Haversine; migration generation via drizzle-kit"],
          ["Better Auth", "v1.2", "Authentication", "Email + Google OAuth + sessions in one library; reduces custom auth code attack surface"],
          ["Zod", "v4.0", "Validation", "Runtime schemas mirror TypeScript types; field-level 400 errors for mobile form feedback"],
          ["Neon PostgreSQL", "Latest", "Database", "Serverless scaling; scale-to-zero for academic cost; full PostgreSQL (trig functions for Haversine)"],
          ["Resend", "v3.4", "Email", "Transactional verification emails; high deliverability; simple REST API"],
          ["Helmet", "v8.1", "Security headers", "One middleware call for OWASP-aligned HTTP headers"],
          ["express-rate-limit", "v8.3", "Rate limiting", "Protects auth and SOS endpoints from abuse during crises"],
          ["Docker", "Latest", "Containerisation", "Identical dev/prod environments; required for Fly.io deployment"],
          ["Fly.io", "—", "Cloud host", "Global edge; automatic TLS; health checks; suitable free allowance for academic demo"],
        ],
        [1400, 900, 1600, 5460]
      ),
      tableCaption("Table 6.2 — Backend technology stack with versions and disaster-domain justifications"),

      h3("6.2.1  Node.js and Express.js — Deep Dive"),
      para("Node.js provides a single-language stack (TypeScript/JavaScript) across mobile tooling and backend, reducing context switching for a two-developer team. Express.js's middleware pipeline maps directly onto the security architecture in Chapter 4: each concern (Helmet, CORS, rate limit, auth, RBAC, validation) is a discrete, testable middleware function. Alternative frameworks (Fastify, Hono) were considered; Express was chosen for superior documentation, university familiarity, and Postman/OpenAPI ecosystem compatibility."),

      h3("6.2.2  Drizzle ORM vs Alternatives"),
      makeTable(
        ["ORM", "Type Safety", "SQL Control", "Migration Tooling", "Decision"],
        [
          ["Drizzle", "Excellent (schema-in-TS)", "Full raw SQL support", "drizzle-kit", "Selected — best Haversine integration"],
          ["Prisma", "Excellent", "Limited raw SQL ergonomics", "prisma migrate", "Rejected — complex raw geo queries"],
          ["TypeORM", "Good", "Moderate", "Built-in", "Rejected — decorator complexity"],
          ["Knex", "Minimal", "Full SQL", "knex migrations", "Rejected — no inferred types"],
        ],
        [1400, 1800, 1800, 1800, 2560]
      ),
      tableCaption("Table 6.3 — ORM comparison matrix; Drizzle selected for geospatial query flexibility"),

      h3("6.2.3  Better Auth vs Custom JWT"),
      para("A custom JWT implementation was rejected because authentication vulnerabilities (token replay, refresh rotation bugs, timing attacks on password comparison) are historically common in student projects. Better Auth implements bcrypt hashing, secure session rotation, and OAuth flows maintained by security-focused contributors — reducing the attack surface while meeting academic demonstration requirements."),

      h2("6.3  Mobile and Frontend Technology Stack"),
      makeTable(
        ["Technology", "Purpose", "Justification"],
        [
          ["React Native + Expo SDK", "Cross-platform mobile UI", "Single codebase for Android 10+ and iOS 14+; Expo abstracts native build complexity for academic timeline"],
          ["Expo Router", "Navigation", "File-based routing across 20 screens; deep linking for verification emails"],
          ["NativeWind", "Styling", "Tailwind utility classes; rapid consistent UI without large StyleSheet files"],
          ["TanStack Query v5", "Server state", "Caching reduces redundant API calls on poor networks; background refetch for issue status"],
          ["Axios", "HTTP client", "Interceptors inject Bearer token; global 401 handler triggers logout"],
          ["expo-secure-store", "Token storage", "Hardware-backed encrypted storage vs AsyncStorage plaintext"],
          ["expo-location", "GPS", "Foreground location for SOS; permission prompts per platform guidelines"],
          ["react-hook-form + Zod", "Forms", "Client validation mirrors server Zod schemas; reduces round trips"],
        ],
        [2200, 2600, 4560]
      ),
      tableCaption("Table 6.4 — Mobile and frontend technology stack"),

      h3("6.3.1  Why React Native over Flutter or Native"),
      makeTable(
        ["Approach", "Pros", "Cons", "Verdict"],
        [
          ["React Native (Expo)", "JS/TS skill reuse; large ecosystem; Expo GPS/secure-store", "Bridge performance on very old devices", "Selected"],
          ["Flutter", "Performance; single UI toolkit", "Dart learning curve; team has no Dart exposure", "Rejected for timeline"],
          ["Native (Kotlin/Swift)", "Maximum performance", "Two codebases; 2× development effort", "Rejected for team size"],
          ["PWA only", "No app store", "Limited GPS/background on iOS; poor offline", "Rejected for SOS reliability"],
        ],
        [1600, 2800, 2800, 2160]
      ),
      tableCaption("Table 6.5 — Mobile framework comparison; React Native + Expo selected"),

      h2("6.3  Development and DevOps Tools"),
      makeTable(
        ["Tool", "Category", "Purpose in Project"],
        [
          ["Visual Studio Code", "IDE", "Primary editor; ESLint + Prettier + TypeScript + Drizzle extensions"],
          ["Git + GitHub", "Version control", "Feature branches; pull request reviews between team members"],
          ["Postman v10+", "API testing", "50-endpoint collection; Newman CI runs; OpenAPI import/export"],
          ["drizzle-kit", "Migrations", "Generate SQL from schema; push to Neon dev branch"],
          ["Docker Desktop", "Containers", "Local parity with Fly.io production image"],
          ["Neon Dashboard", "Database admin", "SQL console; connection string management; branch databases"],
          ["Fly.io CLI (flyctl)", "Deployment", "fly deploy; secrets; logs; scale"],
          ["Android Studio", "Emulator", "Android 10+ emulator for device testing"],
          ["Expo Go", "Mobile dev client", "Rapid iteration without full native builds"],
        ],
        [2000, 1800, 5560]
      ),
      tableCaption("Table 6.6 — Development and DevOps toolchain"),

      h2("6.5  Environment Configuration"),
      para("Twelve-factor app methodology is followed: configuration is stored in environment variables, never committed to Git. Fly.io Secrets inject production values at runtime."),
      makeTable(
        ["Variable", "Tier", "Description"],
        [
          ["DATABASE_URL", "Secret", "Neon PostgreSQL connection string with SSL"],
          ["BETTER_AUTH_SECRET", "Secret", "Signing key for session tokens"],
          ["BETTER_AUTH_URL", "Config", "Public API base URL for OAuth callbacks"],
          ["GOOGLE_CLIENT_ID / SECRET", "Secret", "Google OAuth credentials"],
          ["RESEND_API_KEY", "Secret", "Transactional email API key"],
          ["PORT", "Config", "HTTP listen port (default 3000)"],
          ["NODE_ENV", "Config", "development | production"],
          ["CORS_ORIGIN", "Config", "Allowed mobile/web origins"],
        ],
        [2600, 1200, 5560]
      ),
      tableCaption("Table 6.7 — Environment variables for deployment configuration"),

      h2("6.6  Version Control and Branching Strategy"),
      para("GitHub hosts the repository with a simplified Git Flow adapted for two developers: main (production-deployable), develop (integration), and feature/* branches per sprint story (e.g., feature/sos-panic-endpoint). Pull requests require peer review before merge to develop. Tags (v0.1.0, v0.2.0) mark sprint completion milestones aligned with Table 4.1."),

      h2("6.7  Monitoring and Observability (Production)"),
      bullet("Fly.io Metrics: CPU, memory, HTTP request rate, and response latency dashboards."),
      bullet("Health Endpoint: GET /api/health returns { status, database, version, timestamp }."),
      bullet("Structured Logging: JSON logs via pino or winston; log levels ERROR/WARN/INFO; no password/token logging."),
      bullet("Neon Monitoring: Query performance insights; connection count alerts."),

      h2("6.8  Package Dependencies and Ecosystem"),
      para("The backend package.json declares approximately forty production dependencies. The following table lists the most architecturally significant packages and their interaction with other components."),
      makeTable(
        ["NPM Package", "Category", "Used By", "Notes"],
        [
          ["express", "HTTP", "Entry server", "Mounts all route modules"],
          ["drizzle-orm", "Database", "All services", "Schema in src/db/schema.ts"],
          ["better-auth", "Auth", "auth routes", "Replaces manual Passport.js setup"],
          ["zod", "Validation", "All controllers", "Shared schemas with mobile via copy"],
          ["@neondatabase/serverless", "Database driver", "Drizzle connection", "HTTP/WebSocket to Neon"],
          ["resend", "Email", "Auth service", "Verification and password reset"],
          ["helmet", "Security", "app.ts middleware", "First middleware in chain"],
          ["express-rate-limit", "Security", "app.ts", "Stricter limit on /auth"],
          ["cors", "Security", "app.ts", "Expo dev server + production origins"],
          ["dotenv", "Config", "Local dev only", "Fly.io uses secrets instead"],
        ],
        [2200, 1200, 2000, 3960]
      ),
      tableCaption("Table 6.9 — Key NPM dependencies and architectural roles"),

      h2("6.9  Development Workflow Summary"),
      para("The daily development workflow for the two-person team follows a consistent pattern: pull latest develop branch → create feature branch → implement with TypeScript strict mode → test endpoint in Postman → peer review → merge to develop → weekly deploy to Fly.io staging. Database schema changes require a drizzle-kit generate migration, peer review of generated SQL, and apply to Neon development branch before merging code that depends on new columns."),
      bullet("Local API: npm run dev with hot reload via tsx or nodemon."),
      bullet("Local DB: Neon development branch connection string in .env.local (never committed)."),
      bullet("Mobile: npx expo start with API_URL pointing to localhost or Fly.io tunnel."),
      bullet("Pre-deploy: docker build + docker run smoke test; fly deploy --remote-only."),

      h2("6.10  Technology Stack Summary Diagram"),
      para("Table 6.8 consolidates the full stack in layered form, providing a single reference for evaluators and future maintainers."),
      makeTable(
        ["Layer", "Components"],
        [
          ["Client", "React Native · Expo · Expo Router · NativeWind · TanStack Query · Axios · SecureStore · Location"],
          ["API Gateway", "Fly.io TLS termination · Load balancing"],
          ["Application", "Node.js · Express · TypeScript · Better Auth · Zod · Helmet · Rate Limit"],
          ["Data Access", "Drizzle ORM · drizzle-kit migrations"],
          ["Database", "Neon PostgreSQL · 19 tables · Indexes · Haversine SQL"],
          ["External Services", "Resend (email) · Google OAuth · Razorpay (future payments)"],
          ["DevOps", "Docker · GitHub · Postman · flyctl"],
        ],
        [2000, 7360]
      ),
      tableCaption("Table 6.8 — Full technology stack summary by architectural layer"),

      ...exp.chapter6Extra(),

      ...emptyLine(2),
      dividerPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: "— End of Phase II (Chapters 5–6) —", font: "Arial", size: 20, italic: true, color: "888888" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: "Phase III continues with: Chapter 7 (System Requirements) · Chapter 8 (Implementation & Outcomes)", font: "Arial", size: 18, italic: true, color: "AAAAAA" })]
      }),
    ];
  }

  function phase2CoverPage() {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "PATNA UNIVERSITY", font: "Arial", size: 44, bold: true, color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Department of Computer Applications", font: "Arial", size: 26, italic: true, color: DARK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Bachelor of Computer Applications (BCA) — Semester V", font: "Arial", size: 24, color: DARK })]
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
        children: [new TextRun({ text: "(Phase II: Chapters 5 – 6)", font: "Arial", size: 22, italic: true, color: "888888" })]
      }),
      ...emptyLine(2),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 60 },
        children: [new TextRun({ text: "Bihar Sahayata", font: "Arial", size: 52, bold: true, color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "System Architecture · Database Schema · Tools & Technologies", font: "Arial", size: 24, italic: true, color: DARK })]
      }),
      ...emptyLine(2),
      dividerPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 0 },
        children: [new TextRun({ text: "Shubham Kumar Mishra & Atul Sharma  |  Patna College  |  2025–2026", font: "Arial", size: 22, color: "555555" })]
      }),
    ];
  }

  function phase2TocPage() {
    const entries = [
      ["5", "SYSTEM ARCHITECTURE", "1"],
      ["5.1", "High-Level Architecture", "1"],
      ["5.2", "Architectural Design Principles", "3"],
      ["5.3", "HTTP Request Lifecycle", "4"],
      ["5.4", "Database Domain Organisation", "6"],
      ["5.5", "Complete Database Schema — 19 Tables", "8"],
      ["5.6", "Entity–Relationship Model", "14"],
      ["5.7", "Indexing and Query Optimisation", "16"],
      ["5.8", "Authentication Architecture", "17"],
      ["5.9", "API Module Structure", "19"],
      ["5.10", "Deployment on Fly.io", "20"],
      ["6", "TOOLS AND TECHNOLOGIES", "22"],
      ["6.1", "Technology Selection Criteria", "22"],
      ["6.2", "Backend Technology Stack", "23"],
      ["6.3", "Mobile and Frontend Stack", "28"],
      ["6.4", "Development and DevOps", "31"],
      ["6.5", "Environment Configuration", "33"],
      ["6.6", "Version Control Strategy", "34"],
      ["6.7", "Monitoring and Observability", "35"],
      ["6.8", "Technology Stack Summary", "36"],
    ];
    return [
      ...chapterHeader("", "TABLE OF CONTENTS", "Phase II — Chapters 5 & 6"),
      ...entries.map(([num, title, page]) => {
        const indent = num.includes(".") ? 1 : 0;
        return new Paragraph({
          spacing: { before: 80, after: 80 },
          indent: { left: indent * 400 },
          children: [
            new TextRun({ text: `${num}  ${title}`, font: "Arial", size: indent ? 20 : 22, bold: !indent, color: indent ? DARK : BLUE }),
            new TextRun({ text: `  ..............  ${page}`, font: "Arial", size: 20, color: DARK }),
          ]
        });
      }),
      dividerPara(),
    ];
  }

  return { chapter5, chapter6, phase2CoverPage, phase2TocPage };
};
