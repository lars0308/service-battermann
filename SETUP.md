# Setup: Hosting, Formular & Bilder-Verwaltung

Diese Website ist bewusst als **statische Seite ohne Datenbank** gebaut —
schnell, kostenlos hostbar und ohne Server, um den du dich kümmern müsstest.
Für das Nachpflegen von Vorher/Nachher-Bildern brauchst du kein WordPress und
keine Programmierkenntnisse; ein kleiner Admin-Bereich reicht.

## 1. Hosting über Netlify

1. Auf [netlify.com](https://netlify.com) anmelden (kostenloses Konto reicht).
2. **"Add new site" → "Import an existing project"** und dieses
   GitHub-Repository (`service-battermann`) auswählen.
3. Build-Befehl leer lassen, "Publish directory" auf `/` (Hauptverzeichnis)
   stellen und deployen.
4. Unter "Domain settings" die Domain `service-battermann.de` hinterlegen.

Das Kontaktformular auf `/kontakt.html` läuft **nicht** über Netlify Forms,
sondern über den externen Dienst Static Forms — Einrichtung siehe Abschnitt
1a unten.

## 1a. Kontaktformular über Static Forms freischalten

Das Formular auf `/kontakt.html` sendet seine Daten an Static Forms
(staticforms.dev). **Ohne API-Key passiert nichts Kaputtes** — das Formular
zeigt einfach eine Fehlermeldung des Dienstes, statt Anfragen zuzustellen,
bis der Key eingetragen ist.

1. Auf [staticforms.dev](https://www.staticforms.dev) ein Konto anlegen.
2. Ein neues Formular für `service-battermann.de` anlegen und den
   angezeigten **API-Key** kopieren.
3. In `kontakt.html` das Feld `<input type="hidden" name="apiKey" value="">`
   suchen und deinen Key zwischen die Anführungszeichen eintragen.
4. **Wichtig für den Foto-Upload:** Der kostenlose Tarif von Static Forms
   unterstützt keine Datei-Anhänge. Der "Foto anhängen"-Button im Formular
   funktioniert nur zuverlässig mit einem Pro- oder Agency-Tarif. Ohne
   Bezahltarif kommen Textnachrichten trotzdem an, angehängte Fotos werden
   aber nicht mitgeschickt.
5. Benachrichtigungen (E-Mail bei neuer Anfrage) richtest du im
   Static-Forms-Dashboard unter den Formular-Einstellungen ein.

## 2. Vorher/Nachher-Bilder pflegen

Der frühere GitHub-Admin-Bereich (`/admin/`, Sveltia CMS) wurde entfernt —
**ausnahmslos alle** Inhalte werden jetzt über Sanity Studio gepflegt
(siehe Abschnitt 5), auch die Vorher/Nachher-Galerien. Neue Projekte legst
du dort unter dem Dokumenttyp **"Vorher/Nachher-Projekt"** an (Titel,
Beschreibung, Kategorie, Vorher-/Nachher-Bild). Änderungen sind sofort
live, ohne Netlify-Neubau.

`content/vorher-nachher.json` bleibt im Repository als stiller Fallback
bestehen — falls Sanity einmal nicht erreichbar ist oder für eine
Kategorie noch kein Projekt angelegt wurde, zeigt die Seite ersatzweise
diese statischen Einträge, statt eine leere Fläche zu zeigen.

## 4. Echte Google-Bewertungen auf der Startseite anzeigen (optional)

Die Startseite kann echte 5-Sterne-Bewertungen direkt von Google Maps
anzeigen (`assets/js/google-reviews.js`). **Ohne Einrichtung passiert
nichts Kaputtes** — es bleibt einfach beim bestehenden Link "Bewertungen
auf Google ansehen". Erst wenn du die zwei Werte unten einträgst, werden
zusätzlich bis zu drei 5-Sterne-Bewertungen als Textkarten eingeblendet.

1. In der [Google Cloud Console](https://console.cloud.google.com/) ein
   Projekt anlegen (oder ein bestehendes nutzen) und **Billing aktivieren**
   — Google verlangt ein hinterlegtes Zahlungsmittel, auch wenn die Nutzung
   im Rahmen bleibt, die Places-Details-Abfrage kostet pro Aufruf.
2. **"Maps JavaScript API"** aktivieren (API & Dienste → Bibliothek).
3. Einen **API-Key** erstellen (API & Dienste → Anmeldedaten) und **zwingend
   per HTTP-Referrer einschränken** auf `https://service-battermann.de/*`
   (und ggf. die Netlify-Vorschau-Domain) — sonst kann jeder deinen Key
   aus dem Seitenquelltext kopieren und auf deine Kosten nutzen.
4. Deine **Place ID** herausfinden: [Place ID Finder von
   Google](https://developers.google.com/maps/documentation/places/web-service/place-id)
   — einfach den Firmennamen eingeben.
5. In `index.html` das Element mit `data-google-reviews` suchen und
   `data-api-key` sowie `data-place-id` mit deinen Werten befüllen.

Hinweis: Google erlaubt laut Nutzungsbedingungen keine dauerhafte
Zwischenspeicherung von Bewertungstexten — das Skript speichert deshalb
nichts (kein localStorage/Cache), sondern fragt bei jedem Seitenaufruf neu
ab, und zeigt die Google-Zuschreibung ("Bewertungen von Google") mit an.

## 5. Texte & Bilder live über Sanity ändern (Startseite)

Ein Teil der Startseite lässt sich jetzt **ohne GitHub, ohne Programmierung
und ohne Netlify-Neubau** direkt bearbeiten — über Sanity Studio, ein
separates, kostenloses CMS-Tool.

1. `https://service-battermann.sanity.studio` öffnen und mit deinem
   Sanity-Konto anmelden (Projekt-ID `9bz9h1mi`, Dataset `production`).
2. Dort bearbeitbar:
   - **Hero-Slide** (4 Stück): Text je Bildwechsel ganz oben, plus die
     3 rotierenden Sätze für das allererste Bild ("ist persönlich für Sie
     da" / "kümmert sich selbst darum" / "steht für sein Wort"), und das
     Hintergrundbild selbst.
   - **Vorteil** (4 Stück): die vier kurzen Textpunkte direkt unter dem
     Hero-Bild.
   - **Leistungsbereich** (5 Stück): Titel, Kurzbeschreibung (Text im
     Akkordeon auf `leistungen.html`) und Kartenbild der fünf
     Leistungs-Kacheln.
   - **FAQ-Eintrag** (7 Stück): Frage und Antwort auf `einsatzgebiet-faq.html`.
   - **Kontaktdaten**: Telefonnummer, WhatsApp-Link, E-Mail, Erreichbarkeit
     — wirkt sich auf Footer, Mega-Menü und den "Direkt anrufen"-Button im
     Hero auf allen Seiten aus.
   - **Website-Einstellungen**:
     - Logo (Icon) — wird in Header und Footer auf allen Seiten ersetzt.
     - Die 4 Navigations-Reiter-Texte ("Leistungen", "Über mich", …).
     - Hero-Unterzeile (die kleine Zeile über der Hero-Überschrift).
     - Hero-Wechselgeschwindigkeit in Millisekunden (wie lange ein
       Hero-Bild stehen bleibt).
     - Rechtlicher Footer-Hinweis (der Sternchen-Text im Footer aller Seiten).
     - Static Forms API-Key — siehe Hinweis unten.
3. Nach dem Speichern in Sanity ist die Änderung **beim nächsten Laden der
   Seite sofort sichtbar** — kein Netlify-Rebuild nötig, anders als beim
   Vorher/Nachher-Bereich (Abschnitt 3).

**Static-Forms-Key jetzt auch über Sanity pflegbar:** Trägst du den Key
unter Website-Einstellungen ein, überschreibt er automatisch das leere
Feld in `kontakt.html` beim Laden der Seite — der manuelle Weg aus
Abschnitt 1a (direkt im Code eintragen) funktioniert weiterhin genauso,
falls du Sanity dafür nicht nutzen willst. Trägst du an beiden Stellen
etwas ein, gewinnt der Sanity-Wert.

**Wie das technisch funktioniert, kurz erklärt:** Die Seite lädt weiterhin
zuerst ganz normal als statisches HTML (wichtig für Google & schnelles
erstes Laden). Erst danach fragt ein kleines Skript
(`assets/js/sanity-content.js`) einmal leise bei Sanity nach und ersetzt
nur die Textstellen/Bilder, die sich geändert haben — ohne sichtbares
Aufblitzen. Ist Sanity gerade nicht erreichbar oder ein Feld leer, bleibt
einfach der bisherige Text stehen; es kann dadurch nichts kaputtgehen.
Bild-URLs aus Sanity werden automatisch mit `?auto=format&q=90` abgerufen
(schärferes, modernes Bildformat direkt vom Sanity-Bild-CDN).

**Was bewusst NICHT an Sanity angebunden ist:** Impressum und
Datenschutzerklärung bleiben aus rechtlichen Gründen fest im Code —
Änderungen dort sollten bewusst und nachvollziehbar per Commit passieren,
nicht "mal eben" im CMS. Alles andere (Hero, Vorteile, Leistungen, FAQ,
Vorher/Nachher, Logo, Navigation, Kontaktdaten, Footer-Rechtstext) ist
vollständig über Sanity Studio pflegbar.

## Warum kein WordPress?

Der ursprüngliche Wunsch war "bevorzugt WordPress". Für eine reine
Firmenwebsite mit einem überschaubaren, klar umrissenen Pflegebedarf
(Vorher/Nachher-Bilder, ein paar Texte) bringt WordPress vor allem
zusätzliche Kosten und Aufwand mit sich: eigenes Hosting mit PHP/MySQL,
regelmäßige Sicherheits-Updates, höheres Angriffsrisiko und laufende
Wartung. Die hier umgesetzte Lösung (statische Seite + kleiner
Admin-Bereich über Netlify) erfüllt denselben Zweck — Bilder und Texte
ohne Programmierkenntnisse in wenigen Klicks pflegen — kostenlos und ohne
Wartungsaufwand.

**Falls du trotzdem ausdrücklich WordPress möchtest:** sag einfach
Bescheid, dann setzen wir die Seite stattdessen auf einem
WordPress-Hosting auf. Das bedeutet aber eigene Hosting-Kosten und einen
größeren Umbau der Seite.
