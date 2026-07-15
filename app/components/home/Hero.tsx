"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  HeartPulse,
  MessageCircle,
  Smartphone,
  Globe,
  Shield,
} from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { RoleCard } from "@/app/components/ui/RoleCard";
import { Button } from "@/app/components/ui/Button";

const trustIndicators = [
  { icon: MessageCircle, label: "WhatsApp Accessible" },
  { icon: Smartphone, label: "USSD & SMS Enabled" },
  { icon: Globe, label: "5 Nigerian Languages" },
  { icon: Shield, label: "CHEW Driven" },
];

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-12 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-light/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary-light/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20">
          <div className="space-y-8">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light border border-primary/20 rounded-full">
                <HeartPulse className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary-dark">
                  Maternal Health Platform
                </span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
                Human-Centered{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                  Maternal Care
                </span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Connecting pregnant and postpartum women with Community Health
                Extension Workers (CHEWs) and healthcare facilities for timely,
                life-saving care.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#role-selection">
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#how-it-works">How It Works</a>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.5}>
              <div className="flex flex-wrap gap-2 pt-2">
                {trustIndicators.map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border rounded-lg text-xs font-medium text-muted-foreground"
                  >
                    <item.icon className="w-3 h-3 text-primary" />
                    {item.label}
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>

          <FadeInUp delay={0.3} className="hidden lg:block">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative bg-card rounded-2xl border border-border/80 p-8 shadow-[var(--shadow-card-hover)]"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <HeartPulse className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">MamaConnect</h3>
                  <p className="text-sm text-muted-foreground">Maternal Care Network</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Pregnant & Postpartum Women", color: "from-primary to-primary-dark" },
                    { label: "Community Health Extension Workers", color: "from-secondary to-secondary" },
                    { label: "Primary Healthcare Centres", color: "from-primary/80 to-primary" },
                    { label: "Secondary Healthcare Centers", color: "from-primary/60 to-primary/80" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background-soft border border-border/50"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 p-3 rounded-xl bg-primary-light text-center border border-primary/10"
                >
                  <p className="text-sm font-semibold text-primary-dark">
                    Coordinating Care Across Communities
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.6}>
          <div id="role-selection" className="scroll-mt-24">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Who are you?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 tracking-tight">
                Choose your path to maternal care
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <RoleCard
                icon={HeartPulse}
                title="I am pregnant or a new mother"
                description="Get weekly health check-ins, nutrition advice, vaccination reminders, and direct support from a Community Health Worker."
                href="/mothers"
                accent="cyan"
                badge="For Mothers"
                index={0}
              />
              <RoleCard
                icon={Shield}
                title="I am a Community Health Extension Worker"
                description="Manage assigned mothers, receive risk alerts, track referrals, and monitor patient health from one dashboard."
                href="/chew"
                accent="purple"
                badge="For CHEWs"
                index={1}
              />
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
