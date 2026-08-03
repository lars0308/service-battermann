import {defineType, defineField} from 'sanity'
import {SparklesIcon} from '@sanity/icons/Sparkles'

// Zentrales Kinetik-Studio: EIN Singleton-Dokument für sämtliche Timing- und
// Bewegungswerte der Website (vorher verstreut in siteSettings). Jedes Feld
// ohne feste min/max-Validierung — reine number-Felder, damit gängige Werte
// wie 1000 oder 5000 immer ohne Warnung gespeichert werden können. Fehlt ein
// Feld (leeres Dokument, Fetch schlägt fehl): die in styles.css/main.js hart
// hinterlegten Fallback-Werte bleiben unverändert stehen — siehe die
// "Standard-Fallback"-Hinweise je Feld.
export const effectSettings = defineType({
  name: 'effectSettings',
  title: 'Kinetik-Studio (Zeiten & Effekte)',
  type: 'document',
  icon: SparklesIcon,
  description:
    'Alle Zeiten, Geschwindigkeiten und Bewegungsstärken der Website an einer Stelle. Änderungen wirken sofort auf der gesamten Website, ohne Code-Änderung.',
  groups: [
    {name: 'heroIntro', title: 'Hero & Intro', default: true},
    {name: 'bento', title: 'Bento-Grid & Kacheln'},
    {name: 'transitions', title: 'Allgemeine Transitions'},
  ],
  fields: [
    defineField({
      name: 'heroAutoplayMs',
      title: 'Dauer pro Folie (ms)',
      type: 'number',
      description: 'Wie lange ein Spruch/Bild im Hero zu sehen ist. Standard-Fallback: 5000.',
      group: 'heroIntro',
    }),
    defineField({
      name: 'heroTransitionMs',
      title: 'Überblend-Zeit (ms)',
      type: 'number',
      description: 'Wie sanft Text und Bilder per Kreuzblende verschmelzen. Standard-Fallback: 1200.',
      group: 'heroIntro',
    }),
    defineField({
      name: 'introDurationMs',
      title: 'Intro-Dauer (ms)',
      type: 'number',
      description: 'Wie lange die Intro-Glaswand beim ersten Laden aktiv bleibt. Standard-Fallback: 1500.',
      group: 'heroIntro',
    }),
    defineField({
      name: 'introBlurStrength',
      title: 'Intro-Weichzeichnung (px)',
      type: 'number',
      description: 'Stärke des Blur-Effekts am Anfang. Standard-Fallback: 45.',
      group: 'heroIntro',
    }),
    defineField({
      name: 'introVeilOpacity',
      title: 'Intro-Helligkeit/Dunkelheit (Deckkraft des Schleiers)',
      type: 'number',
      description: 'Deckkraft des dunklen Hintergrund-Schleiers hinter der Intro-Glaswand, 0 (durchsichtig) bis 1 (blickdicht). Standard-Fallback: 0.65.',
      group: 'heroIntro',
    }),
    defineField({
      name: 'kitCardIntervalMs',
      title: 'Auto-Rotate-Timer (ms)',
      type: 'number',
      description: 'Zeit, bis die Leistungskachel automatisch weiterwechselt. Standard-Fallback: 5000.',
      group: 'bento',
    }),
    defineField({
      name: 'trustMarqueeSpeedMs',
      title: 'Vorteile-Laufband-Geschwindigkeit auf dem Handy (ms für einen Durchlauf)',
      type: 'number',
      description: 'Wie lange die 4 Vorteile-Karten auf dem Smartphone brauchen, um einmal komplett durchzulaufen. Kleinere Zahl = schneller. Standard-Fallback: 22000.',
      group: 'bento',
    }),
    defineField({
      name: 'bentoTileScale',
      title: 'Kachel-Vergrößerung (Skalierung)',
      type: 'number',
      description: 'Wie stark die Kachel beim Fokussieren wächst (1 = keine Vergrößerung, 1.22 = 22 % größer). Standard-Fallback: 1.22.',
      group: 'bento',
    }),
    defineField({
      name: 'bentoGlassFadeMs',
      title: 'Glasfenster-Einblendgeschwindigkeit (ms)',
      type: 'number',
      description: 'Dauer des Fade-Ins für den Vorschautext im Glasfenster neben der Kachel. Standard-Fallback: 600.',
      group: 'bento',
    }),
    defineField({
      name: 'revealDurationMs',
      title: 'Allgemeine Fade-In-Dauer (ms)',
      type: 'number',
      description: 'Wie lange das sanfte Einblenden von Abschnitten beim Scrollen dauert (gilt sitesweit). Standard-Fallback: 800.',
      group: 'transitions',
    }),
    defineField({
      name: 'revealDistancePx',
      title: 'Allgemeine Fade-In-Strecke (px)',
      type: 'number',
      description: 'Aus welcher Distanz Abschnitte beim Scrollen nach oben einblenden (gilt sitesweit). Standard-Fallback: 40.',
      group: 'transitions',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Kinetik-Studio (Zeiten & Effekte)'}
    },
  },
})
