"use client";

import {
  HeartPulse,
  Shield,
  Building2,
  Stethoscope,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const roles = [
  {
    icon: HeartPulse,
    title: "For Mothers",
    heading: "I am pregnant or a new mother",
    description: "Get weekly health check-ins, nutrition advice, vaccination reminders, and direct support from a Community Health Worker.",
    cta: "Start your journey",
    href: "/mothers",
    accent: "bg-stamp",
    accentLight: "bg-stamp-light",
    accentText: "text-stamp",
    badge: "For Mothers",
  },
  {
    icon: Shield,
    title: "For CHEWs",
    heading: "I am a Community Health Worker",
    description: "Manage assigned mothers, receive risk alerts, track referrals, and monitor patient health from one dashboard.",
    cta: "Explore the platform",
    href: "/chew",
    accent: "bg-ink",
    accentLight: "bg-secondary-light",
    accentText: "text-ink",
    badge: "For CHEWs",
  },
  {
    icon: Building2,
    title: "For Organizations",
    heading: "I am an Organization or NGO",
    description: "Deploy maternal health programs at scale, manage CHEWs, track outcomes, and coordinate with healthcare facilities.",
    cta: "See the platform",
    href: "/organizations",
    accent: "bg-gold",
    accentLight: "bg-gold-light",
    accentText: "text-gold-dark",
    badge: "For Organizations",
  },
  {
    icon: Stethoscope,
    title: "For Healthcare",
    heading: "I run a Healthcare Facility",
    description: "Receive referrals, manage patient records, coordinate emergency response, and track treatment outcomes.",
    cta: "Learn more",
    href: "/healthcare",
    accent: "bg-leaf",
    accentLight: "bg-leaf-light",
    accentText: "text-leaf",
    badge: "For Healthcare",
  },
];

export default function RoleSelection() {
  return (
    <Container className="bg-white">
      <FadeInUp>
        <SectionHeading
          badge="Get Started"
          title="Who Are You?"
          description="Choose your path to maternal care."
        />
      </FadeInUp>

      <StaggerContainer className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {roles.map((role) => (
          <StaggerItem key={role.title}>
            <div className="bg-background-soft border border-line rounded-xl overflow-hidden h-full hover:shadow-card-hover transition-shadow group">
              <div className={`h-1.5 w-full ${role.accent}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${role.accent} flex items-center justify-center`}>
                    <role.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold ${role.accentLight} ${role.accentText} rounded-full`}>
                    {role.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink mb-1">{role.heading}</h3>
                <p className="text-xs text-ink-soft leading-relaxed mb-5">{role.description}</p>
                <a
                  href={role.href}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${role.accentText} group-hover:gap-2.5 transition-all`}
                >
                  {role.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  );
}
