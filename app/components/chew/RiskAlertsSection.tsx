"use client";

import { Bell, AlertTriangle } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const alerts = [
  {
    name: "Amina Bello",
    issue: "Severe headache and swollen feet reported",
    time: "2 minutes ago",
    severity: "high",
  },
  {
    name: "Grace Okonkwo",
    issue: "Missed postnatal check-in (3 days overdue)",
    time: "1 hour ago",
    severity: "medium",
  },
];

export default function RiskAlertsSection() {
  return (
    <Container className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="Alerts"
          title="Real-Time Risk Alerts"
          description="When a mother needs help, you know immediately. No delays, no missed signs."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <FadeInLeft>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card
                key={alert.name}
                className={`p-5 border-l-4 ${
                  alert.severity === "high"
                    ? "border-l-red-500"
                    : "border-l-amber-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      alert.severity === "high"
                        ? "bg-red-50"
                        : "bg-amber-50"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        alert.severity === "high"
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {alert.name}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          alert.severity === "high"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {alert.severity === "high" ? "High Risk" : "Medium"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.issue}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            <div className="p-4 rounded-xl bg-background-soft border border-border text-center">
              <p className="text-xs text-muted-foreground">
                Alerts are delivered via dashboard and SMS.
              </p>
            </div>
          </div>
        </FadeInLeft>

        <FadeInRight>
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <Bell className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  How Alerts Work
                </h3>
                <p className="text-sm text-muted-foreground">
                  From check-in to alert in seconds
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                {
                  step: "1",
                  title: "Mother completes check-in",
                  desc: "She answers simple health questions via WhatsApp or USSD.",
                },
                {
                  step: "2",
                  title: "AI categorizes risk level",
                  desc: "Her responses are analyzed and classified as low, medium, or high risk.",
                },
                {
                  step: "3",
                  title: "Alert sent to your dashboard",
                  desc: "If high risk, you receive an immediate notification with details.",
                },
                {
                  step: "4",
                  title: "You take action",
                  desc: "Contact the mother, schedule a visit, or initiate a referral.",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-secondary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-secondary">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
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
