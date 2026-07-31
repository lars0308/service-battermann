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

## 2. Admin-Zugang für Vorher/Nachher-Bilder aktivieren

Der Admin-Bereich (`/admin/`) meldet sich direkt mit deinem GitHub-Konto an
(nicht über Netlify Identity — das unterstützt das hier verwendete CMS
nicht mehr). Dafür einmalig eine GitHub-OAuth-App anlegen und mit Netlify
verbinden:

1. Auf [github.com/settings/developers](https://github.com/settings/developers)
   → **"OAuth Apps" → "New OAuth App"**.
2. Angaben eintragen:
   - Homepage URL: `https://service-battermann.de`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
3. App erstellen, **Client ID** kopieren und über **"Generate a new client
   secret"** ein **Client Secret** erzeugen (sofort kopieren, wird danach
   nicht mehr angezeigt).
4. Im Netlify-Dashboard der Seite: **Site configuration → General →
   Access control → OAuth** öffnen (teils auch unter "Identity" zu
   finden) und dort bei **"GitHub"** Client ID und Client Secret eintragen.

## 3. Bilder & Texte pflegen

1. `https://service-battermann.de/admin/` öffnen.
2. **"Login with GitHub"** klicken und mit deinem GitHub-Konto (`lars0308`)
   anmelden — dieses Konto hat bereits Schreibzugriff auf das Repository.
3. Dort kannst du unter "Vorher / Nachher – Projekte":
   - neue Projekte hinzufügen (Titel, kurze Beschreibung, Vorher-Bild,
     Nachher-Bild)
   - bestehende Projekte bearbeiten, neu anordnen oder löschen
4. Nach dem Speichern baut Netlify die Seite automatisch neu — nach
   ein bis zwei Minuten ist die Änderung live auf `/index.html` sichtbar.

Die Startseite lädt die Projektliste aus `content/vorher-nachher.json` und
zeigt jeden Eintrag automatisch im Vorher/Nachher-Bereich an — ohne dass
jemand Code anfassen muss.

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
