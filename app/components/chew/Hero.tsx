"use client";

import { Shield, ChevronDown } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Button } from "@/app/components/ui/Button";
import { WhatsAppButton } from "@/app/components/ui/WhatsAppButton";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "@/lib/constants";

export default function ChewHero() {
  const url = getWhatsAppUrl(WHATSAPP_MESSAGES.chew);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 pb-12 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary-light/50 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-primary-light/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-light border border-secondary/20 rounded-full">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs font-medium text-secondary">
                  For Community Health Extension Workers
                </span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
                Your Community.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary">
                  Your Mothers.
                </span>{" "}
                Your Dashboard.
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                A centralized platform to manage assigned mothers, receive risk
                alerts, track referrals, and monitor patient health — all from
                your phone.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <WhatsAppButton
                  href={url}
                  size="lg"
                  label="Join the Platform"
                />
                <Button variant="outline" size="lg" asChild>
                  <a href="#dashboard">View Dashboard Features</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Opens WhatsApp. Free for CHEWs. Training provided.
              </p>
            </FadeInUp>
          </div>

          <FadeInUp delay={0.3} className="hidden lg:block">
            <div className="relative">
              <div className="bg-card rounded-2xl border border-border/80 p-8 shadow-[var(--shadow-card-hover)]">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Your CHEW Toolkit
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { text: "Centralized patient dashboard" },
                    { text: "Real-time risk alerts" },
                    { text: "Follow-up scheduling" },
                    { text: "Referral management" },
                    { text: "Patient monitoring & history" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 rounded-xl bg-secondary-light border border-secondary/10 text-center">
                  <p className="text-xs font-medium text-secondary">
                    Works on any smartphone with internet access
                  </p>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.6}>
          <div className="flex justify-center mt-16">
            <a
              href="#dashboard"
              className="inline-flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Explore the platform</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
