"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  HeartPulse,
  MessageCircle,
  Smartphone,
  Globe,
  ArrowDown,
  UserRound,
  Shield,
  Building2,
  Stethoscope,
  Baby,
  Calendar,
  Truck,
  Heart,
} from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Button } from "@/app/components/ui/Button";

const channels = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Smartphone, label: "SMS" },
  { icon: Globe, label: "USSD" },
  { icon: Globe, label: "Web" },
];

const participants = [
  { icon: UserRound, label: "Mothers", color: "bg-stamp", desc: "Access care & education" },
  { icon: Shield, label: "CHEWs", color: "bg-ink", desc: "Coordinate & monitor" },
  { icon: Building2, label: "Facilities", color: "bg-leaf", desc: "Receive & treat" },
  { icon: Stethoscope, label: "Organizations", color: "bg-gold", desc: "Deploy & track" },
];

const journeyStages = [
  { icon: Heart, label: "Pregnancy", color: "bg-stamp" },
  { icon: Calendar, label: "Antenatal", color: "bg-secondary" },
  { icon: Baby, label: "Delivery", color: "bg-ink" },
  { icon: Truck, label: "Postpartum", color: "bg-leaf" },
  { icon: HeartPulse, label: "Childcare", color: "bg-gold" },
];

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-12 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-stamp-light/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-secondary-light/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stamp-light border border-stamp/15 rounded-full">
                <HeartPulse className="w-3.5 h-3.5 text-stamp" />
                <span className="text-xs font-medium text-stamp-dark">Maternal Health Platform</span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.08] tracking-tight">
                Continuous Maternal Care,{" "}
                <span className="text-stamp">From Pregnancy to Parenthood</span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
                A human-centered, AI-assisted platform connecting mothers, Community
                Health Workers, healthcare facilities, and organizations across the
                full maternal journey.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#ecosystem">
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/learn-more">Learn More</a>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.5}>
              <div className="flex flex-wrap gap-2 pt-2">
                {channels.map((ch) => (
                  <div
                    key={ch.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-line rounded-lg text-xs font-medium text-ink-soft"
                  >
                    <ch.icon className="w-3 h-3 text-stamp" />
                    {ch.label}
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>

          <FadeInUp delay={0.3} className="hidden lg:block">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative bg-white rounded-2xl border border-line p-8 shadow-paper"
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stamp to-stamp-dark flex items-center justify-center mx-auto mb-3">
                    <HeartPulse className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">MamaConnect</h3>
                  <p className="text-sm text-ink-soft">Connecting Care Across Nigeria</p>
                </div>

                {/* Participants — vertical stack */}
                <div className="space-y-2 mb-6">
                  {participants.map((p, i) => (
                    <motion.div
                      key={p.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background-soft border border-line/50"
                    >
                      <div className={`w-9 h-9 rounded-lg ${p.color} flex items-center justify-center flex-shrink-0`}>
                        <p.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{p.label}</p>
                        <p className="text-xs text-ink-soft">{p.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Journey */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="p-4 rounded-xl bg-stamp-light border border-stamp/10"
                >
                  <p className="text-[10px] font-semibold text-stamp-dark uppercase tracking-wider text-center mb-3">
                    Care Journey
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    {journeyStages.map((stage, i) => (
                      <div key={stage.label} className="flex items-center gap-1">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-lg ${stage.color} flex items-center justify-center`}>
                            <stage.icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-[10px] font-medium text-ink-soft leading-tight text-center">
                            {stage.label}
                          </span>
                        </div>
                        {i < journeyStages.length - 1 && (
                          <div className="w-3 h-px bg-stamp/30 mt-[-12px]" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.7}>
          <div className="flex justify-center mt-16">
            <a
              href="#ecosystem"
              className="flex flex-col items-center gap-2 text-ink-faint hover:text-ink transition-colors"
            >
              <span className="text-xs font-medium">Explore the platform</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
