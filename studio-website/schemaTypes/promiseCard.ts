import {defineType, defineField} from 'sanity'
import {SparklesIcon} from '@sanity/icons/Sparkles'

export const promiseCard = defineType({
  name: 'promiseCard',
  title: 'Über mich: Versprechen-Karte',
  type: 'document',
  icon: SparklesIcon,
  description:
    'Die 3 Karten im dunklen Glas-Look unter "Drei Dinge, auf die Sie sich verlassen können" auf ueber-mich.html.',
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge (1–3)',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Sprechblase (Ehrlichkeit)', value: 'ehrlichkeit'},
          {title: 'Uhr (Pünktlichkeit)', value: 'puenktlichkeit'},
          {title: 'Besen (Sauberkeit)', value: 'sauberkeit'},
        ],
      },
      description: 'Steuert, welches der 3 vorbereiteten Icons angezeigt wird.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Überschrift',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', order: 'order'},
    prepare({title, order}) {
      return {title: `${order ?? '?'}. ${title ?? ''}`}
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
