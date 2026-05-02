"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const monoLabel: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 14, fontWeight: 400, lineHeight: 1.1,
  color: "#1f1f1f", textTransform: "uppercase", margin: 0,
};

export function Tagline() {
  const bigBase: CSSProperties = {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 300, color: "#000", textTransform: "uppercase",
    whiteSpace: "nowrap", margin: 0,
  };

  const sectionRef  = useRef<HTMLElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !textRef.current) return;

      // Split all text elements inside the container into chars
      const split = new SplitText(textRef.current.querySelectorAll("p"), {
        type: "chars",
      });

      // Set initial opacity on all chars
      gsap.set(split.chars, { opacity: 0.2 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      }).to(split.chars, {
        opacity: 1,
        stagger: { each: 0.04, from: "start" },
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#fafafa] px-4 py-12 md:px-8 md:py-[120px]">
      <div ref={textRef} className="flex flex-col gap-6 w-full">

        {/* Header */}
        <div className="flex flex-col gap-3 items-end w-full">
          <p className="m-0 text-right w-full" style={monoLabel}>[ 8+ years in industry ]</p>
          <div className="w-full h-px bg-[#1f1f1f]" />
        </div>

        {/* ── Mobile: centered, no indents ── */}
        <div className="flex md:hidden flex-col items-center gap-2 w-full">
          <p style={monoLabel}>001</p>
          {["A creative director /", "Photographer", "Born & raised", "on the south side", "of chicago."].map((line) => (
            <p key={line} className="m-0 section-big-text text-center" style={bigBase}>{line}</p>
          ))}
          <p style={monoLabel}>[ creative freelancer ]</p>
        </div>

        {/* ── Desktop: staggered indents ── */}
        <div className="hidden md:flex flex-col w-full" style={{ gap: 8 }}>
          <div className="flex items-start gap-3">
            <p className="m-0 section-big-text" style={bigBase}>{`A creative director   /`}</p>
            <p className="m-0 mt-1 shrink-0" style={monoLabel}>001</p>
          </div>
          <div style={{ paddingLeft: "15.55%" }}>
            <p className="m-0 section-big-text" style={bigBase}>Photographer</p>
          </div>
          <div style={{ paddingLeft: "44.33%" }}>
            <p className="m-0 section-big-text" style={bigBase}>
              Born{" "}
              <em style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.04em" }}>&amp;</em>
              {" "}raised
            </p>
          </div>
          <div><p className="m-0 section-big-text" style={bigBase}>on the south side</p></div>
          <div className="relative w-full" style={{ paddingLeft: "44.04%" }}>
            <p className="m-0 section-big-text" style={bigBase}>of chicago.</p>
            <p className="absolute top-[26px] m-0" style={{ ...monoLabel, left: "78.41%" }}>[ creative freelancer ]</p>
          </div>
        </div>

      </div>
    </section>
  );
}
