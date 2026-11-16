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
    supabaseAnonKey: "",  // the project's public anon key (safe to ship; access is enforced by row-level security)
    table: "survey_responses"
  },

  // Show illustrative sample responses on the Feedback page while no real
  // responses exist. Sample data is always labeled and is hidden automatically
  // as soon as a real response is recorded.
  showSampleData: true,

  // Show the Foundation's "Connection to strategy" analysis panels on convening
  // pages. Set to false before sharing the site with partners if those notes
  // are meant for internal use only.
  showFoundationAnalysis: true,

  // Hide charts/averages for any slice with fewer responses than this, to
  // protect respondent anonymity in small groups.
  minResponsesToShow: 3
};
