import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

// Bewusst EIN Singleton-Dokument mit zwei komplett unabhängigen Arrays statt
// mehrerer heroSlide-Dokumente: Bilder (heroBilder) und Sprüche (heroSprueche)
// hatten vorher eine feste 1:1-Kopplung über ihre Reihenfolge — Bild 2 zeigte
// immer exakt den Text von Slide 2. Diese Kopplung ist hier komplett aufgelöst:
// die Bilder wechseln im Hintergrund in ihrem eigenen Takt, die Sprüche im
// Vordergrund in ihrem eigenen Takt (siehe assets/main.js). Lars pflegt beide
// Listen unabhängig voneinander und kann mit dem Sanity-Standard-"+"-Knopf
// beliebig viele Sprüche ergänzen, ohne dafür ein Bild mitliefern zu müssen.
export const heroSettings = defineType({
  name: 'heroSettings',
  title: 'Hero-Bereich (Startseite)',
  type: 'document',
  icon: ImageIcon,
  description:
    'Hintergrundbilder und Sprüche sind bewusst voneinander getrennt: beide laufen mit eigenem Takt, unabhängig voneinander.',
  fields: [
    defineField({
      name: 'heroBilder',
      title: 'Hintergrundbilder',
      type: 'array',
      description:
        'Fotos, die im Hintergrund per Kreuzblende durchwechseln. Bis zu 4 Bilder werden auf der Website verwendet (weitere werden im Studio zwar gespeichert, aber nicht mehr angezeigt).',
      of: [
        {
          type: 'object',
          name: 'heroBild',
          fields: [
            defineField({
              name: 'bildDesktop',
              title: 'Bild Desktop (16:9 Querformat)',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'bildMobile',
              title: 'Bild Smartphone (9:16 Hochformat, optional)',
              type: 'image',
              options: {hotspot: true},
              description:
                'Eigenes, hochkant fotografiertes Bild fürs Handy. Bleibt dieses Feld leer, verwendet das Handy weiterhin das Desktop-Bild.',
            }),
          ],
          preview: {
            select: {media: 'bildDesktop'},
            prepare({media}) {
              return {title: 'Hero-Hintergrundbild', media}
            },
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'heroSprueche',
      title: 'Sprüche (rotierender Text im Vordergrund)',
      type: 'array',
      description:
        'Kurze Sätze, die per Kreuzblende durchwechseln — unabhängig von den Bildern. Mit "+ Element hinzufügen" beliebig viele ergänzen. Über den Kippschalter "Spruch aktiv schalten?" lässt sich jeder Satz einzeln ein-/ausblenden, ohne ihn löschen zu müssen — praktisch, um z. B. ein Gewerk vorübergehend aus der Rotation zu nehmen.',
      of: [
        {
          type: 'object',
          name: 'spruchItem',
          fields: [
            defineField({
              name: 'text',
              title: 'Handwerker-Spruch (z. B. „Lackiert Türen, Zargen und Heizkörper.“)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'aktiv',
              title: 'Spruch aktiv schalten?',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {text: 'text', aktiv: 'aktiv'},
            prepare({text, aktiv}) {
              return {title: text || '(ohne Text)', subtitle: aktiv === false ? 'Ausgeblendet' : 'Aktiv'}
            },
          },
        },
      ],
      initialValue: [
        {text: 'Möbelmontage & Innenausbau', aktiv: true},
        {text: 'Baut Küchen und Schränke auf.', aktiv: true},
        {text: 'Montiert Regale und Gardinenstangen.', aktiv: true},
        {text: 'Maler- & Ausbesserungsarbeiten', aktiv: true},
        {text: 'Lackiert Türen, Zargen und Heizkörper.', aktiv: true},
        {text: 'Spachtelt Löcher und Risse glatt.', aktiv: true},
        {text: 'Holz- & Bodenpflege', aktiv: true},
        {text: 'Schleift und ölt Holzböden.', aktiv: true},
        {text: 'Verlegt Laminat und Fußleisten.', aktiv: true},
        {text: 'Bad- & Sanitär-Kleinreparaturen', aktiv: true},
        {text: 'Repariert Armaturen und Siphons.', aktiv: true},
        {text: 'Erneuert alte Silikonfugen.', aktiv: true},
        {text: 'Elektro-Kleinreparaturen & Technik', aktiv: true},
        {text: 'Tauscht Schalter und Steckdosen aus.', aktiv: true},
        {text: 'Schließt Lampen und Geräte an.', aktiv: true},
        {text: 'Hausmeisterservice & Objektbetreuung', aktiv: true},
        {text: 'Pflegt Immobilien und Außenanlagen.', aktiv: true},
        {text: 'Kontrolliert Haustechnik und Gebäude zuverlässig.', aktiv: true},
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
    select: {bilder: 'heroBilder', sprueche: 'heroSprueche'},
    prepare({bilder, sprueche}) {
      var bildAnzahl = Array.isArray(bilder) ? bilder.length : 0
      var spruchAnzahl = Array.isArray(sprueche) ? sprueche.length : 0
      return {
        title: 'Hero-Bereich (Startseite)',
        subtitle: bildAnzahl + ' Bild(er) · ' + spruchAnzahl + ' Spruch/Sprüche',
      }
    },
  },
})
