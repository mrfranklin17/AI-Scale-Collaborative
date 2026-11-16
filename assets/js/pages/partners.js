ASC.render = function () {
  const e = ASC.esc;
  const hosted = (id) => ASC.convenings.filter((c) => c.host === id && c.status === "completed").length;
  const card = (p) => {
    const n = hosted(p.id);
    const convs = ASC.convenings.filter((c) => c.host === p.id);
    return (
      '<div class="card partner-card">' +
      '<div class="avatar' + (p.type === "Intermediary" ? " int" : "") + '">' + e(ASC.initials(p.name)) + "</div>" +
      "<h3>" + e(p.name) + "</h3>" +
      '<div class="loc"><span style="width:15px;height:15px;display:inline-flex">' + ASC.icon("pin") + "</span>" + e(p.location) + "</div>" +
      '<p class="muted">' + e(p.summary) + "</p>" +
      (convs.length ? '<p class="small">' + convs.map((c) => '<a href="convening.html?id=' + e(c.id) + '">' + e(c.title) + "</a> · " + e(c.dates)).join("<br>") + "</p>" : "") +
      '<div class="host-meter" title="Each partner commits to hosting at least twice"><i class="' + (n >= 1 ? "on" : "") + '"></i><i class="' + (n >= 2 ? "on" : "") + '"></i> Hosted ' + n + " of 2 commitments</div>" +
      "</div>"
    );
  };
  const cmos = ASC.partners.filter((p) => p.type === "CMO");
  const ints = ASC.partners.filter((p) => p.type === "Intermediary");

  document.getElementById("main").innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / Partners</div>' +
    '<span class="eyebrow">Partners</span><h1>Four CMOs and two intermediaries</h1>' +
    '<p class="lede">High-readiness organizations already implementing AI-augmented instruction, spanning different geographies, student populations and instructional models. Each partner commits to hosting the collaborative on-site at least twice during the investment period.</p>' +
    "</div></section>" +
    '<section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">CMO partners</span><h2>Charter management organizations</h2></div></div>' +
    '<div class="grid grid-2">' + cmos.map(card).join("") + "</div></div></section>" +
    '<section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Intermediary partners</span><h2>Intermediaries supporting single-site schools</h2></div></div>' +
    '<div class="grid grid-2">' + ints.map(card).join("") + "</div></div></section>" +
    '<section class="section"><div class="wrap"><div class="card"><h3>What every partner commits to</h3>' +
    '<p class="muted">A shared Similar Schools assessment approach with disaggregated subgroup reporting, quarterly stack documentation, the do-no-harm equity guardrail, vendor outcome-data transparency, family disclosure, human-centered implementation, quarterly convenings and Innovation Index participation.</p>' +
    '<a href="about.html#requirements">Read the full network requirements →</a></div></div></section>';
};
