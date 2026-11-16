ASC.render = function () {
  const e = ASC.esc;
  const S = ASC.survey;
  const main = document.getElementById("main");
  const params = new URLSearchParams(location.search);
  const convs = ASC.convenings.filter((c) => c.status === "completed").sort((a, b) => b.start.localeCompare(a.start));
  const preselect = params.get("convening") || (convs[0] && convs[0].id);

  const radioScale = (name, labels, cls) =>
    '<div class="scale ' + (cls || "") + '" role="radiogroup">' +
    labels.map((l, i) => '<label><input type="radio" name="' + e(name) + '" value="' + (cls === "nps" ? i : i + 1) + '"><span>' + e(l) + "</span></label>").join("") +
    "</div>";

  const orgOptions = ASC.orgs().map((o) => '<option value="' + e(o.id) + '">' + e(o.name) + "</option>").join("");
  const roleOptions = S.roles.map((r) => '<option value="' + e(r.id) + '">' + e(r.label) + "</option>").join("");

  main.innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<div class="crumbs"><a href="index.html">Overview</a> / Survey</div>' +
    '<span class="eyebrow">Post-convening survey</span><h1>How was the convening?</h1>' +
    '<p class="lede">About five minutes. Responses are attributed to your organization and role — never your name — and feed the shared <a href="feedback.html">Feedback</a> dashboard that hosts and partners use to improve future convenings.</p>' +
    "</div></section>" +
    '<section class="section" style="padding-top:8px"><div class="wrap">' +
    (ASC.store.mode === "local"
      ? '<div class="notice" style="max-width:820px;margin-bottom:20px"><div><b>Preview mode.</b> The shared survey database isn’t connected yet, so responses are saved in this browser only. See <code>docs/SURVEY_BACKEND.md</code> to connect it.</div></div>'
      : "") +
    '<form class="card form-card" id="survey" novalidate>' +
    '<div class="form-step" style="border-top:0;padding-top:0;margin-top:0"><h2>About you</h2><p>Which convening, and where you’re coming from.</p>' +
    '<div class="field" data-req="convening_id"><label for="convening_id">Convening</label><select id="convening_id" name="convening_id"><option value="">Select a convening…</option>' +
    convs.map((c) => '<option value="' + e(c.id) + '"' + (c.id === preselect ? " selected" : "") + ">" + e(c.title + " — " + c.dates) + "</option>").join("") +
    "</select></div>" +
    '<div class="grid grid-2" style="gap:16px"><div class="field" data-req="organization"><label for="organization">Your organization</label><select id="organization" name="organization"><option value="">Select…</option>' + orgOptions + "</select></div>" +
    '<div class="field" data-req="role"><label for="role">Your role</label><select id="role" name="role"><option value="">Select…</option>' + roleOptions + "</select></div></div>" +
    "</div>" +

    '<div class="form-step"><h2>Overall experience</h2><p>How much do you agree with each statement?</p>' +
    S.likert.map((q) => '<div class="field likert-q" data-req="lk_' + e(q.id) + '" style="margin:0"><span class="label" id="lbl-' + e(q.id) + '">' + e(q.text) + "</span>" + radioScale("lk_" + q.id, S.scale) + "</div>").join("") +
    '<div class="field" data-req="nps" style="margin-top:24px"><span class="label">' + e(S.nps.text) + "</span>" +
    radioScale("nps", Array.from({ length: 11 }, (_, i) => String(i)), "nps") +
    '<div class="scale-ends"><span>' + e(S.nps.low) + "</span><span>" + e(S.nps.high) + "</span></div></div>" +
    "</div>" +

    '<div class="form-step" id="sessions-step"><h2>Sessions</h2><p>How useful was each session? Skip any you didn’t attend.</p><div id="session-qs"></div></div>' +

    '<div class="form-step"><h2>Implementation frictions</h2><p>' + e(S.friction.text) + "</p>" +
    '<div class="field" data-opt="friction"><div class="choice-grid">' +
    ASC.frictionFramework.map((f) => '<label class="choice"><input type="radio" name="friction" value="' + e(f.id) + '"><span class="box"><b>' + f.n + ". " + e(f.title) + "</b><small>" + e(f.question) + "</small></span></label>").join("") +
    "</div></div></div>" +

    '<div class="form-step"><h2>In your words</h2><p>Optional, but this is where the most useful feedback comes from.</p>' +
    S.open.map((q) => '<div class="field"><label for="op_' + e(q.id) + '">' + e(q.text) + '</label><textarea id="op_' + e(q.id) + '" name="op_' + e(q.id) + '" maxlength="2000"></textarea></div>').join("") +
    "</div>" +

    '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn btn-primary" type="submit" id="submit-btn">Submit feedback</button><span class="form-error" id="form-error" role="alert"></span></div>' +
    "</form></div></section>";

  const form = document.getElementById("survey");
  const sel = document.getElementById("convening_id");

  function renderSessions() {
    const c = ASC.convening(sel.value);
    const wrap = document.getElementById("session-qs");
    const step = document.getElementById("sessions-step");
    if (!c || !c.sessions || !c.sessions.length) { step.style.display = "none"; wrap.innerHTML = ""; return; }
    step.style.display = "";
    wrap.innerHTML = c.sessions
      .map((s) => '<div class="likert-q"><span class="label">' + e(s.name) + "</span>" + radioScale("ss_" + s.id, S.sessionScale) + "</div>")
      .join("");
  }
  sel.addEventListener("change", renderSessions);
  renderSessions();

  form.addEventListener("change", (ev) => {
    const f = ev.target.closest(".field");
    if (f) f.classList.remove("invalid");
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const err = document.getElementById("form-error");
    err.textContent = "";
    let firstBad = null;
    form.querySelectorAll("[data-req]").forEach((f) => {
      const v = fd.get(f.dataset.req);
      const bad = v == null || v === "";
      f.classList.toggle("invalid", bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      err.textContent = "Please answer the highlighted questions.";
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const c = ASC.convening(fd.get("convening_id"));
    const answers = { likert: {}, nps: Number(fd.get("nps")), sessions: {}, friction: fd.get("friction") || null, open: {} };
    S.likert.forEach((q) => (answers.likert[q.id] = Number(fd.get("lk_" + q.id))));
    (c.sessions || []).forEach((s) => { const v = fd.get("ss_" + s.id); if (v) answers.sessions[s.id] = Number(v); });
    S.open.forEach((q) => { const v = (fd.get("op_" + q.id) || "").trim(); if (v) answers.open[q.id] = v; });

    const btn = document.getElementById("submit-btn");
    btn.disabled = true;
    btn.textContent = "Submitting…";
    try {
      await ASC.store.submit({ convening_id: c.id, organization: fd.get("organization"), role: fd.get("role"), answers });
      form.outerHTML =
        '<div class="card form-card success"><div class="check"><span style="width:28px;height:28px;display:inline-flex">' + ASC.icon("check") + "</span></div>" +
        "<h2>Thank you</h2><p class=\"muted\">Your feedback on " + e(c.title) + " has been recorded.</p>" +
        '<div class="hero-actions" style="justify-content:center"><a class="btn btn-primary" href="feedback.html?convening=' + e(c.id) + '">See the results</a><a class="btn btn-ghost" href="convening.html?id=' + e(c.id) + '">Back to the convening</a></div></div>';
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (x) {
      err.textContent = x.message || "Something went wrong. Please try again.";
      btn.disabled = false;
      btn.textContent = "Submit feedback";
    }
  });
};
