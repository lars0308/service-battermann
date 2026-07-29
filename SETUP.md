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

Sobald ein Deploy läuft, funktioniert das Kontaktformular auf `/kontakt.html`
automatisch über **Netlify Forms** — Einsendungen landen im
Netlify-Dashboard unter "Forms" inklusive hochgeladener Fotos, zusätzlich
kann eine Benachrichtigung an deine E-Mail-Adresse eingerichtet werden
(Site settings → Forms → Form notifications).

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
