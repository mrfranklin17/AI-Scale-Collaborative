ASC.render = async function () {
  const e = ASC.esc;
  const I = ASC.icon;
  const main = document.getElementById("main");
  const id = new URLSearchParams(location.search).get("id");
  const done = ASC.completedConvenings();
  const c = ASC.convening(id) || done[done.length - 1];
  if (!c || !c.host) {
    main.innerHTML = ASC.pageHero({ crumbs: [{ label: "Convenings", href: "convenings.html" }, { label: "Not found" }], title: c ? "This convening hasn’t been scheduled yet" : "Convening not found", lede: '<a href="convenings.html">Back to all convenings</a>' });
    return;
  }
  document.title = c.title + " · AI Scale Collaborative";
  const host = ASC.partner(c.host);
  const status = { completed: "Completed", upcoming: "Scheduled", planning: "Being scheduled" }[c.status] || c.status;

  /* ---- at-a-glance header ---- */
  const glance =
    '<dl class="glance">' +
    "<div><dt>Host</dt><dd>" + '<a href="partner.html?id=' + e(host.id) + '">' + e(host.name) + "</a></dd></div>" +
    "<div><dt>Dates</dt><dd>" + e(c.dates) + "</dd></div>" +
    "<div><dt>Location</dt><dd>" + e(c.location) + "</dd></div>" +
    "<div><dt>Attendees</dt><dd>" + (c.attendees ? e(c.attendees) : '<span class="muted">Not recorded</span>') + "</dd></div>" +
    '<div><dt>Status</dt><dd><span class="chip' + (c.status === "completed" ? " chip--good" : " chip--outline") + '">' + (c.status === "completed" ? I("check") : "") + e(status) + "</span></dd></div>" +
    "</dl>" +
    (c.themes && c.themes.length ? '<div class="chips" aria-label="Focus areas" style="margin-top:var(--sp-4)">' + c.themes.map((t) => '<span class="chip chip--accent">' + e(t) + "</span>").join("") + "</div>" : "");

  /* ---- sections ---- */
  const S = [];
  if (c.takeaways && c.takeaways.length) {
    S.push({ id: "takeaways", nav: "Key takeaways", html: '<h2 id="takeaways-h">Key takeaways</h2><ol class="takeaways">' + c.takeaways.map((t) => "<li>" + e(t) + "</li>").join("") + "</ol>" });
  }
  if (c.days && c.days.length) {
    S.push({
      id: "agenda",
      nav: "Agenda",
      html:
        '<h2 id="agenda-h">Agenda</h2><ol class="agenda">' +
        c.days.map((d) => '<li><div class="agenda-day"><span class="chip chip--accent">' + e(d.label) + "</span><h3>" + e(d.date) + '</h3><p class="muted small">' + I("pin") + " " + e(d.campus) + "</p></div><ul>" + d.items.map((x) => "<li>" + e(x) + "</li>").join("") + "</ul></li>").join("") +
        "</ol>"
    });
  }
  const fr = (c.sections || []).find((s) => s.frictionNotes);
  if (fr) {
    S.push({
      id: "saw",
      nav: "What we saw",
      html:
        '<h2 id="saw-h">What we saw, by friction point</h2><p class="muted">' + e(fr.lede || "") + "</p>" +
        '<div class="fr-grid">' +
        ASC.frictionFramework
          .map((f) => {
            const n = fr.frictionNotes[f.id];
            if (!n) return "";
            return (
              '<article class="fr-card fr-card--' + f.id + '" aria-labelledby="fr-' + f.id + '"><header><span class="chip chip--fr chip--' + f.id + '">' + f.n + ". " + e(f.title) + '</span><p id="fr-' + f.id + '">' + e(f.question) + "</p></header>" +
              "<dl>" + n.points.map((p) => "<dt>" + e(p.label) + "</dt><dd>" + e(p.text) + "</dd>").join("") + "</dl>" +
              (n.insight ? '<p class="fr-insight"><b>Key insight:</b> ' + e(n.insight) + "</p>" : "") +
              (n.source ? '<p class="source">Source: ' + e(n.source) + "</p>" : "") + "</article>"
            );
          })
          .join("") +
        "</div>" + ASC.renderBlocks(fr.blocks)
    });
  }
  if (c.questions && c.questions.length) {
    S.push({ id: "questions", nav: "Questions raised", html: '<h2 id="questions-h">Questions this raised for the network</h2><ul class="qlist">' + c.questions.map((q) => "<li>" + I("info") + "<span>" + e(q) + "</span></li>").join("") + "</ul>" });
  }
  const notes = (c.sections || []).filter((s) => !s.frictionNotes);
  if (notes.length) {
    S.push({
      id: "notes",
      nav: "Detailed notes",
      html:
        '<h2 id="notes-h">Detailed notes</h2><p class="muted">' + e(c.notesBy || "Site-visit notes") + ". Open a section to read it in full.</p>" +
        notes.map((s, i) => '<details class="note-section"' + (i === 0 ? " open" : "") + "><summary><span><b>" + e(s.title) + "</b>" + (s.lede ? '<span class="muted small">' + e(s.lede) + "</span>" : "") + "</span>" + I("chev") + '</summary><div class="prose">' + ASC.renderBlocks(s.blocks) + "</div></details>").join("")
    });
  }
  S.push({ id: "feedback", nav: "Attendee feedback", html: '<h2 id="feedback-h">Attendee feedback</h2><div id="fb-summary"><p class="muted">Loading feedback…</p></div>' });
  const surveyUrl = new URL("survey.html?convening=" + encodeURIComponent(c.id), location.href).href;
  S.push({
    id: "survey",
    nav: "Survey QR code",
    html:
      '<h2 id="survey-h">Survey QR code</h2><div class="qr-block card"><div class="qr" id="qr" role="img" aria-label="QR code linking to the survey for this convening"></div>' +
      '<div><h3>Project this at the close of the convening</h3><p class="muted">Attendees scan it to open the survey with this convening already selected. About five minutes on a phone.</p>' +
      '<p class="small" style="word-break:break-all"><a href="' + e(surveyUrl) + '">' + e(surveyUrl) + "</a></p>" +
      '<div class="actions-row"><button type="button" class="btn btn-primary" id="qr-full">Show full screen</button><a class="btn btn-secondary" href="survey.html?convening=' + e(c.id) + '">Open the survey</a></div></div></div>'
  });

  /* ---- prev / next ---- */
  const all = ASC.convenings.slice().sort((a, b) => a.start.localeCompare(b.start));
  const i = all.indexOf(c);
  const pn = (x, dir) => {
    if (!x) return "<span></span>";
    const inner = '<span class="pn-dir">' + (dir < 0 ? I("back") + " Previous" : "Next " + I("arrow")) + '</span><span class="pn-title">' + e(x.host ? x.title : "Convening " + x.number + ": to be scheduled") + '</span><span class="muted small">' + e(x.dates) + "</span>";
    return x.status === "completed" && x.host ? '<a class="pn pn--' + (dir < 0 ? "prev" : "next") + '" href="convening.html?id=' + e(x.id) + '">' + inner + "</a>" : '<div class="pn pn--' + (dir < 0 ? "prev" : "next") + ' pn--off">' + inner + "</div>";
  };

  main.innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Convenings", href: "convenings.html" }, { label: ASC.hostName(c, true) }],
      eyebrow: "Convening " + c.number + " · " + c.dates,
      title: c.title,
      lede: e(c.summary),
      extra: '<div class="card glance-card">' + glance + "</div>",
      updated: ASC.config.lastUpdated.convenings
    }) +
    ASC.withToc(S, { cta: '<div class="toc-cta"><a class="btn btn-primary btn-sm" href="survey.html?convening=' + e(c.id) + '">Take the survey</a></div>' }) +
    '<nav class="wrap pn-nav" aria-label="Other convenings">' + pn(all[i - 1], -1) + pn(all[i + 1], 1) + "</nav>";

  /* ---- QR ---- */
  const qrEl = document.getElementById("qr");
  let svg = "";
  if (window.qrcode) {
    const q = window.qrcode(0, "M");
    q.addData(surveyUrl);
    q.make();
    svg = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    qrEl.innerHTML = svg;
  } else {
    qrEl.innerHTML = '<p class="muted small">QR code unavailable.</p>';
  }
  document.getElementById("qr-full").addEventListener("click", () => {
    const ov = document.createElement("div");
    ov.className = "qr-overlay";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Survey QR code");
    ov.innerHTML = '<div class="qr-big">' + svg + "</div><p>Scan to share feedback on " + e(c.title) + '</p><button type="button" class="btn btn-secondary">Close</button>';
    document.body.appendChild(ov);
    const btn = ov.querySelector("button");
    const onKey = (ev) => {
      if (ev.key === "Escape") { ev.preventDefault(); close(); }
      else if (ev.key === "Tab") { ev.preventDefault(); btn.focus(); }
    };
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); document.getElementById("qr-full").focus(); };
    btn.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    btn.focus();
  });

  /* ---- embedded feedback summary ---- */
  const fmt = (v) => (v == null || isNaN(v) ? "—" : Number(v).toFixed(1));
  const pct = (v) => (v == null || isNaN(v) ? "—" : Math.round(v * 100) + "%");
  const { rows: allRows, sample } = await ASC.loadResponses();
  const rows = allRows.filter((r) => r.convening_id === c.id);
  const MIN = ASC.config.minResponsesToShow || 3;
  const M = ASC.metrics;
  const box = document.getElementById("fb-summary");
  if (rows.length < MIN) {
    box.innerHTML = '<div class="empty-state"><div class="icon-dot">' + I("chart") + "</div><h3>Feedback results appear after " + MIN + " responses</h3><p>" + (rows.length ? rows.length + " so far. " : "No responses yet. ") + '<a href="survey.html?convening=' + e(c.id) + '">Take the survey</a></p></div>';
    return;
  }
  const f = M.findings(rows);
  const np = M.nps(rows);
  box.innerHTML =
    (sample ? '<p><span class="chip chip--sample">Sample</span> <span class="muted small">Illustrative sample data until real responses arrive.</span></p>' : "") +
    '<div class="kpis" style="margin-top:0">' +
    '<div class="kpi"><div class="k">Responses</div><div class="v">' + rows.length + "</div></div>" +
    '<div class="kpi"><div class="k">Average agreement</div><div class="v">' + fmt(M.overall(rows)) + " <small>/ 5</small></div></div>" +
    '<div class="kpi"><div class="k">Net promoter score</div><div class="v">' + (np > 0 ? "+" : "") + np + "</div></div>" +
    '<div class="kpi"><div class="k">Left with an actionable idea</div><div class="v">' + pct(M.agreeShare(rows, "actionable")) + "</div></div></div>" +
    '<ul class="fb-findings"><li><b>Strongest:</b> ' + e(f.hi.q.short) + " (" + fmt(f.hi.m) + ")</li><li><b>Weakest:</b> " + e(f.lo.q.short) + " (" + fmt(f.lo.m) + ")</li>" + (f.fr ? "<li><b>Most-cited friction:</b> " + e(f.fr.title) + "</li>" : "") + "</ul>" +
    '<a class="btn btn-primary" href="feedback.html?convening=' + e(c.id) + '">See full results for this convening ' + I("arrow") + "</a>";
};
