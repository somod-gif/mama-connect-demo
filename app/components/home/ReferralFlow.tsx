"use client";

import { motion } from "framer-motion";
import {
  UserRound,
  Shield,
  Building2,
  Stethoscope,
  HeartPulse,
  ArrowRight,
  AlertTriangle,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const steps = [
  {
    icon: UserRound,
    title: "Mother Reports",
    desc: "Mother reports symptoms or danger signs through WhatsApp, SMS, or USSD.",
    color: "bg-stamp",
  },
  {
    icon: Shield,
    title: "CHEW Assesses",
    desc: "CHEW receives the alert, reviews the case, and determines if referral is needed.",
    color: "bg-ink",
  },
  {
    icon: Building2,
    title: "Facility Receives",
    desc: "Referral is sent to the nearest facility with patient context and urgency level.",
    color: "bg-secondary",
  },
  {
    icon: Stethoscope,
    title: "Care Delivered",
    desc: "Facility provides treatment and updates the patient record with outcomes.",
    color: "bg-leaf",
  },
  {
    icon: HeartPulse,
    title: "Follow-up",
    desc: "CHEW follows up with the mother to ensure continuity and recovery.",
    color: "bg-gold",
  },
];

const emergencyPoints = [
  { icon: AlertTriangle, title: "Risk Detection", desc: "AI flags danger signs from mother responses and CHEW assessments." },
  { icon: Shield, title: "Instant Escalation", desc: "High-risk cases are pushed to CHEWs and facilities in real time." },
  { icon: Phone, title: "Direct Coordination", desc: "CHEWs and facility staff connect directly through the platform." },
  { icon: Clock, title: "Response Tracking", desc: "Every escalation is tracked for accountability and improvement." },
];

export default function ReferralFlow() {
  return (
    <Container id="referral" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Referral & Emergency"
          title="From Symptom to Care, Without Delay"
          description="A closed-loop referral system that ensures no mother is lost between reporting and treatment."
        />
      </FadeInUp>

      <div className="relative max-w-5xl mx-auto mb-16">
        <div className="hidden md:block absolute top-[39px] left-[8%] right-[8%] h-px bg-line" />

        <div className="grid md:grid-cols-5 gap-6 md:gap-3">
          {steps.map((step, i) => (
            <FadeInUp key={step.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                  className={`relative z-10 w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-sm font-bold text-ink mb-1.5">{step.title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed max-w-[170px]">
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-[31px] -right-2 w-4 h-4 text-line z-20" />
                )}
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>

      <FadeInUp>
        <div className="bg-white border border-line rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-stamp flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Emergency Response</h3>
              <p className="text-xs text-ink-soft">When every minute counts</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyPoints.map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-background-soft border border-line/50">
                <div className="w-8 h-8 rounded-lg bg-stamp-light flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-stamp" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-ink-soft leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
