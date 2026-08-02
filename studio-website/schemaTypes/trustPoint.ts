import {defineType, defineField} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const trustPoint = defineType({
  name: 'trustPoint',
  title: 'Vorteil (unter dem Hero)',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Überschrift der Karte',
      type: 'string',
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: 'detail',
      title: 'Kurzbeschreibung unter der Überschrift',
      type: 'string',
      description: 'Kleiner, zweiter Textzeile in der Karte, z. B. "Lampen, Schalter, Fehlersuche".',
      validation: (rule) => rule.max(80),
    }),
  ],
  preview: {
    select: {title: 'text', order: 'order'},
    prepare({title, order}) {
      return {title, subtitle: `Vorteil ${order ?? '?'}`}
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
