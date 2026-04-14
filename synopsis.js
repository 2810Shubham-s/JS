const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, TableOfContents,
  LevelFormat, ImageRun, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ─── COLOR PALETTE ───────────────────────────────────────────────────────────
const C = {
  navy:     '1B2A4A',  // deep navy for headings
  accent:   '2E5FA3',  // medium blue for sub-headings
  gold:     'C8960C',  // gold for chapter label
  light:    'EBF0F8',  // very light blue for table header bg
  midBlue:  'D0DDF0',  // mid blue for alternating rows
  white:    'FFFFFF',
  nearBlack:'1A1A1A',
  gray:     '555555',
  lightGray:'F5F5F5',
  border:   'AABBD4',
  darkRow:  'C0CFEA',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const border1 = { style: BorderStyle.SINGLE, size: 4, color: C.border };
const borders  = { top: border1, bottom: border1, left: border1, right: border1 };
const noBorder = { style: BorderStyle.NONE, size: 0, color: C.white };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function thickBorderBottom(color = C.navy) {
  return { border: { bottom: { style: BorderStyle.SINGLE, size: 12, color, space: 4 } } };
}

function spacer(pt = 120) {
  return new Paragraph({ spacing: { before: 0, after: 0, line: pt }, children: [new TextRun('')] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function chapterLabel(num, title) {
  return [
    spacer(200),
    new Paragraph({
      children: [new TextRun({ text: `CHAPTER ${num}`, font: 'Arial', size: 20, bold: true, color: C.gold, characterSpacing: 200 })],
      spacing: { before: 480, after: 80 },
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: title, font: 'Arial', size: 44, bold: true, color: C.navy })],
      spacing: { before: 0, after: 120 },
      ...thickBorderBottom(C.navy),
    }),
    spacer(160),
  ];
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: 'Arial', size: 28, bold: true, color: C.accent })],
    spacing: { before: 360, after: 120 },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: 'Arial', size: 24, bold: true, color: C.navy })],
    spacing: { before: 240, after: 80 },
  });
}

function body(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: 22, color: C.nearBlack, ...options })],
    spacing: { before: 80, after: 80, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bodyBold(text) {
  return body(text, { bold: true });
}

function italicNote(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: 20, italics: true, color: C.gray })],
    spacing: { before: 80, after: 80, line: 340 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function captionPara(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: 18, italics: true, color: C.gray, bold: true })],
    spacing: { before: 80, after: 200 },
    alignment: AlignmentType.CENTER,
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: C.nearBlack })],
    spacing: { before: 60, after: 60, line: 320 },
  });
}

function tableHeaderCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: C.navy, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, font: 'Arial', size: 20, bold: true, color: C.white })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
    })],
  });
}

function tableCell(text, width, shade = false, bold = false, centered = false) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: shade ? C.lightGray : C.white, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, font: 'Arial', size: 20, color: C.nearBlack, bold })],
      alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 0, after: 0 },
    })],
  });
}

function tableCellMulti(runs, width, shade = false) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: shade ? C.lightGray : C.white, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    children: [new Paragraph({
      children: runs,
      spacing: { before: 0, after: 0 },
    })],
  });
}

function quoteBox(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: {
          top: noBorder,
          bottom: noBorder,
          right: noBorder,
          left: { style: BorderStyle.SINGLE, size: 24, color: C.gold },
        },
        shading: { fill: C.light, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 280, right: 280 },
        children: [new Paragraph({
          children: [new TextRun({ text, font: 'Arial', size: 21, italics: true, color: C.navy })],
          spacing: { before: 0, after: 0, line: 340 },
        })],
      })
    ]})]
  });
}

function sectionDivider() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.border } },
    children: [new TextRun('')],
  });
}

// ─── COVER PAGE ──────────────────────────────────────────────────────────────
function makeCoverSection() {
  return {
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 720, right: 1080, bottom: 720, left: 1080 },
      }
    },
    children: [
      // Top bar
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [new TableRow({ children: [
          new TableCell({
            borders: noBorders,
            shading: { fill: C.navy, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 400, right: 400 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'BCA FINAL SEMESTER PROJECT  ·  PATNA UNIVERSITY  ·  PROJECT SYNOPSIS', font: 'Arial', size: 18, color: C.white, characterSpacing: 120 })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
              })
            ],
          })
        ]})]
      }),
      spacer(400),
      new Paragraph({
        children: [new TextRun({ text: 'LifeOS', font: 'Arial', size: 120, bold: true, color: C.navy })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Smart Life Decision Operating System', font: 'Arial', size: 36, bold: true, color: C.accent, characterSpacing: 60 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 120 },
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.gold } },
        children: [new TextRun('')],
        spacing: { before: 0, after: 0 },
      }),
      spacer(80),
      new Paragraph({
        children: [new TextRun({ text: 'An AI-Powered Mobile Platform for Structured Decision Management,\nOutcome Tracking, and Behavioral Analytics', font: 'Arial', size: 24, italics: true, color: C.gray })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 360 },
      }),
      spacer(200),
      // Student Info Table
      new Table({
        width: { size: 7200, type: WidthType.DXA },
        columnWidths: [2880, 4320],
        rows: [
          ['Student Name',        'Badal Kumar'],
          ['Roll Number',         '10'],
          ['Registration Number', '202324200016'],
          ['College Name',        'Patna College, Patna'],
          ['Session',             '2023 – 2026'],
          ['Project Guide',       '___________________________'],
          ['Designation',         '___________________________'],
        ].map(([label, val], i) => new TableRow({ children: [
          new TableCell({
            borders,
            width: { size: 2880, type: WidthType.DXA },
            shading: { fill: i % 2 === 0 ? C.light : C.white, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 21, bold: true, color: C.navy })], spacing: { before: 0, after: 0 } })],
          }),
          new TableCell({
            borders,
            width: { size: 4320, type: WidthType.DXA },
            shading: { fill: i % 2 === 0 ? C.light : C.white, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: val, font: 'Arial', size: 21, color: C.nearBlack })], spacing: { before: 0, after: 0 } })],
          }),
        ]})),
      }),
      spacer(600),
      new Paragraph({
        children: [new TextRun({ text: 'Academic Year 2023 – 2026', font: 'Arial', size: 20, color: C.gray, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
      }),
    ]
  };
}

// ─── PREAMBLE: Abstract & Declaration ────────────────────────────────────────
function makePreambleSection() {
  return {
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: 'LifeOS — Smart Life Decision Operating System', font: 'Arial', size: 18, color: C.gray }),
            new TextRun({ text: '\t', font: 'Arial' }),
            new TextRun({ text: 'Project Synopsis', font: 'Arial', size: 18, color: C.gray }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
          spacing: { before: 0, after: 100 },
        })
      ]}),
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: 'Patna College, Patna University  ·  BCA Final Semester, 2023–2026', font: 'Arial', size: 16, color: C.gray }),
            new TextRun({ text: '\t', font: 'Arial' }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.gray }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
          spacing: { before: 100, after: 0 },
        })
      ]}),
    },
    children: [
      // ABSTRACT
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Abstract', font: 'Arial', size: 44, bold: true, color: C.navy })],
        spacing: { before: 0, after: 120 },
        ...thickBorderBottom(C.navy),
      }),
      spacer(120),
      body('The ability to make sound, well-reasoned decisions is one of the most defining competencies of human cognition — yet modern individuals lack the infrastructure to systematically record, revisit, and learn from their own decision history. LifeOS is a comprehensive, AI-powered mobile application conceived as a personal decision intelligence platform, designed to bridge this critical gap in personal productivity software.'),
      spacer(40),
      body('This synopsis presents a complete technical and academic documentation of the LifeOS project, encompassing its architectural design, functional scope, technology stack, database schema, API specification, and development methodology. The system is engineered on a modern three-tier client-server architecture: a cross-platform React Native mobile frontend (iOS & Android via Expo SDK 55), a Node.js/Express RESTful backend with Bun runtime, and a PostgreSQL 16 relational database augmented with the pgvector extension for AI-powered semantic similarity search.'),
      spacer(40),
      body('The platform\'s AI Advisor — integrated via the Groq LLM API — enables context-aware decision analysis, decision-making framework recommendations, behavioral pattern detection, and multi-turn conversational intelligence derived from the user\'s personal decision history. The backend exposes 46 versioned REST endpoints across nine resource groups, supported by 15 normalized database tables.'),
      spacer(40),
      body('Expected outcomes include a production-deployable full-stack mobile application, a comprehensive RESTful API, an automated check-in and reminder infrastructure, a behavioral analytics engine, and a reusable decision frameworks library — all architected to scale from prototype to thousands of concurrent users.'),
      spacer(200),
      // TOC placeholder
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Table of Contents', font: 'Arial', size: 44, bold: true, color: C.navy })],
        spacing: { before: 0, after: 120 },
        ...thickBorderBottom(C.navy),
      }),
      spacer(80),
      new TableOfContents('Table of Contents', {
        hyperlink: true,
        headingStyleRange: '1-3',
      }),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 1: INTRODUCTION ─────────────────────────────────────────────────
