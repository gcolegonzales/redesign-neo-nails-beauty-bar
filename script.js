/* NeO Nails & Beauty Bar — redesign concept interactions */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky / shrinking header + reveal-on-scroll-up ---- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var lastY = window.scrollY || 0;
    var onScroll = function () {
      var y = window.scrollY || 0;

      if (y > 24) header.classList.add("scrolled");
      else header.classList.remove("scrolled");

      // Never hide the header while the mobile menu is open.
      if (document.body.classList.contains("nav-open")) {
        header.classList.remove("header-hidden");
        lastY = y;
        return;
      }

      if (y > lastY && y > 120) {
        // scrolling down, past the header height
        header.classList.add("header-hidden");
      } else if (y < lastY) {
        // any upward scroll reveals immediately
        header.classList.remove("header-hidden");
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav toggle (side drawer + scrim, relocated to body) ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    // Build the clip wrapper (shell) + scrim as direct children of <body>,
    // so no backdrop-filter/transform ancestor becomes their containing block.
    var shell = document.createElement("div");
    shell.className = "nav-shell";
    var scrim = document.createElement("div");
    scrim.className = "nav-scrim";
    shell.appendChild(scrim);
    document.body.appendChild(shell);

    // Placeholder to restore the menu into the header on desktop.
    var placeholder = document.createComment("nav-menu placeholder");
    menu.parentNode.insertBefore(placeholder, menu);

    var mq = window.matchMedia("(max-width: 760px)");
    var relocated = false;

    function relocate() {
      if (mq.matches && !relocated) {
        // move drawer into the fixed clip wrapper
        shell.appendChild(menu);
        relocated = true;
      } else if (!mq.matches && relocated) {
        // move drawer back into the header for desktop layout
        placeholder.parentNode.insertBefore(menu, placeholder);
        relocated = false;
        closeNav();
      }
    }

    function openNav() {
      menu.classList.add("open");
      scrim.classList.add("open");
      shell.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
      if (header) header.classList.remove("header-hidden");
    }
    function closeNav() {
      menu.classList.remove("open");
      scrim.classList.remove("open");
      shell.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    }

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("open")) closeNav();
      else openNav();
    });

    // Tapping the scrim (page area) closes the menu.
    scrim.addEventListener("click", closeNav);

    // Tapping any link closes the menu.
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });

    if (mq.addEventListener) mq.addEventListener("change", relocate);
    else if (mq.addListener) mq.addListener(relocate);
    relocate();
  }

  /* ---- Scroll-reveal via IntersectionObserver ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
