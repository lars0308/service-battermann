import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const vorherNachherProjekt = defineType({
  name: 'vorherNachherProjekt',
  title: 'Vorher/Nachher-Projekt',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({name: 'titel', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'beschreibung', title: 'Beschreibung', type: 'text'}),
    defineField({
      name: 'kategorie',
      title: 'Leistungsbereich',
      type: 'string',
      options: {
        list: [
          {title: 'Hausmeisterservice', value: 'hausmeister'},
          {title: 'Montage', value: 'montage'},
          {title: 'Garten', value: 'garten'},
          {title: 'Bad & Sanitär', value: 'bad'},
          {title: 'Elektro', value: 'elektro'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'vorherBild',
      title: 'Bild vorher',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'vorherAlt', title: 'Alt-Text vorher', type: 'string'}),
    defineField({
      name: 'nachherBild',
      title: 'Bild nachher',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'nachherAlt', title: 'Alt-Text nachher', type: 'string'}),
  ],
  preview: {
    select: {title: 'titel', subtitle: 'kategorie', media: 'nachherBild'},
  },
})
