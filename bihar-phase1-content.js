/**
 * Expanded academic content for Bihar Sahayata thesis — Phase 1 (Chapters 1–4)
 * Used by synopsis.js document generator
 */

const META = {
  projectTitle: 'Bihar Sahayata',
  projectSubtitle: 'A Disaster Relief & Emergency Coordination Platform',
  tagline: 'Real-time Volunteer Coordination · Emergency SOS · Relief Fund Management',
  headerLine: 'Bihar Sahayata — Disaster Relief & Emergency Coordination Platform',
  footerLine: 'Patna College, Patna University  ·  BCA Final Year Project, 2023–2026',
  outputFile: 'Bihar_Sahayata_Thesis_Phase1_Ch1-4.docx',
  docType: 'FINAL YEAR PROJECT REPORT',
};

const ABSTRACT_PARAS = [
  'Bihar, one of the most flood-prone states in India, experiences widespread devastation annually due to the overflowing of rivers Ganga, Kosi, Gandak, and Bagmati. According to the National Disaster Management Authority (NDMA), approximately 73 per cent of Bihar\'s total geographical area falls within flood-risk zones, displacing millions of citizens each monsoon season and placing enormous strain on emergency response systems.',
  'Despite the existence of a large volunteer base and numerous active NGOs, emergency coordination in Bihar remains fragmented, reactive, and largely paper-based. The absence of a unified digital platform results in delayed response times, duplication of relief efforts, lack of transparency in fund utilisation, and inadequate volunteer management.',
  'This report presents Bihar Sahayata, a full-stack, mobile-first Disaster Relief and Emergency Coordination Platform purpose-built for the state of Bihar. The platform bridges the critical operational gap between distress-stricken citizens, field-deployed volunteers, and disaster management authorities through a suite of tightly integrated digital tools.',
  'The system architecture encompasses a production-grade Node.js REST API comprising fifty endpoints secured by role-based access control, a serverless PostgreSQL database of nineteen normalised tables, and a cross-platform React Native mobile application serving three distinct user roles: Citizens, Volunteers, and Administrators. Core functionalities include GPS-based SOS panic alerts using the Haversine geolocation algorithm, structured issue reporting and lifecycle tracking, volunteer verification and team management, official disaster declaration workflows, and transparent crowdfunding campaign management.',
  'The platform is engineered to operate reliably on low-bandwidth mobile connections — a critical requirement for disaster-affected zones — and is deployed via Docker containerisation on Fly.io cloud infrastructure. Chapters 1 through 4 of this document establish the contextual foundation, measurable objectives, project boundaries, and development methodology that govern the complete implementation documented in subsequent phases of this thesis.',
];

const KEYWORDS = 'Disaster Relief · Emergency Coordination · React Native · Node.js · Geolocation · Haversine Formula · PostgreSQL · Role-Based Access Control · Volunteer Management · Bihar · Crowdfunding · REST API';

