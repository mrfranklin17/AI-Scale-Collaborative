ASC.render = function () {
  const e = ASC.esc;
  const S = ASC.survey;
  const I = ASC.icon;
  const main = document.getElementById("main");
  const DRAFT = "asc_survey_draft_v1";
  const params = new URLSearchParams(location.search);
  const convs = ASC.completedConvenings().slice().reverse();
  const urlConv = params.get("convening");

  // Restore a saved draft (only if it matches the convening in the link, when there is one)
  let draft = ASC.storage.get(DRAFT, null);
  if (draft && (typeof draft !== "object" || !draft.values || (urlConv && draft.values.convening_id && draft.values.convening_id !== urlConv))) draft = null;
  const values = Object.assign({ convening_id: urlConv && ASC.convening(urlConv) ? urlConv : convs[0] ? convs[0].id : "" }, draft ? draft.values : {});
  if (urlConv && ASC.convening(urlConv)) values.convening_id = urlConv;
  let step = draft && draft.step ? draft.step : 0;

  /* ---------- field builders ---------- */
  const scaleGroup = (name, legend, labels, opts) => {
    opts = opts || {};
    const start = opts.nps ? 0 : 1;
    return (
      '<fieldset class="q' + (opts.nps ? " q--nps" : "") + '" data-name="' + e(name) + '"' + (opts.required ? " data-required" : "") + "><legend>" + e(legend) + (opts.optional ? ' <span class="muted small">(optional)</span>' : "") + "</legend>" +
      '<div class="seg' + (opts.nps ? " seg--nps" : "") + '">' +
      labels.map((l, i) => { const v = String(i + start); return '<label><input type="radio" name="' + e(name) + '" value="' + v + '"' + (String(values[name]) === v ? " checked" : "") + "><span>" + e(l) + "</span></label>"; }).join("") +
      "</div>" + (opts.ends ? '<div class="seg-ends" aria-hidden="true"><span>' + e(opts.ends[0]) + "</span><span>" + e(opts.ends[1]) + "</span></div>" : "") +
      '<p class="q-error" hidden>Please choose an answer.</p></fieldset>'
    );
  };
  const select = (name, label, opts) =>
    '<div class="q" data-name="' + name + '" data-required><label class="q-label" for="' + name + '">' + label + '</label><select id="' + name + '" name="' + name + '"><option value="">Select…</option>' +
    opts.map((o) => '<option value="' + e(o.v) + '"' + (values[name] === o.v ? " selected" : "") + ">" + e(o.t) + "</option>").join("") + '</select><p class="q-error" hidden>Please choose an option.</p></div>';

  function steps() {
    const conv = ASC.convening(values.convening_id);
    const list = [
      {
        id: "about",
        title: "About you",
        intro: "Which convening, and where you’re coming from. Responses are attributed to your organization and role — never your name.",
        html:
          select("convening_id", "Convening", convs.map((c) => ({ v: c.id, t: c.title + " — " + c.dates }))) +
          select("organization", "Your organization", ASC.orgs().map((o) => ({ v: o.id, t: o.name }))) +
          select("role", "Your role", S.roles.map((r) => ({ v: r.id, t: r.label })))
      },
      {
        id: "ratings",
        title: "Your experience",
        intro: "How much do you agree with each statement?",
        html:
          S.likert.map((q) => scaleGroup("lk_" + q.id, q.text, S.scale, { required: true })).join("") +
          scaleGroup("nps", S.nps.text, Array.from({ length: 11 }, (_, i) => String(i)), { nps: true, required: true, ends: [S.nps.low, S.nps.high] })
      }
    ];
    if (conv && conv.sessions && conv.sessions.length) {
      list.push({ id: "sessions", title: "Sessions", intro: "How useful was each session? Skip any you didn’t attend.", html: conv.sessions.map((s) => scaleGroup("ss_" + s.id, s.name, S.sessionScale, { optional: true })).join("") });
    }
    list.push({
      id: "reflect",
      title: "In your words",
      intro: "Optional, but this is where the most useful feedback comes from.",
      html:
        '<fieldset class="q" data-name="friction"><legend>' + e(S.friction.text) + ' <span class="muted small">(optional)</span></legend><div class="choice-grid">' +
        ASC.frictionFramework.map((f) => '<label class="choice"><input type="radio" name="friction" value="' + e(f.id) + '"' + (values.friction === f.id ? " checked" : "") + '><span class="box"><span class="chip chip--fr chip--' + f.id + '">' + f.n + ". " + e(f.title) + "</span><small>" + e(f.question) + "</small></span></label>").join("") +
        "</div></fieldset>" +
        S.open.map((q) => '<div class="q"><label class="q-label" for="op_' + e(q.id) + '">' + e(q.text) + '</label><textarea id="op_' + e(q.id) + '" name="op_' + e(q.id) + '" maxlength="2000" rows="4">' + e(values["op_" + q.id] || "") + "</textarea></div>").join("")
    });
    return list;
  }

  /* ---------- frame ---------- */
  main.innerHTML =
    ASC.pageHero({
      crumbs: [{ label: "Survey" }],
      eyebrow: "Post-convening survey",
      title: "How was the convening?",
      lede: "About <b>5 minutes</b>. Your answers save on this device as you go, so you can pick up where you left off."
    }) +
    '<section class="wrap survey-wrap">' +
    (ASC.store.mode === "local" ? '<div class="notice" style="margin-bottom:var(--sp-4)">' + I("info") + "<div><b>Preview mode.</b> The shared survey database isn’t connected yet, so responses are saved in this browser only.</div></div>" : "") +
    (draft ? '<div class="notice" id="restored" style="margin-bottom:var(--sp-4)">' + I("check") + '<div>We restored your saved answers. <button type="button" class="btn btn-ghost btn-sm" id="start-over">Start over</button></div></div>' : "") +
    '<form class="card survey" id="survey" novalidate>' +
    '<div class="progress" id="progress"></div>' +
    '<div id="step"></div>' +
    '<div class="survey-nav"><button type="button" class="btn btn-secondary" id="back">' + I("back") + 'Back</button><span class="form-error" id="form-error" role="alert"></span><button type="submit" class="btn btn-primary" id="next">Next ' + I("arrow") + "</button></div>" +
    "</form></section>";

  const form = document.getElementById("survey");
  const stepEl = document.getElementById("step");

  function collect() {
    new FormData(form).forEach((v, k) => (values[k] = v));
    // radio groups with nothing checked are absent from FormData; keep earlier values
  }
  function save() {
    ASC.storage.set(DRAFT, { values, step, savedAt: new Date().toISOString() });
  }

  function render(focus) {
    const list = steps();
    step = Math.min(step, list.length - 1);
    const s = list[step];
    const pct = Math.round(((step + 1) / list.length) * 100);
    document.getElementById("progress").innerHTML =
      '<div class="progress-top"><span id="step-label">Step ' + (step + 1) + " of " + list.length + "</span><span>" + e(s.title) + "</span></div>" +
      '<div class="progress-bar" role="progressbar" aria-labelledby="step-label" aria-valuemin="1" aria-valuemax="' + list.length + '" aria-valuenow="' + (step + 1) + '"><span style="width:' + pct + '%"></span></div>';
    stepEl.innerHTML = '<h2 id="step-h" tabindex="-1">' + e(s.title) + '</h2><p class="step-intro">' + e(s.intro) + "</p>" + s.html;
    document.getElementById("back").hidden = step === 0;
    const last = step === list.length - 1;
    document.getElementById("next").innerHTML = last ? "Submit feedback" : "Next " + I("arrow");
    document.getElementById("form-error").textContent = "";
    if (focus) {
      const h = document.getElementById("step-h");
      h.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  function validate() {
    let first = null;
    stepEl.querySelectorAll("[data-required]").forEach((q) => {
      const name = q.dataset.name;
      const v = values[name];
      const bad = v == null || v === "";
      q.classList.toggle("invalid", bad);
      const err = q.querySelector(".q-error");
      if (err) err.hidden = !bad;
      const ctrl = q.querySelector("select, input");
      if (ctrl) ctrl.setAttribute("aria-invalid", String(bad));
      if (bad && !first) first = q;
    });
    if (first) {
      document.getElementById("form-error").textContent = "Please answer the highlighted question" + (stepEl.querySelectorAll(".invalid").length > 1 ? "s" : "") + ".";
      first.scrollIntoView({ block: "center" });
      (first.querySelector("select, input") || first).focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  form.addEventListener("change", (ev) => {
    collect();
    if (ev.target.name === "convening_id") {
      // sessions differ by convening: drop old session answers
      Object.keys(values).forEach((k) => { if (k.startsWith("ss_")) delete values[k]; });
    }
    const q = ev.target.closest(".q");
    if (q && q.classList.contains("invalid")) { q.classList.remove("invalid"); const er = q.querySelector(".q-error"); if (er) er.hidden = true; }
    save();
  });
  form.addEventListener("input", (ev) => { if (ev.target.tagName === "TEXTAREA") { collect(); save(); } });

  document.getElementById("back").addEventListener("click", () => { collect(); step = Math.max(0, step - 1); save(); render(true); });
  const so = document.getElementById("start-over");
  if (so) so.addEventListener("click", () => { ASC.storage.del(DRAFT); location.href = "survey.html" + (urlConv ? "?convening=" + encodeURIComponent(urlConv) : ""); });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    collect();
    if (!validate()) return;
    const list = steps();
    if (step < list.length - 1) { step++; save(); render(true); return; }

    const c = ASC.convening(values.convening_id);
    const answers = { likert: {}, nps: Number(values.nps), sessions: {}, friction: values.friction || null, open: {} };
    S.likert.forEach((q) => (answers.likert[q.id] = Number(values["lk_" + q.id])));
    (c.sessions || []).forEach((s) => { const v = values["ss_" + s.id]; if (v) answers.sessions[s.id] = Number(v); });
    S.open.forEach((q) => { const v = (values["op_" + q.id] || "").trim(); if (v) answers.open[q.id] = v; });

    const btn = document.getElementById("next");
    btn.disabled = true;
    btn.textContent = "Submitting…";
    try {
      await ASC.store.submit({ convening_id: c.id, organization: values.organization, role: values.role, answers });
      ASC.storage.del(DRAFT);
      const r = document.getElementById("restored");
      if (r) r.remove();
      form.outerHTML =
        '<div class="card survey success" tabindex="-1" id="thanks"><div class="check">' + I("check") + "</div>" +
        "<h2>Thank you</h2><p class=\"muted\">Your feedback on " + e(c.title) + " has been recorded.</p>" +
        '<div class="actions-row" style="justify-content:center"><a class="btn btn-primary" href="feedback.html?convening=' + e(c.id) + '">See what others said ' + I("arrow") + '</a><a class="btn btn-secondary" href="convening.html?id=' + e(c.id) + '">Back to the convening</a></div></div>';
      document.getElementById("thanks").focus();
    } catch (x) {
      document.getElementById("form-error").textContent = (x.message || "Something went wrong.") + " Your answers are still saved — try again.";
      btn.disabled = false;
      btn.textContent = "Submit feedback";
    }
  });

  render(false);
};
