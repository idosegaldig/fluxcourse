import Image from "next/image";
import { getTestimonials, urlFor, type SanityTestimonial } from "@/lib/sanity";
import { TestimonialsSlider } from "./TestimonialsSlider";

// Layout constants per slot (order 1–4) — design positions, not content
const desktopSlots = [
  { left: "7.08%",  top: "calc(14.39% - 2vh)", rotate: "-6.85deg", zIndex: 10, logoW: 143, logoH: 36 },
  { left: "46.94%", top: "27.56%",              rotate: "2.9deg",   zIndex: 2,  logoW: 138, logoH: 26 },
  { left: "21.18%", top: "calc(56.03% + 2vh)",  rotate: "2.23deg",  zIndex: 10, logoW: 109, logoH: 35 },
  { left: "68.54%", top: "58%",                  rotate: "-4.15deg", zIndex: 10, logoW: 81,  logoH: 42 },
]


function TestimonialCard({ t, logoW, logoH }: { t: SanityTestimonial; logoW: number; logoH: number }) {
  const logoUrl = urlFor(t.logo).width(300).url()
  return (
    <div className="bg-[#f1f1f1] border border-[#ddd] rounded p-6 flex flex-col gap-4">
      <div className="relative" style={{ width: logoW, height: logoH }}>
        <Image src={logoUrl} alt="" fill className="object-contain object-left" />
      </div>
      <p className="m-0 text-[#1f1f1f] text-[18px] leading-[1.3]" style={{ letterSpacing: "-0.72px" }}>{t.quote}</p>
      <p className="m-0 text-black font-black text-[16px] uppercase" style={{ letterSpacing: "-0.64px", lineHeight: 1.1 }}>{t.name}</p>
    </div>
  )
}

export async function Testimonials() {
  const testimonials = await getTestimonials()

  const desktopCards = desktopSlots.map((slot, i) => ({ slot, t: testimonials[i] })).filter(({ t }) => t)

  return (
    <section className="w-full bg-[#fafafa] overflow-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-8 px-4 py-16">
        <p className="m-0 font-medium text-black text-center capitalize testimonials-title">Testimonials</p>
        <TestimonialsSlider testimonials={testimonials} />
      </div>

      {/* ── Desktop: scattered absolute layout ── */}
      <div className="hidden md:block relative" style={{ minHeight: 987 }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 5 }}>
          <p className="m-0 font-medium text-black text-center capitalize testimonials-title">Testimonials</p>
        </div>
        {desktopCards.map(({ slot, t }) => (
          <div key={t._id} className="absolute"
            style={{ left: slot.left, top: slot.top, transform: `rotate(${slot.rotate})`, width: 353, zIndex: slot.zIndex }}>
            <TestimonialCard t={t} logoW={slot.logoW} logoH={slot.logoH} />
          </div>
        ))}
      </div>

    </section>
  )
}
