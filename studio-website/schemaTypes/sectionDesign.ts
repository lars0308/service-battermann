import {defineType, defineField} from 'sanity'

// Kuratierte Design-Feinschliff-Optionen für genau EINE Sektion einer Seite.
// Wird pro Sektion als eigenes benanntes Feld (z. B. "heroDesign",
// "anfangDesign") in die jeweilige Feldgruppe eingehängt (siehe
// pageHome.ts/pageUeberMich.ts usw.) — bewusst als eigener Objekt-Typ, damit
// die 4 Achsen nicht in jeder Schema-Datei erneut abgetippt werden müssen.
// Nichts ausgewählt (Standard) -> design-controls.js setzt keine CSS-Klasse
// -> die Sektion sieht exakt so aus wie heute (kein freier Wert erreicht je
// das DOM, nur die hier vorgegebenen Kombinationen).
export const sectionDesign = defineType({
  name: 'sectionDesign',
  title: 'Darstellung (Design-Feinschliff)',
  type: 'object',
  description:
    'Optionale, bewusst begrenzte Design-Anpassungen für genau diesen Bereich — keine freien Werte, nur vorgegebene, geprüfte Kombinationen. "Standard" (oder leer) = keine Änderung.',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'textGroesse',
      title: 'Textgröße',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Klein', value: 'klein'},
          {title: 'Groß', value: 'gross'},
          {title: 'Sehr groß', value: 'sehr-gross'},
        ],
      },
    }),
    defineField({
      name: 'farbe',
      title: 'Akzentfarbe (Dachzeile/Überschrift)',
      type: 'string',
      description:
        'Kuratierte Markenfarben, keine freie Farbwahl — dieselben 2 Töne wie bei „Textfarbe" in Freien Unterseiten.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Gold (Akzentfarbe)', value: 'gold'},
          {title: 'Grün (WhatsApp-Farbe)', value: 'gruen'},
        ],
      },
    }),
    defineField({
      name: 'glas',
      title: 'Glas-Einstellungen',
      type: 'string',
      description:
        'Wirkt nur, wenn diese Sektion überhaupt eine Glas-Fläche enthält (z. B. Formular-Karte, Leistungs-Glasfenster) — sonst ohne sichtbaren Effekt.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Kein Glaseffekt', value: 'kein'},
          {title: 'Leicht', value: 'leicht'},
          {title: 'Stark', value: 'stark'},
        ],
      },
    }),
    defineField({
      name: 'fadeTiming',
      title: 'Fade-Timing (Einblenden beim Scrollen)',
      type: 'string',
      description: 'Überschreibt für diese Sektion allein die website-weite Einstellung im Kinetik-Studio.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Standard (website-weite Einstellung)', value: 'standard'},
          {title: 'Schnell', value: 'schnell'},
          {title: 'Sanft (langsamer)', value: 'sanft'},
          {title: 'Aus (kein Einblend-Effekt)', value: 'aus'},
        ],
      },
    }),
  ],
})
