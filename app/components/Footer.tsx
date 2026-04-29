// Figma node 1:265 — Footer
// Mobile: social links stacked, wordmark 91px
// Desktop: 3-col social, wordmark 290px

export function Footer() {
  return (
    <footer className="bg-black w-full" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-12 px-4 pt-12">
        {/* CTA + social */}
        <div className="flex flex-col gap-4">
          <p className="m-0 text-white italic font-light text-[24px] uppercase" style={{ letterSpacing: "-0.96px", lineHeight: 1.1 }}>
            Have a <strong className="font-black not-italic">project</strong> in mind?
          </p>
          <button className="w-fit border border-white text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer bg-transparent" style={{ letterSpacing: "-0.56px" }}>
            Let&apos;s talk
          </button>
          {["Facebook", "Instagram", "x.com", "Linkedin"].map(s => (
            <p key={s} className="m-0 text-white text-[18px] uppercase" style={{ letterSpacing: "-0.72px", lineHeight: 1.1 }}>{s}</p>
          ))}
        </div>
        <div className="w-full h-px bg-white/20" />
        {/* Wordmark */}
        <div className="flex flex-col gap-4 pb-0">
          <div className="flex gap-[34px] items-center">
            <a href="#" className="text-white text-[12px] underline uppercase" style={{ letterSpacing: "-0.48px" }}>licences</a>
            <a href="#" className="text-white text-[12px] underline uppercase" style={{ letterSpacing: "-0.48px" }}>Privacy policy</a>
          </div>
          <p className="m-0 text-white uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, fontWeight: 400, lineHeight: 1.1 }}>
            [ Coded By Claude ]
          </p>
          <p className="m-0 text-white font-semibold capitalize footer-wordmark">{`H.Studio`}</p>
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col gap-[120px] pt-[48px] px-8">
        {/* Top */}
        <div className="flex flex-col gap-12">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-3 w-[298px]">
              <p className="m-0 text-white italic font-light text-[24px] uppercase" style={{ letterSpacing: "-0.96px", lineHeight: 1.1 }}>
                Have a <strong className="font-black not-italic">project</strong> in mind?
              </p>
              <button className="w-fit border border-white text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer bg-transparent" style={{ letterSpacing: "-0.56px" }}>
                Let&apos;s talk
              </button>
            </div>
            <div className="text-white text-[18px] text-center uppercase w-[298px]" style={{ letterSpacing: "-0.72px", lineHeight: 1.1 }}>
              <p className="m-0">Facebook</p><p className="m-0">Instagram</p>
            </div>
            <div className="text-white text-[18px] text-right uppercase w-[298px]" style={{ letterSpacing: "-0.72px", lineHeight: 1.1 }}>
              <p className="m-0">x.com</p><p className="m-0">Linkedin</p>
            </div>
          </div>
          <div className="w-full h-px bg-white/20" />
        </div>
        {/* Wordmark row */}
        <div className="flex items-end justify-between">
          <div className="relative overflow-hidden shrink-0" style={{ width: 1093, height: 219 }}>
            <div className="absolute flex items-center justify-center" style={{ left: 0, top: "50%", transform: "translateY(-50%)", width: 15, height: 160 }}>
              <p className="m-0 text-white uppercase whitespace-nowrap"
                style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, fontWeight: 400, lineHeight: 1.1, transform: "rotate(-90deg)" }}>
                [ Coded By Claude ]
              </p>
            </div>
            <div className="absolute w-full flex items-center justify-center" style={{ top: "50%", transform: "translateY(-50%)" }}>
              <p className="m-0 text-white font-semibold capitalize whitespace-nowrap footer-wordmark">{`H.Studio`}</p>
            </div>
          </div>
          <div className="flex gap-[34px] items-center pb-8 shrink-0">
            <a href="#" className="text-white text-[12px] underline uppercase" style={{ letterSpacing: "-0.48px" }}>licences</a>
            <a href="#" className="text-white text-[12px] underline uppercase" style={{ letterSpacing: "-0.48px" }}>Privacy policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
