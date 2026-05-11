import {defineField, defineType} from 'sanity'

export const song = defineType({
  name: 'song',
  title: 'Song',
  type: 'document',
  fields: [
    defineField({
      name: 'audio',
      title: 'Audio',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Song'}
    },
  },
})
