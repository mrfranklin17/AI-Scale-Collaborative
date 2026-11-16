ASC.render = function () {
  const e = ASC.esc;
  const req = (id) => ASC.collaborative.requirements.find((r) => r.id === id);

  // Progress track: 0–100% with the current value as a filled bar and each target as a marker.
  function track(m) {
    const has = typeof m.current === "number";
    const markers = m.targets
      .map((t) => '<div class="mt-marker" style="left:' + t.value + '%"><span class="mt-label">' + e(t.label) + "<b>" + t.value + "%</b></span></div>")
      .join("");
    const desc = m.title + ": " + (has ? "current " + m.current + "%. " : "no data reported yet. ") + m.targets.map((t) => t.label + " target " + t.value + "%").join(", ") + ".";
    return (
      '<div class="mt" role="img" aria-label="' + e(desc) + '">' +
      '<div class="mt-bar">' + (has ? '<div class="mt-fill" style="width:' + m.current + '%"></div>' : "") + markers + "</div>" +
      '<div class="mt-axis" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>' +
      "</div>" +
      (has
        ? '<p class="mt-current"><b>' + m.current + "%</b> current · " + e(m.cadence.toLowerCase()) + " reporting</p>"
        : '<div class="empty-state" style="margin-top:var(--sp-5);padding:var(--sp-5)"><div class="icon-dot">' + ASC.icon("calendar") + "</div><h3>No data reported yet</h3><p>First report: " + e(m.firstReport) + "</p></div>")
    );
  }

  const measureSections = ASC.measures.map((m, i) => ({
    id: m.id,
    nav: m.title.replace(/\s*\(.*\)/, ""),
    html:
      '<div class="card"><span class="chip chip--accent">Measure ' + (i + 1) + " · " + e(m.cadence) + "</span>" +
      '<h2 id="' + e(m.id) + '-h" style="font-size:var(--fs-lg);margin-top:var(--sp-3)">' + e(m.title) + "</h2>" +
      '<p class="muted" style="max-width:70ch">' + e(m.definition) + "</p>" +
      track(m) +
      '<dl class="mt-meta"><dt>Data source</dt><dd>' + e(m.source) + "</dd><dt>Cadence</dt><dd>" + e(m.cadence) + "</dd><dt>Targets</dt><dd>" + m.targets.map((t) => t.value + "% by " + t.label).join(" · ") + "</dd></dl></div>"
  }));

  const how = {
    id: "how",
    nav: "How measurement works",
    html:
      '<h2 id="how-h">Every number is disaggregated</h2>' +
      '<div class="callout" style="margin-bottom:var(--sp-5)"><b>Disaggregation.</b> Proficiency and AI access are reported by race/ethnicity, special education status and English learner status. Under the <a href="about.html#equity">equity guardrail</a>, no tool or model is scaled within a network school until subgroup data shows no harm.</div>' +
      '<div class="grid grid-2">' +
      ["assessment", "equity", "vendor", "stack"].map((id) => { const r = req(id); return '<div class="card"><h3>' + e(r.title) + '</h3><p class="muted">' + e(r.text) + "</p></div>"; }).join("") +
      "</div>"
  };

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Measures" }],
      eyebrow: "Outcome metrics",
      title: "What we will know by 2030",
      lede: "Three outcome measures track whether AI-augmented instruction is reaching students and moving proficiency — always disaggregated by focus population.",
      updated: ASC.config.lastUpdated.measures
    }) + ASC.withToc(measureSections.concat([how]));
};
