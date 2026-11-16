ASC.render = function () {
  const e = ASC.esc;
  const I = ASC.icon;
  const p = ASC.partner(new URLSearchParams(location.search).get("id"));
  const main = document.getElementById("main");
  if (!p) {
    main.innerHTML = ASC.pageHero({ crumbs: [{ label: "Partners", href: "partners.html" }, { label: "Not found" }], title: "Partner not found", lede: '<a href="partners.html">See all partners</a>' });
    return;
  }
  document.title = p.name + " · AI Scale Collaborative";
  const hosted = ASC.convenings.filter((c) => c.host === p.id && c.status === "completed").sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = ASC.convenings.filter((c) => c.host === p.id && c.status !== "completed");
  const facts = [
    ["Type", p.type],
    ["Location", p.location],
    ["Region", p.region],
    ["Schools", p.schools || null],
    ["Students", p.students ? Number(p.students).toLocaleString() : null]
  ];

  const stack = p.stack
    ? "<dl class=\"stack\"><dt>High-quality instructional materials</dt><dd>" + e(p.stack.hqim) + "</dd><dt>AI tools and systems in use</dt><dd><ul>" + p.stack.tools.map((t) => "<li>" + e(t) + "</li>").join("") + "</ul></dd></dl>" + (p.stack.source ? '<p class="source">' + e(p.stack.source) + "</p>" : "")
    : '<div class="empty-state"><div class="icon-dot">' + I("book") + "</div><h3>Stack documentation not yet submitted</h3><p>Partners report HQIM, AI tools, deployment conditions and supervised vs. unsupervised use at onboarding, then quarterly.</p></div>";

  const convList = hosted.length
    ? '<ul class="plain-list">' + hosted.map((c) => '<li><a href="convening.html?id=' + e(c.id) + '"><b>' + e(c.title) + "</b></a><span class=\"muted small\">" + e(c.dates) + " · " + e(c.location) + "</span></li>").join("") + "</ul>"
    : '<p class="muted">Hasn’t hosted yet' + (upcoming.length ? " · next: " + e(upcoming[0].dates) : "") + ".</p>";

  main.innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Partners", href: "partners.html" }, { label: p.short }],
      band: "sage",
      art: p.id,
      artLabel: ASC.initials(p.name),
      eyebrow: p.type === "CMO" ? "CMO partner" : "Intermediary partner",
      title: p.name,
      lede: e(p.summary),
      below:
        '<div class="card glance-card"><dl class="glance">' +
        facts.map(([k, v]) => "<div><dt>" + k + "</dt><dd>" + (v ? e(v) : '<span class="muted">Not yet reported</span>') + "</dd></div>").join("") +
        '<div><dt>Hosting</dt><dd><span class="dots2" role="img" aria-label="Hosted ' + hosted.length + ' of 2"><i class="' + (hosted.length >= 1 ? "on" : "") + '"></i><i class="' + (hosted.length >= 2 ? "on" : "") + '"></i></span> ' + hosted.length + " of 2</dd></div></dl></div>",
      updated: ASC.config.lastUpdated.partners
    }) +
    ASC.withToc([
      { id: "stack", nav: "AI stack", html: '<h2 id="stack-h">Instructional and AI stack</h2>' + stack },
      { id: "hosted", nav: "Convenings hosted", html: '<h2 id="hosted-h">Convenings hosted</h2>' + convList },
      {
        id: "feedback",
        nav: "Feedback",
        html:
          '<h2 id="feedback-h">Feedback</h2><div class="grid grid-2">' +
          (hosted.length ? '<a class="card card--link" href="feedback.html?convening=' + e(hosted[hosted.length - 1].id) + '"><div class="card-kicker">As host</div><h3>What attendees said about ' + e(p.short) + "’s convening</h3><span class=\"more\">Open the filtered dashboard →</span></a>" : '<div class="card card--outline"><div class="card-kicker">As host</div><h3>No hosted convening yet</h3><p class="muted small">Feedback appears here after ' + e(p.short) + " hosts.</p></div>") +
          '<a class="card card--link" href="feedback.html?org=' + e(p.id) + '"><div class="card-kicker">As attendee</div><h3>How ' + e(p.short) + " staff rated convenings</h3><span class=\"more\">Open the filtered dashboard →</span></a>" +
          "</div>"
      }
    ]);
};
