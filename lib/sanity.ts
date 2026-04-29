import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

export type SanityProject = {
  _id: string
  title: string
  tags: string[]
  imagePath: string
  order: number
}

export async function getProjects(): Promise<SanityProject[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc) {
      _id,
      title,
      tags,
      imagePath,
      order
    }`
  )
}
