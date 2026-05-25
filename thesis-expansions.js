/**
 * Expansion blocks (~50 pages) merged into thesis chapters.
 */
const deep = require('./thesis-deep-content');

module.exports = function createExpansions(H) {
  const { para, h2, h3, bullet, numbered, makeTable, tableCaption, emptyLine, codeBlock } = H;

  const deepParas = (key) => (deep[key] || []).map((t) => para(t));

  const schemaDeep = () => {
    const tables = deep.ch5SchemaDeep();
    return [
      h2("5.14  Detailed Relational Schema Specifications"),
      para("The following subsections document each of the nineteen PostgreSQL tables at column-group level, explaining design rationale and indexing strategy for viva examination."),
      ...tables.flatMap(([name, desc], i) => [
        h3(`5.14.${i + 1}  Table: ${name}`),
        para(desc),
        emptyLine(0),
      ]),
    ];
  };

  return {
    abstractExtra: () => deepParas('ch1Literature').slice(0, 2),

    chapter1Extra: () => [
      ...deepParas('ch1Literature'),
      ...deepParas('ch1Extended'),
      h2("1.10  Stakeholder Analysis"),
      para("Effective disaster platforms must satisfy diverse stakeholders with conflicting operational priorities. Bihar Sahayata stakeholder mapping identifies five primary groups and their platform expectations."),
      makeTable(
        ["Stakeholder", "Primary Need", "Platform Feature", "Success Indicator"],
        [
          ["Flood-affected citizen", "Rapid rescue", "SOS + issue reporting", "Volunteer acknowledgement < 10 min"],
          ["Verified volunteer", "Clear assignments", "Accept/resolution workflow", "Zero duplicate responses"],
          ["NGO coordinator", "Team visibility", "Team management module", "Activated teams during disasters"],
          ["District administrator", "Operational picture", "Admin dashboard", "All active incidents visible"],
          ["Donor / public", "Fund transparency", "Approved campaigns", "Real-time progress accuracy"],
        ],
        [1800, 2200, 2400, 2960]
      ),
      tableCaption("Table 1.6 — Stakeholder analysis with needs and success indicators"),
      h2("1.11  Case Study: 2019 Bihar Floods"),
      para("The 2019 monsoon floods affecting 13 districts illustrate coordination failures Bihar Sahayata addresses. Media documented relief boats reaching visible settlements while neighbouring villages — equally inundated but lacking social media visibility — received assistance days later. A digital incident registry with GPS coordinates and district filtering enables administrators to identify geographic coverage gaps in near real time."),
      h2("1.12  Ethical, Legal, and Privacy Considerations"),
      bullet("Consent: GPS capture occurs only at explicit user action (SOS submit or issue report)."),
      bullet("Data minimisation: No Aadhaar or government ID required at registration."),
      bullet("Volunteer liability: Platform terms clarify volunteers act as independent agents."),
      bullet("Misuse prevention: False SOS penalties and admin escalation deter abuse."),
      bullet("Accessibility: Iconography and Hindi localisation on Phase II roadmap."),
    ],

    chapter2Extra: () => [
      ...deepParas('ch2ObjectivesDeep'),
      h2("2.6  Detailed Use Case Scenarios"),
      h3("UC-01: Citizen SOS During Night Flooding"),
      para("Actor: Priya, citizen in Darbhanga. Flow: water enters home at 02:00 → SOS tap → GPS captured → Haversine finds 7 volunteers within 20 km → nearest accepts within 8 seconds → status ASSIGNED → EN_ROUTE → ON_SITE → RESOLVED. Alternative: no volunteer within 20 km → admin escalation after 4 hours."),
      h3("UC-02: Administrator Declares District Disaster"),
      para("Actor: District admin during Kosi embankment breach. Admin declares HIGH severity disaster for Supaul, activating pre-registered rescue teams. Volunteers receive in-app notifications; campaigns in district flagged for fast-track review."),
      h2("2.7  Quality Attribute Scenarios"),
      makeTable(
        ["Attribute", "Scenario", "Expected Response"],
        [
          ["Performance", "50 concurrent SOS in one district", "API P95 < 1s; no dropped requests"],
          ["Security", "Volunteer calls admin API", "HTTP 403 on every admin route"],
          ["Availability", "Fly.io instance restart", "Health check recovery < 30s"],
          ["Usability", "First-time user SOS", "Complete within 60 seconds"],
        ],
        [1600, 3800, 3960]
      ),
      tableCaption("Table 2.3 — Quality attribute scenarios"),
    ],

    chapter3Extra: () => [
      ...deepParas('ch3ScopeDeep'),
      h2("3.6  User Personas"),
      makeTable(
        ["Persona", "Profile", "Device", "Primary Journey"],
        [
          ["Ramesh, 42", "Farmer, Supaul", "Android 10, 2G", "SOS when embankment breaches"],
          ["Anita, 28", "NGO medic, Patna", "Android 11, 4G", "Accept medical issues"],
          ["Suresh, 50", "Block officer", "Admin tablet", "Declare disaster, verify volunteers"],
          ["Kavita, 35", "Urban donor", "Android 12", "Donate to verified campaigns"],
        ],
        [1400, 2800, 1800, 3360]
      ),
      tableCaption("Table 3.6 — User personas"),
      h2("3.7  Capacity and Volume Assumptions"),
      para("Peak load: 500 concurrent users, 10 SOS/minute, 30 issues/minute during state-wide flood. Normal load: 50 DAU, 5 SOS/month. Neon autoscaling and Fly.io horizontal scaling provide headroom within academic free tiers."),
    ],

    chapter4Extra: () => [
      ...deepParas('ch4MethodologyDeep'),
      ...deepParas('ch4Extended'),
      h2("4.8  SDLC Model Comparison"),
      makeTable(
        ["Model", "Fit", "Rationale"],
        [
          ["Waterfall", "Poor", "Requirements unstable until prototype tested"],
          ["Agile/Scrum", "Excellent", "Sprint delivery and continuous testing"],
          ["Spiral", "Moderate", "Heavier than needed for team size"],
          ["V-Model", "Poor", "Testing too late for life-safety software"],
        ],
        [1800, 2200, 5360]
      ),
      tableCaption("Table 4.9 — SDLC comparison"),
      h2("4.9  Requirements Traceability (Sample)"),
      makeTable(
        ["Req", "Objective", "Component", "Test"],
        [
          ["FR-C02", "O-01 SOS", "panic_alert", "TC-SOS-01"],
          ["FR-V03", "O-03 Workflow", "issue FSM", "TC-ISS-05"],
          ["FR-A01", "O-05 Disaster", "disaster table", "TC-ADM-02"],
        ],
        [1200, 2000, 3160, 3000]
      ),
      tableCaption("Table 4.10 — Traceability sample"),
      h2("4.10  Version Control and Release Strategy"),
      para("Git: main (production), develop (integration), feature/* (sprints). Tags v0.1.0–v1.0.0 mark sprint completions. Fly.io deploy from main only after Postman regression passes."),
    ],

    chapter5Extra: () => [
      h2("5.11  Normalisation Analysis"),
      para("Schema achieves 3NF: non-key attributes depend only on primary keys. Junction tables resolve many-to-many relationships. campaign.raisedAmount denormalised synchronously on donation for read performance."),
      h2("5.12  Sample API Payloads"),
      codeBlock('POST /api/panic/alert\n{\n  "latitude": 25.5941,\n  "longitude": 85.1376,\n  "message": "Water rising, 4 on roof"\n}'),
      codeBlock('Response 201\n{\n  "data": {\n    "alertId": "uuid",\n    "status": "PENDING",\n    "volunteersNotified": 12\n  }\n}'),
      tableCaption("Figure 5.2 — Sample SOS request/response"),
      h2("5.13  Scalability Considerations"),
      bullet("Stateless API enables horizontal Fly.io scaling."),
      bullet("Neon read replicas for dashboard aggregates."),
      bullet("Future Redis cache for district and issue type lists."),
      ...schemaDeep(),
    ],

    chapter6Extra: () => [
      ...deepParas('ch6TechDeep'),
      h2("6.11  TypeScript and Type Safety"),
      para("strict: true, noImplicitAny, strictNullChecks. Drizzle types propagate to services; Zod validates runtime input."),
      h2("6.12  Error Handling Matrix"),
      makeTable(
        ["Error", "HTTP", "Client Message"],
        [
          ["Validation", "400", "Field-level errors"],
          ["Unauthenticated", "401", "Please sign in"],
          ["Forbidden", "403", "Insufficient permission"],
          ["Invalid transition", "409", "Cannot change status"],
          ["Rate limited", "429", "Too many requests"],
        ],
        [2400, 1200, 5760]
      ),
      tableCaption("Table 6.10 — Error handling matrix"),
      h2("6.13  Mobile Build and Distribution"),
      para("Expo Go for development; EAS Build APK for viva demonstration. Credentials via EAS; never committed to Git."),
    ],

    chapter7Extra: () => [
      ...deepParas('ch7RequirementsDeep'),
      h2("7.8  User Story Backlog Sample"),
      makeTable(
        ["ID", "Story", "Points", "Sprint"],
        [
          ["US-101", "Citizen one-tap SOS", "8", "5"],
          ["US-102", "Volunteer distance-sorted issues", "5", "5"],
          ["US-201", "Admin verify volunteers", "3", "6"],
        ],
        [900, 4960, 900, 2600]
      ),
      tableCaption("Table 7.9 — Sample user stories"),
      h2("7.9  Interface Design Requirements"),
      bullet("SOS button red #DC2626; primary blue #2E75B6."),
      bullet("Minimum 16sp body text; 48dp touch targets."),
      bullet("Dark mode via NativeWind dark: variants."),
    ],

    chapter8Extra: () => [
      ...deepParas('ch8ImplementationDeep'),
      ...deepParas('ch8Extended'),
      h2("8.9  Screen Implementation Mapping"),
      makeTable(
        ["Screen", "Components", "API", "State"],
        [
          ["Citizen Dashboard", "SOS FAB, lists", "GET /issues", "useQuery"],
          ["SOS Screen", "Map, countdown", "POST /panic/alert", "useMutation"],
          ["Volunteer Issues", "FlatList, accept", "GET /issues", "useQuery"],
          ["Admin Dashboard", "Stat cards", "GET /admin/stats", "useQuery"],
        ],
        [2000, 2400, 2400, 2560]
      ),
      tableCaption("Table 8.4 — Screen to API mapping"),
      h2("8.10  Migration History"),
      numbered("001_initial_schema — 19 tables."),
      numbered("002_add_indexes — geospatial indexes."),
      numbered("003_seed_districts — 38 districts."),
      numbered("004_seed_issue_types — four types."),
    ],

    chapter9Extra: () => [
      ...deepParas('ch9TestingDeep'),
      h2("9.5  Week-by-Week Activity Log"),
      makeTable(
        ["Week", "Developer A", "Developer B", "Outcome"],
        [
          ["1", "Requirements, ER", "Stack research, repo", "Schema v1"],
          ["2", "Drizzle schema", "Neon, seeds", "DB live"],
          ["3", "Better Auth", "Zod, RBAC", "Auth working"],
          ["4-5", "Core API", "Panic + Haversine", "API complete"],
          ["6-10", "Deploy, mobile, QA", "Screens, thesis", "Submission"],
        ],
        [800, 3280, 3280, 2000]
      ),
      tableCaption("Table 9.5 — Activity log"),
      h2("9.6  Test Case Catalogue (Sample)"),
      makeTable(
        ["TC", "Module", "Expected"],
        [
          ["TC-SOS-01", "SOS", "201 + volunteers notified"],
          ["TC-RBAC-01", "Auth", "403 on citizen → admin route"],
          ["TC-FSM-01", "Issue", "409 on PENDING→RESOLVED skip"],
        ],
        [900, 2400, 6060]
      ),
      tableCaption("Table 9.6 — Sample test cases"),
    ],

    chapter10Extra: () => [
      ...deepParas('ch10ReferencesDeep'),
      h2("10.4  Standards and Policy Framework"),
      para("IEEE 830-1998 informed requirements structure. ISO/IEC 25010 informed NFR categories. Disaster Management Act, 2005 provides statutory context for SDMA operations."),
    ],

    appendixExtra: () => [
      h2("Appendix E — Consolidated API Domains"),
      para("Fifty REST endpoints organised by domain. Authoritative spec: OpenAPI at /api/docs."),
      makeTable(
        ["Domain", "Count", "Examples"],
        [
          ["Auth", "4", "sign-up, sign-in, session, sign-out"],
          ["Panic/SOS", "2", "alert, status"],
          ["Issues", "6", "CRUD, accept, status, resolve"],
          ["Volunteers", "7", "profile, qualifications, nearby"],
          ["Teams", "7", "create, join, leave, activate"],
          ["Disasters", "7", "declare, list, activate teams"],
          ["Campaigns", "5", "create, donate, updates"],
          ["Admin", "12", "stats, verify, audit"],
        ],
        [2000, 1200, 6160]
      ),
      tableCaption("Table E.1 — API domain summary"),
      h2("Appendix F — Glossary"),
      makeTable(
        ["Term", "Definition"],
        [
          ["SOS", "Highest-priority distress signal with GPS"],
          ["Haversine", "Great-circle distance on Earth"],
          ["FSM", "Finite state machine for issue status"],
          ["RBAC", "Role-based access control"],
        ],
        [2400, 6960]
      ),
      tableCaption("Table F.1 — Glossary"),
      h2("Appendix G — Viva Preparation Topics"),
      bullet("Derive Haversine; contrast with Euclidean distance."),
      bullet("Demonstrate issue FSM invalid transition (409)."),
      bullet("Live SOS flow on Android device."),
      bullet("Explain three-tier architecture and 19-table schema."),
      bullet("Discuss v1 limitations: no FCM, simulated payments."),
    ],
  };
};
