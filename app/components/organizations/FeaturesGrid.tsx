"use client";

import { Users, MapPin, BarChart3, ClipboardCheck, Bell, HeartPulse } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const features = [
  {
    icon: Users,
    title: "CHEW Management",
    description: "Recruit, onboard, and manage Community Health Workers. Assign territories, track performance, and ensure coverage across all your target LGAs.",
    color: "bg-ink",
  },
  {
    icon: MapPin,
    title: "Geographic Coverage",
    description: "Visualize patient density and CHEW coverage across states, LGAs, and wards. Identify gaps and allocate resources where they are needed most.",
    color: "bg-gold",
  },
  {
    icon: BarChart3,
    title: "Outcome Analytics",
    description: "Track maternal health outcomes across your programs. Monitor antenatal attendance, referral completion rates, and risk detection accuracy.",
    color: "bg-leaf",
  },
  {
    icon: ClipboardCheck,
    title: "Program Reporting",
    description: "Generate reports for donors, government partners, and internal reviews. Export data on patient reach, CHEW activity, and clinical outcomes.",
    color: "bg-stamp",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get notified when patients are flagged as high-risk, when referrals are pending, or when CHEWs need support. Never miss a critical case.",
    color: "bg-ink",
  },
  {
    icon: HeartPulse,
    title: "Patient Journey Tracking",
    description: "Follow each mother from enrollment through delivery. See check-in history, health records, and care milestones in one unified view.",
    color: "bg-gold",
  },
];

export default function FeaturesGrid() {
  return (
    <Container id="features" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          title="Everything You Need to Run Programs"
          description="A complete toolkit for managing maternal health initiatives at scale."
        />
      </FadeInUp>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <FadeInUp key={feature.title} delay={i * 0.08}>
            <div className="bg-white border border-line rounded-xl p-6 h-full hover:shadow-card-hover transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-ink mb-2">{feature.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{feature.description}</p>
            </div>
          </FadeInUp>
        ))}
      </div>
    </Container>
  );
}
