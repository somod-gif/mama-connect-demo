"use client";

import { motion } from "framer-motion";
import { Building2, ChevronRight, Users, BarChart3, Globe } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Button } from "@/app/components/ui/Button";

export default function OrgHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 pb-12 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold-light/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-stamp-light/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-light border border-gold/15 rounded-full">
                <Building2 className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-medium text-gold-dark">For Organizations & NGOs</span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.08] tracking-tight">
                Scale Maternal Health{" "}
                <span className="text-gold">Across Communities</span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
                Deploy and manage maternal health programs at scale. Recruit CHEWs,
                track patient outcomes, coordinate with healthcare facilities, and
                measure impact — all from one platform.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <a href="/login">
                    Organization Login
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/orgs/register">Register Your Organization</a>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.5}>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { icon: Users, label: "Manage CHEWs" },
                  { icon: BarChart3, label: "Track Outcomes" },
                  { icon: Globe, label: "Multi-LGA Coverage" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-line rounded-lg text-xs font-medium text-ink-soft"
                  >
                    <item.icon className="w-3 h-3 text-gold" />
                    {item.label}
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>

          <FadeInUp delay={0.3} className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative bg-white rounded-2xl border border-line p-8 shadow-paper"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-ink">Your Organization</h3>
                <p className="text-sm text-ink-soft">Program Management Hub</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "CHEW Recruitment & Onboarding", pct: 85 },
                  { label: "Patient Coverage Across LGAs", pct: 72 },
                  { label: "Referral Completion Rate", pct: 91 },
                  { label: "Monthly Active Mothers", pct: 68 },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                    className="p-3 rounded-xl bg-background-soft border border-line/50"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-ink">{item.label}</span>
                      <span className="text-xs font-bold text-gold">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-line/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gold"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-5 p-3 rounded-xl bg-gold-light text-center border border-gold/10"
              >
                <p className="text-sm font-semibold text-gold-dark">
                  Data-Driven Maternal Health Programs
                </p>
              </motion.div>
            </motion.div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
