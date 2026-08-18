import { Footer } from "@/app/components/shared/Footer";
import DigitalPassport from "@/app/components/home/DigitalPassport";
import AiAssistant from "@/app/components/home/AiAssistant";
import MultichannelAccess from "@/app/components/home/MultichannelAccess";
import ReferralFlow from "@/app/components/home/ReferralFlow";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function LearnMorePage() {
  return (
    <main className="flex flex-col min-h-screen pt-20">
      <Container className="py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <SectionHeading
          badge="Learn More"
          title="How MamaConnect Works"
          description="A deeper look at the technology, channels, and care coordination that power continuous maternal healthcare."
        />

        <div className="flex justify-center mt-4">
          <Button size="lg" asChild>
            <a href="#passport">
              Explore Features
              <ChevronRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </Container>

      <div id="passport" className="scroll-mt-24">
        <DigitalPassport />
      </div>
      <div id="ai" className="scroll-mt-24">
        <AiAssistant />
      </div>
      <div id="channels" className="scroll-mt-24">
        <MultichannelAccess />
      </div>
      <div id="referral" className="scroll-mt-24">
        <ReferralFlow />
      </div>

      <Container className="bg-ink">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Join mothers, CHEWs, facilities, and organizations already using MamaConnect.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" className="bg-stamp hover:bg-stamp-dark text-white" asChild>
              <a href="/register">
                Get Started
                <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <a href="/organizations">
                Partner With Us
              </a>
            </Button>
          </div>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
