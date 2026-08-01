import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero-Slide (Startseite)',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Hintergrundbild',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prefix',
      title: 'Textzeile 1 (fix)',
      type: 'string',
      initialValue: 'Lars Battermann:',
    }),
    defineField({
      name: 'verb',
      title: 'Textzeile 2 (Verb/Aussage)',
      type: 'string',
      description:
        'Z. B. „Pflegt Objekte“. Beim ersten Slide: Feld roundTexts nutzen statt eines festen Werts.',
    }),
    defineField({
      name: 'roundTexts',
      title: 'Rotierende Texte (nur erster Slide)',
      type: 'array',
      of: [{type: 'string'}],
      description: '3 Varianten, die abwechselnd bei jedem vollen Zyklus des Sliders erscheinen.',
    }),
    defineField({
      name: 'dotLabel',
      title: 'Aria-Label für den Auswahlpunkt',
      type: 'string',
    }),
    defineField({
      name: 'showCallButton',
      title: '"Direkt anrufen"-Button zeigen',
      type: 'boolean',
      description:
        'Steuert den grünen Anruf-Button im Hero global (es gibt nur einen Button für den ganzen Slider) — nur das erste Slide-Dokument (Reihenfolge 1) wird hierfür ausgewertet.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'verb', roundTexts: 'roundTexts', media: 'image', order: 'order'},
    prepare({title, roundTexts, media, order}) {
      var fallback = Array.isArray(roundTexts) && roundTexts.length ? roundTexts[0] : 'Ohne Text';
      return {title: title || fallback, subtitle: `Slide ${order ?? '?'}`, media}
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
