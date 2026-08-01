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

  // Apple-Mega-Menü: stabiles Hover-Verhalten mit kurzer Schließ-Verzögerung, statt reinem
  // CSS :hover. Reines :hover schließt technisch nicht bei einem DOM-Kind (auch nicht bei
  // fixed-position Panels), aber jede kurze Verzögerung beim Umschwenken der Maus (z. B.
  // schnelle/diagonale Bewegung) kann das Panel unnötig kurz zuklappen lassen — die
  // Verzögerung fängt das ab. Nur auf echten Hover-Geräten aktiv (Desktop mit Maus).
  if (window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(".nav-item.has-mega").forEach(function (item) {
      var closeTimer = null;
      var open = function () {
        if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null; }
        item.classList.add("mega-open");
      };
      var scheduleClose = function () {
        if (closeTimer) window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
          item.classList.remove("mega-open");
          closeTimer = null;
        }, 250);
      };
      item.addEventListener("mouseenter", open);
      item.addEventListener("mouseleave", scheduleClose);
      item.addEventListener("focusin", open);
      item.addEventListener("focusout", function (e) {
        if (!item.contains(e.relatedTarget)) scheduleClose();
      });
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

  // "Kit-Fokus-Impuls" (Ruhezustand) + Split-Screen-Glasfenster (manuelle Interaktion):
  // Im Ruhezustand läuft ein sehr langsamer Endlos-Loop, der die 5 Kacheln nacheinander
  // dezent anhebt — reine Einladung, OHNE das Glasfenster zu öffnen. Sobald der Nutzer
  // selbst hovert/tippt, pausiert der Loop sofort, die Kachel schiebt sich links ins
  // Bild vor, das Glasfenster öffnet sich. Verlässt die Maus die Kacheln, startet der
  // Loop wieder von vorn.
  var kitContainer = document.querySelector(".leistung-cards");
  var kitCards = Array.prototype.slice.call(document.querySelectorAll(".leistung-cards .leistung-card"));
  var glassSplit = document.querySelector(".leistung-split");
  var glassPanel = document.querySelector("[data-leistung-glass]");
  var glassTitle = document.querySelector("[data-leistung-glass-title]");
  var glassDesc = document.querySelector("[data-leistung-glass-desc]");
  // Als window-Property statt lokaler Konstante, damit sanity-content.js sie live
  // ersetzen kann (Lars pflegt Tempo/Skalierung/Abdunklung in Sanity statt im Code).
  window.__kitCardIntervalMs = 3000;

  if (kitContainer && kitCards.length) {
    var kitTimers = [];
    var kitPaused = false;
    var kitLoopStarted = false;

    var clearKitTimers = function () {
      kitTimers.forEach(function (t) { window.clearTimeout(t); });
      kitTimers = [];
    };
    var clearAutoClasses = function () {
      kitContainer.classList.remove("is-sequencing");
      kitCards.forEach(function (c) { c.classList.remove("is-focus-active"); });
    };

    var runPulseCycle = function () {
      if (kitPaused || reduceMotion) return;
      var stepMs = window.__kitCardIntervalMs;
      kitContainer.classList.add("is-sequencing");
      kitCards.forEach(function (card, i) {
        kitTimers.push(
          window.setTimeout(function () {
            if (kitPaused) return;
            kitCards.forEach(function (c) { c.classList.remove("is-focus-active"); });
            card.classList.add("is-focus-active");
          }, i * stepMs)
        );
      });
      // Nach einer vollen Runde: kurz zurücksetzen, dann von vorn — echter Loop,
      // solange der Nutzer nicht pausiert hat.
      kitTimers.push(
        window.setTimeout(function () {
          if (kitPaused) return;
          clearAutoClasses();
          kitTimers.push(window.setTimeout(runPulseCycle, stepMs * 0.5));
        }, kitCards.length * stepMs)
      );
    };

    var startLoop = function () {
      if (kitLoopStarted || reduceMotion) return;
      kitLoopStarted = true;
      runPulseCycle();
    };
    var pauseLoop = function () {
      kitPaused = true;
      clearKitTimers();
      clearAutoClasses();
    };
    var resumeLoop = function () {
      if (!kitLoopStarted) return;
      kitPaused = false;
      clearKitTimers();
      runPulseCycle();
    };

    // Positioniert das Glasfenster direkt rechts neben der gehoverten Kachel (statt
    // einer festen Sidebar) — nur auf breiten Hover-Bildschirmen relevant, auf
    // schmalen/Touch-Geräten überschreibt eine CSS-Regel mit !important die hier
    // gesetzten inline-Werte und lässt das Fenster stattdessen im Fluss stehen.
    var positionGlassPanel = function (card) {
      if (!glassPanel || !glassSplit) return;
      var containerRect = glassSplit.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var panelWidth = glassPanel.offsetWidth || 300;
      var panelHeight = glassPanel.offsetHeight || 200;
      var left = cardRect.right - containerRect.left + 16;
      var maxLeft = containerRect.width - panelWidth;
      if (left > maxLeft) left = Math.max(0, maxLeft);
      var top = cardRect.top - containerRect.top + cardRect.height / 2 - panelHeight / 2;
      if (top < 0) top = 0;
      var maxTop = glassSplit.offsetHeight - panelHeight;
      if (maxTop > 0 && top > maxTop) top = maxTop;
      glassPanel.style.left = left + "px";
      glassPanel.style.top = top + "px";
    };

    var showCardInGlass = function (card) {
      if (!glassPanel || !glassTitle || !glassDesc) return;
      var titleEl = card.querySelector(".leistung-card-title");
      var title = titleEl ? titleEl.textContent.trim() : "";
      var desc = card.getAttribute("data-short-desc") || "";
      glassPanel.classList.add("is-updating");
      window.setTimeout(
        function () {
          glassTitle.textContent = title;
          glassDesc.textContent = desc;
          glassPanel.classList.remove("is-updating");
        },
        reduceMotion ? 0 : 120
      );
      kitCards.forEach(function (c) { c.classList.remove("is-hover-active"); });
      card.classList.add("is-hover-active");
      kitContainer.classList.add("is-hovering");
      positionGlassPanel(card);
      glassPanel.classList.add("is-floating-visible");
    };
    var resetGlass = function () {
      kitContainer.classList.remove("is-hovering");
      kitCards.forEach(function (c) { c.classList.remove("is-hover-active"); });
      if (glassPanel) glassPanel.classList.remove("is-floating-visible");
    };

    kitCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () { pauseLoop(); showCardInGlass(card); });
      card.addEventListener("focus", function () { pauseLoop(); showCardInGlass(card); });
      card.addEventListener("touchstart", function () { pauseLoop(); showCardInGlass(card); }, { passive: true });
    });
    kitContainer.addEventListener("mouseleave", function () {
      resetGlass();
      resumeLoop();
    });

    if (!reduceMotion && "IntersectionObserver" in window) {
      var kitIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              startLoop();
              kitIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      kitIo.observe(kitContainer);
    }
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