function makeChapter1() {
  return {
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: 'LifeOS — Smart Life Decision Operating System', font: 'Arial', size: 18, color: C.gray }),
            new TextRun({ text: '\t', font: 'Arial' }),
            new TextRun({ text: 'Chapter 1: Introduction', font: 'Arial', size: 18, color: C.gray }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
          spacing: { before: 0, after: 100 },
        })
      ]}),
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: 'Patna College, Patna University  ·  BCA Final Semester, 2023–2026', font: 'Arial', size: 16, color: C.gray }),
            new TextRun({ text: '\t', font: 'Arial' }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.gray }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
          spacing: { before: 100, after: 0 },
        })
      ]}),
    },
    children: [
      ...chapterLabel('01', 'Introduction'),
      quoteBox('LifeOS addresses a genuine gap in personal productivity software — transforming decision-making from a memory-dependent, ad-hoc activity into a data-driven, reflective practice powered by artificial intelligence.'),
      spacer(200),
      h2('1.1  Background and Problem Statement'),
      body('Decision-making is one of the most consequential cognitive activities in human life. From career transitions and financial investments to health choices and interpersonal commitments, the decisions individuals make shape the trajectories of their lives with compounding effect over time. The seminal work of Kahneman (2011) in Thinking, Fast and Slow identifies systematic cognitive biases — anchoring, availability heuristics, overconfidence — that silently corrupt human judgment without individuals ever becoming aware of the distortion.'),
      spacer(40),
      body('Despite the critical importance of sound decision-making, most individuals lack any systematic approach to recording, evaluating, and learning from their historical decisions. Valuable lessons are forgotten within weeks of an outcome. Repeated mistakes go unnoticed because the causal link between a decision pattern and its recurring consequences is invisible without structured data. Behavioral tendencies — risk aversion in professional domains, overconfidence in interpersonal matters — remain entirely opaque because no instrument exists to surface them.'),
      spacer(40),
      body('Existing productivity applications address adjacent needs: note-taking tools capture thoughts but not structured decision logic; project management platforms track tasks but not the quality of the judgment behind them; journaling applications record emotions but not correlations between confidence levels and actual outcomes. Hammond, Keeney, and Raiffa (1999) in Smart Choices provide rigorous decision-making frameworks, but their application requires conscious manual effort that the majority of users will not sustain across hundreds of daily decisions over years.'),
      spacer(40),
      body('This systemic gap — the absence of a dedicated, intelligent instrument for personal decision intelligence — is the foundational problem LifeOS is engineered to solve.'),
      sectionDivider(),
      h2('1.2  Project Overview'),
      body('LifeOS — Smart Life Decision Operating System is a comprehensive, AI-powered mobile application designed to serve as a personal decision intelligence platform. The system enables users to systematically log life decisions across ten domains: Career, Health, Finance, Relationships, Education, Lifestyle, Business, Personal Growth, Other Specified, and Uncategorized.'),
      spacer(40),
      body('Once a decision is logged through a multi-step creation wizard — capturing title, category, description, contextual factors, evaluated alternatives, expected outcomes, target dates, and a self-assessed confidence level on a scale of one to ten — the platform initiates an automated outcome-tracking lifecycle. Periodic check-in reminders are dispatched at nine intervals: one day, one week, one month, three months, six months, one year, eighteen months, and two years post-decision, constructing a rich longitudinal dataset of real-world outcomes, satisfaction scores, and emotional reflections.'),
      spacer(40),
      body('The integrated AI Advisor, powered by the Groq LLM API with access to the pgvector semantic similarity index of the user\'s decision history, delivers context-aware analysis, decision-making framework recommendations, risk identification, and personalized behavioral insights. The analytics engine computes aggregate metrics, detects behavioral patterns such as confidence-versus-satisfaction correlations and category-specific success rates, and surfaces AI-generated insight cards on the user\'s dashboard.'),
      spacer(200),
      // Decision Lifecycle Table
      h3('Figure 1.1 — The LifeOS Decision Intelligence Lifecycle'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 200, bottom: 200, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'PHASE 01', font: 'Arial', size: 18, bold: true, color: C.gold, characterSpacing: 100 })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 } }),
              new Paragraph({ children: [new TextRun({ text: 'CREATE', font: 'Arial', size: 26, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.accent, type: ShadingType.CLEAR }, margins: { top: 200, bottom: 200, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'PHASE 02', font: 'Arial', size: 18, bold: true, color: C.gold, characterSpacing: 100 })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 } }),
              new Paragraph({ children: [new TextRun({ text: 'TRACK', font: 'Arial', size: 26, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: { top: 200, bottom: 200, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'PHASE 03', font: 'Arial', size: 18, bold: true, color: C.gold, characterSpacing: 100 })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 } }),
              new Paragraph({ children: [new TextRun({ text: 'REFLECT', font: 'Arial', size: 26, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.accent, type: ShadingType.CLEAR }, margins: { top: 200, bottom: 200, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'PHASE 04', font: 'Arial', size: 18, bold: true, color: C.gold, characterSpacing: 100 })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 } }),
              new Paragraph({ children: [new TextRun({ text: 'LEARN', font: 'Arial', size: 26, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.light, type: ShadingType.CLEAR }, margins: { top: 140, bottom: 140, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'Log decision with full context, alternatives, and confidence level (1–10)', font: 'Arial', size: 19, color: C.nearBlack })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.midBlue, type: ShadingType.CLEAR }, margins: { top: 140, bottom: 140, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'Scheduled check-ins at 9 intervals from 1 day to 2 years', font: 'Arial', size: 19, color: C.nearBlack })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.light, type: ShadingType.CLEAR }, margins: { top: 140, bottom: 140, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'Record outcomes, satisfaction scores, and emotional state', font: 'Arial', size: 19, color: C.nearBlack })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: C.midBlue, type: ShadingType.CLEAR }, margins: { top: 140, bottom: 140, left: 160, right: 160 }, children: [
              new Paragraph({ children: [new TextRun({ text: 'AI-powered insights, pattern detection, and framework recommendations', font: 'Arial', size: 19, color: C.nearBlack })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } }),
            ]}),
          ]}),
        ]
      }),
      captionPara('Figure 1.1 — Four-phase lifecycle governing every decision logged in the LifeOS platform'),
      spacer(200),
      h2('1.3  Significance and Academic Contribution'),
      body('The academic and practical significance of LifeOS is multifaceted. From a software engineering perspective, the project demonstrates the full-stack integration of modern mobile development practices — React Native cross-platform development, RESTful API design, relational database normalization — with emerging AI capabilities through large language model APIs and vector database semantics.'),
      spacer(40),
      body('From a behavioral science perspective, the platform operationalizes established decision-making research into an accessible consumer application, making sophisticated frameworks such as the Weighted Decision Matrix, Premortem Analysis, and Second-Order Thinking available to users without requiring academic background in decision theory.'),
      spacer(40),
      body('The longitudinal outcome-tracking architecture creates a unique personal dataset that no commercially available application currently captures at this granularity — enabling, for the first time, empirically grounded personal decision analytics driven by the user\'s own life history rather than aggregated population data.'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 2: OBJECTIVES ───────────────────────────────────────────────────
function makeChapter2() {
  const objectives = [
    ['01', 'Structured Decision Logging',     'Design and implement a multi-step decision creation wizard capturing title, category, description, contextual factors, evaluated alternatives, expected outcomes, target dates, and a self-assessed confidence level on a scale of one to ten across ten decision domains.'],
    ['02', 'Automated Outcome Tracking',       'Build an automated outcome-tracking infrastructure that schedules periodic reminder notifications at nine intervals — 1 day, 1 week, 1 month, 3 months, 6 months, 1 year, 18 months, and 2 years — and records satisfaction scores, measurable metrics, and textual reflections at each checkpoint.'],
    ['03', 'AI-Powered Decision Analysis',     'Integrate a conversational AI Advisor via the Groq LLM API, enabling analysis of user decisions, recommendation of established decision-making frameworks, identification of decision risks and biases, and personalized suggestions contextualized by the user\'s historical decision data via pgvector semantic search.'],
    ['04', 'Analytics and Pattern Recognition','Develop an analytics engine that computes aggregate user metrics, renders decision quality trend visualizations, detects behavioral patterns such as confidence-vs-satisfaction correlations and domain-specific success rates, and surfaces AI-generated personalized insight cards.'],
    ['05', 'Frameworks and Templates Library', 'Provide a reusable library of system-provided and user-created decision frameworks and templates that autofill decision creation forms with structured prompts, lowering the barrier to applying rigorous decision methodology.'],
    ['06', 'Secure Authentication System',     'Implement a robust JWT-based authentication system incorporating access and refresh token rotation, device-level encrypted credential storage via Expo SecureStore, logout with server-side token revocation, and user profile management.'],
    ['07', 'Cross-Platform Mobile Application','Deliver a premium, minimalist cross-platform mobile application for iOS and Android built on React Native 0.83 and Expo SDK 55, featuring skeleton loading states, smooth transitions, and a consistent design system.'],
    ['08', 'Notification Infrastructure',      'Implement a notification system delivering timely check-in reminders, AI insight alerts, and system notifications through both push and in-app channels, configurable per user at the individual notification category level.'],
  ];
  return {
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        children: [
          new TextRun({ text: 'LifeOS — Smart Life Decision Operating System', font: 'Arial', size: 18, color: C.gray }),
          new TextRun({ text: '\t' }), new TextRun({ text: 'Chapter 2: Objectives', font: 'Arial', size: 18, color: C.gray }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
        spacing: { before: 0, after: 100 },
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        children: [
          new TextRun({ text: 'Patna College, Patna University  ·  BCA Final Semester, 2023–2026', font: 'Arial', size: 16, color: C.gray }),
          new TextRun({ text: '\t' }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.gray }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
        spacing: { before: 100, after: 0 },
      })] }),
    },
    children: [
      ...chapterLabel('02', 'Objectives of the Project'),
      body('The LifeOS project is designed to achieve eight clearly defined technical and functional objectives, each mapped to a discrete deliverable component of the final system. These objectives collectively span the full spectrum of modern full-stack mobile application development, AI integration, and behavioral analytics engineering.'),
      spacer(120),
      h3('Figure 2.1 — Eight Core Project Objectives'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [560, 2200, 6600],
        rows: [
          new TableRow({ children: [
            tableHeaderCell('#', 560),
            tableHeaderCell('Objective', 2200),
            tableHeaderCell('Description', 6600),
          ]}),
          ...objectives.map(([num, title, desc], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? C.light : C.white, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: num, font: 'Arial', size: 20, bold: true, color: C.accent })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })] }),
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? C.light : C.white, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: title, font: 'Arial', size: 20, bold: true, color: C.navy })], spacing: { before: 0, after: 0 } })] }),
            new TableCell({ borders, width: { size: 6600, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? C.light : C.white, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: desc, font: 'Arial', size: 19, color: C.nearBlack })], alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 0, line: 300 } })] }),
          ]})),
        ]
      }),
      captionPara('Figure 2.1 — Complete mapping of the eight project objectives to their functional scope'),
      spacer(200),
      h2('2.1  Objective Interdependencies and Prioritization'),
      body('The eight objectives above are not independent; they form a dependency graph that governs the development sequence. Objective 06 (Secure Authentication) is the foundational prerequisite for all other modules — no feature is accessible without an authenticated session. Objectives 01 and 02 (Decision Logging and Outcome Tracking) form the data-generation layer upon which Objectives 03 and 04 (AI Analysis and Analytics) depend entirely: without a populated, structured decision history, neither the AI Advisor nor the analytics engine has meaningful input to operate on.'),
      spacer(40),
      body('Objectives 05, 07, and 08 are enabling objectives: the Frameworks Library enriches the data quality of Objective 01, the Cross-Platform Mobile Application is the delivery vehicle for all other objectives, and the Notification Infrastructure is the mechanism by which Objective 02\'s automated check-in system is operationalized. This dependency architecture informed the five-phase Agile development methodology described in Chapter 4.'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 3: SCOPE ────────────────────────────────────────────────────────
function makeChapter3() {
  const modules = [
    ['Authentication', 'JWT Access + Refresh Tokens with automatic rotation on every refresh request', 'Secure device token storage via Expo SecureStore (AES-256)', 'Logout with server-side token revocation', 'User profile creation and management'],
    ['Decision Management', 'Multi-step creation wizard capturing all decision metadata', '10 categories, 4 statuses (Active, Completed, Abandoned, Revisiting)', 'Full-text search, multi-field filtering, and paginated list views', 'Confidence ring visualization (1–10 scale)'],
    ['Outcome & Check-ins', '9 reminder intervals from 1 day to 2 years post-decision', 'Satisfaction score tracking (1–10) per check-in', 'Mood and stress capture at each outcome record', 'Outcome timeline view for longitudinal review'],
    ['AI Advisor', 'Conversational multi-turn chat sessions with session history', 'Decision framework recommendations from structured library', 'pgvector semantic similarity search over decision history', 'Markdown-rendered AI responses with structured formatting'],
    ['Analytics & Insights', 'Summary statistics dashboard with aggregate user metrics', 'Decision quality trend chart over time', 'Behavioral pattern detection engine', 'AI-generated personalized insight cards'],
    ['Profile & Settings', 'Extended profile fields: bio, occupation, location', 'Granular notification preferences per category', 'Custom decision frameworks and templates creation', 'Light and Dark theme toggle'],
  ];
  return {
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        children: [
          new TextRun({ text: 'LifeOS — Smart Life Decision Operating System', font: 'Arial', size: 18, color: C.gray }),
          new TextRun({ text: '\t' }), new TextRun({ text: 'Chapter 3: Scope', font: 'Arial', size: 18, color: C.gray }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
        spacing: { before: 0, after: 100 },
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        children: [
          new TextRun({ text: 'Patna College, Patna University  ·  BCA Final Semester, 2023–2026', font: 'Arial', size: 16, color: C.gray }),
          new TextRun({ text: '\t' }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.gray }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
        spacing: { before: 100, after: 0 },
      })] }),
    },
    children: [
      ...chapterLabel('03', 'Scope of the Project'),
      body('The scope of LifeOS is defined across two dimensions: the feature modules included in the present submission (in-scope) and the capabilities architecturally planned but deferred to post-submission releases (out-of-scope). This delineation ensures focused, high-quality delivery while preserving a clear roadmap for the platform\'s commercial evolution.'),
      spacer(120),
      h2('3.1  In-Scope: Six Core Feature Modules'),
      h3('Figure 3.1 — Feature Module Scope and Capabilities'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 7360],
        rows: [
          new TableRow({ children: [
            tableHeaderCell('Module', 2000),
            tableHeaderCell('In-Scope Capabilities', 7360),
          ]}),
          ...modules.map(([mod, ...caps], i) => new TableRow({ children: [
            new TableCell({
              borders, width: { size: 2000, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? C.light : C.midBlue, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ children: [new TextRun({ text: mod, font: 'Arial', size: 20, bold: true, color: C.navy })], spacing: { before: 0, after: 0 } })],
            }),
            new TableCell({
              borders, width: { size: 7360, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? C.light : C.midBlue, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: caps.map(cap => new Paragraph({
                numbering: { reference: 'bullets', level: 0 },
                children: [new TextRun({ text: cap, font: 'Arial', size: 19, color: C.nearBlack })],
                spacing: { before: 40, after: 40, line: 280 },
              })),
            }),
          ]})),
        ]
      }),
      captionPara('Figure 3.1 — Six core modules and their in-scope capabilities for the present submission'),
      spacer(200),
      h2('3.2  Out-of-Scope: Future Roadmap Capabilities'),
      quoteBox('The following capabilities are architecturally planned but deferred to post-submission releases to maintain project focus, deliverable quality, and submission timeline adherence.'),
      spacer(120),
      h3('Figure 3.2 — Future Roadmap: Out-of-Scope Capabilities'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 6360],
        rows: [
          new TableRow({ children: [tableHeaderCell('Capability', 3000), tableHeaderCell('Rationale for Deferral', 6360)] }),
          ...[
            ['Social and Community Features', 'Public decision sharing and collaborative group decisions require a robust content moderation layer and privacy governance framework beyond the scope of a single-semester project.'],
            ['Premium Subscription Billing', 'Stripe payment integration is architecturally designed and schema-prepared but not activated; commercial monetization requires external business and legal review.'],
            ['Web Application Frontend', 'A full web frontend would double the frontend development scope; the mobile application is the primary validated use case for the target demographic.'],
            ['Offline-First Mode with SQLite Sync', 'Bi-directional sync between device-local SQLite and the cloud PostgreSQL database is a complex engineering problem requiring a dedicated sync conflict-resolution architecture.'],
            ['Multi-Language (i18n) Support', 'Internationalisation requires professional translation of all UI strings and right-to-left layout support; deferred to a dedicated localisation sprint.'],
            ['Biometric Authentication', 'Face ID and Fingerprint authentication via Expo LocalAuthentication will be added in a security-focused maintenance release.'],
          ].map(([cap, rationale], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: i%2===0?C.light:C.white, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: cap, font: 'Arial', size: 20, bold: true, color: C.navy })], spacing: { before: 0, after: 0 } })] }),
            new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, shading: { fill: i%2===0?C.light:C.white, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: rationale, font: 'Arial', size: 19, color: C.nearBlack })], alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 0, line: 300 } })] }),
          ]})),
        ]
      }),
      captionPara('Figure 3.2 — Deferred capabilities with rationale, forming the commercial post-submission roadmap'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 4: METHODOLOGY ──────────────────────────────────────────────────
function makeChapter4() {
  return {
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: 'LifeOS — Smart Life Decision Operating System', font: 'Arial', size: 18, color: C.gray }), new TextRun({ text: '\t' }), new TextRun({ text: 'Chapter 4: Methodology', font: 'Arial', size: 18, color: C.gray })], tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } }, spacing: { before: 0, after: 100 } })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({ text: 'Patna College, Patna University  ·  BCA Final Semester, 2023–2026', font: 'Arial', size: 16, color: C.gray }), new TextRun({ text: '\t' }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: C.gray })], tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } }, spacing: { before: 100, after: 0 } })] }) },
    children: [
      ...chapterLabel('04', 'Methodology and System Design'),
      body('The LifeOS project follows an Agile development methodology with five iterative, incremental phases. Each phase is time-boxed, has clearly defined deliverables, and produces testable artifacts. The Agile approach was selected over waterfall methodology because the AI integration components — particularly the Groq LLM API interaction patterns and the pgvector semantic search configuration — required rapid prototyping and iterative refinement that a rigid sequential model could not accommodate.'),
      spacer(120),
      h2('4.1  Five-Phase Agile Development Methodology'),
      h3('Figure 4.1 — Development Phases, Timeline, and Key Deliverables'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [400, 1600, 1200, 6160],
        rows: [
          new TableRow({ children: [tableHeaderCell('#', 400), tableHeaderCell('Phase', 1600), tableHeaderCell('Timeline', 1200), tableHeaderCell('Key Deliverables', 6160)] }),
          ...[
            ['1', 'Requirements & Architecture', 'Weeks 1–2',  'Entity-Relationship modelling · API endpoint specification · UI wireframing · Competitive application study · Technology stack finalisation'],
            ['2', 'Backend Development (Core)',  'Weeks 3–7',  'PostgreSQL schema with all 15 tables · Express API routes for auth, users, decisions, outcomes · JWT authentication middleware · Drizzle ORM integration'],
            ['3', 'Backend (AI & Analytics)',    'Weeks 5–7',  'Groq SDK integration · pgvector semantic search · Analytics aggregate computation · AI insight generation · Notification scheduler'],
            ['4', 'Mobile Frontend',            'Weeks 8–12', 'React Native screens (9+ views) · Expo Router navigation · React Query server state · Zustand auth store · Design system implementation'],
            ['5', 'Integration, Testing & Docs','Weeks 13–15','End-to-end API integration · Cross-platform validation (iOS & Android) · Postman collection (46 endpoints) · Cloud deployment · Synopsis and technical report'],
          ].map(([n, phase, time, deliv], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:400,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:100,right:100}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:n,font:'Arial',size:20,bold:true,color:C.accent})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:1600,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:phase,font:'Arial',size:20,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:1200,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:time,font:'Arial',size:19,color:C.accent,bold:true})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:6160,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:deliv,font:'Arial',size:19,color:C.nearBlack})],spacing:{before:0,after:0,line:300}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 4.1 — Five-phase development methodology with timeline and deliverable mapping'),
      spacer(200),
      h2('4.2  System Architecture: Three-Tier Client-Server Model'),
      body('The system is structured into three distinct architectural tiers, each with clear responsibilities, technology boundaries, and communication contracts. The Presentation Layer communicates with the Application Layer exclusively through HTTPS REST API calls carrying JWT Bearer tokens in the Authorization header. The Application Layer communicates with the Data Layer through Drizzle ORM\'s type-safe query API over a secure connection string, never exposing raw database credentials to the application logic.'),
      spacer(120),
      h3('Figure 4.2 — Three-Tier System Architecture'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.navy,type:ShadingType.CLEAR}, margins:{top:160,bottom:160,left:240,right:240}, children:[new Paragraph({children:[new TextRun({text:'TIER 1 — PRESENTATION LAYER',font:'Arial',size:20,bold:true,color:C.gold,characterSpacing:100})],alignment:AlignmentType.CENTER,spacing:{before:0,after:60}}), new Paragraph({children:[new TextRun({text:'React Native 0.83 + Expo SDK 55 · Cross-Platform Mobile Application (iOS & Android)',font:'Arial',size:22,bold:true,color:C.white})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] })] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.light,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:240,right:240}, children:[
            new Paragraph({children:[new TextRun({text:'Expo Router v4  ·  File-based navigation (stacks, tabs, modals)',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'React Query v5  ·  Server state management with caching and background refetch',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Zustand v5  ·  Lightweight global store for authentication state',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Axios v1  ·  HTTP client with automatic JWT Bearer token injection interceptor',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Expo SecureStore  ·  AES-256 encrypted credential and token storage on device',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
          ]} )] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.accent,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:240,right:240}, children:[new Paragraph({children:[new TextRun({text:'↕  HTTPS / REST API  ·  JWT Bearer Token Authentication  ↕',font:'Arial',size:19,bold:true,color:C.white})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] })] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.navy,type:ShadingType.CLEAR}, margins:{top:160,bottom:160,left:240,right:240}, children:[new Paragraph({children:[new TextRun({text:'TIER 2 — APPLICATION LAYER',font:'Arial',size:20,bold:true,color:C.gold,characterSpacing:100})],alignment:AlignmentType.CENTER,spacing:{before:0,after:60}}), new Paragraph({children:[new TextRun({text:'Node.js 20 + Bun 1.x + Express.js 4.x + TypeScript 5.x',font:'Arial',size:22,bold:true,color:C.white})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] })] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.midBlue,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:240,right:240}, children:[
            new Paragraph({children:[new TextRun({text:'Routes → Controllers → Services  ·  Clean separation-of-concerns MVC pattern',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'JWT Auth Middleware  ·  Access + Refresh token rotation on every refresh',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Drizzle ORM 0.3x  ·  TypeScript-first schema-driven query builder and migration manager',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Groq SDK  ·  LLM client for AI Advisor (Llama 3 / Mixtral models)',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Input Validation + Structured Error Handling  ·  Consistent API response envelope',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
          ]} )] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.accent,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:240,right:240}, children:[new Paragraph({children:[new TextRun({text:'↕  Drizzle ORM  ·  Type-Safe PostgreSQL Queries  ↕',font:'Arial',size:19,bold:true,color:C.white})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] })] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.navy,type:ShadingType.CLEAR}, margins:{top:160,bottom:160,left:240,right:240}, children:[new Paragraph({children:[new TextRun({text:'TIER 3 — DATA LAYER',font:'Arial',size:20,bold:true,color:C.gold,characterSpacing:100})],alignment:AlignmentType.CENTER,spacing:{before:0,after:60}}), new Paragraph({children:[new TextRun({text:'PostgreSQL 16 + pgvector Extension + Redis Job Queue',font:'Arial',size:22,bold:true,color:C.white})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] })] }),
          new TableRow({ children: [new TableCell({ borders, width:{size:9360,type:WidthType.DXA}, shading:{fill:C.light,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:240,right:240}, children:[
            new Paragraph({children:[new TextRun({text:'15 normalized relational tables  ·  Third Normal Form (3NF) schema design',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'pgvector extension  ·  High-dimensional vector similarity search for AI semantic retrieval',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'analytics_aggregates table  ·  Pre-computed user metrics for dashboard performance',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Redis  ·  Background job queue for notification scheduling and async processing',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
            new Paragraph({children:[new TextRun({text:'Managed cloud PostgreSQL  ·  Production deployment with TLS 1.3 encryption',font:'Arial',size:19,color:C.nearBlack})],spacing:{before:20,after:20}}),
          ]} )] }),
        ]
      }),
      captionPara('Figure 4.2 — Three-tier client-server architecture with full technology detail per layer'),
      spacer(200),
      h2('4.3  Database Design — 15-Table Normalized Schema'),
      body('The PostgreSQL database is normalized to Third Normal Form (3NF) across 15 core tables, each covering a discrete feature domain. The schema ensures referential integrity through foreign key constraints, uses UUID primary keys for all records to support future distributed deployment, and employs the pgvector extension to store 1,536-dimensional embedding vectors on decision records for semantic similarity search.'),
      spacer(120),
      h3('Figure 4.3 — Complete Database Schema: 15 Tables and Their Purpose'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 1400, 5760],
        rows: [
          new TableRow({ children: [tableHeaderCell('Table Name', 2200), tableHeaderCell('Domain', 1400), tableHeaderCell('Purpose and Key Fields', 5760)] }),
          ...[
            ['users',                 'Auth',      'User accounts — email (unique), bcrypt password hash, role (user/admin), account status (active/suspended/deleted), timestamps'],
            ['user_profiles',         'Auth',      'Extended profile — bio (text), occupation, location, notification_email flag, notification_push flag, theme preference'],
            ['refresh_tokens',        'Auth',      'JWT refresh token lifecycle — token hash, user_id FK, device identifier, issued_at, expires_at, revoked_at (nullable)'],
            ['decisions',             'Core',      'Decision records — title, category (enum 10 values), description, context, alternatives (JSONB), expected_outcome, confidence_level (1–10), status (enum 4 values), target_date, embedding (vector)'],
            ['outcome_records',       'Tracking',  'Check-in data — decision_id FK, interval_type (enum), satisfaction_score (1–10), actual_outcome (text), mood (enum), stress_level (1–10), reflections, financial_impact'],
            ['outcome_reminders',     'Tracking',  'Scheduled reminders — decision_id FK, interval_type, scheduled_date, sent_at (nullable), status (pending/sent/skipped/cancelled)'],
            ['ai_interaction_logs',   'AI',        'AI analysis audit — decision_id FK, user_id FK, interaction_type (enum), prompt_tokens, completion_tokens, model_used, latency_ms'],
            ['chat_sessions',         'AI',        'Chat session metadata — user_id FK, title (auto-generated), decision_id FK (nullable, for decision-specific chats), last_message_at'],
            ['chat_messages',         'AI',        'Individual message turns — session_id FK, role (user/assistant/system), content (text), token_count, created_at'],
            ['decision_frameworks',   'Library',   'Framework definitions — name, description, category_tags (array), steps (JSONB array), is_system (bool), created_by FK (nullable for system)'],
            ['decision_templates',     'Library',   'Pre-built templates — title, framework_id FK, prompt_fields (JSONB), suggested_alternatives (array), is_system bool, usage_count'],
            ['notifications',         'Notifs',    'In-app notifications — user_id FK, type (enum), title, body, related_entity_id, related_entity_type, is_read bool, read_at'],
            ['analytics_aggregates',  'Analytics', 'Pre-computed metrics — user_id FK, total_decisions, decisions_by_category (JSONB), avg_confidence, avg_satisfaction, last_computed_at'],
            ['decision_patterns',     'Analytics', 'Behavioral patterns — user_id FK, pattern_type (enum), description, confidence_score (0–1), supporting_decision_ids (array), detected_at'],
            ['user_insights',         'Analytics', 'AI insights — user_id FK, insight_type (enum), title, content (markdown), is_dismissed bool, generated_at, expires_at'],
          ].map(([table, domain, purpose], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:2200,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:table,font:'Courier New',size:18,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:1400,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:domain,font:'Arial',size:18,bold:true,color:C.accent})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:5760,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:purpose,font:'Arial',size:18,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:280}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 4.3 — Complete 15-table PostgreSQL schema with domain classification and key field descriptions'),
      spacer(160),
      h2('4.4  API Design — 46 Endpoints Across 9 Resource Groups'),
      body('The backend exposes 46 RESTful endpoints versioned under the /api/v1 path prefix, following REST architectural constraints: stateless communication, uniform interface with resource-oriented URLs, and consistent response envelopes. Successful single-resource responses use the { data } envelope; collection responses use { data, pagination } with cursor-based pagination; error responses use the { error: { code, message, details } } envelope.'),
      spacer(80),
      h3('Figure 4.4 — API Endpoint Distribution Across Resource Groups'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1040, 1600, 800, 5920],
        rows: [
          new TableRow({ children: [tableHeaderCell('Count', 1040), tableHeaderCell('Resource Group', 1600), tableHeaderCell('Prefix', 800), tableHeaderCell('Key Endpoints', 5920)] }),
          ...[
            ['4',  'Authentication',    '/auth',          'POST /register · POST /login · POST /refresh · POST /logout'],
            ['4',  'Users',             '/users',         'GET /me · PATCH /me · PUT /me/password · DELETE /me'],
            ['5',  'Decisions',         '/decisions',     'POST / · GET / (paginated) · GET /:id · PATCH /:id · DELETE /:id'],
            ['8',  'Outcomes',          '/outcomes',      'POST /:decisionId · GET /:decisionId (list) · GET /:id · PATCH /:id · GET /timeline · GET /reminders · PATCH /reminders/:id · DELETE /:id'],
            ['5',  'Analytics',         '/analytics',     'GET /summary · GET /trends · GET /patterns · GET /insights · POST /insights/:id/dismiss'],
            ['6',  'AI Engine',         '/ai',            'POST /analyze · POST /sessions · GET /sessions · POST /sessions/:id/messages · GET /sessions/:id/messages · DELETE /sessions/:id'],
            ['5',  'Frameworks',        '/frameworks',    'GET / · POST / · GET /:id · PATCH /:id · DELETE /:id'],
            ['5',  'Templates',         '/templates',     'GET / · POST / · GET /:id · PATCH /:id · DELETE /:id'],
            ['4',  'Notifications',     '/notifications', 'GET / · PATCH /:id/read · POST /read-all · GET /preferences · PATCH /preferences'],
          ].map(([count, group, prefix, endpoints], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:1040,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:count,font:'Arial',size:22,bold:true,color:C.navy})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:1600,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:group,font:'Arial',size:19,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:800,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:prefix,font:'Courier New',size:17,color:C.accent,bold:true})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:5920,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:endpoints,font:'Courier New',size:16,color:C.nearBlack})],spacing:{before:0,after:0,line:280}})] }),
          ]})),
          new TableRow({ children: [
            new TableCell({ borders, width:{size:1040,type:WidthType.DXA}, shading:{fill:C.navy,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:'46',font:'Arial',size:24,bold:true,color:C.gold})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, colSpan:3, width:{size:8320,type:WidthType.DXA}, shading:{fill:C.navy,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:'TOTAL ENDPOINTS  ·  Versioned under /api/v1  ·  Consistent response envelope throughout',font:'Arial',size:19,bold:true,color:C.white})],spacing:{before:0,after:0}})] }),
          ]}),
        ]
      }),
      captionPara('Figure 4.4 — 46 REST endpoints distributed across 9 resource groups with routing prefixes'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 5: TECHNOLOGY STACK ─────────────────────────────────────────────
function makeChapter5() {
  return {
    properties: { page: { size:{width:12240,height:15840}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({text:'LifeOS — Smart Life Decision Operating System',font:'Arial',size:18,color:C.gray}), new TextRun({text:'\t'}), new TextRun({text:'Chapter 5: Tools & Technologies',font:'Arial',size:18,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:0,after:100} })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({text:'Patna College, Patna University  ·  BCA Final Semester, 2023–2026',font:'Arial',size:16,color:C.gray}), new TextRun({text:'\t'}), new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:100,after:0} })] }) },
    children: [
      ...chapterLabel('05', 'Tools and Technologies'),
      body('The LifeOS technology stack was selected based on three selection criteria applied uniformly across all components: (1) production maturity — each technology must be stable, actively maintained, and deployed at commercial scale; (2) type safety — TypeScript is used end-to-end across both frontend and backend to catch integration errors at compile time; and (3) developer velocity — the chosen tools must support rapid iteration through excellent tooling, documentation, and ecosystem support.'),
      spacer(120),
      h2('5.1  Frontend Technology Stack'),
      h3('Figure 5.1 — Frontend Technologies: Version, Purpose, and Justification'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 900, 3000, 3660],
        rows: [
          new TableRow({ children: [tableHeaderCell('Technology', 1800), tableHeaderCell('Version', 900), tableHeaderCell('Primary Purpose', 3000), tableHeaderCell('Selection Justification', 3660)] }),
          ...[
            ['React Native',    '0.83',  'Cross-platform UI framework',             'Single codebase targeting iOS and Android; maintained by Meta; industry-standard for production mobile apps'],
            ['Expo SDK',        '55',    'Development platform and native API layer','Managed workflow with EAS Build; simplifies native module access; accelerates build and OTA update cycle'],
            ['Expo Router',     'v4',    'File-based navigation (stacks, tabs)',     'Declarative routing analogous to Next.js; eliminates manual navigator configuration; supports deep linking natively'],
            ['React Query',     '5.x',  'Server state management',                  'Automatic caching, background refetch, and optimistic updates; eliminates boilerplate data-fetching code'],
            ['Zustand',         '5.x',  'Global state (auth, theme)',               'Minimal API (< 1KB); no boilerplate; avoids Redux complexity for a focused state surface'],
            ['Axios',           '1.x',  'HTTP client with interceptors',            'Request interceptor for automatic JWT Bearer injection; response interceptor for token refresh on 401'],
            ['Expo SecureStore','—',     'Encrypted credential storage',            'AES-256 device-level encryption; replaces insecure AsyncStorage for sensitive tokens'],
            ['TypeScript',      '5.x',  'Static type safety across all code',       'End-to-end type contracts between API response shapes and UI component props; catches integration bugs at compile time'],
          ].map(([tech, ver, purpose, just], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:1800,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:tech,font:'Arial',size:19,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:900,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:ver,font:'Courier New',size:18,color:C.accent,bold:true})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:3000,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:purpose,font:'Arial',size:18,color:C.nearBlack})],spacing:{before:0,after:0,line:280}})] }),
            new TableCell({ borders, width:{size:3660,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:just,font:'Arial',size:18,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:280}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 5.1 — Frontend technology stack with version, purpose, and selection rationale'),
      spacer(200),
      h2('5.2  Backend Technology Stack'),
      h3('Figure 5.2 — Backend Technologies: Version, Purpose, and Justification'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 900, 3000, 3660],
        rows: [
          new TableRow({ children: [tableHeaderCell('Technology', 1800), tableHeaderCell('Version', 900), tableHeaderCell('Primary Purpose', 3000), tableHeaderCell('Selection Justification', 3660)] }),
          ...[
            ['Node.js + Bun',  '20+ / 1.x','Server runtime and package manager',    'Bun\'s native TypeScript execution and 3x faster npm install speed reduce build times significantly'],
            ['Express.js',     '4.x',       'HTTP server and middleware pipeline',   'Minimal, unopinionated framework; vast middleware ecosystem; compatible with all required authentication and validation packages'],
            ['TypeScript',     '5.x',       'Static typing for backend code',        'Shared type definitions between API response shapes and frontend consumers; schema-level safety with Drizzle ORM'],
            ['Drizzle ORM',    '0.3x',      'Type-safe database query builder',      'TypeScript-first with zero-runtime type inference; migration via Drizzle Kit; no magic like ActiveRecord — queries are explicit SQL'],
            ['jsonwebtoken',   '—',         'JWT creation and verification',         'RFC 7519 compliant; supports RS256 and HS256; enables stateless authentication with refresh token rotation pattern'],
            ['bcrypt',         '—',         'Password hashing',                     'bcrypt\'s adaptive work factor resists brute-force attacks; cost factor configurable without schema changes'],
            ['Groq SDK',       '—',         'LLM API client for AI Advisor',        'Groq\'s hardware-accelerated inference delivers sub-second latency on Llama 3 models; cost-effective for per-request API usage'],
          ].map(([tech, ver, purpose, just], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:1800,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:tech,font:'Arial',size:19,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:900,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:ver,font:'Courier New',size:18,color:C.accent,bold:true})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:3000,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:purpose,font:'Arial',size:18,color:C.nearBlack})],spacing:{before:0,after:0,line:280}})] }),
            new TableCell({ borders, width:{size:3660,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:just,font:'Arial',size:18,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:280}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 5.2 — Backend technology stack with version, purpose, and engineering rationale'),
      spacer(200),
      h2('5.3  Development Tooling'),
      h3('Figure 5.3 — Development and Testing Tools'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 7160],
        rows: [
          new TableRow({ children: [tableHeaderCell('Tool', 2200), tableHeaderCell('Purpose and Role in Development Workflow', 7160)] }),
          ...[
            ['Visual Studio Code', 'Primary editor with ESLint, Prettier, and TypeScript ESLint extensions. Workspace settings enforce consistent formatting and catch type errors on save across both frontend and backend workspaces.'],
            ['Git & GitHub',       'Version control with a branching strategy: main (production), develop (integration), feature/* (individual features), hotfix/* (critical patches). Commit messages follow Conventional Commits specification.'],
            ['Postman',            'API testing and documentation for all 46 endpoints. Postman Collection exported as JSON and submitted with the project; environment variables manage base URL, auth token, and test user credentials.'],
            ['Expo Go',            'Live preview on physical iOS and Android devices during development. Enables instant OTA preview of React Native code changes without a native build cycle.'],
            ['Drizzle Kit',        'Schema migration management. drizzle-kit generate produces SQL migration files from TypeScript schema changes; drizzle-kit push applies them to the development database without manual SQL authoring.'],
          ].map(([tool, desc], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:2200,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:tool,font:'Arial',size:20,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:7160,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:desc,font:'Arial',size:19,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:300}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 5.3 — Development tooling, testing infrastructure, and workflow integration'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 6: SYSTEM REQUIREMENTS ─────────────────────────────────────────
function makeChapter6() {
  return {
    properties: { page: { size:{width:12240,height:15840}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({text:'LifeOS — Smart Life Decision Operating System',font:'Arial',size:18,color:C.gray}), new TextRun({text:'\t'}), new TextRun({text:'Chapter 6: System Requirements',font:'Arial',size:18,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:0,after:100} })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({text:'Patna College, Patna University  ·  BCA Final Semester, 2023–2026',font:'Arial',size:16,color:C.gray}), new TextRun({text:'\t'}), new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:100,after:0} })] }) },
    children: [
      ...chapterLabel('06', 'System Requirements'),
      body('System requirements for LifeOS are defined at two levels: the development environment required to build, run, and test the application during development; and the end-user requirements that must be satisfied for the deployed application to function correctly in production.'),
      spacer(120),
      h2('6.1  Development Environment Requirements'),
      h3('Figure 6.1 — Developer Workstation Minimum Specifications'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 3000, 3960],
        rows: [
          new TableRow({ children: [tableHeaderCell('Component', 2400), tableHeaderCell('Minimum Specification', 3000), tableHeaderCell('Recommended Specification', 3960)] }),
          ...[
            ['Processor',    'Intel Core i5 (8th Gen) or AMD Ryzen 5 · 4 cores minimum', 'Intel Core i7 (10th Gen+) or AMD Ryzen 7 · 8 cores for parallel Expo + backend'],
            ['RAM',          '8 GB · minimum for basic development',                    '16 GB · required for running iOS Simulator and Android Emulator simultaneously'],
            ['Storage',      '256 GB SSD · 50 GB free for tooling, builds, and node_modules', '512 GB NVMe SSD · faster builds with Bun and Expo prebuild'],
            ['Operating System', 'Windows 10/11, macOS 12 Monterey+, or Ubuntu 20.04 LTS', 'macOS 13+ · required for iOS Simulator; Windows/Linux cannot run XCode'],
            ['Node.js',      '20.x LTS · required for npm tooling compatibility',       'Latest 20.x LTS with Bun 1.x installed globally as package manager'],
            ['PostgreSQL',   '16 (local installation) or managed cloud instance',       'Managed cloud PostgreSQL (Supabase / Neon) · avoids local configuration'],
            ['Expo CLI',     'Latest stable release via npm',                           'EAS CLI installed globally for cloud builds and OTA updates'],
          ].map(([comp, min, rec], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:2400,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:comp,font:'Arial',size:19,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:3000,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:min,font:'Arial',size:18,color:C.nearBlack})],spacing:{before:0,after:0,line:280}})] }),
            new TableCell({ borders, width:{size:3960,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:rec,font:'Arial',size:18,color:C.nearBlack})],spacing:{before:0,after:0,line:280}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 6.1 — Development environment hardware and software specifications'),
      spacer(200),
      h2('6.2  End-User (Production) Requirements'),
      h3('Figure 6.2 — End-User Platform Requirements for Production Deployment'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1600, 7760],
        rows: [
          new TableRow({ children: [tableHeaderCell('Platform', 1600), tableHeaderCell('Minimum Requirements', 7760)] }),
          ...[
            ['Android', 'Android 10 (API Level 29) or higher · 100 MB free storage · Active internet connection (Wi-Fi or 4G/LTE minimum) · Google Play Services for push notification delivery via FCM'],
            ['iOS',     'iOS 15.0 or higher · iPhone 6s or later · 100 MB free storage · Active internet connection · APNs (Apple Push Notification service) access for push notifications'],
            ['Backend', 'Cloud VPS with minimum 2 vCPU and 4 GB RAM · Managed PostgreSQL 16 instance with pgvector extension enabled · Redis 7.x instance for job queue · TLS 1.3 certificate for HTTPS · Node.js 20.x runtime'],
          ].map(([plat, req], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:1600,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:120,bottom:120,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:plat,font:'Arial',size:22,bold:true,color:C.navy})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:7760,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:120,bottom:120,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:req,font:'Arial',size:19,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:300}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 6.2 — End-user and production server requirements for LifeOS deployment'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 7: EXPECTED OUTCOMES ────────────────────────────────────────────
