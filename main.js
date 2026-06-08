/* ============================================================
   DHULI KOWSHIK — Portfolio  |  main.js
   ============================================================ */

/* ── Theme (Dark / Light) ──────────────────────────────────── */
(function () {
  var saved = localStorage.getItem("theme");
  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

document.addEventListener("DOMContentLoaded", function () {

  /* ── Theme toggle ────────────────────────────────────────── */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    updateToggleIcon();
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    toggle.innerHTML = isDark
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  /* ── Mobile hamburger menu ───────────────────────────────── */
  var menuBtn  = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.innerHTML = open
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>';
    });

    /* Close mobile nav when a link is clicked */
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>';
      });
    });
  }

  /* ── Intersection Observer — reveal on scroll ────────────── */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    /* Fallback for older browsers */
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ── Contact form validation ─────────────────────────────── */
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    var btn = form.querySelector(".btn-submit");
    var btnText = btn.querySelector(".btn-text");
    var spinner = btn.querySelector(".spinner");

    btn.disabled = true;
    btnText.textContent = "Sending…";
    spinner.hidden = false;

    /* Simulate async send */
    setTimeout(function () {
      form.style.display = "none";
      var success = document.getElementById("success-message");
      success.classList.add("visible");
      success.focus();
    }, 900);
  });

  function validateForm() {
    var valid = true;
    var fields = [
      { id: "name",    errId: "name-error",    min: 2,  label: "Full Name",     type: "text" },
      { id: "email",   errId: "email-error",   min: 0,  label: "Email Address", type: "email" },
      { id: "subject", errId: "subject-error", min: 5,  label: "Subject",       type: "text" },
      { id: "message", errId: "message-error", min: 10, label: "Message",       type: "text" }
    ];

    fields.forEach(function (f) {
      var el  = document.getElementById(f.id);
      var err = document.getElementById(f.errId);
      if (!el || !err) return;
      var val = el.value.trim();
      var msg = "";

      if (!val) {
        msg = f.label + " is required.";
      } else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = "Please enter a valid email address.";
      } else if (f.min && val.length < f.min) {
        msg = f.label + " must be at least " + f.min + " characters.";
      }

      err.textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { valid = false; if (valid === false && document.activeElement !== el) { /* keep first focus */ } }
    });

    /* Focus first error */
    if (!valid) {
      var firstErr = form.querySelector("[aria-invalid='true']");
      if (firstErr) firstErr.focus();
    }

    return valid;
  }
});

/* ── Reset contact form (called inline) ─────────────────────── */
function resetContactForm() {
  var form = document.getElementById("contact-form");
  var success = document.getElementById("success-message");
  if (!form || !success) return;

  form.reset();
  form.style.display = "flex";
  success.classList.remove("visible");

  form.querySelectorAll(".error-msg").forEach(function (el) { el.textContent = ""; });
  form.querySelectorAll("input, textarea").forEach(function (el) { el.removeAttribute("aria-invalid"); });

  var btn = form.querySelector(".btn-submit");
  if (btn) {
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Send Message";
    btn.querySelector(".spinner").hidden = true;
  }

  var nameEl = document.getElementById("name");
  if (nameEl) nameEl.focus();
}
