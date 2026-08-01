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
    '{"hero":*[_type=="heroSlide"]|order(order asc){order,prefix,verb,roundTexts,dotLabel,showCallButton,"imageBaseUrl":image.asset->url},' +
    '"trust":*[_type=="trustPoint"]|order(order asc){order,text},' +
    '"services":*[_type=="service"]|order(order asc){order,"anchor":anchorId.current,verb,title,requiresLegalNote,description,"cardImageBaseUrl":cardImage.asset->url,"cardImageHotspot":cardImage.hotspot},' +
    '"faq":*[_type=="faqEntry"]|order(order asc){order,question,answer},' +
    '"megaMenu":*[_type=="megaMenuLink"]|order(section asc, order asc){section,order,title,description,url},' +
    '"infoBanner":*[_type=="infoBanner"][0]{text,active,expiresAt,zielLink},' +
    '"vorherNachher":*[_type=="vorherNachherProjekt"]{titel,beschreibung,kategorie,"vorherUrl":vorherBild.asset->url' + IMG_SUFFIX + ',vorherAlt,"nachherUrl":nachherBild.asset->url' + IMG_SUFFIX + ',nachherAlt},' +
    '"contact":*[_type=="contactInfo"][0]{phone,phoneHref,whatsapp,email,openingHours},' +
    '"settings":*[_type=="siteSettings"][0]{companyName,ownerName,legalNotice,navLeistungen,navUeberMich,navEinsatzgebiet,navKontakt,heroEyebrow,heroAutoplayMs,staticFormsApiKey,kitCardIntervalMs,kitActiveScale,kitInactiveOpacity,"logoIconUrl":logoIcon.asset->url' + IMG_SUFFIX + '}}';
  // api.sanity.io statt apicdn.sanity.io: kein CDN-Zwischenspeicher, dadurch
  // immer der aktuellste Stand direkt aus dem Dataset (das APICDN-Äquivalent
  // zu useCdn:false bei der Sanity-SDK — hier per direktem fetch() ohne SDK).
  //
  // READ_TOKEN: Platzhalter für einen Sanity-"Viewer"-Token (nur Lesen, KEINE
  // Schreibrechte) — nötig für perspective=previewDrafts, damit auch unveröffentlichte
  // Entwürfe sofort im Frontend erscheinen. Erzeugen unter sanity.io/manage → Projekt
  // "9bz9h1mi" → API → Tokens → "Add API token" mit Rolle "Viewer", dann hier
  // einsetzen. ACHTUNG (Sicherheitshinweis): Dies ist eine reine Static-Site ohne
  // Backend — jeder Token, der hier steht, ist über "Seitenquelltext anzeigen" für
  // jeden Website-Besucher sichtbar und ausles-/kopierbar. Ein "Viewer"-Token kann
  // damit NICHTS verändern, erlaubt aber jedem, auch unveröffentlichte Entwürfe zu
  // lesen. Ist das nicht gewünscht, READ_TOKEN leer lassen — die Seite fällt dann
  // automatisch auf die öffentliche "published"-Perspektive zurück (kein Draft-Preview,
  // aber weiterhin ohne CDN-Cache dank useCdn:false-Äquivalent oben).
  var READ_TOKEN = "";
  var PERSPECTIVE = READ_TOKEN ? "previewDrafts" : "published";
  var ENDPOINT =
    "https://" + PROJECT_ID + ".api.sanity.io/v2024-01-01/data/query/" + DATASET +
    "?perspective=" + PERSPECTIVE + "&query=" + encodeURIComponent(QUERY);

  // Mobil ein schlankeres, Desktop ein größeres Bild ziehen, statt überall
  // dieselbe (auf großen Screens zu kleine, auf kleinen Screens unnötig
  // schwere) Variante zu laden. Sanitys Bild-CDN skaliert & schärft serverseitig.
  var isNarrowViewport = window.matchMedia && window.matchMedia("(max-width:768px)").matches;
  function responsiveImageUrl(baseUrl) {
    if (!baseUrl) return baseUrl;
    var width = isNarrowViewport ? 800 : 1920;
    return baseUrl + "?w=" + width + "&auto=format&q=90";
  }

  function buildFieldMap(data) {
    var map = {};
    var hero = data.hero || [];
    // Nicht die Array-Position nach der Sortierung als Slide-Index nehmen (bricht bei
    // doppelten/zusätzlichen heroSlide-Dokumenten im Studio, z. B. aus Versehen zweimal
    // "+ Neu" geklickt — verschiebt dann ALLE nachfolgenden Bilder auf falsche Indizes).
    // Stattdessen das feste "order"-Feld (1-4) verwenden, das bleibt stabil.
    var heroByOrder = {};
    hero.forEach(function (doc) {
      if (typeof doc.order === "number" && doc.order >= 1 && doc.order <= 4 && !heroByOrder[doc.order]) {
        heroByOrder[doc.order] = doc;
      }
    });
    [1, 2, 3, 4].forEach(function (orderNum) {
      var doc = heroByOrder[orderNum];
      if (!doc) return;
      var i = orderNum - 1;
      if (doc.verb) map["hero." + i + ".verb"] = doc.verb;
      if (doc.imageBaseUrl) map["hero." + i + ".imageUrl"] = responsiveImageUrl(doc.imageBaseUrl);
    });
    var heroFirst = heroByOrder[1];
    if (heroFirst && Array.isArray(heroFirst.roundTexts) && heroFirst.roundTexts.length) {
      map["hero.0.roundTexts"] = heroFirst.roundTexts;
    }
    if (heroFirst && typeof heroFirst.showCallButton === "boolean") {
      map["hero.0.showCallButton"] = heroFirst.showCallButton;
    }
    (data.trust || []).forEach(function (doc, i) {
      if (doc.text) map["trust." + i + ".text"] = doc.text;
    });
    // Gleiche order-basierte Zuordnung wie beim Hero (siehe oben) statt Array-Position —
    // schützt auch die 5 Leistungskacheln vor doppelten/zusätzlichen Sanity-Dokumenten.
    var servicesByOrder = {};
    (data.services || []).forEach(function (doc) {
      if (typeof doc.order === "number" && doc.order >= 1 && doc.order <= 5 && !servicesByOrder[doc.order]) {
        servicesByOrder[doc.order] = doc;
      }
    });
    [1, 2, 3, 4, 5].forEach(function (orderNum) {
      var doc = servicesByOrder[orderNum];
      if (!doc) return;
      var i = orderNum - 1;
      if (doc.title) map["services." + i + ".title"] = doc.title;
      if (doc.description) map["services." + i + ".description"] = doc.description;
      if (doc.cardImageBaseUrl) map["services." + i + ".cardImageUrl"] = doc.cardImageBaseUrl + "?auto=format&q=90";
      // Sanitys Hotspot ist bereits ein relativer 0-1-Wert im Bild — deckt sich exakt mit
      // der CSS object-position-Syntax. So bleibt der gewählte Bildausschnitt bei jeder
      // Kachelgröße/jedem Breakpoint korrekt (ein serverseitiger Fix-Crop könnte das bei
      // einem responsiven Mosaik-Grid mit wechselnden Seitenverhältnissen nicht leisten).
      if (doc.cardImageHotspot && typeof doc.cardImageHotspot.x === "number" && typeof doc.cardImageHotspot.y === "number") {
        map["services." + i + ".cardImagePosition"] =
          (doc.cardImageHotspot.x * 100).toFixed(2) + "% " + (doc.cardImageHotspot.y * 100).toFixed(2) + "%";
      }
    });
    (data.faq || []).forEach(function (doc, i) {
      if (doc.question) map["faq." + i + ".question"] = doc.question;
      if (doc.answer) map["faq." + i + ".answer"] = doc.answer;
    });
    // Mega-Menü-Links: nach festem section+order-Schlüssel gruppieren statt Array-Position
    // (gleiche Absicherung wie bei Hero/Leistungen gegen doppelte/fehlerhafte Dokumente).
    // Kontakt bewusst nicht dabei — die 3 Kontakt-Links im Menü ziehen ihre Werte weiterhin
    // direkt aus "contact" (siehe unten), damit Telefon/E-Mail nur an einer Stelle gepflegt wird.
    var megaSectionSizes = { leistungen: 5, ueberMich: 3, einsatzgebiet: 3 };
    var megaByKey = {};
    (data.megaMenu || []).forEach(function (doc) {
      var maxItems = doc.section && megaSectionSizes[doc.section];
      if (!maxItems || typeof doc.order !== "number" || doc.order < 0 || doc.order >= maxItems) return;
      var key = doc.section + "." + doc.order;
      if (!megaByKey[key]) megaByKey[key] = doc;
    });
    Object.keys(megaByKey).forEach(function (key) {
      var doc = megaByKey[key];
      if (doc.title) map["megaCol." + key + ".title"] = doc.title;
      if (doc.description) map["megaCol." + key + ".description"] = doc.description;
      if (doc.url) map["megaCol." + key + ".url"] = doc.url;
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
      if (typeof data.settings.kitCardIntervalMs === "number" && data.settings.kitCardIntervalMs >= 500) {
        map["settings.kitCardIntervalMs"] = data.settings.kitCardIntervalMs;
      }
      if (typeof data.settings.kitActiveScale === "number" && data.settings.kitActiveScale >= 1) {
        map["settings.kitActiveScale"] = data.settings.kitActiveScale;
      }
      if (typeof data.settings.kitInactiveOpacity === "number" && data.settings.kitInactiveOpacity > 0) {
        map["settings.kitInactiveOpacity"] = data.settings.kitInactiveOpacity;
      }
    }
    return map;
  }

  // Kit-Fokus-Impuls-Parameter: Zeit-Wert direkt am main.js-Timing-Global setzen (gleiches
  // Prinzip wie heroAutoplayMs), Skalierung/Abdunklung als CSS-Custom-Properties übergeben,
  // da main.js sie nicht selbst berechnet, sondern nur die CSS-Klassen umschaltet.
  function applyKitAnimationSettings(map) {
    if (map["settings.kitCardIntervalMs"]) {
      window.__kitCardIntervalMs = map["settings.kitCardIntervalMs"];
    }
    var kitContainer = document.querySelector(".leistung-cards");
    if (!kitContainer) return;
    if (map["settings.kitActiveScale"]) {
      kitContainer.style.setProperty("--kit-active-scale", map["settings.kitActiveScale"]);
    }
    if (map["settings.kitInactiveOpacity"]) {
      kitContainer.style.setProperty("--kit-inactive-opacity", map["settings.kitInactiveOpacity"]);
    }
  }

  // Info-Banner: standardmäßig unsichtbar (siehe HTML [hidden]) — zeigt sich nur, wenn
  // "active" an ist UND (kein Ablaufdatum ODER Ablaufdatum noch nicht erreicht). Der
  // Systemzeit-Abgleich passiert bewusst hier im Client, da die Seite rein statisch ist
  // und keinen Server hat, der das serverseitig prüfen könnte.
  function applyInfoBanner(data) {
    var banner = data.infoBanner;
    var el = document.querySelector(".info-banner");
    if (!el || !banner || !banner.active || !banner.text) return;
    if (banner.expiresAt && new Date(banner.expiresAt).getTime() <= Date.now()) return;

    // Ist ein Ziel-Link gepflegt, wird der ganze Banner klickbar: statt ein <div>
    // per JS irgendwie "klickbar" zu simulieren (schlecht für Tastatur/Screenreader),
    // ersetzen wir es sauber durch ein echtes <a> mit denselben Klassen/Attributen —
    // ein <div> kann nicht nachträglich zu einem <a> "umgewandelt" werden.
    var target = el;
    if (banner.zielLink) {
      var link = document.createElement("a");
      link.className = el.className;
      link.href = banner.zielLink;
      el.replaceWith(link);
      target = link;
    }

    var textNode = document.createTextNode(banner.text);
    target.textContent = "";
    target.appendChild(textNode);
    if (banner.zielLink) {
      var arrow = document.createElement("span");
      arrow.className = "info-banner-arrow";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      target.appendChild(arrow);
    }
    target.hidden = false;
    target.classList.add("is-visible");
    document.body.classList.add("has-info-banner");
  }

  // Sanity ist die Quelle der Wahrheit für Vorher/Nachher-Projekte; die statische
  // content/vorher-nachher.json (main.js) ist nur der Startzustand/Fallback, falls
  // das Sanity-Dataset (noch) leer ist oder der Fetch fehlschlägt.
  function applyVorherNachher(data) {
    var projekte = data.vorherNachher || [];
    if (!projekte.length || typeof window.__renderVnProjekte !== "function") return;
    window.__renderVnProjekte(
      projekte.map(function (p) {
        return {
          titel: p.titel,
          beschreibung: p.beschreibung,
          kategorie: p.kategorie,
          vorher_bild: p.vorherUrl,
          vorher_alt: p.vorherAlt,
          nachher_bild: p.nachherUrl,
          nachher_alt: p.nachherAlt,
        };
      })
    );
  }

  // Hochgeladenes Logo (settings.logoIconUrl) wird zusätzlich als Favicon injiziert,
  // damit ein Logo-Wechsel im Studio auch im Browser-Tab sichtbar wird.
  function applyFavicon(logoUrl) {
    if (!logoUrl) return;
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.setAttribute("href", logoUrl);
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

  // Sanity-Hotspot (Fokuspunkt) auf das jeweilige <img> übertragen, damit auf jeder
  // Kachelgröße/jedem Breakpoint der von Lars im Studio gewählte Bildausschnitt sichtbar
  // bleibt, statt dass object-fit:cover zufällig den falschen Teil abschneidet.
  function applyCardFocalPoints(map) {
    Object.keys(map).forEach(function (key) {
      if (key.indexOf(".cardImagePosition") === -1) return;
      var fieldKey = key.replace(".cardImagePosition", ".cardImageUrl");
      var imgEl = document.querySelector('[data-sanity-field="' + fieldKey + '"]');
      if (imgEl) imgEl.style.objectPosition = map[key];
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

  // Der grüne "Direkt anrufen"-Button ist nicht pro Slide vorhanden (ein Button für
  // den ganzen Slider) — der Schalter im ersten Hero-Slide-Dokument steuert ihn global.
  function applyCallButtonToggle(map) {
    if (map["hero.0.showCallButton"] !== false) return; // Default (kein Feld / true) = sichtbar, unverändert
    var btn = document.querySelector("[data-hero-call-btn]");
    if (btn) btn.style.display = "none";
  }

  var controller = "AbortController" in window ? new AbortController() : null;
  var timeoutId = controller
    ? window.setTimeout(function () {
        controller.abort();
      }, 5000)
    : null;

  var fetchOptions = { signal: controller ? controller.signal : undefined, cache: "no-store" };
  if (READ_TOKEN) {
    fetchOptions.headers = { Authorization: "Bearer " + READ_TOKEN };
  }
  fetch(ENDPOINT, fetchOptions)
    .then(function (res) {
      return res.ok ? res.json() : Promise.reject(new Error("Sanity-Antwort: HTTP " + res.status));
    })
    .then(function (json) {
      if (timeoutId) window.clearTimeout(timeoutId);
      var data = (json && json.result) || {};
      if (window.console && console.log) {
        console.log("[sanity-content] Daten von Sanity empfangen:", data);
      }
      var map = buildFieldMap(data);
      applyPatches(map);
      patchHeroBackgrounds(map);
      applyCardFocalPoints(map);
      applyKitAnimationSettings(map);
      applyCallButtonToggle(map);
      applyVorherNachher(data);
      applyInfoBanner(data);
      if (data.settings && data.settings.logoIconUrl) {
        applyFavicon(data.settings.logoIconUrl);
      }
      // Reine Verhaltens-Einstellung ohne eigenes DOM-Element zum Anhängen —
      // direkt anwenden, statt auf ein [data-sanity-field] zu warten, das es nicht gibt.
      if (map["settings.heroAutoplayMs"]) {
        window.__heroAutoplayMs = map["settings.heroAutoplayMs"];
      }
    })
    .catch(function (err) {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (window.console && console.warn) {
        console.warn("[sanity-content] Live-Inhalte nicht geladen, zeige statischen Stand. Grund:", err && err.message);
      }
    });
})();