function makeChapter7() {
  const outcomes = [
    ['01', 'Cross-Platform Mobile Application', 'A production-quality iOS and Android application built in React Native 0.83 + Expo SDK 55, comprising nine or more screens: Onboarding, Authentication (Register/Login), Main Dashboard, Decision Creation Wizard (multi-step), Decision Detail, Outcome Check-In, AI Advisor Chat, Analytics Dashboard, and Profile & Settings. The application will include skeleton loading states, smooth animated transitions, and a consistent light/dark design system.'],
    ['02', 'Production-Grade RESTful Backend API', 'A Node.js/Express backend exposing 46 versioned REST endpoints across nine resource groups, with JWT-based authentication, request validation, structured error handling, consistent response envelopes, and a complete Postman collection documenting all endpoints with example requests and responses.'],
    ['03', 'AI Decision Intelligence System', 'An integrated Groq LLM AI Advisor capable of multi-turn conversational analysis of user decisions, recommendation of established decision-making frameworks (Pros/Cons, Weighted Matrix, Premortem, Second-Order Thinking, OODA Loop), and personalized behavioral insights derived from the user\'s semantic decision history via pgvector similarity search.'],
    ['04', 'Automated Outcome Tracking System', 'A scheduler-driven infrastructure dispatching check-in reminders at nine intervals from one day to two years post-decision, constructing a rich longitudinal dataset of real-world outcomes, satisfaction scores (1–10), mood states, stress levels, and textual reflections that is unique to each user.'],
    ['05', 'Behavioral Analytics Engine', 'An analytics subsystem computing aggregate user metrics (total decisions, category distributions, average confidence and satisfaction), rendering decision quality trend charts, detecting behavioral patterns such as confidence-versus-satisfaction correlation and category-specific success rate variations, and generating AI-authored insight cards.'],
    ['06', 'Decision Frameworks and Templates Library', 'A curated library of system-provided decision frameworks (Pros/Cons List, Weighted Decision Matrix, Premortem Analysis, OODA Loop, Second-Order Thinking) and templates with structured prompt fields, enabling users to apply rigorous methodology to new decisions with a single tap, and to create and share their own custom frameworks.'],
    ['07', 'Complete Technical Documentation', 'A Postman API collection for all 46 endpoints, architecture diagrams, entity-relationship diagram, UI/UX screen flow guide, database schema documentation, environment configuration guide, and this academic project synopsis — constituting a complete technical record of the system.'],
    ['08', 'Scalable and Maintainable Architecture', 'A modular, layered architecture using PostgreSQL + pgvector for data persistence, Drizzle ORM for type-safe migrations, React Query for efficient server state caching, and Redis for asynchronous job processing — designed to scale from a single-user prototype to a multi-thousand user commercial platform without architectural refactoring.'],
  ];
  return {
    properties: { page: { size:{width:12240,height:15840}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({text:'LifeOS — Smart Life Decision Operating System',font:'Arial',size:18,color:C.gray}), new TextRun({text:'\t'}), new TextRun({text:'Chapter 7: Expected Outcomes',font:'Arial',size:18,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:0,after:100} })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({text:'Patna College, Patna University  ·  BCA Final Semester, 2023–2026',font:'Arial',size:16,color:C.gray}), new TextRun({text:'\t'}), new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:100,after:0} })] }) },
    children: [
      ...chapterLabel('07', 'Expected Outcomes'),
      body('Upon successful completion of all five development phases, LifeOS is expected to deliver eight concrete, demonstrable outcomes spanning the mobile application, backend API, AI integration, analytics engine, documentation, and architectural scalability domains. Each outcome is fully traceable to the eight project objectives defined in Chapter 2.'),
      spacer(120),
      h3('Figure 7.1 — Eight Expected Deliverable Outcomes'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [480, 2400, 6480],
        rows: [
          new TableRow({ children: [tableHeaderCell('#', 480), tableHeaderCell('Outcome', 2400), tableHeaderCell('Detailed Description', 6480)] }),
          ...outcomes.map(([num, title, desc], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:480,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:100,right:100}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:num,font:'Arial',size:20,bold:true,color:C.accent})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:2400,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:title,font:'Arial',size:19,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:6480,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:100,bottom:100,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:desc,font:'Arial',size:18,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:290}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 7.1 — Eight expected deliverable outcomes with full descriptions'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 8: PROJECT TIMELINE ─────────────────────────────────────────────
function makeChapter8() {
  const phases = [
    ['Ph 1: Requirements & Architecture', 'Wk 1–2',   ['█','█','','','','','','','','','','','','','']],
    ['Ph 2: Backend Core Development',    'Wk 3–7',   ['','','█','█','█','','','','','','','','','','']],
    ['Ph 3: Backend – AI & Analytics',   'Wk 5–7',   ['','','','','█','█','█','','','','','','','','']],
    ['Ph 4: Mobile – Auth & Decisions',  'Wk 8–10',  ['','','','','','','','█','█','█','','','','','']],
    ['Ph 5: Mobile – AI & Analytics',    'Wk 11–12', ['','','','','','','','','','','█','█','','','']],
    ['Ph 6: Integration & Testing',      'Wk 13–14', ['','','','','','','','','','','','','█','█','']],
    ['Ph 7: Documentation & Deployment', 'Wk 15',    ['','','','','','','','','','','','','','','█']],
  ];
  const weeks = Array.from({length:15}, (_,i) => `W${i+1}`);
  return {
    properties: { page: { size:{width:12240,height:15840}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({text:'LifeOS — Smart Life Decision Operating System',font:'Arial',size:18,color:C.gray}), new TextRun({text:'\t'}), new TextRun({text:'Chapter 8: Project Timeline',font:'Arial',size:18,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:0,after:100} })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({text:'Patna College, Patna University  ·  BCA Final Semester, 2023–2026',font:'Arial',size:16,color:C.gray}), new TextRun({text:'\t'}), new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:100,after:0} })] }) },
    children: [
      ...chapterLabel('08', 'Project Timeline'),
      body('The LifeOS project spans fifteen weeks (approximately four calendar months), structured across seven development phases. Backend phases overlap intentionally during Weeks 5–7 to maximise parallelism between core backend completion and AI/analytics subsystem development. A two-week integration and testing buffer (Weeks 13–14) precedes final documentation and deployment in Week 15.'),
      spacer(120),
      h3('Figure 8.1 — 15-Week Gantt Chart: Phase and Activity Schedule'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2280, ...Array(15).fill(452)],
        rows: [
          // Header row
          new TableRow({ children: [
            tableHeaderCell('Phase / Activity', 2280),
            ...weeks.map(w => tableHeaderCell(w, 452)),
          ]}),
          // Phase rows
          ...phases.map(([phase, span, cells], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:2280,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, children:[
              new Paragraph({children:[new TextRun({text:phase,font:'Arial',size:17,bold:true,color:C.navy})],spacing:{before:0,after:20}}),
              new Paragraph({children:[new TextRun({text:span,font:'Arial',size:16,italics:true,color:C.accent})],spacing:{before:0,after:0}}),
            ]}),
            ...cells.map((c, ci) => new TableCell({ borders, width:{size:452,type:WidthType.DXA}, shading:{fill: c==='█' ? C.navy : (i%2===0?C.light:C.white), type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:60,right:60}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:c==='█'?'':' ',font:'Arial',size:16,color:C.white})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] })),
          ]})),
          // Legend row
          new TableRow({ children: [
            new TableCell({ borders, width:{size:2280,type:WidthType.DXA}, shading:{fill:C.light,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, children:[new Paragraph({children:[new TextRun({text:'Legend',font:'Arial',size:17,bold:true,color:C.navy})],spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:452*15,type:WidthType.DXA}, columnSpan:15, shading:{fill:C.light,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:160,right:160}, children:[new Paragraph({children:[
              new TextRun({text:'Dark cell = Active development phase    Total Duration: 15 weeks (~4 months)    Backend phases overlap Weeks 5–7 to maximise efficiency',font:'Arial',size:17,color:C.gray}),
            ],spacing:{before:0,after:0}})] }),
          ]}),
        ]
      }),
      captionPara('Figure 8.1 — 15-week Gantt chart with phase overlaps, active periods, and milestone schedule'),
      spacer(200),
      h2('8.1  Phase-by-Phase Milestone Summary'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 1400, 6760],
        rows: [
          new TableRow({ children: [tableHeaderCell('Weeks', 1200), tableHeaderCell('Phase', 1400), tableHeaderCell('Exit Milestone (Deliverable Gate)', 6760)] }),
          ...[
            ['1 – 2',  'Ph 1', 'Signed-off ER diagram, full API endpoint specification document, UI wireframes for all 9+ screens, competitive analysis report, and technology stack decision record'],
            ['3 – 7',  'Ph 2', 'All 15 PostgreSQL tables created and migrated; auth, user, decision, and outcome API modules passing Postman integration tests; JWT authentication flow end-to-end verified'],
            ['5 – 7',  'Ph 3', 'Groq AI Advisor integration functional with multi-turn chat; pgvector embeddings computed and similarity search returning relevant results; analytics aggregate computation verified'],
            ['8 – 10', 'Ph 4', 'Auth screens (Register, Login), Dashboard, Decision Creation Wizard, and Outcome Check-In screens functional on both iOS Simulator and Android Emulator'],
            ['11 – 12','Ph 5', 'AI Advisor Chat screen, Analytics Dashboard, Profile & Settings screens functional; full navigation flow verified; design system applied consistently across all screens'],
            ['13 – 14','Ph 6', 'All 46 API endpoints passing integration tests; cross-platform validation on physical iOS and Android devices; performance profiling complete; critical bugs resolved'],
            ['15',     'Ph 7', 'Cloud deployment complete; Postman collection published; architecture diagrams finalized; project synopsis submitted; project report with all figures and tables complete'],
          ].map(([wks, ph, milestone], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:1200,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:wks,font:'Arial',size:18,bold:true,color:C.accent})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:1400,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:ph,font:'Arial',size:18,bold:true,color:C.navy})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:6760,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:140,right:140}, children:[new Paragraph({children:[new TextRun({text:milestone,font:'Arial',size:18,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:290}})] }),
          ]})),
        ]
      }),
      captionPara('Figure 8.2 — Phase exit milestones and deliverable gates for each of the seven development phases'),
      pageBreak(),
    ]
  };
}

