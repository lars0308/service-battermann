import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const megaMenuLink = defineType({
  name: 'megaMenuLink',
  title: 'Mega-Menü-Link',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'section',
      title: 'Menü-Bereich',
      type: 'string',
      description:
        'Kontakt ist hier absichtlich nicht wählbar — die 3 Kontakt-Links im Mega-Menü ziehen ihre Werte direkt aus "Kontaktdaten", damit Telefonnummer/E-Mail nicht an zwei Stellen gepflegt werden müssen.',
      options: {
        list: [
          {title: 'Leistungen', value: 'leistungen'},
          {title: 'Über mich', value: 'ueberMich'},
          {title: 'Einsatzgebiet & FAQ', value: 'einsatzgebiet'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge innerhalb des Bereichs (0-basiert)',
      type: 'number',
      description: 'Muss zur Position im Menü passen: erster Link = 0, zweiter = 1, usw.',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'url',
      title: 'Link-Ziel',
      type: 'string',
      description: 'Z. B. "leistungen.html#leistung-garten" oder eine volle https://-URL.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'section', order: 'order'},
    prepare({title, subtitle, order}) {
      return {title, subtitle: `${subtitle ?? '?'} · Position ${order ?? '?'}`}
    },
  },
  orderings: [
    {
      title: 'Bereich + Reihenfolge',
      name: 'sectionOrderAsc',
      by: [
        {field: 'section', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
