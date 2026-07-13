import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Footer } from "@/app/components/shared/Footer";
import { FAQSection } from "@/app/components/shared/FAQSection";
import { homeFaqs } from "@/lib/data/home-faq";
import { motherFaqs } from "@/lib/data/mother-faq";
import { chewFaqs } from "@/lib/data/chew-faq";

export default function FAQPage() {
  return (
    <main className="flex flex-col min-h-screen pt-24">
      <Container className="py-16">
        <SectionHeading
          badge="FAQ"
          title="Frequently Asked Questions"
          description="Find answers about MamaConnect for mothers, CHEWs, and partners."
          className="mb-16"
        />

        <div className="max-w-3xl mx-auto space-y-16">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">General</h2>
            <FAQSection items={homeFaqs} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">For Mothers</h2>
            <FAQSection items={motherFaqs} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">For CHEWs</h2>
            <FAQSection items={chewFaqs} />
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
