ASC.render = function () {
  const c = ASC.collaborative;
  const e = ASC.esc;
  const inv = c.investment;

  const sections = [
    {
      id: "questions",
      nav: "Learning agenda",
      html:
        '<h2 id="questions-h">Three questions the network is built to answer</h2>' +
        '<div class="grid grid-3" style="margin-top:var(--sp-5)">' +
        c.questions.map((q, i) => '<div class="card"><div class="q-num" aria-hidden="true">0' + (i + 1) + "</div><h3>" + e(q.title) + '</h3><p class="muted">' + e(q.text) + "</p></div>").join("") +
        '</div><p class="callout" style="margin-top:var(--sp-5)">' + e(c.designNote) + "</p>"
    },
    {
      id: "requirements",
      nav: "Network requirements",
      html:
        '<h2 id="requirements-h">Tight on entry conditions, loose where variation teaches</h2>' +
        '<p style="color:var(--text-2);max-width:68ch">' + e(c.tightLoose) + "</p>" +
        '<div class="card">' +
        c.requirements.map((r, i) => '<div class="req" id="' + e(r.id) + '"><div class="n" aria-hidden="true">' + (i + 1) + "</div><div><h3>" + e(r.title) + "</h3><p>" + e(r.text) + "</p></div></div>").join("") +
        "</div>"
    },
    {
      id: "investment",
      nav: "Investment",
      html:
        '<h2 id="investment-h">A two-year investment with a path to 2030</h2>' +
        '<div class="timeline" style="margin-top:var(--sp-5)">' +
        inv.periods.map((p, i) => '<div class="card' + (i ? " card--outline" : "") + '"><span class="chip' + (i ? " chip--outline" : " chip--accent") + '">' + e(p.label) + '</span><h3 style="margin-top:var(--sp-3)">' + e(p.dates) + '</h3><p class="muted">' + e(p.detail) + "</p></div>").join("") +
        "</div>" +
        '<div class="grid grid-2" style="margin-top:var(--sp-5)">' +
        '<div class="card"><h3>Investment amount</h3><ul style="margin:var(--sp-2) 0 0;padding-left:1.1em;color:var(--text-2)">' + inv.amount.map((a) => "<li>" + e(a) + "</li>").join("") + "</ul></div>" +
        '<div class="card"><h3>Research</h3><p class="muted">' + e(inv.research) + "</p></div></div>"
    },
    {
      id: "frictions",
      nav: "Friction framework",
      html:
        '<h2 id="frictions-h">Four places to look when implementation breaks down</h2>' +
        '<p style="color:var(--text-2);max-width:68ch">Every convening’s observations are organized against the same four friction points, each with its own color across the site.</p>' +
        '<div class="grid grid-2" style="margin-top:var(--sp-5)">' +
        ASC.frictionFramework.map((f) => '<div class="card"><span class="chip chip--fr chip--' + f.id + '">' + f.n + ". " + e(f.title) + '</span><p style="font-style:italic;margin:var(--sp-3) 0 var(--sp-2)">' + e(f.question) + '</p><ul style="margin:0;padding-left:1.1em;color:var(--text-2);font-size:var(--fs-sm)">' + f.insights.map((x) => "<li>" + e(x) + "</li>").join("") + "</ul></div>").join("") +
        "</div>" +
        '<figure class="figure" style="margin-top:var(--sp-6)"><img src="assets/img/friction-framework.webp" alt="The Implementation R&amp;D friction framework: product, configuration, coherence and practice friction points, with the insights each aims to share." loading="lazy"><figcaption class="muted small" style="margin-top:var(--sp-2)">Implementation R&amp;D friction framework. Select to enlarge.</figcaption></figure>'
    }
  ];

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Purpose & Design" }],
      band: "sky",
      art: "about-purpose",
      eyebrow: "Purpose & Design",
      title: "A field-learning network, not a controlled experiment",
      lede: e(c.intro[1]),
      updated: ASC.config.lastUpdated.about
    }) + ASC.withToc(sections);
};
