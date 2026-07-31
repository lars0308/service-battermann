import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const service = defineType({
  name: 'service',
  title: 'Leistungsbereich',
  type: 'document',
  icon: DocumentTextIcon,
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
      name: 'description',
      title: 'Kurzbeschreibung',
      type: 'text',
    }),
    defineField({
      name: 'cardImage',
      title: 'Kartenbild (Startseite)',
      type: 'image',
      options: {hotspot: true},
      description:
        'Einzelnes Bild für die Bild-Karte auf der Startseite (dunkles Overlay wird per CSS gelegt).',
    }),
    defineField({
      name: 'gallery',
      title: 'Echte Projektbilder (Detailseite)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA-Text (optional)',
      type: 'string',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA-Link (optional)',
      type: 'url',
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
