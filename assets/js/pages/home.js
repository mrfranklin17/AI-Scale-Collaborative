ASC.render = async function () {
  const c = ASC.collaborative;
  const e = ASC.esc;
  const I = ASC.icon;
  const cmos = ASC.partners.filter((p) => p.type === "CMO");
  const completed = ASC.completedConvenings();
  const latest = completed[completed.length - 1];
  const next = ASC.nextConvening();
  const today = new Date().toISOString().slice(0, 10);

  /* ---- Next convening card (floats over the hero art) ---- */
  const statusLabel = (x) => ({ completed: "Completed", upcoming: "Scheduled", planning: "Being scheduled" }[x.status] || x.status);
  const nextCard = next
    ? '<aside class="card next-card" aria-labelledby="next-h"><div class="card-kicker">Next convening</div>' +
      '<h2 id="next-h">' + e(next.title) + "</h2>" +
      "<dl><dt>Host</dt><dd>" + e(ASC.hostName(next)) + "</dd><dt>When</dt><dd>" + e(next.dates) + "</dd><dt>Where</dt><dd>" + e(next.location) + '</dd><dt>Status</dt><dd><span class="chip' + (next.status === "upcoming" ? " chip--accent" : " chip--outline") + '">' + e(next.statusNote || statusLabel(next)) + "</span></dd></dl>" +
      '<a class="arrow-link" href="convenings.html">Convening schedule ' + I("arrow") + "</a></aside>"
    : "";

  /* ---- Timeline strip ---- */
  const items = ASC.milestones
    .map((m) => Object.assign({}, m))
    .concat(ASC.convenings.map((x) => ({ date: x.start, when: x.dates, what: x.title, note: x.host ? "Hosted by " + ASC.hostName(x, true) : x.location, href: x.status === "completed" ? "convening.html?id=" + x.id : "convenings.html", done: x.status === "completed" })))
    .sort((a, b) => a.date.localeCompare(b.date));
  items.forEach((it) => { if (it.done == null) it.done = it.date <= today; });
  const nowIdx = items.findIndex((it) => !it.done);
  const timeline =
    '<ol class="tl" aria-label="Investment timeline">' +
    items
      .map((it, i) => {
        const cls = it.done ? "done" : i === nowIdx ? "now" : "";
        const what = it.href ? '<a href="' + e(it.href) + '">' + e(it.what) + "</a>" : e(it.what);
        return '<li class="' + cls + '"><span class="sr-only">' + (it.done ? "Completed: " : i === nowIdx ? "Up next: " : "Upcoming: ") + '</span><div class="when">' + e(it.when) + '</div><div class="what">' + what + "</div>" + (it.note ? '<div class="note">' + e(it.note) + "</div>" : "") + "</li>";
      })
      .join("") +
    '</ol><div class="tl-legend" aria-hidden="true"><span><i class="f"></i>Completed</span><span><i></i>Upcoming</span></div>';

  /* ---- Latest from the network ---- */
  const { rows, sample } = await ASC.loadResponses();
  const latestRows = latest ? rows.filter((r) => r.convening_id === latest.id) : [];
  const f = latestRows.length >= (ASC.config.minResponsesToShow || 3) ? ASC.metrics.findings(latestRows) : null;
  const measure = ASC.measures[0];
  const media = (seed, label) => '<div class="card-media">' + ASC.art(seed, { ratio: 0.5625, label, labelSize: 64 }) + "</div>";
  const latestCards = [
    latest
      ? '<a class="card card--link" href="convening.html?id=' + e(latest.id) + '">' + media(latest.id, "0" + latest.number) + '<div class="card-kicker">Convening notes</div><h3>' + e(latest.title) + '</h3><p class="muted small">' + e(latest.dates) + " · " + e(latest.location) + "</p><p>" + e((latest.takeaways && latest.takeaways[0]) || latest.summary) + '</p><span class="more">Read the notes</span></a>'
      : "",
    f
      ? '<a class="card card--link" href="feedback.html?convening=' + e(latest.id) + '">' + media("feedback-" + latest.id, f.hi.m.toFixed(1)) + '<div class="card-kicker">Feedback' + (sample ? ' <span class="chip chip--sample">Sample</span>' : "") + "</div><h3>Attendees rated “" + e(f.hi.q.short) + "” highest</h3>" +
        '<p class="muted small">' + e(ASC.hostName(latest, true)) + " convening · n=" + latestRows.length + "</p><p>Weakest: " + e(f.lo.q.short) + " (" + f.lo.m.toFixed(1) + ' of 5).</p><span class="more">See the results</span></a>'
      : '<a class="card card--link" href="feedback.html">' + media("feedback") + '<div class="card-kicker">Feedback</div><h3>Feedback results</h3><p>Results appear once enough attendees respond.</p><span class="more">Open the dashboard</span></a>',
    '<a class="card card--link" href="measures.html">' + media("measure-" + measure.id, measure.targets[measure.targets.length - 1].value + "%") + '<div class="card-kicker">Measure update</div><h3>' + e(measure.title) + '</h3><p class="muted small">Target: ' + measure.targets.map((t) => t.value + "% by " + t.label).join(" · ") + "</p><p>" + (measure.current != null ? "Current: " + measure.current + "%." : "First report expected " + e(measure.firstReport) + ".") + '</p><span class="more">All measures</span></a>'
  ].join("");

  /* ---- Role entry points ---- */
  const hostLink = latest ? "feedback.html?convening=" + latest.id : "feedback.html";
  const roles = [
    { href: hostLink, icon: "users", title: "I hosted or attended a convening", text: "See feedback for " + (latest ? "the " + ASC.hostName(latest, true) + " convening" : "your convening") + " next to the network average." },
    { href: "feedback.html", icon: "chart", title: "I want to see network results", text: "Every host school side by side, with trends across convenings." },
    { href: "survey.html", icon: "clipboard", title: "I’m here to take the survey", text: "About five minutes, built for your phone." }
  ];

  const stats = [
    { href: "partners.html", v: cmos.length, l: "CMO partners", go: "Meet the CMOs", cls: "coral" },
    { href: "about.html#focus", v: c.focusPopulations.length, l: "Focus populations", go: "Who we focus on", cls: "teal" },
    { href: "measures.html", v: ASC.measures.length, l: "Outcome measures to 2030", go: "See the measures", cls: "sun" },
    { href: "convenings.html", v: completed.length, l: "Convening" + (completed.length === 1 ? "" : "s") + " held", go: "See convenings", cls: "white" }
  ];

  document.getElementById("main").innerHTML =
    /* hero */
    '<section class="hero"><div class="wrap hero-grid"><div>' +
    '<span class="eyebrow">US Charters · Launched ' + e(c.launch) + "</span>" +
    '<h1>Four charter networks learning how AI can <span class="hl">raise proficiency</span>.</h1>' +
    '<p class="lede">' + e(c.tagline) + "</p>" +
    '<div class="actions-row"><a class="btn btn-primary" href="about.html">Explore the collaborative ' + I("arrow") + '</a><a class="btn btn-secondary" href="convenings.html">See convenings</a></div>' +
    '</div><div class="hero-visual">' + ASC.art("ai-scale-collaborative-hero") + nextCard + "</div></div>" +
    '<svg class="connector" viewBox="0 0 300 160" style="left:44%;bottom:-40px;width:260px" aria-hidden="true"><path d="M5 5 C 80 150, 200 150, 295 120"/></svg>' +
    "</section>" +

    /* statement band */
    '<section class="band band--sky" aria-labelledby="why-h"><div class="wrap">' +
    '<span class="eyebrow" id="why-h">Why this network</span>' +
    '<p class="statement">If four high-readiness CMOs implement AI under <em>common measurement conditions</em>, we learn together which approaches increase proficiency — and for which students.</p>' +
    '<div class="grid grid-2" style="margin-top:var(--sp-10);max-width:1000px;align-items:end"><p style="color:var(--text-2);margin:0;font-size:var(--fs-md)">' + e(c.intro[0]) + '</p><div><a class="btn btn-secondary" href="about.html">How the network works ' + I("arrow") + "</a></div></div>" +
    "</div></section>" +

    /* stats band */
    '<section class="band band--plum band--slant" aria-label="At a glance"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">At a glance</span><h2>A small network, built to learn fast.</h2></div><p>' + e(c.smallNetwork) + "</p></div>" +
    '<div class="stat-blocks">' +
    stats.map((s) => '<a class="stat-block stat-block--' + s.cls + '" href="' + s.href + '"><div><div class="v">' + s.v + '</div><div class="l">' + s.l + '</div></div><span class="go">' + s.go + " →</span></a>").join("") +
    "</div></div></section>" +

    /* roles */
    '<section class="section" aria-labelledby="roles-h"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Find what you need</span><h2 id="roles-h">Start from where you are.</h2></div></div>' +
    '<div class="grid grid-3">' +
    roles.map((r) => '<a class="card card--link role-card" href="' + e(r.href) + '"><div class="icon-dot">' + I(r.icon) + "</div><h3>" + e(r.title) + '</h3><p class="muted">' + e(r.text) + '</p><span class="more">Go</span></a>').join("") +
    "</div></div></section>" +

    /* questions */
    '<section class="band band--sage" aria-labelledby="q-h"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Learning agenda</span><h2 id="q-h">Three questions guide the work.</h2></div><p>' + e(c.designNote) + "</p></div>" +
    '<div class="grid grid-3">' +
    c.questions.map((q, i) => '<div class="card"><div class="q-num" aria-hidden="true">0' + (i + 1) + "</div><h3>" + e(q.title) + '</h3><p class="muted">' + e(q.text) + "</p></div>").join("") +
    "</div></div></section>" +

    /* timeline */
    '<section class="section" aria-labelledby="tl-h"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Investment timeline</span><h2 id="tl-h">From launch to evidence.</h2></div><p>Initial investment Fall 2026 – Summer 2028, with a potential extension through 2030.</p></div>' +
    timeline + "</div></section>" +

    /* latest */
    '<section class="section" style="padding-top:0" aria-labelledby="latest-h"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Latest from the network</span><h2 id="latest-h">What’s new.</h2></div><a class="arrow-link" href="convenings.html">All convenings ' + I("arrow") + "</a></div>" +
    '<div class="grid grid-3">' + latestCards + "</div></div></section>";
};
