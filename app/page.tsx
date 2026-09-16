import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FormatsMarquee } from "@/components/site/FormatsMarquee";
import { VoiceSection } from "@/components/site/VoiceSection";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ScrollExperience } from "@/components/site/ScrollExperience";
import { ToolSection } from "@/components/site/ToolSection";

export default function Home() {
  return (
    <>
      <ScrollExperience />
      <div className="reading-progress" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FormatsMarquee />
        <VoiceSection />
        <ToolSection />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
