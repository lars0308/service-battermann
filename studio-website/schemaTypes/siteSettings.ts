import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'Allgemein', default: true},
    {name: 'nav', title: 'Navigation'},
    {name: 'navOrder', title: 'Reihenfolge im Hauptmenü'},
    {name: 'hero', title: 'Hero'},
    {name: 'bento', title: 'Startseite: Leistungs-Kacheln (Überschrift)'},
    {name: 'forms', title: 'Formular'},
    {name: 'bewertungen', title: 'Startseite: Bewertungen'},
    {name: 'gebietTeaser', title: 'Startseite: Einsatzgebiet (Kurzform)'},
    {
      name: 'boilerplate',
      title: 'Website-weit: Wiederkehrende Texte (Menü, Footer, Formular, Popups)',
    },
  ],
  fields: [
    defineField({name: 'companyName', title: 'Firmenname', type: 'string', group: 'general'}),
    defineField({name: 'ownerName', title: 'Inhaber', type: 'string', group: 'general'}),
    defineField({
      name: 'logoIcon',
      title: 'Logo (Icon, Header & Footer)',
      type: 'image',
      description:
        'Mehrfarbiges Logo funktioniert auf hellem wie dunklem Grund automatisch — kein manuelles Freistellen nötig.',
      group: 'general',
    }),
    defineField({name: 'logoFull', title: 'Logo (vollständig, ungenutzt aktuell)', type: 'image', group: 'general'}),
    defineField({
      name: 'serviceAreaTowns',
      title: 'Einsatzgebiet (Orte)',
      type: 'array',
      of: [{type: 'string'}],
      group: 'general',
    }),
    defineField({
      name: 'serviceAreaRadiusKm',
      title: 'Einsatzradius (km)',
      type: 'number',
      group: 'general',
    }),
    defineField({
      name: 'legalNotice',
      title: 'Rechtlicher Footer-Hinweis',
      type: 'string',
      initialValue:
        'Ausführung ausschließlich im gesetzlich zulässigen Rahmen für meisterfreie Instandsetzungsarbeiten.',
      group: 'general',
    }),
    defineField({
      name: 'navLeistungen',
      title: 'Reiter „Leistungen"',
      type: 'string',
      initialValue: 'Leistungen',
      group: 'nav',
    }),
    defineField({
      name: 'navUeberMich',
      title: 'Reiter „Über mich"',
      type: 'string',
      initialValue: 'Über mich',
      group: 'nav',
    }),
    defineField({
      name: 'navEinsatzgebiet',
      title: 'Reiter „Einsatzgebiet & FAQ"',
      type: 'string',
      initialValue: 'Einsatzgebiet & FAQ',
      group: 'nav',
    }),
    defineField({
      name: 'navKontakt',
      title: 'Reiter „Kontakt"',
      type: 'string',
      initialValue: 'Kontakt',
      group: 'nav',
    }),
    defineField({
      name: 'navOrderHome',
      title: 'Reihenfolge: Startseite',
      type: 'number',
      description: 'Kleinere Zahl steht weiter links im Menü. Freie Unterseiten reihen sich standardmäßig danach ein (eigenes "Reihenfolge"-Feld pro Unterseite).',
      initialValue: 10,
      group: 'navOrder',
    }),
    defineField({
      name: 'navOrderLeistungen',
      title: 'Reihenfolge: Leistungen',
      type: 'number',
      initialValue: 20,
      group: 'navOrder',
    }),
    defineField({
      name: 'navOrderUeberMich',
      title: 'Reihenfolge: Über mich',
      type: 'number',
      initialValue: 30,
      group: 'navOrder',
    }),
    defineField({
      name: 'navOrderEinsatzgebiet',
      title: 'Reihenfolge: Einsatzgebiet & FAQ',
      type: 'number',
      initialValue: 40,
      group: 'navOrder',
    }),
    defineField({
      name: 'navOrderKontakt',
      title: 'Reihenfolge: Kontakt',
      type: 'number',
      initialValue: 50,
      group: 'navOrder',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero-Unterzeile (über der Überschrift)',
      type: 'string',
      initialValue: 'Hausmeisterservice · Objektbetreuung · Allround-Handwerk',
      group: 'hero',
    }),
    defineField({
      name: 'bentoEyebrow',
      title: 'Unterzeile (über der Überschrift)',
      type: 'string',
      initialValue: 'Was ich mache',
      group: 'bento',
    }),
    defineField({
      name: 'bentoHeadline',
      title: 'Überschrift',
      type: 'string',
      initialValue: 'Fünf Bereiche, ein Ansprechpartner',
      group: 'bento',
    }),
    defineField({
      name: 'bentoIntro',
      title: 'Einleitungssatz',
      type: 'text',
      initialValue: 'Vom klapprigen Lichtschalter bis zur laufenden Betreuung mehrerer Objekte: direkt zum passenden Bereich.',
      group: 'bento',
    }),
    defineField({
      name: 'staticFormsApiKey',
      title: 'Static Forms API-Key (Kontaktformular)',
      type: 'string',
      description:
        'Ohne diesen Key nimmt das Kontaktformular auf kontakt.html keine Anfragen entgegen. Key von staticforms.dev, siehe SETUP.md.',
      group: 'forms',
    }),
    defineField({name: 'bewertungenEyebrow', title: 'Unterzeile', type: 'string', group: 'bewertungen'}),
    defineField({name: 'bewertungenHeadline', title: 'Überschrift', type: 'string', group: 'bewertungen'}),
    defineField({name: 'bewertungenText', title: 'Text', type: 'text', group: 'bewertungen'}),
    defineField({name: 'bewertungenCtaLabel', title: 'Button-Text (führt zum Kontaktformular)', type: 'string', group: 'bewertungen'}),
    defineField({name: 'gebietEyebrow', title: 'Unterzeile', type: 'string', group: 'gebietTeaser'}),
    defineField({name: 'gebietHeadline', title: 'Überschrift', type: 'string', group: 'gebietTeaser'}),
    defineField({name: 'gebietText', title: 'Text', type: 'text', group: 'gebietTeaser'}),
    defineField({name: 'gebietCtaLabel', title: 'Link-Text (führt zur Einsatzgebiet-Seite)', type: 'string', group: 'gebietTeaser'}),

    // Menü/Mega-Panel
    defineField({name: 'navStartseite', title: 'Menüpunkt „Startseite"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'navCtaLabel', title: 'Menü-Button ("Anfrage stellen")', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaAllLeistungen', title: 'Mega-Menü Leistungen: „Alle ansehen"-Link', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaAllUeberMich', title: 'Mega-Menü Über mich: „Alle ansehen"-Link', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaAllEinsatzgebiet', title: 'Mega-Menü Einsatzgebiet: „Alle ansehen"-Link', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaAllKontakt', title: 'Mega-Menü Kontakt: „Alle ansehen"-Link', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaKontaktAnrufenLabel', title: 'Mega-Menü Kontakt: „Anrufen"-Titel', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaKontaktWhatsappLabel', title: 'Mega-Menü Kontakt: „WhatsApp schreiben"-Titel', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaKontaktWhatsappDesc', title: 'Mega-Menü Kontakt: WhatsApp-Untertext', type: 'string', group: 'boilerplate'}),
    defineField({name: 'megaKontaktEmailLabel', title: 'Mega-Menü Kontakt: „E-Mail"-Titel', type: 'string', group: 'boilerplate'}),

    // Footer
    defineField({name: 'footerIntro', title: 'Footer: Einleitungssatz', type: 'text', group: 'boilerplate'}),
    defineField({name: 'footerNavHeading', title: 'Footer: Überschrift „Navigation"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'footerContactHeading', title: 'Footer: Überschrift „Direkter Kontakt"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'copyrightText', title: 'Footer: Copyright-Zeile', type: 'string', group: 'boilerplate'}),
    defineField({name: 'footerImpressumLabel', title: 'Footer: Link-Text „Impressum"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'footerDatenschutzLabel', title: 'Footer: Link-Text „Datenschutz"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'footerBackHomeLabel', title: 'Impressum/Datenschutz: Link „Zurück zur Startseite"', type: 'string', group: 'boilerplate'}),

    // Cookie-Banner
    defineField({name: 'cookieText', title: 'Cookie-Banner: Text (vor dem Link)', type: 'string', group: 'boilerplate'}),
    defineField({name: 'cookieLinkLabel', title: 'Cookie-Banner: Link-Text', type: 'string', group: 'boilerplate'}),
    defineField({name: 'cookieAcceptLabel', title: 'Cookie-Banner: Button „Verstanden"', type: 'string', group: 'boilerplate'}),

    // Schnellzugriff-Buttons (FAB)
    defineField({name: 'fabLongLabel', title: 'Schnellzugriff-Button: Text (breite Ansicht)', type: 'string', group: 'boilerplate'}),
    defineField({name: 'fabShortLabel', title: 'Schnellzugriff-Button: Text (schmale Ansicht)', type: 'string', group: 'boilerplate'}),

    // Danke-Popup nach Formular-Versand
    defineField({name: 'dankeHeadline', title: 'Danke-Popup: Überschrift', type: 'string', group: 'boilerplate'}),
    defineField({name: 'dankeText', title: 'Danke-Popup: Text', type: 'text', group: 'boilerplate'}),
    defineField({name: 'dankeVcardLabel', title: 'Danke-Popup: Button „Kontakt speichern"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'dankeCloseLabel', title: 'Danke-Popup: Button „Schließen"', type: 'string', group: 'boilerplate'}),

    // Kontaktformular-Beschriftungen (identisch auf Startseite + Kontaktseite)
    defineField({name: 'formNameLabel', title: 'Formular: Feld „Name"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formOrtLabel', title: 'Formular: Feld „Ort des Objekts"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formOrtPlaceholder', title: 'Formular: Platzhalter „Ort des Objekts"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formKontaktwegLabel', title: 'Formular: Feld „Kontaktweg"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formKontaktPlaceholder', title: 'Formular: Platzhalter „Kontaktweg"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formAnliegenLabel', title: 'Formular: Feld „Worum geht\'s?"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formAnliegenPlaceholder', title: 'Formular: Platzhalter „Worum geht\'s?"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formFotoLabel', title: 'Formular: „Foto anhängen"-Beschriftung', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formSubmitLabel', title: 'Formular: Absenden-Button', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formErrorText', title: 'Formular: Fehlermeldung', type: 'text', group: 'boilerplate'}),
    defineField({name: 'formDisclaimerPre', title: 'Formular: Datenschutz-Hinweis (Text vor dem Link)', type: 'string', group: 'boilerplate'}),
    defineField({name: 'formDisclaimerPost', title: 'Formular: Datenschutz-Hinweis (Text nach dem Link)', type: 'string', group: 'boilerplate'}),

    // Kartenladung (Einsatzgebiet-Karte, Startseite + FAQ-Seite)
    defineField({name: 'mapConsentTitle', title: 'Karte: Überschrift „Anfahrtskarte laden"', type: 'string', group: 'boilerplate'}),
    defineField({name: 'mapConsentText', title: 'Karte: Hinweistext (vor dem Datenschutz-Link)', type: 'text', group: 'boilerplate'}),
    defineField({name: 'mapConsentLinkLabel', title: 'Karte: Link-Text zur Datenschutzerklärung', type: 'string', group: 'boilerplate'}),
    defineField({name: 'mapConsentButtonLabel', title: 'Karte: Button „Karte laden"', type: 'string', group: 'boilerplate'}),
  ],
  preview: {
    prepare() {
      return {title: 'Website-Einstellungen'}
    },
  },
})
