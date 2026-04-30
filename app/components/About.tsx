import Image from "next/image";
import type { CSSProperties } from "react";

// Mobile: vertical stack (labels → text → image)
// Desktop: [ About ] left | right block with text + portrait

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

export function About() {
  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-[80px] bg-[#fafafa]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Mobile: stacked layout ── */}
      <div className="flex md:hidden flex-col gap-5 w-full">
        <p style={monoLabel}>002</p>
        <p style={monoLabel}>[ About ]</p>
        {/* Text with brackets */}
        <div className="flex gap-3 items-stretch w-full">
          <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
          <div className="flex items-center py-3 flex-1">
            <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.56px", color: "#1f1f1f", margin: 0 }}>{bodyText}</p>
          </div>
          <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
        </div>
        {/* Full-width image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "422/594" }}>
          <Image src="/about-portrait.jpg" alt="About portrait" fill className="object-cover" />
        </div>
      </div>

      {/* ── Desktop: side-by-side layout ── */}
      <div className="hidden md:flex items-start justify-between w-full">
        <p style={monoLabel}>[ About ]</p>
        <div className="flex items-end justify-between shrink-0" style={{ width: "71.44%" }}>
          {/* Centered text block */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-3 items-stretch shrink-0" style={{ width: 372 }}>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
              <div className="flex items-center py-3 flex-1">
                <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.56px", color: "#1f1f1f", margin: 0 }}>{bodyText}</p>
              </div>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
            </div>
          </div>
          {/* Portrait */}
          <div className="flex gap-6 items-start shrink-0">
            <p style={monoLabel}>002</p>
            <div className="relative overflow-hidden shrink-0" style={{ width: 436, height: 614 }}>
              <Image src="/about-portrait.jpg" alt="About portrait" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
