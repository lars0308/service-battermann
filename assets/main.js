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

  // Wasserwaagen-Effekt: Porträt richtet sich direkt beim Laden aus der Schräge auf (kein Scroll nötig)
  var levelPortrait = document.getElementById("level-portrait");
  if (levelPortrait) {
    var levelCta = document.querySelector("[data-level-cta]");
    if (reduceMotion) {
      levelPortrait.classList.add("is-level");
      if (levelCta) levelCta.classList.add("is-visible");
    } else {
      var runLevelSequence = function () {
        var el = levelPortrait;
        // 1) Wasserwaage schiebt sich an die Oberkante
        el.classList.add("is-inview");
        // 2) Libelle wandert in die Mitte
        window.setTimeout(function () {
          el.classList.add("is-centered");
        }, 450);
        // 3) Bild richtet sich auf 0° aus, sobald die Libelle mittig steht ("In Waage!")
        window.setTimeout(function () {
          el.classList.add("is-level");
          if (levelCta) levelCta.classList.add("is-visible");
        }, 450 + 900);
        // 4) Wasserwaage blendet dezent nach rechts aus
        window.setTimeout(function () {
          el.classList.remove("is-inview");
        }, 450 + 900 + 200);
      };
      // Erst nach dem ersten Paint starten, damit die -3deg-Ausgangslage sichtbar ist
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(runLevelSequence);
      });
    }
  }

  // Schwebende Scroll-Lampe: wandert vom Hero in den Leistungen-Bereich und schaltet dort das Licht an
  var lamp = document.getElementById("scroll-lamp");
  var leistungenSection = document.getElementById("leistungen-list-section");
  var serviceList = document.getElementById("service-list");
  if (lamp && leistungenSection) {
    if (reduceMotion) {
      leistungenSection.classList.add("is-lit");
      if (serviceList) serviceList.classList.add("is-lit");
    } else {
      var lampLit = false;
      var lampTicking = false;
      var heroSection = document.getElementById("hero-split");
      var updateLamp = function () {
        lampTicking = false;
        if (!heroSection) return;
        // Absolute Seitenposition (unabhängig vom aktuellen Scroll-Stand), damit
        // der Fortschritt monoton von 0 auf 1 läuft statt mit der Viewport-Bewegung zu kippen.
        var heroBottomAbs = heroSection.getBoundingClientRect().bottom + window.scrollY;
        var targetRect = leistungenSection.getBoundingClientRect();
        var targetTopAbs = targetRect.top + window.scrollY + targetRect.height * 0.15;
        var travel = targetTopAbs - heroBottomAbs;
        if (travel <= 0) travel = 1;
        var progress = (window.scrollY - heroBottomAbs) / travel;
        progress = Math.max(0, Math.min(1, progress));

        if (progress > 0) {
          lamp.classList.add("is-active");
        } else {
          lamp.classList.remove("is-active");
        }

        var y = -120 + progress * 216; // wandert von -120px (versteckt) auf 96px (an der Sektion)
        lamp.style.transform = "translateY(" + y.toFixed(1) + "px)";

        if (progress >= 0.98 && !lampLit) {
          lampLit = true;
          lamp.classList.add("is-lit");
          leistungenSection.classList.add("is-lit");
          if (serviceList) serviceList.classList.add("is-lit");
        }
      };
      updateLamp();
      window.addEventListener(
        "scroll",
        function () {
          if (!lampTicking) {
            window.requestAnimationFrame(updateLamp);
            lampTicking = true;
          }
        },
        { passive: true }
      );
    }
  } else if (leistungenSection) {
    // Kein Lampen-Element (z. B. andere Seite) — Liste trotzdem sichtbar machen
    leistungenSection.classList.add("is-lit");
    if (serviceList) serviceList.classList.add("is-lit");
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
  if (vnContainer) {
    fetch("content/vorher-nachher.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : { projekte: [] }; })
      .then(function (data) {
        var projekte = data.projekte || [];
        vnContainer.innerHTML = projekte
          .map(function (p, i) {
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
