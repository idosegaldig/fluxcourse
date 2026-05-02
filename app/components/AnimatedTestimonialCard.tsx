"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor, type SanityTestimonial } from "@/lib/sanity";

gsap.registerPlugin(ScrollTrigger);

export function AnimatedTestimonialCard({ t, logoW, logoH, rotate, style }: {
  t: SanityTestimonial;
  logoW: number;
  logoH: number;
  rotate: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const logoUrl = urlFor(t.logo).width(300).url();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.1, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="absolute" style={{ ...style, transform: `rotate(${rotate})` }}>
      <div className="bg-[#f1f1f1] border border-[#ddd] rounded p-6 flex flex-col gap-4" style={{ width: 353 }}>
        <div className="relative" style={{ width: logoW, height: logoH }}>
          <Image src={logoUrl} alt="" fill className="object-contain object-left" />
        </div>
        <p className="m-0 text-[#1f1f1f] text-[18px] leading-[1.3]" style={{ letterSpacing: "-0.72px" }}>{t.quote}</p>
        <p className="m-0 text-black font-black text-[16px] uppercase" style={{ letterSpacing: "-0.64px", lineHeight: 1.1 }}>{t.name}</p>
      </div>
    </div>
  );
}
