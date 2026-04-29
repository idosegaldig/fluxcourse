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
