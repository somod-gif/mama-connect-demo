"use client";

import { ArrowRightLeft, FileText, Bell, Stethoscope, Clock, ShieldCheck } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const features = [
  {
    icon: ArrowRightLeft,
    title: "Referral Management",
    description: "Receive patient referrals from CHEWs with full context — pregnancy history, risk level, reason for referral, and urgency. Accept, schedule, or redirect.",
    color: "bg-leaf",
  },
  {
    icon: FileText,
    title: "Patient Health Records",
    description: "Access the maternal passport for referred patients. See antenatal history, check-in records, health measurements, and previous alerts.",
    color: "bg-ink",
  },
  {
    icon: Bell,
    title: "Emergency Alerts",
    description: "Get real-time notifications for high-risk referrals and emergency cases. Prioritize critical patients and coordinate rapid response.",
    color: "bg-stamp",
  },
  {
    icon: Stethoscope,
    title: "Treatment Tracking",
    description: "Record treatment outcomes, follow-up plans, and discharge notes. Feed data back to CHEWs for continuity of care.",
    color: "bg-gold",
  },
  {
    icon: Clock,
    title: "Appointment Scheduling",
    description: "Manage referral appointment slots. CHEWs can book directly, reducing phone calls and no-shows.",
    color: "bg-leaf",
  },
  {
    icon: ShieldCheck,
    title: "Verified Patient Data",
    description: "Only verified patients with confirmed enrollment appear in referrals. No duplicates, no missing records.",
    color: "bg-ink",
  },
];

export default function FeaturesGrid() {
  return (
    <Container id="features" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          title="Built for Healthcare Facilities"
          description="Everything your facility needs to receive and manage maternal health referrals."
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
