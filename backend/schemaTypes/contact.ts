import {defineField, defineType} from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'handle',
          title: 'Handle',
          description: 'With or without @, e.g. curlystudio or @curlystudio',
          type: 'string',
          validation: (Rule) =>
            Rule.required().custom((value) => {
              if (typeof value !== 'string') return 'Required'
              const trimmed = value.trim()
              if (!trimmed) return 'Required'
              const handle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed
              if (!/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
                return 'Enter a valid Instagram handle (letters, numbers, . and _)'
              }
              return true
            }),
        }),
        defineField({
          name: 'link',
          title: 'Link',
          description: 'Full URL, e.g. https://instagram.com/curlystudio',
          type: 'url',
          validation: (Rule) =>
            Rule.required()
              .uri({scheme: ['http', 'https'], allowRelative: false})
              .custom((value, context) => {
                if (typeof value !== 'string') return 'Required'

                const parent = context?.parent as {handle?: string} | undefined
                const rawHandle = parent?.handle
                if (!rawHandle || typeof rawHandle !== 'string') return true

                const handle = rawHandle.trim().replace(/^@/, '')
                if (!handle) return true

                const normalized = value.trim().replace(/\/+$/, '')
                const expected1 = `https://instagram.com/${handle}`
                const expected2 = `https://www.instagram.com/${handle}`
                const expected3 = `http://instagram.com/${handle}`
                const expected4 = `http://www.instagram.com/${handle}`

                if (![expected1, expected2, expected3, expected4].includes(normalized)) {
                  return `Link should match handle, e.g. https://instagram.com/${handle}`
                }

                return true
              }),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'email'},
    prepare({title}) {
      return {title: title ?? 'Contact'}
    },
  },
})

