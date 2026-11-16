ASC.render = function () {
  const e = ASC.esc;
  const req = (id) => ASC.collaborative.requirements.find((r) => r.id === id);

  document.getElementById("main").innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / Measures</div>' +
    '<span class="eyebrow">Outcome metrics</span><h1>What we will know by 2030</h1>' +
    '<p class="lede">Three outcome measures track whether AI-augmented instruction is reaching students and moving proficiency — always disaggregated by focus population.</p>' +
    "</div></section>" +

    '<section class="section"><div class="wrap grid" style="gap:20px">' +
    ASC.measures
      .map(
        (m, i) =>
          '<div class="card measure" id="' + e(m.id) + '">' +
          '<div><span class="tag tag-accent">Measure ' + (i + 1) + "</span>" +
          '<h2 style="font-size:1.5rem;margin-top:12px">' + e(m.title) + "</h2>" +
          '<p class="muted" style="margin:0">' + e(m.definition) + "</p>" +
          "<dl><dt>Data source</dt><dd>" + e(m.source) + "</dd><dt>Cadence</dt><dd>" + e(m.cadence) + "</dd></dl></div>" +
          '<div class="target-bars" role="img" aria-label="' + e(m.title + " targets: " + m.targets.map((t) => t.label + " " + t.value + "%").join(", ")) + '">' +
          m.targets
            .map(
              (t, j) =>
                '<div class="target-row' + (j ? " y3" : "") + '"><div class="top"><span>Target · ' + e(t.label) + "</span><b>" + t.value + '%</b></div><div class="track"><div class="fill" style="width:' + t.value + '%"></div></div></div>'
            )
            .join("") +
          '<p class="muted small" style="margin:4px 0 0">Progress data will appear here as partners report.</p>' +
          "</div></div>"
      )
      .join("") +
    "</div></section>" +

    '<section class="section"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">How measurement works</span><h2>The conditions behind the numbers</h2></div></div>' +
    '<div class="grid grid-3">' +
    ["assessment", "equity", "vendor"].map((id) => { const r = req(id); return '<div class="card"><h3>' + e(r.title) + '</h3><p class="muted">' + e(r.text) + "</p></div>"; }).join("") +
    "</div>" +
    '<div class="grid grid-2" style="margin-top:20px">' +
    ["stack", "index"].map((id) => { const r = req(id); return '<div class="card"><h3>' + e(r.title) + '</h3><p class="muted">' + e(r.text) + "</p></div>"; }).join("") +
    "</div></div></section>";
};
