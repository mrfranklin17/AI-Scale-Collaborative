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
        '<p class="statement" style="font-size:clamp(1.4rem,2.6vw,2rem)">' + e(c.theoryOfChange) + "</p>"
    },
    {
      id: "requirements",
      nav: "Partner commitments",
      html:
        '<h2 id="requirements-h">Commitments every partner makes</h2>' +
        '<p style="color:var(--text-2);max-width:68ch">' + e(c.commitmentsIntro) + "</p>" +
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
    }
  ];

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Purpose & Design" }],
      band: "sky",
      art: "about-purpose",
      eyebrow: "Purpose & Design",
      title: "How the Collaborative works",
      lede: e(c.intro[0]) + " " + e(c.intro[1]),
      updated: ASC.config.lastUpdated.about
    }) + ASC.withToc(sections);
};
