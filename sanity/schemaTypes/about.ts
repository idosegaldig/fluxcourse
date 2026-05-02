import { defineField, defineType } from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Name / Headline',
      type: 'string',
      description: 'Large display name, e.g. "Harvey Specter"',
      validation: r => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Role / Tagline',
      type: 'string',
      description: 'Short role line shown in italic below the name',
    }),
    defineField({
      name: 'bioShort',
      title: 'Short Bio',
      type: 'string',
      description: 'One-liner shown in the hero area',
    }),
    defineField({
      name: 'bio',
      title: 'Full Bio',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Up to 4 numbers displayed in the bio section',
      of: [{
        type: 'object',
        name: 'stat',
        fields: [
          defineField({ name: 'value', title: 'Value (e.g. "8+")', type: 'string' }),
          defineField({ name: 'label', title: 'Label (e.g. "Years Experience")', type: 'string' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    }),
    defineField({
      name: 'skills',
      title: 'Skills & Expertise',
      type: 'array',
      description: 'Each skill shown as a row item',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'tagline' },
  },
})
