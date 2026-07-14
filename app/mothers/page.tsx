import { Footer } from "@/app/components/shared/Footer";
import MotherHero from "@/app/components/mother/Hero";
import OnboardingSteps from "@/app/components/mother/OnboardingSteps";
import BenefitsGrid from "@/app/components/mother/BenefitsGrid";
import CheckInsDetail from "@/app/components/mother/CheckInsDetail";
import NutritionSection from "@/app/components/mother/NutritionSection";
import EducationSection from "@/app/components/mother/EducationSection";
import VaccinationSection from "@/app/components/mother/VaccinationSection";
import LanguagesSection from "@/app/components/mother/LanguagesSection";
import WhatsAppSection from "@/app/components/mother/WhatsAppSection";

export default function MothersPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <MotherHero />
      <OnboardingSteps />
      <BenefitsGrid />
      <CheckInsDetail />
      <NutritionSection />
      <EducationSection />
      <VaccinationSection />
      <LanguagesSection />
      <WhatsAppSection />
      <Footer />
    </main>
  );
}
