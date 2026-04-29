import Image from "next/image";

// zIndex ladder: cards behind title = 2, title = 5, cards in front = 10
const cards = [
  {
    logo: "/testimonial-logo-1.png", logoW: 143, logoH: 36,
    quote: "A brilliant creative partner who transformed our vision into a unique, high-impact brand identity. Their ability to craft everything from custom mascots to polished logos is truly impressive.",
    name: "Marko Stojković",
    style: { left: "7.08%", top: "calc(14.39% - 2vh)", rotate: "-6.85deg", zIndex: 10 },
  },
  {
    logo: "/testimonial-logo-2.png", logoW: 138, logoH: 26,
    quote: "Professional, precise, and incredibly fast at handling complex product visualizations and templates.",
    name: "Lukas Weber",
    style: { left: "46.94%", top: "27.56%", rotate: "2.9deg", zIndex: 2 },
  },
  {
    logo: "/testimonial-logo-3.png", logoW: 109, logoH: 35,
    quote: "A strategic partner who balances stunning aesthetics with high-performance UX for complex platforms. They don't just make things look good; they solve business problems through visual clarity.",
    name: "Sarah Jenkins",
    style: { left: "21.18%", top: "calc(56.03% + 2vh)", rotate: "2.23deg", zIndex: 10 },
  },
  {
    logo: "/testimonial-logo-4.png", logoW: 81, logoH: 42,
    quote: "An incredibly versatile designer who delivers consistent quality across a wide range of styles and formats.",
    name: "Sofia Martínez",
    style: { left: "68.54%", top: "58%", rotate: "-4.15deg", zIndex: 10 },
  },
];

// Mobile shows 2 cards side-by-side (Marko + Sofia) as per Figma mobile design
const mobileCards = [
  { logo: "/testimonial-logo-2.png", logoW: 143, logoH: 19, rotate: "-3.5deg",
    quote: "A brilliant creative partner who transformed our vision into a unique, high-impact brand identity. Their ability to craft everything from custom mascots to polished logos is truly impressive.",
    name: "Marko Stojković" },
  { logo: "/testimonial-logo-4.png", logoW: 81, logoH: 36, rotate: "2deg",
    quote: "An incredibly versatile designer who delivers consistent quality across a wide range of styles and formats.",
    name: "Sofia Martínez" },
];

export function Testimonials() {
  return (
    <section className="w-full bg-[#fafafa] overflow-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-8 px-4 py-16">
        <p className="m-0 font-medium text-black text-center capitalize testimonials-title">{`Testimonials`}</p>
        <div className="flex gap-[-10px] items-start w-full overflow-hidden">
          {mobileCards.map((c) => (
            <div key={c.name} className="shrink-0" style={{ width: "50%", paddingRight: 10, transform: `rotate(${c.rotate})` }}>
              <div className="bg-[#f1f1f1] border border-[#ddd] rounded p-6 flex flex-col gap-4">
                <div className="relative" style={{ width: c.logoW, height: c.logoH }}>
                  <Image src={c.logo} alt="" fill className="object-contain object-left" />
                </div>
                <p className="m-0 text-[#1f1f1f] text-[18px] leading-[1.3]" style={{ letterSpacing: "-0.72px" }}>{c.quote}</p>
                <p className="m-0 text-black font-black text-[16px] uppercase" style={{ letterSpacing: "-0.64px", lineHeight: 1.1 }}>{c.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: scattered absolute layout ── */}
      <div className="hidden md:block relative" style={{ minHeight: 987 }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 5 }}>
          <p className="m-0 font-medium text-black text-center capitalize testimonials-title">{`Testimonials`}</p>
        </div>
        {cards.map((c) => (
          <div key={c.name} className="absolute"
            style={{ left: c.style.left, top: c.style.top, transform: `rotate(${c.style.rotate})`, width: 353, zIndex: c.style.zIndex }}>
            <div className="bg-[#f1f1f1] border border-[#ddd] rounded p-6 flex flex-col gap-4">
              <div className="relative" style={{ width: c.logoW, height: c.logoH }}>
                <Image src={c.logo} alt="" fill className="object-contain object-left" />
              </div>
              <p className="m-0 text-[#1f1f1f] text-[18px] leading-[1.3]" style={{ letterSpacing: "-0.72px" }}>{c.quote}</p>
              <p className="m-0 text-black font-black text-[16px] uppercase" style={{ letterSpacing: "-0.64px", lineHeight: 1.1 }}>{c.name}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
