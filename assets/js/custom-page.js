// Universalgerüst für frei angelegte Unterseiten (Sanity: customPage).
// Läuft auf page.html (direkter Aufruf/lokale Tests) UND auf 404.html — auf
// GitHub Pages (aktuelle Deploy-Plattform) liefert GitHub für jeden nicht
// existierenden Pfad wie /notdienst automatisch 404.html aus, das denselben
// Inhalt wie page.html hat (siehe dort der <base>-Tag-Trick, damit relative
// Pfade trotz des "falschen" URL-Pfads richtig auflösen).
// Header/Mega-Menü/Footer sind identisch zu jeder anderen Seite und werden
// bereits von sanity-content.js gepatcht (data-sanity-field). Dieses Skript
// ist eigenständig und kümmert sich NUR um den mittleren Inhaltsbereich: es
// liest den Slug aus der aktuellen URL, lädt genau das dazu passende
// customPage-Dokument und rendert Titel/Einleitung/Rich-Text.
// Kein passendes Dokument (falscher/veralteter Link, Tippfehler) -> sauberer
// "nicht gefunden"-Hinweis statt leerer Fläche.
(function () {
  "use strict";

  var titleEl = document.querySelector("[data-custom-page-title-text]");
  var introEl = document.querySelector("[data-custom-page-intro]");
  var contentEl = document.querySelector("[data-custom-page-content]");
  var notFoundEl = document.querySelector("[data-custom-page-notfound]");
  if (!titleEl || !contentEl) return; // nur relevant auf page.html

  function slugFromPath() {
    var path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    if (!path || path.toLowerCase() === "page.html") return null;
    // Falls page.html direkt mit angehängtem Pfad aufgerufen wird
    // (z. B. lokale Tests ohne Netlify-Rewrite): letztes Segment verwenden.
    var segments = path.split("/");
    return segments[segments.length - 1];
  }

  var slug = slugFromPath();
  if (!slug) {
    if (notFoundEl) notFoundEl.hidden = false;
    return;
  }

  var PROJECT_ID = "9bz9h1mi";
  var DATASET = "production";
  var safeSlug = slug.replace(/"/g, '\\"');
  var QUERY =
    '{"page":*[_type=="customPage" && slug.current=="' + safeSlug + '"][0]' +
    '{title,intro,content[]{...,' +
    '_type=="image"=>{"imageUrl":asset->url},' +
    '_type=="embedService"=>{"service":service->{title,verb,shortDescription,"anchor":anchorId.current,"cardImageUrl":cardImage.asset->url}}' +
    '}},' +
    '"trust":*[_type=="trustPoint"]|order(order asc){text,detail}}';
  var ENDPOINT =
    "https://" + PROJECT_ID + ".api.sanity.io/v2024-01-01/data/query/" + DATASET +
    "?query=" + encodeURIComponent(QUERY);

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Kuratierte Markenfarben statt freier Farbwahl (siehe customPage.ts,
  // Feld "textColor") — passend zur CLAUDE.md-Vorgabe, keine beliebigen/
  // typischen KI-Verlaufsfarben zuzulassen.
  var TEXT_COLOR_VARS = {gold: "var(--accent)", gruen: "var(--brand-green, #25D366)"};

  function renderSpans(spans, markDefs) {
    return (spans || [])
      .map(function (span) {
        var text = escapeHtml(span.text || "");
        (span.marks || []).forEach(function (mark) {
          if (mark === "strong") {
            text = "<strong>" + text + "</strong>";
          } else if (mark === "em") {
            text = "<em>" + text + "</em>";
          } else if (mark === "underline") {
            text = "<span style=\"text-decoration:underline\">" + text + "</span>";
          } else {
            var def = (markDefs || []).filter(function (d) { return d._key === mark; })[0];
            if (def && def._type === "link" && def.href) {
              var external = /^https?:\/\//.test(def.href) ? ' target="_blank" rel="noopener"' : "";
              text = '<a href="' + escapeHtml(def.href) + '"' + external + ">" + text + "</a>";
            } else if (def && def._type === "textColor" && TEXT_COLOR_VARS[def.farbe]) {
              text = '<span style="color:' + TEXT_COLOR_VARS[def.farbe] + '">' + text + "</span>";
            }
          }
        });
        return text;
      })
      .join("");
  }

  function renderTrustStrip(trust) {
    if (!trust || !trust.length) return "";
    var cards = trust
      .map(function (t) {
        return (
          '<div class="trust-card"><span class="trust-card-title">' +
          escapeHtml(t.text || "") +
          '</span><span class="trust-card-detail">' +
          escapeHtml(t.detail || "") +
          "</span></div>"
        );
      })
      .join("");
    return (
      '<div class="trust-strip-section dark" style="margin:var(--space-4) 0"><div class="trust-track"><div class="trust-set">' +
      cards +
      "</div></div></div>"
    );
  }

  function renderServiceCard(service) {
    if (!service || !service.title) return "";
    var href = service.anchor ? "leistungen.html#" + escapeHtml(service.anchor) : "leistungen.html";
    var img = service.cardImageUrl
      ? '<img src="' + escapeHtml(service.cardImageUrl) + '?w=1200&auto=format&q=90" alt="" loading="lazy">'
      : "";
    return (
      '<a class="embed-service-card" href="' + href + '">' +
      img +
      '<span class="embed-service-card-scrim" aria-hidden="true"></span>' +
      '<span class="embed-service-card-title">' + escapeHtml(service.title) + "</span>" +
      (service.shortDescription ? '<span class="embed-service-card-desc">' + escapeHtml(service.shortDescription) + "</span>" : "") +
      '<span class="embed-service-card-arrow" aria-hidden="true">→</span>' +
      "</a>"
    );
  }

  // Wie renderPortableText in sanity-content.js, ergänzt um image-Blöcke
  // (dort bewusst nicht nötig, hier für customPage.content Pflicht) sowie um
  // die beiden Einbett-Bausteine (embedService/embedTrustStrip).
  function renderContent(blocks, trust) {
    var html = "";
    var i = 0;
    while (i < blocks.length) {
      var block = blocks[i];
      if (block._type === "image") {
        var url = block.imageUrl;
        if (url) {
          html += '<img src="' + escapeHtml(url) + '?w=1200&auto=format&q=90" alt="" loading="lazy" style="width:100%;height:auto;margin:var(--space-4) 0">';
        }
        i++;
        continue;
      }
      if (block._type === "embedService") {
        html += renderServiceCard(block.service);
        i++;
        continue;
      }
      if (block._type === "embedTrustStrip") {
        html += renderTrustStrip(trust);
        i++;
        continue;
      }
      if (block._type !== "block") { i++; continue; }
      if (block.listItem === "bullet") {
        var items = "";
        while (i < blocks.length && blocks[i].listItem === "bullet") {
          items += "<li>" + renderSpans(blocks[i].children, blocks[i].markDefs) + "</li>";
          i++;
        }
        html += "<ul>" + items + "</ul>";
        continue;
      }
      var tag = block.style === "h2" ? "h2" : block.style === "h3" ? "h3" : "p";
      html += "<" + tag + ">" + renderSpans(block.children, block.markDefs) + "</" + tag + ">";
      i++;
    }
    return html;
  }

  fetch(ENDPOINT, {cache: "no-store"})
    .then(function (res) {
      return res.ok ? res.json() : Promise.reject(new Error("Sanity-Antwort: HTTP " + res.status));
    })
    .then(function (json) {
      var result = json && json.result;
      var doc = result && result.page;
      if (!doc || !doc.title) {
        if (notFoundEl) notFoundEl.hidden = false;
        return;
      }
      document.title = doc.title + " | Objekt- & Reparaturservice Battermann";
      titleEl.textContent = doc.title;
      if (doc.intro && introEl) {
        introEl.textContent = doc.intro;
        introEl.hidden = false;
      }
      if (Array.isArray(doc.content) && doc.content.length) {
        contentEl.innerHTML = renderContent(doc.content, result.trust);
      }
    })
    .catch(function () {
      if (notFoundEl) notFoundEl.hidden = false;
    });
})();
