import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const client = createClient({
  projectId: '91atv4ho',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const projects = [
  { title: 'Surfers paradise',   tags: ['Social Media', 'Photography'], img: 'portfolio-surfers.jpg',  order: 1 },
  { title: 'Cyberpunk caffe',    tags: ['Social Media', 'Photography'], img: 'portfolio-cyberpunk.jpg', order: 2 },
  { title: 'Agency 976',         tags: ['Social Media', 'Photography'], img: 'portfolio-agency.jpg',   order: 3 },
  { title: 'Minimal Playground', tags: ['Social Media', 'Photography'], img: 'portfolio-minimal.jpg',  order: 4 },
]

for (const project of projects) {
  console.log(`Uploading image for "${project.title}"...`)
  const imgPath = resolve('public', project.img)
  const imgBuffer = readFileSync(imgPath)
  const asset = await client.assets.upload('image', imgBuffer, { filename: project.img })

  console.log(`Creating document for "${project.title}"...`)
  await client.create({
    _type: 'project',
    title: project.title,
    tags: project.tags,
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    order: project.order,
  })

  console.log(`✓ "${project.title}" created`)
}

console.log('\nAll projects seeded!')
