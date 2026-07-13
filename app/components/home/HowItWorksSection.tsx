"use client";

import {
  UserRound,
  ShieldPlus,
  Building2,
  MessageCircle,
  Smartphone,
  Globe,
} from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const layers = [
  {
    title: "Pregnant & Postpartum Women",
    icon: UserRound,
    accent: "from-primary to-primary-dark",
    lightBg: "bg-primary-light",
    features: [
      "Weekly maternal health check-ins via WhatsApp or USSD",
      "Affordable local nutrition recommendations",
      "Vaccination and antenatal reminders",
      "Educational content in 5 Nigerian languages",
      "Emergency referral when danger signs appear",
    ],
    channels: [
      { icon: MessageCircle, label: "WhatsApp" },
      { icon: Smartphone, label: "USSD" },
      { icon: Globe, label: "SMS" },
    ],
  },
  {
    title: "Community Health Extension Workers",
    icon: ShieldPlus,
    accent: "from-secondary to-secondary",
    lightBg: "bg-secondary-light",
    features: [
      "Centralized patient dashboard",
      "Real-time risk alerts and notifications",
      "Follow-up scheduling and tracking",
      "Referral management and status tracking",
      "Patient monitoring and check-in history",
    ],
    channels: [
      { icon: Smartphone, label: "Mobile App" },
      { icon: Globe, label: "Web Dashboard" },
    ],
  },
  {
    title: "Clinics & Hospitals",
    icon: Building2,
    accent: "from-primary/80 to-primary",
    lightBg: "bg-primary-light",
    features: [
      "Receive referrals from CHEWs",
      "Handle escalated critical cases",
      "Coordinate emergency response",
      "Track treatment outcomes",
      "Access patient health records",
    ],
    channels: [
      { icon: Globe, label: "Referral Portal" },
      { icon: Smartphone, label: "Alert System" },
    ],
  },
];

function LayerCard({ layer, index }: { layer: typeof layers[0]; index: number }) {
  const Animation = index === 0 ? FadeInLeft : index === 2 ? FadeInRight : FadeInUp;

  return (
    <Animation>
      <Card className="h-full overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${layer.accent}`} />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl ${layer.lightBg} flex items-center justify-center`}>
              <layer.icon className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Layer {index + 1}
              </p>
              <h3 className="text-lg font-bold text-foreground">{layer.title}</h3>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {layer.features.map((feature, fi) => (
              <li key={fi} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Access Channels
            </p>
            <div className="flex flex-wrap gap-2">
              {layer.channels.map((channel) => (
                <div
                  key={channel.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-soft text-xs font-medium text-muted-foreground"
                >
                  <channel.icon className="w-3.5 h-3.5 text-primary" />
                  {channel.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Animation>
  );
}

export default function HowItWorksSection() {
  return (
    <Container id="how-it-works" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          title="Connecting Mothers to Timely Care"
          description="Three layers working together in one coordinated maternal health ecosystem."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-3 gap-8">
        {layers.map((layer, index) => (
          <LayerCard key={layer.title} layer={layer} index={index} />
        ))}
      </div>
    </Container>
  );
}
