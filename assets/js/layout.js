/* Shared header, footer, page scaffolding and helpers for every page. */
(function () {
  const ASC = (window.ASC = window.ASC || {});

  const NAV = [
    { href: "index.html", label: "Overview", page: "home" },
    { href: "about.html", label: "Purpose & Design", page: "about" },
    { href: "partners.html", label: "Partners", page: "partners" },
    { href: "measures.html", label: "Measures", page: "measures" },
    { href: "convenings.html", label: "Convenings", page: "convenings" },
    { href: "feedback.html", label: "Feedback", page: "feedback" }
  ];
  // Pages that belong to a nav section for highlighting
  const SECTION_OF = { convening: "convenings", partner: "partners" };

  /* ---------- small helpers ---------- */
  ASC.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  };
  ASC.orgs = function () {
    return ASC.partners.map((p) => ({ id: p.id, name: p.name, short: p.short, type: p.type })).concat(ASC.survey ? ASC.survey.extraOrgs : []);
  };
  ASC.org = function (id) {
    return ASC.orgs().find((o) => o.id === id) || { id, name: id, short: id };
  };
  ASC.partner = function (id) {
    return ASC.partners.find((p) => p.id === id);
  };
  ASC.convening = function (id) {
    return ASC.convenings.find((c) => c.id === id);
  };
  ASC.hostName = function (c, short) {
    const p = c && ASC.partner(c.host);
    return p ? (short ? p.short : p.name) : "Host to be confirmed";
  };
  ASC.completedConvenings = function () {
    return ASC.convenings.filter((c) => c.status === "completed").sort((a, b) => a.start.localeCompare(b.start));
  };
  ASC.nextConvening = function () {
    return ASC.convenings.filter((c) => c.status !== "completed").sort((a, b) => a.start.localeCompare(b.start))[0];
  };
  ASC.initials = function (name) {
    return name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  };
  ASC.fmtDate = function (iso) {
    if (!iso) return "";
    const d = new Date(iso.length <= 10 ? iso + "T12:00:00" : iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };
  ASC.storage = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  ASC.icon = function (name) {
    const p = {
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
      users: '<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="7.5" r="3.5"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.2a3.5 3.5 0 0 1 0 6.6"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
      message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
      pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
      check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
      download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
      upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
      print: '<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7"/>',
      chev: '<path d="m6 9 6 6 6-6"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      filter: '<path d="M4 5h16l-6 8v5l-4 2v-7L4 5Z"/>',
      clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
      spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
      book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'
    }[name];
    return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg></span>";
  };

  /* ---------- page scaffolding ---------- */

  // Breadcrumb trail: [{label, href?}, ...]; the last item is the current page.
  ASC.crumbs = function (items) {
    const e = ASC.esc;
    return (
      '<nav class="crumbs" aria-label="Breadcrumb"><ol>' +
      '<li><a href="index.html">Overview</a></li>' +
      items.map((it, i) => (i === items.length - 1 ? '<li><span aria-current="page">' + e(it.label) + "</span></li>" : '<li><a href="' + e(it.href) + '">' + e(it.label) + "</a></li>")).join("") +
      "</ol></nav>"
    );
  };

  ASC.updated = function (iso, label) {
    return iso ? '<p class="updated">' + ASC.esc(label || "Last updated") + " " + ASC.esc(ASC.fmtDate(iso)) + "</p>" : "";
  };

  // Standard page hero
  ASC.pageHero = function (o) {
    const e = ASC.esc;
    return (
      '<section class="page-hero"><div class="wrap">' + ASC.crumbs(o.crumbs) +
      (o.eyebrow ? '<span class="eyebrow">' + e(o.eyebrow) + "</span>" : "") +
      "<h1>" + e(o.title) + "</h1>" +
      (o.lede ? '<p class="lede">' + o.lede + "</p>" : "") +
      (o.extra || "") +
      (o.updated ? ASC.updated(o.updated) : "") +
      "</div></section>"
    );
  };

  // Sticky "On this page" layout. sections: [{id, nav, html}]
  ASC.withToc = function (sections, opts) {
    opts = opts || {};
    const e = ASC.esc;
    return (
      '<div class="wrap with-toc"><nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>' +
      sections.map((s) => '<li><a href="#' + e(s.id) + '">' + e(s.nav) + "</a></li>").join("") +
      "</ol>" + (opts.cta || "") + "</nav><div>" +
      sections.map((s) => '<section class="toc-section" id="' + e(s.id) + '" aria-labelledby="' + e(s.id) + '-h">' + s.html + "</section>").join("") +
      "</div></div>"
    );
  };
  ASC.wireToc = function () {
    const links = [...document.querySelectorAll(".toc a[href^='#']")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
        });
      }),
      { rootMargin: "-25% 0px -65% 0px" }
    );
    links.forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (t) obs.observe(t); });
  };

  /* ---------- header / footer ---------- */
  function header(page) {
    const section = SECTION_OF[page] || page;
    const links = NAV.map((n) => '<a href="' + n.href + '"' + (n.page === section ? ' aria-current="page"' : "") + ">" + n.label + "</a>").join("");
    return (
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="AI Scale Collaborative home"><span class="brand-mark" aria-hidden="true">AI</span><span>AI Scale Collaborative<small>CMO &amp; Intermediary Network</small></span></a>' +
      '<a class="btn btn-primary btn-sm header-cta" href="survey.html">Share feedback</a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' + ASC.icon("menu") + '<span class="label">Menu</span></button>' +
      '<nav class="nav" id="site-nav" aria-label="Main">' +
      '<button class="nav-close" type="button" aria-label="Close menu">' + ASC.icon("close") + "</button>" +
      links +
      '<a class="btn btn-primary btn-sm" href="survey.html"' + (page === "survey" ? ' aria-current="page"' : "") + ">Share feedback</a></nav>" +
      '<div class="nav-backdrop" hidden></div>' +
      "</div></header>"
    );
  }

  function footer() {
    const c = (ASC.config && ASC.config.contact) || {};
    const e = ASC.esc;
    return (
      '<footer class="site-footer"><div class="wrap"><div class="footer-grid">' +
      '<div><h2>AI Scale Collaborative</h2><p>A US Charters network of four CMOs and two intermediaries measuring how AI-augmented instruction affects student outcomes. Launched Fall 2026.</p></div>' +
      '<div><h2>The collaborative</h2><ul>' +
      NAV.slice(0, 4).map((n) => '<li><a href="' + n.href + '">' + n.label + "</a></li>").join("") +
      '<li><a href="about.html#requirements">Network requirements</a></li></ul></div>' +
      '<div><h2>Convenings</h2><ul><li><a href="convenings.html">All convenings</a></li><li><a href="feedback.html">Feedback dashboard</a></li><li><a href="survey.html">Take the survey</a></li></ul></div>' +
      '<div><h2>How feedback is used</h2><p>Survey responses are attributed to organization and role, never to a name. Hosts and partners use them to improve future convenings; results are hidden for any group with fewer than ' + ((ASC.config && ASC.config.minResponsesToShow) || 3) + " responses, and organizations with few respondents are not shown next to comments.</p>" +
      "<p><b>Contact:</b> " + e(c.name || "US Charters team") + (c.email ? ' · <a href="mailto:' + e(c.email) + '">' + e(c.email) + "</a>" : "") + "</p></div>" +
      '</div><div class="footer-base"><span>US Charters · Gates Foundation</span><button class="theme-btn" type="button" id="theme-btn">Theme: auto</button></div>' +
      "</div></footer>"
    );
  }

  function applyTheme(t) {
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }
  let theme = ASC.storage.get("asc_theme", "auto");
  if (!["auto", "light", "dark"].includes(theme)) theme = "auto";
  applyTheme(theme);

  function wireNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    const backdrop = document.querySelector(".nav-backdrop");
    const close = document.querySelector(".nav-close");
    if (!toggle) return;
    const set = (open) => {
      nav.classList.toggle("open", open);
      backdrop.classList.toggle("open", open);
      backdrop.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) (nav.querySelector("a") || nav).focus();
      else toggle.focus();
    };
    toggle.addEventListener("click", () => set(true));
    close.addEventListener("click", () => set(false));
    backdrop.addEventListener("click", () => set(false));
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && nav.classList.contains("open")) set(false);
      if (ev.key === "Tab" && nav.classList.contains("open")) {
        const f = [...nav.querySelectorAll("a, button")].filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
        else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.outerHTML = header(page);
    if (f) f.outerHTML = footer();
    wireNav();

    const tb = document.getElementById("theme-btn");
    if (tb) {
      const order = ["auto", "light", "dark"];
      tb.textContent = "Theme: " + theme;
      tb.addEventListener("click", () => {
        theme = order[(order.indexOf(theme) + 1) % order.length];
        applyTheme(theme);
        tb.textContent = "Theme: " + theme;
        ASC.storage.set("asc_theme", theme);
      });
    }

    // Image lightbox for figures
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<img alt="">';
    document.body.appendChild(lb);
    lb.addEventListener("click", () => lb.classList.remove("open"));
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") lb.classList.remove("open"); });
    document.addEventListener("click", (ev) => {
      const img = ev.target.closest(".figure img");
      if (!img) return;
      lb.querySelector("img").src = img.src;
      lb.querySelector("img").alt = img.alt;
      lb.classList.add("open");
    });

    Promise.resolve(typeof ASC.render === "function" ? ASC.render() : null).then(() => ASC.wireToc());
  });
})();
