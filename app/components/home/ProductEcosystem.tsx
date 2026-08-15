"use client";

import {
  FileText,
  Bot,
  Users,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";

const pillars = [
  {
    icon: FileText,
    title: "Digital Maternal Passport",
    description: "A care identity and health history that travels with every mother.",
    color: "bg-stamp",
  },
  {
    icon: Bot,
    title: "AI Maternal Assistant",
    description: "Education, guidance, and early risk cues — powered by AI, guided by professionals.",
    color: "bg-ink",
  },
  {
    icon: Users,
    title: "CHEW Care Network",
    description: "Community Health Workers form the human backbone of care coordination.",
    color: "bg-secondary",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Support",
    description: "Risk detection and escalation that connects mothers to life-saving care.",
    color: "bg-stamp-dark",
  },
];

export default function ProductEcosystem() {
  return (
    <Container id="ecosystem" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="The Platform"
          title="A Full Maternal Care System"
          description="MamaConnect is not a chatbot. It is a complete ecosystem connecting mothers, healthcare workers, facilities, and communities."
        />
      </FadeInUp>

      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {pillars.map((pillar, i) => (
          <FadeInUp key={pillar.title} delay={i * 0.06}>
            <div className="bg-white border border-line rounded-xl p-5 h-full hover:shadow-card-hover transition-shadow">
              <div className={`w-9 h-9 rounded-lg ${pillar.color} flex items-center justify-center mb-3`}>
                <pillar.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-ink mb-1.5">{pillar.title}</h3>
              <p className="text-xs text-ink-soft leading-relaxed">{pillar.description}</p>
            </div>
          </FadeInUp>
        ))}
      </div>

      <FadeInUp delay={0.3}>
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <a href="/learn-more">
              Learn How It Works
              <ChevronRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </FadeInUp>
    </Container>
  );
}
