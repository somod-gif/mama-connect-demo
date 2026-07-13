"use client";

import { ArrowRight, Building2, HeartPulse, Shield } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const steps = [
  {
    icon: Shield,
    title: "CHEW Identifies Need",
    description:
      "Based on check-in responses or direct assessment, you determine a mother needs facility-level care.",
    accent: "bg-secondary-light text-secondary",
  },
  {
    icon: ArrowRight,
    title: "Referral Initiated",
    description:
      "Initiate a referral from your dashboard with patient details, reason, and urgency level.",
    accent: "bg-primary-light text-primary",
  },
  {
    icon: Building2,
    title: "PHC Receives Referral",
    description:
      "The nearest Primary Healthcare Centre receives the referral instantly through the platform.",
    accent: "bg-primary-light text-primary",
  },
  {
    icon: HeartPulse,
    title: "Care Provided",
    description:
      "The mother receives care. Status updates are sent back to you so you can track outcomes.",
    accent: "bg-primary-light text-primary",
  },
];

export default function ReferralFlowSection() {
  return (
    <Container className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Referrals"
          title="Streamlined Referral Workflow"
          description="From identification to care — every step is tracked and coordinated."
        />
      </FadeInUp>

      <div className="grid md:grid-cols-4 gap-6 relative">
        {steps.map((step, index) => (
          <FadeInUp key={step.title} delay={index * 0.15}>
            <>
              <Card className="p-6 text-center h-full relative">
                <div
                  className={`w-14 h-14 rounded-2xl ${step.accent} flex items-center justify-center mx-auto mb-4`}
                >
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2" style={{ left: `${(index + 1) * 25}%`, transform: "translate(-50%, -50%)" }}>
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              )}
            </>
          </FadeInUp>
        ))}
      </div>

      <FadeInUp delay={0.3}>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-light rounded-xl text-sm font-medium text-secondary">
            <Building2 className="w-4 h-4" />
            Connected to Primary Healthcare Centres and Hospitals
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
