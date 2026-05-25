const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TabStopType, TabStopPosition, NumberFormat
} = require('docx');
const fs = require('fs');

// ── helpers ────────────────────────────────────────────────────────────────

const BLUE  = "1F3864";   // dark navy
const LBLUE = "2E75B6";   // medium blue
const CYAN  = "D6E4F0";   // light blue tint for table header fill
const LGRAY = "F2F2F2";   // light gray for alt rows
const WHITE = "FFFFFF";
const BLACK = "000000";
const DARK  = "2C2C2C";

const border1 = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const cellBorders = { top: border1, bottom: border1, left: border1, right: border1 };
const noBorder   = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders  = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 36, color: BLUE })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 28, color: LBLUE })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: DARK })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { before: 100, after: 160, line: 360 },
    children: [new TextRun({
      text,
      font: "Arial",
      size: opts.size || 22,
      bold: opts.bold || false,
      italic: opts.italic || false,
      color: opts.color || DARK
    })]
  });
}

function emptyLine(n = 1) {
  const lines = [];
  for (let i = 0; i < n; i++) lines.push(new Paragraph({ children: [new TextRun("")] }));
  return lines;
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 80, after: 80, line: 320 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 80, after: 80, line: 320 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })]
  });
}

function tableCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 18, italic: true, color: "555555" })]
  });
}

function headerRow(cells, widths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((c, i) => new TableCell({
      borders: cellBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: "1F3864", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 150, right: 150 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: c, bold: true, font: "Arial", size: 20, color: WHITE })]
      })]
    }))
  });
}

function dataRow(cells, widths, shade = false) {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      borders: cellBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: shade ? LGRAY : WHITE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 150, right: 150 },
      children: [new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 300 },
        children: [new TextRun({ text: c, font: "Arial", size: 20, color: DARK })]
      })]
    }))
  });
}

function makeTable(headers, rows, widths) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      headerRow(headers, widths),
      ...rows.map((r, i) => dataRow(r, widths, i % 2 === 1))
    ]
  });
}

function dividerPara() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
    children: [new TextRun("")]
  });
}

function chapterHeader(num, title, subtitle) {
  return [
    pageBreak(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 100 },
      children: [new TextRun({ text: `CHAPTER ${num}`, font: "Arial", size: 28, bold: true, color: LBLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: title, font: "Arial", size: 44, bold: true, color: BLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 300 },
      children: [new TextRun({ text: subtitle, font: "Arial", size: 22, italic: true, color: "555555" })]
    }),
    dividerPara()
  ];
}

// ── Cover Page ─────────────────────────────────────────────────────────────
function coverPage() {
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
      spacing: { before: 120, after: 60 },
      children: [new TextRun({ text: "PROJECT REPORT", font: "Arial", size: 32, bold: true, color: LBLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: "(Phase I: Chapters 1 – 4)", font: "Arial", size: 22, italic: true, color: "888888" })]
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
      children: [new TextRun({ text: "A Disaster Relief & Emergency Coordination Platform", font: "Arial", size: 26, italic: true, color: DARK })]
    }),
    ...emptyLine(2),
    dividerPara(),
    ...emptyLine(1),
    makeTable(
      ["Field", "Details"],
      [
        ["Student Names", "Shubham Kumar Mishra  &  Atul Sharma"],
        ["Roll Numbers", "23 (Shubham Kumar Mishra)  |  10 (Atul Sharma)"],
        ["Registration Numbers", "202324200065 (Shubham)  |  202324200020 (Atul)"],
        ["Programme", "Bachelor of Computer Applications — Semester V"],
        ["College", "Patna College, Patna University"],
        ["Session", "2023 – 2026"],
        ["Academic Year", "2025 – 2026"],
        ["Project Guide", "___________________________"],
        ["Designation", "___________________________"],
      ],
      [2800, 6560]
    ),
    ...emptyLine(2),
    dividerPara(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 0 },
      children: [new TextRun({ text: "Academic Session: 2025 – 2026", font: "Arial", size: 22, italic: true, color: "555555" })]
    }),
  ];
}

// ── Declaration ────────────────────────────────────────────────────────────
function declarationPage() {
  return [
    ...chapterHeader("", "DECLARATION OF ORIGINALITY", "Student Declaration"),
    para("We, Shubham Kumar Mishra (Roll No. 23) and Atul Sharma (Roll No. 10), students of Bachelor of Computer Applications (BCA), Semester V, Batch 2023–2026, Patna University, do hereby solemnly declare that the project entitled:"),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: '"Bihar Sahayata: A Disaster Relief & Emergency Coordination Platform"', font: "Arial", size: 24, bold: true, italic: true, color: BLUE })]
    }),
    para("submitted in partial fulfilment of the requirements for the degree of Bachelor of Computer Applications, is our original work carried out under the guidance and supervision of our project guide."),
    para("We further declare that:"),
    bullet("This work has not been submitted previously, in whole or in part, to any university or institution for any degree, diploma, or other qualification."),
    bullet("All sources of information and assistance have been duly acknowledged in the References section of this report."),
    bullet("The work presented herein does not violate any existing intellectual property rights of any third party and is in full compliance with the norms prescribed by Patna University."),
    bullet("Any ideas, quotations, data, or diagrams borrowed from published or unpublished sources have been duly reported and cited as per standard bibliographic convention."),
    bullet("The software, code, algorithms, and design presented in this report represent our own intellectual effort, developed during the prescribed academic session."),
    bullet("We accept full academic and professional responsibility for the content presented herein, and acknowledge that any misrepresentation or plagiarism shall make us liable to disciplinary action as per university regulations."),
    ...emptyLine(2),
    makeTable(
      ["Shubham Kumar Mishra", "Atul Sharma"],
      [
        ["Roll No. 23 | BCA Sem. V", "Roll No. 10 | BCA Sem. V"],
        ["Signature: _____________________", "Signature: _____________________"],
        ["Date: _____________________", "Date: _____________________"],
      ],
      [4680, 4680]
    ),
    ...emptyLine(2),
    makeTable(
      ["Project Guide", "Head of Department"],
      [
        ["Name: ___________________________", "Department of Computer Applications"],
        ["Designation: ____________________", "Patna College, Patna University"],
        ["Signature & Date: _______________", "Signature & Seal: _______________"],
      ],
      [4680, 4680]
    ),
  ];
}

// ── Abstract ───────────────────────────────────────────────────────────────
function abstractPage() {
  return [
    ...chapterHeader("", "ABSTRACT", "Project Summary and Keywords"),
    para("Bihar, one of India's most flood-prone states, endures widespread devastation each monsoon season as rivers Ganga, Kosi, Gandak, and Bagmati overflow, inundating millions of acres of agricultural and residential land. According to the National Disaster Management Authority (NDMA), approximately 73 per cent of Bihar's total geographical area falls within designated flood-risk zones, affecting nearly 76 of its 101 sub-divisions. During the 2019 floods alone, more than 8.1 million people were displaced across 13 districts, with economic losses exceeding ₹1,200 crore. These recurring crises impose severe humanitarian and economic costs that demand a structural, technology-driven response."),
    para("Despite the existence of a large volunteer base and hundreds of active non-governmental organisations (NGOs), emergency coordination in Bihar remains fragmented, reactive, and largely dependent on informal communication channels. Volunteer groups, government relief agencies, NGO workers, and affected citizens operate in information silos — communicating through telephone chains, social media posts, and physical notice boards rather than through a unified digital infrastructure. This fragmentation results in duplicated relief efforts, delayed emergency response, opacity in fund utilisation, and the absence of a consolidated operational picture for disaster management authorities."),
    para("This project report presents Bihar Sahayata, a full-stack, mobile-first Disaster Relief and Emergency Coordination Platform purpose-built to address these systemic failures in Bihar's emergency management ecosystem. The name — translating to 'Bihar Help' or 'Bihar Assistance' — reflects the platform's core mission: to serve as a dependable, always-available digital bridge between distress-stricken citizens, field-deployed volunteers, and disaster management authorities."),
    para("The system architecture is built upon a production-grade Node.js REST API comprising 50 endpoints, secured by a comprehensive role-based access control (RBAC) framework. The data layer employs a serverless PostgreSQL database organised into 19 tables across six functional domains, seeded with geospatial metadata for all 38 Bihar districts. The client-facing interface is a cross-platform React Native mobile application — built using Expo SDK — serving three distinct user roles: Citizens, Volunteers, and Administrators."),
    para("Core functionalities include GPS-based SOS panic alerts that use the Haversine great-circle distance algorithm to identify and notify nearby verified volunteers within seconds; a structured incident reporting and lifecycle tracking system with a formally defined six-state resolution machine; comprehensive volunteer verification, qualification management, and team coordination tools; official disaster declaration and severity management workflows for administrative authorities; and a transparent crowdfunding campaign system enabling verified, real-time relief fund collection and disbursement tracking."),
    para("The platform is specifically engineered to operate reliably under low-bandwidth mobile network conditions — a non-negotiable architectural constraint given that disaster-affected zones in Bihar frequently experience severely degraded telecommunications infrastructure. This constraint influences every major technical decision: from the choice of React Native for offline-resilient mobile development, to the stateless, cache-optimised design of the REST API, to the serverless PostgreSQL configuration that auto-scales reads during disaster-event traffic peaks without manual database administration intervention."),
    para("The deployment architecture leverages Docker containerisation for consistent environment parity from development through production, with hosting on the Fly.io global edge cloud infrastructure providing automatic HTTPS enforcement, health monitoring, and zero-downtime rolling deployments. Bihar Sahayata represents a complete, end-to-end demonstration of modern full-stack software engineering principles, encompassing relational database design, API security architecture, geospatial computation, cloud DevOps, and human-centred mobile interface design — all within the academic framework of the Bachelor of Computer Applications programme at Patna University."),
    ...emptyLine(1),
    makeTable(
      ["Keywords"],
      [["Disaster Relief · Emergency Coordination · React Native · Node.js · Geolocation · Haversine Formula · PostgreSQL · Role-Based Access Control · Volunteer Management · Bihar · Crowdfunding · REST API · Expo SDK · TypeScript · Docker · Fly.io · Serverless · Full-Stack Development · BCA Project"]],
      [9360]
    ),
  ];
}

