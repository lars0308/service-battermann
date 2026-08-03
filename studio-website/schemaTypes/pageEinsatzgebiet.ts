import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

// Kopfbereich (Unterzeile/Überschrift/Einleitung) sowie das Abschluss-Banner
// von einsatzgebiet-faq.html.
export const pageEinsatzgebiet = defineType({
  name: 'pageEinsatzgebiet',
  title: 'Seite Einsatzgebiet: Kopfbereich',
  type: 'document',
  icon: PinIcon,
  description: 'Kopfbereich und Abschluss-Banner der Seite "Einsatzgebiet & FAQ".',
  groups: [
    {name: 'hero', title: 'Kopfbereich', default: true},
    {name: 'faq', title: 'FAQ-Sektion (Überschrift)'},
    {name: 'ctaBand', title: 'Abschluss-Banner'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadline', title: 'Überschrift', type: 'string', group: 'hero'}),
    defineField({name: 'heroLead', title: 'Einleitungssatz', type: 'text', group: 'hero'}),
    defineField({name: 'faqEyebrow', title: 'Unterzeile', type: 'string', group: 'faq'}),
    defineField({name: 'faqHeadline', title: 'Überschrift', type: 'string', group: 'faq'}),
    defineField({name: 'ctaBandHeadline', title: 'Überschrift', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandText', title: 'Text', type: 'text', group: 'ctaBand'}),
    defineField({name: 'ctaBandPrimaryLabel', title: 'Button 1 (führt zu WhatsApp)', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandSecondaryLabel', title: 'Button 2 (führt zum Kontaktformular)', type: 'string', group: 'ctaBand'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Einsatzgebiet: Kopfbereich'}
    },
  },
})
