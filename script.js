(function () {
  "use strict";

  /* Hero photo parallax tilt */
  var heroVisual = document.getElementById("heroVisual");
  var hero3d = heroVisual ? heroVisual.querySelector(".hero-3d") : null;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroVisual && hero3d && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    heroVisual.addEventListener("mousemove", function (e) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotY = -8 + x * 14;
      var rotX = 4 - y * 14;
      hero3d.style.transform = "rotateY(" + rotY.toFixed(2) + "deg) rotateX(" + rotX.toFixed(2) + "deg)";
    });
    heroVisual.addEventListener("mouseleave", function () {
      hero3d.style.transform = "rotateY(-8deg) rotateX(4deg)";
    });
  }

  /* 3D interactive "Osama Habib" logo */
  (function buildLogo3d() {
    var stage = document.getElementById("logo3dStage");
    var logo = document.getElementById("logo3d");
    var layersEl = document.getElementById("logo3dLayers");
    if (!stage || !logo || !layersEl) return;

    var text = "OSAMA HABIB";
    var depth = 8;
    var top = [124, 92, 255];
    var bottom = [40, 30, 80];

    for (var i = depth; i >= 0; i--) {
      var t = i / depth;
      var r = Math.round(top[0] + (bottom[0] - top[0]) * (1 - t));
      var g = Math.round(top[1] + (bottom[1] - top[1]) * (1 - t));
      var b = Math.round(top[2] + (bottom[2] - top[2]) * (1 - t));
      var layer = document.createElement("span");
      layer.textContent = text;
      layer.style.color = "rgb(" + r + "," + g + "," + b + ")";
      layer.style.transform = "translateZ(" + i * -0.9 + "px)";
      layersEl.appendChild(layer);
    }
    var front = document.createElement("span");
    front.textContent = text;
    front.style.position = "relative";
    front.style.color = "#F3F1FF";
    front.style.transform = "translateZ(1px)";
    layersEl.appendChild(front);

    var measuredWidth = front.getBoundingClientRect().width;
    layersEl.style.width = measuredWidth + "px";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.matchMedia("(hover: hover)").matches) return;

    stage.addEventListener("mousemove", function (e) {
      var rect = stage.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      logo.style.transform = "rotateX(" + (-y * 26) + "deg) rotateY(" + (x * 30) + "deg)";
    });
    stage.addEventListener("mouseleave", function () {
      logo.style.transform = "rotateX(6deg) rotateY(-8deg)";
    });
  })();

  /* Mobile nav toggle */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll-spy active nav link */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* Animate skill bars when visible */
  var skillFills = Array.prototype.slice.call(document.querySelectorAll(".skill-fill"));
  if (skillFills.length && "IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.style.width = el.getAttribute("data-value") + "%";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillFills.forEach(function (el) { skillObserver.observe(el); });
  } else {
    skillFills.forEach(function (el) { el.style.width = el.getAttribute("data-value") + "%"; });
  }

  /* Scroll reveal for cards and section headers */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--stagger-index", i % 6);
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Testimonial carousel (simple horizontal focus cycle on small screens / nav buttons) */
  var track = document.querySelector(".testimonial-row");
  var prevBtn = document.getElementById("testPrev");
  var nextBtn = document.getElementById("testNext");

  if (track && prevBtn && nextBtn) {
    var cards = Array.prototype.slice.call(track.children);
    var index = 0;

    function showOnly(i) {
      if (window.innerWidth > 760) {
        cards.forEach(function (c) { c.style.display = ""; });
        return;
      }
      cards.forEach(function (c, ci) { c.style.display = ci === i ? "flex" : "none"; });
    }

    prevBtn.addEventListener("click", function () {
      index = (index - 1 + cards.length) % cards.length;
      showOnly(index);
    });
    nextBtn.addEventListener("click", function () {
      index = (index + 1) % cards.length;
      showOnly(index);
    });
    window.addEventListener("resize", function () { showOnly(index); });
    showOnly(index);
  }
})();
