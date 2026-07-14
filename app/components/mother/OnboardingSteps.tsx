"use client";

import { MessageCircle, ClipboardCheck, HeartPulse } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const steps = [
  {
    icon: MessageCircle,
    title: "Reach Out",
    description:
      "Send us a message via WhatsApp, SMS, or dial our USSD code. Our team will welcome you and guide you through registration.",
    step: "01",
  },
  {
    icon: ClipboardCheck,
    title: "Register in Your Language",
    description:
      "Complete a simple registration in English, Pidgin, Yoruba, Hausa, or Igbo. Tell us about your pregnancy stage and location.",
    step: "02",
  },
  {
    icon: HeartPulse,
    title: "Start Receiving Care",
    description:
      "Begin your weekly health check-ins, receive nutrition advice, vaccination reminders, and get connected to a CHEW.",
    step: "03",
  },
];

export default function OnboardingSteps() {
  return (
    <Container className="bg-background">
      <FadeInUp>
        <SectionHeading
          title="Getting Started Takes Just 3 Steps"
          description="No app download needed. No internet required. Just you and your phone."
        />
      </FadeInUp>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Animation = index === 0 ? FadeInLeft : index === 2 ? FadeInRight : FadeInUp;
          return (
            <Animation key={step.title}>
              <Card className="p-6 md:p-8 text-center h-full relative">
                <span className="text-4xl font-bold text-primary/10 absolute top-4 right-6 leading-none">
                  {step.step}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </Animation>
          );
        })}
      </div>
    </Container>
  );
}
