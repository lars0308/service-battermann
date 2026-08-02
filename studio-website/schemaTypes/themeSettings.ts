import {defineType, defineField} from 'sanity'
import {SparklesIcon} from '@sanity/icons/Sparkles'

// Globale Farbsteuerung: ein Singleton-Dokument, das die zentralen Design-
// Token der Website als Sanity-Farbwähler abbildet. sanity-content.js liest
// diese Werte auf JEDER Seite aus und injiziert sie live als CSS-Custom-
// Properties in :root (siehe styles.css) — ändert Lars hier eine Farbe,
// zieht sich das automatisch durch die gesamte Website, ohne Code-Änderung.
// Fehlt ein Feld (leeres Dokument, Fetch schlägt fehl): die in styles.css
// hart hinterlegten Fallback-Werte bleiben unverändert stehen, die Seite
// sieht dann exakt wie mit den aktuellen Standardfarben aus.
export const themeSettings = defineType({
  name: 'themeSettings',
  title: 'Design & Farben',
  type: 'document',
  icon: SparklesIcon,
  description:
    'Zentrale Farbsteuerung der gesamten Website. Änderungen hier wirken sich sofort auf alle Unterseiten aus.',
  fields: [
    defineField({
      name: 'primaryGold',
      title: 'Marken-Gold (Slogans, Dachzeilen, Premium-Elemente)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #C2953F.',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'brandGreen',
      title: 'Marken-Grün (WhatsApp-Button, Fokus-Akzente)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #25D366.',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'bgDark',
      title: 'Grundton Dark-Theme (Hintergrund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #0f0f0f.',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'bgLight',
      title: 'Grundton Light-Theme (Hintergrund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #fcfbfa.',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'textDark',
      title: 'Haupttextfarbe im Dark-Theme (helle Schrift auf dunklem Grund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #F4F1E9.',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'textLight',
      title: 'Haupttextfarbe im Light-Theme (dunkle Schrift auf hellem Grund)',
      type: 'color',
      description: 'Standard-Fallback ohne gepflegten Wert: #191614.',
      options: {disableAlpha: true},
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Design & Farben'}
    },
  },
})
