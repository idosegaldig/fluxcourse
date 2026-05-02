import { getAboutPage, getExperiences } from "@/lib/sanity";
import { AboutClient } from "../components/AboutPage";
import { Footer } from "../components/Footer";

export const metadata = {
  title: "About — H.Studio",
  description: "Creative Director & Brand Strategist",
};

export default async function AboutPage() {
  const [about, experiences] = await Promise.all([
    getAboutPage(),
    getExperiences(),
  ]);

  return (
    <main>
      <AboutClient about={about} experiences={experiences} />
      <Footer />
    </main>
  );
}
