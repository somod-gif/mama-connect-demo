"use client";

import { motion } from "framer-motion";
import { Stethoscope, ChevronRight, HeartPulse, ArrowRightLeft, ShieldCheck } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Button } from "@/app/components/ui/Button";

export default function HealthcareHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 pb-12 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-leaf-light/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-stamp-light/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-leaf-light border border-leaf/15 rounded-full">
                <Stethoscope className="w-3.5 h-3.5 text-leaf" />
                <span className="text-xs font-medium text-leaf-dark">For Healthcare Facilities</span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.08] tracking-tight">
                Receive Referrals,{" "}
                <span className="text-leaf">Save Lives</span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
                Connect your facility to the MamaConnect referral network. Receive
                patient referrals from CHEWs, access health records, coordinate
                emergency response, and track treatment outcomes.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="/orgs/register">
                    Register Facility
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#referral-flow">How Referrals Work</a>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.5}>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { icon: ArrowRightLeft, label: "CHEW Referrals" },
                  { icon: HeartPulse, label: "Emergency Alerts" },
                  { icon: ShieldCheck, label: "Verified Patients" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-line rounded-lg text-xs font-medium text-ink-soft"
                  >
                    <item.icon className="w-3 h-3 text-leaf" />
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-leaf to-leaf-dark flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-ink">Referral Portal</h3>
                <p className="text-sm text-ink-soft">Incoming Patient Referrals</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Amina Bello", reason: "Pre-eclampsia symptoms", severity: "HIGH", time: "12 min ago" },
                  { name: "Chioma Okafor", reason: "Routine ANC checkup", severity: "LOW", time: "1 hour ago" },
                  { name: "Fatima Yusuf", reason: "Anemia — hemoglobin check", severity: "MEDIUM", time: "3 hours ago" },
                  { name: "Blessing Daniel", reason: "Post-natal follow-up", severity: "LOW", time: "5 hours ago" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background-soft border border-line/50"
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        item.severity === "HIGH" ? "bg-stamp" : item.severity === "MEDIUM" ? "bg-gold" : "bg-leaf"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                      <p className="text-[11px] text-ink-faint">{item.reason}</p>
                    </div>
                    <span className="text-[10px] text-ink-faint whitespace-nowrap">{item.time}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-5 p-3 rounded-xl bg-leaf-light text-center border border-leaf/10"
              >
                <p className="text-sm font-semibold text-leaf-dark">
                  Connected to 24 CHEWs Across 6 LGAs
                </p>
              </motion.div>
            </motion.div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
