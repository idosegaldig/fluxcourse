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

const testimonials = [
  { name: 'Marko Stojković', logo: 'testimonial-logo-1.png', order: 1,
    quote: "A brilliant creative partner who transformed our vision into a unique, high-impact brand identity. Their ability to craft everything from custom mascots to polished logos is truly impressive." },
  { name: 'Lukas Weber', logo: 'testimonial-logo-2.png', order: 2,
    quote: "Professional, precise, and incredibly fast at handling complex product visualizations and templates." },
  { name: 'Sarah Jenkins', logo: 'testimonial-logo-3.png', order: 3,
    quote: "A strategic partner who balances stunning aesthetics with high-performance UX for complex platforms. They don't just make things look good; they solve business problems through visual clarity." },
  { name: 'Sofia Martínez', logo: 'testimonial-logo-4.png', order: 4,
    quote: "An incredibly versatile designer who delivers consistent quality across a wide range of styles and formats." },
]

for (const t of testimonials) {
  console.log(`Uploading logo for "${t.name}"...`)
  const imgBuffer = readFileSync(resolve('public', t.logo))
  const asset = await client.assets.upload('image', imgBuffer, { filename: t.logo })

  console.log(`Creating testimonial for "${t.name}"...`)
  await client.create({
    _type: 'testimonial',
    name: t.name,
    quote: t.quote,
    logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    order: t.order,
  })

  console.log(`✓ "${t.name}" created`)
}

console.log('\nAll testimonials seeded!')
