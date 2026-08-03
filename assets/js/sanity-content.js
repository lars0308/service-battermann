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

  var PROJECT_ID = "9bz9h1mi";
  var DATASET = "production";

  // Kontaktformular: echte AJAX-Submission per fetch() statt normaler
  // Formular-Navigation. Vorher landete jeder Absende-Klick zwangsläufig auf
  // der nackten JSON-Antwortseite von Static Forms (auch der bisherige Code
  // rief am Ende IMMER contactForm.submit() auf, also eine echte Navigation —
  // "AJAX" war nie implementiert, nur das accessKey-Feld wurde vorab
  // abgesichert). Jetzt: preventDefault() greift IMMER, die Daten gehen per
  // fetch() raus, bei Erfolg öffnet sich das Danke-Popup mit vCard-Download.
  //
  // WICHTIG: als FormData (nicht JSON.stringify) senden und KEINEN eigenen
  // Content-Type-Header setzen — der Browser setzt die korrekte
  // "multipart/form-data; boundary=..."-Kopfzeile automatisch. Das ist nötig,
  // damit der optionale Foto-Upload (<input type="file" multiple>) weiterhin
  // funktioniert; ein JSON.stringify(new FormData(...)) würde angehängte
  // Dateien stillschweigend verwerfen.
  var STATIC_FORMS_KEY_STORAGE = "staticFormsKey";
  function cacheStaticFormsKey(key) {
    if (!key) return;
    try { window.localStorage.setItem(STATIC_FORMS_KEY_STORAGE, key); } catch (e) {}
  }
  function readCachedStaticFormsKey() {
    try { return window.localStorage.getItem(STATIC_FORMS_KEY_STORAGE); } catch (e) { return null; }
  }

  var contactForm = document.getElementById("contactForm");
  var dankePopUp = document.getElementById("dankePopUp");
  var formError = document.getElementById("formError");

  function onDankeKeydown(e) {
    if (e.key === "Escape") closeDankePopUp();
  }
  function openDankePopUp() {
    if (!dankePopUp) return;
    dankePopUp.classList.add("is-visible");
    document.addEventListener("keydown", onDankeKeydown);
  }
  function closeDankePopUp() {
    if (!dankePopUp) return;
    dankePopUp.classList.remove("is-visible");
    document.removeEventListener("keydown", onDankeKeydown);
  }
  if (dankePopUp) {
    dankePopUp.addEventListener("click", function (e) {
      if (e.target === dankePopUp) closeDankePopUp();
    });
    Array.prototype.forEach.call(dankePopUp.querySelectorAll("[data-danke-close]"), function (btn) {
      btn.addEventListener("click", closeDankePopUp);
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // blockiert die native Weiterleitung zur nackten API-Antwortseite kompromisslos

      // Honeypot: Bots füllen versteckte Felder oft blind aus. Wert vorhanden
      // -> so tun, als sei alles gutgegangen (kein Hinweis an Bots), aber
      // nichts an Static Forms senden.
      var honeypot = contactForm.querySelector('input[name="honeypot"]');
      if (honeypot && honeypot.value) {
        contactForm.reset();
        openDankePopUp();
        return;
      }

      var accessKeyInput = contactForm.querySelector('input[name="accessKey"]');
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var submitBtnLabel = submitBtn ? submitBtn.textContent : "";

      var doSubmit = function () {
        if (formError) formError.hidden = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Wird gesendet …";
        }
        fetch(contactForm.action, { method: "POST", body: new FormData(contactForm) })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (!data || !data.success) throw new Error("Static Forms meldete keinen Erfolg.");
            contactForm.reset();
            openDankePopUp();
          })
          .catch(function (err) {
            if (formError) formError.hidden = false;
            if (window.console && console.error) console.error("[Kontaktformular] Senden fehlgeschlagen:", err);
          })
          .then(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = submitBtnLabel;
            }
          });
      };

      if (accessKeyInput && !accessKeyInput.value) {
        var cachedKey = readCachedStaticFormsKey();
        if (cachedKey) accessKeyInput.value = cachedKey;
      }

      if (!accessKeyInput || accessKeyInput.value) {
        doSubmit();
        return;
      }

      // Kein Key (weder HTML-Standard noch Cache) -> letzter Versuch, ihn live
      // aus Sanity nachzuladen, dann erst senden.
      var keyQuery = encodeURIComponent('*[_type=="siteSettings"][0].staticFormsApiKey');
      var keyEndpoint =
        "https://" + PROJECT_ID + ".api.sanity.io/v2024-01-01/data/query/" + DATASET + "?query=" + keyQuery;
      fetch(keyEndpoint, { cache: "no-store" })
        .then(function (res) {
          return res.ok ? res.json() : null;
        })
        .then(function (json) {
          var key = json && json.result;
          if (key) {
            accessKeyInput.value = key;
            cacheStaticFormsKey(key);
          }
        })
        .catch(function () {
          /* Nachlade-Versuch fehlgeschlagen -> trotzdem senden (mit dem festen
             HTML-Standardwert, der an dieser Stelle ohnehin schon greift). */
        })
        .then(doSubmit);
    });
  }

  var fields = document.querySelectorAll("[data-sanity-field]");
  if (!fields.length) return; // diese Seite hat nichts zu patchen
  // Bild-URLs bekommen direkt in der Query den Schärfe-/Format-Parameter mit
  // (Sanitys Bild-CDN versteht dieselben URL-Parameter wie andere Bild-CDNs).
  var IMG_SUFFIX = '+"?auto=format&q=90"';
  var QUERY =
    '{"themeSettings":*[_type=="themeSettings"][0]{"primaryGold":primaryGold.hex,"brandGreen":brandGreen.hex,"bgDark":bgDark.hex,"bgLight":bgLight.hex,"textDark":textDark.hex,"textLight":textLight.hex,glassOpacity,glassBlur,borderRadius},' +
    '"pageHome":*[_type=="pageHome"][0]{"pageModules":pageModules[]{_type},heroEyebrow,aboutEyebrow,aboutLead,aboutFact1Title,aboutFact1Text,aboutFact2Title,aboutFact2Text,aboutFact3Title,aboutFact3Text,aboutCardCtaLabel,aboutDownloadLabel,bereichsLink,heroWhatsappLabel,heroCallLabel,heroPrimaryCtaLabel,bentoEyebrow,bentoHeadline,bentoIntro,servicesAllCtaLabel,mapEyebrow,mapHeadline,formEyebrow,formHeadline,bewertungenEyebrow,bewertungenHeadline,bewertungenText,bewertungenCtaLabel,gebietEyebrow,gebietHeadline,gebietText,gebietCtaLabel,"aboutPortraitUrl":aboutPortrait.asset->url' + IMG_SUFFIX + ',heroDesign,werHierAnpacktDesign,werHierAnpacktLayout,leistungenExtraDesign,mapBlockDesign,formBlockDesign,bewertungenDesign,gebietTeaserDesign},' +
    '"customPages":*[_type=="customPage" && showInNav==true]|order(navOrder asc){title,"slug":slug.current,navOrder},' +
    '"heroSettings":*[_type=="heroSettings"][0]{"heroSlides":heroSlides[]{folieName,"desktopBaseUrl":bildDesktop.asset->url,"desktopHotspot":bildDesktop.hotspot,"mobileBaseUrl":bildMobile.asset->url,"mobileHotspot":bildMobile.hotspot,bildAktiv,spruchText,spruchTextsWeitere,spruchAktiv},showCallButton},' +
    '"trust":*[_type=="trustPoint"]|order(order asc){order,text,detail},' +
    '"services":*[_type=="service"]|order(order asc){order,"anchor":anchorId.current,verb,title,requiresLegalNote,shortDescription,description,ctaLabel,ctaUrl,"cardImageBaseUrl":cardImage.asset->url,"cardImageHotspot":cardImage.hotspot,"gallery":gallery[]{"url":asset->url,hotspot}},' +
    '"faq":*[_type=="faqEntry"]|order(order asc){order,question,answer},' +
    '"megaMenu":*[_type=="megaMenuLink"]|order(section asc, order asc){section,order,title,description,url},' +
    '"infoBanner":*[_type=="infoBanner"][0]{text,active,expiresAt,zielLink},' +
    '"vorherNachher":*[_type=="vorherNachherProjekt"]{titel,beschreibung,kategorie,"vorherUrl":vorherBild.asset->url' + IMG_SUFFIX + ',vorherAlt,"nachherUrl":nachherBild.asset->url' + IMG_SUFFIX + ',nachherAlt},' +
    '"contact":*[_type=="contactInfo"][0]{phone,phoneHref,whatsapp,email,openingHours},' +
    '"einsatzgebiet":*[_type=="einsatzgebietOrt"]|order(order asc){order,name,anfahrtskosten},' +
    '"promise":*[_type=="promiseCard"]|order(order asc){order,icon,title,text},' +
    '"pageImpressum":*[_type=="pageImpressum"][0]{eyebrow,heading,intro,body,design},' +
    '"pageDatenschutz":*[_type=="pageDatenschutz"][0]{eyebrow,heading,intro,body,design},' +
    '"pageUeberMich":*[_type=="pageUeberMich"][0]{heroEyebrow,heroName,heroSubline,heroLead,"heroPortraitUrl":heroPortrait.asset->url' + IMG_SUFFIX + ',anfangEyebrow,anfangHeadline,anfangText1,anfangText2,"anfangImageUrl":anfangImage.asset->url' + IMG_SUFFIX + ',arbeitsweiseEyebrow,arbeitsweiseHeadline,kundenEyebrow,kundenHeadline,kundenText,kundenCtaLabel,ctaBandHeadline,ctaBandText,ctaBandPrimaryLabel,ctaBandSecondaryLabel,heroDesign,anfangDesign,anfangLayout,arbeitsweiseDesign,kundenDesign,ctaBandDesign},' +
    '"pageLeistungen":*[_type=="pageLeistungen"][0]{heroEyebrow,heroHeadline,heroLead,ctaBandHeadline,ctaBandText,ctaBandPrimaryLabel,ctaBandSecondaryLabel,heroDesign,ctaBandDesign},' +
    '"pageKontakt":*[_type=="pageKontakt"][0]{heroEyebrow,heroHeadline,heroLead,contactEyebrow,contactHeadline,contactIntro,emailLabelPrefix,erreichbarkeitLabelPrefix,contactNote,"portraitUrl":portrait.asset->url' + IMG_SUFFIX + ',portraitName,portraitRole,heroDesign,direkterDrahtDesign},' +
    '"pageEinsatzgebiet":*[_type=="pageEinsatzgebiet"][0]{heroEyebrow,heroHeadline,heroLead,faqEyebrow,faqHeadline,ctaBandHeadline,ctaBandText,ctaBandPrimaryLabel,ctaBandSecondaryLabel,heroDesign,faqDesign,ctaBandDesign},' +
    '"effects":*[_type=="effectSettings"][0]{heroAutoplayMs,heroTransitionMs,introDurationMs,introBlurStrength,introVeilOpacity,kitCardIntervalMs,bentoTileScale,bentoGlassFadeMs,trustMarqueeSpeedMs,revealDurationMs,revealDistancePx},' +
    '"settings":*[_type=="siteSettings"][0]{companyName,ownerName,legalNotice,navLeistungen,navUeberMich,navEinsatzgebiet,navKontakt,navOrderHome,navOrderLeistungen,navOrderUeberMich,navOrderEinsatzgebiet,navOrderKontakt,staticFormsApiKey,navStartseite,navCtaLabel,megaAllLeistungen,megaAllUeberMich,megaAllEinsatzgebiet,megaAllKontakt,megaKontaktAnrufenLabel,megaKontaktWhatsappLabel,megaKontaktWhatsappDesc,megaKontaktEmailLabel,footerIntro,footerNavHeading,footerContactHeading,copyrightText,footerImpressumLabel,footerDatenschutzLabel,footerBackHomeLabel,cookieText,cookieLinkLabel,cookieAcceptLabel,fabLongLabel,fabShortLabel,dankeHeadline,dankeText,dankeVcardLabel,dankeCloseLabel,formNameLabel,formOrtLabel,formOrtPlaceholder,formKontaktwegLabel,formKontaktPlaceholder,formAnliegenLabel,formAnliegenPlaceholder,formFotoLabel,formSubmitLabel,formErrorText,formDisclaimerPre,formDisclaimerPost,mapConsentTitle,mapConsentText,mapConsentLinkLabel,mapConsentButtonLabel,"logoIconUrl":logoIcon.asset->url' + IMG_SUFFIX + '}}';
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
  // Hero-Bilder bekommen eigens q=95 (etwas schärfer als der Standard q=90) —
  // sie sind das erste, größte, am längsten betrachtete Bild der Seite.
  function heroImageUrl(baseUrl, width) {
    if (!baseUrl) return baseUrl;
    return baseUrl + "?w=" + width + "&auto=format&q=95";
  }

  // Globale Farbsteuerung (themeSettings): injiziert Lars' Sanity-Farbwerte live
  // als CSS-Custom-Properties auf :root — alle abgeleiteten Tokens in styles.css
  // (--accent, --paper, --ink, --surface-deep, --on-dark, WhatsApp-Grün, ...)
  // referenzieren ausschließlich diese sechs Basisvariablen, wirkt sich also
  // automatisch auf jede Seite aus, die dieses Script lädt. Kein gepflegter
  // Sanity-Wert für ein Feld -> die in styles.css hart hinterlegte Fallback-
  // Farbe bleibt für dieses Feld unverändert stehen.
  function applyThemeColors(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var COLOR_MAP = {
      primaryGold: "--primary-gold",
      brandGreen: "--brand-green",
      bgDark: "--bg-dark",
      bgLight: "--bg-light",
      textDark: "--text-dark",
      textLight: "--text-light",
    };
    Object.keys(COLOR_MAP).forEach(function (key) {
      if (theme[key]) root.style.setProperty(COLOR_MAP[key], theme[key]);
    });
    // glassOpacity ist ein reiner 0-1-Faktor (kein px-Wert), glassBlur/
    // borderRadius sind Pixelwerte -> "px" muss hier angehängt werden, in
    // Sanity pflegt Lars nur die reine Zahl.
    if (typeof theme.glassOpacity === "number") {
      root.style.setProperty("--glass-opacity", theme.glassOpacity);
    }
    if (typeof theme.glassBlur === "number") {
      root.style.setProperty("--glass-blur", theme.glassBlur + "px");
    }
    if (typeof theme.borderRadius === "number") {
      root.style.setProperty("--border-radius", theme.borderRadius + "px");
    }
  }

  // pageHome-Baukasten (pageModules): steuert Reihenfolge & Sichtbarkeit der
  // Startseiten-Blöcke innerhalb von #page-builder-zone. Sicherer Ansatz:
  // KEIN DOM wird neu injiziert oder entfernt — jeder Block bleibt
  // statisches HTML mit allen bestehenden JS-Bindungen (Hero-Slider,
  // Bento-Rotation, Formular-Logik, Einsatzgebiet-Widget usw.) unangetastet.
  // Es wird nur CSS "order" (Position im Sanity-Array) und das
  // "hidden"-Attribut (Block im Array vorhanden = sichtbar) gesetzt.
  // Fehlt pageHome.pageModules ganz (kein Dokument gepflegt): die vier
  // bisher sichtbaren Blöcke bleiben in ihrer ursprünglichen HTML-Reihenfolge
  // sichtbar, mapBlock/formBlock bleiben ausgeblendet (unveränderte
  // Standard-Startseite).
  // Freie Unterseiten (customPage) mit aktiviertem "In der Hauptnavigation
  // anzeigen?"-Schalter bekommen automatisch einen eigenen Menüpunkt — auf
  // JEDER Seite der Website (dieses Skript läuft überall), direkt vor dem
  // mobilen "Anfrage stellen"-Button. Kein Dropdown nötig: ein einzelner
  // Link genügt, genau wie "Startseite" links im Menü.
  function applyCustomPageNav(data) {
    var pages = data.customPages;
    if (!pages || !pages.length) return;
    document.querySelectorAll(".main-nav").forEach(function (nav) {
      var anchor = nav.querySelector(".nav-mobile-cta") || nav.querySelector(".btn-sharp");
      pages.forEach(function (p) {
        if (!p.title || !p.slug) return;
        // Relativer Pfad (kein führender "/"): GitHub Pages liefert das
        // Projekt unter einem Unterordner (z. B. /service-battermann/) statt
        // an der Domain-Wurzel — ein absoluter "/notdienst"-Link würde dort
        // ins Leere zeigen. Alle Seiten liegen flach im selben Verzeichnis,
        // daher reicht der reine Slug als relativer Link.
        var link = document.createElement("a");
        link.href = p.slug;
        link.textContent = p.title;
        // Reihenfolge im Menü: eigenes "navOrder"-Feld der Unterseite, sonst
        // Standard 60 (nach dem letzten festen Menüpunkt "Kontakt"=50, vor
        // dem CTA-Button=999) — siehe applyNavOrder() für die festen Punkte.
        link.style.order = typeof p.navOrder === "number" ? String(p.navOrder) : "60";
        if (anchor) {
          nav.insertBefore(link, anchor);
        } else {
          nav.appendChild(link);
        }
      });
    });
  }

  // Reihenfolge der 5 festen Hauptmenüpunkte: siteSettings.navOrder* (Zahl,
  // kleiner = weiter links) wird per CSS "order" auf die per data-nav-page
  // markierten Menü-Elemente übertragen (nav.main-nav ist display:flex, "order"
  // wirkt direkt). Ohne Sanity-Werte gilt die statische CSS-Reihenfolge in
  // styles.css (10/20/30/40/50) unverändert — kein Layout-Sprung vor dem Laden.
  function applyNavOrder(data) {
    var s = data.settings;
    if (!s) return;
    var orderByPage = {
      home: s.navOrderHome,
      leistungen: s.navOrderLeistungen,
      ueberMich: s.navOrderUeberMich,
      einsatzgebiet: s.navOrderEinsatzgebiet,
      kontakt: s.navOrderKontakt,
    };
    document.querySelectorAll(".main-nav [data-nav-page]").forEach(function (el) {
      var key = el.getAttribute("data-nav-page");
      var value = orderByPage[key];
      if (typeof value === "number") el.style.order = String(value);
    });
  }

  function applyPageModules(data) {
    var zone = document.getElementById("page-builder-zone");
    if (!zone) return; // nur relevant auf index.html
    var modules = data.pageHome && data.pageHome.pageModules;
    if (!modules || !modules.length) return;

    var order = {};
    modules.forEach(function (m, i) {
      if (m && m._type) order[m._type] = i;
    });
    var blocks = zone.querySelectorAll("[data-page-block]");
    blocks.forEach(function (el) {
      var type = el.getAttribute("data-page-block");
      if (Object.prototype.hasOwnProperty.call(order, type)) {
        el.style.order = order[type];
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  function buildFieldMap(data) {
    var map = {};
    (data.trust || []).forEach(function (doc, i) {
      if (doc.text) map["trust." + i + ".text"] = doc.text;
      if (doc.detail) map["trust." + i + ".detail"] = doc.detail;
    });
    // "Drei Dinge"-Karten (ueber-mich.html): order-basiert wie Hero/Leistungen,
    // damit doppelte/zusätzliche Sanity-Dokumente die restlichen 2 Karten nicht verschieben.
    var promiseByOrder = {};
    (data.promise || []).forEach(function (doc) {
      if (typeof doc.order === "number" && doc.order >= 1 && doc.order <= 3 && !promiseByOrder[doc.order]) {
        promiseByOrder[doc.order] = doc;
      }
    });
    [1, 2, 3].forEach(function (orderNum) {
      var doc = promiseByOrder[orderNum];
      if (!doc) return;
      var i = orderNum - 1;
      if (doc.title) map["promise." + i + ".title"] = doc.title;
      if (doc.text) map["promise." + i + ".text"] = doc.text;
      if (doc.icon) map["promise." + i + ".icon"] = doc.icon;
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
      if (doc.verb) map["services." + i + ".verb"] = doc.verb;
      if (doc.shortDescription) map["services." + i + ".shortDescription"] = doc.shortDescription;
      if (doc.description) map["services." + i + ".description"] = doc.description;
      if (doc.ctaLabel) map["services." + i + ".ctaLabel"] = doc.ctaLabel;
      if (doc.ctaUrl) map["services." + i + ".ctaUrl"] = doc.ctaUrl;
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
    // "settings" (siteSettings) plus alle Seiten-Kopfbereiche/-Texte: jedes
    // einfache String-/Text-/Bild-Feld 1:1 unter "<docKey>.<feldName>" in die
    // Map übernehmen, statt jedes Feld einzeln aufzuzählen — neue Felder in
    // einem dieser Schemas brauchen dadurch keine weitere Änderung hier.
    [
      "settings",
      "pageUeberMich",
      "pageLeistungen",
      "pageKontakt",
      "pageEinsatzgebiet",
      "pageHome",
      "pageImpressum",
      "pageDatenschutz",
    ].forEach(function (docKey) {
      var doc = data[docKey];
      if (!doc) return;
      Object.keys(doc).forEach(function (field) {
        if (field === "pageModules" || field === "body") return; // eigene Struktur, kein Text-Feld
        if (/Design$/.test(field) || /Layout$/.test(field)) return; // eigene Struktur, siehe design-controls.js
        if (doc[field]) map[docKey + "." + field] = doc[field];
      });
    });
    return map;
  }

  // Zentrales Kinetik-Studio (effectSettings): alle Zeiten/Effekt-Werte werden
  // sowohl als JS-Timing-Globals (für main.js-Intervalle/Polling) als auch als
  // CSS-Custom-Properties auf :root injiziert (für styles.css-Transitions),
  // damit Lars ausschließlich in Sanity dreht und die Website überall synchron
  // reagiert. Fehlt ein Feld: der jeweilige var(...)-Fallback in styles.css
  // bzw. der main.js-Default greift unverändert.
  function applyEffectSettings(data) {
    var fx = data.effects;
    if (!fx) return;
    var root = document.documentElement.style;

    if (typeof fx.heroAutoplayMs === "number") window.__heroAutoplayMs = fx.heroAutoplayMs;
    if (typeof fx.heroTransitionMs === "number") {
      window.__heroTransitionMs = fx.heroTransitionMs;
      var heroSlidesWrap = document.querySelector(".hero-slides");
      if (heroSlidesWrap) heroSlidesWrap.style.setProperty("--hero-transition-speed", fx.heroTransitionMs + "ms");
    }
    if (typeof fx.introDurationMs === "number") window.__introDurationMs = fx.introDurationMs;
    if (typeof fx.introBlurStrength === "number") {
      var glassEl = document.querySelector("[data-hero-glass-intro]");
      if (glassEl) glassEl.style.setProperty("--intro-blur", fx.introBlurStrength + "px");
    }
    if (typeof fx.introVeilOpacity === "number") root.setProperty("--intro-veil-opacity", String(fx.introVeilOpacity));
    if (typeof fx.kitCardIntervalMs === "number") window.__kitCardIntervalMs = fx.kitCardIntervalMs;
    if (typeof fx.trustMarqueeSpeedMs === "number") root.setProperty("--trust-marquee-speed", fx.trustMarqueeSpeedMs + "ms");
    if (typeof fx.bentoTileScale === "number") root.setProperty("--bento-tile-scale", String(fx.bentoTileScale));
    if (typeof fx.bentoGlassFadeMs === "number") root.setProperty("--bento-glass-fade-ms", fx.bentoGlassFadeMs + "ms");
    if (typeof fx.revealDurationMs === "number") root.setProperty("--reveal-duration", fx.revealDurationMs + "ms");
    if (typeof fx.revealDistancePx === "number") root.setProperty("--reveal-distance", fx.revealDistancePx + "px");
  }

  // "Wie ich arbeite"-Karten (ueber-mich.html): Icon-Auswahl aus promiseCard
  // (Enum ehrlichkeit/puenktlichkeit/sauberkeit) auf das jeweilige
  // [data-sanity-icon="promise.N"]-Element anwenden. Unbekannter/fehlender
  // Wert: das im HTML fest hinterlegte Icon bleibt stehen.
  var PROMISE_ICON_SVG = {
    ehrlichkeit:
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M8.5 12.5l2.2 2.2 4.3-4.7"/></svg>',
    puenktlichkeit:
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/></svg>',
    sauberkeit:
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l6.5-6.5"/><path d="M13.5 4.5c1.5-1.5 4-1.5 5.5 0l.5.5-8 8-3-3z"/><path d="M14 9l3 3"/><path d="M3 21l1.3-3.8L7 20z"/></svg>',
  };
  function applyPromiseIcons(map) {
    document.querySelectorAll("[data-sanity-icon]").forEach(function (el) {
      var value = map[el.getAttribute("data-sanity-icon") + ".icon"];
      var svg = value && PROMISE_ICON_SVG[value];
      if (svg) el.innerHTML = svg;
    });
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

  // Für die meisten Felder gilt sitewide: "leer/fehlt in Sanity" -> statischer
  // HTML-Text bleibt stehen (Sicherheitsnetz, falls die Sanity-Abfrage
  // fehlschlägt — die Seite soll nie leer/kaputt aussehen). Bei bewusst
  // optionalen Absätzen wie dem Bewertungen-Text will Lars aber, dass ein
  // Löschen im Studio den Absatz auf der Website wirklich verschwinden lässt.
  // Nur hier anwendbar, weil "data.pageHome" bei erfolgreicher Abfrage immer
  // vorhanden ist — ein fehlendes "data.pageHome" bedeutet also echten
  // Abfrage-Fehler (statischer Text bleibt), ein vorhandenes "data.pageHome"
  // ohne bewertungenText bedeutet: bewusst geleert.
  function applyOptionalTextVisibility(data) {
    if (!data.pageHome) return;
    if (!data.pageHome.bewertungenText) {
      var el = document.querySelector('[data-sanity-field="pageHome.bewertungenText"]');
      if (el) el.hidden = true;
    }
  }

  function applyPatches(map) {
    fields.forEach(function (el) {
      var field = el.getAttribute("data-sanity-field");
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

  // Bildergalerie je Leistungsbereich (leistungen.html) — nur ersetzen, wenn
  // Lars im Studio tatsächlich eigene Galeriebilder gepflegt hat; sonst bleiben
  // die statischen HTML-Bilder als Fallback stehen (gleiches Prinzip wie
  // überall sonst: kein Sanity-Wert -> nichts ändert sich). data-lightbox-img
  // auf den neuen <img>s reicht aus, damit die bestehende Lightbox (main.js,
  // event delegation auf document) sie automatisch mit aufnimmt.
  function applyServiceGalleries(data) {
    var servicesByOrder = {};
    (data.services || []).forEach(function (doc) {
      if (typeof doc.order === "number" && doc.order >= 1 && doc.order <= 5 && !servicesByOrder[doc.order]) {
        servicesByOrder[doc.order] = doc;
      }
    });
    [1, 2, 3, 4, 5].forEach(function (orderNum) {
      var doc = servicesByOrder[orderNum];
      if (!doc || !Array.isArray(doc.gallery) || !doc.gallery.length) return;
      var i = orderNum - 1;
      var container = document.querySelector('[data-service-gallery="' + i + '"]');
      if (!container) return;
      container.innerHTML = "";
      doc.gallery.forEach(function (img) {
        if (!img || !img.url) return;
        var figure = document.createElement("figure");
        var el = document.createElement("img");
        el.src = img.url + "?auto=format&q=90";
        el.alt = "";
        el.loading = "lazy";
        el.setAttribute("data-lightbox-img", "");
        if (img.hotspot && typeof img.hotspot.x === "number" && typeof img.hotspot.y === "number") {
          el.style.objectPosition = (img.hotspot.x * 100).toFixed(2) + "% " + (img.hotspot.y * 100).toFixed(2) + "%";
        }
        figure.appendChild(el);
        container.appendChild(figure);
      });
    });
  }

  // Einsatzgebiet-Orte (einsatzgebiet-faq.html): die Pillen-Liste wird komplett
  // aus Sanity neu aufgebaut, sobald mindestens ein einsatzgebietOrt-Dokument
  // existiert — Lars kann Orte frei hinzufügen/entfernen, ohne dass sich die
  // Liste an feste HTML-Positionen halten müsste (anders als z. B. die 5
  // Leistungen, deren Reihenfolge/Anzahl im HTML fest verankert ist). Ohne
  // Sanity-Daten bleiben die 6 statischen HTML-Pillen als Fallback stehen. Der
  // Klick-Handler in main.js hängt nur an data-Attributen, nicht an der
  // Erzeugung der Buttons — funktioniert also unverändert für neu gebaute wie
  // für die statischen Fallback-Pillen.
  function applyEinsatzgebiet(data) {
    var orte = data.einsatzgebiet || [];
    if (!orte.length) return;
    var wrap = document.querySelector("[data-einsatzgebiet-pills]");
    if (!wrap) return;
    wrap.innerHTML = "";
    orte.forEach(function (ort) {
      if (!ort || !ort.name) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "einsatzgebiet-pill";
      btn.setAttribute("data-ort", ort.name);
      btn.setAttribute("data-kosten", ort.anfahrtskosten || "Anfahrtskosten auf Anfrage");
      btn.textContent = ort.name;
      wrap.appendChild(btn);
    });
  }

  // Rechtstexte (impressum.html/datenschutz.html): minimaler Portable-Text-
  // Renderer für genau die Bausteine, die diese beiden Seiten tatsächlich
  // brauchen (Überschriften h2/h3, Absätze, Aufzählungen, fett, Links) — kein
  // vollständiger Portable-Text-Renderer, absichtlich schlank statt einer
  // externen Abhängigkeit. Ohne gepflegten Sanity-Text bleibt der statische
  // HTML-Rechtstext (bereits im Quellcode vorhanden) unverändert stehen.
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function renderPortableSpans(spans, markDefs) {
    return (spans || [])
      .map(function (span) {
        var text = escapeHtml(span.text || "");
        (span.marks || []).forEach(function (mark) {
          if (mark === "strong") {
            text = "<strong>" + text + "</strong>";
          } else {
            var def = (markDefs || []).filter(function (d) { return d._key === mark; })[0];
            if (def && def._type === "link" && def.href) {
              var external = /^https?:\/\//.test(def.href) ? ' target="_blank" rel="noopener"' : "";
              text = '<a href="' + escapeHtml(def.href) + '"' + external + ">" + text + "</a>";
            }
          }
        });
        return text;
      })
      .join("");
  }
  function renderPortableText(blocks) {
    var html = "";
    var i = 0;
    while (i < blocks.length) {
      var block = blocks[i];
      if (block._type !== "block") { i++; continue; }
      if (block.listItem === "bullet") {
        var items = "";
        while (i < blocks.length && blocks[i].listItem === "bullet") {
          items += "<li>" + renderPortableSpans(blocks[i].children, blocks[i].markDefs) + "</li>";
          i++;
        }
        html += "<ul>" + items + "</ul>";
        continue;
      }
      var tag = block.style === "h2" ? "h2" : block.style === "h3" ? "h3" : "p";
      html += "<" + tag + ">" + renderPortableSpans(block.children, block.markDefs) + "</" + tag + ">";
      i++;
    }
    return html;
  }
  function applyLegalPages(data) {
    ["pageImpressum", "pageDatenschutz"].forEach(function (key) {
      var doc = data[key];
      if (!doc || !Array.isArray(doc.body) || !doc.body.length) return;
      var container = document.querySelector('[data-sanity-richtext="' + key + '"]');
      if (container) container.innerHTML = renderPortableText(doc.body);
    });
  }

  // Hero-Hintergrundbilder: Bild wird VOR dem Einsetzen im Hintergrund vorgeladen,
  // damit nie eine leere/graue Fläche aufblitzt, während das neue Bild lädt.
  //
  // WICHTIG (Korrektur eines echten Bugs): Die aktuell sichtbare ("is-active")
  // Folie wurde bisher bewusst NICHT sofort aktualisiert, sondern erst, wenn sie
  // beim nächsten Rotationszyklus in den Hintergrund wechselt — mit der Absicht,
  // kein sichtbares Umspringen des gerade angezeigten Bilds zu verursachen. Das
  // hatte einen Nebeneffekt, der genau den gemeldeten Fehler erklärt: Slide 1
  // (das Hauptporträt, Reihenfolge 1) ist beim ersten Laden praktisch IMMER die
  // aktive Folie — ihr von Lars im Studio gesetztes Bild/Hotspot griff dadurch
  // erst nach einer vollen Rotation (~15+ Sekunden), nicht beim ersten Blick auf
  // die Seite. Jetzt wird auch die aktive Folie sofort aktualisiert, sobald das
  // vorgeladene Bild bereit ist — ein möglicher kurzer Bildwechsel beim allerersten
  // Laden wiegt weniger als eine Kern-Funktion (Studio-Fokuspunkt), die auf der
  // wichtigsten Folie schlicht nicht griff.
  // Gibt ein Promise zurück, das erst auflöst, sobald das Bild der GERADE
  // AKTIVEN Folie (i. d. R. die erste, beim ersten Laden fast immer sichtbar)
  // fertig geladen ist — genutzt vom einmaligen Lade-Reveal in main.js, damit
  // der dort gezeigte Slogan erst dann nach unten gleitet, wenn wirklich das
  // finale Bild (Sanity, falls vorhanden) steht und nicht kurz danach nochmal
  // "poppt". Kein Sanity-Bild für die aktive Folie? Dann löst das Promise
  // sofort auf (das lokale Fallback-Bild ist ohnehin längst da).
  // Lädt eine Bild-URL im Hintergrund vor und löst erst danach auf — verhindert,
  // dass ein <img src>/<source srcset> auf ein noch nicht geladenes Bild
  // umgestellt wird (kurzes Aufblitzen von "kaputtem Bild" bzw. des alten
  // Bilds, das mitten im Laden ruckartig ersetzt wird).
  function preloadThen(url, apply) {
    return new Promise(function (resolve) {
      var preload = new Image();
      preload.onload = function () {
        apply();
        resolve();
      };
      // Kaputte/nicht erreichbare URL soll den Reveal nicht für immer blockieren.
      preload.onerror = function () { resolve(); };
      preload.src = url;
    });
  }

  // Hero-Folien (heroSettings.heroSlides): EIN Baukasten-Array, jede Folie
  // kombiniert frei ein Hintergrundbild und/oder einen Spruch, beide über
  // ihren eigenen Kippschalter (bildAktiv/spruchAktiv) ein-/ausschaltbar.
  // Diese Funktion bereitet daraus zwei Dinge auf:
  //  1) Bis zu 4 aktive Bilder (bildAktiv!==false + hochgeladenes Bild)
  //     werden der Reihe nach in die 4 statischen Hero-Folien im HTML
  //     gepatcht (gleiches Fallback-Prinzip wie überall: kein Sanity-Bild an
  //     dieser Position -> das lokale Standardbild bleibt einfach stehen).
  //  2) window.__heroSlides bekommt die volle, geordnete Liste aller Folien
  //     als {spruchText, spruchAktiv, domIndex}. main.js läuft mit einem
  //     gemeinsamen Index über genau diese Liste (siehe dort): domIndex
  //     vorhanden -> Hintergrundbild wechselt mit; domIndex null (kein
  //     aktives Bild bei dieser Folie) -> das Hintergrundbild bleibt beim
  //     Erreichen dieser Folie einfach unverändert stehen, nur der Text wechselt.
  function applyHeroSlides(data) {
    var rawSlides = (data.heroSettings && data.heroSettings.heroSlides) || [];
    if (!Array.isArray(rawSlides) || !rawSlides.length) return Promise.resolve();

    var domSlides = document.querySelectorAll(".hero-slide[data-hero-slide-index]");
    var activeReady = Promise.resolve();
    var nextDomIndex = 0;
    var combined = [];

    rawSlides.forEach(function (slide) {
      if (!slide) return;
      var hasActiveImage = slide.bildAktiv !== false && !!slide.desktopBaseUrl;
      var domIndex = null;

      if (hasActiveImage && nextDomIndex < domSlides.length) {
        domIndex = nextDomIndex;
        nextDomIndex++;

        var slideEl = domSlides[domIndex];
        var isActive = slideEl.classList.contains("is-active");
        var imgEl = slideEl.querySelector("img");
        var sourceEl = slideEl.querySelector("source");
        var desktopUrl = heroImageUrl(slide.desktopBaseUrl, 1920);
        var mobileUrl = slide.mobileBaseUrl ? heroImageUrl(slide.mobileBaseUrl, 1080) : null;
        // Gleiches Prinzip wie bei den Leistungskacheln (siehe applyCardFocalPoints):
        // Sanitys Hotspot ist ein relativer 0-1-Wert, deckt sich 1:1 mit CSS
        // object-position in Prozent.
        var desktopPos =
          slide.desktopHotspot && typeof slide.desktopHotspot.x === "number" && typeof slide.desktopHotspot.y === "number"
            ? (slide.desktopHotspot.x * 100).toFixed(2) + "% " + (slide.desktopHotspot.y * 100).toFixed(2) + "%"
            : null;
        var mobilePos =
          slide.mobileHotspot && typeof slide.mobileHotspot.x === "number" && typeof slide.mobileHotspot.y === "number"
            ? (slide.mobileHotspot.x * 100).toFixed(2) + "% " + (slide.mobileHotspot.y * 100).toFixed(2) + "%"
            : null;

        var tasks = [];
        tasks.push(
          preloadThen(desktopUrl, function () {
            imgEl.src = desktopUrl;
            if (desktopPos) imgEl.style.setProperty("--hero-desktop-pos", desktopPos);
          })
        );
        if (mobileUrl && sourceEl) {
          tasks.push(
            preloadThen(mobileUrl, function () {
              sourceEl.srcset = mobileUrl;
              if (imgEl && mobilePos) imgEl.style.setProperty("--hero-mobile-pos", mobilePos);
            })
          );
        } else if (imgEl && mobilePos) {
          imgEl.style.setProperty("--hero-mobile-pos", mobilePos);
        }
        var ready = Promise.all(tasks);
        if (isActive) activeReady = ready;
      }

      combined.push({
        spruchText: slide.spruchText || "",
        spruchAktiv: slide.spruchAktiv,
        domIndex: domIndex,
      });

      // Weitere Sprüche (spruchTextsWeitere): laufen direkt im Anschluss mit
      // domIndex:null durch, sodass das gerade gezeigte Bild einfach stehen
      // bleibt und nur der Text mehrfach wechselt, bevor zur nächsten Folie
      // (mit eigenem Bild) übergegangen wird.
      (slide.spruchTextsWeitere || []).forEach(function (extra) {
        if (!extra) return;
        combined.push({ spruchText: extra, spruchAktiv: slide.spruchAktiv, domIndex: null });
      });
    });

    if (combined.length) window.__heroSlides = combined;
    return activeReady;
  }

  // Der grüne "Direkt anrufen"-Button ist nicht pro Bild vorhanden (ein Button
  // für den ganzen Hero) — ein einzelner globaler Schalter in heroSettings steuert ihn.
  function applyCallButtonToggle(data) {
    if (!data.heroSettings || data.heroSettings.showCallButton !== false) return; // Default (kein Feld / true) = sichtbar, unverändert
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
      applyThemeColors(data.themeSettings);
      applyEffectSettings(data);
      if (typeof window.__applySectionDesign === "function") window.__applySectionDesign(data);
      applyPageModules(data);
      applyCustomPageNav(data);
      applyNavOrder(data);
      var map = buildFieldMap(data);
      applyPatches(map);
      applyOptionalTextVisibility(data);
      applyPromiseIcons(map);
      if (map["settings.staticFormsApiKey"]) {
        cacheStaticFormsKey(map["settings.staticFormsApiKey"]);
      }
      // Lade-Reveal (main.js) wartet auf dieses Event, um erst dann vom
      // zentrierten Ladezustand zum normalen Layout zu gleiten, wenn das
      // finale (ggf. Sanity-)Hero-Bild wirklich fertig geladen ist.
      applyHeroSlides(data).then(function () {
        window.dispatchEvent(new Event("hero-image-ready"));
      });
      applyCardFocalPoints(map);
      applyServiceGalleries(data);
      applyEinsatzgebiet(data);
      applyLegalPages(data);
      applyCallButtonToggle(data);
      applyVorherNachher(data);
      applyInfoBanner(data);
      if (data.settings && data.settings.logoIconUrl) {
        applyFavicon(data.settings.logoIconUrl);
      }
    })
    .catch(function (err) {
      if (timeoutId) window.clearTimeout(timeoutId);
      // Sanity nicht erreichbar: Es gibt kein "finales" Bild abzuwarten außer
      // dem längst geladenen lokalen Fallback — Reveal darf sofort weiter.
      window.dispatchEvent(new Event("hero-image-ready"));
      if (window.console && console.warn) {
        console.warn("[sanity-content] Live-Inhalte nicht geladen, zeige statischen Stand. Grund:", err && err.message);
      }
    });
})();
