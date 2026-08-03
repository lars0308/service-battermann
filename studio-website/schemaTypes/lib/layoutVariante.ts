import {defineField} from 'sanity'

// Kuratierte Layout-Varianten sind PRO Sektion unterschiedlich (2-3
// sinnvolle Optionen je nach tatsächlicher visueller Struktur) — deshalb
// kein gemeinsamer Objekt-Typ wie sectionDesign, sondern ein schlanker
// Helfer (gleiches Prinzip wie marker() in pageHome.ts), den jede
// qualifizierende Sektion mit ihrer eigenen Liste aufruft.
export function layoutVariante(
  fieldName: string,
  group: string,
  choices: {title: string; value: string}[],
  initialValue: string,
) {
  return defineField({
    name: fieldName,
    title: 'Layout-Variante',
    type: 'string',
    options: {layout: 'radio', list: choices},
    initialValue,
    group,
  })
}
