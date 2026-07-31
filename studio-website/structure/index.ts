import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentIcon} from '@sanity/icons/Document'

// siteSettings und contactInfo sind Singletons: es soll jeweils nur ein
// Dokument geben, an eine feste _id gebunden, damit die Website nicht
// versehentlich mehrere "Website-Einstellungen"-Dokumente anlegt bekommt.
const SINGLETONS = ['siteSettings', 'contactInfo']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website-Inhalte')
    .items([
      S.listItem()
        .title('Website-Einstellungen')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Website-Einstellungen'),
        ),
      S.listItem()
        .title('Kontaktdaten')
        .icon(DocumentIcon)
        .child(S.document().schemaType('contactInfo').documentId('contactInfo').title('Kontaktdaten')),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
