/*
 * Foundation analysis page (foundation.html).
 *
 * IMPORTANT: this is NOT access control. The page is simply left out of the
 * site navigation and marked noindex; anyone who has or guesses the URL can
 * open it, and the analysis text also ships in data/convenings.js, which is
 * public. Before any sensitive content goes live, put the site (or this page
 * and its data) behind real authentication — e.g. Vercel Password Protection,
 * Vercel Authentication for team members, or an identity provider — and move
 * the analysis text out of the public data file.
 */
ASC.render = function () {
  const e = ASC.esc;
  const convs = ASC.completedConvenings().slice().reverse();
  const sections = convs
    .map((c) => ({ c, items: ASC.collectAnalysis(c) }))
    .filter((x) => x.items.length)
    .map(({ c, items }) => ({
      id: c.id,
      nav: c.title,
      html:
        '<h2 id="' + e(c.id) + '-h">' + e(c.title) + "</h2>" +
        '<p class="muted">' + e(c.dates) + " · " + items.length + ' analysis notes · <a href="convening.html?id=' + e(c.id) + '">Public convening page</a></p>' +
        items.map((it) => '<div class="card" style="margin-top:var(--sp-4)"><div class="card-kicker">' + e(it.section) + (it.heading !== it.section ? " · " + e(it.heading) : "") + "</div>" + ASC.renderBlocks([{ analysis: it.analysis }], { analysis: "show" }) + "</div>").join("")
    }));

  document.getElementById("main").innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Foundation analysis" }],
      band: "sage",
      art: false,
      eyebrow: "Foundation team",
      title: "Connections to strategy",
      lede: "The Foundation team’s reading of each convening against the Charter Scale implementation conditions. This page is not linked from the public site."
    }) +
    '<div class="wrap"><div class="notice notice--sample" role="note" style="margin-bottom:var(--sp-8)">' + ASC.icon("info") +
    "<div><b>Not access-controlled.</b> Anyone with this link can open it. Add real authentication before sharing sensitive analysis.</div></div></div>" +
    (sections.length ? ASC.withToc(sections) : '<div class="wrap"><p class="muted">No analysis notes yet.</p></div>');
};
