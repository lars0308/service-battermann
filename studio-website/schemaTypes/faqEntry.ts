import {defineType, defineField} from 'sanity'

export const faqEntry = defineType({
  name: 'faqEntry',
  title: 'FAQ-Eintrag',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'question',
      title: 'Frage',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Antwort',
      type: 'text',
      description: 'Reiner Text, keine Verlinkungen — die Seite trägt bestehende Links selbst nach.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question', order: 'order'},
    prepare({title, order}) {
      return {title, subtitle: `FAQ ${order ?? '?'}`}
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