const CH1 = {
  quote: 'Bihar Sahayata transforms disaster response from fragmented, reactive coordination into a unified, data-driven emergency management system — connecting citizens in distress with verified volunteers and authorities in real time.',
  sections: {
    '1.1  The Disaster Landscape of Bihar': [
      'Bihar occupies a geographically vulnerable position in the eastern Indo-Gangetic plain, drained by some of India\'s most volatile river systems. The rivers Ganga, Kosi — often called the "River of Sorrow" — Gandak, and Bagmati routinely breach their banks during the monsoon season, inundating vast swathes of agricultural and residential land. The Kosi river alone has shifted its course by more than 100 kilometres over the past two centuries, making it one of the most unpredictable rivers on the subcontinent.',
      'According to the National Disaster Management Authority (NDMA), approximately 73 per cent of Bihar\'s total geographical area is classified as flood-prone, affecting nearly 76 of its 101 sub-divisions. In the 2019 floods alone, more than 8.1 million people were displaced across 13 districts, and economic losses were estimated at over ₹1,200 crore. These figures underscore not merely a climatic challenge, but a systemic governance and coordination crisis that technology can help mitigate when applied with domain-specific design.',
      'The state\'s topography — a flat alluvial basin with minimal natural drainage — amplifies flood severity. Embankments constructed along major rivers, while intended as protective infrastructure, have in several cases aggravated flooding in adjacent areas by altering natural water flow patterns. Recurring cycles of displacement destroy livelihoods, interrupt education, and strain public health infrastructure, creating compounding vulnerabilities that persist long after floodwaters recede.',
      'Beyond floods, Bihar faces multi-hazard exposure including drought in certain districts, heat waves during summer months, and occasional seismic activity along the Himalayan foothill interface. The State Disaster Management Authority (SDMA) and District Disaster Management Authorities (DDMAs) operate under the framework of the Disaster Management Act, 2005, yet ground-level execution frequently depends on manual communication channels that fail under the volume and urgency of large-scale events.',
    ],
    '1.2  The Coordination Gap': [
      'Despite the well-established nature of Bihar\'s flood crisis, emergency response continues to be hampered by a fundamental coordination deficit. Volunteer groups, NGOs, government relief agencies, and affected citizens operate in silos, with information flowing through informal telephone chains, social media posts, and physical notice boards. The absence of a unified, real-time communication infrastructure produces predictable operational failures.',
      'Citizens in distress are frequently unable to reach verified help quickly. Without a centralised incident registry, duplicate reports and missed locations coexist: multiple volunteers may converge on the same address while neighbouring villages remain unaddressed for hours or days. Relief material distribution lacks real-time visibility, leading to oversupply in accessible areas and critical shortages in remote embankment settlements accessible only by boat.',
      'Financial transparency presents an equally serious challenge. Crowdfunding campaigns on generic platforms lack verification, district-level targeting, and audit trails linking donations to specific relief outcomes. Public trust erodes when contributors cannot observe how funds are deployed, reducing willingness to donate during subsequent disasters — a vicious cycle that weakens community resilience.',
      'Authorities at district and state level lack a consolidated operational picture of active incidents, volunteer availability, and campaign status. Decision-making during peak crisis hours depends on fragmented phone updates rather than structured dashboards. This fragmentation is not a problem of intent or resources — it is a problem of missing digital infrastructure designed for the specific constraints of disaster-affected populations.',
    ],
    '1.3  Bihar Sahayata — The Platform': [
      'Bihar Sahayata is conceived as a unified, mobile-first digital platform that directly addresses the coordination gap described above. The name — translating to "Bihar Help" or "Bihar Assistance" — reflects the platform\'s core mission: to be a dependable, always-available bridge between those who need help and those who can provide it.',
      'The platform provides three distinct, role-differentiated interfaces that work in concert across a single unified backend. Citizens access SOS panic alerts, structured issue reporting, campaign browsing, and donation capabilities. Volunteers receive assignment workflows, team management tools, qualification tracking, and geospatially filtered task notifications. Administrators govern disaster declarations, volunteer verification, campaign approval, district-level analytics, and escalation pathways.',
      'Architecturally, the system follows a three-tier client-server model: a React Native mobile client (Expo SDK), an Express.js REST API written in TypeScript, and a Neon serverless PostgreSQL database. Fifty REST endpoints expose complete CRUD operations across eight functional domains, each protected by Better Auth session management and role-based access control middleware that enforces permissions at the API layer — not merely in the user interface.',
      'The system is engineered to function on low-bandwidth mobile connections — a non-negotiable requirement given that disaster-affected areas frequently experience degraded network infrastructure. API responses are kept payload-efficient; list endpoints support pagination; and the mobile client employs TanStack Query caching to minimise redundant network requests. GPS coordinates are captured natively via expo-location and transmitted as DECIMAL(10,7) values, enabling sub-metre precision for volunteer proximity matching.',
    ],
    '1.4  Academic and Social Significance': [
      'From an academic perspective, Bihar Sahayata represents a comprehensive synthesis of the core competencies developed across the BCA programme at Patna University. The project integrates relational database design (nineteen normalised tables across six domains), server-side application programming (Node.js/Express with TypeScript), RESTful API architecture (fifty documented endpoints), mobile application development (React Native with twenty screens), cloud infrastructure management (Docker and Fly.io deployment), and algorithmic geospatial computation (Haversine distance queries embedded in PostgreSQL).',
      'From a social perspective, the platform addresses a genuine, well-documented public need. Every component — from the SOS panic alert to the volunteer qualification tracker to the transparent campaign portal — maps directly to a real operational gap identified in Bihar\'s disaster management landscape. The project demonstrates that academic software engineering can produce systems with immediate relevance to civic challenges, not merely theoretical exercises.',
      'The Haversine-based volunteer matching algorithm, the formally defined issue resolution state machine, and the role-separated API security model each constitute discrete computer science contributions within the project scope. Together they illustrate how established algorithms and software patterns, when applied with domain awareness, can improve human outcomes during life-threatening emergencies.',
    ],
    '1.5  Document Organisation': [
      'This thesis is organised as a scholarly reference document guiding the development, evaluation, and deployment of the Bihar Sahayata platform. Phase 1 (the present document) covers Chapters 1 through 4: Introduction, Objectives, Scope, and Methodology — establishing the contextual, goal-oriented, and procedural foundation for the technical work.',
      'Phase 2 (Chapters 5–6) documents System Architecture with complete entity-relationship diagrams, full schema details for all nineteen database tables, and the complete Tools and Technologies stack with technical justifications. Phase 3 (Chapters 7–8) addresses System Requirements, Implementation Details, and Expected Outcomes. Phase 4 (Chapters 9–10 and Appendices) covers Project Timeline, Testing, References, API documentation, and user manuals.',
      'Readers approaching this document sequentially will first understand why the platform exists, what it must achieve, what boundaries govern its delivery, and how it was built — before encountering the detailed technical specifications that follow. Cross-references between chapters use consistent figure and table numbering within each chapter (e.g., Figure 2.1, Table 3.1) to support navigation in both print and digital formats.',
    ],
    '1.6  Problem Statement': [
      'The formal problem addressed by this project can be stated as follows: In Bihar\'s disaster-prone regions, there exists no integrated digital system that simultaneously enables (a) citizens to transmit geolocated emergency alerts to nearby verified responders, (b) volunteers to accept, track, and resolve incidents through a defined workflow, (c) administrators to declare disasters and coordinate district-level response, and (d) the public to contribute to verified relief campaigns with transparent fund tracking — all while enforcing strict role-based security and operating on constrained mobile networks.',
      'Existing partial solutions — social media appeals, government helplines, NGO spreadsheets — address individual facets but fail to unify stakeholders under a single source of operational truth. Bihar Sahayata is designed to fill this integration gap without replacing established institutions, but by providing the digital infrastructure through which they coordinate more effectively.',
    ],
    '1.7  Existing Systems and Limitations': [
      'Several systems partially address disaster management in India, yet none fulfil the integrated requirements of the Bihar Sahayata use case. The NDMA\'s National Emergency Response Centre operates a national disaster helpline (112 integration in several states) but does not provide citizen-facing mobile workflows, volunteer task assignment, or crowdfunding transparency at state granularity.',
      'The Government of India\'s UMANG platform aggregates government services but lacks domain-specific disaster coordination features such as Haversine volunteer matching, issue state machines, or team activation during declared disasters. Generic crowdfunding platforms (Ketto, Milaap) facilitate donations but do not tie campaigns to verified administrators, district metadata, or operational incident context.',
      'Social media (WhatsApp groups, Twitter/X threads) enables rapid informal coordination but suffers from unverifiable information, no structured incident lifecycle, no role-based access control, and signal-to-noise degradation during large events. Spreadsheet-based NGO operations lack real-time synchronisation and mobile-first design for field volunteers operating in wading-depth flood conditions.',
      'Bihar Sahayata learns from these limitations by combining verified identity (email verification, Google OAuth, admin-approved volunteer status), structured data (typed issues, enumerated severities, formal state transitions), geospatial intelligence (database-level Haversine queries), and mobile-first delivery (React Native) into a single cohesive platform rather than another isolated partial tool.',
    ],
  },
  roleMatrix: [
    ['Citizen', 'Flood-affected residents, general public', 'SOS Panic Alert · Issue Reporting · Campaign Donation · Status Tracking · Profile Management'],
    ['Volunteer', 'Verified field responders, NGO workers', 'Accept Issues · Team Management · Qualification Tracking · Resolution Workflow · Availability Status'],
    ['Administrator', 'SDMA officials, district authorities', 'Disaster Declaration · Team Activation · Campaign Approval · Volunteer Verification · Analytics Dashboard'],
  ],
  emergencyFlow: [
    ['ALERT', 'Citizen triggers SOS; GPS captured; countdown optional'],
    ['MATCH', 'Haversine query finds volunteers within 20 km radius'],
    ['ASSIGN', 'Nearest available volunteer accepts; state → Assigned'],
    ['RESPOND', 'En Route → On Site → Resolved lifecycle tracking'],
  ],
};

