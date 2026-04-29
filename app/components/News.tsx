import Image from "next/image";

// Mobile: heading inline (not rotated), articles scroll horizontally
// Desktop: rotated heading left, 3-col articles right

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const articles = [
  { img: "/news-1.jpg", offset: false },
  { img: "/news-2.jpg", offset: true  },
  { img: "/news-3.jpg", offset: false },
];

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export function News() {
  return (
    <section className="w-full bg-[#f3f3f3]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-8 px-4 py-16">
        {/* Heading */}
        <div style={{ lineHeight: 0 }}>
          <p className="m-0 font-light text-black uppercase news-heading">Keep up with my latest</p>
          <p className="m-0 font-light text-black uppercase news-heading">news &amp; achievements</p>
        </div>
        {/* Articles — horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollSnapType: "x mandatory" }}>
          {articles.map((a, i) => (
            <div key={i} className="flex flex-col gap-4 shrink-0" style={{ width: 300, scrollSnapAlign: "start" }}>
              <div className="relative overflow-hidden" style={{ width: 300, height: 398 }}>
                <Image src={a.img} alt="" fill className="object-cover" />
              </div>
              <p className="m-0 text-[#1f1f1f] text-[14px] leading-[1.3]" style={{ letterSpacing: "-0.56px" }}>{lorem}</p>
              <div className="flex gap-[10px] items-center border-b border-black pb-1 w-fit">
                <span className="text-black text-[14px] font-medium" style={{ letterSpacing: "-0.56px" }}>Read more</span>
                <ArrowIcon />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex items-end justify-between px-8 py-[120px]">
        {/* Rotated heading */}
        <div className="flex items-center justify-center shrink-0" style={{ width: 110, height: 706 }}>
          <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
            <div style={{ lineHeight: 0 }}>
              <p className="m-0 font-light text-black uppercase news-heading">Keep up with my latest</p>
              <p className="m-0 font-light text-black uppercase news-heading">news &amp; achievements</p>
            </div>
          </div>
        </div>
        {/* 3 columns */}
        <div className="flex items-start gap-8" style={{ width: 1020, transform: "translateX(-10%)" }}>
          {articles.map((a, i) => (
            <div key={i} className="flex flex-col gap-4 flex-1 min-w-0"
              style={{ paddingTop: a.offset ? 120 : 0, height: a.offset ? undefined : 581 }}>
              <div className="relative w-full overflow-hidden" style={{ height: 469 }}>
                <Image src={a.img} alt="" fill className="object-cover" />
              </div>
              <p className="m-0 flex-1 text-[#1f1f1f] text-[14px] leading-[1.3]" style={{ letterSpacing: "-0.56px" }}>{lorem}</p>
              <div className="flex gap-[10px] items-center border-b border-black pb-1 w-fit">
                <span className="text-black text-[14px] font-medium" style={{ letterSpacing: "-0.56px", lineHeight: 1 }}>Read more</span>
                <ArrowIcon />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
