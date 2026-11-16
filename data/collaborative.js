/*
 * Core content about the AI Scale Collaborative.
 * Source: "AI Scale Collaborative: CMO & Intermediary Network" (external overview).
 * Edit this file to update the Overview, Purpose & Design, Partners and Measures pages.
 */
window.ASC = window.ASC || {};

window.ASC.collaborative = {
  name: "AI Scale Collaborative",
  subtitle: "CMO & Intermediary Network",
  launch: "Fall 2026",
  tagline:
    "A concentrated network of high-readiness CMOs and intermediaries measuring how AI-augmented instruction affects student outcomes — and sharing what they learn.",
  intro: [
    "Over the last 12 months the US Charters team at the Gates Foundation has been exploring an Innovation Portfolio focused on measuring the impact of AI in schools and its effect on student outcomes. After conversations with stakeholders across the country, the team landed on a concentrated network of high-readiness CMOs and intermediaries already willing to implement AI-augmented instruction.",
    "Members commit to assessing student performance under a common measurement framework, documenting their instructional stacks, and sharing what they learn across the network. The evidence this generates — cross-context, disaggregated, practitioner-produced — is what the broader field cannot currently get from vendors or from isolated pilots."
  ],
  questions: [
    {
      title: "Conditions for acceleration",
      text: "Under what conditions does AI-augmented instruction produce accelerated learning gains for students in high-quality charter contexts?"
    },
    {
      title: "What holds up across contexts",
      text: "Which tools and implementation approaches hold up across diverse CMO settings — different geographies, student populations, instructional models — and which only work in narrow conditions?"
    },
    {
      title: "Educator AI agency",
      text: "What does genuine educator AI agency look like at the classroom level, and what organizational conditions make it possible?"
    }
  ],
  designNote:
    "These questions are answerable through a field-learning model; they are not answerable through a controlled experiment, and the design does not pretend otherwise.",
  tightLoose:
    "The network operates on a tight-loose framework. The tight elements are non-negotiable entry conditions; the loose elements are where variation is expected and valuable — because the network learns from variation, not from controlling it.",
  requirements: [
    {
      id: "assessment",
      title: "Shared assessment approach",
      text: "CMOs commit to a common approach to measuring student learning proficiency using a Similar Schools model, with disaggregated subgroup reporting as a condition of membership. CMOs are also encouraged to explore and compare AI-enabled, ongoing formative assessment approaches that yield better real-time tracking than legacy standardized measures. CMOs propose their assessment approach at onboarding and report consistently for comparability across the network."
    },
    {
      id: "stack",
      title: "Stack documentation",
      text: "CMOs report on HQIM, AI tools in use, deployment conditions, subject sequencing, and supervised vs. unsupervised use boundaries. Updated quarterly. Allows cross-context partnerships to emerge and partner CMOs to learn about different implementation stacks."
    },
    {
      id: "equity",
      title: "Equity guardrail — do no harm",
      text: "Disaggregated student proficiency data (by race/ethnicity, special education status, and English learner status) must demonstrate no harm to subgroups before any tool or model is scaled within a network school. CMOs agree to openly share the experience of target populations and why tools may or may not be effective."
    },
    {
      id: "vendor",
      title: "Vendor transparency",
      text: "All AI tools used in network schools must share outcome data — disaggregated by student subgroup — with CMOs, who in turn share with the Foundation. The goal is a back-end evidence base about what each tool is producing, not to approve or restrict tool selection. CMOs choose their own tools; the Foundation collects and synthesizes the learning."
    },
    {
      id: "families",
      title: "Disclosure to families",
      text: "Families are informed that their school uses AI tools as part of instruction. Specific disclosure requirements are set at the school level in keeping with community context. Schools report on student and family satisfaction with AI use."
    },
    {
      id: "human",
      title: "Human-centered implementation",
      text: "Organizations demonstrate internal AI champions and staff-driven adoption processes."
    },
    {
      id: "convenings",
      title: "Quarterly convenings",
      text: "Site-based, rotating, 2–3 days. Structured learning, not reporting. Each partner commits to hosting the larger collaborative on-site at least twice during the investment period."
    },
    {
      id: "index",
      title: "Innovation Index participation",
      text: "CMOs agree to ongoing participation in AI for Equity's Innovation Index over the course of the investment."
    }
  ],
  investment: {
    periods: [
      {
        label: "Initial investment",
        dates: "Fall 2026 – Summer 2028",
        detail: "Two-year initial investment to support scaling of current efforts across all sites within each network."
      },
      {
        label: "Potential extension",
        dates: "Fall 2028 – Summer 2030",
        detail: "Possible two-year extension to continue scaling new tools, implementation and AI literacy — or to explore new school model ideas as part of the AI for Equity Horizons Project."
      }
    ],
    amount: [
      "$300k/yr per partner",
      "$600k/yr for the initial investment",
      "$600k/yr for the two-year extension"
    ],
    research: "Opportunity to participate in a research study through MIT Blueprint."
  }
};

/* Milestones for the landing-page timeline strip. Convenings are added automatically.
   `date` is used for ordering and to mark items done (in the past) or upcoming. */
window.ASC.milestones = [
  { date: "2026-09-01", when: "Fall 2026", what: "Network launches", note: "4 CMOs · 2 intermediaries" },
  { date: "2028-06-30", when: "Summer 2028", what: "Year 2 targets", note: "65% proficiency · 75% AI access", href: "measures.html" },
  { date: "2028-07-01", when: "Fall 2028", what: "Potential extension begins", note: "Through Summer 2030", href: "about.html#investment" },
  { date: "2029-06-30", when: "Summer 2029", what: "Year 3 targets", note: "80% proficiency · 100% AI access", href: "measures.html" },
  { date: "2030-06-30", when: "2030", what: "What we will know", note: "End of extension period", href: "measures.html" }
];

