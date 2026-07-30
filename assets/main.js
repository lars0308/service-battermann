// Objekt- & Reparaturservice Battermann — Grundfunktionen
(function () {
  "use strict";

  // Mobile Navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  // Flüssiges Fade-in-up beim Scrollen (40px, 0.8s) — respektiert prefers-reduced-motion
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Großformatige Typografie-Sektion: Zeilen fahren einzeln hoch
  var typeHero = document.querySelector(".type-hero");
  if (typeHero) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      typeHero.classList.add("is-visible");
    } else {
      var typeIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              typeIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      typeIo.observe(typeHero);
    }
  }

  // Hero-Slider: Bilder + Headline wechseln synchron (reines Fade/Slide, keine Rotation)
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var heroLines = Array.prototype.slice.call(document.querySelectorAll(".hero-slide-line"));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-slide-dot"));
  if (heroSlides.length && heroLines.length) {
    var HERO_CYCLE_MS = 5200;
    var heroCurrent = 0;
    var heroTimer = null;

    var activateHeroSlide = function (index) {
      heroSlides.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
      heroDots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
        d.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      heroLines.forEach(function (l, i) { l.classList.toggle("is-active", i === index); });
      heroCurrent = index;
    };

    var scheduleNext = function () {
      if (reduceMotion) return;
      heroTimer = window.setTimeout(function () {
        activateHeroSlide((heroCurrent + 1) % heroSlides.length);
        scheduleNext();
      }, HERO_CYCLE_MS);
    };

    heroDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        if (heroTimer) window.clearTimeout(heroTimer);
        activateHeroSlide(i);
        scheduleNext();
      });
    });

    activateHeroSlide(0);
    scheduleNext();
  }

  // Leistungen-Liste: Zeilen per Klick/Tap öffnen (Hover übernimmt das für Maus-Nutzer per CSS)
  var serviceToggles = document.querySelectorAll(".service-row-toggle");
  serviceToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".service-row");
      if (!row) return;
      var isOpen = row.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  // Permanenter Contact-Trigger: erscheint dezent nach dem Scrollen über den Hero-Bereich
  var fabGroup = document.querySelector(".fab-group");
  if (fabGroup) {
    var heroEl = document.querySelector(".hero");
    var fabThreshold = heroEl ? heroEl.offsetHeight * 0.6 : 400;
    var fabTicking = false;
    var updateFab = function () {
      fabTicking = false;
      if (window.scrollY > fabThreshold) {
        fabGroup.classList.add("is-visible");
      } else {
        fabGroup.classList.remove("is-visible");
      }
    };
    updateFab();
    window.addEventListener(
      "scroll",
      function () {
        if (!fabTicking) {
          window.requestAnimationFrame(updateFab);
          fabTicking = true;
        }
      },
      { passive: true }
    );
  }

  // Dezenter Scroll-Parallax auf großen Split-Bildern — respektiert prefers-reduced-motion
  if (!reduceMotion) {
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll(".split-media[data-parallax]"));
    if (parallaxEls.length) {
      var parallaxTicking = false;
      var updateParallax = function () {
        parallaxTicking = false;
        var vh = window.innerHeight;
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -0.5..0.5 etwa
          var shift = Math.max(-1, Math.min(1, progress)) * -24; // max 24px Verschiebung
          el.style.setProperty("--parallax-y", shift.toFixed(1) + "px");
        });
      };
      updateParallax();
      window.addEventListener(
        "scroll",
        function () {
          if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
          }
        },
        { passive: true }
      );
    }
  }

  // Google Maps: erst nach aktiver Einwilligung laden (siehe Datenschutzerklärung)
  var mapConsentBtn = document.querySelector("[data-map-consent]");
  if (mapConsentBtn) {
    mapConsentBtn.addEventListener("click", function () {
      var wrap = document.querySelector("[data-map-wrap]");
      var src = wrap.getAttribute("data-map-src");
      wrap.innerHTML =
        '<iframe src="' + src + '" width="100%" height="420" style="border:0;border-radius:6px" ' +
        'loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Karte Einsatzgebiet"></iframe>';
      try { localStorage.setItem("mapsConsent", "1"); } catch (e) {}
    });
    try {
      if (localStorage.getItem("mapsConsent") === "1") { mapConsentBtn.click(); }
    } catch (e) {}
  }

  // Datei-Upload: Dateinamen anzeigen
  var fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var label = document.querySelector("[data-file-label]");
      if (!label) return;
      if (fileInput.files.length === 0) {
        label.textContent = "";
      } else if (fileInput.files.length === 1) {
        label.textContent = fileInput.files[0].name;
      } else {
        label.textContent = fileInput.files.length + " Dateien ausgewählt";
      }
    });
  }

  // Vorher/Nachher-Projekte aus content/vorher-nachher.json laden (per CMS pflegbar)
  var vnContainer = document.querySelector("[data-vn-container]");
  var vnSlots = document.querySelectorAll("[data-vn-slot]");
  if (vnContainer || vnSlots.length) {
    fetch("content/vorher-nachher.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : { projekte: [] }; })
      .then(function (data) {
        var projekte = data.projekte || [];

        if (vnContainer) {
          vnContainer.innerHTML = projekte
            .map(function (p) {
              return (
                '<div class="vn-block reveal is-visible">' +
                '<p style="font-family:\'Montserrat\',sans-serif;font-weight:700;margin-bottom:10px">' +
                escapeHtml(p.titel || "") +
                "</p>" +
                (p.beschreibung ? "<p>" + escapeHtml(p.beschreibung) + "</p>" : "") +
                '<div class="vn-pair">' +
                '<figure><img src="' + p.vorher_bild + '" alt="' + escapeHtml(p.vorher_alt || "") + '" loading="lazy"><figcaption>Vorher</figcaption></figure>' +
                '<figure><img src="' + p.nachher_bild + '" alt="' + escapeHtml(p.nachher_alt || "") + '" loading="lazy"><figcaption>Nachher</figcaption></figure>' +
                "</div></div>"
              );
            })
            .join("");
        }

        vnSlots.forEach(function (slot) {
          var kategorie = slot.getAttribute("data-vn-slot");
          var match = projekte.filter(function (p) { return p.kategorie === kategorie; })[0];
          if (!match) return; // keine passenden Fotos vorhanden — Slot bleibt leer (via :empty ausgeblendet)
          slot.innerHTML =
            '<figure><img src="' + match.vorher_bild + '" alt="' + escapeHtml(match.vorher_alt || "") + '" loading="lazy"><figcaption>Vorher</figcaption></figure>' +
            '<figure><img src="' + match.nachher_bild + '" alt="' + escapeHtml(match.nachher_alt || "") + '" loading="lazy"><figcaption>Nachher</figcaption></figure>';
        });
      })
      .catch(function () {});
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Cookie-/Hinweisbanner: Einwilligung bzw. Kenntnisnahme, bevor optionale Inhalte (Karte) geladen werden
  var COOKIE_KEY = "cookieNoticeAck";
  var banner = document.querySelector("[data-cookie-banner]");
  if (banner) {
    var ack;
    try { ack = localStorage.getItem(COOKIE_KEY); } catch (e) { ack = null; }
    if (!ack) {
      banner.hidden = false;
    }
    var acceptBtn = banner.querySelector("[data-cookie-accept]");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        try { localStorage.setItem(COOKIE_KEY, "1"); } catch (e) {}
        banner.hidden = true;
      });
    }
  }
})();
