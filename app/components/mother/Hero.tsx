"use client";

import { HeartPulse, ChevronDown } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Button } from "@/app/components/ui/Button";
import { WhatsAppButton } from "@/app/components/ui/WhatsAppButton";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "@/lib/constants";

export default function MotherHero() {
  const pregnantUrl = getWhatsAppUrl(WHATSAPP_MESSAGES.pregnant);
  const postpartumUrl = getWhatsAppUrl(WHATSAPP_MESSAGES.postpartum);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 pb-12 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary-light/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-secondary-light/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light border border-primary/20 rounded-full">
                <HeartPulse className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary-dark">
                  For Pregnant & Postpartum Women
                </span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
                Pregnancy care,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                  right in your hands
                </span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Weekly check-ins, nutrition advice, vaccination reminders, and a
                caring Community Health Worker supporting you throughout your
                pregnancy journey.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <WhatsAppButton
                  href={pregnantUrl}
                  size="lg"
                  label="I am pregnant — Register now"
                />
                <Button variant="outline" size="lg" asChild>
                  <a href={postpartumUrl} target="_blank" rel="noopener noreferrer">
                    I am a new mother
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Opens WhatsApp. Free to use. Available in 5 languages.
              </p>
            </FadeInUp>
          </div>

          <FadeInUp delay={0.3} className="hidden lg:block">
            <div className="relative">
              <div className="bg-card rounded-2xl border border-border/80 p-8 shadow-[var(--shadow-card-hover)]">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <HeartPulse className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Your Journey with MamaConnect
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { step: "1", text: "Send us a message on WhatsApp" },
                    { step: "2", text: "Register in your preferred language" },
                    { step: "3", text: "Receive weekly health check-ins" },
                    { step: "4", text: "Get nutrition and vaccination support" },
                    { step: "5", text: "Stay connected to your CHEW" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {item.step}
                        </span>
                      </div>
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.6}>
          <div className="flex justify-center mt-16">
            <a
              href="#benefits"
              className="inline-flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Learn more</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