window.ASC.partners = [
  {
    id: "dream",
    name: "DREAM Charter Schools",
    short: "DREAM",
    type: "CMO",
    location: "New York, NY",
    region: "Northeast",
    lat: 40.84, lon: -73.9,
    schools: null, students: null, // add when known
    stack: {
      hqim: "Illustrative Mathematics (math)",
      tools: ["DREAM Data Hub (BigQuery + Looker Studio)", "Enterprise AI for every staff member", "Rubric-scoring agents (co-designed with Enlighten)", "AI tutoring assistant on the Learning Commons knowledge graph", "DREAM Observation Agent (Google Chat)", "Coursemojo (pilot)", "i-Ready", "Zearn"],
      summary: "HQIM: Illustrative Mathematics · Data Hub, rubric-scoring agents, AI tutoring assistant, Coursemojo pilot",
      source: "Observed at the November 2026 convening; to be confirmed in DREAM’s stack documentation."
    },
    summary:
      "Bronx-based network serving early childhood through grade 12. Hosted the first collaborative convening in November 2026 at its Highbridge and Mott Haven campuses."
  },
  {
    id: "kipp-norcal",
    name: "KIPP NorCal",
    short: "KIPP NorCal",
    type: "CMO",
    location: "Bay Area, CA",
    region: "West",
    lat: 37.8, lon: -122.27,
    schools: null, students: null,
    stack: null, // filled from quarterly stack documentation
    summary: "CMO partner in the Bay Area."
  },
  {
    id: "gem-prep",
    name: "Gem Prep",
    short: "Gem Prep",
    type: "CMO",
    location: "Idaho",
    region: "Mountain West",
    lat: 44.1, lon: -114.7, mapLabel: "Idaho",
    schools: null, students: null,
    stack: null,
    summary: "CMO partner in Idaho."
  },
  {
    id: "collegiate",
    name: "Collegiate Academies",
    short: "Collegiate",
    type: "CMO",
    location: "New Orleans, LA",
    region: "South",
    lat: 29.95, lon: -90.07,
    schools: null, students: null,
    stack: null,
    summary: "CMO partner in New Orleans."
  },
  {
    id: "esw",
    name: "Excellent Schools WA",
    short: "Excellent Schools WA",
    type: "Intermediary",
    location: "Washington",
    region: "Pacific Northwest",
    lat: 47.4, lon: -120.6, mapLabel: "Washington",
    schools: null, students: null,
    stack: null,
    summary: "Intermediary partner supporting single-site schools in Washington."
  },
  {
    id: "noaief",
    name: "New Orleans AI Education Fund",
    short: "NOLA AI Ed Fund",
    type: "Intermediary",
    location: "New Orleans, LA",
    region: "South",
    lat: 29.95, lon: -90.07,
    schools: null, students: null,
    stack: null,
    summary: "Intermediary partner supporting single-site schools in New Orleans."
  }
];

window.ASC.measures = [
  {
    id: "proficiency",
    title: "Student Proficiency (Math + ELA)",
    definition:
      "% of partner sites (CMO schools + intermediary single sites) in the top third on the Similar Schools metric — both Math and ELA.",
    targets: [
      { label: "Year 2", value: 65 },
      { label: "Year 3", value: 80 }
    ],
    source: "State assessments + Similar Schools framework",
    cadence: "Annual",
    current: null,          // set to a number (0–100) when the first report is in
    firstReport: "Fall 2027 (after SY26–27 state results)"
  },
  {
    id: "access",
    title: "Network-Wide AI Access",
    definition:
      "% of students with access to AI-enabled instructional solutions aligned to or integrated with HQIM, disaggregated by focus populations, across the full CMO network and intermediary single sites.",
    targets: [
      { label: "Year 2", value: 75 },
      { label: "Year 3", value: 100 }
    ],
    source: "CMO/intermediary implementation reports (collected by AI for Equity)",
    cadence: "Quarterly",
    current: null,
    firstReport: "Spring 2027"
  },
  {
    id: "diffusion",
    title: "AI Tool Diffusion to Non-Academic Functions",
    definition:
      "% of CMOs and intermediary single sites deploying AI in HR, finance, scheduling, family communications, food service, or other operations.",
    targets: [
      { label: "Year 2", value: 75 },
      { label: "Year 3", value: 100 }
    ],
    source: "CMO/intermediary implementation reports (collected by AI for Equity); self-report",
    cadence: "Annual",
    current: null,
    firstReport: "Summer 2027"
  }
];

/* The Implementation R&D friction framework used to organize site-visit learning. */
window.ASC.frictionFramework = [
  {
    id: "product",
    n: 1,
    title: "Product",
    question: "Does the tool itself support high-quality instruction?",
    insights: [
      "Features that support or hinder instruction",
      "Product usability and workflow improvements",
      "Student-facing and educator-facing design improvements"
    ]
  },
  {
    id: "configuration",
    n: 2,
    title: "Configuration",
    question: "Is it configured to deliver the right information at the right time?",
    insights: [
      "Better implementation guidance",
      "District setup recommendations",
      "Data integration improvements"
    ]
  },
  {
    id: "coherence",
    n: 3,
    title: "Coherence",
    question: "Do the tools work together as a unified instructional system?",
    insights: [
      "Examples of strong full-stack implementation",
      "Alignment across curriculum, tools, and supports",
      "School-level implementation patterns"
    ]
  },
  {
    id: "practice",
    n: 4,
    title: "Practice",
    question: "Are educators using the tools consistently and effectively?",
    insights: [
      "Coaching and professional learning strategies",
      "Leadership routines",
      "Dosage, monitoring, and instructional practices"
    ]
  }
];