const CH2 = {
  primaryObjectives: [
    ['O-01', 'Emergency SOS System', 'Implement a one-tap panic alert mechanism that captures the citizen\'s GPS coordinates and identifies all verified volunteers within a 20 km radius, notifying them within ten seconds of alert submission.', 'Functional demo with Postman/mobile; volunteer list returned; alert record persisted'],
    ['O-02', 'Issue Reporting & Tracking', 'Enable structured reporting of emergency incidents (flood, medical, rescue, infrastructure) with severity classification, victim count, GPS coordinates, and full lifecycle tracking from Pending through Resolved.', 'All issue types creatable; state transitions enforced; audit trail queryable'],
    ['O-03', 'Volunteer Coordination Workflow', 'Build a complete volunteer management system enabling acceptance, en-route confirmation, on-site check-in, and issue resolution with a defined multi-stage state machine.', 'State machine rejects invalid transitions; timestamps recorded per stage'],
    ['O-04', 'Team Management', 'Allow volunteers to create and manage rescue, medical, relief, and general teams with membership controls, role assignments, and administrator activation during declared disasters.', 'Teams CRUD operational; admin activation toggles team disaster mode'],
    ['O-05', 'Disaster Management Dashboard', 'Provide administrators with tools to declare official disasters, assign severity levels, monitor active incidents by district, activate volunteer teams, and manage disaster status in real time.', 'Disaster declaration API; district-filtered incident views'],
    ['O-06', 'Transparent Crowdfunding', 'Enable creation and approval of verified relief campaigns with defined goals, real-time donation tracking, progress percentages, and donor transparency.', 'Campaign approval workflow; donation totals update atomically'],
    ['O-07', 'Role-Based Access Control', 'Enforce strict, non-bypassable permission separation between Citizens, Volunteers, and Administrators at the API middleware layer.', 'Unauthorized role requests return HTTP 403; penetration test checklist passed'],
    ['O-08', 'Cross-Platform Mobile Application', 'Deliver a React Native mobile application covering twenty screens across all user roles, accessible on Android 10+ and iOS 14+, with offline-resilient request handling.', 'App runs on emulator and physical device; role-specific navigation verified'],
  ],
  secondaryObjectives: [
    ['API Documentation', 'Produce a complete OpenAPI (Swagger) specification for all fifty endpoints, accessible via interactive browser interface at /api/docs.'],
    ['Security Hardening', 'Implement HTTP security headers via Helmet, configurable rate limiting to prevent denial-of-service attacks, and comprehensive input validation using Zod schema validators.'],
    ['Cloud Readiness', 'Achieve production deployment on Fly.io with Docker containerisation, demonstrating the full DevOps lifecycle from local development to cloud-hosted service.'],
    ['Code Quality', 'Maintain strict TypeScript typing throughout the backend codebase, enforcing compile-time correctness and reducing runtime error probability.'],
    ['Database Efficiency', 'Implement Haversine-based geospatial queries at the database level to minimise data transfer and maximise query performance during high-load disaster events.'],
  ],
};

