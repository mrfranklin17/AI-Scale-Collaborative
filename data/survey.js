/*
 * Post-convening survey definition. Questions here drive both the survey form
 * and the Feedback dashboard. Changing a question's `id` breaks the link to
 * responses already collected under the old id, so add new ids instead.
 */
window.ASC = window.ASC || {};

window.ASC.survey = {
  scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],

  likert: [
    { id: "objectives", short: "Met learning goals", text: "The convening met its stated learning goals." },
    { id: "relevance", short: "Relevant to my role", text: "The content was relevant to my role and my organization's context." },
    { id: "host_view", short: "Clear view of host's AI work", text: "The host's sessions gave me a clear, honest view of how they implement AI." },
    { id: "actionable", short: "Leaving with an actionable idea", text: "I am leaving with at least one idea I can act on in the next 90 days." },
    { id: "equity", short: "Addressed focus populations", text: "Sessions addressed impact on focus student populations (students with IEPs, English learners, race/ethnicity)." },
    { id: "connections", short: "Built peer connections", text: "I made connections with peers in the network that I plan to follow up on." },
    { id: "logistics", short: "Logistics supported learning", text: "Logistics and pacing supported my learning." }
  ],

  nps: {
    id: "nps",
    text: "How likely are you to recommend future collaborative convenings to a colleague?",
    low: "Not at all likely",
    high: "Extremely likely"
  },

  sessionScale: ["Not useful", "Slightly useful", "Moderately useful", "Very useful", "Extremely useful"],

  friction: {
    id: "friction",
    text: "Which implementation friction point was most relevant to your own work after this convening?"
  },

  open: [
    { id: "valuable", short: "Most valuable", text: "What was the single most valuable thing you saw or heard?" },
    { id: "try", short: "Will try", text: "What will you try, adapt or share with your team as a result?" },
    { id: "improve", short: "Improve", text: "What should we change for the next convening?" }
  ],

  roles: [
    { id: "network", label: "Network / central office leader" },
    { id: "school", label: "School leader" },
    { id: "instruction", label: "Teacher, coach or academic dean" },
    { id: "data", label: "Data or technology" },
    { id: "operations", label: "Operations" },
    { id: "foundation", label: "Foundation staff" },
    { id: "other", label: "Other" }
  ],

  // Comment themes. Comments are tagged automatically when they contain one of
  // the keywords (case-insensitive). Labels mirror the convening focus areas.
  themes: [
    { id: "data", label: "Data infrastructure", keywords: ["data hub", "warehouse", "flag", "dashboard", "data stack", "data access", "single view", "pipeline"] },
    { id: "rapid-data", label: "Rapid data cycles", keywords: ["scoring", "rubric", "reteach", "friday", "interim", "data day", "data cycle"] },
    { id: "tutoring", label: "AI tutoring", keywords: ["tutor", "dosage", "intervention"] },
    { id: "literacy", label: "AI literacy", keywords: ["literacy", "history class", "accept, revise", "protocol"] },
    { id: "mindsets", label: "Mindsets & culture", keywords: ["task force", "culture", "norm", "mindset", "abandon", "honest", "worth", "agent approach", "pilot"] },
    { id: "equity", label: "Equity", keywords: ["english learner", "iep", "equity", "subgroup", "focus population", "furthest behind", "students with"] },
    { id: "logistics", label: "Logistics", keywords: ["logistics", "schedule", "agenda", "pre-read", "debrief", "pacing", "more time", "smaller", "groups", "session on"] }
  ],

  // Extra respondent organizations beyond the partners in data/collaborative.js
  extraOrgs: [
    { id: "gates", name: "Gates Foundation", short: "Gates Foundation" },
    { id: "ai-for-equity", name: "AI for Equity", short: "AI for Equity" },
    { id: "other", name: "Other organization", short: "Other" }
  ]
};
