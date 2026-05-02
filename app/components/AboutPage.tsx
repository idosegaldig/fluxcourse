"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/lib/sanity";
import type { SanityAbout, SanityExperience } from "@/lib/sanity";

gsap.registerPlugin(SplitText, ScrollTrigger);

// ── Design tokens (match homepage) ──────────────────────────
const mono: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 14, fontWeight: 400, lineHeight: 1.1,
  textTransform: "uppercase", margin: 0,
};

function Corner({ pos, color = "#1f1f1f" }: { pos: "tl" | "tr" | "bl" | "br"; color?: string }) {
  const s: CSSProperties = { width: 14, height: 14, flexShrink: 0 };
  const b: Record<string, CSSProperties> = {
    tl: { borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    tr: { borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
    bl: { borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    br: { borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
  };
  return <div style={{ ...s, ...b[pos] }} />;
}

// ── Fallback content (used when Sanity has no data yet) ──────
const FALLBACK_ABOUT: SanityAbout = {
  _id: "fallback",
  headline: "Harvey Specter",
  tagline: "Creative Director & Brand Strategist",
  bioShort: "8+ years shaping brands that move people.",
  bio: "Placeholder paragraph one. This is where you introduce yourself — your background, your passion for your craft, and what drives you creatively. Two to three sentences work best here.\n\nPlaceholder paragraph two. Here you can describe your technical approach, how you collaborate with clients, or what sets your work apart from others in your field.",
  portrait: null,
  stats: [
    { value: "8+",  label: "Years Experience" },
    { value: "50+", label: "Projects Delivered" },
    { value: "30+", label: "Happy Clients" },
    { value: "12",  label: "Awards Won" },
  ],
  skills: ["Brand Strategy", "Art Direction", "Web Design", "Motion Design", "Typography", "Photography"],
};

const FALLBACK_EXP: SanityExperience[] = [
  { _id: "e1", role: "Creative Director", company: "H.Studio",  period: "2020 – Present", description: "Leading brand and digital experiences for international clients across Europe and North America.", order: 1 },
  { _id: "e2", role: "Senior Designer",   company: "Ogilvy",    period: "2017 – 2020",    description: "Conceptualised and delivered campaigns for Fortune 500 brands with cross-functional teams.", order: 2 },
  { _id: "e3", role: "Designer",          company: "Freelance", period: "2015 – 2017",    description: "Built an independent client base from the ground up, focusing on identity and print design.", order: 3 },
];

// ── SVG distortion (reused from homepage About) ─────────────
const FILTER_ID = "about-page-distort";

// ── Stat counter helper ──────────────────────────────────────
function parseStatValue(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: raw };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

// ── Component ────────────────────────────────────────────────
export function AboutClient({
  about: aboutProp,
  experiences: expProp,
}: {
  about: SanityAbout | null;
  experiences: SanityExperience[];
}) {
  const about = aboutProp ?? FALLBACK_ABOUT;
  const experiences = expProp.length > 0 ? expProp : FALLBACK_EXP;

  const portraitSrc = about.portrait
    ? urlFor(about.portrait).width(872).url()
    : "/about-portrait.jpg";

  const bioParagraphs = (about.bio ?? "").split("\n\n").filter(Boolean);

  // ── Refs ─────────────────────────────────────────────────
  const heroRef      = useRef<HTMLElement>(null);
  const h1Ref        = useRef<HTMLHeadingElement>(null);
  const taglineRef   = useRef<HTMLParagraphElement>(null);
  const bioTextRef   = useRef<HTMLDivElement>(null);
  const imgWrapRef   = useRef<HTMLDivElement>(null);
  const distortRef   = useRef<HTMLDivElement>(null);
  const turbRef      = useRef<SVGFETurbulenceElement>(null);
  const dispRef      = useRef<SVGFEDisplacementMapElement>(null);
  const filterVals   = useRef({ scale: 0 });
  const statEls      = useRef<HTMLSpanElement[]>([]);
  const expRowEls    = useRef<HTMLDivElement[]>([]);
  const skillRowEls  = useRef<HTMLDivElement[]>([]);
  const navRef       = useRef<HTMLElement>(null);

  // ── Distortion hover ────────────────────────────────────
  function applyFilter() {
    dispRef.current?.setAttribute("scale", String(filterVals.current.scale));
  }
  function onImgEnter() {
    gsap.to(filterVals.current, { scale: 60, duration: 0.4, ease: "power3.out", onUpdate: applyFilter });
  }
  function onImgMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    if (distortRef.current) distortRef.current.style.clipPath = `circle(50px at ${x}px ${y}px)`;
    const fx = (0.01 + (x / 436) * 0.015).toFixed(4);
    const fy = (0.01 + (y / 614) * 0.015).toFixed(4);
    turbRef.current?.setAttribute("baseFrequency", `${fx} ${fy}`);
  }
  function onImgLeave() {
    gsap.to(filterVals.current, { scale: 0, duration: 0.4, ease: "power3.inOut", onUpdate: applyFilter });
    if (distortRef.current) distortRef.current.style.clipPath = "circle(0px at 50% 50%)";
  }

  // ── Animations ───────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero headline — chars stagger in (matching Hero.tsx)
      if (h1Ref.current) {
        const split = new SplitText(h1Ref.current, { type: "chars" });
        gsap.from(split.chars, {
          opacity: 0, y: 40, duration: 0.8,
          stagger: 0.035, ease: "power3.out", delay: 0.2,
        });
      }
      // 2. Tagline + bio short fade in
      if (taglineRef.current) {
        gsap.from(taglineRef.current, { opacity: 0, y: 20, duration: 0.8, delay: 0.6, ease: "power2.out" });
      }

      // 3. Portrait scroll-in (matches homepage About)
      if (imgWrapRef.current) {
        gsap.from(imgWrapRef.current, {
          x: 80, opacity: 0.5, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger: imgWrapRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }

      // 4. Bio text word hover (matches homepage About)
      if (bioTextRef.current) {
        const split = new SplitText(bioTextRef.current.querySelectorAll("p"), { type: "words" });
        split.words.forEach(word => {
          const w = word as HTMLElement;
          w.style.display = "inline-block";
          w.style.cursor = "default";
          w.addEventListener("mouseenter", () => {
            gsap.to(w, { scale: 1.4, duration: 0.2, ease: "power2.out" });
            gsap.to(split.words.filter(x => x !== w), { opacity: 0.4, duration: 0.2 });
          });
          w.addEventListener("mouseleave", () => {
            gsap.to(w, { scale: 1, duration: 0.2, ease: "power2.in" });
            gsap.to(split.words, { opacity: 1, duration: 0.2 });
          });
        });
      }

      // 5. Stats count-up on scroll
      statEls.current.forEach(el => {
        if (!el) return;
        const raw = el.dataset.value ?? "0";
        const { num, suffix } = parseStatValue(raw);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: num, duration: 1.6, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // 6. Experience rows slide in from left
      expRowEls.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          x: -60, opacity: 0, duration: 0.8, ease: "power2.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });

      // 7. Skills stagger fade in
      skillRowEls.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0, x: -30, duration: 0.6, ease: "power2.out",
          delay: i * 0.06,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      // 8. Nav fade in on scroll (becomes opaque after hero)
      if (navRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "bottom top",
          onEnter:       () => gsap.to(navRef.current, { backgroundColor: "#1f1f1f", duration: 0.3 }),
          onLeaveBack:   () => gsap.to(navRef.current, { backgroundColor: "transparent", duration: 0.3 }),
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hidden SVG distortion filter */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id={FILTER_ID} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="linearRGB">
            <feTurbulence ref={turbRef} type="turbulence" baseFrequency="0" numOctaves="3" seed="2" result="turbulence" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="turbulence" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── Sticky nav ────────────────────────────────────── */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-5"
        style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "transparent", transition: "background-color 0.3s" }}>
        <Link href="/" style={{ ...mono, color: "#fff", textDecoration: "none" }}>H.Studio</Link>
        <Link href="/" className="flex items-center gap-2 text-white"
          style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, textTransform: "uppercase", textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>
      </nav>

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO  (dark, full viewport)
      ════════════════════════════════════════════════════ */}
      <section ref={heroRef}
        className="relative w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh", background: "#1f1f1f", fontFamily: "var(--font-inter), sans-serif" }}>

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 hidden md:block">
          <p style={{ ...mono, color: "#fff", opacity: 0.4 }}>001</p>
        </div>
        <div className="absolute bottom-8 right-8 hidden md:block">
          <p style={{ ...mono, color: "#fff", opacity: 0.4 }}>[ About ]</p>
        </div>

        {/* Thin horizontal rule */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Centered content */}
        <div className="flex flex-col items-center gap-6 px-4 text-center">
          <p style={{ ...mono, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>[ About Me ]</p>

          <h1 ref={h1Ref}
            className="m-0 text-white font-light uppercase about-hero-title"
            style={{ letterSpacing: "-0.04em", lineHeight: 0.88 }}>
            {about.headline}
          </h1>

          <p ref={taglineRef}
            className="m-0 text-white/60 italic"
            style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(18px, 2vw, 28px)", letterSpacing: "0.01em" }}>
            {about.tagline || "Creative Director & Brand Strategist"}
          </p>

          {about.bioShort && (
            <p style={{ ...mono, color: "rgba(255,255,255,0.35)", marginTop: 8, maxWidth: 400 }}>
              {about.bioShort}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p style={{ ...mono, color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.12em" }}>Scroll</p>
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — BIO + PORTRAIT
      ════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#fafafa] px-4 py-12 md:px-8 md:py-[80px]"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── Mobile ── */}
        <div className="flex md:hidden flex-col gap-6">
          <div className="flex items-center justify-between">
            <p style={{ ...mono, color: "#1f1f1f" }}>[ About ]</p>
            <p style={{ ...mono, color: "#1f1f1f" }}>002</p>
          </div>

          {/* Corner-bracket bio */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
            <div className="flex items-start py-3 flex-1">
              <div ref={bioTextRef} style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.56px", color: "#1f1f1f" }}>
                {bioParagraphs.map((p, i) => <p key={i} className="m-0 mb-3 last:mb-0">{p}</p>)}
              </div>
            </div>
            <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
          </div>

          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "422/594" }}>
            <Image src={portraitSrc} alt="Portrait" fill className="object-cover" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {(about.stats ?? []).map((s, i) => (
              <div key={i} className="flex flex-col gap-1 border-t border-black/10 pt-4">
                <span ref={el => { if (el) statEls.current[i] = el; }}
                  data-value={s.value}
                  className="text-[#1f1f1f] font-light"
                  style={{ fontSize: 48, letterSpacing: "-0.06em", lineHeight: 0.9 }}>
                  0
                </span>
                <p style={{ ...mono, color: "#1f1f1f", opacity: 0.5, fontSize: 11 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop ── */}
        <div className="hidden md:flex flex-col gap-[60px]">
          <div className="flex items-start justify-between w-full">
            <p style={{ ...mono, color: "#1f1f1f" }}>[ About ]</p>
            <p style={{ ...mono, color: "#1f1f1f" }}>002</p>
          </div>

          <div className="flex items-start justify-between w-full gap-12">
            {/* Bio text with corner brackets */}
            <div className="flex gap-3 items-stretch shrink-0" style={{ width: 380 }}>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
              <div className="flex items-start py-3 flex-1">
                <div ref={bioTextRef} style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.56px", color: "#1f1f1f" }}>
                  {bioParagraphs.map((p, i) => <p key={i} className="m-0 mb-4 last:mb-0">{p}</p>)}
                </div>
              </div>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
            </div>

            {/* Stats — 2×2 grid */}
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-8 self-end" style={{ maxWidth: 360 }}>
              {(about.stats ?? []).map((s, i) => (
                <div key={i} className="flex flex-col gap-1 border-t border-black/10 pt-4">
                  <span ref={el => { if (el) statEls.current[i] = el; }}
                    data-value={s.value}
                    className="text-[#1f1f1f] font-light"
                    style={{ fontSize: 56, letterSpacing: "-0.06em", lineHeight: 0.9 }}>
                    0
                  </span>
                  <p style={{ ...mono, color: "#1f1f1f", opacity: 0.5, fontSize: 11 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Portrait with distortion hover */}
            <div ref={imgWrapRef}
              className="relative overflow-hidden shrink-0"
              style={{ width: 436, height: 614 }}
              onMouseEnter={onImgEnter}
              onMouseMove={onImgMove}
              onMouseLeave={onImgLeave}>
              <Image src={portraitSrc} alt="Portrait" fill className="object-cover" />
              <div ref={distortRef} className="absolute inset-0"
                style={{ clipPath: "circle(0px at 50% 50%)", filter: `url(#${FILTER_ID})` }}>
                <Image src={portraitSrc} alt="" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — EXPERIENCE  (black)
      ════════════════════════════════════════════════════ */}
      <section className="w-full bg-black px-4 py-12 md:px-8 md:py-[80px] flex flex-col gap-12"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        <div className="flex items-center justify-between">
          <p style={{ ...mono, color: "#fff" }}>[ Experience ]</p>
          <p style={{ ...mono, color: "rgba(255,255,255,0.3)" }}>003</p>
        </div>

        <div className="flex flex-col gap-0">
          {experiences.map((exp, i) => (
            <div key={exp._id}
              ref={el => { if (el) expRowEls.current[i] = el; }}
              className="flex flex-col md:flex-row md:items-start gap-3 md:gap-0 py-8 border-t border-white/10 last:border-b">

              {/* Period */}
              <p className="shrink-0 text-white/40 md:w-[200px]"
                style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, lineHeight: 1.1, margin: 0, textTransform: "uppercase" }}>
                {exp.period}
              </p>

              {/* Role + description */}
              <div className="flex-1 flex flex-col gap-2">
                <p className="m-0 text-white font-bold italic uppercase"
                  style={{ fontSize: 28, letterSpacing: "-0.04em", lineHeight: 1.1,
                    fontFamily: "var(--font-inter), sans-serif" }}>
                  {exp.role}
                </p>
                {exp.description && (
                  <p className="m-0 text-white/50"
                    style={{ fontSize: 14, lineHeight: 1.5, letterSpacing: "-0.56px", maxWidth: 520 }}>
                    {exp.description}
                  </p>
                )}
              </div>

              {/* Company */}
              <p className="shrink-0 text-white/60 md:text-right md:w-[180px]"
                style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, lineHeight: 1.1, margin: 0, textTransform: "uppercase" }}>
                {exp.company}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — SKILLS  (#fafafa)
      ════════════════════════════════════════════════════ */}
      {(about.skills ?? []).length > 0 && (
        <section className="w-full bg-[#fafafa] px-4 py-12 md:px-8 md:py-[80px] flex flex-col gap-12"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}>

          <div className="flex items-center justify-between">
            <p style={{ ...mono, color: "#1f1f1f" }}>[ Expertise ]</p>
            <p style={{ ...mono, color: "#1f1f1f", opacity: 0.3 }}>004</p>
          </div>

          <div className="flex flex-col gap-0">
            {(about.skills ?? []).map((skill, i) => (
              <div key={i}
                ref={el => { if (el) skillRowEls.current[i] = el; }}
                className="group flex items-center justify-between py-5 border-t border-black/10 last:border-b cursor-default"
                onMouseEnter={e => {
                  const row = e.currentTarget;
                  gsap.to(row.querySelector(".skill-name"), { x: 8, duration: 0.25, ease: "power2.out" });
                  gsap.to(row.querySelector(".skill-line"), { scaleX: 1, duration: 0.4, ease: "power2.out" });
                  gsap.to(row.querySelector(".skill-num"), { opacity: 1, duration: 0.25 });
                }}
                onMouseLeave={e => {
                  const row = e.currentTarget;
                  gsap.to(row.querySelector(".skill-name"), { x: 0, duration: 0.25, ease: "power2.in" });
                  gsap.to(row.querySelector(".skill-line"), { scaleX: 0, duration: 0.3, ease: "power2.in" });
                  gsap.to(row.querySelector(".skill-num"), { opacity: 0, duration: 0.2 });
                }}>

                <p className="skill-name m-0 text-[#1f1f1f] font-light uppercase"
                  style={{ fontSize: "clamp(24px, 4vw, 48px)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {skill}
                </p>

                {/* Animated line */}
                <div className="skill-line flex-1 mx-6 h-px origin-left"
                  style={{ background: "#1f1f1f", transform: "scaleX(0)" }} />

                <p className="skill-num m-0 text-[#1f1f1f]/30"
                  style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, opacity: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-4">
            <p className="m-0 font-light text-[#1f1f1f] uppercase section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 0.9 }}>
              Let&apos;s work <em style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}>together</em>
            </p>
            <Link href="/#footer"
              className="flex items-center gap-3 border border-black text-black px-6 py-3 rounded-full w-fit text-[14px] font-medium shrink-0"
              style={{ letterSpacing: "-0.56px", textDecoration: "none" }}>
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