// ── Table of Contents ──────────────────────────────────────────────────────
function tocPage() {
  function tocEntry(num, title, page, indent = 0) {
    return new Paragraph({
      spacing: { before: 100, after: 100 },
      indent: { left: indent * 400 },
      tabStops: [{ type: TabStopType.RIGHT, position: 9000, leader: TabStopPosition.LEADER_DOT }],
      children: [
        new TextRun({ text: `${num}  ${title}`, font: "Arial", size: indent ? 20 : 22, bold: !indent, color: indent ? DARK : BLUE }),
        new TextRun({ text: `\t${page}`, font: "Arial", size: 20, color: DARK })
      ]
    });
  }
  return [
    ...chapterHeader("", "TABLE OF CONTENTS", "Complete Chapter & Section Index"),
    tocEntry("", "Declaration of Originality", "ii"),
    tocEntry("", "Abstract", "iii"),
    tocEntry("", "Table of Contents", "iv"),
    tocEntry("", "List of Tables", "v"),
    tocEntry("", "List of Figures", "vi"),
    tocEntry("", "List of Abbreviations", "vii"),
    dividerPara(),
    tocEntry("1", "INTRODUCTION", "1"),
    tocEntry("1.1", "The Disaster Landscape of Bihar", "1", 1),
    tocEntry("1.2", "River Systems and Geomorphological Vulnerability", "3", 1),
    tocEntry("1.3", "Historical Flood Data and Socio-Economic Impact", "5", 1),
    tocEntry("1.4", "The Coordination Gap in Bihar's Disaster Management", "7", 1),
    tocEntry("1.5", "Existing Initiatives and Their Limitations", "9", 1),
    tocEntry("1.6", "Bihar Sahayata — The Platform", "11", 1),
    tocEntry("1.7", "User Role Architecture", "13", 1),
    tocEntry("1.8", "Academic and Social Significance", "14", 1),
    tocEntry("1.9", "Document Organisation", "16", 1),
    dividerPara(),
    tocEntry("2", "OBJECTIVES OF THE PROJECT", "18"),
    tocEntry("2.1", "Primary Objectives", "18", 1),
    tocEntry("2.2", "Objective Traceability Matrix", "20", 1),
    tocEntry("2.3", "Secondary Objectives", "22", 1),
    tocEntry("2.4", "Success Criteria and Key Performance Indicators", "24", 1),
    tocEntry("2.5", "Constraints and Assumptions", "26", 1),
    dividerPara(),
    tocEntry("3", "SCOPE OF THE PROJECT", "28"),
    tocEntry("3.1", "In-Scope Deliverables", "28", 1),
    tocEntry("3.2", "Functional Boundaries", "30", 1),
    tocEntry("3.3", "Non-Functional Requirements", "32", 1),
    tocEntry("3.4", "Out-of-Scope Items and Future Roadmap", "34", 1),
    tocEntry("3.5", "Risk Register", "36", 1),
    dividerPara(),
    tocEntry("4", "METHODOLOGY", "38"),
    tocEntry("4.1", "Agile Development Methodology", "38", 1),
    tocEntry("4.2", "Sprint Planning and Execution", "40", 1),
    tocEntry("4.3", "Issue Resolution State Machine", "42", 1),
    tocEntry("4.4", "Haversine Geolocation Algorithm", "44", 1),
    tocEntry("4.5", "Data Flow Diagrams", "47", 1),
    tocEntry("4.6", "Security Design Methodology", "49", 1),
    tocEntry("4.7", "Testing Strategy", "51", 1),
    dividerPara(),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "Continued in Phase II, III, and IV Reports...", font: "Arial", size: 20, italic: true, color: "888888" })]
    }),
  ];
}

