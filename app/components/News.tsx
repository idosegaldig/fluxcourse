"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const articles = [
  { img: "/news-1.jpg" },
  { img: "/news-2.jpg" },
  { img: "/news-3.jpg" },
];
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const CARD_W  = 300;
const CARD_H  = 398;
const GAP     = 50;
const SLIDE_W = CARD_W + GAP;
const SCALE   = 1.2;
const n       = articles.length;
const wrap    = (i: number) => ((i % n) + n) % n;

// 5-slot layout (translateX values):
// [-SLIDE_W]  [0]  [SLIDE_W]  [2×SLIDE_W]  [3×SLIDE_W]
//  left-buf   left   CENTER    right        right-buf
// Viewport clips at 0 → 3×SLIDE_W–GAP, showing left/center/right

const INIT_X        = [-SLIDE_W, 0, SLIDE_W, 2 * SLIDE_W, 3 * SLIDE_W];
const INIT_ARTICLES = [wrap(-2), wrap(-1), 0, wrap(1), wrap(2)];

function NavBtn({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={dir}
      className="flex items-center justify-center rounded-full bg-black shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
      style={{ width: 44, height: 44 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        {dir === "prev"
          ? <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M9 18l6-6-6-6"   stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      </svg>
    </button>
  );
}

function Slider() {
  const [counter, setCounter] = useState(1);
  const animating = useRef(false);

  // All state managed imperatively — zero React re-renders for content
  const slotX       = useRef([...INIT_X]);
  const slotArticle = useRef([...INIT_ARTICLES]);
  const slotDivs    = useRef<HTMLDivElement[]>([]);
  const imgDivs     = useRef<HTMLDivElement[]>([]);
  const imgEls      = useRef<HTMLImageElement[]>([]);
  const textDivs    = useRef<HTMLDivElement[]>([]);
  const readMoreEls = useRef<HTMLSpanElement[]>([]);

  // Scale overflow that pushes text down on the center card
  const TEXT_OFFSET = Math.round(CARD_H * (SCALE - 1) / 2); // 40px

  useEffect(() => {
    articles.forEach(a => { const i = new window.Image(); i.src = a.img; }); // preload
    slotDivs.current.forEach((div, i) => {
      gsap.set(div, { x: INIT_X[i] });
      gsap.set(imgDivs.current[i], { scale: INIT_X[i] === SLIDE_W ? SCALE : 1 });
    });
    const initCenter = INIT_X.indexOf(SLIDE_W);
    gsap.set(textDivs.current[initCenter], { marginTop: 14 + TEXT_OFFSET });
    if (readMoreEls.current[initCenter]) {
      readMoreEls.current[initCenter].style.fontSize = "17px";
      readMoreEls.current[initCenter].style.fontWeight = "700";
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useCallback((dir: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;

    const nextX = slotX.current.map(x => x - dir * SLIDE_W);

    // Slot that exits visible range
    const exitSlot = nextX.findIndex(x =>
      dir === 1 ? x <= -SLIDE_W - 1 : x >= 3 * SLIDE_W + 1
    );
    const newCenterSlot = nextX.indexOf(SLIDE_W);
    const curCenterSlot = slotX.current.indexOf(SLIDE_W);

    const tl = gsap.timeline({
      onComplete: () => {
        // Teleport off-screen slot to opposite buffer
        const teleportX = dir === 1 ? 3 * SLIDE_W : -SLIDE_W;
        gsap.set(slotDivs.current[exitSlot], { x: teleportX });
        nextX[exitSlot] = teleportX;
        slotX.current = [...nextX];

        // Update article of teleported slot (it's off-screen, no flash)
        const newCenterArticle = slotArticle.current[newCenterSlot];
        const teleportArticle  = dir === 1
          ? wrap(newCenterArticle + 2)
          : wrap(newCenterArticle - 2);

        if (slotArticle.current[exitSlot] !== teleportArticle) {
          slotArticle.current[exitSlot] = teleportArticle;
          imgEls.current[exitSlot].src  = articles[teleportArticle].img;
        }

        readMoreEls.current[curCenterSlot].style.fontSize = "14px";
        readMoreEls.current[curCenterSlot].style.fontWeight = "500";
        readMoreEls.current[newCenterSlot].style.fontSize = "17px";
        readMoreEls.current[newCenterSlot].style.fontWeight = "700";
        setCounter(newCenterArticle + 1);
        animating.current = false;
      },
    });

    slotDivs.current.forEach((div, i) =>
      tl.to(div, { x: nextX[i], duration: 0.4, ease: "power2.inOut" }, 0)
    );
    tl.to(imgDivs.current[curCenterSlot], { scale: 1,     duration: 0.4, ease: "power2.inOut" }, 0);
    tl.to(imgDivs.current[newCenterSlot], { scale: SCALE, duration: 0.4, ease: "power2.inOut" }, 0);
    tl.to(textDivs.current[curCenterSlot], { marginTop: 14,                duration: 0.4, ease: "power2.inOut" }, 0);
    tl.to(textDivs.current[newCenterSlot], { marginTop: 14 + TEXT_OFFSET,  duration: 0.4, ease: "power2.inOut" }, 0);
  }, []);

  const viewW = 3 * CARD_W + 2 * GAP; // 1000px — shows exactly 3 cards

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, color: "#1f1f1f", margin: 0 }}>
          {String(counter).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
        <div className="flex gap-3">
          <NavBtn dir="prev" onClick={() => navigate(1)} />
          <NavBtn dir="next" onClick={() => navigate(-1)} />
        </div>
      </div>

      {/* TOP = room for upward scale overflow; container tall enough to show text */}
      <div style={{ width: viewW, overflowX: "hidden", overflowY: "visible", position: "relative",
        height: Math.round(CARD_H * (SCALE - 1) / 2) + Math.round(CARD_H * SCALE) + 100 }}>
        {[0, 1, 2, 3, 4].map(slot => (
          <div key={slot} ref={el => { if (el) slotDivs.current[slot] = el; }}
            style={{ position: "absolute", top: Math.round(CARD_H * (SCALE - 1) / 2), left: 0, width: CARD_W }}>

            {/* Image — scales from center so all image-centers align at the same Y */}
            <div ref={el => { if (el) imgDivs.current[slot] = el; }}
              style={{ transformOrigin: "center center", willChange: "transform" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={el => { if (el) imgEls.current[slot] = el; }}
                src={articles[INIT_ARTICLES[slot]].img} alt=""
                style={{ width: CARD_W, height: CARD_H, objectFit: "cover", display: "block" }} />
            </div>

            {/* Text — stays at normal scale */}
            <div ref={el => { if (el) textDivs.current[slot] = el; }} style={{ marginTop: 14 }}>
              <p className="m-0 text-[#1f1f1f] text-[14px] leading-[1.3]"
                style={{ letterSpacing: "-0.56px", marginBottom: 10 }}>{lorem}</p>
              <div className="flex gap-2 items-center border-b border-black pb-1 w-fit">
                <span ref={el => { if (el) readMoreEls.current[slot] = el; }} className="text-black text-[14px] font-medium" style={{ letterSpacing: "-0.56px" }}>Read more</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function News() {
  return (
    <section id="news" className="w-full bg-[#f3f3f3]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* Mobile */}
      <div className="flex md:hidden flex-col gap-8 px-4 py-16">
        <p className="m-0 font-light text-black uppercase news-heading" style={{ lineHeight: 0.86 }}>
          Keep up with my latest news &amp; achievements
        </p>
        <Slider />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-start px-8 py-[120px]" style={{ gap: 50 }}>
        <div className="flex flex-col gap-6 shrink-0" style={{ width: "40%" }}>
          <p className="m-0 uppercase" style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 14, fontWeight: 400, lineHeight: 1.1, color: "#1f1f1f", letterSpacing: 0,
          }}>[ news ]</p>
          <div style={{ lineHeight: 0 }}>
            <p className="m-0 font-light text-black uppercase news-heading">Keep up with my latest</p>
            <p className="m-0 font-light text-black uppercase news-heading">news &amp; achievements</p>
          </div>
        </div>
        <div className="flex-1"><Slider /></div>
      </div>

    </section>
  );
}
