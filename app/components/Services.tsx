import Image from "next/image";

const mono = { fontFamily: "var(--font-geist-mono), monospace", fontSize: 14, fontWeight: 400, lineHeight: 1.1, color: "#fff", textTransform: "uppercase" as const, letterSpacing: 0, margin: 0 };

const services = [
  { num: "[ 1 ]", title: "Brand Discovery",   desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-brand.jpg" },
  { num: "[ 2 ]", title: "Web design & Dev",   desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-web.jpg" },
  { num: "[ 3 ]", title: "Marketing",          desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-marketing.jpg" },
  { num: "[ 4 ]", title: "Photography",        desc: "Placeholder description of this service. Explain the value you provide and the outcomes clients can expect. Keep it to two or three sentences.", img: "/service-photo.jpg" },
];

export function Services() {
  return (
    <section className="bg-black w-full px-4 py-12 md:px-8 md:py-[80px] flex flex-col gap-8 md:gap-12"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* [ services ] */}
      <p style={mono}>[ services ]</p>

      {/* [4] · DELIVERABLES */}
      <div className="flex items-center justify-between w-full">
        <p className="m-0 text-white font-light uppercase section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 1 }}>[4]</p>
        <p className="m-0 text-white font-light uppercase section-big-text" style={{ letterSpacing: "-0.08em", lineHeight: 1 }}>Deliverables</p>
      </div>

      {/* Service rows */}
      <div className="flex flex-col gap-12 w-full">
        {services.map((s) => (
          <div key={s.num} className="flex flex-col gap-2 w-full">
            <p style={mono}>{s.num}</p>
            <div className="w-full h-px bg-white/20" />
            <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full pt-2 gap-4">
              <p className="m-0 text-white font-bold italic uppercase whitespace-nowrap shrink-0" style={{ fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{s.title}</p>
              {/* Mobile: description then image stacked; Desktop: side by side */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start shrink-0">
                <p className="m-0 text-white text-[14px] leading-[1.3]" style={{ letterSpacing: "-0.56px", maxWidth: 393 }}>{s.desc}</p>
                <div className="relative shrink-0 overflow-hidden" style={{ width: 151, height: 151 }}>
                  <Image src={s.img} alt={s.title} fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
