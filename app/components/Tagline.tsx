import type { CSSProperties } from "react";

// Mobile: centered, no stagger, 32px  |  Desktop: staggered, 6.67vw (.section-big-text)

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

  return (
    <section className="w-full bg-[#fafafa] px-4 py-12 md:px-8 md:py-[120px]">
      <div className="flex flex-col gap-6 w-full">

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
