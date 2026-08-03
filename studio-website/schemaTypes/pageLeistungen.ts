import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

// Kopfbereich (Unterzeile/Überschrift/Einleitung) sowie das Abschluss-Banner
// von leistungen.html. Die eigentlichen Leistungsbereiche selbst bleiben beim
// service-Dokument.
export const pageLeistungen = defineType({
  name: 'pageLeistungen',
  title: 'Seite Leistungen: Kopfbereich',
  type: 'document',
  icon: DocumentTextIcon,
  description: 'Kopfbereich und Abschluss-Banner der Seite "Leistungen".',
  groups: [
    {name: 'hero', title: 'Kopfbereich', default: true},
    {name: 'ctaBand', title: 'Abschluss-Banner'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadline', title: 'Überschrift', type: 'string', group: 'hero'}),
    defineField({name: 'heroLead', title: 'Einleitungssatz', type: 'text', group: 'hero'}),
    defineField({name: 'heroDesign', title: 'Darstellung', type: 'sectionDesign', group: 'hero'}),
    defineField({name: 'ctaBandHeadline', title: 'Überschrift', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandText', title: 'Text', type: 'text', group: 'ctaBand'}),
    defineField({name: 'ctaBandPrimaryLabel', title: 'Button 1 (führt zum Kontaktformular)', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandSecondaryLabel', title: 'Button 2 (führt zu WhatsApp)', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandDesign', title: 'Darstellung', type: 'sectionDesign', group: 'ctaBand'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Leistungen: Kopfbereich'}
    },
  },
})
