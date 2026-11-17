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
        '<span class="chip chip--outline" style="margin-top:var(--sp-3)">' + e(c.statusNote || (c.status === "upcoming" ? "Scheduled" : "Being scheduled")) + "</span></div></li>"
      );
    }
    return (
      '<li class="ct-item"><a class="card card--link ct-card" href="convening.html?id=' + e(c.id) + '"><div class="ct-media">' + ASC.art(c.id, { label: "0" + c.number, labelSize: 96 }) + "</div><div>" +
      '<div class="ct-when">Convening ' + e(c.number) + " · " + e(c.dates) + "</div>" +
      "<h3>" + e(c.title) + "</h3>" +
      '<p class="muted small">Hosted by ' + e(ASC.hostName(c)) + " · " + e(c.location) + "</p>" +
      "<p>" + e(c.summary) + "</p>" +
      (c.themes && c.themes.length ? '<div class="chips">' + c.themes.map((t) => '<span class="chip">' + e(t) + "</span>").join("") + "</div>" : "") +
      '<span class="more">Read notes' + (n ? " · " + n + " survey response" + (n === 1 ? "" : "s") : "") + "</span></div></a></li>"
    );
  };

  const rows = ASC.partners
    .map((p) => ({ p, h: ASC.hostingText(p) }))
    .sort((a, b) => a.h.convenings.length - b.h.convenings.length || a.p.name.localeCompare(b.p.name));

  const rotation =
    '<div class="card table-wrap" tabindex="0" role="region" aria-label="Hosting rotation" style="padding:var(--sp-2) var(--sp-4)"><table class="data-table"><caption class="sr-only">Hosting rotation: each CMO hosts the Collaborative at least twice.</caption>' +
    '<thead><tr><th scope="col">Partner</th><th scope="col">Hosting</th></tr></thead><tbody>' +
    rows.map(({ p, h }) =>
      '<tr><th scope="row"><span class="rot-partner">' + (p.logoMark ? '<img src="' + e(p.logoMark) + '" alt="" width="28" height="28">' : "") + "<span><b>" + e(p.name) + '</b><span class="muted small" style="display:block">' + e(p.location) + "</span></span></span></th>" +
      '<td style="white-space:normal">' + h.convenings.map((c) => '<a href="convening.html?id=' + e(c.id) + '">Hosted ' + e(c.dates) + "</a>").concat(h.text.split(" · ").filter((t) => !t.startsWith("Hosted ")).map((t) => e(t))).join("<br>") + "</td></tr>"
    ).join("") +
    "</tbody></table></div>";

  const sections = [
    { id: "timeline", nav: "Timeline", html: '<h2 id="timeline-h">Every convening, in order</h2><p style="color:var(--text-2)">Past convenings link to full notes and feedback. Upcoming ones appear as outlines until they are scheduled.</p><ol class="ct">' + list.map(item).join("") + "</ol>" },
    { id: "rotation", nav: "Hosting rotation", html: '<h2 id="rotation-h">Every CMO hosts at least twice</h2><p style="color:var(--text-2)">When each partner has hosted, or is scheduled to host, the Collaborative.</p>' + rotation }
  ];

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Convenings" }],
      band: "plum",
      art: "convenings",
      eyebrow: "Convenings",
      title: "Structured learning, on site, every fall and spring",
      lede: "Two convenings a year — one in the fall, one in the spring — each hosted on site by a rotating CMO partner for two to three days. Notes, observations and attendee feedback from every visit live here.",
      extra: '<div class="actions-row" style="margin-top:var(--sp-8)"><a class="btn btn-light" href="survey.html">Share feedback on a convening</a><a class="btn btn-outline-light" href="feedback.html">See feedback results</a></div>',
      updated: ASC.config.lastUpdated.convenings
    }) + ASC.withToc(sections);
};
