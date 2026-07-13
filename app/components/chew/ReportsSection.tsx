"use client";

import { BarChart3, TrendingUp, Download, LineChart } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const reportTypes = [
  {
    icon: BarChart3,
    title: "Monthly Summary",
    description:
      "Overview of all assigned mothers, check-in completions, risk distributions, and referral activity.",
  },
  {
    icon: TrendingUp,
    title: "Risk Trends",
    description:
      "Track how risk levels change over time across your patient population. Identify emerging patterns.",
  },
  {
    icon: LineChart,
    title: "Engagement Metrics",
    description:
      "Check-in response rates, follow-up completion, and mother engagement levels.",
  },
  {
    icon: Download,
    title: "Exportable Reports",
    description:
      "Download reports for your records, supervisor reviews, or program reporting requirements.",
  },
];

export default function ReportsSection() {
  return (
    <Container className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Reports"
          title="Data That Informs Better Care"
          description="Understand your impact with clear, actionable reports."
        />
      </FadeInUp>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <FadeInUp key={report.title} delay={0.1}>
            <Card className="p-6 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <report.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                {report.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {report.description}
              </p>
            </Card>
          </FadeInUp>
        ))}
      </div>

      <FadeInUp delay={0.2}>
        <div className="mt-8 max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Sample Monthly Impact
                </h3>
                <p className="text-xs text-muted-foreground">
                  Based on active usage data
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-background-soft">
                <p className="text-xl font-bold text-primary">28</p>
                <p className="text-[10px] text-muted-foreground">Check-ins completed</p>
              </div>
              <div className="p-3 rounded-xl bg-background-soft">
                <p className="text-xl font-bold text-secondary">3</p>
                <p className="text-[10px] text-muted-foreground">Risk alerts acted on</p>
              </div>
              <div className="p-3 rounded-xl bg-background-soft">
                <p className="text-xl font-bold text-primary">2</p>
                <p className="text-[10px] text-muted-foreground">Referrals completed</p>
              </div>
            </div>
          </Card>
        </div>
      </FadeInUp>
    </Container>
  );
}
