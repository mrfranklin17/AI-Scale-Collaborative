ASC.render = async function () {
  const e = ASC.esc;
  const S = ASC.survey;
  const C = ASC.charts;
  const MIN = ASC.config.minResponsesToShow || 1;
  const main = document.getElementById("main");
  const params = new URLSearchParams(location.search);

  main.innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / Feedback</div>' +
    '<span class="eyebrow">Convening feedback</span><h1>What attendees told us</h1>' +
    '<p class="lede">Filter to a single host convening to see feedback on that experience, or look across every convening to compare. Hosts can also narrow to responses from a specific organization or role.</p>' +
    '</div></section><div class="wrap" id="dash"><p class="muted">Loading responses…</p></div>';

  let real = [];
  let loadError = null;
  try {
    real = await ASC.store.list();
  } catch (x) {
    loadError = x.message;
  }
  const usingSample = !real.length && ASC.config.showSampleData;
  const all = usingSample ? ASC.sampleResponses() : real;

  const state = {
    convening: params.get("convening") || "all",
    org: params.get("org") || "all",
    role: params.get("role") || "all",
    tab: S.open[0].id,
    q: ""
  };

  /* ---------- metrics ---------- */
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const likertVals = (rows, id) => rows.map((r) => r.answers && r.answers.likert && r.answers.likert[id]).filter((v) => v >= 1 && v <= 5);
  const overall = (rows) => mean(rows.map((r) => mean(Object.values((r.answers && r.answers.likert) || {}).filter((v) => v >= 1))).filter((v) => v != null));
  const nps = (rows) => {
    const v = rows.map((r) => r.answers && r.answers.nps).filter((x) => typeof x === "number");
    if (!v.length) return null;
    return Math.round(((v.filter((x) => x >= 9).length - v.filter((x) => x <= 6).length) / v.length) * 100);
  };
  const agreeShare = (rows, id) => {
    const v = likertVals(rows, id);
    return v.length ? v.filter((x) => x >= 4).length / v.length : null;
  };

  function filtered(opts) {
    opts = Object.assign({ convening: true }, opts);
    return all.filter(
      (r) =>
        (!opts.convening || state.convening === "all" || r.convening_id === state.convening) &&
        (state.org === "all" || r.organization === state.org) &&
        (state.role === "all" || r.role === state.role)
    );
  }

  /* ---------- static frame ---------- */
  const convsWithData = ASC.convenings.filter((c) => all.some((r) => r.convening_id === c.id));
  const convOptions = ASC.convenings
    .filter((c) => c.status === "completed" || convsWithData.includes(c))
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((c) => {
      const h = ASC.partner(c.host);
      return '<option value="' + e(c.id) + '">' + e((h ? h.short : c.title) + " · " + c.dates) + "</option>";
    })
    .join("");
  const orgsPresent = ASC.orgs().filter((o) => all.some((r) => r.organization === o.id));
  const rolesPresent = S.roles.filter((ro) => all.some((r) => r.role === ro.id));

  const dash = document.getElementById("dash");
  dash.innerHTML =
    (usingSample
      ? '<div class="notice sample" style="margin-bottom:16px"><div><b>Showing illustrative sample data.</b> No survey responses have been recorded yet, so this dashboard is populated with generated example responses to show how results will look. Sample data disappears automatically once the first real response comes in. <a href="survey.html">Take the survey</a>.</div></div>'
      : "") +
    (loadError ? '<div class="notice" style="margin-bottom:16px"><div><b>Couldn’t load shared responses.</b> ' + e(loadError) + "</div></div>" : "") +
    '<div class="filters" role="region" aria-label="Filters">' +
    '<div class="f"><label for="f-conv">Convening</label><select id="f-conv"><option value="all">All convenings</option>' + convOptions + "</select></div>" +
    '<div class="f"><label for="f-org">Respondent organization</label><select id="f-org"><option value="all">All organizations</option>' + orgsPresent.map((o) => '<option value="' + e(o.id) + '">' + e(o.name) + "</option>").join("") + "</select></div>" +
    '<div class="f"><label for="f-role">Respondent role</label><select id="f-role"><option value="all">All roles</option>' + rolesPresent.map((r) => '<option value="' + e(r.id) + '">' + e(r.label) + "</option>").join("") + "</select></div>" +
    '<div class="actions"><button class="btn btn-ghost btn-sm" type="button" id="reset">Reset</button><button class="btn btn-ghost btn-sm" type="button" id="export"><span style="width:16px;height:16px;display:inline-flex">' + ASC.icon("download") + "</span>CSV</button>" +
    (ASC.store.mode === "local" ? '<label class="btn btn-ghost btn-sm" style="cursor:pointer"><span style="width:16px;height:16px;display:inline-flex">' + ASC.icon("upload") + '</span>Import<input type="file" id="import" accept=".csv,.json" class="sr-only"></label>' : "") +
    "</div></div>" +
    '<div id="results"></div>';

  const fc = document.getElementById("f-conv");
  const fo = document.getElementById("f-org");
  const fr = document.getElementById("f-role");
  if (![...fc.options].some((o) => o.value === state.convening)) state.convening = "all";
  if (![...fo.options].some((o) => o.value === state.org)) state.org = "all";
  if (![...fr.options].some((o) => o.value === state.role)) state.role = "all";
  fc.value = state.convening;
  fo.value = state.org;
  fr.value = state.role;

  const sync = () => {
    const p = new URLSearchParams();
    if (state.convening !== "all") p.set("convening", state.convening);
    if (state.org !== "all") p.set("org", state.org);
    if (state.role !== "all") p.set("role", state.role);
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
    draw();
  };
  fc.addEventListener("change", () => { state.convening = fc.value; sync(); });
  fo.addEventListener("change", () => { state.org = fo.value; sync(); });
  fr.addEventListener("change", () => { state.role = fr.value; sync(); });
  document.getElementById("reset").addEventListener("click", () => {
    state.convening = state.org = state.role = "all";
    fc.value = fo.value = fr.value = "all";
    sync();
  });
  document.getElementById("export").addEventListener("click", () => exportCsv(filtered()));
  const imp = document.getElementById("import");
  if (imp) imp.addEventListener("change", importFile);

  /* ---------- draw ---------- */
  function draw() {
    const rows = filtered();
    const network = filtered({ convening: false });
    const conv = state.convening !== "all" ? ASC.convening(state.convening) : null;
    const host = conv && ASC.partner(conv.host);
    const scopeLabel = conv ? (host ? host.short : conv.title) + " convening" : "All convenings";
    const out = document.getElementById("results");

    if (rows.length < MIN) {
      out.innerHTML =
        kpiHtml(rows, network, conv) +
        '<div class="panel" style="margin-top:20px"><div class="empty">' +
        (rows.length ? "Only " + rows.length + " response" + (rows.length === 1 ? "" : "s") + " match these filters. Results are hidden below " + MIN + " responses to protect anonymity." : "No responses match these filters yet.") +
        "</div></div>" + crossSchool(conv);
      return;
    }

    const likRows = S.likert.map((q) => {
      const v = likertVals(rows, q.id);
      return { name: q.short, counts: [1, 2, 3, 4, 5].map((k) => v.filter((x) => x === k).length), mean: mean(v), n: v.length };
    });

    let compare = "";
    if (conv) {
      const others = convsWithData.length > 1;
      compare =
        '<div class="panel"><div class="panel-head"><div><h3>This convening vs. the network</h3><p>Mean agreement (1–5) for ' + e(scopeLabel) + " compared with all convenings" + (state.org !== "all" || state.role !== "all" ? " (same respondent filters)" : "") + ".</p></div></div>" +
        C.dots(S.likert.map((q) => ({ name: q.short, a: mean(likertVals(rows, q.id)), b: mean(likertVals(network, q.id)) })), scopeLabel, "All convenings", 1, 5) +
        (others ? "" : '<p class="muted small" style="margin:14px 0 0">Only one convening has responses so far, so the network average matches this convening. Comparisons become meaningful after the next convening.</p>') +
        "</div>";
    }

    let sessions = "";
    if (conv && conv.sessions && conv.sessions.length) {
      const sr = conv.sessions
        .map((s) => {
          const v = rows.map((r) => r.answers && r.answers.sessions && r.answers.sessions[s.id]).filter((x) => x >= 1);
          return { s, v, m: mean(v) };
        })
        .filter((x) => x.v.length >= MIN)
        .sort((a, b) => b.m - a.m);
      sessions =
        '<div class="panel"><div class="panel-head"><div><h3>Session usefulness</h3><p>Mean rating, 1 (not useful) to 5 (extremely useful). Hover for detail.</p></div></div>' +
        (sr.length
          ? C.hbars(
              sr.map((x) => ({
                name: x.s.name,
                value: x.m - 1,
                label: C.fmt(x.m),
                tip: "<b>" + e(x.s.name) + "</b>Mean " + C.fmt(x.m) + " · " + Math.round((x.v.filter((k) => k >= 4).length / x.v.length) * 100) + "% very or extremely useful · n=" + x.v.length
              })),
              4
            ) + '<p class="muted small" style="margin:12px 0 0">Bars start at 1, the lowest possible rating.</p>'
          : '<div class="empty">Not enough session ratings yet.</div>') +
        "</div>";
    }

    const fCounts = ASC.frictionFramework.map((f) => ({ f, n: rows.filter((r) => r.answers && r.answers.friction === f.id).length }));
    const fTotal = fCounts.reduce((a, b) => a + b.n, 0);
    const friction =
      '<div class="panel"><div class="panel-head"><div><h3>Most relevant friction point</h3><p>Share of respondents naming each friction point as most relevant to their own work.</p></div></div>' +
      (fTotal
        ? C.hbars(
            fCounts.map((x) => ({ name: x.f.n + ". " + x.f.title, value: x.n / fTotal, label: C.pct(x.n / fTotal), tip: "<b>" + e(x.f.title) + "</b>" + x.n + " of " + fTotal + " respondents" })),
            1
          )
        : '<div class="empty">No responses to this question yet.</div>') +
      "</div>";

    out.innerHTML =
      kpiHtml(rows, network, conv) +
      '<div class="panel" style="margin-top:20px"><div class="panel-head"><div><h3>How attendees rated ' + e(conv ? "this convening" : "convenings") + "</h3><p>Distribution of agreement with each statement · " + e(scopeLabel) + " · n=" + rows.length + "</p></div></div>" +
      C.likert(likRows, S.scale) + "</div>" +
      '<div class="dash-grid" style="margin-top:20px">' + compare + sessions + friction + orgPanel(rows) + "</div>" +
      crossSchool(conv) +
      commentsPanel(rows);

    wireComments(rows);
  }

  function kpiHtml(rows, network, conv) {
    const orgCount = new Set(rows.map((r) => r.organization)).size;
    const ok = rows.length >= MIN;
    const delta = (a, b, d, suffix) => {
      if (!conv || a == null || b == null || convsWithData.length < 2) return "";
      const v = a - b;
      return " · <b>" + (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(d) + (suffix || "") + "</b> vs. network";
    };
    const ov = ok ? overall(rows) : null;
    const np = ok ? nps(rows) : null;
    const ac = ok ? agreeShare(rows, "actionable") : null;
    return (
      '<div class="kpis" style="margin-top:20px">' +
      '<div class="kpi"><div class="k">Responses</div><div class="v">' + rows.length + '</div><div class="d">from ' + orgCount + " organization" + (orgCount === 1 ? "" : "s") + "</div></div>" +
      '<div class="kpi"><div class="k">Average agreement</div><div class="v">' + C.fmt(ov) + ' <small>/ 5</small></div><div class="d">across ' + S.likert.length + " statements" + delta(ov, overall(network), 1) + "</div></div>" +
      '<div class="kpi"><div class="k">Net promoter score</div><div class="v">' + (np == null ? "—" : (np > 0 ? "+" : "") + np) + '</div><div class="d">% promoters − % detractors' + delta(np, nps(network), 0) + "</div></div>" +
      '<div class="kpi"><div class="k">Leaving with an actionable idea</div><div class="v">' + C.pct(ac) + '</div><div class="d">agree or strongly agree' + (ac != null && conv && convsWithData.length > 1 ? delta(ac * 100, agreeShare(network, "actionable") * 100, 0, " pts") : "") + "</div></div>" +
      "</div>"
    );
  }

  function orgPanel(rows) {
    const groups = ASC.orgs()
      .map((o) => ({ o, rs: rows.filter((r) => r.organization === o.id) }))
      .filter((g) => g.rs.length)
      .sort((a, b) => b.rs.length - a.rs.length);
    return (
      '<div class="panel"><div class="panel-head"><div><h3>By respondent organization</h3><p>Who responded and how they rated the experience. Averages hidden below ' + MIN + " responses.</p></div></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Organization</th><th class="num">Responses</th><th class="num">Avg. agreement</th><th class="num">Actionable idea</th></tr></thead><tbody>' +
      groups
        .map((g) => {
          const small = g.rs.length < MIN;
          return "<tr><td>" + e(g.o.name) + '</td><td class="num">' + g.rs.length + '</td><td class="num">' + (small ? "—" : C.fmt(overall(g.rs))) + '</td><td class="num">' + (small ? "—" : C.pct(agreeShare(g.rs, "actionable"))) + "</td></tr>";
        })
        .join("") +
      "</tbody></table></div></div>"
    );
  }

  function crossSchool(conv) {
    const rowsAll = filtered({ convening: false });
    const list = ASC.convenings
      .filter((c) => c.status === "completed" || rowsAll.some((r) => r.convening_id === c.id))
      .sort((a, b) => a.start.localeCompare(b.start));
    const body = list
      .map((c) => {
        const rs = rowsAll.filter((r) => r.convening_id === c.id);
        const h = ASC.partner(c.host);
        const ok = rs.length >= MIN;
        return (
          '<tr class="' + (conv && conv.id === c.id ? "sel" : "") + '"><td><a href="feedback.html?convening=' + e(c.id) + '">' + e(h ? h.name : c.title) + "</a></td><td>" + e(c.dates) + '</td><td class="num">' + rs.length +
          '</td><td class="num">' + (ok ? C.fmt(overall(rs)) : "—") + '</td><td class="num">' + (ok ? (nps(rs) > 0 ? "+" : "") + nps(rs) : "—") + '</td><td class="num">' + (ok ? C.pct(agreeShare(rs, "actionable")) : "—") + "</td></tr>"
        );
      })
      .join("");
    const tot = rowsAll.length >= MIN;
    return (
      '<div class="panel" style="margin-top:20px"><div class="panel-head"><div><h3>Across all host schools</h3><p>Every convening side by side' + (state.org !== "all" || state.role !== "all" ? ", with the current respondent filters applied" : "") + ". Select a host to drill in.</p></div></div>" +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Host</th><th>Dates</th><th class="num">Responses</th><th class="num">Avg. agreement</th><th class="num">NPS</th><th class="num">Actionable idea</th></tr></thead><tbody>' +
      body +
      '<tr><td><b>Network total</b></td><td></td><td class="num"><b>' + rowsAll.length + '</b></td><td class="num"><b>' + (tot ? C.fmt(overall(rowsAll)) : "—") + '</b></td><td class="num"><b>' + (tot ? (nps(rowsAll) > 0 ? "+" : "") + nps(rowsAll) : "—") + '</b></td><td class="num"><b>' + (tot ? C.pct(agreeShare(rowsAll, "actionable")) : "—") + "</b></td></tr>" +
      "</tbody></table></div></div>"
    );
  }

  function commentsPanel() {
    return (
      '<div class="panel" style="margin-top:20px" id="comments"><div class="panel-head"><div><h3>In their words</h3><p>Open-ended responses for the current filters.</p></div>' +
      '<div style="min-width:220px;flex:0 1 280px"><label class="sr-only" for="c-search">Search comments</label><input type="search" id="c-search" placeholder="Search comments…" value="' + e(state.q) + '"></div></div>' +
      '<div class="tabs" role="tablist">' +
      S.open.map((q) => '<button type="button" role="tab" data-tab="' + e(q.id) + '" aria-selected="' + (state.tab === q.id) + '">' + e(q.short) + ' <span class="muted" data-count="' + e(q.id) + '"></span></button>').join("") +
      '</div><p class="muted small" id="c-question" style="margin-top:-4px"></p><div class="comments" id="c-list"></div></div>'
    );
  }

  function wireComments(rows) {
    const list = document.getElementById("c-list");
    const search = document.getElementById("c-search");
    const roleLabel = (id) => (S.roles.find((r) => r.id === id) || { label: id }).label;
    function paint() {
      const q = state.q.toLowerCase();
      S.open.forEach((o) => {
        const n = rows.filter((r) => r.answers && r.answers.open && r.answers.open[o.id]).length;
        const el = document.querySelector('[data-count="' + o.id + '"]');
        if (el) el.textContent = "(" + n + ")";
      });
      document.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
      document.getElementById("c-question").textContent = (S.open.find((o) => o.id === state.tab) || {}).text || "";
      const items = rows
        .filter((r) => r.answers && r.answers.open && r.answers.open[state.tab])
        .filter((r) => !q || r.answers.open[state.tab].toLowerCase().includes(q))
        .sort((a, b) => (b.submitted_at || "").localeCompare(a.submitted_at || ""));
      const shown = items.slice(0, state.limit || 8);
      list.innerHTML = items.length
        ? shown
            .map((r) => {
              const c = ASC.convening(r.convening_id);
              const h = c && ASC.partner(c.host);
              return (
                '<div class="comment"><p>' + e(r.answers.open[state.tab]) + '</p><div class="meta">' +
                '<span class="tag">' + e(ASC.org(r.organization).short) + "</span><span>" + e(roleLabel(r.role)) + "</span>" +
                (state.convening === "all" && h ? "<span>· " + e(h.short) + " convening</span>" : "") +
                (r.sample ? '<span class="tag tag-sample">Sample</span>' : "") + "</div></div>"
              );
            })
            .join("")
        : '<div class="empty">' + (q ? "No comments match “" + e(state.q) + "”." : "No comments for this question yet.") + "</div>";
      if (items.length > shown.length) {
        list.insertAdjacentHTML("beforeend", '<div><button type="button" class="btn btn-ghost btn-sm more-btn" id="c-more">Show all ' + items.length + " comments</button></div>");
        document.getElementById("c-more").addEventListener("click", () => { state.limit = 1e9; paint(); });
      }
    }
    document.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { state.tab = b.dataset.tab; state.limit = 8; paint(); }));
    search.addEventListener("input", () => { state.q = search.value; paint(); });
    paint();
  }

  /* ---------- CSV import / export ---------- */
  function allSessionIds() {
    const ids = [];
    ASC.convenings.forEach((c) => (c.sessions || []).forEach((s) => { if (!ids.includes(s.id)) ids.push(s.id); }));
    return ids;
  }
  function exportCsv(rows) {
    const sess = allSessionIds();
    const cols = ["id", "submitted_at", "convening_id", "organization", "role"]
      .concat(S.likert.map((q) => "lk_" + q.id), ["nps"], sess.map((s) => "ss_" + s), ["friction"], S.open.map((q) => "op_" + q.id), ["sample"]);
    const cell = (v) => {
      const s = v == null ? "" : String(v);
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [cols.join(",")].concat(
      rows.map((r) => {
        const a = r.answers || {};
        const vals = {
          id: r.id, submitted_at: r.submitted_at, convening_id: r.convening_id, organization: r.organization, role: r.role,
          nps: a.nps, friction: a.friction, sample: r.sample ? "true" : ""
        };
        S.likert.forEach((q) => (vals["lk_" + q.id] = a.likert && a.likert[q.id]));
        sess.forEach((s) => (vals["ss_" + s] = a.sessions && a.sessions[s]));
        S.open.forEach((q) => (vals["op_" + q.id] = a.open && a.open[q.id]));
        return cols.map((c) => cell(vals[c])).join(",");
      })
    );
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "convening-feedback" + (state.convening !== "all" ? "-" + state.convening : "") + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  function parseCsv(text) {
    const out = [];
    let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') q = false;
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); out.push(row); row = []; cur = "";
      } else cur += ch;
    }
    if (cur || row.length) { row.push(cur); out.push(row); }
    return out.filter((r) => r.some((c) => c !== ""));
  }

  function importFile(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let rows = [];
      try {
        const text = String(reader.result).replace(/^﻿/, "");
        if (/\.json$/i.test(file.name)) {
          rows = JSON.parse(text);
        } else {
          const [head, ...data] = parseCsv(text);
          rows = data.map((d) => {
            const o = {};
            head.forEach((h, i) => (o[h.trim()] = d[i]));
            const num = (v) => (v === "" || v == null ? undefined : Number(v));
            const answers = { likert: {}, sessions: {}, open: {}, nps: num(o.nps), friction: o.friction || null };
            Object.keys(o).forEach((k) => {
              if (k.startsWith("lk_") && o[k] !== "") answers.likert[k.slice(3)] = num(o[k]);
              if (k.startsWith("ss_") && o[k] !== "") answers.sessions[k.slice(3)] = num(o[k]);
              if (k.startsWith("op_") && o[k]) answers.open[k.slice(3)] = o[k];
            });
            return { id: o.id || "imp-" + Math.random().toString(36).slice(2), submitted_at: o.submitted_at || new Date().toISOString(), convening_id: o.convening_id, organization: o.organization, role: o.role, answers };
          });
        }
        rows = rows.filter((r) => r && r.convening_id && !r.sample);
        const n = ASC.store.importLocal(rows);
        alert("Imported " + n + " new response" + (n === 1 ? "" : "s") + ".");
        location.reload();
      } catch (x) {
        alert("Couldn't read that file: " + x.message);
      }
    };
    reader.readAsText(file);
  }

  draw();
};
