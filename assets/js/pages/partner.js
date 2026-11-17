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
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", p.summary);
  const hosted = ASC.convenings.filter((c) => c.host === p.id && c.status === "completed").sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = ASC.convenings.filter((c) => c.host === p.id && c.status !== "completed");
  const h = ASC.hostingText(p);
  const facts = [["Location", p.location]].concat((p.facts || []).map((f) => [f.k, f.v])).concat([["Hosting", h.text]]);

  const stack = p.stack
    ? "<dl class=\"stack\"><dt>High-quality instructional materials</dt><dd>" + e(p.stack.hqim) + "</dd><dt>AI tools and systems in use</dt><dd><ul>" + p.stack.tools.map((t) => "<li>" + e(t) + "</li>").join("") + "</ul></dd></dl>" + (p.stack.source ? '<p class="source">' + e(p.stack.source) + "</p>" : "")
    : '<div class="empty-state"><div class="icon-dot">' + I("book") + "</div><h3>Stack documentation not yet submitted</h3><p>CMOs report HQIM, AI tools, deployment conditions and supervised vs. unsupervised use, updated quarterly.</p></div>";

  const convList = hosted.length
    ? '<ul class="plain-list">' + hosted.map((c) => '<li><a href="convening.html?id=' + e(c.id) + '"><b>' + e(c.title) + "</b></a><span class=\"muted small\">" + e(c.dates) + " · " + e(c.location) + "</span></li>").join("") + "</ul>"
    : '<p class="muted">Hasn’t hosted yet · ' + e(h.text) + ".</p>";

  main.innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Partners", href: "partners.html" }, { label: p.short }],
      band: "sage",
      artHtml: ASC.logoPlate(p, "hero-logo"),
      eyebrow: "CMO partner",
      title: p.name,
      lede: e(p.summary),
      below:
        '<div class="card glance-card"><dl class="glance">' +
        facts.map(([k, v]) => "<div><dt>" + e(k) + "</dt><dd>" + (v ? e(v) : '<span class="muted">Not yet reported</span>') + "</dd></div>").join("") +
        "</dl>" + (p.website ? '<p class="muted small" style="margin:var(--sp-4) 0 0">Source: <a href="' + e(p.website) + '" target="_blank" rel="noopener">' + e(p.website.replace(/^https?:\/\/(www\.)?/, "")) + "</a> (November 2026)</p>" : "") + "</div>",
      updated: ASC.config.lastUpdated.partners
    }) +
    ASC.withToc([
      { id: "why", nav: "Why " + p.short, html: '<h2 id="why-h">Why ' + e(p.short) + " is in the network</h2>" + '<p class="callout">' + e(p.rationale || p.summary) + "</p>" },
      { id: "stack", nav: "AI stack", html: '<h2 id="stack-h">Instructional and AI stack</h2>' + stack },
      { id: "hosted", nav: "Convenings hosted", html: '<h2 id="hosted-h">Convenings hosted</h2>' + convList },
      {
        id: "feedback",
        nav: "Feedback",
        html:
          '<h2 id="feedback-h">Feedback</h2><div class="grid grid-2">' +
          (hosted.length ? '<a class="card card--link" href="feedback.html?convening=' + e(hosted[hosted.length - 1].id) + '"><div class="card-kicker">As host</div><h3>What attendees said about ' + e(p.short) + "’s convening</h3><span class=\"more\">Open the filtered dashboard</span></a>" : '<div class="card card--outline"><div class="card-kicker">As host</div><h3>No hosted convening yet</h3><p class="muted small">Feedback appears here after ' + e(p.short) + " hosts.</p></div>") +
          '<a class="card card--link" href="feedback.html?org=' + e(p.id) + '"><div class="card-kicker">As attendee</div><h3>How ' + e(p.short) + " staff rated convenings</h3><span class=\"more\">Open the filtered dashboard</span></a>" +
          "</div>"
      }
    ]);
};
