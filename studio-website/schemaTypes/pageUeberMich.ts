import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

// Alle Überschriften/Texte auf ueber-mich.html, die NICHT bereits über ein
// eigenes Dokument gepflegt werden (die 3 "Wie ich arbeite"-Karten bleiben
// beim promiseCard-Dokument, siehe dort) — vom Hero-Namensschild bis zum
// Kontakt-Abschluss-Banner. Singleton-Dokument, feste _id (siehe
// structure/index.ts), damit es nie versehentlich mehrfach angelegt wird.
export const pageUeberMich = defineType({
  name: 'pageUeberMich',
  title: 'Seite Über mich: Texte',
  type: 'document',
  icon: UserIcon,
  description:
    'Alle Überschriften und Fließtexte auf der Seite "Über mich" — außer den 3 "Wie ich arbeite"-Karten, die unter "Versprechen-Karten" gepflegt werden.',
  groups: [
    {name: 'hero', title: 'Kopfbereich', default: true},
    {name: 'anfang', title: '"Wie ich angefangen habe"'},
    {name: 'arbeitsweise', title: '"Wie ich arbeite" (Überschrift)'},
    {name: 'kunden', title: '"Für wen ich arbeite"'},
    {name: 'ctaBand', title: 'Abschluss-Banner'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Unterzeile über dem Namen (z. B. "Über mich")', type: 'string', group: 'hero'}),
    defineField({name: 'heroName', title: 'Name (große Überschrift)', type: 'string', group: 'hero'}),
    defineField({name: 'heroSubline', title: 'Berufsbezeichnung unter dem Namen', type: 'string', group: 'hero'}),
    defineField({name: 'heroLead', title: 'Einleitungstext', type: 'text', group: 'hero'}),
    defineField({
      name: 'heroPortrait',
      title: 'Porträtfoto',
      type: 'image',
      options: {hotspot: true},
      description: 'Kein eigenes Foto hochgeladen: das im Code hinterlegte Standardporträt bleibt stehen.',
      group: 'hero',
    }),
    defineField({name: 'anfangEyebrow', title: 'Unterzeile', type: 'string', group: 'anfang'}),
    defineField({name: 'anfangHeadline', title: 'Überschrift', type: 'string', group: 'anfang'}),
    defineField({name: 'anfangText1', title: 'Erster Absatz', type: 'text', group: 'anfang'}),
    defineField({name: 'anfangText2', title: 'Zweiter Absatz', type: 'text', group: 'anfang'}),
    defineField({
      name: 'anfangImage',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
      group: 'anfang',
    }),
    defineField({name: 'arbeitsweiseEyebrow', title: 'Unterzeile', type: 'string', group: 'arbeitsweise'}),
    defineField({name: 'arbeitsweiseHeadline', title: 'Überschrift', type: 'string', group: 'arbeitsweise'}),
    defineField({name: 'kundenEyebrow', title: 'Unterzeile', type: 'string', group: 'kunden'}),
    defineField({name: 'kundenHeadline', title: 'Überschrift', type: 'string', group: 'kunden'}),
    defineField({name: 'kundenText', title: 'Text', type: 'text', group: 'kunden'}),
    defineField({name: 'kundenCtaLabel', title: 'Link-Text (führt zu WhatsApp)', type: 'string', group: 'kunden'}),
    defineField({name: 'ctaBandHeadline', title: 'Überschrift', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandText', title: 'Text', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandPrimaryLabel', title: 'Button 1 (führt zum Kontaktformular)', type: 'string', group: 'ctaBand'}),
    defineField({name: 'ctaBandSecondaryLabel', title: 'Button 2 (führt zum Anruf)', type: 'string', group: 'ctaBand'}),
  ],
  preview: {
    prepare() {
      return {title: 'Seite Über mich: Texte'}
    },
  },
})
