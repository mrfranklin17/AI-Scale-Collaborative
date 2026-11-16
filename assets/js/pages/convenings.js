ASC.render = async function () {
  const e = ASC.esc;
  const list = ASC.convenings.slice().sort((a, b) => b.start.localeCompare(a.start));
  let responses = [];
  try { responses = await ASC.store.list(); } catch (err) { /* counts are optional */ }
  const count = (id) => responses.filter((r) => r.convening_id === id).length;

  const card = (c) => {
    const host = ASC.partner(c.host);
    const n = count(c.id);
    return (
      '<a class="card link-card conv-card" href="convening.html?id=' + e(c.id) + '">' +
      '<div class="conv-date"><div class="num">Convening ' + e(c.number) + '</div><div class="d">' + e(c.dates) + '</div><span class="tag' + (c.status === "completed" ? " tag-good" : " tag-accent") + '">' + (c.status === "completed" ? "Completed" : "Upcoming") + "</span></div>" +
      "<div><h3 style=\"font-size:1.3rem\">" + e(c.title) + "</h3>" +
      '<p class="muted small" style="margin-bottom:10px">Hosted by ' + e(host ? host.name : c.host) + " · " + e(c.location) + "</p>" +
      "<p>" + e(c.summary) + "</p>" +
      (c.themes && c.themes.length ? '<div class="tags">' + c.themes.map((t) => '<span class="tag">' + e(t) + "</span>").join("") + "</div>" : "") +
      '<span class="more">' + (c.status === "completed" ? "Read notes" + (n ? " · " + n + " survey response" + (n === 1 ? "" : "s") : "") : "View details") + " →</span></div></a>"
    );
  };

  const rotation = ASC.partners
    .map((p) => {
      const mine = ASC.convenings.filter((c) => c.host === p.id);
      const done = mine.filter((c) => c.status === "completed").length;
      const next = mine.filter((c) => c.status === "upcoming").sort((a, b) => a.start.localeCompare(b.start))[0];
      return (
        "<tr><td><b>" + e(p.name) + '</b><div class="muted small">' + e(p.type) + " · " + e(p.location) + "</div></td>" +
        "<td>" + (mine.filter((c) => c.status === "completed").map((c) => '<a href="convening.html?id=' + e(c.id) + '">' + e(c.dates) + "</a>").join("<br>") || '<span class="muted">—</span>') + "</td>" +
        "<td>" + (next ? e(next.dates) : '<span class="muted">To be scheduled</span>') + "</td>" +
        '<td><div class="host-meter" style="margin:0"><i class="' + (done >= 1 ? "on" : "") + '"></i><i class="' + (done >= 2 ? "on" : "") + '"></i> ' + done + "/2</div></td></tr>"
      );
    })
    .join("");

  document.getElementById("main").innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / Convenings</div>' +
    '<span class="eyebrow">Convenings</span><h1>Structured learning, on site, every quarter</h1>' +
    '<p class="lede">Site-based, rotating, two to three days. Each convening is structured learning, not reporting — notes, observations and implementation frictions from every visit live here, alongside attendee feedback.</p>' +
    '<div class="hero-actions" style="margin-top:24px"><a class="btn btn-primary" href="survey.html">Share feedback on a convening</a><a class="btn btn-ghost" href="feedback.html">See feedback results</a></div>' +
    "</div></section>" +
    '<section class="section"><div class="wrap grid" style="gap:16px">' + list.map(card).join("") + "</div></section>" +
    '<section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Hosting rotation</span><h2>Every partner hosts at least twice</h2></div><p>Progress against the hosting commitment over the investment period.</p></div>' +
    '<div class="card table-wrap" style="padding:8px 16px"><table class="rotation"><thead><tr><th>Partner</th><th>Hosted</th><th>Next</th><th>Commitment</th></tr></thead><tbody>' + rotation + "</tbody></table></div></div></section>";
};
