/* Lightweight HTML chart builders for the Feedback dashboard. */
(function () {
  const ASC = window.ASC;
  const e = (s) => ASC.esc(s);

  // One shared tooltip, driven by data-tip attributes (HTML-escaped content).
  let tip;
  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "tooltip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    const move = (ev) => {
      const t = ev.target.closest("[data-tip]");
      if (!t) { tip.classList.remove("show"); return; }
      tip.innerHTML = t.getAttribute("data-tip");
      tip.classList.add("show");
      const pad = 14;
      const r = tip.getBoundingClientRect();
      let x = ev.clientX + pad;
      let y = ev.clientY + pad;
      if (x + r.width > window.innerWidth - 8) x = ev.clientX - r.width - pad;
      if (y + r.height > window.innerHeight - 8) y = ev.clientY - r.height - pad;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("focusin", (ev) => {
      const t = ev.target.closest("[data-tip]");
      if (!t) return;
      const b = t.getBoundingClientRect();
      tip.innerHTML = t.getAttribute("data-tip");
      tip.classList.add("show");
      tip.style.left = Math.min(b.left, window.innerWidth - 270) + "px";
      tip.style.top = b.bottom + 8 + "px";
    });
    document.addEventListener("focusout", () => tip.classList.remove("show"));
    document.addEventListener("scroll", () => tip.classList.remove("show"), { passive: true });
    return tip;
  }

  const fmt = (v, d) => (v == null || isNaN(v) ? "—" : Number(v).toFixed(d == null ? 1 : d));
  const pct = (v) => (v == null || isNaN(v) ? "—" : Math.round(v * 100) + "%");

  ASC.charts = {
    fmt,
    pct,

    /* rows: [{ name, counts: [n1..n5], mean, n }] */
    likert(rows, labels) {
      ensureTip();
      const vars = ["--lk-1", "--lk-2", "--lk-3", "--lk-4", "--lk-5"];
      const legend =
        '<div class="legend" aria-hidden="true">' + labels.map((l, i) => '<span><i style="background:var(' + vars[i] + ')"></i>' + e(l) + "</span>").join("") + "</div>";
      const body = rows
        .map((r) => {
          const total = r.counts.reduce((a, b) => a + b, 0) || 1;
          const segs = r.counts
            .map((c, i) => {
              if (!c) return "";
              const share = c / total;
              const label = share >= 0.09 ? Math.round(share * 100) + "%" : "";
              return (
                '<div class="seg' + (i === 2 ? " light" : "") + '" tabindex="0" style="width:' + share * 100 + "%;background:var(" + vars[i] + ')" data-tip="' +
                e("<b>" + e(r.name) + "</b>" + e(labels[i]) + ": " + c + " of " + total + " (" + Math.round(share * 100) + "%)") + '">' + label + "</div>"
              );
            })
            .join("");
          const agree = (r.counts[3] + r.counts[4]) / total;
          return (
            '<div class="lk-row"><div class="name">' + e(r.name) + '</div><div class="lk-bar" role="img" aria-label="' +
            e(r.name + ": " + labels.map((l, i) => l + " " + r.counts[i]).join(", ")) + '">' + segs + '</div><div class="mean" data-tip="' +
            e("<b>Mean " + fmt(r.mean) + " / 5</b>" + Math.round(agree * 100) + "% agree or strongly agree · n=" + r.n) + '" tabindex="0">' + fmt(r.mean) + "</div></div>"
          );
        })
        .join("");
      const axis = '<div class="lk-axis"><div></div><div class="ticks"><span>0%</span><span>50%</span><span>100%</span></div><div style="text-align:right">Mean</div></div>';
      const table =
        '<details class="table-toggle"><summary>View as table</summary><div class="table-wrap"><table class="data-table"><thead><tr><th>Statement</th>' +
        labels.map((l) => '<th class="num">' + e(l) + "</th>").join("") + '<th class="num">Mean</th><th class="num">n</th></tr></thead><tbody>' +
        rows.map((r) => "<tr><td>" + e(r.name) + "</td>" + r.counts.map((c) => '<td class="num">' + c + "</td>").join("") + '<td class="num">' + fmt(r.mean) + '</td><td class="num">' + r.n + "</td></tr>").join("") +
        "</tbody></table></div></details>";
      return legend + '<div style="margin-top:14px">' + body + "</div>" + axis + table;
    },

    /* rows: [{ name, a, b }] on a min..max scale; aLabel/bLabel name the series */
    dots(rows, aLabel, bLabel, min, max) {
      ensureTip();
      const x = (v) => ((v - min) / (max - min)) * 100;
      const legend =
        '<div class="legend"><span><i class="dot" style="background:var(--series-1)"></i>' + e(aLabel) + '</span><span><i style="background:var(--series-2);width:10px;height:10px;border-radius:2px"></i>' + e(bLabel) + "</span></div>";
      const body = rows
        .map((r) => {
          const lo = Math.min(r.a ?? r.b, r.b ?? r.a);
          const hi = Math.max(r.a ?? r.b, r.b ?? r.a);
          const diff = r.a != null && r.b != null ? r.a - r.b : null;
          const tipA = e("<b>" + e(r.name) + "</b>" + e(aLabel) + ": " + fmt(r.a) + (diff != null ? " (" + (diff >= 0 ? "+" : "") + fmt(diff) + " vs " + e(bLabel) + ")" : ""));
          const tipB = e("<b>" + e(r.name) + "</b>" + e(bLabel) + ": " + fmt(r.b));
          return (
            '<div class="dot-row"><div class="name">' + e(r.name) + '</div><div class="dot-track">' +
            (r.a != null && r.b != null ? '<div class="link" style="left:' + x(lo) + "%;width:" + (x(hi) - x(lo)) + '%"></div>' : "") +
            (r.b != null ? '<div class="dot s2" tabindex="0" style="left:' + x(r.b) + '%" data-tip="' + tipB + '"></div>' : "") +
            (r.a != null ? '<div class="dot s1" tabindex="0" style="left:' + x(r.a) + '%" data-tip="' + tipA + '"></div>' : "") +
            "</div></div>"
          );
        })
        .join("");
      const ticks = [];
      for (let v = min; v <= max; v++) ticks.push('<span style="left:' + x(v) + '%">' + v + "</span>");
      return legend + '<div style="margin-top:10px">' + body + '</div><div class="dot-axis"><div></div><div class="ticks">' + ticks.join("") + "</div></div>";
    },

    /* rows: [{ name, value, label, tip, ref }] where value is 0..max */
    hbars(rows, max, refLabel) {
      ensureTip();
      return rows
        .map(
          (r) =>
            '<div class="hbar-row"><div class="name">' + e(r.name) + '</div><div class="hbar-track">' +
            '<div class="hbar-fill" tabindex="0" style="width:' + Math.max(0, (r.value / max) * 100) + '%" data-tip="' + e(r.tip || "") + '"></div>' +
            (r.ref != null ? '<div class="hbar-fill ref" style="left:' + (r.ref / max) * 100 + '%" data-tip="' + e(e(refLabel || "Reference") + ": " + fmt(r.ref)) + '"></div>' : "") +
            '</div><div class="val">' + e(r.label) + "</div></div>"
        )
        .join("");
    }
  };
})();
