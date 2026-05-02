import { defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g. "2020 – Present" or "2017 – 2020"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower number = shown first',
      validation: r => r.required(),
    }),
  ],
  preview: {
    select: { title: 'role', subtitle: 'company' },
  },
})
