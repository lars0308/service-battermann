import {defineType, defineField} from 'sanity'
import {SparklesIcon} from '@sanity/icons/Sparkles'

// Globale Farb- und Stilsteuerung: ein Singleton-Dokument, das die zentralen
// Design-Token der Website abbildet. sanity-content.js liest diese Werte auf
// JEDER Seite aus und injiziert sie live als CSS-Custom-Properties in :root
// (siehe styles.css) — ändert Lars hier einen Wert, zieht sich das
// automatisch durch die gesamte Website, ohne Code-Änderung. Fehlt ein Feld
// (leeres Dokument, Fetch schlägt fehl): die in styles.css hart hinterlegten
// Fallback-Werte bleiben unverändert stehen, die Seite sieht dann exakt wie
// mit den aktuellen Standardwerten aus.
export const themeSettings = defineType({
  name: 'themeSettings',
  title: 'Design & Farben',
  type: 'document',
  icon: SparklesIcon,
  description:
    'Zentrale Farb- und Stilsteuerung der gesamten Website. Änderungen hier wirken sich sofort auf alle Unterseiten aus.',
  groups: [
    {name: 'farben', title: 'Farben', default: true},
    {name: 'glasUndForm', title: 'Glas & Formen'},
  ],
  fields: [
    defineField({
      name: 'primaryGold',
      title: 'Marken-Gold (Slogans, Dachzeilen, Premium-Elemente)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #C2953F.',
      options: {disableAlpha: true},
      group: 'farben',
    }),
    defineField({
      name: 'brandGreen',
      title: 'Marken-Grün (WhatsApp-Button, Fokus-Akzente)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #25D366.',
      options: {disableAlpha: true},
      group: 'farben',
    }),
    defineField({
      name: 'bgDark',
      title: 'Grundton Dark-Theme (Hintergrund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #0f0f0f.',
      options: {disableAlpha: true},
      group: 'farben',
    }),
    defineField({
      name: 'bgLight',
      title: 'Grundton Light-Theme (Hintergrund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #fcfbfa.',
      options: {disableAlpha: true},
      group: 'farben',
    }),
    defineField({
      name: 'textDark',
      title: 'Haupttextfarbe im Dark-Theme (helle Schrift auf dunklem Grund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #F4F1E9.',
      options: {disableAlpha: true},
      group: 'farben',
    }),
    defineField({
      name: 'textLight',
      title: 'Haupttextfarbe im Light-Theme (dunkle Schrift auf hellem Grund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #191614.',
      options: {disableAlpha: true},
      group: 'farben',
    }),
    defineField({
      name: 'glassOpacity',
      title: 'Deckkraft der dunklen Glas-Flächen (Mega-Menü, Hamburger-Menü, Danke-Popup)',
      type: 'number',
      description:
        'Wert zwischen 0 (durchsichtig) und 1 (blickdicht). Steuert die Deckkraft der großen, immer-dunklen Glas-Überlagerungen. Standard-Fallback: je Fläche einzeln zwischen 0.7 und 0.85.',
      validation: (rule) => rule.min(0).max(1),
      group: 'glasUndForm',
    }),
    defineField({
      name: 'glassBlur',
      title: 'Weichzeichner-Stärke aller Glas-Flächen (Pixel)',
      type: 'number',
      description:
        'Stärke des Blur-Effekts hinter Mega-Menü, Hamburger-Menü, Formular-Karte, Leistungs-Glasfenstern, "Drei Dinge"-Karten und Danke-Popup. Standard-Fallback: 24.',
      validation: (rule) => rule.min(0).max(60),
      group: 'glasUndForm',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Eckenabrundung von Kacheln, Dialogen und Knöpfen (Pixel)',
      type: 'number',
      description:
        'Steuert die Eckenradien der Website einheitlich — von scharfkantig (0, aktueller Standard) bis stark abgerundet. Standard-Fallback: 2.',
      validation: (rule) => rule.min(0).max(32),
      group: 'glasUndForm',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Design & Farben'}
    },
  },
})
