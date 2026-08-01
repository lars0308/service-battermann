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

  // "Kit-Fokus-Impuls": Die 5 Leistungskacheln werden beim ersten Erreichen der Sektion
  // EINMALIG nacheinander kurz hervorgehoben (kein Dauerloop, kein Blinken). Hover/Touch
  // durch den Nutzer bricht die Sequenz sofort ab und macht dem normalen Hover-Zustand Platz.
  var kitContainer = document.querySelector(".leistung-cards");
  var kitCards = Array.prototype.slice.call(document.querySelectorAll(".leistung-cards .leistung-card"));
  // Als window-Property statt lokaler Konstante, damit sanity-content.js sie live
  // ersetzen kann (Lars pflegt Tempo/Skalierung/Abdunklung in Sanity statt im Code).
  window.__kitCardIntervalMs = 3000;
  if (kitContainer && kitCards.length && !reduceMotion && "IntersectionObserver" in window) {
    var kitTimers = [];
    var kitRunning = false;

    var stopKitImpuls = function () {
      kitTimers.forEach(function (t) { window.clearTimeout(t); });
      kitTimers = [];
      kitRunning = false;
      kitContainer.classList.remove("is-sequencing");
      kitCards.forEach(function (c) { c.classList.remove("is-focus-active"); });
    };

    var runKitImpuls = function () {
      if (kitRunning) return;
      kitRunning = true;
      var stepMs = window.__kitCardIntervalMs;
      kitContainer.classList.add("is-sequencing");
      kitCards.forEach(function (card, i) {
        kitTimers.push(
          window.setTimeout(function () {
            kitCards.forEach(function (c) { c.classList.remove("is-focus-active"); });
            card.classList.add("is-focus-active");
            if (i === kitCards.length - 1) {
              kitTimers.push(window.setTimeout(stopKitImpuls, stepMs));
            }
          }, i * stepMs)
        );
      });
    };

    kitCards.forEach(function (card) {
      card.addEventListener("mouseenter", stopKitImpuls);
      card.addEventListener("focus", stopKitImpuls);
      card.addEventListener("touchstart", stopKitImpuls, { passive: true });
    });

    var kitIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runKitImpuls();
            kitIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    kitIo.observe(kitContainer);
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
  // Der Text der ersten Zeile rotiert über volle Zyklen hinweg (3 Runden, dann von vorn).
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var heroLines = Array.prototype.slice.call(document.querySelectorAll(".hero-slide-line"));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-slide-dot"));
  var heroRoundEl = document.querySelector("[data-hero-round-text]");
  // Als window-Property statt lokaler Konstante, damit sanity-content.js die Liste
  // live ersetzen kann (Lars pflegt die 3 Textvarianten in Sanity statt im Code).
  window.__heroRoundTexts = ["ist persönlich für Sie da", "kümmert sich selbst darum", "steht für sein Wort"];
  // Gleiches Prinzip für die Wechselgeschwindigkeit (Sanity: Website-Einstellungen → Hero).
  window.__heroAutoplayMs = 5200;
  if (heroSlides.length && heroLines.length) {
    var heroCurrent = 0;
    var heroRound = 0;
    var heroTimer = null;

    var activateHeroSlide = function (index) {
      if (index === 0 && heroCurrent === heroSlides.length - 1 && heroRoundEl) {
        var texts = window.__heroRoundTexts;
        heroRound = (heroRound + 1) % texts.length;
        heroRoundEl.textContent = texts[heroRound];
      }
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
      }, window.__heroAutoplayMs);
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

  // Leistungen-Akkordeon: Klick öffnet eine Zeile, alle anderen schließen automatisch
  var serviceToggles = document.querySelectorAll(".service-row-toggle");
  serviceToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".service-row");
      if (!row) return;
      var willOpen = !row.classList.contains("is-open");
      var list = row.closest(".service-list");
      if (list) {
        list.querySelectorAll(".service-row.is-open").forEach(function (openRow) {
          openRow.classList.remove("is-open");
          var openBtn = openRow.querySelector(".service-row-toggle");
          if (openBtn) openBtn.setAttribute("aria-expanded", "false");
        });
      }
      row.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  // Direktlink zu einem Leistungsbereich (z. B. leistungen.html#leistung-garten):
  // passende Zeile automatisch öffnen und dorthin scrollen, statt geschlossen liegenzulassen.
  if (window.location.hash) {
    var targetRow = document.querySelector(".service-list " + window.location.hash);
    if (targetRow && targetRow.classList.contains("service-row")) {
      var targetBtn = targetRow.querySelector(".service-row-toggle");
      if (targetBtn) {
        targetRow.classList.add("is-open");
        targetBtn.setAttribute("aria-expanded", "true");
        window.setTimeout(function () {
          targetRow.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }, 50);
      }
    }

    // Gleiches Prinzip für Direktlinks aus dem Mega-Menü auf einzelne FAQ-Einträge
    // (z. B. einsatzgebiet-faq.html#faq-kosten): passendes <details> öffnen.
    var targetFaq = document.querySelector(".faq-item" + window.location.hash);
    if (targetFaq && targetFaq.tagName === "DETAILS") {
      targetFaq.setAttribute("open", "");
      window.setTimeout(function () {
        targetFaq.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }, 50);
    }
  }

  // Lightbox: Vollbild-Ansicht für Projektbilder in geöffneten Akkordeon-Bereichen
  var lightboxTriggerSelector = "[data-lightbox-img], .service-row-vn img";
  var lightboxImgs = Array.prototype.slice.call(document.querySelectorAll(lightboxTriggerSelector));
  if (lightboxImgs.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Bildansicht");
    lightbox.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Schließen">×</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Vorheriges Bild">‹</button>' +
      '<img class="lightbox-img" alt="">' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Nächstes Bild">›</button>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector(".lightbox-img");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-prev");
    var lbNext = lightbox.querySelector(".lightbox-next");
    var lbGroup = [];
    var lbIndex = 0;
    var lbLastFocused = null;

    var refreshLightboxImgs = function () {
      return Array.prototype.slice.call(document.querySelectorAll(lightboxTriggerSelector));
    };

    var showLightboxImg = function (index) {
      if (!lbGroup.length) return;
      lbIndex = (index + lbGroup.length) % lbGroup.length;
      var target = lbGroup[lbIndex];
      lbImg.src = target.currentSrc || target.src;
      lbImg.alt = target.alt || "";
      var multi = lbGroup.length > 1;
      lbPrev.style.display = multi ? "" : "none";
      lbNext.style.display = multi ? "" : "none";
    };

    var openLightbox = function (img) {
      var group = img.closest(".service-row-gallery, .service-row-vn");
      lbGroup = group ? Array.prototype.slice.call(group.querySelectorAll("img")) : [img];
      lbLastFocused = document.activeElement;
      showLightboxImg(lbGroup.indexOf(img));
      lightbox.classList.add("is-open");
      lbClose.focus();
      document.addEventListener("keydown", onLightboxKeydown);
    };

    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      document.removeEventListener("keydown", onLightboxKeydown);
      if (lbLastFocused) lbLastFocused.focus();
    };

    var onLightboxKeydown = function (e) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showLightboxImg(lbIndex - 1);
      else if (e.key === "ArrowRight") showLightboxImg(lbIndex + 1);
    };

    document.addEventListener("click", function (e) {
      var img = e.target.closest(lightboxTriggerSelector);
      if (img && refreshLightboxImgs().indexOf(img) !== -1) {
        openLightbox(img);
      }
    });
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showLightboxImg(lbIndex - 1); });
    lbNext.addEventListener("click", function () { showLightboxImg(lbIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    var lbTouchStartX = null;
    lightbox.addEventListener("touchstart", function (e) {
      lbTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (lbTouchStartX === null) return;
      var dx = e.changedTouches[0].clientX - lbTouchStartX;
      if (Math.abs(dx) > 40) showLightboxImg(lbIndex + (dx < 0 ? 1 : -1));
      lbTouchStartX = null;
    }, { passive: true });
  }

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

  // Vorher/Nachher-Projekte: zunächst aus content/vorher-nachher.json (statischer
  // Startzustand), danach von sanity-content.js überschrieben, sobald echte
  // Sanity-Projekte geladen sind (siehe window.__renderVnProjekte weiter unten —
  // Sanity ist die Quelle der Wahrheit, die JSON-Datei ist nur der Fallback/Seed).
  var vnContainer = document.querySelector("[data-vn-container]");
  var vnSlots = document.querySelectorAll("[data-vn-slot]");
  function renderVnProjekte(projekte) {
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
  }
  window.__renderVnProjekte = renderVnProjekte;
  if (vnContainer || vnSlots.length) {
    fetch("content/vorher-nachher.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : { projekte: [] }; })
      .then(function (data) { renderVnProjekte(data.projekte || []); })
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
