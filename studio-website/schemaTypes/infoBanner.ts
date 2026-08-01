import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const infoBanner = defineType({
  name: 'infoBanner',
  title: 'Info-Banner (oben auf der Website)',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'active',
      title: 'Banner anzeigen',
      type: 'boolean',
      description: 'Manueller Ein/Aus-Schalter. Der Banner erscheint nur, wenn dies AN ist UND das Ablaufdatum (falls gesetzt) noch nicht erreicht wurde.',
      initialValue: false,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Automatisch ausblenden ab',
      type: 'datetime',
      description: 'Optional. Leer lassen für kein automatisches Ablaufdatum — dann läuft der Banner, bis du ihn manuell wieder ausschaltest.',
    }),
  ],
  preview: {
    select: {title: 'text', active: 'active'},
    prepare({title, active}) {
      return {title: title || '(kein Text)', subtitle: active ? 'Aktiv' : 'Inaktiv'}
    },
  },
})
