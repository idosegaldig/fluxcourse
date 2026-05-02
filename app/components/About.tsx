"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const monoLabel: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 14, fontWeight: 400, lineHeight: 1.1,
  color: "#1f1f1f", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0,
};

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: CSSProperties = { width: 14, height: 14, flexShrink: 0 };
  const borders: Record<string, CSSProperties> = {
    tl: { borderTop: "1px solid #1f1f1f", borderLeft: "1px solid #1f1f1f" },
    tr: { borderTop: "1px solid #1f1f1f", borderRight: "1px solid #1f1f1f" },
    bl: { borderBottom: "1px solid #1f1f1f", borderLeft: "1px solid #1f1f1f" },
    br: { borderBottom: "1px solid #1f1f1f", borderRight: "1px solid #1f1f1f" },
  };
  return <div style={{ ...base, ...borders[pos] }} />;
}

const bodyText = "Placeholder paragraph one. This is where you introduce yourself — your background, your passion for your craft, and what drives you creatively. Two to three sentences work best here. Placeholder paragraph two. Here you can describe your technical approach, how you collaborate with clients, or what sets your work apart from others in your field.";

const FILTER_ID = "about-distort";

export function About() {
  const sectionRef     = useRef<HTMLElement>(null);
  const imgWrapRef     = useRef<HTMLDivElement>(null);
  const distortRef     = useRef<HTMLDivElement>(null); // clipped distortion layer
  const textRef        = useRef<HTMLParagraphElement>(null);
  const turbRef        = useRef<SVGFETurbulenceElement>(null);
  const dispRef        = useRef<SVGFEDisplacementMapElement>(null);
  const filterVals     = useRef({ scale: 0 });

  function applyFilter() {
    dispRef.current?.setAttribute("scale", String(filterVals.current.scale));
  }

  function onImgMouseEnter() {
    gsap.to(filterVals.current, { scale: 60, duration: 0.4, ease: "power3.out", onUpdate: applyFilter });
  }

  function onImgMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    // Move distortion circle to cursor
    if (distortRef.current) {
      distortRef.current.style.clipPath = `circle(50px at ${x}px ${y}px)`;
    }
    // Shift turbulence frequency based on position for directional warp
    const fx = (0.01 + (x / 436) * 0.015).toFixed(4);
    const fy = (0.01 + (y / 614) * 0.015).toFixed(4);
    turbRef.current?.setAttribute("baseFrequency", `${fx} ${fy}`);
  }

  function onImgMouseLeave() {
    gsap.to(filterVals.current, { scale: 0, duration: 0.4, ease: "power3.inOut", onUpdate: applyFilter });
    if (distortRef.current) distortRef.current.style.clipPath = "circle(0px at 50% 50%)";
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image scroll-in
      if (imgWrapRef.current) {
        gsap.from(imgWrapRef.current, {
          x: 80, opacity: 0.5, duration: 1, ease: "power2.out",
          scrollTrigger: {
            trigger: imgWrapRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Word hover
      if (textRef.current) {
        const split = new SplitText(textRef.current, { type: "words" });
        split.words.forEach((word) => {
          const w = word as HTMLElement;
          w.style.display = "inline-block";
          w.style.cursor = "default";
          word.addEventListener("mouseenter", () => {
            gsap.to(word, { scale: 1.5, duration: 0.2, ease: "power2.out" });
            gsap.to(split.words.filter(w => w !== word), { opacity: 0.5, duration: 0.2 });
          });
          word.addEventListener("mouseleave", () => {
            gsap.to(word, { scale: 1, duration: 0.2, ease: "power2.in" });
            gsap.to(split.words, { opacity: 1, duration: 0.2 });
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 py-12 md:px-8 md:py-[80px] bg-[#fafafa]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* SVG distortion filter — hidden, referenced by id */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id={FILTER_ID} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="linearRGB">
            <feTurbulence ref={turbRef} type="turbulence" baseFrequency="0" numOctaves="3" seed="2" result="turbulence" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="turbulence" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-5 w-full">
        <p style={monoLabel}>002</p>
        <p style={monoLabel}>[ About ]</p>
        <div className="flex gap-3 items-stretch w-full">
          <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
          <div className="flex items-center py-3 flex-1">
            <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.56px", color: "#1f1f1f", margin: 0 }}>{bodyText}</p>
          </div>
          <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
        </div>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "422/594" }}>
          <Image src="/about-portrait.jpg" alt="About portrait" fill className="object-cover" />
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex items-start justify-between w-full">
        <p style={monoLabel}>[ About ]</p>
        <div className="flex items-end justify-between shrink-0" style={{ width: "71.44%" }}>
          {/* Text block */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-3 items-stretch shrink-0" style={{ width: 372 }}>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
              <div className="flex items-center py-3 flex-1">
                <p ref={textRef} style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.56px", color: "#1f1f1f", margin: 0 }}>{bodyText}</p>
              </div>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
            </div>
          </div>
          {/* Portrait — distortion hover */}
          <div className="flex gap-6 items-start shrink-0">
            <p style={monoLabel}>002</p>
            <div
              ref={imgWrapRef}
              className="relative overflow-hidden shrink-0"
              style={{ width: 436, height: 614 }}
              onMouseEnter={onImgMouseEnter}
              onMouseMove={onImgMouseMove}
              onMouseLeave={onImgMouseLeave}
            >
              {/* Base layer — always normal */}
              <Image src="/about-portrait.jpg" alt="About portrait" fill className="object-cover" />
              {/* Distorted layer — clipped to 50px circle around cursor */}
              <div
                ref={distortRef}
                className="absolute inset-0"
                style={{ clipPath: "circle(0px at 50% 50%)", filter: `url(#${FILTER_ID})` }}
              >
                <Image src="/about-portrait.jpg" alt="" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
