"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FullbleedImage() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { clipPath: "circle(100px at 50% 50%)" },
        {
          clipPath: "circle(150% at 50% 50%)",
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="w-full relative overflow-hidden h-[565px] md:h-[900px]"
      style={{ clipPath: "circle(100px at 50% 50%)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/fullbleed-bg.png" alt="" className="w-full h-full object-cover object-center pointer-events-none" />
    </div>
  );
}
