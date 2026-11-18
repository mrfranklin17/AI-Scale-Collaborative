ASC.render = async function () {
  if (!ASC.hasAccess()) {
    return ASC.renderGate({ crumbs: [{ label: "Feedback" }], band: "sky", eyebrow: "Convening feedback", title: "What attendees told us", lede: "Feedback results are for Collaborative members.", onUnlock: () => ASC.render() });
  }
  const e = ASC.esc;
  const S = ASC.survey;
  const C = ASC.charts;
  const M = ASC.metrics;
  const MIN = ASC.config.minResponsesToShow || 3;
  const SMALL = 5; // below this, show a "may not be representative" note
  const main = document.getElementById("main");

  main.innerHTML = '<div class="wrap" style="padding:var(--sp-12) var(--gutter)"><p class="muted">Loading responses…</p></div>';
  const { rows: all, sample, error } = await ASC.loadResponses();

  /* ---------- state <-> URL ---------- */
  const KEYS = ["convening", "org", "role", "foundation"];
  const state = { convening: "all", org: "all", role: "all", theme: "all", foundation: "all", tab: S.open[0].id, q: "", limit: 6 };
  function readUrl() {
    const p = new URLSearchParams(location.search);
    KEYS.forEach((k) => (state[k] = p.get(k) || "all"));
  }
  function writeUrl() {
    const p = new URLSearchParams();
    KEYS.forEach((k) => { if (state[k] !== "all") p.set(k, state[k]); });
    const url = location.pathname + (p.toString() ? "?" + p : "");
    if (url !== location.pathname + location.search) history.pushState(null, "", url);
  }
  readUrl();

  /* ---------- options ---------- */
  const convOpts = ASC.convenings.filter((c) => c.status === "completed" || all.some((r) => r.convening_id === c.id)).sort((a, b) => b.start.localeCompare(a.start));
  const orgOpts = ASC.orgs().filter((o) => all.some((r) => r.organization === o.id));
  const roleOpts = S.roles.filter((ro) => all.some((r) => r.role === ro.id));
  const valid = { convening: convOpts.map((c) => c.id), org: orgOpts.map((o) => o.id), role: roleOpts.map((r) => r.id), theme: S.themes.map((t) => t.id), foundation: ["exclude"] };
  function sanitize() { KEYS.forEach((k) => { if (state[k] !== "all" && !valid[k].includes(state[k])) state[k] = "all"; }); }
  sanitize();

  const label = {
    convening: (id) => { const c = ASC.convening(id); return c ? ASC.hostName(c, true) + " convening" : id; },
    org: (id) => ASC.org(id).name + " respondents",
    role: (id) => (S.roles.find((r) => r.id === id) || { label: id }).label,
    theme: (id) => "Theme: " + (S.themes.find((t) => t.id === id) || { label: id }).label,
    foundation: () => "Excluding Foundation responses"
  };

  /* ---------- data helpers ---------- */
  const match = (r, opts) =>
    (opts.convening === false || state.convening === "all" || r.convening_id === state.convening) &&
    (opts.org === false || state.org === "all" || r.organization === state.org) &&
    (state.role === "all" || r.role === state.role) &&
    (state.foundation !== "exclude" || !isFoundation(r));
  // A Foundation response: anyone who chose the Foundation employee role or the Gates Foundation organization.
  function isFoundation(r) { return r.role === "foundation" || r.organization === "gates"; }
  const selected = () => all.filter((r) => match(r, {}));
  const network = () => all.filter((r) => match(r, { convening: false, org: false }));
  const comparing = () => state.convening !== "all" || state.org !== "all";
  const scope = () => {
    const parts = ["convening", "org", "role", "foundation"].filter((k) => state[k] !== "all").map((k) => label[k](state[k]));
    return parts.length ? parts.join(" · ") : "All convenings";
  };
  const themesOf = (text) => {
    const t = (text || "").toLowerCase();
    return S.themes.filter((th) => th.keywords.some((k) => t.includes(k))).map((th) => th.id);
  };
  const latestDate = all.filter((r) => !r.sample).map((r) => r.submitted_at).sort().pop();

  /* ---------- frame ---------- */
  const sampleDismissed = (() => { try { return sessionStorage.getItem("asc_sample_bar") === "x"; } catch (x) { return false; } })();
  const sel = (id, lbl, allLbl, opts) =>
    '<div class="f"><label for="f-' + id + '">' + lbl + '</label><select id="f-' + id + '" data-key="' + id + '"><option value="all">' + allLbl + "</option>" +
    opts.map((o) => '<option value="' + e(o.v) + '">' + e(o.t) + "</option>").join("") + "</select></div>";

  main.innerHTML =
    (sample && !sampleDismissed
      ? '<div class="sample-bar" role="note"><div class="wrap"><span class="chip chip--sample">Sample</span><span>No real responses yet<span class="hide-sm"> — charts use generated sample data</span>.</span><a class="hide-sm" href="survey.html">Take the survey</a><button type="button" class="sample-close" aria-label="Dismiss sample data notice">' + ASC.icon("close") + "</button></div></div>"
      : "") +
    ASC.pageHero({
      crumbs: [{ label: "Feedback" }],
      band: "sky",
      art: "feedback",
      eyebrow: "Convening feedback",
      title: "What attendees told us",
      lede: "Pick a host convening to see feedback on that experience next to the network average, or look across every convening. Every view has its own link you can share.",
      extra: sample ? '<p class="updated updated--sample">Showing sample data</p>' : latestDate ? ASC.updated(latestDate, "Last response") : ""
    }) +
    '<div class="wrap">' +
    '<div class="print-only print-summary" id="print-summary"></div>' +
    '<section class="filters" aria-label="Filters">' +
    '<button type="button" class="btn btn-secondary filter-toggle" aria-expanded="false" aria-controls="filter-panel">' + ASC.icon("filter") + '<span id="filter-count">Filters</span></button>' +
    '<div class="filter-panel" id="filter-panel">' +
    sel("convening", "Convening", "All convenings", convOpts.map((c) => ({ v: c.id, t: ASC.hostName(c, true) + " · " + c.dates }))) +
    sel("org", "Respondent organization", "All organizations", orgOpts.map((o) => ({ v: o.id, t: o.name }))) +
    sel("role", "Respondent role", "All roles", roleOpts.map((r) => ({ v: r.id, t: r.label }))) +
    '<label class="switch"><input type="checkbox" id="f-foundation" role="switch"><span class="switch-track" aria-hidden="true"></span><span>Exclude Foundation responses</span></label>' +
    '<div class="filter-actions">' +
    '<button class="btn btn-secondary btn-sm" type="button" id="print">' + ASC.icon("print") + "Print / PDF</button>" +
    '<button class="btn btn-secondary btn-sm" type="button" id="export">' + ASC.icon("download") + "Summary CSV</button>" +
    (ASC.store.mode === "local" ? '<label class="btn btn-secondary btn-sm">' + ASC.icon("upload") + 'Import<input type="file" id="import" accept=".csv,.json" class="sr-only"></label>' : "") +
    "</div></div>" +
    '<div class="active-chips chips" id="active-chips" aria-live="polite"></div>' +
    "</section>" +
    (error ? '<div class="notice" style="margin-top:var(--sp-4)"><div><b>Couldn’t load shared responses.</b> ' + e(error) + "</div></div>" : "") +
    '<div id="results" aria-live="polite"></div></div>';

  const panel = document.getElementById("filter-panel");
  const toggle = main.querySelector(".filter-toggle");
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  main.querySelectorAll("select[data-key]").forEach((s) =>
    s.addEventListener("change", () => { state[s.dataset.key] = s.value; state.limit = 6; writeUrl(); draw(); })
  );
  document.getElementById("f-foundation").addEventListener("change", (ev) => { state.foundation = ev.target.checked ? "exclude" : "all"; state.limit = 6; writeUrl(); draw(); });
  document.getElementById("export").addEventListener("click", () => exportCsv(selected()));
  document.getElementById("print").addEventListener("click", () => window.print());
  const imp = document.getElementById("import");
  if (imp) imp.addEventListener("change", importFile);
  const sb = main.querySelector(".sample-close");
  if (sb) sb.addEventListener("click", () => { main.querySelector(".sample-bar").remove(); try { sessionStorage.setItem("asc_sample_bar", "x"); } catch (x) {} });
  window.addEventListener("popstate", () => { readUrl(); sanitize(); draw(); });

  /* ---------- rendering ---------- */
  const samplePill = sample ? ' <span class="chip chip--sample">Sample</span>' : "";
  const nBadge = (n) => '<span class="n-badge" title="Number of responses">n=' + n + "</span>";
  const smallNote = (n) => (n < SMALL ? '<p class="small-n" role="note">' + ASC.icon("info") + "Small sample (n=" + n + "): results may not be representative.</p>" : "");
  const panelHtml = (o) =>
    '<section class="panel' + (o.wide ? " panel--wide" : "") + '" aria-labelledby="' + o.id + '-h"><div class="panel-head"><div><h3 id="' + o.id + '-h">' + o.title + samplePill + "</h3>" +
    '<p class="panel-sub">' + o.sub + "</p></div>" + (o.n != null ? nBadge(o.n) : "") + "</div>" + (o.n != null ? smallNote(o.n) : "") + o.body + "</section>";

  function draw() {
    // sync controls
    main.querySelectorAll("select[data-key]").forEach((s) => (s.value = state[s.dataset.key]));
    document.getElementById("f-foundation").checked = state.foundation === "exclude";
    const active = KEYS.filter((k) => state[k] !== "all");
    document.getElementById("filter-count").textContent = "Filters" + (active.length ? " (" + active.length + ")" : "");
    document.getElementById("active-chips").innerHTML = active.length
      ? active.map((k) => '<button type="button" class="chip chip--remove" data-clear="' + k + '" aria-label="Remove filter: ' + e(label[k](state[k])) + '">' + e(label[k](state[k])) + "</button>").join("") + '<button type="button" class="btn btn-ghost btn-sm" data-clear="all">Clear all</button>'
      : '<span class="muted small">Showing all responses</span>';
    document.querySelectorAll("[data-clear]").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.clear === "all") KEYS.forEach((k) => (state[k] = "all")); else state[b.dataset.clear] = "all";
        writeUrl(); draw();
      })
    );

    const rows = selected();
    const net = network();
    const cmp = comparing() && net.length > rows.length; // nothing to compare when the selection is the whole network
    const conv = state.convening !== "all" ? ASC.convening(state.convening) : null;
    document.getElementById("print-summary").innerHTML = "<b>AI Scale Collaborative · Convening feedback</b><br>" + e(scope()) + " · n=" + rows.length + " · printed " + e(ASC.fmtDate(new Date().toISOString())) + (sample ? " · SAMPLE DATA" : "");
    const out = document.getElementById("results");

    if (rows.length < MIN) {
      out.innerHTML =
        '<div class="empty-state" style="margin-top:var(--sp-6)"><div class="icon-dot">' + ASC.icon("chart") + "</div><h3>" +
        (rows.length ? "Not enough responses to show results" : "No responses match these filters yet") + "</h3><p>" +
        (rows.length ? "Results are hidden below " + MIN + " responses to protect anonymity (this view has " + rows.length + ")." : "Try removing a filter, or share the survey link with attendees.") +
        "</p></div>" + acrossHosts(conv);
      wireTables();
      return;
    }

    /* findings */
    const f = M.findings(rows);
    const fr = f.fr;
    const netMeans = {};
    M.statementMeans(net).forEach((x) => (netMeans[x.q.id] = x.m));
    const findings =
      '<section class="findings" aria-labelledby="findings-h"><h2 id="findings-h">Headline findings' + samplePill + '</h2><p class="panel-sub">' + e(scope()) + " · n=" + rows.length + "</p><ul>" +
      "<li><b>Strongest:</b> " + e(f.hi.q.short) + " (" + C.fmt(f.hi.m) + " of 5)" + (cmp && netMeans[f.hi.q.id] != null ? ", " + C.deltaHtml(f.hi.m - netMeans[f.hi.q.id], 1, "", "vs network") : "") + ".</li>" +
      "<li><b>Weakest:</b> " + e(f.lo.q.short) + " (" + C.fmt(f.lo.m) + " of 5)" + (cmp && netMeans[f.lo.q.id] != null ? ", " + C.deltaHtml(f.lo.m - netMeans[f.lo.q.id], 1, "", "vs network") : "") + ".</li>" +
      (fr && !S.friction.paused ? "<li><b>Most-cited friction:</b> " + e(fr.title) + (fr.tied.length > 1 ? ", tied at " + C.pct(fr.share) + " each" : ", named by " + C.pct(fr.share) + " of respondents") + ".</li>" : "") +
      "</ul></section>";

    /* KPIs */
    const kpi = (k, v, sub, d) => '<div class="kpi"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="d">' + sub + (d || "") + "</div></div>";
    const ov = M.overall(rows), ovN = M.overall(net);
    const np = M.nps(rows), npN = M.nps(net);
    const ac = M.agreeShare(rows, "actionable"), acN = M.agreeShare(net, "actionable");
    const kpis =
      '<div class="kpis">' +
      kpi("Responses", rows.length, (() => { const n = new Set(rows.map((r) => r.organization)).size; return "from " + n + " organization" + (n === 1 ? "" : "s"); })(), cmp ? '<br><span class="muted">network: ' + net.length + "</span>" : "") +
      kpi("Average agreement", C.fmt(ov) + " <small>/ 5</small>", "across " + S.likert.length + " statements", cmp ? "<br>" + C.deltaHtml(ov - ovN, 1) : "") +
      kpi("Net promoter score", np == null ? "—" : (np > 0 ? "+" : "") + np, "% promoters − % detractors", cmp && np != null && npN != null ? "<br>" + C.deltaHtml(np - npN, 0) : "") +
      kpi("Left with an actionable idea", C.pct(ac), "agree or strongly agree", cmp && ac != null && acN != null ? "<br>" + C.deltaHtml((ac - acN) * 100, 0, " pts") : "") +
      "</div>";

    /* statements */
    const likRows = S.likert.map((q) => {
      const v = M.likertVals(rows, q.id);
      const nv = M.likertVals(net, q.id);
      return {
        name: q.short,
        counts: [1, 2, 3, 4, 5].map((k) => v.filter((x) => x === k).length),
        mean: M.mean(v),
        n: v.length,
        na: M.naCount(rows, q.id),
        ref: cmp && nv.length ? { agree: nv.filter((x) => x >= 4).length / nv.length, mean: M.mean(nv) } : null
      };
    });
    const statements = panelHtml({
      id: "statements",
      wide: true,
      title: "“" + e(f.hi.q.short) + "” rated highest; “" + e(f.lo.q.short) + "” rated lowest",
      sub: "Share of respondents by level of agreement, excluding N/A · " + e(scope()) + (cmp ? " · black tick = where the network’s “agree” share begins; mean change vs network at right" : ""),
      n: rows.length,
      body: C.likert(likRows, S.scale, { refLabel: cmp ? "Network" : null })
    });

    /* sessions */
    let sessions = "";
    if (conv && conv.sessions && conv.sessions.length) {
      const sr = conv.sessions
        .map((s) => { const v = rows.map((r) => r.answers && r.answers.sessions && r.answers.sessions[s.id]).filter((x) => x >= 1); return { s, v, m: M.mean(v) }; })
        .filter((x) => x.v.length >= MIN)
        .sort((a, b) => b.m - a.m);
      const sn = rows.filter((r) => r.answers && r.answers.sessions && Object.keys(r.answers.sessions).length).length;
      sessions = panelHtml({
        id: "sessions",
        title: sr.length ? e(sr[0].s.name) + " was the most useful session" : "Session usefulness",
        sub: "Mean usefulness, 1 (not useful) to 5 (extremely useful) · bars start at 1",
        n: sn,
        body: sr.length
          ? C.hbars(sr.map((x) => ({ name: x.s.name, value: x.m - 1, label: C.fmt(x.m), tip: "<b>" + e(x.s.name) + "</b>Mean " + C.fmt(x.m) + " · n=" + x.v.length })), 4, { alt: "Session usefulness means: " + sr.map((x) => x.s.name + " " + C.fmt(x.m)).join("; ") })
          : '<div class="empty">Not enough session ratings yet.</div>'
      });
    }

    /* frictions */
    const fCounts = ASC.frictionFramework.map((x) => ({ x, n: rows.filter((r) => r.answers && r.answers.friction === x.id).length }));
    const fTotal = fCounts.reduce((a, b) => a + b.n, 0);
    const frictions = panelHtml({
      id: "frictions",
      title: fr ? (fr.tied.length > 1 ? e(fr.title) + " tied as most relevant (" + C.pct(fr.share) + " each)" : e(fr.title) + " resonated most (" + C.pct(fr.share) + ")") : "Most relevant friction point",
      sub: "Share of respondents naming each friction point as most relevant to their own work",
      n: fTotal,
      body: fTotal
        ? C.hbars(fCounts.map((c) => ({ name: c.x.title, chip: '<i class="fr-dot fr-' + c.x.id + '" aria-hidden="true"></i>', value: c.n / fTotal, label: C.pct(c.n / fTotal), color: "var(--fr-" + c.x.id + ")", tip: "<b>" + e(c.x.title) + "</b>" + c.n + " of " + fTotal })), 1)
        : '<div class="empty">No responses to this question yet.</div>'
    });

    out.innerHTML =
      findings + kpis + statements +
      '<div class="dash-grid">' + sessions + (S.friction.paused ? "" : frictions) + byOrg(rows) + "</div>" +
      trends() + acrossHosts(conv) + privacyNote();
    wireTables();
  }

  function trends() {
    const base = all.filter((r) => match(r, { convening: false }));
    const convs = ASC.completedConvenings().filter((c) => base.filter((r) => r.convening_id === c.id).length >= MIN);
    const body =
      convs.length < 2
        ? '<div class="empty-state"><div class="icon-dot">' + ASC.icon("chart") + "</div><h3>Trends appear after Convening 2</h3><p>Once two convenings have at least " + MIN + " responses each, this shows how every statement moves from one convening to the next.</p></div>"
        : C.trends(S.likert.map((q) => ({ name: q.short, points: convs.map((c) => { const v = M.likertVals(base.filter((r) => r.convening_id === c.id), q.id); return { label: ASC.hostName(c, true), value: M.mean(v), n: v.length }; }) })));
    return '<div style="margin-top:var(--sp-5)">' + panelHtml({ id: "trends", wide: true, title: convs.length < 2 ? "Trends across convenings" : "How ratings moved across convenings", sub: "Mean agreement (1–5) for each statement, by convening in date order", body }) + "</div>";
  }

  function byOrg(rows) {
    const groups = ASC.orgs().map((o) => ({ o, rs: rows.filter((r) => r.organization === o.id) })).filter((g) => g.rs.length).sort((a, b) => b.rs.length - a.rs.length);
    const body =
      '<div class="table-wrap"><table class="data-table"><caption class="sr-only">Responses and ratings by respondent organization</caption><thead><tr><th scope="col">Organization</th><th scope="col" class="num">n</th><th scope="col" class="num">Avg.</th><th scope="col" class="num">Actionable idea</th></tr></thead><tbody>' +
      groups.map((g) => { const small = g.rs.length < MIN; return '<tr><th scope="row">' + e(g.o.name) + '</th><td class="num">' + g.rs.length + '</td><td class="num">' + (small ? "—" : C.fmt(M.overall(g.rs))) + '</td><td class="num">' + (small ? "—" : C.pct(M.agreeShare(g.rs, "actionable"))) + "</td></tr>"; }).join("") +
      "</tbody></table></div><p class=\"muted small\" style=\"margin:var(--sp-3) 0 0\">— hidden for groups under " + MIN + " responses.</p>";
    const top = groups[0];
    return panelHtml({ id: "orgs", title: top ? e(top.o.short) + " sent the most respondents" : "By respondent organization", sub: "Responses and average agreement by organization", n: rows.length, body });
  }

  function acrossHosts(conv) {
    const base = all.filter((r) => match(r, { convening: false }));
    const list = ASC.completedConvenings();
    const ok = (rs) => rs.length >= MIN;
    const row = (name, rs, cls, href) =>
      '<tr class="' + cls + '"><th scope="row">' + (href ? '<a href="' + href + '">' + name + "</a>" : name) + '</th><td class="num">' + rs.length + '</td><td class="num">' + (ok(rs) ? C.fmt(M.overall(rs)) : "—") + '</td><td class="num">' + (ok(rs) ? (M.nps(rs) > 0 ? "+" : "") + M.nps(rs) : "—") + '</td><td class="num">' + (ok(rs) ? C.pct(M.agreeShare(rs, "actionable")) : "—") + "</td></tr>";
    const p = new URLSearchParams(location.search);
    const body =
      '<div class="table-wrap"><table class="data-table"><caption class="sr-only">Results for every host convening</caption><thead><tr><th scope="col">Host convening</th><th scope="col" class="num">n</th><th scope="col" class="num">Avg. agreement</th><th scope="col" class="num">NPS</th><th scope="col" class="num">Actionable idea</th></tr></thead><tbody>' +
      list.map((c) => { p.set("convening", c.id); return row(e(ASC.hostName(c)) + ' <span class="muted small">' + e(c.dates) + "</span>", base.filter((r) => r.convening_id === c.id), conv && conv.id === c.id ? "sel" : "", "feedback.html?" + p.toString()); }).join("") +
      row("<b>Network total</b>", base, "total") +
      "</tbody></table></div>";
    return '<div style="margin-top:var(--sp-5)">' + panelHtml({ id: "hosts", wide: true, title: "Every host CMO side by side", sub: "Select a host to open its view" + (state.org !== "all" || state.role !== "all" ? " · current respondent filters applied" : ""), body }) + "</div>";
  }

  function privacyNote() {
    return (
      '<section class="panel panel--wide privacy-note" aria-labelledby="privacy-h" style="margin-top:var(--sp-5)"><div class="panel-head"><div><h3 id="privacy-h">About these results</h3>' +
      '<p class="panel-sub">Results are shown only as totals for groups of ' + MIN + " or more, by organization and across the Collaborative. Individual responses and open-ended comments aren’t shown on this site; the Foundation team reads comments and shares themes back with the network.</p></div></div></section>"
    );
  }

  function wireTables() {
    // Scrollable tables must be keyboard-reachable
    document.querySelectorAll("#results .table-wrap").forEach((w, i) => {
      w.tabIndex = 0;
      w.setAttribute("role", "region");
      if (!w.getAttribute("aria-label")) w.setAttribute("aria-label", "Scrollable table " + (i + 1));
    });
  }

  /* ---------- CSV import / export ---------- */
  function allSessionIds() {
    const ids = [];
    ASC.convenings.forEach((c) => (c.sessions || []).forEach((s) => { if (!ids.includes(s.id)) ids.push(s.id); }));
    return ids;
  }
  // Export organization-level totals for the current filters (never individual responses).
  function exportCsv(rows) {
    const cell = (v) => { const t = v == null ? "" : String(v); return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
    const num = (v, d) => (v == null || isNaN(v) ? "" : Number(v).toFixed(d));
    const cols = ["group", "responses", "avg_agreement", "nps", "pct_actionable_idea"].concat(S.likert.map((q) => "mean_" + q.id));
    const line = (name, rs) => {
      if (rs.length < MIN) return [name, rs.length].concat(cols.slice(2).map(() => "")).map(cell).join(",");
      const ac = M.agreeShare(rs, "actionable");
      return [name, rs.length, num(M.overall(rs), 2), M.nps(rs), ac == null ? "" : Math.round(ac * 100)].concat(S.likert.map((q) => num(M.mean(M.likertVals(rs, q.id)), 2))).map(cell).join(",");
    };
    const groups = ASC.orgs().map((o) => ({ o, rs: rows.filter((r) => r.organization === o.id) })).filter((g) => g.rs.length);
    const lines = ["# " + scope() + (sample ? " (SAMPLE DATA)" : "") + " · groups under " + MIN + " responses are left blank", cols.join(",")]
      .concat(groups.map((g) => line(g.o.name, g.rs)))
      .concat([line("All organizations", rows)]);
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "convening-feedback-summary" + (state.convening !== "all" ? "-" + state.convening : "") + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }
  function parseCsv(text) {
    const out = [];
    let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); out.push(row); row = []; cur = ""; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur); out.push(row); }
    return out.filter((r) => r.some((c) => c !== ""));
  }
  function importFile(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result).replace(/^﻿/, "");
        let rows;
        if (/\.json$/i.test(file.name)) rows = JSON.parse(text);
        else {
          const [head, ...data] = parseCsv(text);
          rows = data.map((d) => {
            const o = {};
            head.forEach((h, i) => (o[h.trim()] = d[i]));
            const num = (v) => (v === "" || v == null ? undefined : Number(v));
            const answers = { likert: {}, sessions: {}, open: {}, nps: num(o.nps), friction: o.friction || null };
            Object.keys(o).forEach((k) => {
              if (k.startsWith("lk_") && o[k] !== "") answers.likert[k.slice(3)] = o[k] === "na" ? "na" : num(o[k]);
              if (k.startsWith("ss_") && o[k] !== "") answers.sessions[k.slice(3)] = num(o[k]);
              if (k.startsWith("op_") && o[k]) answers.open[k.slice(3)] = o[k];
            });
            return { id: o.id || "imp-" + Math.random().toString(36).slice(2), submitted_at: o.submitted_at || new Date().toISOString(), convening_id: o.convening_id, organization: o.organization, role: o.role, sample: o.sample === "true", answers };
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
