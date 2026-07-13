"use client";

import { Bell, Calendar, Shield } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

export default function VaccinationSection() {
  return (
    <Container className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="Vaccinations"
          title="Never Miss a Vaccination"
          description="Timely reminders for you and your baby, so you stay protected."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeInLeft>
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Smart Reminders
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automated notifications so you never miss a dose
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Tetanus Toxoid Vaccination",
                  desc: "Recommended during pregnancy to protect both mother and baby.",
                },
                {
                  title: "Baby Immunization Schedule",
                  desc: "Reminders for your newborn's vaccinations after birth.",
                },
                {
                  title: "Seasonal Health Advisories",
                  desc: "Additional vaccination information based on your region.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
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
        </FadeInLeft>

        <FadeInRight>
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  How Reminders Work
                </h3>
                <p className="text-sm text-muted-foreground">
                  Simple, clear, and in your preferred language
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Via WhatsApp",
                  desc: "You receive a message with the vaccination details and due date.",
                },
                {
                  title: "Via SMS",
                  desc: "If you do not use WhatsApp, we send SMS reminders to your phone.",
                },
                {
                  title: "Follow-up",
                  desc: "Your CHEW follows up to ensure you received your vaccination.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-background-soft border border-border/50">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
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
