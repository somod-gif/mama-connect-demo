import { Footer } from "@/app/components/shared/Footer";
import { FAQSection } from "@/app/components/shared/FAQSection";
import ChewHero from "@/app/components/chew/Hero";
import DashboardPreview from "@/app/components/chew/DashboardPreview";
import AssignedMothersSection from "@/app/components/chew/AssignedMothersSection";
import RiskAlertsSection from "@/app/components/chew/RiskAlertsSection";
import ReferralFlowSection from "@/app/components/chew/ReferralFlowSection";
import PatientManagementSection from "@/app/components/chew/PatientManagementSection";
import ReportsSection from "@/app/components/chew/ReportsSection";
import JoinSection from "@/app/components/chew/JoinSection";
import { chewFaqs } from "@/lib/data/chew-faq";

export default function ChewLanding() {
  return (
    <main className="flex flex-col min-h-screen">
      <ChewHero />
      <DashboardPreview />
      <AssignedMothersSection />
      <RiskAlertsSection />
      <ReferralFlowSection />
      <PatientManagementSection />
      <ReportsSection />
      <FAQSection
        items={chewFaqs}
        title="Questions About the CHEW Platform"
        description="Find answers about the dashboard, alerts, referrals, and joining the platform."
      />
      <JoinSection />
      <Footer />
    </main>
  );
}
