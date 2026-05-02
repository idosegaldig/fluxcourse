"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "About",    href: "/about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "News",     href: "#news" },
  { label: "Contact",  href: "#contact" },
];

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

  // Mobile menu refs
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuBotRef   = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    // Start panel off-screen to the right
    gsap.set(menuPanelRef.current, { x: "100%" });
    gsap.to(menuPanelRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
    // Stagger items in from the right
    gsap.fromTo(
      menuItemRefs.current.filter(Boolean),
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(menuBotRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.55 });
  }, []);

  const closeMenu = useCallback(() => {
    gsap.to(menuItemRefs.current.filter(Boolean), { x: 30, opacity: 0, duration: 0.2, stagger: 0.03, ease: "power2.in" });
    gsap.to(menuBotRef.current, { opacity: 0, duration: 0.15 });
    gsap.to(menuPanelRef.current, {
      x: "100%", duration: 0.45, ease: "power3.inOut", delay: 0.1,
      onComplete: () => setMenuOpen(false),
    });
  }, []);

  // Close on route change / resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768 && menuOpen) closeMenu(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen, closeMenu]);

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
        <nav className="flex md:hidden items-center justify-between py-6 relative z-10">
          <Link href="/" className="font-semibold text-base tracking-[-0.04em] capitalize text-black no-underline"
            style={{ textDecoration: "none" }}>
            H.Studio
          </Link>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={menuOpen ? closeMenu : openMenu}
            className="w-10 h-10 flex items-center justify-center"
          >
            {menuOpen
              ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <HamburgerIcon />
            }
          </button>
        </nav>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center justify-between py-6">
          <Link href="/" className="font-semibold text-base tracking-[-0.04em] capitalize text-black"
            style={{ textDecoration: "none" }}>
            H.Studio
          </Link>
          <div className="flex gap-14 font-semibold text-base tracking-[-0.04em] capitalize text-black">
            {NAV_ITEMS.map(({ label, href }) =>
              href.startsWith("/") ? (
                <Link key={label} href={href} className="hover:opacity-70 transition-opacity"
                  style={{ textDecoration: "none", color: "inherit" }}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} className="hover:opacity-70 transition-opacity"
                  style={{ textDecoration: "none", color: "inherit" }}>
                  {label}
                </a>
              )
            )}
          </div>
          <a href="#contact">
            <button className="bg-black text-white text-sm font-medium px-4 py-3 rounded-[24px] tracking-[-0.04em] cursor-pointer">
              Let&apos;s talk
            </button>
          </a>
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

      {/* ── Mobile slide-in menu overlay ────────────────────────── */}
      {/* Always in DOM; GSAP drives position. Rendered on top of everything. */}
      <div
        ref={menuPanelRef}
        className="md:hidden fixed inset-0 z-40 flex flex-col px-6 py-6"
        style={{
          background: "#1f1f1f",
          transform: "translateX(100%)",
          fontFamily: "var(--font-inter), sans-serif",
          // prevent interaction when off-screen
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/" onClick={closeMenu}
            className="font-semibold text-base tracking-[-0.04em] capitalize text-white"
            style={{ textDecoration: "none" }}>
            H.Studio
          </Link>
          <button onClick={closeMenu} className="w-10 h-10 flex items-center justify-center" aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map(({ label, href }, i) => {
            const inner = (
              <div className="flex items-center justify-between py-4 border-b border-white/10 group">
                <span className="text-white font-light uppercase"
                  style={{ fontSize: 40, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
                  {label}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-30 group-hover:opacity-80 transition-opacity">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            );

            return href.startsWith("/") ? (
              <Link
                key={label}
                href={href}
                ref={(el) => { menuItemRefs.current[i] = el; }}
                onClick={closeMenu}
                style={{ textDecoration: "none" }}>
                {inner}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                ref={(el) => { menuItemRefs.current[i] = el; }}
                onClick={closeMenu}
                style={{ textDecoration: "none" }}>
                {inner}
              </a>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div ref={menuBotRef} className="pt-8 pb-4">
          <a href="#contact" onClick={closeMenu} style={{ textDecoration: "none" }}>
            <button className="w-full bg-white text-black text-[14px] font-semibold py-4 rounded-full tracking-[-0.04em] cursor-pointer">
              Let&apos;s talk
            </button>
          </a>
          <p className="mt-6 text-center text-white/30"
            style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, textTransform: "uppercase" }}>
            [ H.Studio — Creative Direction ]
          </p>
        </div>
      </div>
    </section>
  );
}
