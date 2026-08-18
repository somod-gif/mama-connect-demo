"use client";

import { HeartPulse, Shield, Building2, Stethoscope } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const roles = [
  {
    icon: HeartPulse,
    title: "Mothers",
    description: "Pregnant and postpartum women receiving care, education, and support throughout their maternal journey.",
    color: "bg-stamp",
    features: ["Health education", "CHEW connection", "Emergency support", "Community forum"],
    href: "/mothers",
  },
  {
    icon: Shield,
    title: "CHEWs",
    description: "Community Health Extension Workers coordinating care, monitoring mothers, and managing referrals.",
    color: "bg-ink",
    features: ["Mother assignments", "Risk alerts", "Referral tracking", "Patient dashboard"],
    href: "/chew",
  },
  {
    icon: Building2,
    title: "Organizations",
    description: "NGOs and health programs deploying maternal health initiatives at scale with outcome tracking.",
    color: "bg-gold",
    features: ["CHEW management", "Outcome analytics", "Program reporting", "Geographic coverage"],
    href: "/organizations",
  },
  {
    icon: Stethoscope,
    title: "Healthcare Facilities",
    description: "Hospitals and clinics receiving referrals, managing patient records, and coordinating emergency response.",
    color: "bg-leaf",
    features: ["Referral intake", "Patient records", "Emergency alerts", "Treatment tracking"],
    href: "/healthcare",
  },
];

export default function Users() {
  return (
    <Container id="users" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Who It's For"
          title="Four Roles, One Care Network"
          description="MamaConnect serves every participant in the maternal care ecosystem."
        />
      </FadeInUp>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <StaggerItem key={role.title}>
            <div className="bg-white border border-line rounded-xl overflow-hidden h-full hover:shadow-card-hover transition-shadow">
              <div className={`h-1.5 w-full ${role.color}`} />
              <div className="p-5">
                <div className={`w-10 h-10 rounded-xl ${role.color} flex items-center justify-center mb-4`}>
                  <role.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{role.title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed mb-4">{role.description}</p>
                <ul className="space-y-1.5">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-stamp flex-shrink-0" />
                      <span className="text-xs text-ink-soft">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  );
}