// ─── CHAPTER 9: REFERENCES ────────────────────────────────────────────────────
function makeChapter9() {
  const refs = [
    ['[1]',  'React Native — Official Documentation. Facebook Inc. / Meta Platforms. Retrieved from https://reactnative.dev/docs/getting-started'],
    ['[2]',  'Expo — Official Documentation. Expo Technologies Inc. Retrieved from https://docs.expo.dev/'],
    ['[3]',  'Express.js — Official Documentation. OpenJS Foundation. Retrieved from https://expressjs.com/'],
    ['[4]',  'PostgreSQL — Official Documentation. The PostgreSQL Global Development Group. Retrieved from https://www.postgresql.org/docs/'],
    ['[5]',  'Drizzle ORM — Official Documentation. Drizzle Team. Retrieved from https://orm.drizzle.team/docs/overview'],
    ['[6]',  'TanStack Query (React Query) — Official Documentation. Tanner Linsley. Retrieved from https://tanstack.com/query/latest'],
    ['[7]',  'Zustand — State Management Library. Poimandres. Retrieved from https://zustand-demo.pmnd.rs/'],
    ['[8]',  'JSON Web Tokens — RFC 7519. Jones, M., Bradley, J., & Sakimura, N. (2015). Retrieved from https://jwt.io/introduction'],
    ['[9]',  'Groq AI — LLM API Documentation. Groq Inc. Retrieved from https://console.groq.com/docs/'],
    ['[10]', 'pgvector — Open-Source Vector Similarity Search for PostgreSQL. Andrew Kane. Retrieved from https://github.com/pgvector/pgvector'],
    ['[11]', 'Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux. ISBN: 978-0374533557'],
    ['[12]', 'Hammond, J. S., Keeney, R. L., & Raiffa, H. (1999). Smart Choices: A Practical Guide to Making Better Decisions. Harvard Business School Press. ISBN: 978-0767908863'],
    ['[13]', 'Bun — JavaScript Runtime. Jarred Sumner / Oven Inc. Retrieved from https://bun.sh/'],
    ['[14]', 'Drizzle Kit — Migration Tool. Drizzle Team. Retrieved from https://orm.drizzle.team/kit-docs/overview'],
    ['[15]', 'Expo SecureStore — API Documentation. Expo Technologies Inc. Retrieved from https://docs.expo.dev/sdk/securestore/'],
  ];
  return {
    properties: { page: { size:{width:12240,height:15840}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({text:'LifeOS — Smart Life Decision Operating System',font:'Arial',size:18,color:C.gray}), new TextRun({text:'\t'}), new TextRun({text:'Chapter 9: References',font:'Arial',size:18,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:0,after:100} })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({text:'Patna College, Patna University  ·  BCA Final Semester, 2023–2026',font:'Arial',size:16,color:C.gray}), new TextRun({text:'\t'}), new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:16,color:C.gray})], tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}], border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border}}, spacing:{before:100,after:0} })] }) },
    children: [
      ...chapterLabel('09', 'References'),
      body('The following references constitute the academic, technical, and official documentation sources consulted and cited throughout the development of the LifeOS project. References are formatted according to the APA 7th Edition citation style.'),
      spacer(120),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [600, 8760],
        rows: [
          new TableRow({ children: [tableHeaderCell('Ref.', 600), tableHeaderCell('Full Citation', 8760)] }),
          ...refs.map(([num, ref], i) => new TableRow({ children: [
            new TableCell({ borders, width:{size:600,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, verticalAlign:VerticalAlign.CENTER, children:[new Paragraph({children:[new TextRun({text:num,font:'Arial',size:19,bold:true,color:C.accent})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})] }),
            new TableCell({ borders, width:{size:8760,type:WidthType.DXA}, shading:{fill:i%2===0?C.light:C.white,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:160,right:160}, children:[new Paragraph({children:[new TextRun({text:ref,font:'Arial',size:19,color:C.nearBlack})],alignment:AlignmentType.JUSTIFIED,spacing:{before:0,after:0,line:300}})] }),
          ]})),
        ]
      }),
      spacer(400),
      sectionDivider(),
      spacer(200),
      // Signature block
      new Paragraph({
        children: [new TextRun({ text: 'Declaration and Signatures', font: 'Arial', size: 28, bold: true, color: C.navy })],
        spacing: { before: 0, after: 120 },
        ...thickBorderBottom(C.navy),
      }),
      spacer(120),
      italicNote('I hereby declare that the project synopsis titled "LifeOS — Smart Life Decision Operating System" submitted for the BCA Final Semester Project at Patna College, Patna University is my original work. The content presented herein has not been submitted for any other degree or examination. All sources of information have been duly acknowledged in the References section.'),
      spacer(400),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [new TableRow({ children: [
          new TableCell({ borders:noBorders, width:{size:4680,type:WidthType.DXA}, margins:{top:0,bottom:0,left:0,right:0}, children:[
            new Paragraph({children:[new TextRun({text:'_______________________________',font:'Arial',size:20,color:C.nearBlack})],spacing:{before:0,after:80}}),
            new Paragraph({children:[new TextRun({text:'Student Signature',font:'Arial',size:20,bold:true,color:C.navy})],spacing:{before:0,after:40}}),
            new Paragraph({children:[new TextRun({text:'Badal Kumar · Roll No. 10',font:'Arial',size:19,color:C.gray})],spacing:{before:0,after:0}}),
          ]}),
          new TableCell({ borders:noBorders, width:{size:4680,type:WidthType.DXA}, margins:{top:0,bottom:0,left:0,right:0}, children:[
            new Paragraph({children:[new TextRun({text:'_______________________________',font:'Arial',size:20,color:C.nearBlack})],spacing:{before:0,after:80}}),
            new Paragraph({children:[new TextRun({text:'Project Guide Signature',font:'Arial',size:20,bold:true,color:C.navy})],spacing:{before:0,after:40}}),
            new Paragraph({children:[new TextRun({text:'Designation: ____________________',font:'Arial',size:19,color:C.gray})],spacing:{before:0,after:0}}),
          ]}),
        ]})]
      }),
      spacer(320),
      new Paragraph({
        children: [new TextRun({ text: 'HOD Signature: _______________________________', font: 'Arial', size: 20, bold: true, color: C.navy })],
        spacing: { before: 0, after: 0 },
      }),
    ]
  };
}

// ─── ASSEMBLE DOCUMENT ───────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '▸',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 280 } } },
        }],
      },
    ]
  },
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22 } }
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 44, bold: true, font: 'Arial', color: C.navy },
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: C.accent },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: C.navy },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2 },
      },
    ]
  },
  sections: [
    makeCoverSection(),
    makePreambleSection(),
    makeChapter1(),
    makeChapter2(),
    makeChapter3(),
    makeChapter4(),
    makeChapter5(),
    makeChapter6(),
    makeChapter7(),
    makeChapter8(),
    makeChapter9(),
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('LifeOS_Book_Synopsis.docx', buffer);
  console.log('Document written successfully.');
}).catch(err => console.error('Error:', err));