// Lädt echte Google-Bewertungen über die Maps JavaScript API (Places-Bibliothek) und
// rendert sie als schlichte, rahmenlose Textkarten. Läuft ausschließlich clientseitig
// (der offiziell von Google unterstützte Weg für Browser-Anwendungen), daher MUSS der
// API-Key in der Google Cloud Console per HTTP-Referrer auf die eigene Domain
// eingeschränkt werden — siehe SETUP.md.
//
// Ohne konfigurierten API-Key/Place-ID passiert hier nichts: die bestehende, statische
// "Bewertungen auf Google ansehen"-Verlinkung bleibt sichtbar (progressive enhancement,
// kein kaputter Zustand ohne Konfiguration).
(function () {
  "use strict";

  var container = document.querySelector("[data-google-reviews]");
  if (!container) return;

  var apiKey = container.getAttribute("data-api-key") || "";
  var placeId = container.getAttribute("data-place-id") || "";
  if (!apiKey || !placeId) return; // nicht konfiguriert — statischer Fallback-Link bleibt stehen

  var MIN_RATING = 5;
  var VISIBLE_CARDS = 3;
  var ROTATE_MS = 8000;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var STAR_FULL =
    '<svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.7l-5.18 2.74.99-5.77L1.62 7.59l5.79-.84L10 1.5z"/></svg>';

  function renderStars(rating) {
    var count = Math.max(0, Math.min(5, Math.round(rating || 0)));
    var out = "";
    for (var i = 0; i < count; i++) out += STAR_FULL;
    return (
      '<span class="review-card-stars" aria-hidden="true">' + out + '</span>' +
      '<span class="visually-hidden">' + count + ' von 5 Sternen</span>'
    );
  }

  // Feste Textlänge statt variabler Kartenhöhe: eine lange Bewertung darf die
  // Karte nie aufblähen (das ließ vorher die ganze Seite darunter nach unten
  // springen, sobald die Rotation auf eine lange Bewertung wechselte). Ab
  // dieser Zeichenzahl wird gekappt und ein "mehr…"-Link zeigt die volle
  // Bewertung stattdessen im Glas-Popup (siehe openReviewLightbox unten).
  var TRUNCATE_AT = 160;

  function buildCardBody(r, poolIndex) {
    var fullText = r.text || "";
    var text = escapeHtml(fullText);
    var truncated = fullText.length > TRUNCATE_AT;
    if (truncated) {
      text = escapeHtml(fullText.slice(0, TRUNCATE_AT).replace(/\s+\S*$/, "")) + "…";
    }
    var author = escapeHtml(r.author_name || "Google-Nutzer");
    var when = escapeHtml(r.relative_time_description || "");
    return (
      renderStars(r.rating) +
      '<blockquote>„' + text + '“' +
      (truncated ? ' <button type="button" class="review-card-more" data-review-index="' + poolIndex + '">mehr…</button>' : "") +
      '</blockquote>' +
      '<figcaption><span class="review-card-author">' + author + '</span>' +
      (when ? '<span class="review-card-date">' + when + '</span>' : "") +
      '</figcaption>'
    );
  }

  // Glas-Popup für die volle Bewertung: gleiches Grundgerüst (Close/Prev/
  // Next-Button-Klassen, Escape/Swipe/Klick-außerhalb) wie die Bild-Lightbox
  // in main.js, aber mit einer Frosted-Glass-Karte statt einem Bild —
  // blättert per Pfeil durch ALLE geladenen Bewertungen, nicht nur die 3
  // sichtbaren Karten.
  var reviewLightbox = null;
  var rlPool = [];
  var rlIndex = 0;
  var rlLastFocused = null;

  function ensureReviewLightbox() {
    if (reviewLightbox) return reviewLightbox;
    reviewLightbox = document.createElement("div");
    reviewLightbox.className = "review-lightbox";
    reviewLightbox.setAttribute("role", "dialog");
    reviewLightbox.setAttribute("aria-modal", "true");
    reviewLightbox.setAttribute("aria-label", "Bewertung im Detail");
    reviewLightbox.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Schließen">×</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Vorherige Bewertung">‹</button>' +
      '<div class="review-lightbox-card"></div>' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Nächste Bewertung">›</button>';
    document.body.appendChild(reviewLightbox);

    var card = reviewLightbox.querySelector(".review-lightbox-card");
    var closeBtn = reviewLightbox.querySelector(".lightbox-close");
    var prevBtn = reviewLightbox.querySelector(".lightbox-prev");
    var nextBtn = reviewLightbox.querySelector(".lightbox-next");

    var showReview = function (index) {
      if (!rlPool.length) return;
      rlIndex = (index + rlPool.length) % rlPool.length;
      var r = rlPool[rlIndex];
      card.innerHTML =
        renderStars(r.rating) +
        '<blockquote>„' + escapeHtml(r.text || "") + '“</blockquote>' +
        '<figcaption><span class="review-card-author">' + escapeHtml(r.author_name || "Google-Nutzer") + '</span>' +
        (r.relative_time_description ? '<span class="review-card-date">' + escapeHtml(r.relative_time_description) + '</span>' : "") +
        '</figcaption>';
      var multi = rlPool.length > 1;
      prevBtn.style.display = multi ? "" : "none";
      nextBtn.style.display = multi ? "" : "none";
    };

    var closeReviewLightbox = function () {
      reviewLightbox.classList.remove("is-open");
      document.removeEventListener("keydown", onKeydown);
      if (rlLastFocused) rlLastFocused.focus();
    };
    var onKeydown = function (e) {
      if (e.key === "Escape") closeReviewLightbox();
      else if (e.key === "ArrowLeft") showReview(rlIndex - 1);
      else if (e.key === "ArrowRight") showReview(rlIndex + 1);
    };

    closeBtn.addEventListener("click", closeReviewLightbox);
    prevBtn.addEventListener("click", function () { showReview(rlIndex - 1); });
    nextBtn.addEventListener("click", function () { showReview(rlIndex + 1); });
    reviewLightbox.addEventListener("click", function (e) {
      if (e.target === reviewLightbox) closeReviewLightbox();
    });
    var touchStartX = null;
    reviewLightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    reviewLightbox.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) showReview(rlIndex + (dx < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });

    reviewLightbox._show = showReview;
    reviewLightbox._open = function (index) {
      rlLastFocused = document.activeElement;
      showReview(index);
      reviewLightbox.classList.add("is-open");
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    };
    return reviewLightbox;
  }

  function openReviewLightbox(pool, index) {
    rlPool = pool;
    var lb = ensureReviewLightbox();
    lb._open(index);
  }

  // Die Karten selbst bleiben starr im Grid stehen (kein Carousel, keine
  // horizontale Bewegung) — nur der Inhalt einer Karte blendet alle 8s sanft
  // zur nächsten Bewertung aus dem Pool über, falls mehr Bewertungen als
  // sichtbare Karten vorhanden sind.
  function renderReviews(reviews) {
    var pool = reviews.filter(function (r) { return r.rating >= MIN_RATING; });
    if (!pool.length) return; // keine passenden Bewertungen — Fallback-Link bleibt

    var visibleCount = Math.min(VISIBLE_CARDS, pool.length);
    var currentIndexByCard = [];
    var cardsHtml = "";
    for (var i = 0; i < visibleCount; i++) {
      currentIndexByCard.push(i);
      cardsHtml +=
        '<figure class="review-card reveal is-visible"><div class="review-card-body">' +
        buildCardBody(pool[i], i) +
        "</div></figure>";
    }

    container.innerHTML =
      '<div class="review-cards">' + cardsHtml + "</div>" +
      '<p class="review-attribution">Bewertungen von <a href="https://www.google.com/maps/place/?q=place_id:' +
      encodeURIComponent(placeId) +
      '" target="_blank" rel="noopener">Google</a></p>';

    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".review-card-more");
      if (!btn) return;
      openReviewLightbox(pool, parseInt(btn.getAttribute("data-review-index"), 10) || 0);
    });

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || pool.length <= visibleCount) return; // nichts zum Rotieren bzw. Bewegung reduziert

    var bodies = Array.prototype.slice.call(container.querySelectorAll(".review-card-body"));
    var offset = 0;
    window.setInterval(function () {
      offset += 1;
      bodies.forEach(function (body, i) {
        body.style.opacity = "0";
        window.setTimeout(function () {
          var poolIndex = (offset + i) % pool.length;
          currentIndexByCard[i] = poolIndex;
          body.innerHTML = buildCardBody(pool[poolIndex], poolIndex);
          body.style.opacity = "1";
        }, 1000);
      });
    }, ROTATE_MS);
  }

  function init() {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    var service = new window.google.maps.places.PlacesService(container);
    service.getDetails(
      { placeId: placeId, fields: ["reviews"] },
      function (place, status) {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !place ||
          !place.reviews
        ) {
          return; // stiller Fallback — bestehender statischer Link bleibt sichtbar
        }
        renderReviews(place.reviews);
      }
    );
  }

  var script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=" +
    encodeURIComponent(apiKey) +
    "&libraries=places&callback=__initGoogleReviews";
  script.async = true;
  script.defer = true;
  window.__initGoogleReviews = init;
  script.onerror = function () {}; // Netzwerk-/Key-Fehler: still scheitern, Fallback-Link bleibt
  document.head.appendChild(script);
})();
