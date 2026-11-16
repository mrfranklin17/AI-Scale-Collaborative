ASC.render = async function () {
  const e = ASC.esc;
  const id = new URLSearchParams(location.search).get("id");
  const c = ASC.convening(id) || ASC.convenings.slice().sort((a, b) => b.start.localeCompare(a.start))[0];
  const main = document.getElementById("main");
  if (!c) {
    main.innerHTML = '<section class="page-hero"><div class="wrap"><h1>Convening not found</h1><p><a href="convenings.html">Back to convenings</a></p></div></section>';
    return;
  }
  document.title = c.title + " · AI Scale Collaborative";
  const host = ASC.partner(c.host);
  const showAnalysis = ASC.config.showFoundationAnalysis !== false;

  const blocks = (list) => (list || []).map(block).join("");
  function block(b) {
    if (b.p) return "<p>" + e(b.p) + "</p>";
    if (b.h) return "<h3>" + e(b.h) + "</h3>";
    if (b.list) return "<ul>" + b.list.map((x) => "<li>" + e(x) + "</li>").join("") + "</ul>";
    if (b.steps) return '<ol class="steps">' + b.steps.map((s) => "<li><div><b>" + e(s.title) + "</b>" + (s.text ? '<div class="muted small">' + e(s.text) + "</div>" : "") + "</div></li>").join("") + "</ol>";
    if (b.stats) return '<div class="mini-stats">' + b.stats.map((s) => "<div><b>" + e(s.value) + "</b><span>" + e(s.label) + "</span></div>").join("") + "</div>";
    if (b.quote) return '<blockquote class="pull">“' + e(b.quote) + "”</blockquote>";
    if (b.insight) return '<p><b>Key insight:</b> ' + e(b.insight) + "</p>";
    if (b.source) return '<p class="source">' + e(b.source) + "</p>";
    if (b.figure) return '<figure class="figure"><img src="' + e(b.figure) + '" alt="' + e(b.alt || "") + '" loading="lazy"><figcaption>' + e(b.caption || "") + " Click to enlarge.</figcaption></figure>";
    if (b.analysis) {
      if (!showAnalysis) return "";
      const a = b.analysis;
      return (
        '<details class="analysis"><summary><span class="lbl">Foundation analysis · Connection to strategy</span>' +
        '<span class="cond">' + e(a.conditions) + '</span><span class="chev" style="width:18px;height:18px;display:inline-flex">' + ASC.icon("chev") + "</span></summary>" +
        '<div class="body">' + (a.tag ? '<p class="small muted" style="margin-bottom:8px">' + e(a.tag) + " · Implementation R&amp;D conditions</p>" : "") + blocks(a.blocks) + "</div></details>"
      );
    }
    return "";
  }

  function frictionCards(notes) {
    return (
      '<div class="friction-grid">' +
      ASC.frictionFramework
        .map((f) => {
          const n = notes[f.id];
          if (!n) return "";
          return (
            '<article class="friction-card"><header><span class="n">' + f.n + "</span><h3>" + e(f.title) + "</h3></header>" +
            '<p class="q">' + e(f.question) + "</p><dl>" +
            n.points.map((p) => "<dt>" + e(p.label) + "</dt><dd>" + e(p.text) + "</dd>").join("") +
            "</dl>" + (n.insight ? '<div class="insight">Key insight: ' + e(n.insight) + "</div>" : "") +
            (n.source ? '<p class="source">Source: ' + e(n.source) + "</p>" : "") + "</article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  const overview =
    '<section class="doc-section" id="overview"><h2>At a glance</h2>' +
    '<p class="lede">' + e(c.summary) + "</p>" +
    (c.highlights && c.highlights.length ? '<div class="mini-stats">' + c.highlights.map((h) => "<div><b>" + e(h.value) + "</b><span>" + e(h.label) + "</span></div>").join("") + "</div>" : "") +
    (c.days && c.days.length
      ? '<h3>Agenda</h3><div class="day-grid">' +
        c.days.map((d) => '<div class="card" style="padding:18px 20px"><span class="tag tag-accent">' + e(d.label) + "</span><h4 style=\"margin:10px 0 0\">" + e(d.date) + " · " + e(d.campus) + "</h4><ul>" + d.items.map((x) => "<li>" + e(x) + "</li>").join("") + "</ul></div>").join("") +
        "</div>"
      : "") +
    "</section>";

  const sections = (c.sections || [])
    .map(
      (s) =>
        '<section class="doc-section" id="' + e(s.id) + '"><h2>' + e(s.title) + "</h2>" +
        (s.lede ? '<p class="lede">' + e(s.lede) + "</p>" : "") +
        blocks(s.blocks) +
        (s.frictionNotes ? frictionCards(s.frictionNotes) : "") +
        "</section>"
    )
    .join("");

  const toc =
    '<nav class="toc" aria-label="On this page"><h4>On this page</h4><a href="#overview">At a glance</a>' +
    (c.sections || []).map((s) => '<a href="#' + e(s.id) + '">' + e(s.nav || s.title) + "</a>").join("") +
    '<a href="#feedback">Attendee feedback</a>' +
    '<div class="toc-cta"><a class="btn btn-primary btn-sm" href="survey.html?convening=' + e(c.id) + '">Take the survey</a></div></nav>';

  const feedback =
    '<section class="doc-section" id="feedback"><h2>Attendee feedback</h2>' +
    '<p>See how attendees rated this convening, session by session, and how it compares with the rest of the network.</p>' +
    '<div class="hero-actions"><a class="btn btn-primary" href="feedback.html?convening=' + e(c.id) + '">View feedback for this convening</a>' +
    '<a class="btn btn-ghost" href="survey.html?convening=' + e(c.id) + '">Take the survey</a></div></section>';

  main.innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / <a href="convenings.html">Convenings</a> / ' + e(host ? host.short : c.title) + "</div>" +
    '<span class="eyebrow">Convening ' + e(c.number) + " · " + e(c.dates) + "</span>" +
    "<h1>" + e(c.title) + "</h1>" +
    '<p class="lede">Hosted by ' + e(host ? host.name : c.host) + " · " + e(c.location) + "</p>" +
    (c.notesBy ? '<p class="muted small" style="margin-top:10px">' + e(c.notesBy) + (showAnalysis ? " · Panels marked “Foundation analysis” are the Foundation team’s reading, not the host’s." : "") + "</p>" : "") +
    "</div></section>" +
    '<div class="wrap detail-layout">' + toc + '<div class="prose">' + overview + sections + feedback + "</div></div>";

  // Highlight current section in the table of contents
  const links = [...document.querySelectorAll(".toc a[href^='#']")];
  const targets = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  targets.forEach((t) => obs.observe(t));
};