// ── Chapter 1 ──────────────────────────────────────────────────────────────
function chapter1() {
  return [
    ...chapterHeader("1", "Introduction", "Context, Background, and Motivation"),

    h2("1.1  The Disaster Landscape of Bihar"),
    para("Bihar occupies one of the most geographically vulnerable positions in South Asia — situated in the eastern Indo-Gangetic plain at the confluence of multiple Himalayan and peninsular river systems. The state's terrain is defined by a vast alluvial floodplain that, while extraordinarily fertile and historically the cradle of great civilisations including the Maurya and Gupta empires, presents profound challenges for modern disaster management. The very rivers that sustain Bihar's agrarian economy — providing irrigation water for its paddy fields and fisheries — transform annually into instruments of catastrophic destruction during the monsoon season from June to September."),
    para("Bihar's topography is characterised by an almost imperceptibly gentle southward slope across the North Bihar Plain, which sits on one of the world's deepest alluvial deposits. This geological structure means that river channels are inherently unstable: they shift course dramatically over decades, deposit sediment that raises riverbeds above the surrounding countryside (creating 'perched rivers' that flow above the level of adjacent agricultural land), and are exceptionally susceptible to catastrophic breach during high-discharge events. The consequences for the 125 million people who live in Bihar's flood-prone districts are predictable and relentless."),
    para("According to the National Disaster Management Authority (NDMA), approximately 73 per cent of Bihar's total geographical area — some 68,800 square kilometres — is classified as flood-prone, making it the most flood-vulnerable state in India. The state shares its northern border with Nepal, where the Himalayan foothills receive some of the highest rainfall intensities anywhere on Earth. The rapid, near-frictionless journey of this water across Nepal's Terai lowlands and into Bihar's river system leaves communities with minimal warning time and emergency response windows measured in hours rather than days."),

    h3("The Five Major Threat Rivers"),
    para("The flood risk to Bihar is not a single, uniform phenomenon — it is the composite product of five distinct river systems, each with its own hydrology, flood seasonality, and geographical impact zone. Understanding these rivers individually is essential context for understanding why a unified, GPS-aware coordination platform is not a luxury but a necessity."),
    makeTable(
      ["River", "Source", "Districts at Risk", "Key Characteristic"],
      [
        ["Ganga (Ganges)", "Gangotri Glacier, Uttarakhand", "Patna, Bhojpur, Buxar, Bhagalpur, Munger", "Receives discharge from all major tributaries; seasonal backwater flooding affects downstream districts"],
        ["Kosi", "Nepal Himalayas (Arun, Sun Kosi, Tamur confluence)", "Supaul, Saharsa, Madhepura, Araria, Purnea", "Known as the 'River of Sorrow'; has shifted course 112 km westward since the 1700s; most unpredictable river in the subcontinent"],
        ["Gandak (Narayani)", "Tibetan Plateau via Nepal", "East Champaran, West Champaran, Muzaffarpur, Saran", "High sediment load; regular embankment breaches; wide floodplain inundation in North Bihar"],
        ["Bagmati", "Bagmati hills, Nepal (Shivapuri)", "Sitamarhi, Sheohar, Muzaffarpur, Darbhanga, Samastipur", "Highly flashy; steep gradient transition causes rapid inundation; often causes multiple breaches in a single flood season"],
        ["Mahananda", "Mahaldiram Hill, Darjeeling, West Bengal", "Kishanganj, Purnia, Katihar, Araria", "Flows through densely populated Seemanchal region; regularly isolates communities for weeks post-flood"],
      ],
      [1800, 2200, 2600, 2760]
    ),
    tableCaption("Table 1.1 — Bihar's five primary flood threat rivers with source, affected districts, and hydrological characteristics"),

    h2("1.2  River Systems and Geomorphological Vulnerability"),
    para("The Kosi river deserves particular attention given its outsized historical impact on Bihar's disaster landscape. Often called the 'Sorrow of Bihar' (Bihar ka Shok), the Kosi is arguably the most dynamic large river system in the inhabited world. Over the past three centuries, the main Kosi channel has migrated approximately 112 kilometres westward — an average westward migration of about 37 kilometres per century — driven by the enormous sediment load it carries down from the Nepal Himalayas. This migration is not a steady, predictable drift but occurs in sudden, catastrophic avulsions where the river abandons its current channel entirely and captures a new course."),
    para("The 2008 Kosi Flood Event, which occurred when the river breached its eastern embankment at Kusaha in Nepal on 18 August 2008, is the most instructive recent example of this phenomenon's destructive potential. Within 72 hours of the breach, the Kosi had shifted its course approximately 120 kilometres eastward from its embankment-constrained position and was flowing through areas that had not experienced Kosi flooding for over 100 years. The event displaced an estimated 3.3 million people across 993 villages in five Bihar districts — Supaul, Araria, Madhepura, Saharsa, and Purnea — and caused agricultural losses estimated at ₹1,065 crore. Critically, the absence of any real-time digital coordination infrastructure meant that the initial humanitarian response was chaotic, delayed, and massively duplicated across different relief agencies."),
    para("The geological mechanism underlying Bihar's flood vulnerability is equally important. The entire North Bihar Plain is built on alluvium deposits between 500 and 1,500 metres deep, deposited over millions of years by the Himalayan river systems. This unconsolidated sediment offers no resistance to channel migration, makes embankments expensive to maintain (requiring constant raising as river beds aggrade), and means that new flood pathways can be established rapidly once a breach occurs. The average elevation differential between the main Kosi embankments and the surrounding farmland has grown to over 3 metres in some reaches — meaning that an embankment breach releases water into an effectively bowl-shaped landscape from which there is no rapid natural drainage."),

    h2("1.3  Historical Flood Data and Socio-Economic Impact"),
    para("Bihar's flood history is not a series of exceptional events separated by long intervals of normalcy — it is a near-continuous cycle of annual inundation punctuated by catastrophic mega-floods. The following table presents a decade of significant flood events, illustrating the regularity and scale of the humanitarian crisis that Bihar Sahayata is designed to address."),
    makeTable(
      ["Year", "Rivers Involved", "Districts Affected", "Persons Displaced", "Economic Loss"],
      [
        ["2019", "Ganga, Gandak, Bagmati, Kosi", "13", "8.1 million", "₹1,200+ crore"],
        ["2017", "Gandak, Bagmati, Kamla Balan", "19", "17.1 million", "₹2,500 crore"],
        ["2016", "Bagmati, Kamla Balan, Adhwara Group", "11", "6.2 million", "₹820 crore"],
        ["2015", "Ganga, Sone, Punpun (South Bihar)", "8", "1.4 million", "₹310 crore"],
        ["2014", "Kosi, Mahananda, Ganga", "12", "5.7 million", "₹950 crore"],
        ["2013", "Kosi, Kamla Balan, Bagmati", "17", "12.3 million", "₹1,800 crore"],
        ["2012", "Ganga, Gandak, Burhi Gandak", "9", "4.1 million", "₹490 crore"],
        ["2011", "Bagmati, Adhwara Group, Kamla", "11", "3.8 million", "₹420 crore"],
        ["2010", "All major rivers", "22", "14.7 million", "₹2,100 crore"],
        ["2008", "Kosi (avulsion event)", "5", "3.3 million", "₹1,065 crore"],
      ],
      [900, 2200, 1700, 1800, 2760]
    ),
    tableCaption("Table 1.2 — Ten-year historical flood impact data for Bihar (2008–2019); Source: BSDMA Annual Reports, NDMA"),
    para("The aggregate numbers are staggering: across these ten years alone, Bihar experienced an estimated 76.7 million individual displacement events, with total economic losses exceeding ₹11,655 crore. These figures do not capture indirect losses — the destruction of livestock and agricultural equipment, the erosion of soil fertility by flood sedimentation, the permanent migration of economically active youth away from flood-prone districts, or the long-term public health consequences of waterborne disease outbreaks following flood events."),
    para("The socio-economic impact of these floods falls disproportionately on the most vulnerable segments of Bihar's population: smallholder farmers and agricultural labourers who lack the financial reserves to absorb annual crop losses; Dalit and Adivasi communities concentrated in low-lying areas historically assigned to marginalised groups; women and elderly persons who face elevated risk during flood evacuations; and children whose education is disrupted by school closures and displacement. Bihar consistently ranks among India's lowest-income states, with a per capita income approximately one-third the national average — a structural condition that compounds the impact of each flood event and inhibits community recovery."),

    h2("1.4  The Coordination Gap in Bihar's Disaster Management"),
    para("Despite the well-documented scale and regularity of Bihar's flood crisis, and despite significant investments in physical flood control infrastructure (embankments, flood forecasting stations, and early warning systems), emergency response continues to be fundamentally hampered by a coordination deficit. This is not primarily a problem of resources or intent — Bihar has a substantial volunteer base, active NGOs, and government disaster management agencies. The fundamental problem is architectural: there is no unified digital infrastructure through which these assets can be coordinated in real time."),
    para("The current operational reality of Bihar's disaster response can be characterised across four critical failure modes, each of which Bihar Sahayata is specifically engineered to address:"),
    h3("Failure Mode 1: Fragmented Citizen Communication"),
    para("When a flood event strikes, affected citizens have no reliable, structured mechanism for reporting their location and needs to verified responders. Communication occurs through informal channels — telephone calls to local politicians or officials, WhatsApp messages to known contacts, social media posts that may or may not reach relevant parties, or physical attempts to reach elevated ground and attract attention. These channels are characterised by high latency (the interval between distress and the first meaningful response), low reliability (messages frequently fail to reach parties with the capacity to respond), and absence of any geographic or prioritisation logic (a citizen with minor property damage and a citizen facing life-threatening flood waters compete equally for attention through the same informal channels)."),
    h3("Failure Mode 2: Volunteer Coordination Without Visibility"),
    para("Bihar's disaster response ecosystem includes a large and committed volunteer base — individuals affiliated with NGOs, student organisations, religious institutions, and informal community groups who mobilise during flood events. However, in the absence of any centralised registry or coordination platform, these volunteers operate without visibility into what other volunteers are doing. The common result is that multiple volunteer teams respond to the same incident (typically one that has attracted social media attention) while other affected areas in the same district receive no response at all. Duplicate response not only wastes precious volunteer time and resources but can create confusion and conflict at the rescue site. Meanwhile, the unaddressed incidents escalate."),
    h3("Failure Mode 3: Opacity in Relief Fund Management"),
    para("Public trust in disaster relief donations is chronically undermined by the opacity of fund management processes. Donors have no mechanism to track whether donated funds reached intended beneficiaries, at what speed, and for what specific purposes. This opacity creates a vicious cycle: public trust erodes, donation volumes in subsequent disasters decrease, and genuine relief organisations struggle to raise the funds required for effective response. Bihar Sahayata's transparent campaign management system — with real-time progress tracking, verified campaign approval workflows, and detailed fund utilisation updates — directly addresses this trust deficit."),
    h3("Failure Mode 4: Absence of a Consolidated Operational Picture"),
    para("District administration officials and State Disaster Management Authority (SDMA) personnel make critical resource allocation decisions during flood events — deciding where to deploy National Disaster Response Force (NDRF) teams, where to pre-position relief materials, and which areas require official disaster declaration to unlock emergency funding. These decisions are currently made on the basis of incomplete, often hours-old information assembled from telephone calls, paper reports, and informal networks. The absence of a real-time digital operational picture results in systematic misallocation of emergency resources precisely when accurate, timely information is most critical."),

    h2("1.5  Existing Initiatives and Their Limitations"),
    para("It is important to acknowledge that Bihar Sahayata does not emerge in a vacuum. Several government and civil society initiatives have attempted to address aspects of Bihar's disaster coordination challenge, and a serious assessment of their limitations informs the design choices made in this platform."),
    makeTable(
      ["Initiative", "Operated By", "Strengths", "Critical Limitations"],
      [
        ["Bihar State Disaster Management Authority (BSDMA) Portal", "Government of Bihar", "Official government authority; integrated with state relief machinery; district-level reporting structure", "Primarily administrative and post-event reporting; limited real-time operational coordination; not designed for citizen direct access during active disasters"],
        ["National Disaster Management Information System (NDMIS)", "NDMA, Govt. of India", "National scale; standardised data formats; integrates satellite imagery", "Designed for macro-level policy, not field-level coordination; requires desktop access; not optimised for low-bandwidth mobile use"],
        ["NGO WhatsApp Networks", "Informal civil society", "Rapid mobilisation; trusted relationships; local knowledge", "No persistent data; no geographic visibility; no authentication; rapidly becomes noise-dominated during large events; no audit trail"],
        ["Bihar Apda Sahayata App (earlier version)", "BSDMA (limited pilot)", "Official government branding; basic SOS functionality", "Limited geographic coverage; infrequent updates; no volunteer management; no crowdfunding integration; poor low-bandwidth performance"],
        ["NDRF Coordinate System", "National Disaster Response Force", "Highly trained teams; standardised response protocols", "Available only for Category A disasters; deployment takes 12-24 hours; does not address community-level volunteer coordination"],
      ],
      [1800, 1900, 2300, 3360]
    ),
    tableCaption("Table 1.3 — Analysis of existing disaster coordination initiatives and their operational limitations"),
    para("The gap that Bihar Sahayata fills is not merely additive to these existing initiatives — it is structurally different. While the existing approaches operate primarily at the institutional level (government-to-government or organisation-to-organisation), Bihar Sahayata operates at the individual level: connecting individual citizens in distress with individual verified volunteers in real time, through a GPS-aware mobile interface that works on low-bandwidth connections, with full audit trails and transparent fund management. This is the missing layer in Bihar's disaster response architecture."),

    h2("1.6  Bihar Sahayata — The Platform"),
    para("Bihar Sahayata is a full-stack digital platform consisting of a Node.js REST API backend, a serverless PostgreSQL database, and a React Native mobile application, designed to provide real-time, GPS-aware disaster relief coordination across all 38 districts of Bihar. The platform's name — translating directly to 'Bihar Help' or 'Bihar Assistance' — reflects its core purpose: to be available, accessible, and actionable precisely when citizens and responders need it most."),
    para("The platform is designed around three fundamental principles that emerge directly from the operational failures described in the preceding sections:"),
    bullet("Immediacy: Every critical interaction — the SOS panic alert, the volunteer notification, the incident status update — must complete within seconds on low-bandwidth mobile connections. Performance is not a nice-to-have; it is a life-safety requirement."),
    bullet("Accountability: Every action taken within the platform is authenticated, role-validated, and audit-logged. This accountability architecture prevents the duplication, opacity, and fraud that characterise informal coordination systems."),
    bullet("Accessibility: The platform must be usable by individuals with basic smartphone literacy, on entry-level Android devices, over 2G/3G connections. Designing for Bihar's median user — not its most technically sophisticated user — is an explicit architectural constraint."),
    para("The platform serves three distinct user roles, each with a tailored interface and permission set:"),
    makeTable(
      ["Role", "Primary Users", "Core Capabilities"],
      [
        ["Citizen", "Flood-affected residents, general public, family members of affected persons", "GPS-based SOS Panic Alert with countdown timer · Structured incident reporting with severity classification · Donation to verified relief campaigns · Real-time tracking of reported issue status · Notification of nearby disaster declarations"],
        ["Volunteer", "Verified field responders, NGO workers, student volunteers, medical professionals", "Accept and respond to reported issues · GPS-tracked en-route and on-site status updates · Volunteer team creation and management · Qualification and certification logging · Response history and performance tracking"],
        ["Administrator", "SDMA officials, District Magistrates, authorised NGO coordinators", "Official disaster declaration with severity levels · Multi-district incident monitoring dashboard · Volunteer team activation during declared disasters · Campaign approval and fund oversight · System-wide analytics and audit logs"],
      ],
      [1400, 2500, 5460]
    ),
    tableCaption("Table 1.4 — Role matrix: User types, intended users, and core capabilities within Bihar Sahayata"),
    para("The three roles are not isolated from one another — they operate as a coordinated system. When a Citizen submits a SOS panic alert, the system automatically identifies and notifies nearby verified Volunteers. When a Volunteer accepts an issue and marks it as resolved, the Citizen who submitted it receives a status notification and the Administrator's dashboard is updated. When an Administrator declares an official disaster for a district, all Volunteers registered in that district receive activation notifications and their teams become eligible for disaster-mode deployment. This interconnection across roles is what distinguishes Bihar Sahayata from a collection of separate tools and makes it a genuine coordination platform."),

    h2("1.7  User Role Architecture and Interaction Model"),
    para("Understanding how the three roles interact requires a precise description of the authentication and permission system that governs every API request. Bihar Sahayata implements Role-Based Access Control (RBAC) at the middleware layer of the Express.js API — meaning that permission checks occur before any business logic executes, and cannot be bypassed through any client-side manipulation."),
    para("Every registered user is assigned exactly one role at account creation time. The role is stored in the database and encoded in the authenticated session token. When a request arrives at any protected API endpoint, the RBAC middleware validates both the authentication (is this a valid authenticated session?) and the authorisation (does this user's role have permission to perform this action on this resource?). Requests that fail either check receive a 401 Unauthorized or 403 Forbidden response respectively, with no partial execution of the requested operation."),
    para("Volunteer accounts require an additional verification step beyond basic registration: a Volunteer account begins in an 'unverified' state and can only access volunteer-specific functionality after an Administrator has reviewed and approved the account. This two-stage verification process prevents untrained or malicious actors from registering as volunteers and receiving SOS alert notifications. The verification workflow is itself managed through the Administrator dashboard, with email notifications sent to both the volunteer and the approving administrator via the Resend transactional email API."),

    h2("1.8  Academic and Social Significance"),
    para("The Bihar Sahayata project occupies a distinctive position at the intersection of academic rigour and genuine social utility. This dual significance justifies both the scope of the project and the depth of technical implementation described in this report."),
    h3("Academic Significance"),
    para("From an academic perspective, Bihar Sahayata represents a comprehensive synthesis and practical application of the core competencies developed across the BCA programme at Patna University. The project integrates knowledge and skills from the following curriculum areas into a single coherent software product:"),
    bullet("Database Management Systems: Relational database design, normalisation (3NF), SQL query optimisation, index design, and the practical application of a modern ORM (Drizzle) for type-safe database interactions."),
    bullet("Data Structures and Algorithms: The implementation of the Haversine great-circle distance algorithm for geospatial volunteer matching, executed within PostgreSQL SQL queries for maximum performance efficiency."),
    bullet("Computer Networks and Web Technologies: The design and implementation of a RESTful API architecture following HTTP/1.1 specification, including proper use of HTTP verbs, status codes, headers, and authentication tokens."),
    bullet("Software Engineering: The application of Agile development methodology, sprint planning, state machine modelling (the issue resolution lifecycle), and formal requirements traceability."),
    bullet("Operating Systems and Cloud Computing: Docker containerisation, environment variable management, cloud deployment on Fly.io, and the architectural principles of stateless, horizontally scalable services."),
    bullet("Security Fundamentals: JWT-based authentication, bcrypt password hashing, HTTP security headers (via Helmet), rate limiting, input validation (via Zod), and OWASP-aligned security practices."),
    h3("Social Significance"),
    para("From a social perspective, Bihar Sahayata addresses a genuine, well-documented, and persistently unresolved public need. Every component of the platform maps directly to a real operational gap identified in Bihar's disaster management landscape through extensive analysis of NDMA reports, BSDMA publications, and academic literature on South Asian disaster response systems."),
    para("The platform's potential social impact extends beyond its immediate functional scope. By providing a transparent, auditable record of disaster relief activities — incidents reported, volunteers dispatched, funds raised and disbursed — Bihar Sahayata creates the data infrastructure for evidence-based disaster policy-making. Historical incident data accumulated over multiple flood seasons can identify chronic high-risk micro-zones that may not appear in district-level statistics, enabling targeted infrastructure investment and community resilience programmes."),

    h2("1.9  Document Organisation"),
    para("This project report is structured as a comprehensive scholarly and technical reference document, organised to guide the reader from contextual understanding through technical implementation to evaluation and future development planning. Given the depth of content required for a full 150-page report, the document is divided into four sequential phases, each corresponding to a separate submission document:"),
    makeTable(
      ["Phase", "Chapters Covered", "Content Focus", "Approx. Pages"],
      [
        ["Phase I (This Document)", "Chapters 1–4", "Introduction & context, project objectives, scope definition, development methodology", "35–40"],
        ["Phase II", "Chapters 5–6", "Complete system architecture with ER diagrams, all 19 database tables, API design, tools and technology stack with detailed justifications", "35–40"],
        ["Phase III", "Chapters 7–8", "System requirements specifications, full implementation details, code walkthrough, testing results and outcomes", "35–40"],
        ["Phase IV", "Chapters 9–10 + Appendices", "Project timeline, conclusion, complete references, API documentation appendix, user manual, database schema appendix", "35–40"],
      ],
      [1800, 1800, 3960, 1800]
    ),
    tableCaption("Table 1.5 — Four-phase report structure with chapter coverage and content focus"),
    para("Within Phase I, the chapters are structured as follows:"),
    bullet("Chapter 1 (Introduction): This chapter. Provides the complete contextual foundation for the project — the disaster landscape of Bihar, the coordination gap in emergency management, analysis of existing initiatives and their limitations, an overview of the Bihar Sahayata platform, and the document's academic and social significance."),
    bullet("Chapter 2 (Objectives): Defines the measurable goals of the Bihar Sahayata project, presented in a formal traceability matrix format. Covers primary functional objectives with success criteria, secondary technical objectives, key performance indicators, and the constraints and assumptions that bound the project scope."),
    bullet("Chapter 3 (Scope): Precisely delineates what the project includes and what it excludes, with technical justifications for both. Covers in-scope deliverables, functional and non-functional requirements, the future development roadmap for deferred features, and a formal risk register."),
    bullet("Chapter 4 (Methodology): Describes the development approach — Agile sprint-based methodology, the formally-defined issue resolution state machine, the Haversine geolocation algorithm with mathematical derivation, data flow diagrams, security design methodology, and the testing strategy."),
  ];
}

