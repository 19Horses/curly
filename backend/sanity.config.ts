import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {muxInput} from 'sanity-plugin-mux-input'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'curly',

  projectId: '7wckvdr0',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    muxInput({
      acceptedMimeTypes: ['video/*'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
