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
        if (!menu.classList.contains("open")) setMenuHidden(true);
      } else if (!mq.matches && relocated) {
        // move drawer back into the header for desktop layout
        placeholder.parentNode.insertBefore(menu, placeholder);
        relocated = false;
        closeNav();
        // Desktop nav is always visible + tabbable.
        setMenuHidden(false);
      }
    }

    var docEl = document.documentElement;

    function focusableInMenu() {
      return Array.prototype.slice.call(
        menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      });
    }

    // Keep the off-canvas drawer out of the tab order + AT when it's closed.
    function setMenuHidden(hidden) {
      if (hidden) {
        menu.setAttribute("aria-hidden", "true");
        if ("inert" in menu) menu.inert = true;
      } else {
        menu.removeAttribute("aria-hidden");
        if ("inert" in menu) menu.inert = false;
      }
    }

    // Mark the rest of the page inert while the drawer is open.
    function setBackgroundInert(on) {
      if (header) {
        if (on) header.setAttribute("aria-hidden", "true");
        else header.removeAttribute("aria-hidden");
      }
      var main = document.getElementById("main");
      var footer = document.querySelector("footer");
      [main, footer].forEach(function (el) {
        if (!el) return;
        if (on) {
          el.setAttribute("aria-hidden", "true");
          if ("inert" in el) el.inert = true;
        } else {
          el.removeAttribute("aria-hidden");
          if ("inert" in el) el.inert = false;
        }
      });
    }

    function openNav() {
      setMenuHidden(false);
      menu.classList.add("open");
      scrim.classList.add("open");
      shell.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
      docEl.classList.add("nav-open");
      if (header) header.classList.remove("header-hidden");
      setBackgroundInert(true);
      // Move focus into the drawer.
      var first = focusableInMenu()[0];
      if (first) first.focus();
    }
    function closeNav() {
      var wasOpen = menu.classList.contains("open");
      menu.classList.remove("open");
      scrim.classList.remove("open");
      shell.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
      docEl.classList.remove("nav-open");
      setBackgroundInert(false);
      // Only hide from tab order while in mobile drawer mode.
      if (relocated) setMenuHidden(true);
      // Return focus to the toggle when the drawer had been open.
      if (wasOpen && mq.matches) toggle.focus();
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
      if (!menu.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeNav();
        toggle.focus();
        return;
      }
      if (e.key === "Tab") {
        // Trap focus within the drawer.
        var items = focusableInMenu();
        if (!items.length) {
          e.preventDefault();
          return;
        }
        var firstEl = items[0];
        var lastEl = items[items.length - 1];
        var active = document.activeElement;
        if (e.shiftKey) {
          if (active === firstEl || !menu.contains(active)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (active === lastEl || !menu.contains(active)) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    });

    if (mq.addEventListener) mq.addEventListener("change", relocate);
    else if (mq.addListener) mq.addListener(relocate);
    relocate();
    // Initialize hidden state for the drawer depending on layout.
    if (relocated) setMenuHidden(true);
    else setMenuHidden(false);
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
