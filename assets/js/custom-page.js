// Universalgerüst für frei angelegte Unterseiten (Sanity: customPage).
// Header/Mega-Menü/Footer in page.html sind identisch zu jeder anderen Seite
// und werden bereits von sanity-content.js gepatcht (data-sanity-field).
// Dieses Skript ist eigenständig und kümmert sich NUR um den mittleren
// Inhaltsbereich: es liest den Slug aus der aktuellen URL, lädt genau das
// dazu passende customPage-Dokument und rendert Titel/Einleitung/Rich-Text.
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
    '*[_type=="customPage" && slug.current=="' + safeSlug + '"][0]' +
    '{title,intro,content[]{...,_type=="image"=>{"imageUrl":asset->url}}}';
  var ENDPOINT =
    "https://" + PROJECT_ID + ".api.sanity.io/v2024-01-01/data/query/" + DATASET +
    "?query=" + encodeURIComponent(QUERY);

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderSpans(spans, markDefs) {
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

  // Wie renderPortableText in sanity-content.js, ergänzt um image-Blöcke
  // (dort bewusst nicht nötig, hier für customPage.content Pflicht).
  function renderContent(blocks) {
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
      var doc = json && json.result;
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
        contentEl.innerHTML = renderContent(doc.content);
      }
    })
    .catch(function () {
      if (notFoundEl) notFoundEl.hidden = false;
    });
})();
