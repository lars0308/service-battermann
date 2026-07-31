# Sanity-Vorbereitung (noch nicht aktiv)

Dieser Ordner enthält **nur Schema-Entwürfe** für ein zukünftiges Sanity-Studio-Projekt. Es ist bewusst noch keine echte Sanity-Anbindung eingerichtet — dafür wird ein eigener Sanity-Account mit Projekt-ID, Dataset und API-Token benötigt, den nur der Betreiber der Website anlegen kann.

## Warum die Website bis dahin nicht schon jetzt aus Sanity lädt

Hero-Texte, Leistungsbeschreibungen & Co. bleiben bewusst als statisches HTML im Quellcode, nicht als Client-seitig nachgeladenes JSON. Ein Nachladen der wichtigsten Inhalte per JavaScript würde zwei Prioritäten der Website verschlechtern, die laut Projektbriefing Vorrang vor CMS-Komfort haben:

- **SEO:** Suchmaschinen-Crawler sähen beim ersten Rendern leere Hero-Überschriften.
- **Performance/CLS:** Ein kurzer Content-Flash beim Nachladen verschlechtert Ladegefühl und Layout-Stabilität.

Die einzige aktuell bestehende Ausnahme ist `content/vorher-nachher.json` (sekundäre Vorher/Nachher-Galerien weiter unten auf der Seite) — dieses Muster bleibt unverändert bestehen und wird über das aktive Sveltia-CMS (`admin/config.yml`) gepflegt.

## Enthaltene Schema-Entwürfe

- `schemas/heroSlide.js` — die 4 Hero-Slider-Folien inkl. rotierender Texte für die erste Folie
- `schemas/trustPoint.js` — die 4 „Vorteile“-Karten unter dem Hero
- `schemas/service.js` — die 5 Leistungsbereiche (Akkordeon)
- `schemas/vorherNachherProjekt.js` — 1:1-Abbildung der bestehenden `content/vorher-nachher.json`
- `schemas/siteSettings.js` — Firmenname, Logo, Einsatzgebiet, Footer-Rechtstext
- `schemas/contactInfo.js` — Telefon, WhatsApp, E-Mail, Erreichbarkeit

Die Feldnamen sind absichtlich so gewählt, dass sie sich später leicht auf echte Sanity-Dokumente abbilden lassen.

## Nächste Schritte, sobald ein Sanity-Projekt gewünscht ist

1. `npm create sanity@latest` in einem separaten Studio-Ordner ausführen (eigener Account/Login von Lars nötig).
2. Die Dateien aus `sanity/schemas/` als Schema-Typen einbinden (`sanity.config.js` → `schema.types`).
3. Bestehende Inhalte (aktuell im HTML sowie `content/vorher-nachher.json`) einmalig in Sanity-Dokumente überführen.
4. Erst danach entscheiden, ob/wie die Website die Inhalte serverseitig (Build-Step) oder weiterhin statisch aus Sanity bezieht — ohne die oben genannten SEO-/Performance-Nachteile eines reinen Client-Fetches.

Bis dahin bleibt **Sveltia CMS** (Git-basiert, sofort einsatzbereit, kein zusätzlicher Account nötig) die aktive Content-Pflege für die Vorher/Nachher-Galerien.

## Content-Map: HTML-Element ↔ Schema-Feld

Damit eine spätere Migration ein reines Abbilden ist statt eine Neuinterpretation, hier die genaue Zuordnung zwischen dem heutigen statischen HTML und den Schema-Feldern oben.

| Schema | Feld | Fundstelle im HTML |
| --- | --- | --- |
| `heroSlide` | `image`, `prefix`, `verb`, `roundTexts` | `index.html`, `.hero-slides` / `.hero-slide-line[data-slide-index]`; rotierende Texte in `assets/main.js` als `HERO_ROUND_TEXTS` |
| `trustPoint` | `text` | `index.html`, `.trust-strip .item` (4 Einträge) |
| `service` | `anchorId`, `verb`, `title`, `requiresLegalNote`, `description`, `cardImage`, `gallery` | `index.html` `.leistung-cards` (Kartenbild + Titel) und `leistungen.html` `#service-list .service-row` (Beschreibung + Galerie); `anchorId` = `id` des jeweiligen `.service-row` |
| `vorherNachherProjekt` | 1:1 | `content/vorher-nachher.json` (bereits aktiv über Sveltia gepflegt) |
| `siteSettings` | `companyName`, `ownerName`, `logoIcon/Full`, `serviceAreaTowns`, `serviceAreaRadiusKm`, `legalNotice` | Header-`.brand`, `einsatzgebiet-faq.html` `.badge-list`, Footer `.footer-legal` (identisch auf allen 7 Seiten) |
| `contactInfo` | `phone`, `phoneHref`, `whatsapp`, `email`, `openingHours` | Footer `.footer` „Direkter Kontakt“, `.fab-group`, Hero-CTAs (identisch auf allen 7 Seiten) |

Bewusst nicht modelliert: die einzelnen FAQ-Einträge auf `einsatzgebiet-faq.html` und die Rechtstexte auf `impressum.html`/`datenschutz.html` — diese ändern sich praktisch nie und würden im CMS nur zusätzlichen Pflegeaufwand ohne echten Nutzen erzeugen.
