ASC.render = async function () {
  const e = ASC.esc;
  const list = ASC.convenings.slice().sort((a, b) => a.start.localeCompare(b.start));
  let responses = [];
  try { responses = await ASC.store.list(); } catch (err) { /* counts are optional */ }
  const count = (id) => responses.filter((r) => r.convening_id === id).length;
  const done = (c) => c.status === "completed";

  const item = (c) => {
    const n = count(c.id);
    if (!done(c)) {
      return (
        '<li class="ct-item ct-upcoming"><div class="card card--outline">' +
        '<div class="ct-when">Convening ' + e(c.number) + " · " + e(c.dates) + "</div>" +
        "<h3>" + e(c.host ? c.title : "To be scheduled") + "</h3>" +
        '<p class="muted small" style="margin:0">' + e(c.host ? "Hosted by " + ASC.hostName(c) + " · " + c.location : "Host, dates and agenda to be confirmed.") + "</p>" +
        '<span class="chip chip--outline" style="margin-top:var(--sp-3)">' + (c.status === "upcoming" ? "Scheduled" : "Being scheduled") + "</span></div></li>"
      );
    }
    return (
      '<li class="ct-item"><a class="card card--link" href="convening.html?id=' + e(c.id) + '">' +
      '<div class="ct-when">Convening ' + e(c.number) + " · " + e(c.dates) + "</div>" +
      "<h3>" + e(c.title) + "</h3>" +
      '<p class="muted small">Hosted by ' + e(ASC.hostName(c)) + " · " + e(c.location) + "</p>" +
      "<p>" + e(c.summary) + "</p>" +
      (c.themes && c.themes.length ? '<div class="chips">' + c.themes.map((t) => '<span class="chip">' + e(t) + "</span>").join("") + "</div>" : "") +
      '<span class="more">Read notes' + (n ? " · " + n + " survey response" + (n === 1 ? "" : "s") : "") + " →</span></a></li>"
    );
  };

  const rows = ASC.partners
    .map((p) => {
      const mine = ASC.convenings.filter((c) => c.host === p.id);
      const hosted = mine.filter(done);
      const next = mine.filter((c) => !done(c)).sort((a, b) => a.start.localeCompare(b.start))[0];
      return { p, hosted, next };
    })
    .sort((a, b) => a.hosted.length - b.hosted.length || a.p.name.localeCompare(b.p.name));

  const rotation =
    '<div class="card table-wrap" style="padding:var(--sp-2) var(--sp-4)"><table class="data-table"><caption class="sr-only">Hosting rotation: each partner commits to hosting twice. Sorted with partners who have not hosted yet first.</caption>' +
    '<thead><tr><th scope="col">Partner</th><th scope="col">Hosted</th><th scope="col">Next</th><th scope="col">Commitment</th></tr></thead><tbody>' +
    rows
      .map(({ p, hosted, next }) =>
        "<tr><td><b>" + e(p.name) + '</b><div class="muted small">' + e(p.type) + " · " + e(p.location) + "</div></td>" +
        "<td>" + (hosted.map((c) => '<a href="convening.html?id=' + e(c.id) + '">' + e(c.dates) + "</a>").join("<br>") || '<span class="chip chip--outline">Not yet</span>') + "</td>" +
        "<td>" + (next ? e(next.dates) : '<span class="muted">To be scheduled</span>') + "</td>" +
        '<td><span class="dots2" role="img" aria-label="Hosted ' + hosted.length + ' of 2"><i class="' + (hosted.length >= 1 ? "on" : "") + '"></i><i class="' + (hosted.length >= 2 ? "on" : "") + '"></i></span> <span class="muted small">' + hosted.length + " of 2</span></td></tr>"
      )
      .join("") +
    "</tbody></table></div>";

  const sections = [
    { id: "timeline", nav: "Timeline", html: '<h2 id="timeline-h">Every convening, in order</h2><p style="color:var(--text-2)">Past convenings link to full notes and feedback. Upcoming ones appear as outlines until they are scheduled.</p><ol class="ct">' + list.map(item).join("") + "</ol>" },
    { id: "rotation", nav: "Hosting rotation", html: '<h2 id="rotation-h">Every partner hosts at least twice</h2><p style="color:var(--text-2)">Partners who haven’t hosted yet are listed first.</p>' + rotation }
  ];

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Convenings" }],
      eyebrow: "Convenings",
      title: "Structured learning, on site, every quarter",
      lede: "Site-based, rotating, two to three days. Notes, observations and implementation frictions from every visit live here, alongside attendee feedback.",
      extra: '<div class="actions-row" style="margin-top:var(--sp-6)"><a class="btn btn-primary" href="survey.html">Share feedback on a convening</a><a class="btn btn-secondary" href="feedback.html">See feedback results</a></div>',
      updated: ASC.config.lastUpdated.convenings
    }) + ASC.withToc(sections);
};
