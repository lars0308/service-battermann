import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'companyName', title: 'Firmenname', type: 'string'}),
    defineField({name: 'ownerName', title: 'Inhaber', type: 'string'}),
    defineField({name: 'logoIcon', title: 'Logo (Icon)', type: 'image'}),
    defineField({name: 'logoFull', title: 'Logo (vollständig)', type: 'image'}),
    defineField({
      name: 'serviceAreaTowns',
      title: 'Einsatzgebiet (Orte)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'serviceAreaRadiusKm',
      title: 'Einsatzradius (km)',
      type: 'number',
    }),
    defineField({
      name: 'legalNotice',
      title: 'Rechtlicher Footer-Hinweis',
      type: 'string',
      initialValue:
        'Ausführung ausschließlich im gesetzlich zulässigen Rahmen für meisterfreie Instandsetzungsarbeiten.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Website-Einstellungen'}
    },
  },
})
