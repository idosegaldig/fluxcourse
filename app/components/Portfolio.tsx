import Image from "next/image";
import { getProjects, urlFor, type SanityProject } from "@/lib/sanity";

const mono = { fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, fontWeight: 400, lineHeight: 1.1, color: "#1f1f1f", textTransform: "uppercase" as const, margin: 0 };

function ArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 24L24 8M24 8H8M24 8V24" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 rounded-full text-[#111] text-[14px] font-medium whitespace-nowrap"
      style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.3)", letterSpacing: "-0.56px", fontFamily: "var(--font-inter), sans-serif" }}>
      {label}
    </span>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const b: Record<string, object> = {
    tl: { borderTop: "1px solid #1f1f1f", borderLeft: "1px solid #1f1f1f" },
    tr: { borderTop: "1px solid #1f1f1f", borderRight: "1px solid #1f1f1f" },
    bl: { borderBottom: "1px solid #1f1f1f", borderLeft: "1px solid #1f1f1f" },
    br: { borderBottom: "1px solid #1f1f1f", borderRight: "1px solid #1f1f1f" },
  };
  return <div style={{ width: 14, height: 14, flexShrink: 0, ...b[pos] }} />;
}

function ProjectCard({ title, tags, image, height }: { title: string; tags: string[]; image: SanityProject['image']; height: number }) {
  const imgUrl = urlFor(image).width(800).url()
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="relative w-full overflow-hidden" style={{ height }}>
        <Image src={imgUrl} alt={title} fill className="object-cover" />
        <div className="absolute bottom-4 left-4 flex gap-3">
          {tags.map(t => <Tag key={t} label={t} />)}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <p className="m-0 font-bold uppercase whitespace-nowrap"
          style={{ fontSize: 40, letterSpacing: "-0.04em", lineHeight: 1.1, fontFamily: "var(--font-inter), sans-serif", color: "#1f1f1f" }}>{title}</p>
        <ArrowIcon />
      </div>
    </div>
  );
}

const desktopHeights: Record<number, { left: number; right: number }> = {
  0: { left: 744, right: 0 },
  1: { left: 699, right: 0 },
  2: { left: 0,   right: 699 },
  3: { left: 0,   right: 744 },
};

export async function Portfolio() {
  const projects = await getProjects();

  const leftProjects  = projects.filter((_, i) => desktopHeights[i]?.left  > 0);
  const rightProjects = projects.filter((_, i) => desktopHeights[i]?.right > 0);

  return (
    <section className="w-full bg-[#fafafa] px-4 py-12 md:px-8 md:py-[80px]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div className="flex flex-col gap-5 md:gap-[20px] w-full">

        {/* Header */}
        <div className="flex items-start justify-between w-full uppercase whitespace-nowrap">
          <div>
            <p style={mono}>[ portfolio ]</p>
            <div className="flex gap-[10px] items-start mt-2">
              <div style={{ lineHeight: 0 }}>
                <p className="m-0 font-light text-black section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 0.86 }}>Selected</p>
                <p className="m-0 font-light text-black section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 0.86 }}>Work</p>
              </div>
              <p style={mono}>004</p>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center" style={{ width: 15, height: 110 }}>
            <p className="m-0" style={{ ...mono, transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>[ portfolio ]</p>
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex md:hidden flex-col gap-6 w-full">
          {projects.map(p => (
            <ProjectCard key={p._id} title={p.title} tags={p.tags} image={p.image} height={390} />
          ))}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
            <div className="flex flex-col gap-[10px] flex-1 py-3">
              <p className="m-0 text-[#1f1f1f] text-[14px] italic leading-[1.3]" style={{ letterSpacing: "-0.56px" }}>
                Discover how my creativity transforms ideas into impactful digital experiences — schedule a call with me to get started.
              </p>
              <button className="w-fit bg-black text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer" style={{ letterSpacing: "-0.56px" }}>
                Let&apos;s talk
              </button>
            </div>
            <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
          </div>
        </div>

        {/* Desktop: 2-col staggered */}
        <div className="hidden md:flex gap-6 items-end w-full">
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: "calc(80px + 10vh)" }}>
            {leftProjects.map((p, i) => (
              <ProjectCard key={p._id} title={p.title} tags={p.tags} image={p.image} height={desktopHeights[i]?.left ?? 699} />
            ))}
            <div className="flex gap-3 items-stretch" style={{ width: 465 }}>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tl" /><Corner pos="bl" /></div>
              <div className="flex flex-col gap-[10px] flex-1 py-3">
                <p className="m-0 text-[#1f1f1f] text-[14px] italic leading-[1.3]" style={{ letterSpacing: "-0.56px" }}>
                  Discover how my creativity transforms ideas into impactful digital experiences — schedule a call with me to get started.
                </p>
                <button className="w-fit bg-black text-white text-[14px] font-medium px-4 py-3 rounded-[24px] cursor-pointer" style={{ letterSpacing: "-0.56px" }}>
                  Let&apos;s talk
                </button>
              </div>
              <div className="flex flex-col justify-between w-4 shrink-0"><Corner pos="tr" /><Corner pos="br" /></div>
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0 pt-[240px]" style={{ gap: "calc(160px + 10vh)" }}>
            {rightProjects.map((p, i) => (
              <ProjectCard key={p._id} title={p.title} tags={p.tags} image={p.image} height={desktopHeights[i + 2]?.right ?? 699} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