const CH3 = {
  inScope: [
    ['Emergency SOS Module', 'GPS-triggered panic alert with optional countdown timer, volunteer radius search (20 km), and alert status tracking until resolution.'],
    ['Issue Reporting System', 'Multi-field incident forms with type classification (flood, medical, rescue, infrastructure), severity levels, victim details, photo attachment support, and GPS coordinates.'],
    ['Volunteer Lifecycle', 'Full onboarding, admin verification, qualification logging, team membership, availability toggling, and issue resolution tracking.'],
    ['Disaster Management', 'Official disaster declaration, severity updates, district monitoring, and team activation by administrators during active disasters.'],
    ['Campaign & Donations', 'Campaign creation, admin approval workflow, donation processing (Razorpay-ready demo integration), real-time progress percentage, and campaign update posts.'],
    ['Role-Based Dashboards', 'Distinct, permission-controlled dashboards for Citizen, Volunteer, and Administrator roles with role-appropriate navigation.'],
    ['District Data', 'All 38 Bihar districts seeded into the database with searchable metadata for district-level filtering and reporting.'],
    ['Cloud Deployment', 'Docker-containerised REST API deployed on Fly.io with environment secrets management and health check endpoints.'],
    ['Authentication', 'Email/password with verification via Resend, Google OAuth social login, and dual session modes (Bearer token for mobile, HTTP-only cookies for web).'],
    ['API Documentation', 'OpenAPI interactive documentation for all fifty endpoints with request/response schema examples.'],
  ],
  outOfScope: [
    ['FCM Push Notifications', 'Q1 2026', 'Firebase Cloud Messaging integration for real-time volunteer alerts without polling — requires FCM project setup and device token registry.'],
    ['WebSocket Real-time Updates', 'Q1 2026', 'Live status updates for active issues without page refresh, using Socket.io — reduces polling overhead during concurrent incidents.'],
    ['SMS Alerts (MSG91/Twilio)', 'Q2 2026', 'Reach non-smartphone users in disaster zones via SMS-based emergency alerts — critical for elderly populations.'],
    ['Live Map Tracking', 'Q2 2026', 'Real-time GPS tracking of volunteer positions during active rescue operations — requires background location permissions and battery optimisation.'],
    ['AI Severity Prediction', 'Q3 2026', 'Machine learning model to auto-classify issue severity and suggest optimal volunteer dispatch based on historical incident data.'],
    ['SDMA API Integration', 'Q3 2026', 'Two-way data exchange with the State Disaster Management Authority\'s official systems — subject to government API availability.'],
    ['Offline Sync Engine', 'Q4 2026', 'Full offline data capture with automatic sync when connectivity is restored — complex conflict resolution required.'],
  ],
  nfr: [
    ['Performance', 'API p95 response time under 500 ms for standard CRUD; Haversine volunteer query under 200 ms for 10,000 volunteer records'],
    ['Availability', '99.5% uptime target on Fly.io with health checks and automatic instance restart'],
    ['Security', 'HTTPS only in production; Helmet headers; rate limiting; Zod validation; RBAC on all protected routes'],
    ['Usability', 'Mobile UI completable with one hand where possible; SOS accessible within two taps from home screen'],
    ['Scalability', 'Neon serverless PostgreSQL auto-scales read replicas during traffic spikes'],
  ],
};

