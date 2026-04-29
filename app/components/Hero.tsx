import Image from "next/image";

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Hero() {
  const mono = { fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, fontWeight: 400, lineHeight: 1.1, letterSpacing: 0 };

  return (
    <section
      className="relative w-full overflow-hidden h-[635px] md:h-[847px]"
      style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#C6D1D2" }}
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image src="/hero-subject.png" alt="" fill className="object-contain object-top pointer-events-none" priority />
      </div>

      {/* Blur fade overlay */}
      <div className="absolute inset-0" style={{
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        backgroundColor: "rgba(217,217,217,0.01)",
        maskImage: "linear-gradient(to bottom, transparent 60%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 60%, black 100%)",
      }} />

      {/* Content wrapper */}
      <div className="relative h-full flex flex-col px-4 md:px-8">

        {/* ── Mobile nav (hamburger) ── */}
        <nav className="flex md:hidden items-center justify-between py-6">
          <span className="font-semibold text-base tracking-[-0.04em] capitalize text-black">H.Studio</span>
          <button aria-label="Menu"><HamburgerIcon /></button>
        </nav>

        {/* ── Desktop nav (full links) ── */}
        <nav className="hidden md:flex items-center justify-between py-6">
          <span className="font-semibold text-base tracking-[-0.04em] capitalize text-black">H.Studio</span>
          <div className="flex gap-14 font-semibold text-base tracking-[-0.04em] capitalize text-black">
            {(["About", "Services", "Projects", "News", "Contact"] as const).map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:opacity-70 transition-opacity">{item}</a>
            ))}
          </div>
          <button className="bg-black text-white text-sm font-medium px-4 py-3 rounded-[24px] tracking-[-0.04em] cursor-pointer">
            Let&apos;s talk
          </button>
        </nav>

        {/* ── Mobile text layout ── */}
        <div className="flex md:hidden flex-col flex-1 justify-between pb-6">
          <div className="flex flex-col items-center">
            <p className="m-0 text-white uppercase mix-blend-overlay whitespace-nowrap" style={{ ...mono }}>
              [ Hello i&apos;m ]
            </p>
            <div style={{ lineHeight: 0 }}>
              <p className="m-0 font-medium text-white mix-blend-overlay hero-title">{`Harvey   Specter`}</p>
            </div>
          </div>
          <div className="flex flex-col gap-[17px] w-[294px]">
            <p className="m-0 text-[#1f1f1f] text-[14px] uppercase leading-[1.1]" style={{ letterSpacing: "-0.56px" }}>
              <strong className="font-bold italic">H.Studio is a </strong>
              <em className="font-normal">full-service</em>
              <strong className="font-bold italic"> creative studio creating beautiful digital experiences and products. We are an </strong>
              <em className="font-normal">award winning</em>
              <strong className="font-bold italic"> desing and art group specializing in branding, web design and engineering.</strong>
            </p>
            <button className="w-fit bg-black text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer" style={{ letterSpacing: "-0.56px" }}>
              Let&apos;s talk
            </button>
          </div>
        </div>

        {/* ── Desktop text layout ── */}
        <div className="hidden md:block relative w-full mt-[240px]">
          <p className="absolute top-0 left-0 m-0 text-white uppercase mix-blend-overlay whitespace-nowrap" style={{ ...mono }}>
            [ Hello i&apos;m ]
          </p>
          <div className="mix-blend-overlay w-full" style={{ lineHeight: 0 }}>
            <p className="m-0 font-medium text-white hero-title">{`Harvey   Specter`}</p>
          </div>
          <div className="flex justify-end w-full mt-4">
            <div className="flex flex-col gap-[17px]" style={{ width: "20.4vw", minWidth: 240 }}>
              <p className="m-0 text-[#1f1f1f] text-[14px] uppercase leading-[1.1]" style={{ letterSpacing: "-0.56px" }}>
                <strong className="font-bold italic">H.Studio is a </strong>
                <em className="font-normal">full-service</em>
                <strong className="font-bold italic"> creative studio creating beautiful digital experiences and products. We are an </strong>
                <em className="font-normal">award winning</em>
                <strong className="font-bold italic"> desing and art group specializing in branding, web design and engineering.</strong>
              </p>
              <button className="w-fit bg-black text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer" style={{ letterSpacing: "-0.56px" }}>
                Let&apos;s talk
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
