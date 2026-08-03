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
    'Bestimmt, welche Blöcke auf der Startseite in welcher Reihenfolge erscheinen. Die meisten Inhalte pflegst du weiterhin in den jeweils zuständigen Bereichen (Hero, Vorteile, Leistungen usw.) — die Texte der Sektion "Wer hier anpackt" gehören direkt hierher.',
  groups: [
    {name: 'baukasten', title: 'Block-Reihenfolge', default: true},
    {name: 'heroExtra', title: 'Hero: CTA-Buttons'},
    {name: 'werHierAnpackt', title: '"Wer hier anpackt" (Texte + Bild)'},
    {name: 'leistungenExtra', title: 'Leistungen-Sektion: CTA'},
    {name: 'optionaleBloecke', title: 'Optionale Blöcke: Karte & Formular (Überschriften)'},
  ],
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
      group: 'baukasten',
    }),
    defineField({name: 'heroWhatsappLabel', title: 'Button-Text „WhatsApp"', type: 'string', group: 'heroExtra'}),
    defineField({name: 'heroCallLabel', title: 'Button-Text „Direkt anrufen"', type: 'string', group: 'heroExtra'}),
    defineField({name: 'heroPrimaryCtaLabel', title: 'Button-Text „Jetzt Anfrage senden"', type: 'string', group: 'heroExtra'}),
    defineField({name: 'aboutEyebrow', title: 'Unterzeile', type: 'string', group: 'werHierAnpackt'}),
    defineField({name: 'aboutLead', title: 'Einleitungssatz', type: 'text', group: 'werHierAnpackt'}),
    defineField({name: 'aboutFact1Title', title: 'Punkt 1: Titel', type: 'string', group: 'werHierAnpackt'}),
    defineField({name: 'aboutFact1Text', title: 'Punkt 1: Text', type: 'text', group: 'werHierAnpackt'}),
    defineField({name: 'aboutFact2Title', title: 'Punkt 2: Titel', type: 'string', group: 'werHierAnpackt'}),
    defineField({name: 'aboutFact2Text', title: 'Punkt 2: Text', type: 'text', group: 'werHierAnpackt'}),
    defineField({name: 'aboutFact3Title', title: 'Punkt 3: Titel', type: 'string', group: 'werHierAnpackt'}),
    defineField({name: 'aboutFact3Text', title: 'Punkt 3: Text', type: 'text', group: 'werHierAnpackt'}),
    defineField({name: 'aboutCardCtaLabel', title: 'Text auf dem Porträtfoto ("Mehr über mich erfahren →")', type: 'string', group: 'werHierAnpackt'}),
    defineField({name: 'aboutDownloadLabel', title: 'Link-Text "Kontaktdaten herunterladen"', type: 'string', group: 'werHierAnpackt'}),
    defineField({
      name: 'bereichsLink',
      title: 'Linkziel des Portrait-Buttons ("Mehr über mich erfahren →")',
      type: 'string',
      description:
        'Wohin der Klick auf das Porträtfoto in dieser Sektion führt. Standard: ueber-mich.html.',
      initialValue: 'ueber-mich.html',
      group: 'werHierAnpackt',
    }),
    defineField({
      name: 'aboutPortrait',
      title: 'Porträtfoto',
      type: 'image',
      options: {hotspot: true},
      group: 'werHierAnpackt',
    }),
    defineField({name: 'servicesAllCtaLabel', title: 'Link-Text „Alle Leistungen im Detail ansehen"', type: 'string', group: 'leistungenExtra'}),
    defineField({name: 'mapEyebrow', title: 'Karte: Unterzeile', type: 'string', group: 'optionaleBloecke'}),
    defineField({name: 'mapHeadline', title: 'Karte: Überschrift', type: 'string', group: 'optionaleBloecke'}),
    defineField({name: 'formEyebrow', title: 'Formular: Unterzeile', type: 'string', group: 'optionaleBloecke'}),
    defineField({name: 'formHeadline', title: 'Formular: Überschrift', type: 'string', group: 'optionaleBloecke'}),
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
