"use client";

import { motion } from "framer-motion";
import { MessageCircle, Smartphone, Wifi, Globe, Check } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const channels = [
  {
    icon: MessageCircle,
    name: "WhatsApp",
    description: "Interactive maternal health check-ins, education, and direct CHEW communication.",
    access: "Any smartphone",
    color: "bg-leaf",
    features: ["Weekly check-ins", "Health education", "CHEW messaging", "Reminders"],
  },
  {
    icon: Smartphone,
    name: "SMS",
    description: "Text-based health tips, appointment reminders, and emergency alerts for basic phones.",
    access: "Any phone",
    color: "bg-secondary",
    features: ["Health tips", "Appointment alerts", "Emergency SMS", "Vaccination reminders"],
  },
  {
    icon: Wifi,
    name: "USSD",
    description: "Menu-based health surveys and check-ins that work without internet on any device.",
    access: "Any phone",
    color: "bg-ink",
    features: ["Health surveys", "Symptom reporting", "Risk assessment", "No internet needed"],
  },
  {
    icon: Globe,
    name: "Web Dashboard",
    description: "Full platform access for CHEWs, facilities, and organizations with analytics and management tools.",
    access: "Computer or smartphone",
    color: "bg-stamp",
    features: ["Patient management", "Analytics", "Referral tracking", "Reporting"],
  },
];

export default function MultichannelAccess() {
  return (
    <Container id="channels" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Access"
          title="Available to Every Mother"
          description="No smartphone? No internet? No problem. MamaConnect meets mothers where they are."
        />
      </FadeInUp>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => (
          <StaggerItem key={ch.name}>
            <div className="bg-white border border-line rounded-xl overflow-hidden h-full hover:shadow-card-hover transition-shadow">
              <div className={`h-1.5 w-full ${ch.color}`} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${ch.color} flex items-center justify-center`}>
                    <ch.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{ch.name}</h3>
                    <p className="text-[11px] text-ink-soft">{ch.access}</p>
                  </div>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed mb-4">{ch.description}</p>
                <ul className="space-y-1.5">
                  {ch.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-leaf flex-shrink-0" />
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
