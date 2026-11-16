/*
 * Core content about the AI Scale Collaborative (CMO network).
 * Source: "AI Innovation Strategy, 2027–2030" (US Charters, November 2026),
 * AI Scale Collaborative section and Outcomes Framework.
 * Edit this file to update the Overview, Purpose & Design, Partners and Measures pages.
 */
window.ASC = window.ASC || {};

window.ASC.collaborative = {
  name: "AI Scale Collaborative",
  subtitle: "CMO Network",
  launch: "Fall 2026",
  tagline:
    "Four high-readiness charter networks implementing AI-augmented instruction under a common measurement framework — to learn what raises proficiency for Black, Latino, and low-income students.",
  // The students whose proficiency the network is built to raise.
  focusPopulations: ["Black students", "Latino students", "Students from low-income families"],
  intro: [
    "The AI Scale Collaborative is the field-learning engine of the US Charters AI Innovation strategy. A concentrated network of high-readiness CMOs implements AI-augmented instruction under a common measurement framework, documents their instructional stacks, and shares what they learn across the network.",
    "The evidence this generates — cross-context, disaggregated, practitioner-produced — is what the broader field cannot currently get from vendors or from isolated pilots."
  ],
  theoryOfChange:
    "If a concentrated network of high-readiness CMOs implements AI-augmented instruction under common measurement conditions, then the field gains cross-context evidence on which approaches increase proficiency for which students — evidence that vendor claims and isolated pilots cannot provide.",
  questions: [
    {
      title: "Conditions for proficiency gains",
      text: "Under what conditions does AI-augmented instruction increase proficiency for Black, Latino, and low-income students in high-quality charter contexts?"
    },
    {
      title: "What holds up across contexts",
      text: "Which tools and implementation approaches hold up across diverse CMO settings — different geographies, student populations, and instructional models — and which work only in narrow conditions?"
    },
    {
      title: "Educator AI agency",
      text: "What does genuine educator AI agency look like at the classroom level, and what organizational conditions make it possible?"
    }
  ],
  designNote:
    "These questions are answerable through a field-learning model; they are not answerable through a controlled experiment, and the design does not pretend otherwise. The evidence the network produces is ESSA Tier 3 by design.",
  smallNetwork:
    "A smaller, higher-fidelity network produces more actionable evidence than a larger, lower-fidelity one. The network can add CMO partners when evidence and fit support it.",
  tightLoose:
    "The network operates on a tight-loose framework. The tight elements are non-negotiable entry conditions; the loose elements are where variation is expected and valuable, because the network learns from variation rather than by controlling it.",
  requirements: [
    {
      id: "assessment",
      title: "Shared assessment approach",
      text: "CMOs commit to a common approach to measuring student proficiency using a Similar Schools model, with disaggregated subgroup reporting as a condition of network membership. CMOs are also encouraged to explore and compare AI-enabled, ongoing formative assessment approaches that give better real-time tracking than legacy standardized measures. CMOs propose their assessment approach at onboarding and report consistently for comparability across the network."
    },
    {
      id: "stack",
      title: "Stack documentation",
      text: "CMOs report on HQIM, AI tools in use, deployment conditions, subject sequencing, and supervised vs. unsupervised use boundaries, updated quarterly. This lets cross-context partnerships emerge and lets CMOs learn about each other’s implementation stacks."
    },
    {
      id: "equity",
      title: "Equity guardrail — do no harm",
      text: "Disaggregated student proficiency data (by race/ethnicity, special education status, and English learner status) must show no harm to any subgroup before a tool or model is scaled within a network school. CMOs agree to share openly how students in each subgroup experience the tools and why tools may or may not be effective."
    },
    {
      id: "vendor",
      title: "Vendor transparency",
      text: "AI tools used in CMO network schools must share outcome data, disaggregated by student subgroup, with the CMO, which in turn shares it with the Foundation. The goal is a back-end evidence base on what each tool is producing, not approval or restriction of tool selection. CMOs choose their own tools; the Foundation collects and synthesizes the learning."
    },
    {
      id: "families",
      title: "Disclosure to families",
      text: "Families are informed that their school uses AI tools as part of instruction. Specific disclosure requirements are set at the school level in keeping with community context. Schools report on student and family satisfaction with AI use."
    },
    {
      id: "human",
      title: "Human-centered implementation",
      text: "CMOs demonstrate internal AI champions and staff-driven adoption processes."
    },
    {
      id: "convenings",
      title: "Quarterly convenings",
      text: "Site-based, rotating, two to three days. Structured learning, not reporting. Each CMO partner hosts the Collaborative on-site at least twice during the investment period."
    },
    {
      id: "index",
      title: "Innovation Index participation",
      text: "CMOs participate in AI for Equity’s Innovation Index throughout the investment, with pre-, mid-, and post-assessments."
    }
  ],
  aiForEquity:
    "AI for Equity is the network’s measurement backbone. Its Innovation Index provides common measurement and equity benchmarking across the CMO network; AI for Equity also co-designs and supports the quarterly convenings and produces the sector-facing research that turns network evidence into field learning. Its national Community of Practice is open to all network partners.",
  investment: {
    periods: [
      {
        label: "Initial grants",
        dates: "Fall 2026 – August 2028",
        detail: "Two-year grants to each of the four CMOs, covering Years 1 and 2 (SY2026–27 and SY2027–28)."
      },
      {
        label: "Potential renewal",
        dates: "Years 3–4, through 2030",
        detail: "All grants carry potential renewal for Years 3–4, based on a review of Year 1–2 evidence in spring 2028."
      }
    ],
    amount: [
      "$300K per CMO per year",
      "Measurement backbone and convening support from AI for Equity",
      "Quarterly convenings and network coordination managed by the Foundation"
    ],
    evidence: "Field learning, not a randomized trial. The evidence the network produces is ESSA Tier 3 by design."
  }
};

