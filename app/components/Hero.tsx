"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Hero() {
  const mono = { fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, fontWeight: 400, lineHeight: 1.1, letterSpacing: 0 };

  const sectionRef = useRef<HTMLElement>(null);

  // Mobile refs
  const mHelloRef = useRef<HTMLParagraphElement>(null);
  const mH1Ref    = useRef<HTMLDivElement>(null);
  const mDescRef  = useRef<HTMLParagraphElement>(null);
  const mBtnRef   = useRef<HTMLButtonElement>(null);
  const mImgRef   = useRef<HTMLDivElement>(null);

  // Desktop refs
  const dHelloRef = useRef<HTMLParagraphElement>(null);
  const dH1Ref    = useRef<HTMLDivElement>(null);
  const dDescRef  = useRef<HTMLParagraphElement>(null);
  const dBtnRef   = useRef<HTMLButtonElement>(null);
  const dImgRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const helloEl = isMobile ? mHelloRef.current : dHelloRef.current;
      const h1El    = isMobile ? mH1Ref.current    : dH1Ref.current;
      const descEl  = isMobile ? mDescRef.current  : dDescRef.current;
      const btnEl   = isMobile ? mBtnRef.current   : dBtnRef.current;
      const imgEl   = isMobile ? mImgRef.current   : dImgRef.current;

      // ── Split instances (shared between entry + scroll) ──
      const splitH1   = h1El   ? new SplitText(h1El.querySelectorAll("p"),  { type: "chars" }) : null;
      const splitDesc = descEl ? new SplitText(descEl, { type: "words" })                      : null;

      // ── Entry timeline ──
      const entryTl = gsap.timeline({ defaults: { ease: "none" } });

      if (helloEl)   entryTl.from(helloEl, { x: -30, opacity: 0, duration: 0.5 });
      if (splitH1)   entryTl.from(splitH1.chars,   { opacity: 0.1, stagger: 0.1,  duration: 0.5 }, "-=0.2");
      if (splitDesc) entryTl.from(splitDesc.words,  { opacity: 0, y: -30, stagger: 0.02, duration: 0.4 }, "-=1");
      if (btnEl)     entryTl.from(btnEl, { opacity: 0, y: 20, duration: 0.4 }, "-=0.5");

      // ── Scroll timeline ──
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // H1: letterSpacing grows + chars fade in random order
      if (h1El && splitH1) {
        scrollTl.to(h1El.querySelectorAll("p"), { letterSpacing: "0.25em", ease: "none" }, 0);
        scrollTl.to(splitH1.chars, { opacity: 0, stagger: { each: 0.04, from: "random" }, ease: "none" }, 0);
      }

      // "[ Hello I'm ]" slides left
      if (helloEl) scrollTl.to(helloEl, { x: -80, opacity: 0, ease: "none" }, 0);

      // Description slides right
      if (descEl) scrollTl.to(descEl, { x: 80, opacity: 0, ease: "none" }, 0);

      // CTA fades out
      if (btnEl) scrollTl.to(btnEl, { opacity: 0, ease: "none" }, 0);

      // Image zooms in 20%
      if (imgEl) scrollTl.to(imgEl, { scale: 1.2, ease: "none" }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden h-[100dvh] md:h-[847px]"
      style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#C6D1D2" }}
    >
      {/* Background photo — mobile */}
      <div ref={mImgRef} className="md:hidden absolute inset-0">
        <Image src="/Mobile%20Hero%20Image.png" alt="" fill className="object-cover object-top pointer-events-none" priority />
      </div>
      {/* Background photo — desktop */}
      <div ref={dImgRef} className="hidden md:block absolute inset-0">
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

        {/* ── Mobile nav ── */}
        <nav className="flex md:hidden items-center justify-between py-6">
          <span className="font-semibold text-base tracking-[-0.04em] capitalize text-black">H.Studio</span>
          <button aria-label="Menu"><HamburgerIcon /></button>
        </nav>

        {/* ── Desktop nav ── */}
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
        <div className="flex md:hidden flex-col flex-1 justify-end pb-6 gap-5">
          <div className="flex flex-col items-center w-full gap-0 mb-5">
            <p ref={mHelloRef} className="m-0 text-white uppercase mix-blend-overlay w-full text-center" style={{ ...mono }}>
              [ Hello i&apos;m ]
            </p>
            <div ref={mH1Ref} className="w-full">
              <p className="m-0 font-medium text-white mix-blend-overlay hero-title w-full">Harvey</p>
              <p className="m-0 font-medium text-white mix-blend-overlay hero-title w-full">Specter</p>
            </div>
          </div>
          <div className="flex flex-col gap-[17px]">
            <p ref={mDescRef} className="m-0 text-[#1f1f1f] text-[14px] uppercase leading-[1.1]" style={{ letterSpacing: "-0.56px", maxWidth: 294 }}>
              <strong className="font-bold italic">H.Studio is a </strong>
              <em className="font-normal">full-service</em>
              <strong className="font-bold italic"> creative studio creating beautiful digital experiences and products. We are an </strong>
              <em className="font-normal">award winning</em>
              <strong className="font-bold italic"> desing and art group specializing in branding, web design and engineering.</strong>
            </p>
            <button ref={mBtnRef} className="w-fit bg-black text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer" style={{ letterSpacing: "-0.56px" }}>
              Let&apos;s talk
            </button>
          </div>
        </div>

        {/* ── Desktop text layout ── */}
        <div className="hidden md:block relative w-full mt-[240px]">
          <p ref={dHelloRef} className="absolute top-0 left-0 m-0 text-white uppercase mix-blend-overlay whitespace-nowrap" style={{ ...mono }}>
            [ Hello i&apos;m ]
          </p>
          <div ref={dH1Ref} className="mix-blend-overlay w-full" style={{ lineHeight: 0 }}>
            <p className="m-0 font-medium text-white hero-title">{`Harvey   Specter`}</p>
          </div>
          <div className="flex justify-end w-full mt-4">
            <div className="flex flex-col gap-[17px]" style={{ width: "20.4vw", minWidth: 240 }}>
              <p ref={dDescRef} className="m-0 text-[#1f1f1f] text-[14px] uppercase leading-[1.1]" style={{ letterSpacing: "-0.56px" }}>
                <strong className="font-bold italic">H.Studio is a </strong>
                <em className="font-normal">full-service</em>
                <strong className="font-bold italic"> creative studio creating beautiful digital experiences and products. We are an </strong>
                <em className="font-normal">award winning</em>
                <strong className="font-bold italic"> desing and art group specializing in branding, web design and engineering.</strong>
              </p>
              <button ref={dBtnRef} className="w-fit bg-black text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer" style={{ letterSpacing: "-0.56px" }}>
                Let&apos;s talk
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
