import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

export const einsatzgebietOrt = defineType({
  name: 'einsatzgebietOrt',
  title: 'Einsatzgebiet-Ort',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Ortsname',
      type: 'string',
      description: 'Erscheint als Pillen-Button über der Anfahrtskarte, z. B. „Stadthagen“.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'anfahrtskosten',
      title: 'Anfahrtskosten',
      type: 'string',
      description:
        'Wird im Glas-Popover angezeigt, sobald der Ort angeklickt wird, z. B. „Kostenlose Anfahrt“ oder „25,- € Pauschale“.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'anfahrtskosten', order: 'order'},
    prepare({title, subtitle, order}) {
      return {title: `${order ?? '?'}. ${title ?? ''}`, subtitle}
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
