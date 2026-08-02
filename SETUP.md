# Setup: Hosting, Formular & Bilder-Verwaltung

Diese Website ist bewusst als **statische Seite ohne Datenbank** gebaut —
schnell, kostenlos hostbar und ohne Server, um den du dich kümmern müsstest.
Für das Nachpflegen von Vorher/Nachher-Bildern brauchst du kein WordPress und
keine Programmierkenntnisse; ein kleiner Admin-Bereich reicht.

## 0. Sanity Studio automatisch deployen (einmalige Einrichtung)

Änderungen am Studio selbst — neue Felder, neue Inhaltstypen, Struktur-
Anpassungen — sind **Code-Änderungen** und müssen deployed werden, damit sie
im Studio unter `service-battermann.sanity.studio` erscheinen. Bisher
musstest du dafür manuell `npm run deploy` in `studio-website` ausführen.

Mit dieser einmaligen Einrichtung übernimmt das GitHub automatisch, sobald
Code im `studio-website`-Ordner gepusht wird — praktisch, wenn du viel vom
Handy aus arbeitest und kein Terminal öffnen willst.

**Einmalig einzurichten (dauert ~5 Minuten):**

1. Auf [sanity.io/manage](https://www.sanity.io/manage) → Projekt `9bz9h1mi`
   → **API** → **Tokens** → **"Add API token"**.
2. Namen vergeben (z. B. "GitHub Actions Deploy"), Rolle
   **"Deploy Studio (Token only)"** wählen (genau für diesen Zweck gedacht
   — ein Editor/Viewer-Token reicht nicht). Token erzeugen und **sofort
   kopieren** (wird nur einmal angezeigt).
3. Im GitHub-Repository (am Handy geht das über die GitHub-App oder den
   Browser): **Settings** → **Secrets and variables** → **Actions** →
   **"New repository secret"**.
4. Name: `SANITY_AUTH_TOKEN`, Value: der eben kopierte Token. Speichern.

**Ab jetzt läuft es automatisch:** Jedes Mal, wenn sich etwas im Ordner
`studio-website` ändert und auf `main` landet, deployed GitHub Actions das
Studio von selbst — sichtbar unter **Actions**-Tab des Repos (grüner Haken
= erfolgreich deployed, meist unter 2 Minuten). Kein Terminal, kein ZIP-
Download, kein `npm install` mehr nötig.

**Falls der automatische Deploy fehlschlägt** (z. B. Token abgelaufen oder
falsch kopiert): Der Actions-Tab zeigt eine rote Fehlermeldung mit Details.
Häufigster Grund: der Token wurde falsch/unvollständig eingefügt oder hat
nicht die Rolle "Deploy Studio (Token only)" — einfach einen neuen Token
erzeugen und das Secret überschreiben (gleicher Name, neuer Wert).

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
(staticforms.dev). Der API-Key steht bereits fest im HTML-Quellcode
(`<input type="hidden" name="accessKey" value="sf_...">`) — das Formular
funktioniert damit sofort, ohne weitere Einrichtung. Ändert sich der Key
(z. B. bei einem neuen Static-Forms-Konto), gibt es zwei Wege, ihn
auszutauschen:

1. **Über Sanity** (empfohlen, kein Code-Zugriff nötig): Neuen Key unter
   Website-Einstellungen → Static Forms API-Key eintragen — überschreibt
   automatisch den festen HTML-Wert beim Laden der Seite.
2. **Direkt im Code:** In `kontakt.html` das Feld
   `<input type="hidden" name="accessKey" value="...">` suchen und den neuen
   Key zwischen die Anführungszeichen eintragen.
3. **Wichtig für den Foto-Upload:** Der kostenlose Tarif von Static Forms
   unterstützt keine Datei-Anhänge. Der "Foto anhängen"-Button im Formular
   funktioniert nur zuverlässig mit einem Pro- oder Agency-Tarif. Ohne
   Bezahltarif kommen Textnachrichten trotzdem an, angehängte Fotos werden
   aber nicht mitgeschickt.
4. Benachrichtigungen (E-Mail bei neuer Anfrage) richtest du im
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
2. Das Studio ist links strikt nach den echten Webseiten sortiert (nicht
   nach Dokumenttypen): eigene Fächer für "Startseite (Home)", "Seite
   Leistungen (Details)", "Seite Über mich", "Seite Einsatzgebiet",
   "Rechtstexte (Footer)" und ganz unten "Website-weit" für alles, was auf
   mehreren Seiten gleichzeitig wirkt (Navigation, Kontaktdaten, Formular-
   Key). Inhalte, die auf zwei Seiten erscheinen (z. B. ein Leistungsbereich:
   Kachel auf der Startseite UND ausführlicher Bereich auf der Leistungs-
   seite), tauchen bewusst in beiden Fächern auf — es ist derselbe Datensatz,
   nur an der Stelle im Studio sichtbar, wo er auf der Website auch wirklich
   erscheint.
3. Dort bearbeitbar:
   - **Hero-Bereich** (Fach "Startseite (Home)", ein Dokument): Bilder und
     Sprüche sind bewusst komplett voneinander getrennt, keine feste 1:1-
     Kopplung mehr zwischen einem bestimmten Bild und einem bestimmten Text:
     - **Hintergrundbilder** (Array, bis zu 4 werden auf der Website
       verwendet): pro Bild zwei getrennte Bildfelder — **Desktop (16:9
       Querformat)**, Pflicht, und **Smartphone (9:16 Hochformat)**,
       optional (bleibt das Feld leer, nutzt das Handy automatisch das
       Desktop-Bild). Beide Felder haben einen eigenen Fokuspunkt (Hotspot)
       — bei einem Klick/Ziehen im Studio-Bild wird der Bildausschnitt live
       angepasst. Die Bilder wechseln im Hintergrund per Kreuzblende durch.
     - **Sprüche** (reines Text-Array, beliebig viele über den "+"-Knopf):
       kurze Sätze, die im Vordergrund unabhängig von den Bildern per
       Kreuzblende durchwechseln, z. B. „Hilft sofort bei lästigen
       Kleinreparaturen.“ — direkt im Klartext eintippen, kein Bild nötig.
     - **"Direkt anrufen"-Button zeigen**: globaler Ein/Aus-Schalter für den
       grünen Anruf-Button im Hero.
   - **Vorteil** (4 Stück): die vier kurzen Textpunkte direkt unter dem
     Hero-Bild.
   - **Leistungsbereich** (5 Stück): steuert BEIDE Seiten aus einem
     Dokument, mit zwei klar benannten Textfeldern für zwei Orte:
     „Kurztext für Startseiten-Kachel (max. 2 Sätze)“ erscheint im
     Glasfenster der Bento-Kachel auf der Startseite, „Ausführlicher
     Detailtext für Leistungsseite“ im Glasfenster der Kachel auf
     `leistungen.html` — keine Verwechslungsgefahr mehr zwischen den beiden.
     Dazu Titel, Verb, CTA-Text/-Link und das Kartenbild (auf beiden Seiten
     verwendet). So pflegst du jeden Bereich nur an einer Stelle statt
     doppelt für beide Seiten.
   - **FAQ-Eintrag** (7 Stück): Frage und Antwort auf `einsatzgebiet-faq.html`.
   - **Einsatzgebiet-Ort** (beliebig viele): Ortsname + Anfahrtskosten je Ort
     (z. B. „Kostenlose Anfahrt“ oder „25,- € Pauschale“). Erscheinen als
     anklickbare Pillen über der Anfahrtskarte auf `einsatzgebiet-faq.html` —
     ein Klick zeigt die hinterlegten Kosten in einem Glas-Popover. Ohne
     eigene Sanity-Einträge bleiben die 6 statischen Fallback-Pillen
     (Lindhorst, Stadthagen, Bückeburg, Bad Nenndorf, Beckedorf,
     Barsinghausen) stehen.
   - **Kontaktdaten**: Telefonnummer, WhatsApp-Link, E-Mail, Erreichbarkeit
     — wirkt sich auf Footer, Mega-Menü und den "Direkt anrufen"-Button im
     Hero auf allen Seiten aus.
   - **Mega-Menü-Link**: die Titel/Kurzbeschreibungen/Ziel-Links der
     Dropdown-Spalten unter "Leistungen", "Über mich" und "Einsatzgebiet &
     FAQ" im Menü. Kontakt hat bewusst keine eigenen Mega-Menü-Link-Einträge
     — die 3 Kontakt-Links im Menü ziehen ihre Werte direkt aus
     "Kontaktdaten", damit Telefonnummer/E-Mail nicht doppelt gepflegt
     werden müssen.
   - **Versprechen-Karte** (3 Stück, Fach "Seite Über mich"): Icon-Auswahl,
     Überschrift und Text der drei Glas-Karten unter "Drei Dinge, auf die
     Sie sich verlassen können".
   - **Impressum / Datenschutzerklärung** (Fach "Rechtstexte (Footer)"):
     der komplette Rechtstext beider Seiten als Rich Text (Überschriften,
     Absätze, Aufzählungen, Links) direkt im Studio editierbar — kein
     Code-Zugriff mehr nötig für Textänderungen. Name/Anschrift/Telefon/
     E-Mail bleiben zentral unter Kontaktdaten/Website-Einstellungen gepflegt.
   - **Info-Banner**: optionaler schmaler Hinweisbalken ganz oben auf jeder
     Seite. Manueller Ein/Aus-Schalter plus optionales Ablaufdatum — nach
     Erreichen des Datums verschwindet er automatisch, ohne dass du ihn
     manuell wieder ausschalten musst.
   - **Website-Einstellungen**:
     - Logo (Icon) — wird in Header und Footer auf allen Seiten ersetzt.
     - Die 4 Navigations-Reiter-Texte ("Leistungen", "Über mich", …).
     - Hero-Unterzeile (die kleine Zeile über der Hero-Überschrift).
     - Slidertuning: `autoplaySpeed` — wie lange ein Hero-Bild stehen bleibt
       (Standard 5000ms) — und `transitionSpeed` — Dauer der Kreuzblende
       beim Bildwechsel (Standard 1200ms).
     - Kit-Animationssteuerung: Tempo, Skalierung und Abdunklung des
       automatischen Hervorhebungs-Effekts der 5 Leistungskacheln.
     - Glas-Intro (Startseite): Anzeige-Dauer der Glaswand in Millisekunden
       (Standard 3000) und Stärke des Weichzeichners in Pixel (Standard 45).
       Das Intro läuft nur beim ersten Aufruf der Startseite in einer
       Browser-Sitzung bzw. bei einem echten Neuladen (F5) — beim Klicken
       zurück zur Startseite von einer Unterseite aus erscheint es kein
       zweites Mal.
     - Rechtlicher Footer-Hinweis (der Sternchen-Text im Footer aller Seiten).
     - Static Forms API-Key — siehe Hinweis unten.
4. Nach dem Speichern in Sanity ist die Änderung **beim nächsten Laden der
   Seite sofort sichtbar** — kein Netlify-Rebuild nötig, anders als beim
   Vorher/Nachher-Bereich (Abschnitt 3).

**Static-Forms-Key jetzt auch über Sanity pflegbar:** Trägst du den Key
unter Website-Einstellungen ein, überschreibt er automatisch den festen
HTML-Standardwert in `kontakt.html` beim Laden der Seite — der manuelle Weg
aus Abschnitt 1a (direkt im Code eintragen) funktioniert weiterhin genauso,
falls du Sanity dafür nicht nutzen willst. Trägst du an beiden Stellen
etwas ein, gewinnt der Sanity-Wert. Der Key wird außerdem im Browser
zwischengespeichert (localStorage), sobald er einmal geladen wurde — ruft
ein Besucher `kontakt.html` direkt auf und sendet sofort ab, bevor der
Sanity-Abruf fertig ist, greift zuerst dieser Zwischenspeicher, bevor
überhaupt ein Nachlade-Request nötig wird.

**Wie das technisch funktioniert, kurz erklärt:** Die Seite lädt weiterhin
zuerst ganz normal als statisches HTML (wichtig für Google & schnelles
erstes Laden). Erst danach fragt ein kleines Skript
(`assets/js/sanity-content.js`) einmal leise bei Sanity nach und ersetzt
nur die Textstellen/Bilder, die sich geändert haben — ohne sichtbares
Aufblitzen. Ist Sanity gerade nicht erreichbar oder ein Feld leer, bleibt
einfach der bisherige Text stehen; es kann dadurch nichts kaputtgehen.
Bild-URLs aus Sanity werden automatisch mit `?auto=format&q=90` abgerufen
(schärferes, modernes Bildformat direkt vom Sanity-Bild-CDN).

**Optional: Auch unveröffentlichte Entwürfe live anzeigen (Draft-Preview).**
Standardmäßig zeigt die Seite nur veröffentlichte ("published") Inhalte —
ein Entwurf im Studio, der noch nicht auf "Veröffentlichen" geklickt wurde,
erscheint nicht auf der Website. Willst du stattdessen auch unfertige
Entwürfe sofort sehen können, ohne vorher zu veröffentlichen:

1. In `sanity.io/manage` → Projekt `9bz9h1mi` → API → Tokens → "Add API
   token" → Rolle **"Viewer"** (nur Lesen) wählen, Token erzeugen.
2. Den Token in `assets/js/sanity-content.js` bei der Konstante
   `READ_TOKEN` eintragen (Kommentar direkt daneben erklärt es nochmal).
3. **Sicherheitshinweis:** Diese Seite ist eine reine, statische Website
   ohne eigenen Server — jeder eingetragene Token liegt damit offen im
   öffentlich ausgelieferten JavaScript und ist für jeden Besucher über
   "Seitenquelltext anzeigen" einsehbar. Ein "Viewer"-Token kann nichts
   verändern oder löschen, erlaubt aber jedem, auch deine unveröffentlichten
   Entwürfe zu lesen. Für die meisten Fälle reicht die Standardeinstellung
   (nur veröffentlichte Inhalte) völlig aus — nur aktivieren, wenn dir das
   bewusst ist und du es wirklich willst.

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
