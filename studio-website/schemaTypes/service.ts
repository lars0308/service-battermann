import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const service = defineType({
  name: 'service',
  title: 'Leistungsbereich',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'startseite', title: 'Startseite (Kachel)', default: true},
    {name: 'leistungenSeite', title: 'Seite Leistungen (Detail)'},
  ],
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge (01–05)',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'anchorId',
      title: 'Anker-ID',
      type: 'slug',
      description:
        'Muss mit der Sprungmarke übereinstimmen, auf die die Startseiten-Karte verlinkt (z. B. „leistung-garten“ für #leistung-garten).',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'verb',
      title: 'Verb (z. B. „Pflegt“)',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'requiresLegalNote',
      title: 'Sternchen-Hinweis nötig?',
      type: 'boolean',
      description:
        'Aktiviert das dezente * hinter dem Titel (Elektro- & Sanitärarbeiten im gesetzlich zulässigen Rahmen).',
      initialValue: false,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kurztext für Startseiten-Kachel (max. 2 Sätze)',
      type: 'text',
      description:
        'Erscheint im Glasfenster, das beim Antippen/Hover der Bento-Kachel auf der Startseite aufblendet. Kurz halten — hier ist kaum Platz.',
      group: 'startseite',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'description',
      title: 'Ausführlicher Detailtext für Leistungsseite',
      type: 'text',
      description: 'Erscheint im Glasfenster der Leistungs-Kachel auf leistungen.html.',
      group: 'leistungenSeite',
    }),
    defineField({
      name: 'cardImage',
      title: 'Kartenbild (Startseite & Leistungsseite)',
      type: 'image',
      options: {hotspot: true},
      description:
        'Einzelnes Bild, randlos als Kachel-Hintergrund auf Startseite UND Leistungsseite (dunkles Overlay wird per CSS gelegt).',
      group: 'startseite',
    }),
    defineField({
      name: 'gallery',
      title: 'Echte Projektbilder (ungenutzt im kompakten Kachel-Design)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'leistungenSeite',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA-Text (optional)',
      type: 'string',
      group: 'leistungenSeite',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA-Link (optional)',
      type: 'url',
      group: 'leistungenSeite',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'cardImage', order: 'order'},
    prepare({title, media, order}) {
      return {title, subtitle: `Bereich ${order ?? '?'}`, media}
    },
  },
  orderings: [
    {
      title: 'Reihenfolge',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
