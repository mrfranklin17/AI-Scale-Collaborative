/* Shared header, footer and helpers for every page. */
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

  ASC.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  };

  ASC.orgs = function () {
    return ASC.partners.map((p) => ({ id: p.id, name: p.name, short: p.short, type: p.type })).concat(ASC.survey.extraOrgs);
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
  ASC.initials = function (name) {
    return name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
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
      check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
      download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
      upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
      chev: '<path d="m6 9 6 6 6-6"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
    }[name];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  };

  function header(page) {
    const links = NAV.map((n) => '<a href="' + n.href + '"' + (n.page === page ? ' aria-current="page"' : "") + ">" + n.label + "</a>").join("");
    return (
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html"><span class="brand-mark">AI</span><span>AI Scale Collaborative<small>CMO &amp; Intermediary Network</small></span></a>' +
      '<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">' + '<span style="width:18px;height:18px;display:inline-flex">' + ASC.icon("menu") + "</span>Menu</button>" +
      '<nav class="nav" id="site-nav" aria-label="Main">' + links +
      '<a class="btn btn-primary btn-sm" href="survey.html"' + (page === "survey" ? ' aria-current="page"' : "") + ">Share feedback</a></nav>" +
      "</div></header>"
    );
  }

  function footer() {
    return (
      '<footer class="site-footer"><div class="wrap">' +
      "<div><b style=\"color:var(--text)\">AI Scale Collaborative</b><br>US Charters · Gates Foundation · Launched Fall 2026</div>" +
      "<nav aria-label=\"Footer\">" + NAV.map((n) => '<a href="' + n.href + '">' + n.label + "</a>").join("") + '<a href="survey.html">Survey</a></nav>' +
      '<button class="theme-btn" type="button" id="theme-btn">Theme: auto</button>' +
      "</div></footer>"
    );
  }

  function applyTheme(t) {
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }
  let theme = "auto";
  try { theme = localStorage.getItem("asc_theme") || "auto"; } catch (e) {}
  applyTheme(theme);

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.outerHTML = header(page);
    if (f) f.outerHTML = footer();

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    const tb = document.getElementById("theme-btn");
    if (tb) {
      const order = ["auto", "light", "dark"];
      tb.textContent = "Theme: " + theme;
      tb.addEventListener("click", () => {
        theme = order[(order.indexOf(theme) + 1) % order.length];
        applyTheme(theme);
        tb.textContent = "Theme: " + theme;
        try { localStorage.setItem("asc_theme", theme); } catch (e) {}
      });
    }

    // Image lightbox for figures
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<img alt="">';
    document.body.appendChild(lb);
    lb.addEventListener("click", () => lb.classList.remove("open"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
    document.addEventListener("click", (e) => {
      const img = e.target.closest(".figure img");
      if (!img) return;
      lb.querySelector("img").src = img.src;
      lb.querySelector("img").alt = img.alt;
      lb.classList.add("open");
    });

    if (typeof ASC.render === "function") ASC.render();
  });
})();
