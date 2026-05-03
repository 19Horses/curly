import {defineField, defineType} from 'sanity'

function formatLongDateWithOrdinal(isoDate: string) {
  // isoDate is expected to be "YYYY-MM-DD"
  const [y, m, d] = isoDate.split('-').map((v) => Number(v))
  if (!y || !m || !d) return isoDate

  const date = new Date(Date.UTC(y, m - 1, d))

  const suffix =
    d % 100 >= 11 && d % 100 <= 13
      ? 'th'
      : d % 10 === 1
        ? 'st'
        : d % 10 === 2
          ? 'nd'
          : d % 10 === 3
            ? 'rd'
            : 'th'

  const monthYear = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)

  return `${d}${suffix} ${monthYear}`
}

export const job = defineType({
  name: 'job',
  title: 'Job',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities',
      description: 'Add one bullet per responsibility.',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'annualLeave',
      title: 'Annual Leave',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'salary',
      title: 'Salary',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'applicationDeadline',
      title: 'Application deadline',
      type: 'date',
      options: {dateFormat: 'YYYY-MM-DD'},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'applicationDeadline',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `Deadline: ${formatLongDateWithOrdinal(subtitle)}` : undefined,
      }
    },
  },
})

