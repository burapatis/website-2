/* =========================================================
   Boorapatis Ploysuwan — script.js
   Vanilla JS, ไม่มี dependency ภายนอก
   ========================================================= */
(function () {
  "use strict";

  /* ---------- ปีปัจจุบันใน footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- เมนูมือถือ ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "เปิดเมนู");
    mainNav.classList.remove("is-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      var willOpen = !isOpen;
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "ปิดเมนู" : "เปิดเมนู");
      mainNav.classList.toggle("is-open", willOpen);
    });

    // ปิดเมนูเมื่อคลิกลิงก์ใด ๆ ในเมนู (เหมาะกับมือถือ)
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- เปลี่ยนสไตล์ header เมื่อ scroll ---------- */
  var header = document.getElementById("siteHeader");
  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  /* ---------- ไฮไลต์เมนูตามตำแหน่ง section (active nav) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.indexOf("#") === 0 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActiveLink() {
    var current = null;
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section;
      }
    });

    navLinks.forEach(function (link) {
      var targetId = link.getAttribute("href");
      var isActive = current && targetId === "#" + current.id;
      link.classList.toggle("is-active", Boolean(isActive));
    });
  }

  if (sections.length) {
    setActiveLink();
    window.addEventListener("scroll", setActiveLink, { passive: true });
  }

  /* ---------- ปุ่มกลับขึ้นด้านบน ---------- */
  var backToTop = document.getElementById("backToTop");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (backToTop) {
    function toggleBackToTop() {
      backToTop.classList.toggle("is-visible", window.scrollY > 480);
    }
    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Scroll reveal: ใช้ IntersectionObserver ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // เบราว์เซอร์ไม่รองรับ IntersectionObserver: แสดงเนื้อหาทันที
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
