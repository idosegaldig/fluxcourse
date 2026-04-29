import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

export type SanityProject = {
  _id: string
  title: string
  tags: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
  order: number
}

export type SanityTestimonial = {
  _id: string
  name: string
  quote: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: any
  order: number
}

export async function getProjects(): Promise<SanityProject[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc) {
      _id,
      title,
      tags,
      image,
      order
    }`
  )
}

export async function getTestimonials(): Promise<SanityTestimonial[]> {
  return client.fetch(
    `*[_type == "testimonial"] | order(order asc) {
      _id,
      name,
      quote,
      logo,
      order
    }`
  )
}
