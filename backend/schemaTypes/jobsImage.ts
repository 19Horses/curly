import {defineField, defineType} from 'sanity'

export const jobsImage = defineType({
  name: 'jobsImage',
  title: 'Jobs image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      media: 'image',
    },
    prepare({media}) {
      return {title: 'Jobs image', media}
    },
  },
})
