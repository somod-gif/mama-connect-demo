import { Footer } from "@/app/components/shared/Footer";
import HomeHero from "@/app/components/home/Hero";
import ProductEcosystem from "@/app/components/home/ProductEcosystem";
import MaternalJourney from "@/app/components/home/MaternalJourney";
import RoleSelection from "@/app/components/home/RoleSelection";
import Impact from "@/app/components/home/Impact";
import FinalCTA from "@/app/components/home/FinalCTA";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HomeHero />
      <ProductEcosystem />
      <MaternalJourney />
      <RoleSelection />
      <Impact />
      <FinalCTA />
      <Footer />
    </main>
  );
}
