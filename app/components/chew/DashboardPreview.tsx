"use client";

import {
  Users,
  Bell,
  Activity,
  ChevronRight,
} from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const dashboardWidgets = [
  {
    icon: Users,
    label: "Assigned Mothers",
    value: "12",
    change: "+2 this month",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: Bell,
    label: "Active Alerts",
    value: "3",
    change: "2 high risk, 1 medium",
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
  {
    icon: Activity,
    label: "Check-ins This Week",
    value: "28",
    change: "85% response rate",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: ChevronRight,
    label: "Pending Follow-ups",
    value: "5",
    change: "3 due today",
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
];

export default function DashboardPreview() {
  return (
    <Container id="dashboard" className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="Dashboard"
          title="Everything You Need at a Glance"
          description="Your dashboard gives you a complete view of your assigned mothers and their health status."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeInLeft>
          <div className="grid grid-cols-2 gap-4">
            {dashboardWidgets.map((widget) => (
              <Card key={widget.label} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${widget.bg} flex items-center justify-center`}>
                    <widget.icon className={`w-5 h-5 ${widget.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {widget.value}
                </p>
                <p className="text-xs font-medium text-foreground mt-1">
                  {widget.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {widget.change}
                </p>
              </Card>
            ))}
          </div>
        </FadeInLeft>

        <FadeInRight>
          <Card className="p-6 md:p-8">
            <h3 className="text-base font-bold text-foreground mb-4">
            Patient List
            </h3>
            <div className="space-y-3">
              {[
                { name: "Amina Bello", risk: "High", stage: "7 months", lastCheckin: "2 hours ago" },
                { name: "Fatima Usman", risk: "Low", stage: "4 months", lastCheckin: "1 day ago" },
                { name: "Grace Okonkwo", risk: "Medium", stage: "Postpartum", lastCheckin: "3 days ago" },
                { name: "Hauwa Adamu", risk: "Low", stage: "6 months", lastCheckin: "12 hours ago" },
              ].map((patient) => (
                <div key={patient.name} className="flex items-center justify-between p-3 rounded-xl bg-background-soft border border-border/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {patient.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {patient.stage} &middot; Check-in {patient.lastCheckin}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      patient.risk === "High"
                        ? "bg-red-50 text-red-600"
                        : patient.risk === "Medium"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-primary-light text-primary-dark"
                    }`}
                  >
                    {patient.risk}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </FadeInRight>
      </div>
    </Container>
  );
}