// ── Chapter 2 ──────────────────────────────────────────────────────────────
function chapter2() {
  return [
    ...chapterHeader("2", "Objectives of the Project", "Measurable Goals, Traceability, and Success Criteria"),

    h2("2.1  Primary Objectives"),
    para("The following eight primary objectives define the measurable targets that Bihar Sahayata must achieve to be considered a successful and complete implementation. Each objective is assigned a unique identifier (O-01 through O-08), is mapped to a specific technical component, and is associated with a clearly defined success criterion that can be objectively verified through functional testing. This formal traceability structure is adopted from software engineering best practice (specifically, IEEE 830 requirements specification guidelines) and ensures that every development decision can be traced back to a stated requirement."),
    para("The objectives are ordered by operational criticality — that is, the degree to which failure to achieve the objective would directly compromise the platform's life-safety mission during an active disaster event. Objectives O-01 through O-04 represent the core emergency response functionality; objectives O-05 through O-08 represent enabling capabilities that support, sustain, and expand the core functionality."),

    h3("O-01: Emergency SOS System"),
    para("The SOS Panic Alert system is the most critically time-sensitive component of the entire platform. When a citizen activates the SOS function, the platform must execute the following sequence within the stated performance envelope: capture the device's current GPS coordinates via the expo-location API, transmit the coordinates along with the user's profile information to the /panic/alert REST endpoint, execute the Haversine distance query against all registered, verified, and available volunteers in the database, identify all volunteers within a 20-kilometre radius, and dispatch notifications to those volunteers — all within 10 seconds of the citizen tapping the SOS button."),
    para("The 10-second performance target is derived from field research into emergency response best practices and the specific conditions of Bihar's disaster zones, where degraded network infrastructure means that every API call must be designed for minimal data transfer. The 20-kilometre search radius reflects the maximum distance within which a volunteer can reasonably reach a distress location within the first hour of an alert — a threshold based on typical road and boat travel speeds in flood-affected Bihar districts."),

    h3("O-02: Issue Reporting and Lifecycle Tracking"),
    para("Beyond immediate panic alerts, the platform must support structured, detailed incident reporting that allows citizens to document non-life-threatening but urgent situations — residential flooding requiring evacuation assistance, medical emergencies in flood-isolated areas, damaged infrastructure blocking relief access, or community-level food and water shortages. Each incident report must capture sufficient information for a volunteer or administrator to make an informed response decision without requiring follow-up clarification."),
    para("The issue lifecycle tracking component is equally important: a citizen who has submitted a report must be able to monitor its status in real time, receiving updates at each state transition (Pending → Assigned → En Route → On Site → Resolved). This feedback loop serves both a practical function (allowing the citizen to plan accordingly) and a trust-building function (demonstrating that the report was received and acted upon rather than lost in the system)."),

    h3("O-03: Volunteer Coordination Workflow"),
    para("The volunteer coordination system must implement a complete, formally-defined workflow that takes a volunteer from initial platform registration through account verification, issue acceptance, field response, and resolution — with audit-logged transitions at every step. The workflow must enforce the four-stage field response sequence (Accept → En Route → On Site → Resolved) at the API layer, preventing volunteers from marking an issue as resolved without having first confirmed their presence at the site."),
    para("This enforcement prevents a common failure mode in informal volunteer coordination: 'ghost resolutions' where issues are marked as resolved without actual field response, inflating statistics while real victims remain unassisted. The state machine enforcement at the API layer — independent of any client-side logic — makes this impossible within the Bihar Sahayata platform."),

    h3("O-04: Team Management"),
    para("Effective disaster response in Bihar requires coordinated teams, not isolated individuals. The team management system must allow volunteers to create structured response teams (rescue, medical, relief, or general purpose), manage team membership (inviting members, accepting invitations, removing inactive members), and assign role-based responsibilities within teams. Administrator accounts must be able to activate specific volunteer teams for deployment during officially declared disasters, overriding the normal voluntary opt-in mechanism to ensure coverage in critical areas."),

    h2("2.2  Objective Traceability Matrix"),
    makeTable(
      ["ID", "Objective", "Technical Component", "Success Criterion", "Priority"],
      [
        ["O-01", "Emergency SOS System", "POST /panic/alert endpoint; Haversine SQL query; expo-location API", "SOS alert processed and volunteers notified within 10 seconds; all volunteers within 20 km radius identified correctly", "CRITICAL"],
        ["O-02", "Issue Reporting & Tracking", "POST /issues endpoint; issue status state machine; GET /issues/:id", "Citizens can submit structured reports in under 60 seconds; status updates delivered within 5 seconds of state change", "HIGH"],
        ["O-03", "Volunteer Coordination Workflow", "PATCH /issues/:id/status; RBAC middleware; volunteer_profile table", "State machine enforced — no status skip possible; all transitions logged with timestamp and volunteer ID", "HIGH"],
        ["O-04", "Team Management", "POST /teams; team_membership table; disaster_team_activation table", "Teams creatable in under 2 minutes; admin activation works during declared disaster; membership controls functional", "MEDIUM"],
        ["O-05", "Disaster Management Dashboard", "POST /disasters; GET /admin/stats; disaster table", "Disaster declaration workflow completed in under 5 minutes; real-time district incident map operational", "HIGH"],
        ["O-06", "Transparent Crowdfunding", "POST /campaigns; POST /donations; campaign_update table", "Campaign creation → approval → donation flow complete; real-time progress accurate to 1% increments", "MEDIUM"],
        ["O-07", "Role-Based Access Control", "auth middleware; RBAC middleware; user.role field", "Zero cross-role data access in penetration testing; all 50 endpoints enforce correct role requirements", "CRITICAL"],
        ["O-08", "Cross-Platform Mobile App", "React Native app; Expo SDK; expo-secure-store; TanStack Query", "All 20 screens functional on Android 10+ and iOS 14+; core functions operable on 2G connection speeds", "HIGH"],
      ],
      [600, 1700, 2100, 3000, 960]
    ),
    tableCaption("Table 2.1 — Primary objective traceability matrix with technical components, success criteria, and priority levels"),

    h2("2.3  Secondary Objectives"),
    para("In addition to the eight primary functional objectives, the Bihar Sahayata project pursues a set of secondary objectives that enhance the platform's security posture, operational reliability, developer experience, and long-term maintainability. These secondary objectives are not optional enhancements — they represent engineering quality standards that distinguish a production-grade system from a functional prototype."),

    h3("SO-01: Comprehensive API Documentation"),
    para("The Bihar Sahayata REST API must be fully documented using the OpenAPI 3.0 specification standard. This documentation must be auto-generated from the codebase (using Drizzle schema types and Zod validation schemas as the source of truth) to ensure it remains accurate as the API evolves. The documentation must be accessible via an interactive Swagger UI at the /api/docs endpoint, allowing developers and evaluators to explore all 50 endpoints, view request/response schemas, and execute live test calls directly from the browser."),
    para("Comprehensive API documentation is classified as a secondary objective (rather than primary) because it does not directly affect disaster response outcomes. However, it is essential for the project's academic evaluation, for future development by other contributors, and as a demonstration of professional software engineering practice."),

    h3("SO-02: Security Hardening"),
    para("Beyond the core RBAC system (Primary Objective O-07), the platform must implement a defence-in-depth security posture incorporating multiple independent layers of protection. This includes: HTTP security headers via the Helmet.js middleware (Content Security Policy, X-Frame-Options, X-Content-Type-Options, Referrer Policy, HSTS); configurable per-IP rate limiting via express-rate-limit to prevent denial-of-service attacks and credential stuffing; comprehensive input validation using Zod schemas that validate every request parameter, body field, and query string before any database interaction; bcrypt password hashing with a work factor of 12 (providing approximately 400ms hash time, balancing security against usability on Fly.io's shared CPU allocation); and HTTPS enforcement at the infrastructure level via Fly.io's automatic TLS certificate provisioning."),

    h3("SO-03: Cloud Deployment and DevOps"),
    para("The platform must achieve and maintain a production deployment on Fly.io cloud infrastructure, demonstrating the complete DevOps lifecycle from local development to cloud-hosted service. This includes: Docker containerisation with a multi-stage Dockerfile that produces a minimal production image (excluding development dependencies); environment variable management via Fly.io Secrets (preventing credentials from appearing in code or build logs); health check endpoint at /api/health responding with system status and database connectivity confirmation; and deployment automation via the Fly.io CLI integrated into the development workflow."),

    h3("SO-04: TypeScript Type Safety"),
    para("The entire backend codebase must be written in TypeScript with strict mode enabled, ensuring compile-time type checking for all function signatures, database query results, and API request/response objects. This constraint eliminates an entire class of runtime errors — particularly those involving null/undefined access, incorrect property names, and type mismatches between database fields and API response objects — that are especially dangerous in a production system where runtime failures during a disaster event could have real humanitarian consequences."),

    h3("SO-05: Geospatial Query Performance"),
    para("The Haversine distance computation for volunteer matching must be implemented at the database layer (as a PostgreSQL SQL expression) rather than at the application layer. This architectural choice ensures that only the matching volunteer records are transmitted from the database to the API server, rather than the entire volunteer table — a critical performance consideration when the volunteer database grows to include thousands of registered responders across all 38 Bihar districts. Query execution time for volunteer radius search must remain under 200 milliseconds for a volunteer database of up to 10,000 records."),

    h2("2.4  Success Criteria and Key Performance Indicators"),
    para("The following Key Performance Indicators (KPIs) define the quantitative benchmarks against which the Bihar Sahayata platform will be evaluated upon completion. These KPIs are derived from the success criteria defined in the objective traceability matrix (Table 2.1) and are supplemented by performance benchmarks drawn from industry standards for emergency response applications."),
    makeTable(
      ["KPI Category", "Metric", "Target Value", "Measurement Method"],
      [
        ["Response Time", "SOS alert processing time (end-to-end)", "< 10 seconds", "Automated API test with timestamp comparison"],
        ["Response Time", "Volunteer notification delivery (API to device)", "< 5 seconds", "Postman automated test collection"],
        ["Response Time", "Issue status update propagation", "< 3 seconds", "Front-end integration test with timer"],
        ["Accuracy", "Haversine distance calculation error margin", "< 0.1 km at 20 km range", "Comparison against Google Maps distance API"],
        ["Coverage", "Bihar districts with seeded geospatial data", "38 / 38 (100%)", "Database query: SELECT COUNT(*) FROM district"],
        ["Coverage", "API endpoint documentation coverage", "50 / 50 (100%)", "OpenAPI spec validator"],
        ["Security", "RBAC enforcement success rate", "100%", "Penetration test: 50 cross-role access attempts"],
        ["Reliability", "API uptime on Fly.io (30-day window)", "> 99.5%", "Fly.io monitoring dashboard"],
        ["Compatibility", "Platforms tested and functional", "Android 10+, iOS 14+", "Device/emulator testing matrix"],
        ["Performance", "Volunteer search query time (10,000 records)", "< 200 ms", "PostgreSQL EXPLAIN ANALYZE"],
      ],
      [2000, 2400, 1800, 3160]
    ),
    tableCaption("Table 2.2 — Key Performance Indicators with target values and measurement methods"),

    h2("2.5  Constraints and Assumptions"),
    para("Every software project operates within a set of constraints — boundaries that are fixed by external factors outside the development team's control — and assumptions — conditions that are assumed to hold true for the project to proceed as designed. Explicitly documenting both is a professional requirement for transparent project management and academic rigor."),
    h3("Technical Constraints"),
    bullet("Network Bandwidth: The platform must function acceptably on 2G/EDGE mobile connections (minimum effective throughput of 100 kbps). All API responses must be designed for minimal payload size; images and large data objects are excluded from real-time API responses."),
    bullet("Device Hardware: The React Native application must run acceptably on entry-level Android smartphones with 2 GB RAM and a 1.4 GHz quad-core processor — the median specification of smartphones in Bihar's flood-affected districts."),
    bullet("Database Cost: The platform uses Neon's free-tier serverless PostgreSQL offering during the academic development phase, which imposes a 512 MB storage limit and 0.25 vCPU compute ceiling. The architecture is designed to respect these limits."),
    bullet("Development Timeline: The platform is developed within a 10-week academic sprint by two BCA students working part-time alongside coursework obligations. Feature scope is designed to be achievable within this constraint without sacrificing code quality."),
    h3("Assumptions"),
    bullet("Users (Citizens) are assumed to have Android 10+ or iOS 14+ smartphones with functional GPS hardware and at least occasional internet connectivity (even if intermittent and low-bandwidth)."),
    bullet("Volunteer accounts are assumed to be registered and verified before a disaster event — the platform does not support real-time volunteer onboarding during an active emergency."),
    bullet("The Fly.io cloud infrastructure is assumed to be available and accessible from Bihar. During actual disaster events, cloud connectivity from disaster-affected areas may be unreliable — this limitation is acknowledged and addressed in the future roadmap through the planned offline sync engine."),
    bullet("GPS accuracy on target devices is assumed to be within ±50 metres in open outdoor environments — sufficient for district-level volunteer matching but potentially insufficient for precise rescue navigation in dense urban areas."),
  ];
}

