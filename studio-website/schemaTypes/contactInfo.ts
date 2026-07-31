import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Kontaktdaten',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'phone',
      title: 'Telefon (Anzeige)',
      type: 'string',
      initialValue: '+49 155 / 674 677 63',
    }),
    defineField({
      name: 'phoneHref',
      title: 'Telefon (tel:-Link)',
      type: 'string',
      initialValue: '+4915567467763',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp-Link',
      type: 'url',
      initialValue: 'https://wa.me/4915567467763',
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
      initialValue: 'service.battermann@gmx.de',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'openingHours',
      title: 'Erreichbarkeit',
      type: 'string',
      initialValue: 'Mo–Sa, 09:00–20:00 Uhr',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Kontaktdaten'}
    },
  },
})
