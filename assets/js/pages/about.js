ASC.render = function () {
  const c = ASC.collaborative;
  const e = ASC.esc;
  const inv = c.investment;

  document.getElementById("main").innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / Purpose &amp; Design</div>' +
    '<span class="eyebrow">Purpose &amp; Design</span><h1>A field-learning network, not a controlled experiment</h1>' +
    '<p class="lede">' + e(c.intro[1]) + "</p></div></section>" +

    '<section class="section"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Learning agenda</span><h2>What the network is designed to answer</h2></div></div>' +
    '<div class="grid grid-3">' +
    c.questions.map((q, i) => '<div class="card q-card"><div class="q-num">0' + (i + 1) + "</div><h3>" + e(q.title) + '</h3><p class="muted">' + e(q.text) + "</p></div>").join("") +
    '</div><p class="callout" style="margin-top:20px">' + e(c.designNote) + "</p>" +
    "</div></section>" +

    '<section class="section" id="requirements"><div class="wrap">' +
    '<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:48px;align-items:start" id="req-grid">' +
    '<div style="position:sticky;top:96px"><span class="eyebrow">Network design requirements</span><h2>Tight on entry conditions. Loose where variation teaches.</h2><p class="muted">' + e(c.tightLoose) + "</p></div>" +
    '<div class="card">' +
    c.requirements.map((r, i) => '<div class="req" id="' + e(r.id) + '"><div class="n">' + (i + 1) + "</div><div><h3>" + e(r.title) + "</h3><p>" + e(r.text) + "</p></div></div>").join("") +
    "</div></div></div></section>" +

    '<section class="section" id="investment"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">Investment details</span><h2>Timeline and support</h2></div></div>' +
    '<div class="timeline">' +
    inv.periods.map((p, i) => '<div class="card' + (i ? " ext" : "") + '"><span class="tag' + (i ? "" : " tag-accent") + '">' + e(p.label) + '</span><h3 style="margin-top:12px">' + e(p.dates) + '</h3><p class="muted">' + e(p.detail) + "</p></div>").join("") +
    "</div>" +
    '<div class="grid grid-2" style="margin-top:20px">' +
    '<div class="card"><h3>Investment amount</h3><ul style="margin:8px 0 0;padding-left:1.1em;color:var(--text-2)">' + inv.amount.map((a) => "<li>" + e(a) + "</li>").join("") + "</ul></div>" +
    '<div class="card"><h3>Research</h3><p class="muted">' + e(inv.research) + "</p></div>" +
    "</div></div></section>" +

    '<section class="section"><div class="wrap">' +
    '<div class="section-head"><div><span class="eyebrow">How we learn from convenings</span><h2>Where do we look when implementation breaks down?</h2></div>' +
    '<p>Four friction points organize what we gather and share from each site visit.</p></div>' +
    '<div class="fw-grid">' +
    ASC.frictionFramework.map((f) => '<div class="card"><span class="tag tag-accent">' + f.n + "</span><h3 style=\"margin-top:12px\">" + e(f.title) + '</h3><p class="muted" style="font-style:italic;margin:0">' + e(f.question) + "</p><ul>" + f.insights.map((x) => "<li>" + e(x) + "</li>").join("") + "</ul></div>").join("") +
    "</div>" +
    '<figure class="figure"><img src="assets/img/friction-framework.webp" alt="The Implementation R&amp;D friction framework: product, configuration, coherence and practice friction points, with the insights each aims to share." loading="lazy"><figcaption>Implementation R&amp;D friction framework. Click to enlarge.</figcaption></figure>' +
    "</div></section>";

  const g = document.getElementById("req-grid");
  const mq = window.matchMedia("(max-width: 860px)");
  const fit = () => {
    g.style.gridTemplateColumns = mq.matches ? "1fr" : "minmax(0,1fr) minmax(0,1.6fr)";
    g.firstElementChild.style.position = mq.matches ? "static" : "sticky";
  };
  mq.addEventListener("change", fit);
  fit();
};
