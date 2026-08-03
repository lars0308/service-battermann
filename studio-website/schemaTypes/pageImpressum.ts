import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const pageImpressum = defineType({
  name: 'pageImpressum',
  title: 'Rechtstext: Impressum',
  type: 'document',
  icon: DocumentIcon,
  description:
    'Kompletter Fließtext der Seite impressum.html, editierbar als Rich Text (Überschriften, Absätze, Aufzählungen, Links). Name/Anschrift/Telefon/E-Mail werden weiterhin zentral unter "Website-Einstellungen" bzw. "Kontaktdaten" gepflegt, damit nichts doppelt gepflegt werden muss.',
  fields: [
    defineField({name: 'eyebrow', title: 'Unterzeile (über der Überschrift)', type: 'string', initialValue: 'Rechtliches'}),
    defineField({name: 'heading', title: 'Überschrift', type: 'string', initialValue: 'Impressum'}),
    defineField({
      name: 'intro',
      title: 'Einleitungssatz (unter der Überschrift)',
      type: 'string',
      initialValue: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG), vormals § 5 TMG.',
    }),
    defineField({
      name: 'body',
      title: 'Rechtstext',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Überschrift', value: 'h2'},
          ],
          lists: [{title: 'Aufzählung', value: 'bullet'}],
          marks: {
            decorators: [{title: 'Fett', value: 'strong'}],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
        },
      ],
    }),
    defineField({name: 'design', title: 'Darstellung', type: 'sectionDesign'}),
  ],
  preview: {
    prepare() {
      return {title: 'Impressum'}
    },
  },
})
