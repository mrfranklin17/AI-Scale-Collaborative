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
      // Works with both key styles: legacy JWT "anon" keys (eyJ...) also go in the
      // Authorization header; new "publishable" keys (sb_publishable_...) go in apikey only.
      const h = { apikey: cfg.supabaseAnonKey, "Content-Type": "application/json" };
      if (/^eyJ/.test(cfg.supabaseAnonKey)) h.Authorization = "Bearer " + cfg.supabaseAnonKey;
      return h;
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
    const lean = { objectives: 0.5, relevance: 0.6, host_view: 0.9, actionable: 0.7, focus_students: -0.6, agenda: 0.2, connections: 0.1, logistics: -0.2 };
    const sessionLean = { "leader-data-day": 0.6, "classroom-obs": 0.2, "ai-native": 0.4, "ai-literacy": 0.5, tutoring: 0.7, "data-hub": 0.9, "task-force": 0.3, coursemojo: -0.3 };
    const orgs = ["kipp-norcal", "kipp-norcal", "kipp-norcal", "kipp-norcal", "kipp-norcal", "kipp-norcal", "gem-prep", "gem-prep", "gem-prep", "gem-prep", "gem-prep", "collegiate", "collegiate", "collegiate", "collegiate", "collegiate", "collegiate", "gates", "gates", "gates", "ai-for-equity", "ai-for-equity", "ai-for-equity", "dream", "dream", "dream"];
    const roles = { default: ["network", "network", "school", "school", "instruction", "data", "operations"], gates: ["foundation"], "ai-for-equity": ["other"], dream: ["school", "instruction", "data"] };
    const frictions = ["product", "configuration", "configuration", "coherence", "coherence", "practice", "practice", "practice"];
    // Each sample comment is used once, so the list reads like distinct respondents.
    const text = {
      valuable: [
        "Seeing how the host brings student data together in one place for leaders.",
        "Watching teachers and leaders talk openly about what is and isn’t working yet.",
        "The way staff are involved in deciding where AI should help.",
        "Time with peers from other CMOs working on the same questions.",
        "Seeing AI support teachers’ planning so they can focus on instruction.",
        "How the host connects intervention to what students are learning in class.",
        "Concrete examples of AI tools that fit into routines staff already use.",
        "The student-facing AI literacy work.",
        "Hearing how decisions about which tools to keep are made.",
        "Classroom time — seeing the work, not just hearing about it.",
        "Clear data norms that keep conversations focused on students."
      ],
      try: [
        "Pilot one AI-supported planning routine with a single grade team.",
        "Share the host’s staff-involvement approach with our central office.",
        "Define what success looks like before we roll out the next tool.",
        "Set a clear point to decide whether to keep or drop a pilot.",
        "Connect our tutoring more closely to core classroom content.",
        "Start a cross-functional AI group that includes school staff.",
        "Look at how much time students actually spend with the tools we use.",
        "Ask our vendors for subgroup outcome data.",
        "Try a short AI literacy unit with one class."
      ],
      improve: [
        "More time in classrooms.",
        "Structured time with our own team to plan next steps before we leave.",
        "Share pre-reads ahead of time.",
        "A session focused on Black, Latino, and low-income students.",
        "Smaller cross-network groups so people can compare notes by role.",
        "A short debrief at the end of each day.",
        "A slightly lighter agenda on day two.",
        "Hear directly from teachers and students."
      ]
    };
    const nextText = {};
    const takeText = (k) => {
      nextText[k] = nextText[k] || 0;
      return nextText[k] < text[k].length ? text[k][nextText[k]++] : null;
    };
    const rows = [];
    orgs.forEach((org, i) => {
      const person = (r() - 0.5) * 1.2; // respondent generosity
      const likert = {};
      ASC.survey.likert.forEach((q) => {
        likert[q.id] = clamp(Math.round(3.6 + (lean[q.id] || 0) + person + (r() - 0.5) * 1.6), 1, 5);
        if ((org === "gates" || org === "ai-for-equity") && ["relevance", "actionable", "agenda"].includes(q.id) && r() < 0.6) likert[q.id] = "na";
      });
      const sessions = {};
      conv.sessions.forEach((s) => {
        if (r() < 0.12) return; // didn't attend
        sessions[s.id] = clamp(Math.round(3.4 + (sessionLean[s.id] || 0) + person + (r() - 0.5) * 1.6), 1, 5);
      });
      const open = {};
      ASC.survey.open.forEach((q) => {
        if (r() < 0.6) { const t = takeText(q.id); if (t) open[q.id] = t; }
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
