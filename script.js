/* NeO Nails & Beauty Bar — redesign concept interactions */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky / shrinking header ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  function closeNav() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });
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
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Booking form (non-wired demo) ---- */
  var bookBtn = document.getElementById("bookSubmit");
  var bookNote = document.getElementById("bookNote");
  if (bookBtn && bookNote) {
    bookBtn.addEventListener("click", function () {
      var name = (document.getElementById("bf-name") || {}).value || "";
      var svc = (document.getElementById("bf-service") || {}).value || "your service";
      var first = name.trim().split(/\s+/)[0];
      bookNote.classList.add("success");
      bookNote.textContent = first
        ? "Thanks, " + first + "! Your " + svc + " request is noted — we'll text to confirm. (Demo)"
        : "Request received for " + svc + " — we'll text to confirm your time. (Demo)";
      if (!prefersReduced) {
        bookBtn.animate(
          [{ transform: "scale(1)" }, { transform: "scale(.97)" }, { transform: "scale(1)" }],
          { duration: 240, easing: "ease-out" }
        );
      }
    });
  }

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
