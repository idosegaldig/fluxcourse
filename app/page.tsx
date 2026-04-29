import { Hero }         from "./components/Hero";
import { Tagline }      from "./components/Tagline";
import { About }        from "./components/About";
import { Services }     from "./components/Services";
import { Portfolio }    from "./components/Portfolio";
import { Testimonials } from "./components/Testimonials";
import { News }         from "./components/News";
import { Footer }       from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Tagline />
      <About />
      {/* Full-bleed image break — 565px mobile, 900px desktop */}
      <div className="w-full relative overflow-hidden h-[565px] md:h-[900px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fullbleed-bg.png" alt="" className="w-full h-full object-cover object-center pointer-events-none" />
      </div>
      <Services />
      <Portfolio />
      <Testimonials />
      <News />
      <Footer />
    </main>
  );
}
