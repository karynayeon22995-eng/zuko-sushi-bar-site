/* Zuko Sushi Bar — order page category scroll-spy (UI only, no ordering logic) */
(function () {
  "use strict";
  var sections = document.querySelectorAll(".order-cat");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  var links = document.querySelectorAll(".order-cats__link, .order-chips a");
  var map = {};
  links.forEach(function (l) {
    var id = (l.getAttribute("href") || "").replace(/^#/, "");
    if (id) { (map[id] = map[id] || []).push(l); }
  });

  function setActive(id) {
    Object.keys(map).forEach(function (k) {
      map[k].forEach(function (l) { l.classList.toggle("is-active", k === id); });
    });
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: "-25% 0px -68% 0px", threshold: 0 });

  sections.forEach(function (s) { obs.observe(s); });
})();
