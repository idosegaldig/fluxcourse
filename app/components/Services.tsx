"use client";
import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const mono = { fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, fontWeight: 400, lineHeight: 1.1, color: "#fff", textTransform: "uppercase" as const, letterSpacing: 0, margin: 0 };

const services = [
  { num: "[ 1 ]", title: "Brand Discovery",  desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-brand.jpg" },
  { num: "[ 2 ]", title: "Web design & Dev", desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-web.jpg" },
  { num: "[ 3 ]", title: "Marketing",        desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-marketing.jpg" },
  { num: "[ 4 ]", title: "Photography",      desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-photo.jpg" },
];

// Custom cursor size
const CURSOR_SIZE = 120;

function ServiceRow({ s, cursorRef }: {
  s: typeof services[0];
  cursorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);
  const rowRef   = useRef<HTMLDivElement>(null);
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null);

  useEffect(() => {
    if (!descRef.current) return;
    // Create split once — never revert, no flash
    splitRef.current = new SplitText(descRef.current, { type: "words" });
    // Start words visible so no flash on initial render
    gsap.set(splitRef.current.words, { opacity: 1, y: 0 });
    return () => { splitRef.current?.revert(); };
  }, []);

  const onEnter = useCallback(() => {
    gsap.to(rowRef.current,   { backgroundColor: "#2e2e2e", duration: 0.3, ease: "power2.out" });
    gsap.to(titleRef.current, { scale: 1.2, duration: 0.3, ease: "power2.out", transformOrigin: "left center" });

    if (cursorRef.current) {
      cursorRef.current.style.backgroundImage = `url(${s.img})`;
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    }

    if (splitRef.current) {
      gsap.killTweensOf(splitRef.current.words);
      gsap.fromTo(splitRef.current.words,
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [s.img, cursorRef]);

  const onLeave = useCallback(() => {
    gsap.to(rowRef.current,   { backgroundColor: "#000000", duration: 0.3, ease: "power2.in" });
    gsap.to(titleRef.current, { scale: 1, duration: 0.3, ease: "power2.in" });
    gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
    // Keep words visible — no DOM change = no flash
    if (splitRef.current) gsap.killTweensOf(splitRef.current.words);
  }, [cursorRef]);

  return (
    <div ref={rowRef} className="flex flex-col gap-2 w-full cursor-none"
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <p style={mono}>{s.num}</p>
      <div className="w-full h-px bg-white/20" />
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full pt-2 gap-4">
        <p ref={titleRef} className="m-0 text-white font-bold italic uppercase whitespace-nowrap shrink-0"
          style={{ fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1.1, transformOrigin: "left center" }}>
          {s.title}
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start w-full md:w-auto md:shrink-0">
          <p ref={descRef} className="m-0 text-white text-[14px] leading-[1.3]"
            style={{ letterSpacing: "-0.56px", maxWidth: 393 }}>
            {s.desc}
          </p>
          {/* Mobile image */}
          <div className="relative w-full overflow-hidden md:hidden" style={{ height: 151 }}>
            <Image src={s.img} alt={s.title} fill className="object-cover" />
          </div>
          {/* Desktop image */}
          <div className="relative hidden md:block shrink-0 overflow-hidden" style={{ width: 151, height: 151 }}>
            <Image src={s.img} alt={s.title} fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Init cursor hidden
    gsap.set(cursorRef.current, { scale: 0, opacity: 0 });

    const onMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      gsap.set(cursorRef.current, {
        x: e.clientX - CURSOR_SIZE / 2,
        y: e.clientY - CURSOR_SIZE / 2,
      });
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="services" ref={sectionRef} className="bg-black w-full px-4 py-12 md:px-8 md:py-[80px] flex flex-col gap-8 md:gap-12 relative"
      style={{ fontFamily: "var(--font-inter), sans-serif", cursor: "none" }}>

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full overflow-hidden"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          top: 0, left: 0,
          border: "2px solid white",
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />

      <p style={mono}>[ services ]</p>

      <div className="flex items-center justify-between w-full">
        <p className="m-0 text-white font-light uppercase section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 1 }}>[4]</p>
        <p className="m-0 text-white font-light uppercase section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 1 }}>Deliverables</p>
      </div>

      <div className="flex flex-col gap-12 w-full">
        {services.map((s) => (
          <ServiceRow key={s.num} s={s} cursorRef={cursorRef} />
        ))}
      </div>

    </section>
  );
}
