"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  ClipboardCheck,
  Stethoscope,
  Baby,
  Sprout,
} from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const stages = [
  {
    icon: HeartPulse,
    title: "Pregnancy",
    description: "Early registration, weekly check-ins, and education from the moment a mother joins.",
    color: "bg-stamp",
  },
  {
    icon: ClipboardCheck,
    title: "Antenatal",
    description: "Scheduled appointments, nutrition guidance, risk monitoring, and CHEW follow-ups.",
    color: "bg-secondary",
  },
  {
    icon: Stethoscope,
    title: "Delivery",
    description: "Birth preparation, facility coordination, emergency referral pathways, and tracking.",
    color: "bg-ink",
  },
  {
    icon: Baby,
    title: "Postpartum",
    description: "Mother recovery, baby care education, vaccination reminders, and mental health support.",
    color: "bg-leaf",
  },
  {
    icon: Sprout,
    title: "Childcare",
    description: "Vaccination schedules, growth monitoring, nutrition advice, and developmental milestones.",
    color: "bg-gold",
  },
];

export default function MaternalJourney() {
  return (
    <Container id="journey" className="bg-white">
      <FadeInUp>
        <SectionHeading
          badge="The Journey"
          title="From Pregnancy to Parenthood"
          description="Every stage of the maternal journey is supported — with continuity of care that never breaks."
        />
      </FadeInUp>

      <div className="relative max-w-4xl mx-auto">
        <div className="hidden md:block absolute top-[39px] left-[10%] right-[10%] h-px bg-line" />

        <div className="grid md:grid-cols-5 gap-6 md:gap-4">
          {stages.map((stage, i) => (
            <FadeInUp key={stage.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                  className={`relative z-10 w-14 h-14 rounded-2xl ${stage.color} flex items-center justify-center mb-3`}
                >
                  <stage.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-sm font-bold text-ink mb-1">{stage.title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed max-w-[170px]">
                  {stage.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </Container>
  );
}