// ── Chapter 3 ──────────────────────────────────────────────────────────────
function chapter3() {
  return [
    ...chapterHeader("3", "Scope of the Project", "Deliverables, Boundaries, and Future Roadmap"),

    h2("3.1  In-Scope Deliverables"),
    para("The following components constitute the confirmed, in-scope deliverables of the Bihar Sahayata project. Each deliverable is described in sufficient technical detail to establish clear acceptance criteria. The scope boundary has been drawn to encompass a complete, functional, and demonstrably useful platform that addresses the core coordination gaps identified in Chapter 1, while remaining achievable within the project's time and resource constraints."),

    h3("Deliverable 1: Production REST API"),
    para("A fully functional Node.js REST API built with Express.js and TypeScript, exposing exactly 50 authenticated and role-validated endpoints across 8 functional resource domains. The API implements the following architectural standards: stateless request handling (no server-side session storage, enabling horizontal scaling); bearer token authentication for mobile clients and HTTP-only cookie sessions for web browser clients; Zod schema validation on all request inputs; OpenAPI documentation accessible at /api/docs; Helmet security headers on all responses; and configurable IP-based rate limiting to prevent abuse. The API is containerised using Docker and deployed to Fly.io cloud infrastructure with automatic HTTPS, health monitoring, and rolling deployments."),
    makeTable(
      ["API Domain", "Endpoints", "Key Operations"],
      [
        ["Authentication", "4", "POST /auth/signup · POST /auth/signin · POST /auth/signout · GET /auth/session"],
        ["Volunteer Management", "7", "Create profile · Update availability · Log qualification · View activation history · Search volunteers"],
        ["Team Management", "7", "Create team · Join team · Leave team · Remove member · List members · Activate team · View team history"],
        ["Panic / SOS Alerts", "2", "POST /panic/alert (trigger SOS with GPS) · GET /panic/status/:id (check resolution)"],
        ["Issue Reporting", "6", "Submit issue · List issues (by district/type) · Accept issue (volunteer) · Update status · Resolve issue · View issue history"],
        ["Disaster Management", "7", "Declare disaster · Update severity · List active disasters · Activate teams · Monitor by district · Close disaster · Get dashboard stats"],
        ["Campaigns & Donations", "5", "Create campaign · Admin approve/reject · Submit donation · Post campaign update · View campaign details with progress"],
        ["Admin Operations", "12", "User management · Verify volunteers · System statistics · Bulk notifications · Audit logs · District data management"],
      ],
      [2200, 1000, 6160]
    ),
    tableCaption("Table 3.1 — Complete API endpoint inventory: 50 endpoints across 8 functional domains"),

    h3("Deliverable 2: React Native Mobile Application"),
    para("A cross-platform mobile application built with React Native and Expo SDK, targeting Android 10+ and iOS 14+, comprising 20 screens organised across the three user role experiences. The application uses Expo Router for type-safe file-based navigation, NativeWind for Tailwind-compatible styling, TanStack Query for server state management with automatic caching and background refetching, Axios for HTTP client functionality with automatic bearer token injection, expo-secure-store for encrypted local token storage, and expo-location for GPS coordinate capture."),
    makeTable(
      ["Screen Category", "Screens", "Roles"],
      [
        ["Authentication", "Splash · Login · Register · Email Verification", "All roles"],
        ["Citizen Core", "Citizen Dashboard · SOS Panic Alert · Report Issue · My Issues · Donate to Campaign", "Citizen"],
        ["Volunteer Core", "Volunteer Dashboard · Open Issues Map · Active Assignment · Team Management · My Profile & Qualifications", "Volunteer"],
        ["Admin Core", "Admin Dashboard · Declare Disaster · Volunteer Verification · Campaign Approval · System Analytics", "Administrator"],
        ["Shared", "Notifications · Settings · About", "All roles"],
      ],
      [2500, 3500, 3360]
    ),
    tableCaption("Table 3.2 — 20-screen mobile application structure across user roles"),

    h3("Deliverable 3: Serverless PostgreSQL Database"),
    para("A Neon serverless PostgreSQL database comprising 19 tables organised across 6 functional domains, with complete data integrity enforced through foreign key constraints, check constraints, and unique constraints at the database layer. The schema is managed through Drizzle ORM TypeScript definitions that serve as the single source of truth for both database structure and API type inference. All 38 Bihar districts are seeded with geospatial metadata (centroid coordinates in DECIMAL(10,7) format for sub-metre precision). The database includes optimised indexes on geolocation columns (latitude, longitude), role columns, and foreign key columns to support efficient query performance under concurrent disaster-event load."),

    h3("Deliverable 4: Authentication and Session Management System"),
    para("A comprehensive authentication system built on the Better Auth v1.2 library, supporting: email/password registration with verification token workflow via Resend transactional email API; Google OAuth social login for streamlined volunteer onboarding; JWT-based bearer tokens for mobile client sessions with configurable expiry; HTTP-only cookie sessions for future web browser clients; password reset workflow with time-limited secure tokens; and account deactivation by administrators without data deletion (soft-delete pattern preserving audit history)."),

    h3("Deliverable 5: OpenAPI Documentation and Postman Collection"),
    para("Complete API documentation generated from the TypeScript/Zod schema definitions, covering all 50 endpoints with: HTTP method and URL path; authentication and role requirements; request body schema with field types, validation rules, and examples; response schema with all possible HTTP status codes; and practical example request/response pairs. The documentation is accessible via interactive Swagger UI at /api/docs and is also exported as a Postman collection for API testing and quality assurance."),

    h2("3.2  Functional Boundaries"),
    para("The following table defines the precise functional boundaries of the Bihar Sahayata platform — what specific interactions the system supports, and what interactions are explicitly outside the current scope. These boundaries are drawn based on the 10-week development timeline, the two-person development team, and the decision to deliver a complete, high-quality core system rather than an incomplete broader system."),
    makeTable(
      ["Functional Area", "In Scope", "Out of Scope (Current Version)"],
      [
        ["Authentication", "Email/password with verification; Google OAuth; session management; password reset", "SMS OTP authentication; biometric authentication; multi-factor authentication (TOTP)"],
        ["Geolocation", "Haversine distance calculation for volunteer matching; GPS coordinate capture at issue/SOS submission time; district-level filtering", "Real-time continuous GPS tracking of volunteer positions; route optimisation; turn-by-turn navigation"],
        ["Notifications", "In-app notification display; email notifications via Resend API; notification read/unread status", "Firebase Cloud Messaging (FCM) push notifications; SMS notifications via MSG91 or Twilio; WhatsApp integration"],
        ["Mapping", "District selection from seeded database; GPS coordinate display in admin dashboard (text format)", "Interactive map display; OpenStreetMap or Google Maps integration; live volunteer position map"],
        ["Payments", "Donation amount submission; campaign progress tracking; donor record creation", "Real payment gateway integration (Razorpay API calls); payment verification webhooks; refund processing"],
        ["Communication", "In-app notification system; status update alerts", "Real-time chat between citizens and volunteers; voice/video call integration; WebSocket live updates"],
        ["Reporting", "Admin statistics dashboard; volunteer response history; campaign donation history", "Automated report generation (PDF/Excel); district-level heatmaps; ML-based prediction dashboards"],
        ["Data Management", "CRUD operations on all 19 database tables; soft-delete for user accounts", "Data archival and purging policies; GDPR/DPDP compliance workflows; automated database backup management"],
      ],
      [1800, 3380, 4180]
    ),
    tableCaption("Table 3.3 — Functional boundary matrix defining in-scope and out-of-scope capabilities"),

    h2("3.3  Non-Functional Requirements"),
    para("Non-functional requirements (NFRs) define the quality attributes of the system — the 'how well' rather than the 'what'. For Bihar Sahayata, several NFRs carry safety-critical implications given the life-saving context of the platform. The following NFRs are treated with the same rigour as functional requirements."),
    h3("Performance"),
    bullet("API endpoint response time: P95 (95th percentile) response time must be under 500 milliseconds for all read endpoints and under 1,000 milliseconds for all write endpoints, measured under simulated load of 50 concurrent users."),
    bullet("SOS processing time: The complete SOS alert pipeline (GPS capture → API call → Haversine query → notification trigger) must complete end-to-end within 10 seconds on a 3G connection (minimum 384 kbps effective throughput)."),
    bullet("Mobile app startup time: Time-to-interactive for the mobile application must be under 4 seconds on the target device specification (2 GB RAM, 1.4 GHz quad-core)."),
    h3("Reliability"),
    bullet("API availability: The Fly.io-deployed API must achieve 99.5% uptime measured over any 30-day rolling window, excluding scheduled maintenance windows communicated at least 24 hours in advance."),
    bullet("Data durability: All database writes must be confirmed with PostgreSQL fsync-level durability (ACID-compliant transaction commit) before an API success response is returned to the client."),
    bullet("Error handling: All API endpoints must return structured JSON error responses with machine-readable error codes and human-readable error messages for every error condition."),
    h3("Security"),
    bullet("Authentication: All protected endpoints must return 401 Unauthorized for unauthenticated requests; all role-protected endpoints must return 403 Forbidden for authenticated requests with insufficient role."),
    bullet("Input validation: All user-supplied inputs must be validated by Zod schemas before any database interaction. SQL injection must be impossible by construction (Drizzle ORM uses parameterised queries exclusively)."),
    bullet("Transport security: All HTTP communication must be over TLS 1.2 or higher. No sensitive data may be transmitted in URL query parameters (use request body or headers)."),
    h3("Scalability"),
    bullet("Database: The database schema must support growth to 100,000 registered users, 500,000 issue records, and 10,000 active volunteers without schema changes or significant query performance degradation."),
    bullet("API: The stateless API design must enable horizontal scaling (adding additional API server instances behind a load balancer) without code changes."),

    h2("3.4  Out-of-Scope Items and Future Roadmap"),
    para("The features deferred to future development phases are not afterthoughts — they represent a deliberately sequenced roadmap where each phase builds upon the stable foundation established by the preceding phase. The sequencing reflects both technical dependency order (real-time WebSocket requires a stable REST API foundation) and operational priority order (FCM push notifications are higher priority than AI severity prediction because they address a more immediate operational need)."),
    makeTable(
      ["Feature", "Target Phase", "Technical Dependency", "Operational Impact"],
      [
        ["FCM Push Notifications", "Q1 2026", "Firebase project setup; FCM device token registration in database; notification dispatch service", "HIGH — eliminates polling; enables instant volunteer alert; reduces SOS response time by estimated 60%"],
        ["WebSocket Real-time Updates", "Q1 2026", "Socket.io server integration; authenticated WebSocket connections; event emission on state changes", "HIGH — enables live issue status updates without page refresh; critical for admin operational dashboard"],
        ["SMS Alerts (MSG91/Twilio)", "Q2 2026", "SMS API credentials; phone number verification; rate-limited SMS dispatch queue", "MEDIUM — extends platform reach to non-smartphone users; critical for rural coverage in flood zones"],
        ["Live Map Tracking", "Q2 2026", "Continuous GPS transmission from volunteer devices; MapLibre GL or OpenLayers map component; real-time coordinate stream", "MEDIUM — enhances coordination visibility; enables route optimisation and ETA calculation"],
        ["Offline Data Sync Engine", "Q3 2026", "Local SQLite/MMKV database on device; conflict resolution algorithm; background sync service", "CRITICAL for deployability — enables data capture during complete network outage; syncs automatically on reconnect"],
        ["AI Severity Prediction", "Q3 2026", "Historical incident dataset (minimum 10,000 labelled records); TensorFlow.js or Python ML model; model serving API", "MEDIUM — auto-classifies issue severity; suggests volunteer dispatch; reduces administrator decision load"],
        ["SDMA API Integration", "Q4 2026", "Bihar SDMA API credentials and specification; data mapping layer; bi-directional sync service", "HIGH for institutional adoption — enables official data exchange with state disaster authority"],
        ["Web Dashboard", "Q4 2026", "React/Next.js frontend; session cookie authentication; responsive design for desktop/tablet", "MEDIUM — enables administrator operations from desktop without mobile device; improves operational ergonomics"],
      ],
      [1800, 1100, 2800, 3660]
    ),
    tableCaption("Table 3.4 — Future development roadmap with technical dependencies and operational impact assessment"),

    h2("3.5  Risk Register"),
    para("Responsible project management requires explicit identification and mitigation planning for risks that could compromise project delivery or platform effectiveness. The following risk register documents the key risks identified during project planning, along with their assessed probability, potential impact, and mitigation strategies."),
    makeTable(
      ["Risk", "Category", "Probability", "Impact", "Mitigation Strategy"],
      [
        ["Low smartphone penetration in target rural areas limits citizen SOS adoption", "Adoption", "Medium", "High", "Design for SMS fallback in roadmap (Q2 2026); prioritise volunteer coordination value which is independent of citizen SOS adoption rates"],
        ["Fly.io outage during active disaster event", "Technical", "Low", "Critical", "Monitor Fly.io status page; design API for fast redeployment to alternative provider (Railway, Render); document failover procedure"],
        ["Neon PostgreSQL connection limit exceeded during disaster traffic spike", "Technical", "Medium", "High", "Neon auto-scales connection pooling; implement application-level connection pool limits; add database query caching for frequently-accessed static data"],
        ["GPS coordinate accuracy insufficient in flood-inundated areas", "Technical", "Medium", "Medium", "Haversine 20 km search radius provides significant margin; address resolution planned for Phase II using Bihar district boundary GeoJSON"],
        ["Fraudulent volunteer registration to abuse SOS notification access", "Security", "Medium", "High", "Two-stage admin verification required before volunteer activation; rate limiting on notification delivery; volunteer quality score system in roadmap"],
        ["Scope creep extending development timeline beyond 10 weeks", "Project Management", "Medium", "Medium", "Strict scope boundary enforced; future roadmap clearly documents deferred features; weekly sprint reviews with scope change control"],
        ["Data privacy concerns limiting citizen registration", "Legal/Compliance", "Low", "Medium", "GPS data stored only at point of issue/SOS submission, not continuously; privacy policy published in app; data retention limits documented"],
      ],
      [2400, 1200, 1100, 900, 3760]
    ),
    tableCaption("Table 3.5 — Project risk register with probability/impact assessment and mitigation strategies"),
  ];
}

