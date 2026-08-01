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
  // Bild-URLs bekommen direkt in der Query den Schärfe-/Format-Parameter mit
  // (Sanitys Bild-CDN versteht dieselben URL-Parameter wie andere Bild-CDNs).
  var IMG_SUFFIX = '+"?auto=format&q=90"';
  var QUERY =
    '{"hero":*[_type=="heroSlide"]|order(order asc){order,prefix,verb,roundTexts,dotLabel,"imageUrl":image.asset->url' + IMG_SUFFIX + '},' +
    '"trust":*[_type=="trustPoint"]|order(order asc){order,text},' +
    '"services":*[_type=="service"]|order(order asc){order,"anchor":anchorId.current,verb,title,requiresLegalNote,description,"cardImageUrl":cardImage.asset->url' + IMG_SUFFIX + '},' +
    '"faq":*[_type=="faqEntry"]|order(order asc){order,question,answer},' +
    '"contact":*[_type=="contactInfo"][0]{phone,phoneHref,whatsapp,email,openingHours},' +
    '"settings":*[_type=="siteSettings"][0]{companyName,ownerName,legalNotice,navLeistungen,navUeberMich,navEinsatzgebiet,navKontakt,heroEyebrow,heroAutoplayMs,staticFormsApiKey,"logoIconUrl":logoIcon.asset->url' + IMG_SUFFIX + '}}';
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
      if (doc.description) map["services." + i + ".description"] = doc.description;
      if (doc.cardImageUrl) map["services." + i + ".cardImageUrl"] = doc.cardImageUrl;
    });
    (data.faq || []).forEach(function (doc, i) {
      if (doc.question) map["faq." + i + ".question"] = doc.question;
      if (doc.answer) map["faq." + i + ".answer"] = doc.answer;
    });
    if (data.contact) {
      ["phone", "phoneHref", "whatsapp", "email", "openingHours"].forEach(function (key) {
        if (data.contact[key]) map["contact." + key] = data.contact[key];
      });
    }
    if (data.settings) {
      [
        "legalNotice",
        "navLeistungen",
        "navUeberMich",
        "navEinsatzgebiet",
        "navKontakt",
        "heroEyebrow",
        "staticFormsApiKey",
        "logoIconUrl",
      ].forEach(function (key) {
        if (data.settings[key]) map["settings." + key] = data.settings[key];
      });
      if (typeof data.settings.heroAutoplayMs === "number" && data.settings.heroAutoplayMs >= 2000) {
        map["settings.heroAutoplayMs"] = data.settings.heroAutoplayMs;
      }
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

      // Sonderfälle: Werte, die main.js selbst weiterverarbeitet statt sie
      // direkt ins DOM zu schreiben (siehe dort).
      if (field === "hero.0.roundTexts") {
        if (map[field]) window.__heroRoundTexts = map[field];
        return;
      }

      var value = map[field];
      if (!value) return; // kein Sanity-Wert -> statischer HTML-Inhalt bleibt stehen

      var attr = el.getAttribute("data-sanity-attr");
      if (!attr) {
        el.textContent = value;
        return;
      }
      if (attr === "src") {
        patchImageSmooth(el, value);
        return;
      }
      // Generisch für href/value/oder jedes andere Attribut: optionaler Prefix
      // (z. B. "tel:", "mailto:") wird vorangestellt, sonst 1:1 übernommen.
      var prefix = el.getAttribute("data-sanity-prefix") || "";
      el.setAttribute(attr, prefix + value);
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
      // Reine Verhaltens-Einstellung ohne eigenes DOM-Element zum Anhängen —
      // direkt anwenden, statt auf ein [data-sanity-field] zu warten, das es nicht gibt.
      if (map["settings.heroAutoplayMs"]) {
        window.__heroAutoplayMs = map["settings.heroAutoplayMs"];
      }
    })
    .catch(function (err) {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (window.console && console.info) {
        console.info("[sanity-content] Live-Inhalte nicht geladen, zeige statischen Stand.", err && err.message);
      }
    });
})();
