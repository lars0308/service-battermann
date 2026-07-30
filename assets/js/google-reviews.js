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
  var MAX_CARDS = 3;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderReviews(reviews) {
    var fiveStar = reviews
      .filter(function (r) { return r.rating >= MIN_RATING; })
      .slice(0, MAX_CARDS);

    if (!fiveStar.length) return; // keine passenden Bewertungen — Fallback-Link bleibt

    var html = fiveStar
      .map(function (r) {
        var text = r.text ? escapeHtml(r.text) : "";
        var author = escapeHtml(r.author_name || "Google-Nutzer");
        return (
          '<figure class="review-card reveal is-visible">' +
          '<blockquote>„' + text + '“</blockquote>' +
          '<figcaption>' + author + '</figcaption>' +
          "</figure>"
        );
      })
      .join("");

    container.innerHTML =
      '<div class="review-cards">' + html + "</div>" +
      '<p class="review-attribution">Bewertungen von <a href="https://www.google.com/maps/place/?q=place_id:' +
      encodeURIComponent(placeId) +
      '" target="_blank" rel="noopener">Google</a></p>';
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
