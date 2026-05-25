/**
 * Phase IV — Chapter 9 (Timeline & Testing), Chapter 10 (References), Appendices
 */
module.exports = function createPhase4Chapters({
  chapterHeader, h2, h3, para, bullet, numbered, makeTable, tableCaption,
  dividerPara, emptyLine, pageBreak, Paragraph, TextRun, AlignmentType, ShadingType, BLUE, LBLUE, DARK,
  codeBlock,
}) {
  const createExpansions = require('./thesis-expansions');
  const exp = createExpansions({
    para, h2, h3, bullet, numbered, makeTable, tableCaption, emptyLine, codeBlock,
    Paragraph, TextRun, ShadingType, AlignmentType,
  });
  const GANTT = [
    ['1. Project Planning & Research', '■', '', '', '', '', '', '', '', '', ''],
    ['2. Database Schema & Migrations', '', '■', '', '', '', '', '', '', '', ''],
    ['3. Authentication System', '', '', '■', '', '', '', '', '', '', ''],
    ['4. Middleware & Validation', '', '', '■', '', '', '', '', '', '', ''],
    ['5. Core API Routes (31 endpoints)', '', '', '', '■', '■', '', '', '', '', ''],
    ['6. Campaigns & Donation Module', '', '', '', '', '', '■', '', '', '', ''],
    ['7. Admin Routes & District Seeding', '', '', '', '', '', '■', '', '', '', ''],
    ['8. Security Hardening & Deployment', '', '', '', '', '', '', '■', '■', '', ''],
    ['9. React Native Mobile Application', '', '', '', '', '', '', '■', '■', '■', '■'],
    ['10. Testing, QA & Documentation', '', '', '', '', '', '', '', '■', '■', '■'],
  ];

  const PHASE_DELIVERABLES = [
    ['1', 'Project Planning & Research', 'Week 1', 'Requirement analysis, ER diagrams, technology stack finalisation, competitive study'],
    ['2', 'Database Schema & Setup', 'Week 2', '19-table PostgreSQL schema; Drizzle migrations; Neon dev database'],
    ['3', 'Authentication System', 'Week 3', 'Better Auth; email verification (Resend); Google OAuth; session API'],
    ['4', 'Middleware & Validation', 'Week 3', 'RBAC middleware; Zod schemas; global error handler; logging'],
    ['5', 'Core API Routes', 'Weeks 4–5', '31 endpoints: volunteers, issues, teams, panic, disasters'],
    ['6', 'Campaigns & Donations', 'Week 6', 'Campaign workflow; admin approval; donation ledger'],
    ['7', 'Admin & District Seeding', 'Week 6', '12 admin endpoints; 38 districts seeded; notifications'],
    ['8', 'Hardening & Deployment', 'Weeks 7–8', 'Helmet; rate limiting; Docker; Fly.io production deploy'],
    ['9', 'Mobile Application', 'Weeks 7–10', '20-screen React Native app; role-based navigation; GPS SOS'],
    ['10', 'Testing & Documentation', 'Weeks 9–10', 'Postman collection; OpenAPI; thesis; user manual'],
  ];

  const REFERENCES_GOV = [
    ['[1]', 'National Disaster Management Authority (NDMA), Government of India. (2024). Bihar flood management and multi-hazard risk profile. https://ndma.gov.in'],
    ['[2]', 'Bihar State Disaster Management Authority (BSDMA). (2023). Annual flood situation report. Government of Bihar. https://bsdma.bih.nic.in'],
    ['[3]', 'Ministry of Home Affairs, Government of India. (2009). National policy on disaster management. NDMA. https://ndma.gov.in'],
    ['[4]', 'India Meteorological Department (IMD). (2024). Monsoon rainfall statistics — East India. https://mausam.imd.gov.in'],
    ['[5]', 'Census of India. (2011). District census handbook — Bihar. Office of the Registrar General.'],
  ];

  const REFERENCES_TECH = [
    ['[6]', 'Better Auth. (2024). Authentication for modern web applications (v1.2). https://better-auth.com/docs'],
    ['[7]', 'Drizzle Team. (2024). Drizzle ORM — TypeScript ORM for SQL databases (v0.36). https://orm.drizzle.team'],
    ['[8]', 'Neon, Inc. (2024). Serverless PostgreSQL documentation. https://neon.tech/docs'],
    ['[9]', 'OpenJS Foundation. (2024). Express.js API reference (v4.x). https://expressjs.com'],
    ['[10]', 'Meta Platforms. (2024). React Native documentation. https://reactnative.dev'],
    ['[11]', 'Expo. (2024). Expo documentation — SDK reference. https://docs.expo.dev'],
    ['[12]', 'Fly.io. (2024). Deploy app servers close to your users. https://fly.io/docs'],
    ['[13]', 'Resend. (2024). Email API for developers (v3). https://resend.com/docs'],
    ['[14]', 'OWASP Foundation. (2021). OWASP top ten web application security risks. https://owasp.org/www-project-top-ten'],
    ['[15]', 'Zod. (2024). TypeScript-first schema validation. https://zod.dev'],
    ['[16]', 'TanStack. (2024). TanStack Query v5 documentation. https://tanstack.com/query'],
    ['[17]', 'Postman, Inc. (2024). API platform documentation. https://learning.postman.com'],
    ['[18]', 'Docker, Inc. (2024). Docker documentation. https://docs.docker.com'],
    ['[19]', 'Sinnott, R. O. (2003). Virtues of the Haversine formula. Practical geospatial computing literature.'],
    ['[20]', 'Sommerville, I. (2016). Software Engineering (10th ed.). Pearson — Agile and requirements chapters.'],
  ];

  const API_APPENDIX = [
    ['POST', '/api/auth/sign-up', 'Public', 'Register'],
    ['POST', '/api/auth/sign-in', 'Public', 'Login'],
    ['POST', '/api/auth/sign-out', 'Auth', 'Logout'],
    ['GET', '/api/auth/session', 'Auth', 'Current session'],
    ['POST', '/api/panic/alert', 'Citizen', 'SOS alert'],
    ['GET', '/api/panic/status/:id', 'Citizen', 'SOS status'],
    ['POST', '/api/issues', 'Citizen', 'Report issue'],
    ['GET', '/api/issues', 'Auth', 'List issues'],
    ['PATCH', '/api/issues/:id/accept', 'Volunteer', 'Accept issue'],
    ['PATCH', '/api/issues/:id/status', 'Volunteer', 'Update status'],
    ['POST', '/api/issues/:id/resolve', 'Volunteer', 'Resolve'],
    ['POST', '/api/disasters', 'Admin', 'Declare disaster'],
    ['GET', '/api/disasters', 'Auth', 'List disasters'],
    ['POST', '/api/campaigns', 'Citizen', 'Create campaign'],
    ['PATCH', '/api/campaigns/:id/approve', 'Admin', 'Approve campaign'],
    ['POST', '/api/campaigns/:id/donate', 'Citizen', 'Donate'],
    ['GET', '/api/admin/stats', 'Admin', 'Dashboard stats'],
    ['PATCH', '/api/admin/volunteers/:id/verify', 'Admin', 'Verify volunteer'],
    ['GET', '/api/health', 'Public', 'Health check'],
  ];

  function phase4CoverPage() {
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
        children: [new TextRun({ text: "(Phase IV: Chapters 9 – 10 & Appendices)", font: "Arial", size: 22, italic: true, color: "888888" })]
      }),
      ...emptyLine(2),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Bihar Sahayata", font: "Arial", size: 52, bold: true, color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Timeline · Testing · References · Appendices", font: "Arial", size: 24, italic: true, color: DARK })]
      }),
      dividerPara(),
    ];
  }

  function phase4TocPage() {
    const entries = [
      ["9", "PROJECT TIMELINE", false],
      ["9.1", "Development Phases and Gantt Schedule", true],
      ["9.2", "Phase Deliverables Summary", true],
      ["9.3", "Testing Schedule and Milestones", true],
      ["9.4", "Project Risks and Mitigation Timeline", true],
      ["10", "REFERENCES", false],
      ["10.1", "Government and Institutional Sources", true],
      ["10.2", "Technical Documentation and Literature", true],
      ["A", "APPENDIX A — API Endpoint Catalogue", false],
      ["B", "APPENDIX B — User Manual", false],
      ["C", "APPENDIX C — Installation and Deployment Guide", false],
      ["D", "APPENDIX D — Database Table Quick Reference", false],
    ];
    return [
      ...chapterHeader("", "TABLE OF CONTENTS", "Phase IV"),
      ...entries.map(([num, title, indent]) => new Paragraph({
        spacing: { before: 80, after: 80 },
        indent: { left: indent ? 400 : 0 },
        children: [new TextRun({ text: `${num}  ${title}`, font: "Arial", size: indent ? 20 : 22, bold: !indent, color: indent ? DARK : BLUE })]
      })),
      dividerPara(),
    ];
  }

  function chapter9() {
    return [
      ...chapterHeader("9", "Project Timeline", "Phased Development Schedule, Testing, and Milestones"),

      h2("9.1  Development Phases and Milestones"),
      para("The Bihar Sahayata project was executed over ten calendar weeks aligned with the BCA Semester V academic timeline (2025–2026). The schedule follows the Agile sprint structure defined in Chapter 4, with backend-heavy work concentrated in Weeks 1–8 and mobile development overlapping Weeks 7–10. The Gantt chart below visualises activity intensity per week; filled cells (■) indicate active development during that week."),
      makeTable(
        ["Phase / Activity", "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"],
        GANTT,
        [3200, 616, 616, 616, 616, 616, 616, 616, 616, 616, 616]
      ),
      tableCaption("Figure 9.1 — Ten-week Gantt chart: development phases and active weeks (■ = active)"),
      para("Weeks 4–5 deliberately overlap Core API development across two sprints to accommodate the largest endpoint batch (31 routes) without compressing quality. Weeks 7–8 parallelise security/deployment with mobile app scaffolding — the API is deployed to Fly.io staging by end of Week 8 so mobile integration in Weeks 9–10 targets a stable remote backend rather than localhost-only development."),

      h2("9.2  Phase Deliverables Summary"),
      makeTable(
        ["Ph.", "Activity", "Duration", "Key Deliverable"],
        PHASE_DELIVERABLES,
        [400, 2200, 1200, 5560]
      ),
      tableCaption("Table 9.1 — Phase-wise deliverables and duration mapping"),

      h3("9.2.1  Milestone Exit Criteria"),
      para("Each phase gate required demonstrable evidence before the subsequent phase commenced. The exit criteria below prevented accumulation of technical debt across the compressed ten-week schedule."),
      makeTable(
        ["Week", "Milestone", "Exit Criterion"],
        [
          ["2", "Schema complete", "drizzle-kit push succeeds; 19 tables visible in Neon console"],
          ["3", "Auth complete", "Sign-up → email → verify → sign-in works in Postman"],
          ["5", "Core API complete", "31 endpoints pass Postman happy-path tests"],
          ["6", "Full API (50)", "All domains integrated; RBAC matrix tested"],
          ["8", "Production live", "https://<app>.fly.dev/api/health returns 200"],
          ["10", "Submission ready", "Mobile SOS E2E on device; thesis Phase I–IV drafted"],
        ],
        [1000, 2800, 5560]
      ),
      tableCaption("Table 9.2 — Weekly milestone exit criteria"),

      h2("9.3  Testing Schedule and Milestones"),
      para("Testing was not deferred to Week 10 alone — continuous testing occurred from Sprint 3 onward. The schedule below maps test activities to weeks."),
      makeTable(
        ["Week", "Test Activity", "Responsible", "Output"],
        [
          ["3", "Auth flow manual tests", "Developer A", "Postman auth folder"],
          ["4", "Zod schema unit tests", "Developer B", "Jest validation tests"],
          ["5", "Haversine accuracy tests", "Developer A", "12-point comparison log"],
          ["5", "State machine negative tests", "Developer B", "409 response verification"],
          ["6", "RBAC matrix (50×3)", "Both", "Spreadsheet + Postman runner"],
          ["8", "Docker smoke test", "Developer A", "Container health on local"],
          ["8", "Fly.io staging deploy test", "Developer B", "Production parity checklist"],
          ["9", "Android E2E: SOS flow", "Both", "Screen recording for viva"],
          ["9", "Android E2E: issue lifecycle", "Both", "Test case document"],
          ["10", "Full Postman regression", "Both", "Exported Newman report"],
          ["10", "OpenAPI spec validation", "Developer A", "Swagger UI review"],
        ],
        [800, 2800, 1600, 4160]
      ),
      tableCaption("Table 9.3 — Testing schedule mapped to development weeks"),

      h3("9.3.1  Test Case Categories"),
      bullet("Functional: All FR-C, FR-V, FR-A requirements from Chapter 7 traced to at least one test case."),
      bullet("Integration: API + database + email (Resend) for verification flow."),
      bullet("Security: RBAC, rate limit breach, SQL injection attempts, XSS in text fields."),
      bullet("Performance: SOS pipeline timed on 4G; Haversine query EXPLAIN ANALYZE."),
      bullet("Usability: Informal peer review of mobile UI with 3 student testers."),

      h2("9.4  Project Risks and Timeline Mitigation"),
      para("The following risks materialised or were narrowly avoided during the project timeline. Documenting them demonstrates project management maturity expected in final-year evaluation."),
      makeTable(
        ["Risk", "Week Detected", "Impact", "Mitigation Applied"],
        [
          ["Neon free tier connection limit", "6", "API errors under load test", "Enabled connection pooling; reduced pool size"],
          ["Expo SDK version conflict", "7", "Mobile build failure", "Pinned SDK versions in package.json"],
          ["Fly.io cold start latency", "8", "First SOS >10s", "Documented; health-check ping cron considered"],
          ["Volunteer verification UI delay", "9", "Incomplete admin screens", "Prioritised verify screen over polish features"],
          ["Thesis writing compression", "10", "Documentation lag", "Four-phase report structure; parallel writing"],
        ],
        [2000, 1200, 2000, 4160]
      ),
      tableCaption("Table 9.4 — Timeline risks and mitigations encountered during development"),
    ];
  }

  function chapter10() {
    return [
      ...chapterHeader("10", "References", "Academic, Government, and Technical Bibliography"),

      h2("10.1  Government and Institutional Sources"),
      para("The contextual foundation of Bihar Sahayata — flood statistics, disaster policy, and institutional frameworks — draws on official government publications and authoritative disaster management sources. These references support the problem statement in Chapter 1 and validate the geographic scope of the platform."),
      ...REFERENCES_GOV.map(([id, text]) => para(`${id}  ${text}`)),

      h2("10.2  Technical Documentation"),
      para("Technical references document the specific frameworks, libraries, and standards used in implementation. URLs were accessed during the 2025–2026 academic session and reflect versions in use at time of development."),
      ...REFERENCES_TECH.map(([id, text]) => para(`${id}  ${text}`)),

      h2("10.3  Citation Style"),
      para("References are formatted following a simplified APA 7th Edition convention: author or organisation, year in parentheses where available, title in sentence case, and URL for online sources. In-text citations in earlier chapters use numbered reference style [1]–[20] corresponding to the combined bibliography above."),
      ...exp.chapter10Extra(),
    ];
  }

  function appendixA() {
    return [
      ...chapterHeader("", "APPENDIX A", "Complete API Endpoint Catalogue"),
      para("This appendix lists representative REST API endpoints for Bihar Sahayata. The authoritative specification is the OpenAPI document served at /api/docs on the production deployment. All paths are prefixed with the API base URL (e.g., https://bihar-sahayata.fly.dev)."),
      makeTable(
        ["Method", "Endpoint", "Role", "Description"],
        API_APPENDIX,
        [800, 2800, 1200, 4560]
      ),
      tableCaption("Table A.1 — Core API endpoints (see OpenAPI for complete 50-endpoint list)"),
      para("Authentication: Include header Authorization: Bearer <token> for all Auth rows except Public routes. Content-Type: application/json for POST/PATCH bodies."),
    ];
  }

  function appendixB() {
    return [
      ...chapterHeader("", "APPENDIX B", "User Manual"),
      h2("B.1  Introduction"),
      para("This manual describes how Citizens, Volunteers, and Administrators use the Bihar Sahayata mobile application. The app requires Android 10+ or iOS 14+ and an internet connection (2G minimum for basic features)."),
      h2("B.2  Getting Started"),
      numbered("Install Expo Go from Play Store / App Store (development build) or install the distributed APK."),
      numbered("Open the app and tap Register. Select Citizen or Volunteer role."),
      numbered("Enter email and password. Check email for verification link; tap to verify."),
      numbered("Sign in. The app opens to your role-specific home screen."),
      h2("B.3  Citizen Guide"),
      h3("B.3.1  Sending an SOS Panic Alert"),
      numbered("From the home screen, tap the red SOS button."),
      numbered("Allow location permission when prompted."),
      numbered("Confirm the alert. Your GPS coordinates are sent to nearby verified volunteers."),
      numbered("Wait on the status screen until a volunteer accepts. Do not close the app if possible."),
      h3("B.3.2  Reporting an Issue"),
      numbered("Tap Report Issue. Select type (Flood, Medical, Rescue, Infrastructure)."),
      numbered("Set severity, describe the situation, confirm location."),
      numbered("Submit. Track progress under My Issues."),
      h3("B.3.3  Donating to a Campaign"),
      numbered("Open Campaigns from the menu. Browse approved campaigns."),
      numbered("Tap Donate, enter amount (demo mode — no real charge in academic version)."),
      numbered("View thank-you confirmation and campaign progress bar."),
      h2("B.4  Volunteer Guide"),
      numbered("Complete your profile with phone and district. Wait for admin verification email."),
      numbered("Toggle Available ON when on duty."),
      numbered("Open Open Issues — tap Accept on an issue you can reach."),
      numbered("Update status: En Route when departing → On Site when arrived → Resolve when complete."),
      h2("B.5  Administrator Guide"),
      numbered("Sign in with admin credentials provided by system owner."),
      numbered("Verify pending volunteers under Verify Volunteers menu."),
      numbered("Approve or reject campaigns under Campaign Approval."),
      numbered("Declare disaster: select district, severity, description — activates emergency mode for teams."),
      h2("B.6  Troubleshooting"),
      bullet("Cannot sign in: Verify email first; check internet connection."),
      bullet("SOS fails: Enable GPS; move to open sky; retry."),
      bullet("No volunteers notified: Ensure volunteers are verified and available in your district."),
      h2("B.7  Frequently Asked Questions"),
      para("Q: Is my location tracked continuously? A: No. GPS is captured only when you submit SOS or report an issue."),
      para("Q: Can I change my role after registration? A: Role is fixed at signup. Contact admin for exceptional cases."),
      para("Q: Are donations real money? A: Academic build uses demo mode; production requires Razorpay integration."),
      para("Q: How do I become a verified volunteer? A: Register as volunteer, complete profile, wait for admin approval email."),
      para("Q: What if SOS fails on 2G? A: Move to open area, enable GPS, retry. App queues status poll when connection returns."),
      h2("B.8  Screen Reference (All 20 Screens)"),
      makeTable(
        ["#", "Screen", "Role", "Purpose"],
        [
          ["1", "Splash", "All", "Branding, session check"],
          ["2", "Login", "All", "Email/password sign-in"],
          ["3", "Register", "All", "Account creation with role"],
          ["4", "Email Verification", "All", "Confirm email link"],
          ["5", "Citizen Dashboard", "Citizen", "SOS, issues, campaigns"],
          ["6", "SOS Panic", "Citizen", "Emergency alert"],
          ["7", "Report Issue", "Citizen", "Structured incident"],
          ["8", "My Issues", "Citizen", "Track status"],
          ["9", "Campaigns", "Citizen", "Browse and donate"],
          ["10", "Volunteer Dashboard", "Volunteer", "Assignments overview"],
          ["11", "Open Issues", "Volunteer", "Accept nearby issues"],
          ["12", "Active Assignment", "Volunteer", "Status updates"],
          ["13", "Teams", "Volunteer", "Create/join teams"],
          ["14", "Profile", "Volunteer", "Qualifications, availability"],
          ["15", "Admin Dashboard", "Admin", "System statistics"],
          ["16", "Declare Disaster", "Admin", "Official declaration"],
          ["17", "Verify Volunteers", "Admin", "Approval queue"],
          ["18", "Campaign Approval", "Admin", "Review campaigns"],
          ["19", "Notifications", "All", "In-app alerts"],
          ["20", "Settings", "All", "Account preferences"],
        ],
        [400, 2200, 1200, 5560]
      ),
      tableCaption("Table B.1 — Complete mobile screen catalogue"),
    ];
  }

  function appendixC() {
    return [
      ...chapterHeader("", "APPENDIX C", "Installation and Deployment Guide"),
      h2("C.1  Prerequisites"),
      para("Node.js 20 LTS, npm 10+, Docker Desktop, Git, Fly.io account, Neon account, Resend API key, Google OAuth credentials (optional)."),
      h2("C.2  Local Development Setup"),
      numbered("Clone repository: git clone <repo-url> && cd bihar-sahayata"),
      numbered("Server: cd server && npm install && cp .env.example .env.local"),
      numbered("Set DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, RESEND_API_KEY in .env.local"),
      numbered("Run migrations: npx drizzle-kit push"),
      numbered("Seed districts: npm run seed"),
      numbered("Start API: npm run dev (default port 3000)"),
      numbered("Mobile: cd mobile && npm install && npx expo start"),
      numbered("Set EXPO_PUBLIC_API_URL in mobile .env to http://<your-lan-ip>:3000"),
      h2("C.3  Production Deployment (Fly.io)"),
      numbered("Install flyctl and run fly auth login"),
      numbered("From server/: fly launch (select region: Mumbai or Singapore)"),
      numbered("Set secrets: fly secrets set DATABASE_URL=... BETTER_AUTH_SECRET=... etc."),
      numbered("Deploy: fly deploy"),
      numbered("Verify: curl https://<app-name>.fly.dev/api/health"),
      h2("C.4  Postman Collection"),
      para("Import docs/postman/Bihar_Sahayata_Collection.json. Set environment variables baseUrl and authToken after sign-in."),
    ];
  }

  function appendixD() {
    return [
      ...chapterHeader("", "APPENDIX D", "Database Table Quick Reference"),
      para("Nineteen tables in Neon PostgreSQL. See Chapter 5 for full column specifications."),
      makeTable(
        ["#", "Table", "Domain"],
        [
          ["1", "user", "Auth"],
          ["2", "session", "Auth"],
          ["3", "account", "Auth"],
          ["4", "verification", "Auth"],
          ["5", "volunteer_profile", "Volunteer"],
          ["6", "volunteer_qualification", "Volunteer"],
          ["7", "volunteer_team", "Volunteer"],
          ["8", "team_membership", "Volunteer"],
          ["9", "issue_type", "Issue"],
          ["10", "issue", "Issue"],
          ["11", "issue_assignment", "Issue"],
          ["12", "panic_alert", "SOS"],
          ["13", "disaster", "Disaster"],
          ["14", "disaster_team_activation", "Disaster"],
          ["15", "campaign", "Campaign"],
          ["16", "donation", "Campaign"],
          ["17", "campaign_update", "Campaign"],
          ["18", "notification", "System"],
          ["19", "district", "Location"],
        ],
        [600, 3600, 5160]
      ),
      tableCaption("Table D.1 — All 19 database tables by functional domain"),
      ...exp.appendixExtra(),
    ];
  }

  function certificationPage() {
    return [
      pageBreak(),
      ...chapterHeader("", "CERTIFICATION", "Guide and Head of Department"),
      para("This is to certify that the project entitled Bihar Sahayata: A Disaster Relief & Emergency Coordination Platform, submitted by Shubham Kumar Mishra (Roll No. 23) and Atul Sharma (Roll No. 10) of Bachelor of Computer Applications, Semester V, Batch 2023–2026, Patna College, Patna University, is a bonafide record of work carried out under my supervision and submitted in partial fulfilment of the requirements for the degree of Bachelor of Computer Applications."),
      para("The project report has been prepared in accordance with the guidelines prescribed by the Department of Computer Applications, Patna University."),
      ...emptyLine(3),
      makeTable(
        ["Project Guide", "Head of Department"],
        [
          ["Name: _______________________________", "Department of Computer Applications"],
          ["Designation: _________________________", "Patna College, Patna University"],
          ["Signature & Date: ____________________", "Signature & Official Seal: ____________"],
        ],
        [4680, 4680]
      ),
      ...emptyLine(2),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 0 },
        children: [new TextRun({ text: "— End of Bihar Sahayata Project Report —", font: "Arial", size: 22, bold: true, italic: true, color: BLUE })]
      }),
    ];
  }

  return {
    chapter9, chapter10, appendixA, appendixB, appendixC, appendixD,
    certificationPage, phase4CoverPage, phase4TocPage,
  };
};
