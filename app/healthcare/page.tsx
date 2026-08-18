import { Footer } from "@/app/components/shared/Footer";
import HealthcareHero from "@/app/components/healthcare/Hero";
import FeaturesGrid from "@/app/components/healthcare/FeaturesGrid";
import ReferralFlow from "@/app/components/healthcare/ReferralFlow";
import PatientRecords from "@/app/components/healthcare/PatientRecords";
import EmergencyResponse from "@/app/components/healthcare/EmergencyResponse";
import JoinSection from "@/app/components/healthcare/JoinSection";

export default function HealthcarePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HealthcareHero />
      <FeaturesGrid />
      <ReferralFlow />
      <PatientRecords />
      <EmergencyResponse />
      <JoinSection />
      <Footer />
    </main>
  );
}