/* Milestones for the landing-page timeline strip. Convenings are added automatically.
   `date` is used for ordering and to mark items done (in the past) or upcoming.
   Year 1 is SY2026–27. */
window.ASC.milestones = [
  { date: "2026-09-01", when: "Fall 2026", what: "Network launches", note: "Four CMO partners · Year 1 begins" },
  { date: "2028-04-01", when: "Spring 2028", what: "Year 1–2 evidence review", note: "Informs Years 3–4 renewal", href: "about.html#investment" },
  { date: "2028-06-30", when: "Summer 2028", what: "Year 2 targets", note: "65% proficiency · 100% Index ≥ 3.5", href: "measures.html" },
  { date: "2029-06-30", when: "Summer 2029", what: "Year 3 targets", note: "80% proficiency · 100% AI access", href: "measures.html" },
  { date: "2030-06-30", when: "2030", what: "What we will know", note: "End of the strategy period", href: "measures.html" }
];

/* CMO partners. Facts come from each organization's official website (accessed November 2026);
   update them as partners share stack documentation. `hosting` is shown on cards when no
   convening entry exists yet; hosted/scheduled convenings are read from data/convenings.js. */
window.ASC.partners = [
  {
    id: "dream",
    cardLine: "3K–12 · East Harlem and the Bronx",
    mark: "DREAM", // short label on generated art
    name: "DREAM Charter Schools",
    short: "DREAM",
    type: "CMO",
    location: "East Harlem & the Bronx, NY",
    region: "Northeast",
    lat: 40.84, lon: -73.9,
    logo: "assets/img/logos/dream.svg",
    logoMark: "assets/img/logos/dream-mark.svg",
    website: "https://wearedream.org",
    facts: [
      { k: "Grades", v: "3K–12" },
      { k: "Where", v: "East Harlem and the Bronx" },
      { k: "In the community", v: "More than three decades" }
    ],
    stack: {
      hqim: "Illustrative Mathematics (math)",
      tools: ["DREAM Data Hub (BigQuery + Looker Studio)", "Enterprise AI for every staff member", "Rubric-scoring agents (co-designed with Enlighten)", "AI tutoring assistant on the Learning Commons knowledge graph", "DREAM Observation Agent (Google Chat)", "Coursemojo (pilot)", "i-Ready", "Zearn"],
      summary: "HQIM: Illustrative Mathematics · Data Hub, rubric-scoring agents, AI tutoring assistant, Coursemojo pilot",
      source: "Observed at the November 2026 convening; to be confirmed in DREAM’s stack documentation."
    },
    rationale: "Pioneer of bottom-up AI adoption, with 75% weekly staff AI usage, custom internal tool development, and strong community trust infrastructure. Brings an urban, Northeast context.",
    summary: "Free public charter schools in East Harlem and the Bronx serving children from 3K through high school, building on more than three decades of work in the community."
  },
  {
    id: "kipp-norcal",
    cardLine: "23 schools · 7,100 students · TK–12",
    mark: "KIPP",
    name: "KIPP NorCal",
    short: "KIPP NorCal",
    type: "CMO",
    location: "Bay Area & Stockton, CA",
    region: "West",
    lat: 37.8, lon: -122.27,
    logo: "assets/img/logos/kipp-norcal.svg",
    logoMark: "assets/img/logos/kipp-norcal-mark.svg",
    website: "https://kippnorcal.org",
    facts: [
      { k: "Schools", v: "23" },
      { k: "Students", v: "7,100" },
      { k: "Grades", v: "TK–12" },
      { k: "Cities", v: "East Palo Alto, Menlo Park, Oakland, Redwood City, San Francisco, San José, San Lorenzo, Stockton" },
      { k: "In Northern California", v: "24 years · 4,500 alumni" }
    ],
    hosting: "Spring 2027",
    stack: null, // filled from quarterly stack documentation
    rationale: "Systematic piloting rigor, subgroup equity metrics, and in-house statistical evaluation capacity — a strong evidence culture that aligns with the network’s learning requirements.",
    summary: "23 tuition-free public charter schools serving 7,100 TK–12 students across eight Northern California cities, from San Francisco and Oakland to San José and Stockton."
  },
  {
    id: "gem-prep",
    cardLine: "K–12 · 7 campuses + online school",
    mark: "GEM",
    name: "Gem Prep",
    short: "Gem Prep",
    type: "CMO",
    location: "Idaho",
    region: "Mountain West",
    lat: 43.6, lon: -114.2, mapLabel: "Idaho",
    logo: "assets/img/logos/gem-prep.png",
    logoMark: "assets/img/logos/gem-prep-mark.png",
    website: "https://gemprep.org",
    facts: [
      { k: "Grades", v: "K–12" },
      { k: "Campuses", v: "Idaho Falls, Meridian (3), Nampa, Pocatello, Twin Falls, plus Gem Prep: Online" },
      { k: "Opening", v: "Rexburg, Fall 2027" },
      { k: "Operator", v: "Gem Innovation Schools" }
    ],
    hosting: "2027–28 school year",
    stack: null,
    rationale: "Rural and western geography, in an Idaho policy environment supportive of nontraditional scheduling and competency-based progression. Strong AI readiness documented in a 2024 BLUUM case study.",
    summary: "K–12 free public charter schools across southern and eastern Idaho — Meridian, Nampa, Idaho Falls, Pocatello and Twin Falls — plus an online school, operated by Gem Innovation Schools."
  },
  {
    id: "collegiate",
    cardLine: "5 high schools + 2 post-secondary programs",
    mark: "CA",
    name: "Collegiate Academies",
    short: "Collegiate",
    type: "CMO",
    location: "New Orleans & Baton Rouge, LA",
    region: "South",
    lat: 29.95, lon: -90.07,
    logo: "assets/img/logos/collegiate.png",
    logoMark: "assets/img/logos/collegiate-mark.png",
    website: "https://www.collegiateacademies.org",
    facts: [
      { k: "Schools", v: "5 open-enrollment high schools + 2 post-secondary programs" },
      { k: "Grades", v: "9–12 and beyond" },
      { k: "Scholars", v: "85% first-generation college · 20% with special education needs" },
      { k: "In Louisiana", v: "15 years" }
    ],
    hosting: "2027–28 school year",
    stack: null,
    rationale: "Operates in an AI-active city with a high-need urban context and a strong equity focus.",
    summary: "Five open-enrollment high schools and two post-secondary programs in New Orleans and Baton Rouge, preparing every scholar for college and lives of unlimited opportunity."
  }
];

