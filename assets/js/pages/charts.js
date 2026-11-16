/*
 * Lightweight, accessible HTML/SVG chart builders for the Feedback dashboard.
 * - Colors come from tokens.css (--lk-*, --series-*); never hard-coded here.
 * - Every chart carries a text alternative (aria-label) and a table view.
 * - Hover/focus tooltips are a convenience; the same numbers are always on
 *   screen as direct labels or in the table.
 */
(function () {
  const ASC = window.ASC;
  const e = (s) => ASC.esc(s);

  let tip;
  function ensureTip() {
    if (tip) return;
    tip = document.createElement("div");
    tip.className = "tooltip";
    tip.setAttribute("aria-hidden", "true"); // content is duplicated in labels/tables
    document.body.appendChild(tip);
    const show = (t, x, y) => {
      tip.innerHTML = t.getAttribute("data-tip");
      tip.classList.add("show");
      const r = tip.getBoundingClientRect();
      if (x + r.width > window.innerWidth - 8) x = Math.max(8, window.innerWidth - r.width - 8);
      if (y + r.height > window.innerHeight - 8) y = y - r.height - 28;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    };
    document.addEventListener("mousemove", (ev) => {
      const t = ev.target.closest && ev.target.closest("[data-tip]");
      if (!t) return tip.classList.remove("show");
      show(t, ev.clientX + 14, ev.clientY + 14);
    });
    document.addEventListener("focusin", (ev) => {
      const t = ev.target.closest && ev.target.closest("[data-tip]");
      if (!t) return tip.classList.remove("show");
      const b = t.getBoundingClientRect();
      show(t, b.left, b.bottom + 8);
    });
    document.addEventListener("scroll", () => tip.classList.remove("show"), { passive: true });
  }

  const fmt = (v, d) => (v == null || isNaN(v) ? "—" : Number(v).toFixed(d == null ? 1 : d));
  const pct = (v) => (v == null || isNaN(v) ? "—" : Math.round(v * 100) + "%");
  const signed = (v, d, unit) => (v == null || isNaN(v) ? "" : (v > 0.0001 ? "▲ +" : v < -0.0001 ? "▼ −" : "● ±") + Math.abs(v).toFixed(d) + (unit || ""));
  const deltaHtml = (v, d, unit, label) => {
    if (v == null || isNaN(v)) return "";
    const cls = v > 0.0001 ? "up" : v < -0.0001 ? "down" : "flat";
    const word = v > 0.0001 ? "higher than" : v < -0.0001 ? "lower than" : "same as";
    return '<span class="delta ' + cls + '"><span aria-hidden="true">' + signed(v, d, unit) + '</span><span class="sr-only">' + Math.abs(v).toFixed(d) + (unit || "") + " " + word + " network</span>" + (label === "" ? "" : '<span aria-hidden="true"> ' + e(label || "vs network") + "</span>") + "</span>";
  };

  ASC.charts = {
    fmt,
    pct,
    deltaHtml,

    /*
     * 100% stacked Likert bars.
     * rows: [{ name, counts:[n1..n5], mean, n, ref?: { agree, mean } }]
     * ref (optional) draws a thin marker where the network's "agree" share begins.
     */
    likert(rows, labels, opts) {
      ensureTip();
      opts = opts || {};
      const legend =
        '<ul class="lk-legend" aria-label="Scale">' +
        labels.map((l, i) => '<li><i class="lk-swatch lk-' + (i + 1) + '" aria-hidden="true"></i>' + e(l) + "</li>").join("") +
        (opts.refLabel ? '<li><i class="lk-ref-key" aria-hidden="true"></i>' + e(opts.refLabel) + "</li>" : "") +
        "</ul>";
      const body = rows
        .map((r) => {
          const total = r.counts.reduce((a, b) => a + b, 0) || 1;
          const agree = (r.counts[3] + r.counts[4]) / total;
          const segs = r.counts
            .map((c, i) => {
              if (!c) return "";
              const share = c / total;
              const lab = share >= 0.1 ? Math.round(share * 100) + "%" : "";
              return (
                '<span class="seg lk-' + (i + 1) + '" style="width:' + share * 100 + '%" data-tip="' +
                e("<b>" + e(r.name) + "</b>" + e(labels[i]) + ": " + c + " of " + total + " (" + Math.round(share * 100) + "%)") + '">' + lab + "</span>"
              );
            })
            .join("");
          const ref = r.ref && r.ref.agree != null ? '<span class="lk-ref" style="left:' + (1 - r.ref.agree) * 100 + '%" data-tip="' + e("<b>" + opts.refLabel + "</b>" + Math.round(r.ref.agree * 100) + "% agree · mean " + fmt(r.ref.mean)) + '"></span>' : "";
          const alt = r.name + ": " + labels.map((l, i) => l + " " + r.counts[i]).join(", ") + (r.na ? ", N/A " + r.na : "") + ". " + Math.round(agree * 100) + "% agree, mean " + fmt(r.mean) + (r.ref ? ". " + opts.refLabel + " " + Math.round(r.ref.agree * 100) + "% agree, mean " + fmt(r.ref.mean) : "") + ".";
          return (
            '<div class="lk-row"><div class="lk-name">' + e(r.name) + "</div>" +
            '<div class="lk-bar" role="img" tabindex="0" aria-label="' + e(alt) + '">' + segs + ref + "</div>" +
            '<div class="lk-mean"><b>' + fmt(r.mean) + "</b>" + (r.ref ? deltaHtml(r.mean - r.ref.mean, 1, "", "") : "") + "</div></div>"
          );
        })
        .join("");
      const table =
        '<details class="table-toggle no-print"><summary>View as table</summary><div class="table-wrap" tabindex="0" role="region" aria-label="Statement ratings table"><table class="data-table"><thead><tr><th scope="col">Statement</th>' +
        labels.map((l) => '<th scope="col" class="num">' + e(l) + "</th>").join("") + '<th scope="col" class="num">Mean</th>' + (opts.refLabel ? '<th scope="col" class="num">' + e(opts.refLabel) + " mean</th>" : "") + '<th scope="col" class="num">n</th><th scope="col" class="num">N/A</th></tr></thead><tbody>' +
        rows.map((r) => '<tr><th scope="row">' + e(r.name) + "</th>" + r.counts.map((c) => '<td class="num">' + c + "</td>").join("") + '<td class="num">' + fmt(r.mean) + "</td>" + (opts.refLabel ? '<td class="num">' + fmt(r.ref && r.ref.mean) + "</td>" : "") + '<td class="num">' + r.n + '</td><td class="num">' + (r.na || 0) + "</td></tr>").join("") +
        "</tbody></table></div></details>";
      const naTotal = rows.reduce((a, r) => a + (r.na || 0), 0);
      return legend + '<div class="lk-head" aria-hidden="true"><span></span><span class="lk-ticks"><span>0%</span><span>50%</span><span>100%</span></span><span>Mean</span></div>' + body + (naTotal ? '<p class="muted small" style="margin:var(--sp-3) 0 0">' + naTotal + " N/A answer" + (naTotal === 1 ? "" : "s") + " across these statements are left out of percentages and means; see the table for counts.</p>" : "") + table;
    },

    /* Horizontal bars with direct value labels. rows: [{ name, value (0..max), label, tip, color? }] */
    hbars(rows, max, opts) {
      ensureTip();
      opts = opts || {};
      return (
        '<div class="hb" role="img" aria-label="' + e(opts.alt || rows.map((r) => r.name + " " + r.label).join("; ")) + '">' +
        rows
          .map(
            (r) =>
              '<div class="hb-row"><div class="hb-name">' + (r.chip || "") + e(r.name) + '</div><div class="hb-track"><span class="hb-fill" style="width:' + Math.max(0, (r.value / max) * 100) + "%" + (r.color ? ";background:" + r.color : "") + '" data-tip="' + e(r.tip || "") + '"></span></div><div class="hb-val">' + e(r.label) + "</div></div>"
          )
          .join("") +
        "</div>"
      );
    },

    /*
     * Small multiples: one line per statement across convenings (date order).
     * series: [{ name, points: [{ label, value, n }] }], scale 1–5
     */
    trends(series) {
      ensureTip();
      const W = 260, H = 110, P = { l: 26, r: 14, t: 14, b: 24 };
      const y = (v) => P.t + (1 - (v - 1) / 4) * (H - P.t - P.b);
      return (
        '<div class="sm-grid">' +
        series
          .map((s) => {
            const n = s.points.length;
            const x = (i) => P.l + (n === 1 ? (W - P.l - P.r) / 2 : (i / (n - 1)) * (W - P.l - P.r));
            const pts = s.points.filter((p) => p.value != null);
            const path = pts.map((p, i) => (i ? "L" : "M") + x(s.points.indexOf(p)).toFixed(1) + " " + y(p.value).toFixed(1)).join(" ");
            const alt = s.name + ": " + s.points.map((p) => p.label + " " + fmt(p.value)).join(", ");
            return (
              '<figure class="sm"><figcaption>' + e(s.name) + "</figcaption>" +
              '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + e(alt) + '">' +
              [1, 3, 5].map((g) => '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + y(g) + '" y2="' + y(g) + '" class="sm-grid-line"/><text x="' + (P.l - 6) + '" y="' + (y(g) + 4) + '" class="sm-axis" text-anchor="end">' + g + "</text>").join("") +
              '<path d="' + path + '" class="sm-line"/>' +
              s.points
                .map((p, i) =>
                  p.value == null ? "" :
                  '<circle cx="' + x(i) + '" cy="' + y(p.value) + '" r="4.5" class="sm-dot" tabindex="0" data-tip="' + e("<b>" + e(p.label) + "</b>" + e(s.name) + ": " + fmt(p.value) + " · n=" + p.n) + '"/>' +
                  '<text x="' + x(i) + '" y="' + (y(p.value) - 9) + '" class="sm-val" text-anchor="middle">' + fmt(p.value) + "</text>" +
                  '<text x="' + x(i) + '" y="' + (H - 6) + '" class="sm-axis" text-anchor="middle">' + e(p.label) + "</text>"
                )
                .join("") +
              "</svg></figure>"
            );
          })
          .join("") +
        "</div>"
      );
    }
  };
})();
