// Sanity "Hot-Patch": Die Seite ist und bleibt statisches HTML (SEO/erstes Rendering
// unverändert schnell). Nach dem Laden wird EINMAL anonym aus dem öffentlich lesbaren
// Sanity-Dataset nachgefragt und passende [data-sanity-field]-Elemente aktualisiert.
//
// Kein API-Token im Client (bewusst: das Dataset ist auf "public read" gestellt,
// siehe studio-website/README.md) — nur die offizielle, für Browser vorgesehene
// APICDN-Route wird verwendet.
//
// Bricht der Fetch ab (Netzwerk, Firewall, Sanity down, Dataset leer): stiller
// Fallback, die bereits gerenderten statischen Inhalte bleiben unverändert stehen.
// Es wird nie eine Sanity-Fehlermeldung sichtbar, nie eine leere Fläche erzeugt.
(function () {
  "use strict";

  var fields = document.querySelectorAll("[data-sanity-field]");
  if (!fields.length) return; // diese Seite hat nichts zu patchen

  var PROJECT_ID = "9bz9h1mi";
  var DATASET = "production";
  var QUERY =
    '{"hero":*[_type=="heroSlide"]|order(order asc){order,prefix,verb,roundTexts,dotLabel,"imageUrl":image.asset->url},' +
    '"trust":*[_type=="trustPoint"]|order(order asc){order,text},' +
    '"services":*[_type=="service"]|order(order asc){order,"anchor":anchorId.current,verb,title,requiresLegalNote,description,"cardImageUrl":cardImage.asset->url},' +
    '"contact":*[_type=="contactInfo"][0]{phone,phoneHref,whatsapp,email,openingHours},' +
    '"settings":*[_type=="siteSettings"][0]{companyName,ownerName,legalNotice}}';
  var ENDPOINT =
    "https://" + PROJECT_ID + ".apicdn.sanity.io/v2024-01-01/data/query/" + DATASET + "?query=" + encodeURIComponent(QUERY);

  function buildFieldMap(data) {
    var map = {};
    var hero = data.hero || [];
    hero.forEach(function (doc, i) {
      if (doc.verb) map["hero." + i + ".verb"] = doc.verb;
      if (doc.imageUrl) map["hero." + i + ".imageUrl"] = doc.imageUrl;
    });
    if (hero[0] && Array.isArray(hero[0].roundTexts) && hero[0].roundTexts.length) {
      map["hero.0.roundTexts"] = hero[0].roundTexts;
    }
    (data.trust || []).forEach(function (doc, i) {
      if (doc.text) map["trust." + i + ".text"] = doc.text;
    });
    (data.services || []).forEach(function (doc, i) {
      if (doc.title) map["services." + i + ".title"] = doc.title;
      if (doc.cardImageUrl) map["services." + i + ".cardImageUrl"] = doc.cardImageUrl;
    });
    if (data.contact) {
      ["phone", "phoneHref", "whatsapp", "email", "openingHours"].forEach(function (key) {
        if (data.contact[key]) map["contact." + key] = data.contact[key];
      });
    }
    if (data.settings && data.settings.legalNotice) {
      map["settings.legalNotice"] = data.settings.legalNotice;
    }
    return map;
  }

  // Bild sanft nachladen statt abrupt zu tauschen: erst im Hintergrund vorladen,
  // dann kurz ausblenden/einblenden statt eines sichtbaren "Pop".
  function patchImageSmooth(imgEl, newSrc) {
    if (!newSrc || imgEl.src === newSrc) return;
    var preload = new Image();
    preload.onload = function () {
      var prevTransition = imgEl.style.transition;
      imgEl.style.transition = prevTransition || "opacity 0.35s ease";
      imgEl.style.opacity = "0";
      window.setTimeout(function () {
        imgEl.src = newSrc;
        imgEl.style.opacity = "1";
      }, 220);
    };
    preload.onerror = function () {}; // defekte/gelöschte Sanity-Bild-URL -> statisches Bild bleibt stehen
    preload.src = newSrc;
  }

  function applyPatches(map) {
    fields.forEach(function (el) {
      var field = el.getAttribute("data-sanity-field");

      // Sonderfall: rotierende Texte der ersten Hero-Zeile sind kein einzelner
      // Wert, sondern eine Liste, die main.js selbst weiterdreht (siehe dort).
      if (field === "hero.0.roundTexts") {
        if (map[field]) window.__heroRoundTexts = map[field];
        return;
      }

      var value = map[field];
      if (!value) return; // kein Sanity-Wert -> statischer HTML-Inhalt bleibt stehen

      var attr = el.getAttribute("data-sanity-attr");
      if (attr === "href") {
        var prefix = el.getAttribute("data-sanity-prefix") || "";
        el.setAttribute("href", prefix + value);
      } else if (attr === "src") {
        patchImageSmooth(el, value);
      } else {
        el.textContent = value;
      }
    });
  }

  // Hero-Hintergrundbilder: nur austauschen, während die Folie NICHT sichtbar ist,
  // damit auf der Startseite nie ein sichtbares Umspringen des aktiven Bilds passiert.
  function patchHeroBackgrounds(map) {
    var slides = document.querySelectorAll(".hero-slide[data-hero-slide-index]");
    slides.forEach(function (slideEl) {
      var i = slideEl.getAttribute("data-hero-slide-index");
      var url = map["hero." + i + ".imageUrl"];
      if (!url) return;
      var setBg = function () {
        slideEl.style.backgroundImage = "url('" + url + "')";
      };
      if (!slideEl.classList.contains("is-active")) {
        setBg();
        return;
      }
      var observer = new MutationObserver(function () {
        if (!slideEl.classList.contains("is-active")) {
          setBg();
          observer.disconnect();
        }
      });
      observer.observe(slideEl, { attributes: true, attributeFilter: ["class"] });
    });
  }

  var controller = "AbortController" in window ? new AbortController() : null;
  var timeoutId = controller
    ? window.setTimeout(function () {
        controller.abort();
      }, 5000)
    : null;

  fetch(ENDPOINT, { signal: controller ? controller.signal : undefined, cache: "no-store" })
    .then(function (res) {
      return res.ok ? res.json() : Promise.reject(new Error("Sanity-Antwort: HTTP " + res.status));
    })
    .then(function (json) {
      if (timeoutId) window.clearTimeout(timeoutId);
      var data = (json && json.result) || {};
      var map = buildFieldMap(data);
      applyPatches(map);
      patchHeroBackgrounds(map);
    })
    .catch(function (err) {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (window.console && console.info) {
        console.info("[sanity-content] Live-Inhalte nicht geladen, zeige statischen Stand.", err && err.message);
      }
    });
})();
