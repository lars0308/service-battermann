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

1. Im Netlify-Dashboard der Seite: **Identity** öffnen → **Enable Identity**.
2. Unter "Registration preferences" **"Invite only"** wählen.
3. Unter **Services → Git Gateway** auf **Enable Git Gateway** klicken.
4. Unter "Identity → Invite users" deine eigene E-Mail-Adresse eintragen.
   Du bekommst eine Einladungsmail.

## 3. Bilder & Texte pflegen

1. Link aus der Einladungsmail öffnen, Passwort festlegen.
2. Danach bist du automatisch unter `/admin/` eingeloggt.
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
