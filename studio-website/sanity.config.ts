import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Website',

  projectId: '9bz9h1mi',
  dataset: 'production',

  // colorInput() registriert den Feldtyp 'color' (Sanity-Farbwähler),
  // genutzt in schemaTypes/themeSettings.ts für die globale Farbsteuerung.
  plugins: [structureTool({structure}), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },
})
