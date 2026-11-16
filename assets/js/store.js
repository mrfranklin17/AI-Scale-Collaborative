/*
 * Survey response storage.
 *
 * A response looks like:
 * {
 *   id, submitted_at (ISO string), convening_id, organization, role,
 *   answers: {
 *     likert:   { objectives: 1-5, ... },
 *     nps:      0-10,
 *     sessions: { sessionId: 1-5 },
 *     friction: "product" | "configuration" | "coherence" | "practice",
 *     open:     { valuable: "", try: "", improve: "" }
 *   }
 * }
 */
(function () {
  const ASC = (window.ASC = window.ASC || {});
  const cfg = ASC.config.backend;
  const LOCAL_KEY = "asc_survey_responses_v1";

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "r-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function writeLocal(rows) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
      return true;
    } catch (e) {
      return false;
    }
  }

  const supabase = {
    headers() {
      return {
        apikey: cfg.supabaseAnonKey,
        Authorization: "Bearer " + cfg.supabaseAnonKey,
        "Content-Type": "application/json"
      };
    },
    base() {
      return cfg.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + cfg.table;
    },
    async list() {
      const res = await fetch(this.base() + "?select=*&order=submitted_at.asc", { headers: this.headers() });
      if (!res.ok) throw new Error("Could not load responses (" + res.status + ")");
      return res.json();
    },
    async submit(row) {
      const res = await fetch(this.base(), {
        method: "POST",
        headers: Object.assign(this.headers(), { Prefer: "return=minimal" }),
        body: JSON.stringify(row)
      });
      if (!res.ok) throw new Error("Could not save response (" + res.status + ")");
    }
  };

  const useSupabase = cfg.type === "supabase" && cfg.supabaseUrl && cfg.supabaseAnonKey;

  ASC.store = {
    mode: useSupabase ? "shared" : "local",

    async list() {
      return useSupabase ? supabase.list() : readLocal();
    },

    async submit(partial) {
      const row = Object.assign({ id: uuid(), submitted_at: new Date().toISOString() }, partial);
      if (useSupabase) {
        await supabase.submit(row);
      } else {
        const rows = readLocal();
        rows.push(row);
        if (!writeLocal(rows)) throw new Error("This browser blocked local storage, so the response could not be saved.");
      }
      return row;
    },

    /* Local mode only: merge rows from an imported CSV/JSON file. */
    importLocal(rows) {
      const existing = readLocal();
      const ids = new Set(existing.map((r) => r.id));
      const fresh = rows.filter((r) => !ids.has(r.id));
      writeLocal(existing.concat(fresh));
      return fresh.length;
    },

    clearLocal() {
      writeLocal([]);
    }
  };

  /* ---------- Illustrative sample data (clearly labeled in the UI) ---------- */

  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  ASC.sampleResponses = function () {
    const r = rng(20261105);
    const conv = ASC.convenings.find((c) => c.id === "dream-2026-11");
    if (!conv) return [];
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    // Item "lean" shifts the distribution per question so the sample looks varied.
    const lean = { objectives: 0.5, relevance: 0.6, host_view: 0.9, actionable: 0.7, equity: -0.6, connections: 0.1, logistics: -0.2 };
    const sessionLean = { "leader-data-day": 0.6, "classroom-obs": 0.2, "ai-native": 0.4, "ai-literacy": 0.5, tutoring: 0.7, "data-hub": 0.9, "task-force": 0.3, coursemojo: -0.3 };
    const orgs = ["kipp-norcal", "kipp-norcal", "kipp-norcal", "kipp-norcal", "kipp-norcal", "gem-prep", "gem-prep", "gem-prep", "gem-prep", "collegiate", "collegiate", "collegiate", "collegiate", "collegiate", "esw", "esw", "esw", "noaief", "noaief", "noaief", "gates", "gates", "gates", "ai-for-equity", "ai-for-equity", "dream"];
    const roles = { default: ["network", "network", "school", "school", "instruction", "data", "operations"], esw: ["intermediary"], noaief: ["intermediary"], gates: ["foundation"], "ai-for-equity": ["other"], dream: ["school"] };
    const frictions = ["product", "configuration", "configuration", "coherence", "coherence", "practice", "practice", "practice"];
    const text = {
      valuable: [
        "Seeing the Data Hub's 'where to intervene' board — flags, interventions and targets on one screen.",
        "The observation agent built inside Google Chat. Building to the workflow people already use is the lesson.",
        "Hearing DREAM say plainly that student-facing AI fails the students furthest behind.",
        "Leader Data Day norms — results are not a reflection of worth. That changes the room.",
        "Rubric-scoring agents giving Fridays back to teachers for reteach planning.",
        "The honesty about the tutoring pilot showing no difference yet.",
        "The AI literacy protocol in history class: accept, revise or reject.",
        "Tiered data access and versioned flag definitions."
      ],
      try: [
        "Pilot rubric-based scoring for one interim with our ELA team.",
        "Share the 'top-and-bottom' agent approach with our network tech team.",
        "Write down our own flag definitions before building any dashboard.",
        "Set an explicit abandonment threshold for tools we pilot.",
        "Map our tutoring sessions to next week's Tier 1 content instead of remediation.",
        "Bring the task-force model to our central office.",
        "Audit where tutoring sits in our schedule and what dosage students actually get."
      ],
      improve: [
        "More time in classrooms, less in presentations.",
        "Structured time with our own team to plan next steps before we leave.",
        "Share pre-reads on the data stack ahead of time.",
        "A session specifically on English learners and students with IEPs.",
        "Smaller cross-network groups so intermediaries can compare notes.",
        "Build in a debrief at the end of each day."
      ]
    };
    const rows = [];
    orgs.forEach((org, i) => {
      const person = (r() - 0.5) * 1.2; // respondent generosity
      const likert = {};
      ASC.survey.likert.forEach((q) => {
        likert[q.id] = clamp(Math.round(3.6 + (lean[q.id] || 0) + person + (r() - 0.5) * 1.6), 1, 5);
      });
      const sessions = {};
      conv.sessions.forEach((s) => {
        if (r() < 0.12) return; // didn't attend
        sessions[s.id] = clamp(Math.round(3.4 + (sessionLean[s.id] || 0) + person + (r() - 0.5) * 1.6), 1, 5);
      });
      const open = {};
      ASC.survey.open.forEach((q) => {
        if (r() < 0.72) open[q.id] = pick(text[q.id]);
      });
      rows.push({
        id: "sample-" + i,
        sample: true,
        submitted_at: new Date(Date.UTC(2026, 10, 5, 18 + Math.floor(i / 6), (i * 7) % 60)).toISOString(),
        convening_id: conv.id,
        organization: org,
        role: pick(roles[org] || roles.default),
        answers: {
          likert,
          nps: clamp(Math.round(8 + person * 2 + (r() - 0.5) * 3), 0, 10),
          sessions,
          friction: pick(frictions),
          open
        }
      });
    });
    return rows;
  };
})();
