import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

// Kopfbereich (Unterzeile/Überschrift/Einleitung) von leistungen.html. Die
// eigentlichen Leistungsbereiche selbst bleiben beim service-Dokument.
export const pageLeistungen = defineType({
  name: 'pageLeistungen',
  title: 'Seite Leistungen: Kopfbereich',
  type: 'document',
  icon: DocumentTextIcon,
  description: 'Unterzeile, Überschrift und Einleitungssatz ganz oben auf der Seite "Leistungen".',
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile', type: 'string'}),
    defineField({name: 'heroHeadline', title: 'Überschrift', type: 'string'}),
    defineField({name: 'heroLead', title: 'Einleitungssatz', type: 'text'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Leistungen: Kopfbereich'}
    },
  },
})