const CH4 = {
  agilePhases: [
    ['1', 'Planning & Schema Design', 'Weeks 1–2', 'Requirements analysis · ER modelling · Technology stack selection · UI wireframes · Competitive study · Drizzle schema draft for 19 tables'],
    ['2', 'Authentication System', 'Weeks 2–3', 'Better Auth integration · Email verification (Resend) · Google OAuth · Session middleware · Role assignment on registration'],
    ['3', 'Middleware & Validation', 'Weeks 3–4', 'Zod request schemas · RBAC middleware · Helmet · Rate limiter · Error handler · Logging infrastructure'],
    ['4', 'Core API Routes', 'Weeks 4–7', 'Issue reporting · Volunteer profiles · Team management · Panic/SOS endpoints · Assignment workflow · 31 core endpoints'],
    ['5', 'Campaigns & Donations', 'Weeks 7–8', 'Campaign CRUD · Admin approval · Donation recording · Progress calculation · Campaign updates'],
    ['6', 'Admin & District Seeding', 'Weeks 8–9', 'Disaster declaration APIs · Admin dashboard stats · 38 district seed script · Volunteer verification'],
    ['7', 'Security Hardening', 'Weeks 9–10', 'Security audit · Input sanitisation review · CORS configuration · Production environment variables'],
    ['8', 'Cloud Deployment', 'Weeks 10–11', 'Dockerfile · Fly.io deployment · Neon production database · Health checks · CI smoke tests'],
    ['9', 'Mobile Application', 'Weeks 11–14', '20 React Native screens · Expo Router navigation · TanStack Query integration · GPS and SecureStore · Role-based UI'],
    ['10', 'Testing & Documentation', 'Weeks 14–15', 'Postman collection · OpenAPI spec · Integration testing · Thesis documentation · User flow validation'],
  ],
  stateMachine: [
    ['Pending', 'Initial state upon issue submission by citizen', '—', 'Awaiting volunteer acceptance'],
    ['Assigned', 'Volunteer has accepted responsibility', 'Volunteer Accepts', 'Volunteer confirmed available'],
    ['En Route', 'Volunteer travelling to incident location', 'Departs', 'GPS optionally logged'],
    ['On Site', 'Volunteer arrived at location', 'Arrives', 'Field assessment begins'],
    ['Resolved', 'Issue successfully closed', 'Completes', 'Terminal success state'],
    ['Escalated', 'Administrator intervention required', 'Admin Escalates', 'May re-assign to new volunteer'],
  ],
};

module.exports = { META, ABSTRACT_PARAS, KEYWORDS, CH1, CH2, CH3, CH4 };
