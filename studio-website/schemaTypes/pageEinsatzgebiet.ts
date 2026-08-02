import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

// Kopfbereich (Unterzeile/Überschrift/Einleitung) von einsatzgebiet-faq.html.
export const pageEinsatzgebiet = defineType({
  name: 'pageEinsatzgebiet',
  title: 'Seite Einsatzgebiet: Kopfbereich',
  type: 'document',
  icon: PinIcon,
  description: 'Unterzeile, Überschrift und Einleitungssatz ganz oben auf der Seite "Einsatzgebiet & FAQ".',
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile', type: 'string'}),
    defineField({name: 'heroHeadline', title: 'Überschrift', type: 'string'}),
    defineField({name: 'heroLead', title: 'Einleitungssatz', type: 'text'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Einsatzgebiet: Kopfbereich'}
    },
  },
})