window.ASC.measures = [
  {
    id: "proficiency",
    title: "Student Proficiency (Math + ELA)",
    definition:
      "% of CMO partner schools in the top third of the Similar Schools metric in both Math and ELA. Tests the core proposition: AI-augmented instruction increases proficiency for Black, Latino, and low-income students relative to comparable schools, in both subjects.",
    targets: [
      { label: "Year 2", value: 65 },
      { label: "Year 3", value: 80 }
    ],
    source: "State assessments + Similar Schools framework",
    cadence: "Annual",
    focus: true,            // reported for the network's focus populations
    current: null,          // set to a number (0–100) when the first report is in
    firstReport: "Fall 2027 (after SY2026–27 state results)"
  },
  {
    id: "access",
    title: "Network-Wide AI Access",
    definition:
      "% of students across each full CMO network — not just pilot classrooms — with access to AI-enabled instructional solutions aligned to HQIM, disaggregated by focus populations. Tests the network-scale differentiator.",
    targets: [
      { label: "Year 2", value: 75 },
      { label: "Year 3", value: 100 }
    ],
    source: "Implementation reports (collected by AI for Equity)",
    cadence: "Quarterly",
    focus: true,
    current: null,
    firstReport: "Spring 2027"
  },
  {
    id: "tools",
    title: "Original AI Tool Development",
    definition: "% of CMO partners that have built and deployed an original AI tool.",
    targets: [{ label: "End of Year 3", value: 100 }],
    source: "PlayLab platform data + partner reports",
    cadence: "Annual",
    current: null,
    firstReport: "Summer 2027"
  },
  {
    id: "diffusion",
    title: "AI Tool Diffusion to Non-Academic Functions",
    definition:
      "% of CMO partners that have deployed at least one AI-enabled solution in a non-instructional area: human resources, finance and budgeting, facilities and scheduling, family and community communications, food service, or student support coordination. Tests whether AI is treated as organizational infrastructure, not only a teaching tool.",
    targets: [
      { label: "Year 2", value: 75 },
      { label: "Year 3", value: 100 }
    ],
    source: "Implementation reports (AI for Equity); annual self-report with spot verification",
    cadence: "Annual",
    current: null,
    firstReport: "Summer 2027"
  },
  {
    id: "index",
    title: "AI for Equity Innovation Index",
    definition:
      "% of CMO partners scoring 3.5 or higher on the Innovation Index. Measures strategic AI adoption maturity, not just tool use.",
    domains: ["Student AI Agency & Literacy", "Staff Empowerment & Efficacy", "Leadership Excellence"],
    targets: [{ label: "End of Year 2", value: 100 }],
    source: "AI for Equity Innovation Index",
    cadence: "Annual (pre, mid, post)",
    current: null,
    firstReport: "Year 1 pre-assessment (SY2026–27)"
  }
];

/* How the network measures: design choices from the strategy's Outcomes Framework. */
window.ASC.measurementChoices = [
  { title: "Math and ELA", text: "Impact is tested in both Math and ELA, not math alone." },
  { title: "Similar Schools", text: "Proficiency is measured with a Similar Schools methodology, against comparable schools." },
  { title: "Network scale", text: "Implementation is measured across all sites in each CMO network, not at individual pilot schools." }
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
