"use client";

import {
  MessageCircle,
  Apple,
  BookOpen,
  Bell,
  Calendar,
  Heart,
} from "lucide-react";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const benefits = [
  {
    icon: MessageCircle,
    title: "Weekly Health Check-ins",
    description:
      "Short, simple questions every week via WhatsApp or USSD to monitor your health and detect warning signs early.",
  },
  {
    icon: Apple,
    title: "Affordable Nutrition Advice",
    description:
      "Region-specific food recommendations using locally available, affordable ingredients tailored to your pregnancy stage.",
  },
  {
    icon: BookOpen,
    title: "Educational Content",
    description:
      "Access a library of pregnancy and newborn care information in your preferred language.",
  },
  {
    icon: Bell,
    title: "Vaccination Reminders",
    description:
      "Timely reminders for tetanus shots and other essential immunizations during and after pregnancy.",
  },
  {
    icon: Calendar,
    title: "Antenatal & Postnatal Support",
    description:
      "Appointment reminders and follow-up care coordination throughout your pregnancy and after delivery.",
  },
  {
    icon: Heart,
    title: "Emergency Referrals",
    description:
      "If danger signs are detected, you are immediately connected to a healthcare worker for urgent care.",
  },
];

export default function BenefitsGrid() {
  return (
    <Container id="benefits" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Benefits"
          title="Everything You Need for a Healthy Pregnancy"
          description="Free, accessible, and designed with your needs in mind."
        />
      </FadeInUp>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <StaggerItem key={benefit.title}>
            <Card className="p-6 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  );
}
