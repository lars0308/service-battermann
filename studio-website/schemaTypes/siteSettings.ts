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
    {name: 'hero', title: 'Hero'},
    {name: 'intro', title: 'Glas-Intro (Startseite)'},
    {name: 'forms', title: 'Formular'},
    {name: 'kit', title: 'Kit-Animationssteuerung'},
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
      name: 'heroEyebrow',
      title: 'Hero-Unterzeile (über der Überschrift)',
      type: 'string',
      initialValue: 'Hausmeisterservice · Objektbetreuung · Allround-Handwerk',
      group: 'hero',
    }),
    defineField({
      name: 'heroAutoplayMs',
      title: 'Hero-Wechselgeschwindigkeit (Millisekunden)',
      type: 'number',
      description: 'Wie lange ein Hero-Bild stehen bleibt, bevor zum nächsten gewechselt wird. Standard: 5200.',
      initialValue: 5200,
      validation: (rule) => rule.min(2000).max(15000),
      group: 'hero',
    }),
    defineField({
      name: 'introDurationMs',
      title: 'Intro: Anzeige-Dauer der Glaswand (Millisekunden)',
      type: 'number',
      description:
        'Wie lange Slogan + Buttons zentriert vor der Glaswand stehen bleiben, bevor sie wegleitet. Standard: 3000 (3 Sekunden).',
      initialValue: 3000,
      validation: (rule) => rule.min(500).max(10000),
      group: 'intro',
    }),
    defineField({
      name: 'introBlurStrength',
      title: 'Intro: Weichzeichner-Stärke der Glaswand (Pixel)',
      type: 'number',
      description: 'Stärke des Blur-Effekts, durch den das Hero-Bild hindurchschimmert. Standard: 45.',
      initialValue: 45,
      validation: (rule) => rule.min(0).max(100),
      group: 'intro',
    }),
    defineField({
      name: 'staticFormsApiKey',
      title: 'Static Forms API-Key (Kontaktformular)',
      type: 'string',
      description:
        'Ohne diesen Key nimmt das Kontaktformular auf kontakt.html keine Anfragen entgegen. Key von staticforms.dev, siehe SETUP.md.',
      group: 'forms',
    }),
    defineField({
      name: 'kitCardIntervalMs',
      title: 'Kit-Fokus-Impuls: Zeit pro Kachel (Millisekunden)',
      type: 'number',
      description:
        'Steuert den automatischen Hervorhebungs-Impuls der 5 Leistungskacheln auf der Startseite. Standard: 3000.',
      initialValue: 3000,
      validation: (rule) => rule.min(500).max(8000),
      group: 'kit',
    }),
    defineField({
      name: 'kitActiveScale',
      title: 'Kit-Fokus-Impuls: Skalierung der aktiven Kachel',
      type: 'number',
      description: 'Standard: 1.05 (5% größer).',
      initialValue: 1.05,
      validation: (rule) => rule.min(1).max(1.15),
      group: 'kit',
    }),
    defineField({
      name: 'kitInactiveOpacity',
      title: 'Kit-Fokus-Impuls: Abdunklung der inaktiven Kacheln',
      type: 'number',
      description: 'Standard: 0.5. Kleinerer Wert = stärker abgedunkelt.',
      initialValue: 0.5,
      validation: (rule) => rule.min(0.2).max(1),
      group: 'kit',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Website-Einstellungen'}
    },
  },
})
