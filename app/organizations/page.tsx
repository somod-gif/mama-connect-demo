import { Footer } from "@/app/components/shared/Footer";
import OrgHero from "@/app/components/organizations/Hero";
import FeaturesGrid from "@/app/components/organizations/FeaturesGrid";
import DashboardPreview from "@/app/components/organizations/DashboardPreview";
import TeamManagement from "@/app/components/organizations/TeamManagement";
import OutcomesTracking from "@/app/components/organizations/OutcomesTracking";
import JoinSection from "@/app/components/organizations/JoinSection";

export default function OrganizationsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <OrgHero />
      <FeaturesGrid />
      <DashboardPreview />
      <TeamManagement />
      <OutcomesTracking />
      <JoinSection />
      <Footer />
    </main>
  );
}
