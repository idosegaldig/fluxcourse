"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor, type SanityProject } from "@/lib/sanity";

gsap.registerPlugin(ScrollTrigger);

function Tag({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 rounded-full text-[#111] text-[14px] font-medium whitespace-nowrap"
      style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.3)", letterSpacing: "-0.56px", fontFamily: "var(--font-inter), sans-serif" }}>
      {label}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 24L24 8M24 8H8M24 8V24" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectCard({ title, tags, image, height }: {
  title: string;
  tags: string[];
  image: SanityProject["image"];
  height: number;
}) {
  const imgRef   = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const imgUrl   = urlFor(image).width(800).url();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image: clip-path reveal from bottom
      gsap.fromTo(
        imgRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Title: slide from left 50px
      gsap.fromTo(
        titleRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div ref={imgRef} className="relative w-full overflow-hidden" style={{ height }}>
        <Image src={imgUrl} alt={title} fill className="object-cover" />
        <div className="absolute bottom-4 left-4 flex gap-3">
          {tags.map(t => <Tag key={t} label={t} />)}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <p ref={titleRef} className="m-0 font-black md:font-bold uppercase whitespace-nowrap text-[24px] md:text-[40px]"
          style={{ letterSpacing: "-0.04em", lineHeight: 1.1, fontFamily: "var(--font-inter), sans-serif", color: "#1f1f1f" }}>
          {title}
        </p>
        <ArrowIcon />
      </div>
    </div>
  );
}
