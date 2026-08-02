import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

// Startseiten-Baukasten: pageModules ist KEIN Inhalts-Array (die eigentlichen
// Texte/Bilder bleiben in heroSettings, trustPoint, service usw.) — jeder
// Eintrag hier ist nur ein leerer "Marker" für einen bereits fertigen
// HTML-Block. Reihenfolge und Vorhandensein im Array bestimmen, wie
// assets/js/sanity-content.js (applyPageModules) die Startseite per CSS
// "order" umsortiert bzw. Blöcke per "hidden" ein-/ausblendet. Kein
// Baustein-Typ mehrfach hinzufügbar (jeweils eigener, einmaliger Objekt-Typ)
// — Lars kann per "+"-Button Blöcke ergänzen, per Drag-Handle neu anordnen
// oder per Papierkorb entfernen (= ausblenden), ohne dass Inhalte verloren
// gehen.
function marker(name: string, title: string) {
  return {
    type: 'object' as const,
    name,
    title,
    fields: [
      defineField({
        name: 'placeholder',
        type: 'string',
        hidden: true,
      }),
    ],
    preview: {
      prepare() {
        return {title}
      },
    },
  }
}

export const pageHome = defineType({
  name: 'pageHome',
  title: 'Startseite: Baukasten',
  type: 'document',
  icon: DocumentIcon,
  description:
    'Bestimmt, welche Blöcke auf der Startseite in welcher Reihenfolge erscheinen. Die Inhalte selbst pflegst du weiterhin in den jeweils zuständigen Bereichen (Hero, Vorteile, Leistungen, Über mich usw.) — hier steuerst du nur Reihenfolge und Sichtbarkeit.',
  fields: [
    defineField({
      name: 'pageModules',
      title: 'Block-Reihenfolge',
      type: 'array',
      description:
        'Mit "+ Element hinzufügen" einen Block ergänzen, per Drag-Handle die Reihenfolge ändern, per Papierkorb-Symbol einen Block von der Startseite entfernen (die Inhalte dahinter bleiben erhalten und lassen sich jederzeit wieder ergänzen).',
      of: [
        {type: 'heroBlock'},
        {type: 'vorteileBlock'},
        {type: 'bentoGridBlock'},
        {type: 'aboutMeBlock'},
        {type: 'mapBlock'},
        {type: 'formBlock'},
      ],
      initialValue: [{_type: 'heroBlock'}, {_type: 'vorteileBlock'}, {_type: 'aboutMeBlock'}, {_type: 'bentoGridBlock'}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Startseite: Baukasten'}
    },
  },
})

export const heroBlock = defineType(marker('heroBlock', 'Hero (Bildslider + Sprüche)'))
export const vorteileBlock = defineType(marker('vorteileBlock', 'Vorteile-Streifen'))
export const bentoGridBlock = defineType(marker('bentoGridBlock', 'Leistungen (Bento-Grid)'))
export const aboutMeBlock = defineType(marker('aboutMeBlock', 'Wer hier anpackt (Über mich)'))
export const mapBlock = defineType(marker('mapBlock', 'Einsatzgebiet-Karte'))
export const formBlock = defineType(marker('formBlock', 'Kontaktformular'))
