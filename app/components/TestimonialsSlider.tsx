"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { urlFor, type SanityTestimonial } from "@/lib/sanity";

const GAP = 10;

export function TestimonialsSlider({ testimonials }: { testimonials: SanityTestimonial[] }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // After mount, set all cards to the tallest card's height
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;
    const max = Math.max(...cards.map(c => c.offsetHeight));
    cards.forEach(c => { c.style.height = `${max}px`; });
  }, [testimonials]);

  function onScroll() {
    if (!scrollRef.current) return;
    const slideWidth = scrollRef.current.clientWidth + GAP;
    setActive(Math.round(scrollRef.current.scrollLeft / slideWidth));
  }

  function goTo(i: number) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: i * (scrollRef.current.clientWidth + GAP), behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex w-full overflow-x-auto"
        style={{ gap: GAP, scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {testimonials.map((t, i) => (
          <div key={t._id} className="shrink-0 w-full" style={{ scrollSnapAlign: "start" }}>
            <div
              ref={el => { cardRefs.current[i] = el; }}
              className="bg-[#f1f1f1] border border-[#ddd] rounded p-6 flex flex-col gap-4"
              style={{ minHeight: 150 }}
            >
              <div className="relative" style={{ width: 143, height: 24 }}>
                <Image src={urlFor(t.logo).width(300).url()} alt="" fill className="object-contain object-left" />
              </div>
              <p className="m-0 text-[#1f1f1f] text-[18px] leading-[1.3]" style={{ letterSpacing: "-0.72px" }}>{t.quote}</p>
              <p className="m-0 text-black font-black text-[16px] uppercase mt-auto" style={{ letterSpacing: "-0.64px", lineHeight: 1.1 }}>{t.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-center">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-200"
            style={{ height: 8, width: i === active ? 20 : 8, backgroundColor: i === active ? "#000" : "#ccc" }}
          />
        ))}
      </div>
    </div>
  );
}