// ── Chapter 4 ──────────────────────────────────────────────────────────────
function chapter4() {
  return [
    ...chapterHeader("4", "Methodology", "Development Approach, Algorithms, and Workflow Models"),

    h2("4.1  Agile Development Methodology"),
    para("Bihar Sahayata adopts the Agile Software Development methodology as its governing development philosophy, specifically a lightweight Sprint-based workflow that prioritises working software over comprehensive documentation, customer collaboration over contract negotiation, and responding to change over following a fixed plan. This choice is grounded in the specific characteristics of disaster-response software development, which faces a fundamentally different requirements landscape than conventional enterprise software."),
    para("The core argument for Agile over traditional Waterfall methodology in this context is the inherent uncertainty of disaster-response requirements. Real-world operational needs in Bihar's flood emergency ecosystem — the actual sequence of steps a field volunteer follows when responding to an SOS alert, the information a district administrator needs to make a deployment decision, the specific form fields a citizen needs to accurately describe a flood incident — can only be properly understood after initial prototypes are evaluated against realistic operational scenarios. Attempting to specify all requirements upfront (the Waterfall approach) and then implementing without iteration would produce a technically correct but operationally inadequate system."),
    para("The development is structured into ten discrete phases, each corresponding to a one-week sprint and each producing a tested, functional software increment that can be evaluated and demonstrated independently. This incremental delivery approach provides several critical benefits: integration issues are identified early (when a database schema change breaks an existing API endpoint, the cost of fixing it in Week 3 is significantly lower than discovering the incompatibility in Week 9); user feedback can be incorporated continuously (early API sketches can be tested against the mobile application before the mobile application is complete); and the project maintains a demonstrable working state at all times (important for a two-person team where either member might need to explain the project to an evaluator at any point during development)."),

    h3("Sprint Structure"),
    para("Each one-week sprint follows a consistent structure: Sprint Planning (Monday, 2 hours — review backlog, define sprint goal, assign tasks); Daily Stand-up (10 minutes each morning — what did I do yesterday, what will I do today, any blockers); Development (Tuesday through Friday — implementation, unit testing, code review); Sprint Review (Friday afternoon, 1 hour — demonstrate working increment, evaluate against sprint goal); Sprint Retrospective (Friday afternoon, 30 minutes — what went well, what to improve, action items for next sprint). This cadence is adapted from the full Scrum framework but is simplified for a two-person academic team without dedicated Scrum Master or Product Owner roles."),
    makeTable(
      ["Sprint (Week)", "Goal", "Key Deliverables", "Definition of Done"],
      [
        ["Sprint 1", "Project foundation established", "Technology stack selected and documented; database schema designed; development environment configured; GitHub repository initialised", "Schema peer-reviewed; all tools installed and functional on both developer machines"],
        ["Sprint 2", "Data layer functional", "19-table PostgreSQL schema created via Drizzle migration; 38 Bihar districts seeded; database connectivity confirmed from API layer", "All tables created; seed data verified; Drizzle ORM type inference working for all entities"],
        ["Sprint 3", "Authentication system complete", "Better Auth integration; email/password signup and signin; email verification workflow; Google OAuth; bearer token generation", "All auth flows tested in Postman; email verification emails delivered successfully via Resend"],
        ["Sprint 4", "Middleware and security layer", "RBAC middleware; Zod validation schemas for all request types; Helmet headers; rate limiting; structured error handling", "Cross-role access attempts return 403; invalid inputs return 400 with field-level error details"],
        ["Sprint 5", "Core API routes operational", "Volunteer, issue, team, panic, and disaster API endpoints (31 total); Haversine query implementation", "All 31 endpoints tested in Postman; Haversine distance accuracy verified against reference calculator"],
        ["Sprint 6", "Campaign and admin systems", "Campaign and donation endpoints; admin verification and management routes; all 38 districts accessible via API; 50 total endpoints complete", "Full admin workflow tested; campaign donation flow complete end-to-end"],
        ["Sprint 7", "Security hardening and containerisation", "Docker image built and tested; Helmet configuration finalised; rate limiting tuned; all environment variables externalised", "Docker container starts cleanly; environment secrets not in codebase; security scan passes"],
        ["Sprint 8", "Production deployment live", "Fly.io deployment operational; HTTPS certificate active; health endpoint returning 200; API accessible from mobile device", "Production API URL confirmed accessible; health check returns database connectivity confirmation"],
        ["Sprint 9", "Mobile app core screens", "Authentication screens; citizen dashboard and SOS flow; volunteer dashboard and issue response flow; initial integration testing", "SOS flow completes end-to-end on physical Android device; volunteer acceptance flow functional"],
        ["Sprint 10", "Final polish and documentation", "Admin screens; notification displays; full Postman collection; OpenAPI docs; project report Phase I", "All 20 screens functional; documentation complete; report submitted"],
      ],
      [1200, 2000, 3400, 2760]
    ),
    tableCaption("Table 4.1 — Ten-sprint development plan with goals, deliverables, and acceptance criteria"),

    h2("4.2  Sprint Planning and Execution"),
    para("The sprint planning process for Bihar Sahayata is informed by a detailed Product Backlog maintained in a structured task tracking format. Each backlog item is described as a User Story in the standard Agile format: 'As a [user role], I want to [action] so that [benefit].' This format ensures that every development task is traceable to a specific user need, preventing the common failure mode of building technically impressive features that address no actual user requirement."),
    para("User stories are estimated using Story Points on a Fibonacci sequence (1, 2, 3, 5, 8, 13) where one Story Point represents approximately 2-3 hours of focused development work for a single developer. The two-person team has a combined velocity of approximately 20-25 Story Points per sprint, calibrated against actual performance in Sprint 1. Sprint planning sessions ensure that each sprint's committed Story Points do not exceed the team's established velocity."),
    h3("Example User Stories — Sprint 5 (Core API Routes)"),
    bullet("(5 pts) As a Citizen, I want to tap an SOS button that captures my GPS location and notifies nearby volunteers, so that I can get help quickly during a flood emergency. [Acceptance: POST /panic/alert processes GPS coordinates; Haversine query returns volunteers within 20 km; notification records created in database within 10 seconds]"),
    bullet("(3 pts) As a Volunteer, I want to accept an open issue and update my response status, so that the citizen who reported it knows help is coming. [Acceptance: PATCH /issues/:id/status enforces state machine; only assigned volunteer can update status; state transitions logged with timestamp]"),
    bullet("(2 pts) As an Administrator, I want to declare an official disaster for a specific district with a severity level, so that appropriate resources can be mobilised. [Acceptance: POST /disasters creates disaster record; severity levels (LOW/MEDIUM/HIGH/CRITICAL) enforced; only ADMIN role can access endpoint]"),

    h2("4.3  Issue Resolution State Machine"),
    para("The lifecycle management of every reported incident within Bihar Sahayata is governed by a formally-defined finite state machine (FSM). A finite state machine is a mathematical abstraction comprising a set of states, a set of transitions between states triggered by specific events, and constraints on which transitions are valid at any given point. By implementing the issue lifecycle as an FSM, Bihar Sahayata ensures that incidents cannot skip states arbitrarily, that responsibility is always assigned and documented, and that complete audit trails are maintained for post-incident analysis and accountability."),
    para("The FSM design is a deliberate response to a failure mode observed in informal disaster coordination: 'status inflation', where issues are prematurely marked as resolved to improve statistics or reduce workload without actual field response. In Bihar Sahayata, the FSM is enforced at the API middleware layer — independent of any client-side logic — making status inflation structurally impossible regardless of what the mobile application presents to the user."),
    h3("State Definitions"),
    makeTable(
      ["State", "Definition", "Entry Condition", "Exit Conditions", "Responsible Actor"],
      [
        ["PENDING", "Issue submitted; no volunteer assigned", "Citizen submits issue report via POST /issues", "Volunteer accepts issue → ASSIGNED; Admin escalates → ESCALATED", "System (automatic)"],
        ["ASSIGNED", "Volunteer has accepted the issue; not yet departed", "Volunteer calls PATCH /issues/:id/status with status: ASSIGNED", "Volunteer confirms departure → EN_ROUTE; Volunteer releases issue → PENDING; Admin escalates → ESCALATED", "Volunteer"],
        ["EN_ROUTE", "Volunteer confirmed departure towards incident location", "Volunteer calls PATCH /issues/:id/status with status: EN_ROUTE", "Volunteer confirms arrival → ON_SITE; Admin escalates → ESCALATED", "Volunteer"],
        ["ON_SITE", "Volunteer confirmed arrival at incident location", "Volunteer calls PATCH /issues/:id/status with status: ON_SITE", "Volunteer marks issue resolved → RESOLVED; Admin escalates → ESCALATED", "Volunteer"],
        ["RESOLVED", "Issue fully resolved; volunteer departed site", "Volunteer calls POST /issues/:id/resolve with resolution notes", "Terminal state — no further transitions", "Volunteer (confirmed by Citizen optional)"],
        ["ESCALATED", "Issue escalated to administrator for direct intervention", "Admin calls PATCH /issues/:id/escalate; or auto-escalated after 4-hour SLA breach without volunteer acceptance", "Admin re-assigns to volunteer → ASSIGNED; Admin marks resolved → RESOLVED", "Administrator"],
      ],
      [1300, 2200, 2000, 2000, 1860]
    ),
    tableCaption("Table 4.2 — Issue resolution state machine: six states with entry/exit conditions and responsible actors"),
    para("The state machine is implemented in the API server as a validation function that, for any given current state and requested next state, returns either VALID (the transition is permitted) or INVALID (the transition is forbidden, returning a 409 Conflict HTTP response to the client). This validation function is the single authoritative source of transition rules — it is called by all endpoints that modify issue status, ensuring that no code path can bypass the state machine logic."),
    para("The automatic escalation mechanism (ESCALATED state triggered by 4-hour SLA breach) represents an important operational safeguard: if a high-severity issue receives no volunteer response within 4 hours of submission, the issue is automatically escalated and administrator accounts in the relevant district receive a priority notification. This prevents the failure mode of urgent issues remaining in PENDING state indefinitely because no nearby volunteer happened to notice the notification."),

    h2("4.4  Haversine Geolocation Algorithm"),
    para("The identification and notification of nearby volunteers for SOS alerts is the most algorithmically critical operation in the Bihar Sahayata platform. The system must answer the question: 'Given a GPS coordinate (the SOS alert location), which registered, verified, and available volunteers are within a 20-kilometre radius?' This query must be answered accurately, efficiently, and reliably — failures in this operation directly translate to delayed emergency response."),
    h3("Why Not Euclidean Distance?"),
    para("The most intuitive approach to distance calculation — Euclidean distance, treating latitude and longitude as Cartesian coordinates — is fundamentally incorrect for distances beyond a few hundred metres on the Earth's surface. The Earth is not flat; it is a geoid (approximately spherical) surface, and latitude and longitude are angular measurements on that surface, not linear distances. The consequence of using Euclidean distance in Bihar's geographic context is significant: at the latitude of Patna (approximately 25.6°N), one degree of longitude corresponds to approximately 101 kilometres — significantly less than one degree of latitude (approximately 111 kilometres). This asymmetry means that Euclidean distance calculations systematically underestimate east-west distances relative to north-south distances, producing incorrect volunteer ranking and potentially identifying volunteers in the wrong direction."),
    h3("The Haversine Formula — Mathematical Derivation"),
    para("The Haversine Formula is a standard solution in spherical trigonometry for computing the great-circle distance between two points on a sphere, given their latitude and longitude coordinates. A great-circle distance is the shortest path between two points on the surface of a sphere, following the curvature of the surface — equivalent to the path an aircraft takes on a long-distance flight."),
    para("The derivation proceeds from the spherical law of cosines and applies the haversine function (hav(θ) = sin²(θ/2)) for numerical stability at small distances — a property critical for the Bihar Sahayata use case where we need accurate distance computation both for volunteers 500 metres away (in an urban area) and volunteers 20 kilometres away (the maximum search radius)."),
    makeTable(
      ["Symbol", "Meaning", "Units"],
      [
        ["φ₁, φ₂", "Latitudes of point 1 (SOS location) and point 2 (volunteer location)", "Radians (convert from degrees by multiplying by π/180)"],
        ["λ₁, λ₂", "Longitudes of point 1 and point 2", "Radians"],
        ["Δφ", "Difference in latitudes: φ₂ − φ₁", "Radians"],
        ["Δλ", "Difference in longitudes: λ₂ − λ₁", "Radians"],
        ["r", "Earth's mean radius: 6,371 km", "Kilometres"],
        ["a", "Square of half the chord length: sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)", "Dimensionless"],
        ["c", "Angular distance in radians: 2·arctan2(√a, √(1−a))", "Radians"],
        ["d", "Surface distance: r · c", "Kilometres"],
      ],
      [800, 4800, 3760]
    ),
    tableCaption("Table 4.3 — Haversine formula variable definitions"),
    para("The complete formula for great-circle distance, as implemented in the Bihar Sahayata PostgreSQL queries, is:"),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
      children: [new TextRun({ text: "a = sin²((φ₂−φ₁)/2) + cos(φ₁) · cos(φ₂) · sin²((λ₂−λ₁)/2)", font: "Courier New", size: 22, bold: true, color: BLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 80 },
      children: [new TextRun({ text: "c = 2 · arctan2( √a, √(1−a) )", font: "Courier New", size: 22, bold: true, color: BLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 200 },
      children: [new TextRun({ text: "d = 6371 · c   (distance in kilometres)", font: "Courier New", size: 22, bold: true, color: BLUE })]
    }),
    tableCaption("Figure 4.1 — Haversine Formula for great-circle distance computation on Earth's surface"),

    h3("PostgreSQL Implementation"),
    para("The Haversine formula is computed directly within a PostgreSQL SQL query rather than in the Node.js application layer. This architectural decision is critical for performance: at the database layer, the query can leverage the WHERE clause with the distance calculation to filter rows, returning only the matching volunteer records — rather than selecting all volunteer records and filtering them in Node.js application code. The SQL expression for the distance calculation is:"),
    new Paragraph({
      spacing: { before: 160, after: 160 },
      shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
      children: [new TextRun({ text: "( 6371 * acos( cos(radians($lat)) * cos(radians(v.latitude)) * cos(radians(v.longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(v.latitude)) ) ) AS distance_km", font: "Courier New", size: 18, color: "333333" })]
    }),
    para("Where $lat and $lng are the parameterised SOS alert coordinates. The WHERE clause then filters: HAVING distance_km <= 20, ensuring only volunteers within the 20-kilometre search radius are returned. The query also filters for is_verified = true (confirmed volunteer accounts) and is_available = true (volunteers who have marked themselves as active and available for response)."),
    h3("Search Radius Calibration"),
    makeTable(
      ["Alert Type", "Search Radius", "Rationale"],
      [
        ["SOS Panic Alert", "20 km", "Maximum urgency — widest possible volunteer net to minimise response time; 20 km is reachable within 60-90 minutes by boat or vehicle in Bihar's road/waterway network"],
        ["High-Severity Issue (CRITICAL/HIGH)", "15 km", "Urgent but not immediately life-threatening — slightly smaller radius reduces volunteer notification fatigue while maintaining strong coverage"],
        ["Medium-Severity Issue", "10 km", "Moderate urgency — focus on proximate volunteers who can respond efficiently"],
        ["Low-Severity Issue", "5 km", "Non-urgent — restrict to genuinely local volunteers to avoid unnecessary cross-district travel"],
      ],
      [2400, 1800, 5160]
    ),
    tableCaption("Table 4.4 — Alert type to search radius mapping with operational rationale"),

    h2("4.5  Data Flow Diagrams"),
    para("Data Flow Diagrams (DFDs) provide a graphical representation of how data moves through the Bihar Sahayata system — from external actors (Citizens, Volunteers, Administrators) through system processes to the database, and back to the actors in the form of responses and notifications. DFDs are an established tool in structured systems analysis, standardised by Gane and Sarson (1979) and DeMarco (1979), and provide a valuable complement to the Entity-Relationship diagrams that describe the database structure."),
    h3("Level 0 DFD (Context Diagram)"),
    para("At the highest level of abstraction (Level 0), Bihar Sahayata is a single system bubble receiving inputs from and sending outputs to three external entities: Citizens, Volunteers, and Administrators. The context diagram establishes the system boundary — what is inside Bihar Sahayata (the API, database, authentication system, notification engine) and what is outside (the mobile devices, the GPS satellite network, the Resend email service, and the Fly.io cloud infrastructure that hosts but does not form part of the logical system)."),
    makeTable(
      ["External Entity", "Data Flows INTO System", "Data Flows OUT of System"],
      [
        ["Citizen", "Registration credentials · SOS GPS coordinates · Issue report details · Donation amount · Campaign selection", "Session tokens · Issue status updates · SOS acknowledgement · Donation receipt · Nearby disaster notifications"],
        ["Volunteer", "Registration credentials · Qualification details · Team creation/join requests · Issue acceptance · Status updates · Resolution notes", "Session tokens · Nearby issue notifications · SOS alert notifications · Team membership confirmations · Activation notifications"],
        ["Administrator", "Login credentials · Disaster declaration details · Volunteer verification decisions · Campaign approval/rejection · Bulk notification content", "Session tokens · District incident dashboard data · System analytics · Volunteer roster · Campaign management data"],
        ["Resend Email API (External)", "API authentication key", "Verification emails · Password reset emails · Admin notification emails"],
        ["GPS Satellite Network (External)", "None (one-way)", "GPS coordinates to mobile device (processed by expo-location before entering system)"],
      ],
      [2000, 3680, 3680]
    ),
    tableCaption("Table 4.5 — Context-level (Level 0) data flow: External entities and their data exchanges with Bihar Sahayata"),
    h3("Level 1 DFD — Core Processes"),
    para("Decomposing the system bubble into its major processes reveals the six primary functional subsystems that constitute Bihar Sahayata's operational core. Each process corresponds to one or more API resource domains described in Chapter 3."),
    makeTable(
      ["Process", "Inputs", "Outputs", "Data Stores Accessed"],
      [
        ["P1: Authentication & Session Management", "Email/password credentials; OAuth tokens; session tokens", "JWT bearer tokens; session cookies; verification email trigger", "user, session, account, verification tables"],
        ["P2: Emergency Alert Processing", "GPS coordinates; citizen user ID", "Volunteer notification records; alert acknowledgement; nearby volunteer list", "volunteer_profile (read); issue (write); notification (write)"],
        ["P3: Issue Lifecycle Management", "Issue details; status update commands; resolution notes", "Issue records; status history; citizen notifications; volunteer assignments", "issue, issue_type, issue_assignment tables"],
        ["P4: Volunteer & Team Management", "Volunteer profile data; team creation requests; membership operations", "Volunteer profile records; team records; membership records; activation events", "volunteer_profile, volunteer_team, team_membership, volunteer_qualification tables"],
        ["P5: Disaster Management", "Disaster declaration data; severity updates; team activation commands", "Disaster records; team activation records; district notifications", "disaster, disaster_team_activation, district tables"],
        ["P6: Campaign & Donation Processing", "Campaign details; donation amounts; update posts", "Campaign records; donation records; progress calculations; update notifications", "campaign, donation, campaign_update, notification tables"],
      ],
      [1600, 2400, 2560, 2800]
    ),
    tableCaption("Table 4.6 — Level 1 DFD: Six core processes with inputs, outputs, and data store access patterns"),

    h2("4.6  Security Design Methodology"),
    para("The security architecture of Bihar Sahayata is designed according to the principle of Defence in Depth — a layered approach in which multiple independent security controls are applied in sequence, so that a failure or bypass of any single control does not compromise the overall system. This approach is aligned with the OWASP Application Security Verification Standard (ASVS) Level 1, the baseline security standard for general-purpose web applications."),
    h3("Layer 1: Transport Security"),
    para("All communication between mobile clients and the API server occurs exclusively over TLS 1.2 or higher, enforced by Fly.io's automatic certificate provisioning and HTTP-to-HTTPS redirect. This eliminates the risk of credential interception and session token theft via network eavesdropping — a realistic threat in disaster-zone environments where citizens and volunteers may connect through shared public Wi-Fi or compromised local network infrastructure."),
    h3("Layer 2: Input Validation"),
    para("Every API request that contains user-supplied data passes through a Zod schema validator before any business logic executes. Zod validates the data type, format, length, and constraints of each field — for example, verifying that a GPS latitude value is a number between -90 and 90, that an email address matches the RFC 5322 format, and that severity enum values are one of the four permitted values. Invalid inputs receive a structured 400 Bad Request response with field-level error details, and no database operation is attempted. This layer eliminates SQL injection (Drizzle ORM uses parameterised queries exclusively) and XSS injection as threat vectors."),
    h3("Layer 3: Authentication"),
    para("Better Auth v1.2 implements a comprehensive authentication system with several security-critical properties: passwords are hashed using bcrypt with a work factor of 12 (approximately 400ms per hash on the production server's shared CPU, making brute-force attacks computationally infeasible); JWT bearer tokens have a configurable expiry (default: 7 days for mobile, 24 hours for web); email verification is required before account activation, preventing throwaway account creation; and account lockout is implemented after 5 consecutive failed login attempts per IP address."),
    h3("Layer 4: Authorisation"),
    para("The RBAC middleware is applied to every protected API route and validates both the presence of a valid session and the sufficiency of the session's role for the requested operation. The role hierarchy is flat (CITIZEN, VOLUNTEER, ADMIN are peer roles, not hierarchical) — an ADMIN does not automatically inherit CITIZEN capabilities; each endpoint's permission requirement is specified individually. This flat hierarchy prevents privilege escalation scenarios where a compromised admin account could be used to impersonate citizens."),
    h3("Layer 5: HTTP Security Headers"),
    para("The Helmet.js middleware applies the following HTTP security headers to all API responses: Content-Security-Policy (restricting resource loading to trusted origins); X-Frame-Options: DENY (preventing clickjacking attacks); X-Content-Type-Options: nosniff (preventing MIME type sniffing); Referrer-Policy: no-referrer (preventing URL leakage in referrer headers); and Strict-Transport-Security with a 1-year max-age (enforcing HTTPS on subsequent requests after the first). These headers address several OWASP Top 10 vulnerability categories including A05:2021 (Security Misconfiguration) and A03:2021 (Injection)."),

    h2("4.7  Testing Strategy"),
    para("The Bihar Sahayata testing strategy is structured across four test levels, each targeting a different scope of system behaviour. Given the life-safety implications of the platform, testing is treated as a first-class engineering activity — not an afterthought performed at the end of development — and test creation is integrated into each sprint's definition of done."),
    makeTable(
      ["Test Level", "Scope", "Tools", "Coverage Target"],
      [
        ["Unit Testing", "Individual functions and methods — Haversine calculation accuracy; Zod schema validation rules; RBAC permission check logic; state machine transition validation", "Jest test framework; Zod schema introspection; manual calculation reference values", "> 80% of utility functions and validation logic"],
        ["Integration Testing", "API endpoint behaviour — correct HTTP status codes; response schema conformance; database state changes; RBAC enforcement across all 50 endpoints", "Postman automated test collection with Newman CLI runner; custom test scripts for state transitions", "100% of API endpoints have at least one happy-path and one error-path test"],
        ["System Testing", "End-to-end user workflows — complete SOS flow from citizen tap to volunteer notification; complete issue lifecycle from PENDING to RESOLVED; campaign creation and donation flow", "Physical Android device (Redmi 9 — representative target hardware); Expo Go development client; manual test cases", "All 8 primary objectives verified against success criteria"],
        ["Security Testing", "RBAC boundary testing — cross-role access attempts for all protected endpoints; rate limiting effectiveness; input validation boundary testing; SQL injection attempt suite", "Postman collection with systematic cross-role request matrix; custom scripts for boundary value testing", "Zero successful cross-role access violations; all injection attempts return 400/403"],
      ],
      [1800, 3200, 2200, 2160]
    ),
    tableCaption("Table 4.7 — Four-level testing strategy with scope, tools, and coverage targets"),
    para("The Postman automated test collection is a critical component of the testing infrastructure — it serves simultaneously as a test suite, an API documentation supplement, and a regression testing tool. The collection organises tests by resource domain and includes environment variables for base URL, authentication tokens, and test-specific identifiers, allowing the full suite to be run against both the development environment and the production Fly.io deployment with a single configuration change."),
    para("Security testing is given particular emphasis given the sensitive nature of the data handled by the platform. The RBAC boundary test matrix systematically attempts every cross-role operation — a CITIZEN attempting to declare a disaster, a VOLUNTEER attempting to approve a campaign, an unauthenticated request attempting to access any protected endpoint — and verifies that each attempt returns the correct 401 or 403 response without any partial data leakage."),
    ...emptyLine(2),
    dividerPara(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "— End of Phase I (Chapters 1–4) —", font: "Arial", size: 20, italic: true, color: "888888" })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: "Phase II continues with: Chapter 5 (System Architecture) · Chapter 6 (Tools and Technologies)", font: "Arial", size: 18, italic: true, color: "AAAAAA" })]
    }),
  ];
}

// ── Build document ─────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: DARK } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: LBLUE },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      },
      { reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]
      },
    ]
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1728 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { before: 0, after: 160 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
              tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
              children: [
                new TextRun({ text: "Bihar Sahayata — Project Report (Phase I)", font: "Arial", size: 18, color: "555555", italic: true }),
                new TextRun({ text: "\tPatna University BCA Sem. V  |  2025–2026", font: "Arial", size: 18, color: "555555", italic: true }),
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              spacing: { before: 160, after: 0 },
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
              tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
              children: [
                new TextRun({ text: "Shubham Kumar Mishra & Atul Sharma", font: "Arial", size: 18, color: "555555" }),
                new TextRun({ text: "\tPage ", font: "Arial", size: 18, color: "555555" }),
                new PageNumber({ type: NumberFormat.DECIMAL }),
              ]
            })
          ]
        })
      },
      children: [
        ...coverPage(),
        ...declarationPage(),
        ...abstractPage(),
        ...tocPage(),
        ...chapter1(),
        ...chapter2(),
        ...chapter3(),
        ...chapter4(),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/Bihar_Sahayata_ProjectReport_Phase1.docx', buffer);
  console.log('Done!');
}).catch(err => { console.error(err); process.exit(1); });