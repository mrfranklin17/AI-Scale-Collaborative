/*
 * Site configuration.
 *
 * backend.type
 *   "local"    – responses are saved in this browser only (preview / offline use).
 *   "supabase" – responses are saved to a shared Supabase table so every school
 *                sees the same data. See docs/SURVEY_BACKEND.md for setup.
 */
window.ASC = window.ASC || {};

window.ASC.config = {
  backend: {
    type: "local",
    supabaseUrl: "",      // e.g. "https://abcd1234.supabase.co"
    supabaseAnonKey: "",  // the project's publishable key (sb_publishable_...) or legacy anon key — public by design; row-level security controls access
    table: "survey_responses"
  },

  // Show illustrative sample responses on the Feedback page while no real
  // responses exist. Sample data is always labeled and is hidden automatically
  // as soon as a real response is recorded.
  showSampleData: true,

  // Foundation "Connection to strategy" analysis is no longer shown on public
  // convening pages. It appears only on foundation.html, which is unlinked but
  // NOT access-controlled — see the note at the top of assets/js/pages/foundation.js.

  // Hide charts/averages for any slice with fewer responses than this, to
  // protect respondent anonymity in small groups.
  minResponsesToShow: 3,

  // Shown in the footer. Leave email blank to show the team name only.
  contact: {
    name: "US Charters team, Gates Foundation",
    email: ""
  },

  // "Last updated" dates shown on pages. Update when you edit the matching data.
  // (The Feedback page uses the date of the most recent response instead.)
  lastUpdated: {
    convenings: "2026-11-16",
    measures: "2026-11-16",
    partners: "2026-11-16",
    about: "2026-11-16"
  }
};
