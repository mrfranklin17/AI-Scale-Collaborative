// Daily survey response count for the AI Scale Collaborative.
// Reads the comment-free `survey_results` view with the public (publishable) key —
// the same key the website uses — so no secrets are needed. Prints a Markdown report.
const URL = "https://ibnhdbkrhrofhxjzzjeb.supabase.co/rest/v1/survey_results?select=submitted_at,convening_id,organization,role";
const KEY = "sb_publishable_WggZitaumNTB7WmMKHhzIg_x9aHUBlt";

const CONVENINGS = { "dream-2026-11": "DREAM Convening (Nov 4–5, 2026)", "kipp-norcal-2027-03": "KIPP NorCal Convening (Mar 23–25, 2027)" };
const ORGS = { dream: "DREAM Charter Schools", "kipp-norcal": "KIPP NorCal", "gem-prep": "Gem Prep", collegiate: "Collegiate Academies", gates: "Gates Foundation", "ai-for-equity": "AI for Equity", other: "Other organization" };
const ROLES = { network: "Network / central office leader", school: "School leader", instruction: "Teacher, coach or academic dean", data: "Data or technology", operations: "Operations", foundation: "Foundation employee", other: "Other" };
const MIN = 3;

let res;
try {
  res = await fetch(URL, { headers: { apikey: KEY } });
} catch (err) {
  console.log(`⚠️ Could not reach the survey database: ${err.cause ? err.cause.code || err.cause.message : err.message}`);
  process.exit(0);
}
if (!res.ok) {
  console.log(`⚠️ Could not read survey results: HTTP ${res.status} — ${(await res.text()).slice(0, 300)}`);
  process.exit(0);
}
const rows = await res.json();
const now = Date.now();
const recent = rows.filter((r) => now - Date.parse(r.submitted_at) < 24 * 3600 * 1000).length;
const isFdn = (r) => r.role === "foundation" || r.organization === "gates";
const count = (key, names) => {
  const c = {};
  rows.forEach((r) => (c[r[key]] = (c[r[key]] || 0) + 1));
  return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => `| ${names[k] || k} | ${n} |`).join("\n") || "| — | 0 |";
};
const dream = rows.filter((r) => r.convening_id === "dream-2026-11").length;
const today = new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", weekday: "long", month: "long", day: "numeric", year: "numeric" });

console.log(`**DREAM survey: ${dream} response${dream === 1 ? "" : "s"} (+${recent} in the last 24 hours)** — ${today}

${dream >= MIN ? `✅ DREAM has reached ${MIN} responses, so results are visible on the [Feedback dashboard](https://aiscalecollaborative.vercel.app/feedback.html?convening=dream-2026-11) (password protected).` : `Results stay hidden on the dashboard until DREAM has ${MIN} responses.`}

Foundation responses: ${rows.filter(isFdn).length} · All others: ${rows.filter((r) => !isFdn(r)).length} · Total across convenings: ${rows.length}

| Convening | Responses |
|---|---|
${count("convening_id", CONVENINGS)}

| Organization | Responses |
|---|---|
${count("organization", ORGS)}

| Role | Responses |
|---|---|
${count("role", ROLES)}`);
