import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

// Kopfbereich (Unterzeile/Überschrift/Einleitung) von kontakt.html.
export const pageKontakt = defineType({
  name: 'pageKontakt',
  title: 'Seite Kontakt: Kopfbereich',
  type: 'document',
  icon: DocumentTextIcon,
  description: 'Unterzeile, Überschrift und Einleitungssatz ganz oben auf der Seite "Kontakt".',
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile', type: 'string'}),
    defineField({name: 'heroHeadline', title: 'Überschrift', type: 'string'}),
    defineField({name: 'heroLead', title: 'Einleitungssatz', type: 'text'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Kontakt: Kopfbereich'}
    },
  },
})
