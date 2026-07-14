import { Footer } from "@/app/components/shared/Footer";
import { FAQSection } from "@/app/components/shared/FAQSection";
import { AuthGate } from "@/app/components/shared/AuthGate";
import HomeHero from "@/app/components/home/Hero";
import ProblemSection from "@/app/components/home/ProblemSection";
import StatsSection from "@/app/components/home/StatsSection";
import HowItWorksSection from "@/app/components/home/HowItWorksSection";
import TechnologySection from "@/app/components/home/TechnologySection";
import PartnersTeaser from "@/app/components/home/PartnersTeaser";
import { homeFaqs } from "@/lib/data/home-faq";

export default function Home() {
  return (
    <AuthGate>
      <main className="flex flex-col min-h-screen">
        <HomeHero />
        <ProblemSection />
        <StatsSection />
        <HowItWorksSection />
        <TechnologySection />
        <PartnersTeaser />
        <FAQSection items={homeFaqs} description="Find answers about MamaConnect, how it works, and how to get started." />
        <Footer />
      </main>
    </AuthGate>
  );
}
