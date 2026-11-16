/* Renders the content blocks used in data/convenings.js (see the comment at the top of that file). */
(function () {
  const ASC = window.ASC;
  const e = (s) => ASC.esc(s);

  // opts.analysis: "omit" (default, public pages) | "show" (foundation page)
  ASC.renderBlocks = function (list, opts) {
    opts = opts || {};
    return (list || []).map((b) => block(b, opts)).join("");
  };

  function block(b, opts) {
    if (b.p) return "<p>" + e(b.p) + "</p>";
    if (b.h) return "<h3>" + e(b.h) + "</h3>";
    if (b.list) return "<ul>" + b.list.map((x) => "<li>" + e(x) + "</li>").join("") + "</ul>";
    if (b.steps) return '<ol class="steps">' + b.steps.map((s) => "<li><div><b>" + e(s.title) + "</b>" + (s.text ? '<div class="muted small">' + e(s.text) + "</div>" : "") + "</div></li>").join("") + "</ol>";
    if (b.stats) return '<div class="mini-stats">' + b.stats.map((s) => "<div><b>" + e(s.value) + "</b><span>" + e(s.label) + "</span></div>").join("") + "</div>";
    if (b.quote) return '<blockquote class="pull">“' + e(b.quote) + "”</blockquote>";
    if (b.insight) return "<p><b>Key insight:</b> " + e(b.insight) + "</p>";
    if (b.source) return '<p class="source">' + e(b.source) + "</p>";
    if (b.figure) return '<figure class="figure"><img src="' + e(b.figure) + '" alt="' + e(b.alt || "") + '" loading="lazy"><figcaption>' + e(b.caption || "") + " Select to enlarge.</figcaption></figure>";
    if (b.analysis) {
      if (opts.analysis !== "show") return "";
      const a = b.analysis;
      return (
        '<div class="analysis-panel"><div class="analysis-head"><span class="lbl">Foundation analysis</span><span class="cond">' + e(a.tag ? a.tag + " · " : "") + e(a.conditions) + "</span></div>" +
        '<div class="body">' + ASC.renderBlocks(a.blocks, opts) + "</div></div>"
      );
    }
    return "";
  }

  // Collect every analysis block in a convening, with the heading it sits under.
  ASC.collectAnalysis = function (c) {
    const out = [];
    (c.sections || []).forEach((s) => {
      let heading = s.title;
      (s.blocks || []).forEach((b) => {
        if (b.h) heading = b.h;
        if (b.analysis) out.push({ section: s.title, heading, analysis: b.analysis });
      });
    });
    return out;
  };
})();
