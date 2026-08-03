import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

// Kopfbereich (Unterzeile/Überschrift/Einleitung) von kontakt.html.
export const pageKontakt = defineType({
  name: 'pageKontakt',
  title: 'Seite Kontakt: Kopfbereich',
  type: 'document',
  icon: DocumentTextIcon,
  description: 'Unterzeile, Überschrift und Einleitungssatz ganz oben auf der Seite "Kontakt", sowie die Sektion "Direkter Draht" darunter.',
  groups: [
    {name: 'hero', title: 'Kopfbereich', default: true},
    {name: 'direkterDraht', title: '„Direkter Draht"-Sektion'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadline', title: 'Überschrift', type: 'string', group: 'hero'}),
    defineField({name: 'heroLead', title: 'Einleitungssatz', type: 'text', group: 'hero'}),
    defineField({name: 'contactEyebrow', title: 'Unterzeile', type: 'string', group: 'direkterDraht'}),
    defineField({name: 'contactHeadline', title: 'Überschrift', type: 'string', group: 'direkterDraht'}),
    defineField({name: 'contactIntro', title: 'Einleitungssatz', type: 'text', group: 'direkterDraht'}),
    defineField({name: 'emailLabelPrefix', title: 'Beschriftung vor der E-Mail-Adresse', type: 'string', group: 'direkterDraht'}),
    defineField({name: 'erreichbarkeitLabelPrefix', title: 'Beschriftung vor den Öffnungszeiten', type: 'string', group: 'direkterDraht'}),
    defineField({name: 'contactNote', title: 'Zusatzhinweis (Hausverwaltungen/Firmen)', type: 'text', group: 'direkterDraht'}),
    defineField({
      name: 'portrait',
      title: 'Porträtfoto',
      type: 'image',
      options: {hotspot: true},
      description: 'Bildausschnitt anpassen: auf das Bild klicken, den Fokuspunkt-Kreis auf den wichtigsten Bereich ziehen, speichern.',
      group: 'direkterDraht',
    }),
    defineField({name: 'portraitName', title: 'Bildunterschrift: Name', type: 'string', group: 'direkterDraht'}),
    defineField({name: 'portraitRole', title: 'Bildunterschrift: Rolle', type: 'string', group: 'direkterDraht'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Kontakt: Kopfbereich'}
    },
  },
})
