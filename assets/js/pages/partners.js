ASC.render = function () {
  const e = ASC.esc;

  /* ---- map ---- */
  function map() {
    const m = ASC.usMap;
    if (!m) return "";
    // group partners sharing a location so their labels stack
    const groups = {};
    ASC.partners.forEach((p) => {
      if (p.lat == null) return;
      const k = p.lat + "," + p.lon;
      (groups[k] = groups[k] || []).push(p);
    });
    const pins = Object.values(groups)
      .map((ps) => {
        const [x, y] = ASC.usProject(ps[0].lon, ps[0].lat);
        const left = x > 760;
        return ps
          .map((p, i) => {
            const bw = 112, bh = 48;
            const bx = left ? x - 14 - bw : x + 14, by = y - bh / 2 + i * (bh + 8);
            const ly = by + bh + 18;
            return (
              '<a href="partner.html?id=' + e(p.id) + '" class="pin">' +
              '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="7"/>' +
              '<rect class="pin-badge" x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + bw + '" height="' + bh + '" rx="8"/>' +
              (p.logoMark ? '<image href="' + e(p.logoMark) + '" x="' + (bx + 8).toFixed(1) + '" y="' + (by + 6).toFixed(1) + '" width="' + (bw - 16) + '" height="' + (bh - 12) + '" preserveAspectRatio="xMidYMid meet"/>' : "") +
              '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle">' + e(p.short) + (p.mapLabel ? " (" + e(p.mapLabel) + ")" : "") + "</text></a>"
            );
          })
          .join("");
      })
      .join("");
    const alt = "Map of partner locations: " + ASC.partners.map((p) => p.name + ", " + p.location).join("; ") + ".";
    return (
      '<figure class="usmap card"><svg viewBox="0 0 ' + m.w + " " + m.h + '" role="group" aria-label="' + e(alt) + '">' +
      '<g aria-hidden="true"><path d="' + m.nation + '" class="us-nation"/><path d="' + m.borders + '" class="us-borders"/></g>' + pins + "</svg>" +
      '<figcaption><span class="muted">Gem Prep’s pin marks its campuses across southern and eastern Idaho. Select a logo for the profile.</span></figcaption></figure>'
    );
  }

  const card = (p) => {
    const h = ASC.hostingText(p);
    const facts = p.cardLine || "";
    return (
      '<a class="card card--link partner-card" href="partner.html?id=' + e(p.id) + '">' +
      ASC.logoPlate(p, "card-logo") +
      '<div class="pc-top"><div><h3>' + e(p.name) + '</h3><div class="chips"><span class="chip chip--outline">' + e(p.region) + "</span></div></div></div>" +
      '<p class="pc-loc muted small">' + ASC.icon("pin") + e(p.location) + "</p>" + (facts ? '<p class="pc-facts">' + e(facts) + "</p>" : "") +
      (p.rationale ? '<p class="pc-why">' + e(p.rationale) + "</p>" : "") +
      '<p class="pc-stack"><b>AI stack:</b> ' + (p.stack ? e(p.stack.summary) : '<span class="muted">Stack documentation due at onboarding</span>') + "</p>" +
      '<p class="pc-host"><span class="host-dot' + (h.hosted ? " on" : "") + '" aria-hidden="true"></span>' + e(h.text) + "</p>" +
      '<span class="more">View profile</span></a>'
    );
  };

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Partners" }],
      band: "sage",
      art: "partners",
      eyebrow: "Partners",
      title: "Four CMO partners",
      lede: "High-readiness charter networks already implementing AI-augmented instruction, across different geographies, student populations and instructional models. Each hosts the Collaborative on-site at least twice.",
      updated: ASC.config.lastUpdated.partners
    }) +
    '<div class="wrap page-body">' + map() +
    '<div class="grid grid-2" id="partner-grid">' + ASC.partners.map(card).join("") + "</div>" +
    '<div class="card card--tint" style="margin-top:var(--sp-8)"><h3>What every partner commits to</h3><p class="muted">A shared Similar Schools assessment approach with disaggregated subgroup reporting, quarterly stack documentation, the do-no-harm equity guardrail, vendor outcome-data transparency, family disclosure, human-centered implementation, quarterly convenings and Innovation Index participation. Each CMO receives $300K a year under a two-year grant, with potential renewal for Years 3–4.</p><p class="muted small">Partner facts come from each organization’s website (November 2026).</p><a href="about.html#requirements">Read the full network requirements →</a></div>' +
    "</div>";
};
