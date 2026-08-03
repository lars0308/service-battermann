import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

// Frei anlegbare Unterseiten (z. B. "Notdienst", "Winterdienst"), die es im
// statischen HTML-Gerüst nicht gibt. Lars vergibt Titel + Slug (erzeugt die
// URL, z. B. "notdienst" -> /notdienst) und pflegt den Inhalt als Rich Text
// mit optionalen Bildern. Das Frontend lädt für jede so angelegte Seite
// dasselbe Universalgerüst page.html (Header, Mega-Menü, Footer identisch
// zu allen anderen Seiten) und rendert den Inhalt anhand des Slugs aus der
// URL (siehe assets/js/custom-page.js + _redirects).
export const customPage = defineType({
  name: 'customPage',
  title: 'Freie Unterseite',
  type: 'document',
  icon: DocumentTextIcon,
  description:
    'Legt eine komplett neue Unterseite an (z. B. "Notdienst"), die im Menü nicht vorgesehen ist. Header, Mega-Menü und Footer sehen automatisch genauso aus wie auf jeder anderen Seite.',
  fields: [
    defineField({
      name: 'title',
      title: 'Seitentitel (erscheint als Überschrift + Browsertab)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Endung',
      type: 'slug',
      description: 'Erzeugt die Adresse der Seite, z. B. "notdienst" -> service-battermann.de/notdienst.',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Einleitungssatz (optional, groß unter der Überschrift)',
      type: 'string',
    }),
    defineField({
      name: 'showInNav',
      title: 'In der Hauptnavigation anzeigen?',
      type: 'boolean',
      description:
        'Aktiviert: die Seite bekommt automatisch einen eigenen Menüpunkt neben "Leistungen", "Über mich" usw. — auf jeder Seite der Website, ohne weiteren Handgriff.',
      initialValue: false,
    }),
    defineField({
      name: 'navOrder',
      title: 'Reihenfolge im Menü (bei mehreren Seiten im Menü)',
      type: 'number',
      description: 'Kleinere Zahl steht weiter links. Ohne Angabe: Reihenfolge nach Erstellungsdatum.',
      hidden: ({parent}) => !parent?.showInNav,
    }),
    defineField({
      name: 'content',
      title: 'Seiteninhalt',
      type: 'array',
      description:
        'Mit "+ Element hinzufügen" einen Baustein ergänzen: "Block" für Fließtext (fett/kursiv/unterstrichen/farbig, Überschriften, Aufzählungen, Links — Textmarkierung + Symbol in der Werkzeugleiste), "Bild" für ein Foto, "Leistungs-Kachel einbetten" um eine bestehende Leistung (z. B. "Bad & Sanitär") 1:1 wie auf der Startseite anzuzeigen, oder "Vorteile-Streifen einbetten" um die 4 Vorteile-Karten von der Startseite auf dieser Seite zu wiederholen. Reihenfolge per Drag-Handle änderbar, jeder Baustein per Papierkorb entfernbar.',
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
            decorators: [
              {title: 'Fett', value: 'strong'},
              {title: 'Kursiv', value: 'em'},
              {title: 'Unterstrichen', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
              {
                name: 'textColor',
                type: 'object',
                title: 'Textfarbe',
                description: 'Markierte Textstelle in einer Markenfarbe hervorheben, statt frei jede Farbe zu erlauben (bewusst begrenzt auf die 2 Website-Farben, siehe "Design & Farben").',
                fields: [
                  {
                    name: 'farbe',
                    type: 'string',
                    title: 'Farbe',
                    options: {
                      list: [
                        {title: 'Gold (Akzentfarbe)', value: 'gold'},
                        {title: 'Grün (WhatsApp-Farbe)', value: 'gruen'},
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
        },
        {type: 'embedService'},
        {type: 'embedTrustStrip'},
      ],
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare({title, slug}) {
      return {
        title: title || '(ohne Titel)',
        subtitle: slug ? '/' + slug : '(kein Slug vergeben)',
      }
    },
  },
})

// Baustein für "Seiteninhalt" (customPage.content): bindet eine bestehende
// Leistungs-Kachel (schemaTypes/service.ts) 1:1 in eine freie Unterseite ein,
// statt Titel/Bild/Text ein zweites Mal pflegen zu müssen. assets/js/custom-
// page.js löst die Referenz per GROQ auf und rendert dieselbe Kachel-Optik
// wie im Bento-Grid der Startseite.
export const embedService = defineType({
  name: 'embedService',
  title: 'Leistungs-Kachel einbetten',
  type: 'object',
  fields: [
    defineField({
      name: 'service',
      title: 'Welche Leistung?',
      type: 'reference',
      to: [{type: 'service'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'service.title'},
    prepare({title}) {
      return {title: 'Leistungs-Kachel: ' + (title || '(keine ausgewählt)')}
    },
  },
})

// Baustein für "Seiteninhalt": reiner Marker (keine eigenen Felder) — bindet
// den kompletten Vorteile-Streifen (alle trustPoint-Dokumente) unverändert
// ein, genau wie er auf der Startseite erscheint.
export const embedTrustStrip = defineType({
  name: 'embedTrustStrip',
  title: 'Vorteile-Streifen einbetten',
  type: 'object',
  fields: [defineField({name: 'placeholder', type: 'string', hidden: true})],
  preview: {
    prepare() {
      return {title: 'Vorteile-Streifen (alle Karten)'}
    },
  },
})
