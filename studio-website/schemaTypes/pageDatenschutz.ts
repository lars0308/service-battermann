import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const pageDatenschutz = defineType({
  name: 'pageDatenschutz',
  title: 'Rechtstext: Datenschutzerklärung',
  type: 'document',
  icon: DocumentIcon,
  description:
    'Kompletter Fließtext der Seite datenschutz.html, editierbar als Rich Text (Überschriften, Absätze, Aufzählungen, Links).',
  fields: [
    defineField({name: 'eyebrow', title: 'Unterzeile (über der Überschrift)', type: 'string', initialValue: 'Rechtliches'}),
    defineField({name: 'heading', title: 'Überschrift', type: 'string', initialValue: 'Datenschutzerklärung'}),
    defineField({
      name: 'intro',
      title: 'Einleitungssatz (unter der Überschrift, z. B. "Stand: ...")',
      type: 'string',
      initialValue: 'Stand: Juli 2026',
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
            {title: 'Überschrift (H2)', value: 'h2'},
            {title: 'Unterüberschrift (H3)', value: 'h3'},
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
  ],
  preview: {
    prepare() {
      return {title: 'Datenschutzerklärung'}
    },
  },
})
