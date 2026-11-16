ASC.render = function () {
  const e = ASC.esc;
  const params = new URLSearchParams(location.search);
  let type = ["CMO", "Intermediary"].includes(params.get("type")) ? params.get("type") : "all";
  const hosted = (id) => ASC.convenings.filter((c) => c.host === id && c.status === "completed").length;

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
            const lx = left ? x - 14 - (ps.length - 1) * 16 : x + 14 + (ps.length - 1) * 16;
            const ly = y + 5 + (i - (ps.length - 1) / 2) * 22;
            return (
              '<a href="partner.html?id=' + e(p.id) + '" class="pin pin--' + (p.type === "CMO" ? "cmo" : "int") + '" data-type="' + e(p.type) + '">' +
              // one dot per partner (in its type color); co-located partners sit side by side
              '<circle cx="' + (x + (left ? -1 : 1) * i * 16).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="8"/>' +
              '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + (left ? "end" : "start") + '">' + e(p.short) + (p.mapLabel ? " (" + e(p.mapLabel) + ")" : "") + "</text></a>"
            );
          })
          .join("");
      })
      .join("");
    const alt = "Map of partner locations: " + ASC.partners.map((p) => p.name + ", " + p.location).join("; ") + ".";
    return (
      '<figure class="usmap card"><svg viewBox="0 0 ' + m.w + " " + m.h + '" role="group" aria-label="' + e(alt) + '">' +
      '<g aria-hidden="true"><path d="' + m.nation + '" class="us-nation"/><path d="' + m.borders + '" class="us-borders"/></g>' + pins + "</svg>" +
      '<figcaption><span><i class="pin-key pin-key--cmo"></i>CMO</span><span><i class="pin-key pin-key--int"></i>Intermediary</span><span class="muted">Pins for Gem Prep and Excellent Schools WA mark the state; select a name for the profile.</span></figcaption></figure>'
    );
  }

  const card = (p) => {
    const n = hosted(p.id);
    const facts = [p.schools ? p.schools + " schools" : null, p.students ? Number(p.students).toLocaleString() + " students" : null].filter(Boolean).join(" · ");
    return (
      '<a class="card card--link partner-card" href="partner.html?id=' + e(p.id) + '" data-type="' + e(p.type) + '">' +
      '<div class="card-media">' + ASC.art(p.id, { ratio: 0.5625, label: ASC.initials(p.name), labelSize: 72 }) + "</div>" +
      '<div class="pc-top"><div><h3>' + e(p.name) + '</h3><div class="chips"><span class="chip' + (p.type === "CMO" ? " chip--accent" : "") + '">' + e(p.type) + '</span><span class="chip chip--outline">' + e(p.region) + "</span></div></div></div>" +
      '<p class="pc-loc muted small">' + ASC.icon("pin") + e(p.location) + (facts ? " · " + e(facts) : "") + "</p>" +
      '<p class="pc-stack"><b>AI stack:</b> ' + (p.stack ? e(p.stack.summary) : '<span class="muted">Stack documentation due at onboarding</span>') + "</p>" +
      '<div class="pc-host"><span class="dots2" role="img" aria-label="Hosted ' + n + ' of 2 convenings"><i class="' + (n >= 1 ? "on" : "") + '"></i><i class="' + (n >= 2 ? "on" : "") + '"></i></span><span class="small muted">Hosted ' + n + " of 2</span></div>" +
      '<span class="more">View profile →</span></a>'
    );
  };

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Partners" }],
      band: "sage",
      art: "partners",
      eyebrow: "Partners",
      title: "Four CMOs and two intermediaries",
      lede: "High-readiness organizations already implementing AI-augmented instruction, across different geographies, student populations and instructional models. Each commits to hosting the collaborative at least twice.",
      updated: ASC.config.lastUpdated.partners
    }) +
    '<div class="wrap">' + map() +
    '<div class="partner-filter chips" role="group" aria-label="Filter partners by type">' +
    ["all", "CMO", "Intermediary"].map((t) => '<button type="button" class="chip" data-type="' + t + '" aria-pressed="' + (type === t) + '">' + (t === "all" ? "All partners" : t === "CMO" ? "CMOs" : "Intermediaries") + " (" + (t === "all" ? ASC.partners.length : ASC.partners.filter((p) => p.type === t).length) + ")</button>").join("") +
    '</div><div class="grid grid-3" id="partner-grid">' + ASC.partners.map(card).join("") + "</div>" +
    '<div class="card card--tint" style="margin-top:var(--sp-8)"><h3>What every partner commits to</h3><p class="muted">A shared Similar Schools assessment approach with disaggregated subgroup reporting, quarterly stack documentation, the do-no-harm equity guardrail, vendor outcome-data transparency, family disclosure, human-centered implementation, quarterly convenings and Innovation Index participation.</p><a href="about.html#requirements">Read the full network requirements →</a></div>' +
    "</div>";

  function apply() {
    document.querySelectorAll(".partner-filter [data-type]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.type === type)));
    document.querySelectorAll("#partner-grid [data-type]").forEach((c) => (c.hidden = type !== "all" && c.dataset.type !== type));
    document.querySelectorAll(".usmap .pin").forEach((pn) => pn.classList.toggle("dim", type !== "all" && pn.dataset.type !== type));
  }
  document.querySelectorAll(".partner-filter [data-type]").forEach((b) =>
    b.addEventListener("click", () => {
      type = b.dataset.type;
      history.replaceState(null, "", location.pathname + (type === "all" ? "" : "?type=" + type));
      apply();
    })
  );
  apply();
};
