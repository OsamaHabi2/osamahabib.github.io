(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- 3D interactive logo ---------- */
  var stage = document.getElementById("logo3dStage");
  var logo = document.getElementById("logo3d");
  var layersEl = document.getElementById("logo3dLayers");

  if (stage && logo && layersEl) {
    var text = "OSAMA HABIB";
    var depth = 8;
    var top = [124, 92, 255];
    var bottom = [40, 30, 80];

    for (var i = depth; i >= 1; i--) {
      var t = i / depth;
      var r = Math.round(top[0] + (bottom[0] - top[0]) * t);
      var g = Math.round(top[1] + (bottom[1] - top[1]) * t);
      var b = Math.round(top[2] + (bottom[2] - top[2]) * t);
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

    layersEl.style.width = front.getBoundingClientRect().width + "px";

    if (!prefersReducedMotion && canHover) {
      stage.addEventListener("mousemove", function (e) {
        var rect = stage.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        logo.style.transform = "rotateX(" + (-y * 26) + "deg) rotateY(" + (x * 30) + "deg)";
      });
      stage.addEventListener("mouseleave", function () {
        logo.style.transform = "rotateX(6deg) rotateY(-8deg)";
      });
    }
  }

  /* ---------- Hero photo parallax tilt ---------- */
  var heroVisual = document.getElementById("heroVisual");
  var hero3d = heroVisual ? heroVisual.querySelector(".hero-3d") : null;

  if (heroVisual && hero3d && !prefersReducedMotion && canHover) {
    heroVisual.addEventListener("mousemove", function (e) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      hero3d.style.transform = "rotateY(" + (-8 + x * 14).toFixed(2) + "deg) rotateX(" + (4 - y * 14).toFixed(2) + "deg)";
    });
    heroVisual.addEventListener("mouseleave", function () {
      hero3d.style.transform = "rotateY(-8deg) rotateX(4deg)";
    });
  }

  /* ---------- Mobile nav ---------- */
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

  /* ---------- Scroll spy ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Skill bars ---------- */
  var skillFills = Array.prototype.slice.call(document.querySelectorAll(".skill-fill"));
  if (skillFills.length && "IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("data-value") + "%";
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(function (el) { skillObserver.observe(el); });
  } else {
    skillFills.forEach(function (el) { el.style.width = el.getAttribute("data-value") + "%"; });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }
})();
