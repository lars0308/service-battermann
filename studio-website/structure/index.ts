import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentIcon} from '@sanity/icons/Document'
import {HomeIcon} from '@sanity/icons/Home'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {UserIcon} from '@sanity/icons/User'
import {PinIcon} from '@sanity/icons/Pin'

// Page-Based Structure: das Studio ist strikt nach den echten Webseiten
// sortiert, nicht nach Dokumenttypen — Lars findet zu jeder Seite ein
// eigenes Fach mit genau den Inhalten, die dort auf der Website erscheinen.
// Dokumenttypen, die auf mehreren Seiten verwendet werden (z. B. "service":
// Bento-Kachel auf der Startseite UND ausführliche Kachel auf der Leistungs-
// seite), tauchen bewusst in beiden Fächern auf — es ist derselbe Datensatz,
// nur an der Stelle im Studio sichtbar, wo er auf der Website auch wirklich
// erscheint. Innerhalb jedes service-Dokuments trennen die Feldgruppen
// "Startseite (Kachel)" / "Seite Leistungen (Detail)" zusätzlich, welches
// Feld wofür gilt (siehe schemaTypes/service.ts).

// siteSettings, contactInfo, pageImpressum, pageDatenschutz sind Singletons:
// es soll jeweils nur ein Dokument geben, an eine feste _id gebunden, damit
// die Website nicht versehentlich mehrere Instanzen bekommt.
const SINGLETONS = [
  'siteSettings',
  'contactInfo',
  'pageImpressum',
  'pageDatenschutz',
  'heroSettings',
  'themeSettings',
  'pageHome',
]

// Alle Dokumenttypen, die unten explizit einem Seiten-Fach zugeordnet sind —
// dient nur der "Sonstiges"-Sicherheitsnetz-Liste ganz unten, falls künftig
// ein neuer Dokumenttyp hinzukommt und vergessen wird, ihn einzusortieren.
const EXPLICITLY_PLACED = [
  'trustPoint',
  'service',
  'vorherNachherProjekt',
  'promiseCard',
  'einsatzgebietOrt',
  'faqEntry',
  'megaMenuLink',
  'infoBanner',
  'heroBlock',
  'vorteileBlock',
  'bentoGridBlock',
  'aboutMeBlock',
  'mapBlock',
  'formBlock',
  ...SINGLETONS,
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website-Inhalte')
    .items([
      S.listItem()
        .title('Startseite (Home)')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Startseite (Home)')
            .items([
              S.listItem()
                .title('Block-Reihenfolge (Baukasten)')
                .child(
                  S.document().schemaType('pageHome').documentId('pageHome').title('Startseite: Baukasten'),
                ),
              S.listItem()
                .title('Hero-Bereich (Bilder + Sprüche)')
                .child(
                  S.document().schemaType('heroSettings').documentId('heroSettings').title('Hero-Bereich (Startseite)'),
                ),
              S.documentTypeListItem('trustPoint').title('Vorteile-Karten (4 Stück)'),
              S.documentTypeListItem('service').title('Leistungs-Kacheln (Bento-Grid „Was ich mache")'),
              // Dasselbe siteSettings-Singleton wie unter "Website-weit" — hier
              // zusätzlich verlinkt, weil das Feld "Linkziel Portrait-Button" nur
              // die Startseiten-Sektion "Wer hier anpackt" betrifft (gleiches
              // Prinzip wie beim doppelt gelisteten service-Dokument oben).
              S.listItem()
                .title('Wer hier anpackt: Link-Ziel')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Website-Einstellungen'),
                ),
            ]),
        ),
      S.listItem()
        .title('Seite Leistungen (Details)')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Seite Leistungen (Details)')
            .items([
              S.documentTypeListItem('service').title('Leistungsbereiche (5 Stück)'),
              S.documentTypeListItem('vorherNachherProjekt').title('Vorher/Nachher-Projekte'),
            ]),
        ),
      S.listItem()
        .title('Seite Über mich')
        .icon(UserIcon)
        .child(
          S.list()
            .title('Seite Über mich')
            .items([
              S.documentTypeListItem('promiseCard').title('Versprechen-Karten (3 Stück)'),
            ]),
        ),
      S.listItem()
        .title('Seite Einsatzgebiet')
        .icon(PinIcon)
        .child(
          S.list()
            .title('Seite Einsatzgebiet')
            .items([
              S.documentTypeListItem('einsatzgebietOrt').title('Orte + Anfahrtskosten'),
              S.documentTypeListItem('faqEntry').title('FAQ-Einträge'),
            ]),
        ),
      S.listItem()
        .title('Rechtstexte (Footer)')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Rechtstexte (Footer)')
            .items([
              S.listItem()
                .title('Impressum')
                .child(
                  S.document().schemaType('pageImpressum').documentId('pageImpressum').title('Impressum'),
                ),
              S.listItem()
                .title('Datenschutzerklärung')
                .child(
                  S.document()
                    .schemaType('pageDatenschutz')
                    .documentId('pageDatenschutz')
                    .title('Datenschutzerklärung'),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Website-weit (Navigation, Header, Formular)')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Website-weit')
            .items([
              S.listItem()
                .title('Website-Einstellungen')
                .child(
                  S.document().schemaType('siteSettings').documentId('siteSettings').title('Website-Einstellungen'),
                ),
              S.listItem()
                .title('Design & Farben')
                .child(
                  S.document().schemaType('themeSettings').documentId('themeSettings').title('Design & Farben'),
                ),
              S.listItem()
                .title('Kontaktdaten')
                .child(S.document().schemaType('contactInfo').documentId('contactInfo').title('Kontaktdaten')),
              S.documentTypeListItem('megaMenuLink').title('Mega-Menü-Links'),
              S.documentTypeListItem('infoBanner').title('Info-Banner'),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !EXPLICITLY_PLACED.includes(listItem.getId() as string),
      ),
    ])
