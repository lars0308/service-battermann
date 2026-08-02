import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

// EIN flexibles Baukasten-Array (heroSlides) statt getrennter Bild-/Text-
// Listen: jede Folie kombiniert wahlweise ein Hintergrundbild UND/ODER einen
// Vordergrund-Spruch, beide unabhängig über einen eigenen Kippschalter
// (bildAktiv/spruchAktiv) ein-/ausschaltbar. Lars kann so z. B. eine Folie
// nur mit Text pflegen (kein Bild hochgeladen oder bildAktiv aus) — das
// Frontend lässt in diesem Fall das zuletzt gezeigte Hintergrundbild
// einfach stehen und wechselt nur den Text (siehe assets/main.js).
export const heroSettings = defineType({
  name: 'heroSettings',
  title: 'Hero-Bereich (Startseite)',
  type: 'document',
  icon: ImageIcon,
  description:
    'Jede Folie kombiniert frei ein Hintergrundbild und/oder einen Spruch — beide Teile lassen sich pro Folie einzeln ein-/ausschalten.',
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero-Folien (Bilder + Sprüche, frei kombinierbar)',
      type: 'array',
      description:
        'Jede Folie kombiniert wahlweise ein Hintergrundbild UND/ODER einen Vordergrund-Spruch, beide unabhängig per Kippschalter ein-/ausschaltbar. Fehlt bei einer Folie das Bild (oder steht "Bild aktiv" auf Aus), bleibt beim Erreichen dieser Folie einfach das zuletzt gezeigte Hintergrundbild stehen — nur der Text wechselt. Mit "+ Element hinzufügen" beliebig viele Folien ergänzen.',
      of: [
        {
          type: 'object',
          name: 'heroSlideItem',
          fields: [
            defineField({
              name: 'folieName',
              title: 'Interner Titel (nur für dich im Studio sichtbar)',
              type: 'string',
              description: 'Z. B. „Gewerk Maler" — hilft dir in der Liste beim Überblick.',
            }),
            defineField({
              name: 'bildDesktop',
              title: 'Bild Desktop (16:9 Querformat)',
              type: 'image',
              options: {hotspot: true},
              description:
                'Leer gelassen: NICHT "kein Bild", sondern das aktuell auf der Website fest hinterlegte Foto für genau diese Folie bleibt stehen (siehe interner Titel oben, dort steht der Dateiname). Erst ein hier hochgeladenes Bild ersetzt es.',
            }),
            defineField({
              name: 'bildMobile',
              title: 'Bild Smartphone (9:16 Hochformat, optional)',
              type: 'image',
              options: {hotspot: true},
              description:
                'Eigenes, hochkant fotografiertes Bild fürs Handy. Bleibt dieses Feld leer, verwendet das Handy weiterhin das Desktop-Bild.',
            }),
            defineField({
              name: 'bildAktiv',
              title: 'Bild im Slider aktiv schalten?',
              type: 'boolean',
              initialValue: true,
              description: 'Auf "Aus" gestellt (oder kein Bild hochgeladen): das vorherige Hintergrundbild bleibt bei dieser Folie einfach stehen.',
            }),
            defineField({
              name: 'spruchText',
              title: 'Spruch über dem Bild (kurz, z. B. „Lackiert Türen")',
              type: 'string',
            }),
            defineField({
              name: 'spruchAktiv',
              title: 'Spruch über dem Bild aktiv schalten?',
              type: 'boolean',
              initialValue: true,
              description: 'Auf "Aus" gestellt (oder kein Text gepflegt): der vorherige Spruch bleibt bei dieser Folie einfach stehen.',
            }),
          ],
          preview: {
            select: {
              folieName: 'folieName',
              spruchText: 'spruchText',
              media: 'bildDesktop',
              bildAktiv: 'bildAktiv',
              spruchAktiv: 'spruchAktiv',
            },
            prepare({folieName, spruchText, media, bildAktiv, spruchAktiv}) {
              var flags: string[] = []
              if (bildAktiv === false) flags.push('Bild aus')
              if (spruchAktiv === false) flags.push('Spruch aus')
              return {
                title: folieName || spruchText || '(ohne Titel)',
                subtitle: (spruchText ? '„' + spruchText + '"' : '') + (flags.length ? '  ·  ' + flags.join(', ') : ''),
                media,
              }
            },
          },
        },
      ],
      initialValue: [
        {
          folieName: 'Lars persönlich (aktuelles Standardbild: portrait-lars-hero.jpg)',
          spruchText: 'Ihr Allround-Handwerker',
          bildAktiv: true,
          spruchAktiv: true,
        },
        {
          folieName: 'Gewerk Garten (aktuelles Standardbild: arbeit-garten.jpg)',
          spruchText: 'Pflegt Garten & Außenanlagen',
          bildAktiv: true,
          spruchAktiv: true,
        },
        {
          folieName: 'Gewerk Montage (aktuelles Standardbild: arbeit-montage.jpg)',
          spruchText: 'Montiert Möbel & Regale',
          bildAktiv: true,
          spruchAktiv: true,
        },
        {
          folieName: 'Gewerk Elektro (aktuelles Standardbild: elektro-fehlersuche.jpg)',
          spruchText: 'Behebt Elektro-Kleinreparaturen',
          bildAktiv: true,
          spruchAktiv: true,
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'showCallButton',
      title: '"Direkt anrufen"-Button im Hero zeigen',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {slides: 'heroSlides'},
    prepare({slides}) {
      var anzahl = Array.isArray(slides) ? slides.length : 0
      return {
        title: 'Hero-Bereich (Startseite)',
        subtitle: anzahl + ' Folie(n)',
      }
    },
  },
})
