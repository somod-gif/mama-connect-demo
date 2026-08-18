"use client";

import {
  AlertTriangle,
  Clock,
  Globe2,
  ArrowRightLeft,
  Check,
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const problems = [
  {
    icon: Clock,
    problem: "Delayed Detection",
    solution: "Weekly AI-powered check-ins catch warning signs early.",
  },
  {
    icon: ArrowRightLeft,
    problem: "Fragmented Care",
    solution: "Digital Maternal Passport creates a continuous care record.",
  },
  {
    icon: Globe2,
    problem: "Poor Access",
    solution: "WhatsApp, SMS, and USSD bring care to mothers wherever they are.",
  },
  {
    icon: AlertTriangle,
    problem: "Weak Follow-up",
    solution: "CHEW-driven follow-ups with automated reminders ensure continuity.",
  },
];

const stats = [
  { value: "28%", label: "of global maternal deaths" },
  { value: "59%", label: "births outside facilities" },
  { value: "43%", label: "skilled birth attendance" },
  { value: "Preventable", label: "most maternal deaths" },
];

export default function Impact() {
  return (
    <Container id="impact" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Impact"
          title="The Problems We Solve"
          description="MamaConnect addresses the specific failures that lead to preventable maternal deaths."
        />
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-white border border-line rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-stamp tracking-tight">{stat.value}</p>
              <p className="text-xs text-ink-soft mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </FadeInUp>

      <StaggerContainer className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {problems.map((item) => (
          <StaggerItem key={item.problem}>
            <div className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-stamp-light flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-stamp" />
                </div>
                <p className="text-sm font-bold text-ink">{item.problem}</p>
              </div>
              <div className="flex items-start gap-2 ml-11">
                <Check className="w-3.5 h-3.5 text-leaf mt-0.5 flex-shrink-0" />
                <p className="text-xs text-ink-soft leading-relaxed">{item.solution}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  );
}
