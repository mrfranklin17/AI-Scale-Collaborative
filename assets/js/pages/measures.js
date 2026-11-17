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
      (m.domains ? '<div class="chips" aria-label="Index domains" style="margin-top:var(--sp-3)">' + m.domains.map((d) => '<span class="chip chip--accent">' + e(d) + "</span>").join("") + "</div>" : "") +
      (m.focus ? '<p class="focus-note">' + ASC.icon("users") + "<span>Reported for Black, Latino, and low-income students.</span></p>" : "") +
      track(m) +
      '<dl class="mt-meta"><dt>Data source</dt><dd>' + e(m.source) + "</dd><dt>Cadence</dt><dd>" + e(m.cadence) + "</dd><dt>Targets</dt><dd>" + m.targets.map((t) => t.value + "% by " + t.label).join(" · ") + "</dd></dl></div>"
  }));

  const how = {
    id: "how",
    nav: "How measurement works",
    html:
      '<h2 id="how-h">Three design choices set this measurement apart</h2>' +
      '<div class="grid grid-3" style="margin-bottom:var(--sp-6)">' + ASC.measurementChoices.map((m) => '<div class="card card--tint"><h3>' + e(m.title) + '</h3><p class="muted">' + e(m.text) + "</p></div>").join("") + "</div>" +
      '<div class="callout" style="margin-bottom:var(--sp-6)">Proficiency and AI access are reported for Black, Latino, and low-income students. Under the <a href="about.html#equity">equity guardrail</a>, data by race/ethnicity, special education status and English learner status must show no harm to any subgroup before a tool is scaled.</div>' +
      '<p class="muted small" style="margin-bottom:var(--sp-6)"><b>Year definitions.</b> Year 1 is SY2026–27, Year 2 is SY2027–28 and Year 3 is SY2028–29. Targets match what partners have signed or proposed.</p>' +
      '<p><a class="arrow-link" href="about.html#requirements">How partners assess, document and report ' + ASC.icon("arrow") + "</a></p>"
  };

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Measures" }],
      band: "sun",
      art: "measures-2030",
      artLabel: "2030",
      eyebrow: "Outcome metrics",
      title: "What we will know by 2030",
      lede: "Five outcome measures track whether AI-augmented instruction reaches every student in each CMO network and increases proficiency for Black, Latino, and low-income students.",
      updated: ASC.config.lastUpdated.measures
    }) + ASC.withToc(measureSections.concat([how]));
};
