"use client";

import { Heart, Calendar, ClipboardList, Activity } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const features = [
  {
    icon: ClipboardList,
    title: "Check-in History",
    description:
      "View every response a mother has submitted over time. Spot trends and changes in health status.",
  },
  {
    icon: Activity,
    title: "Vital Signs Tracking",
    description:
      "Monitor reported symptoms, blood pressure concerns, and other vital indicators.",
  },
  {
    icon: Heart,
    title: "Risk Trend Analysis",
    description:
      "See how a mother's risk level has evolved. Early detection of deterioration.",
  },
  {
    icon: Calendar,
    title: "Follow-up Scheduling",
    description:
      "Schedule home visits, phone check-ins, and follow-ups with automated reminders.",
  },
];

export default function PatientManagementSection() {
  return (
    <Container className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="Monitoring"
          title="Complete Patient Management"
          description="Every mother's health journey, documented and accessible in one place."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeInLeft>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Card key={feature.title} className="p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </FadeInLeft>

        <FadeInRight>
          <Card className="p-6 md:p-8">
            <h3 className="text-base font-bold text-foreground mb-4">
              Patient Timeline Example
            </h3>
            <div className="space-y-4">
              {[
                {
                  date: "Week 28",
                  event: "Registered on MamaConnect",
                  type: "registration",
                },
                {
                  date: "Week 29",
                  event: "First check-in completed. Low risk.",
                  type: "checkin",
                },
                {
                  date: "Week 32",
                  event: "Reported mild swelling. Nutrition advice provided.",
                  type: "checkin",
                },
                {
                  date: "Week 34",
                  event: "Severe headache detected. HIGH RISK alert triggered.",
                  type: "alert",
                },
                {
                  date: "Week 34",
                  event: "Referred to PHC. Follow-up scheduled.",
                  type: "referral",
                },
              ].map((item) => (
                <div key={item.event} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        item.type === "alert"
                          ? "bg-red-500"
                          : item.type === "referral"
                          ? "bg-amber-500"
                          : "bg-primary"
                      }`}
                    />
                    <div className="w-px h-full bg-border mt-1" />
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {item.date}
                    </p>
                    <p className="text-sm text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeInRight>
      </div>
    </Container>
  );
}
