ASC.render = function () {
  const c = ASC.collaborative;
  const e = ASC.esc;
  const inv = c.investment;

  const sections = [
    {
      id: "focus",
      nav: "Who we focus on",
      html:
        '<h2 id="focus-h">Raising proficiency for the students the system has underserved</h2>' +
        '<p style="color:var(--text-2);max-width:68ch">The network’s central outcome is increased proficiency in Math and ELA for three focus populations, measured against comparable schools with a Similar Schools methodology.</p>' +
        '<div class="grid grid-3" style="margin-top:var(--sp-6)">' +
        c.focusPopulations.map((f, i) => '<div class="card focus-card focus-card--' + i + '"><div class="q-num" aria-hidden="true">0' + (i + 1) + "</div><h3>" + e(f) + "</h3></div>").join("") +
        "</div>" +
        '<p class="muted small" style="margin-top:var(--sp-5)">Separately, the <a href="#equity">equity guardrail</a> requires data disaggregated by race/ethnicity, special education status and English learner status to show no harm to any subgroup before a tool is scaled.</p>'
    },
    {
      id: "questions",
      nav: "Learning agenda",
      html:
        '<h2 id="questions-h">Three questions the network is built to answer</h2>' +
        '<div class="grid grid-3" style="margin-top:var(--sp-5)">' +
        c.questions.map((q, i) => '<div class="card"><div class="q-num" aria-hidden="true">0' + (i + 1) + "</div><h3>" + e(q.title) + '</h3><p class="muted">' + e(q.text) + "</p></div>").join("") +
        '</div><p class="callout" style="margin-top:var(--sp-6)">' + e(c.designNote) + "</p>"
    },
    {
      id: "theory",
      nav: "Theory of change",
      html:
        '<h2 id="theory-h">Theory of change</h2>' +
        '<p class="statement" style="font-size:clamp(1.4rem,2.6vw,2rem)">' + e(c.theoryOfChange) + "</p>" +
        '<p style="color:var(--text-2);max-width:68ch;margin-top:var(--sp-6)">' + e(c.smallNetwork) + "</p>"
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
      id: "backbone",
      nav: "AI for Equity",
      html:
        '<h2 id="backbone-h">AI for Equity: the measurement backbone</h2>' +
        '<div class="card card--tint"><p style="font-size:var(--fs-md);color:var(--text)">' + e(c.aiForEquity) + "</p>" +
        '<a class="arrow-link" href="measures.html#index">The Innovation Index measure ' + ASC.icon("arrow") + "</a></div>"
    },
    {
      id: "investment",
      nav: "Investment",
      html:
        '<h2 id="investment-h">Two-year grants, with a path to 2030</h2>' +
        '<div class="timeline" style="margin-top:var(--sp-5)">' +
        inv.periods.map((p, i) => '<div class="card' + (i ? " card--outline" : "") + '"><span class="chip' + (i ? " chip--outline" : " chip--accent") + '">' + e(p.label) + '</span><h3 style="margin-top:var(--sp-3)">' + e(p.dates) + '</h3><p class="muted">' + e(p.detail) + "</p></div>").join("") +
        "</div>" +
        '<div class="grid grid-2" style="margin-top:var(--sp-5)">' +
        '<div class="card"><h3>Investment</h3><ul style="margin:var(--sp-2) 0 0;padding-left:1.1em;color:var(--text-2)">' + inv.amount.map((a) => "<li>" + e(a) + "</li>").join("") + "</ul></div>" +
        '<div class="card"><h3>Evidence standard</h3><p class="muted">' + e(inv.evidence) + "</p></div></div>"
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
      title: "The field-learning engine of the AI Innovation strategy",
      lede: e(c.intro[0]) + " " + e(c.intro[1]),
      updated: ASC.config.lastUpdated.about
    }) + ASC.withToc(sections);
};
