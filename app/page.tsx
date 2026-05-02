import { Hero }           from "./components/Hero";
import { Tagline }        from "./components/Tagline";
import { About }          from "./components/About";
import { FullbleedImage } from "./components/FullbleedImage";
import { Services }       from "./components/Services";
import { Portfolio }      from "./components/Portfolio";
import { Testimonials }   from "./components/Testimonials";
import { News }           from "./components/News";
import { Footer }         from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Tagline />
      <About />
      <FullbleedImage />
      <Services />
      <Portfolio />
      <Testimonials />
      <News />
      <Footer />
    </main>
  );
}
