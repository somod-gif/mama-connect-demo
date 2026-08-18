"use client";

import { motion } from "framer-motion";
import { MessageCircle, Smartphone, ArrowRight, Stethoscope, CheckCircle2 } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";

const steps = [
  {
    num: "01",
    title: "CHEW Identifies Risk",
    description: "During a check-in or visit, the CHEW flags a patient that needs facility-level care. They create a referral with clinical notes.",
    color: "bg-ink",
  },
  {
    num: "02",
    title: "Referral Sent to Facility",
    description: "The referral appears in your facility dashboard with patient history, risk severity, and urgency level. You get an instant notification.",
    color: "bg-gold",
  },
  {
    num: "03",
    title: "Facility Reviews & Accepts",
    description: "Your team reviews the referral, checks available slots, and accepts the patient. The CHEW and patient are notified.",
    color: "bg-leaf",
  },
  {
    num: "04",
    title: "Treatment & Feedback Loop",
    description: "After treatment, the facility records outcomes. This data flows back to the CHEW for follow-up and continuity of care.",
    color: "bg-stamp",
  },
];

export default function ReferralFlow() {
  return (
    <Container id="referral-flow">
      <FadeInUp>
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-leaf-dark uppercase tracking-wider mb-2">
            How It Works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
            The Referral Flow
          </h2>
          <p className="mt-3 text-ink-soft max-w-2xl mx-auto">
            From CHEW identification to facility treatment — every step is tracked,
            transparent, and connected.
          </p>
        </div>
      </FadeInUp>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <FadeInUp key={step.num} delay={i * 0.12}>
            <div className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t-2 border-dashed border-line z-0" />
              )}
              <div className="relative bg-white border border-line rounded-xl p-6 h-full hover:shadow-card-hover transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-9 h-9 rounded-lg ${step.color} flex items-center justify-center text-sm font-bold text-white`}>
                    {step.num}
                  </span>
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-line lg:hidden" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.description}</p>
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>

      <FadeInUp delay={0.5}>
        <div className="mt-10 p-6 rounded-2xl bg-leaf-light border border-leaf/15 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-leaf flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink mb-1">Closed-Loop Referrals</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                Every referral is tracked from creation to treatment completion.
                If a patient doesn&apos;t show up, the CHEW is notified for follow-up.
                No patient falls through the cracks.
              </p>
            </div>
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
