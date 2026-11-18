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
    type: "supabase",
    supabaseUrl: "https://ibnhdbkrhrofhxjzzjeb.supabase.co",      // e.g. "https://abcd1234.supabase.co"
    supabaseAnonKey: "sb_publishable_WggZitaumNTB7WmMKHhzIg_x9aHUBlt",  // the project's publishable key (sb_publishable_...) or legacy anon key — public by design; row-level security controls access
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

  // Basic password gate for the survey and all results (dashboard, landing and
  // convening feedback summaries). Only the SHA-256 hash of the password is stored.
  // To change the password: run  echo -n 'NewPassword' | shasum -a 256  and paste
  // the hex value below. Set enabled: false to remove the gate.
  // Note: this keeps casual visitors out; it is not strong security.
  access: {
    enabled: true,
    passwordHash: "4b1d6aa196b0d22ee9a6171f8c6b5924e1c3e27dd0a0c44c0e6c6812b5e4363d"
  },

  // Shown in the footer. Leave email blank to show the team name only.
  contact: {
    name: "US Charters team, Gates Foundation",
    email: ""
  },

  // "Last updated" dates shown on pages. Update when you edit the matching data.
  // (The Feedback page uses the date of the most recent response instead.)
  lastUpdated: {
    convenings: "2026-11-17",
    measures: "2026-11-17",
    partners: "2026-11-17",
    about: "2026-11-17"
  }
};
