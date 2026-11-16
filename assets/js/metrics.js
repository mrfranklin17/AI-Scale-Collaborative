/* Survey metrics shared by the landing page, Feedback dashboard and convening pages. */
(function () {
  const ASC = window.ASC;
  const S = () => ASC.survey;

  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const likertVals = (rows, id) => rows.map((r) => r.answers && r.answers.likert && r.answers.likert[id]).filter((v) => v >= 1 && v <= 5);

  ASC.metrics = {
    mean,
    likertVals,
    overall(rows) {
      return mean(rows.map((r) => mean(Object.values((r.answers && r.answers.likert) || {}).filter((v) => v >= 1))).filter((v) => v != null));
    },
    nps(rows) {
      const v = rows.map((r) => r.answers && r.answers.nps).filter((x) => typeof x === "number" && !isNaN(x));
      if (!v.length) return null;
      return Math.round(((v.filter((x) => x >= 9).length - v.filter((x) => x <= 6).length) / v.length) * 100);
    },
    agreeShare(rows, id) {
      const v = likertVals(rows, id);
      return v.length ? v.filter((x) => x >= 4).length / v.length : null;
    },
    statementMeans(rows) {
      return S().likert.map((q) => ({ q, m: mean(likertVals(rows, q.id)), n: likertVals(rows, q.id).length })).filter((x) => x.m != null);
    },
    topFriction(rows) {
      const counts = ASC.frictionFramework.map((f) => ({ f, n: rows.filter((r) => r.answers && r.answers.friction === f.id).length }));
      const total = counts.reduce((a, b) => a + b.n, 0);
      const top = counts.slice().sort((a, b) => b.n - a.n)[0];
      return total && top.n ? { f: top.f, share: top.n / total, n: top.n, total } : null;
    },
    /* Three plain-language findings for a set of responses. */
    findings(rows) {
      const sm = this.statementMeans(rows).sort((a, b) => b.m - a.m);
      if (!sm.length) return null;
      const hi = sm[0];
      const lo = sm[sm.length - 1];
      const fr = this.topFriction(rows);
      return { hi, lo, fr };
    }
  };

  /* Load responses: real ones if any exist, otherwise labeled sample data (if enabled). */
  ASC.loadResponses = async function () {
    let real = [];
    let error = null;
    try { real = ASC.store ? await ASC.store.list() : []; } catch (x) { error = x.message; }
    const sample = !real.length && ASC.config.showSampleData;
    return { rows: sample ? ASC.sampleResponses() : real, sample, error };
  };
})();
