ASC.render = function () {
  const c = ASC.collaborative;
  const e = ASC.esc;
  const cmos = ASC.partners.filter((p) => p.type === "CMO");
  const ints = ASC.partners.filter((p) => p.type === "Intermediary");
  const completed = ASC.convenings.filter((x) => x.status === "completed").sort((a, b) => b.start.localeCompare(a.start));
  const latest = completed[0];
  const upcoming = ASC.convenings.filter((x) => x.status === "upcoming").sort((a, b) => a.start.localeCompare(b.start))[0];

  const explore = [
    { href: "about.html", icon: "compass", title: "Purpose & Design", text: "The questions the network is built to answer, its tight-loose requirements, and the investment timeline." },
    { href: "partners.html", icon: "users", title: "Partners", text: cmos.length + " CMOs and " + ints.length + " intermediaries across " + new Set(ASC.partners.map((p) => p.region)).size + " regions." },
    { href: "measures.html", icon: "target", title: "Measures", text: "Three outcome metrics — proficiency, AI access and operational diffusion — with Year 2 and Year 3 targets." },
    { href: "convenings.html", icon: "calendar", title: "Convenings", text: "Notes, observations and implementation frictions from each site-based convening." },
    { href: "feedback.html", icon: "chart", title: "Feedback", text: "Survey results by host school and across the network, with open-ended comments." },
    { href: "survey.html", icon: "message", title: "Share feedback", text: "Attended a convening? Take the five-minute post-convening survey." }
  ];

  document.getElementById("main").innerHTML =
    '<section class="hero"><div class="wrap">' +
    '<span class="eyebrow">US Charters · Innovation Portfolio · Launched ' + e(c.launch) + "</span>" +
    "<h1>" + e(c.name) + "</h1>" +
    '<p class="lede">' + e(c.tagline) + "</p>" +
    '<div class="hero-actions"><a class="btn btn-primary" href="about.html">Learn about the collaborative <span style="width:16px;height:16px;display:inline-flex">' + ASC.icon("arrow") + "</span></a>" +
    '<a class="btn btn-ghost" href="convenings.html">See convenings</a></div>' +
    "</div></section>" +

    '<section><div class="wrap"><div class="stats">' +
    '<div class="stat"><div class="v">' + cmos.length + '</div><div class="l">CMO partners</div></div>' +
    '<div class="stat"><div class="v">' + ints.length + '</div><div class="l">Intermediary partners</div></div>' +
    '<div class="stat"><div class="v">' + ASC.measures.length + '</div><div class="l">Outcome measures tracked to 2030</div></div>' +
    '<div class="stat"><div class="v">' + completed.length + '</div><div class="l">Convening' + (completed.length === 1 ? "" : "s") + " held so far</div></div>" +
    "</div></div></section>" +

    '<section class="section"><div class="wrap">' +
    '<div class="grid grid-2" style="align-items:start;gap:40px">' +
    '<div><span class="eyebrow">Why this network</span><h2>Evidence the field can’t get from vendors or isolated pilots</h2></div>' +
    '<div class="prose">' + c.intro.map((p) => "<p>" + e(p) + "</p>").join("") + "</div>" +
    "</div></div></section>" +

    '<section class="section"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Learning agenda</span><h2>Three questions guide the work</h2></div><p>' + e(c.designNote) + "</p></div>" +
    '<div class="grid grid-3">' +
    c.questions.map((q, i) => '<div class="card q-card"><div class="q-num">0' + (i + 1) + "</div><h3>" + e(q.title) + '</h3><p class="muted">' + e(q.text) + "</p></div>").join("") +
    "</div></div></section>" +

    (latest
      ? '<section class="section"><div class="wrap">' +
        '<div class="section-head"><div><span class="eyebrow">Latest convening</span><h2>' + e(latest.title) + "</h2></div>" +
        '<a class="btn btn-ghost" href="convenings.html">All convenings</a></div>' +
        '<a class="card link-card" href="convening.html?id=' + e(latest.id) + '">' +
        '<div class="tags" style="margin-bottom:12px"><span class="tag tag-accent">Convening ' + latest.number + "</span><span class=\"tag\">" + e(latest.dates) + '</span><span class="tag">' + e(latest.location) + "</span></div>" +
        '<p style="font-size:1.06rem;max-width:72ch">' + e(latest.summary) + "</p>" +
        (latest.highlights && latest.highlights.length
          ? '<div class="mini-stats">' + latest.highlights.map((h) => "<div><b>" + e(h.value) + "</b><span>" + e(h.label) + "</span></div>").join("") + "</div>"
          : "") +
        '<span class="more">Read the convening notes →</span></a>' +
        (upcoming ? '<p class="muted small" style="margin-top:14px">Next: ' + e(upcoming.title) + " · " + e(upcoming.dates) + "</p>" : "") +
        "</div></section>"
      : "") +

    '<section class="section"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Explore</span><h2>Everything in one place</h2></div></div>' +
    '<div class="grid grid-3">' +
    explore.map((x) => '<a class="card link-card" href="' + x.href + '"><div class="icon-dot">' + ASC.icon(x.icon) + "</div><h3>" + e(x.title) + '</h3><p class="muted">' + e(x.text) + '</p><span class="more">Open →</span></a>').join("") +
    "</div></div></section>";
};
