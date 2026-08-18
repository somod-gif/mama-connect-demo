"use client";

import { motion } from "framer-motion";
import { TrendingUp, Calendar, Heart, AlertTriangle } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";

const outcomes = [
  {
    icon: Heart,
    label: "Mothers Enrolled",
    value: "3,420",
    trend: "+24% vs last quarter",
    bar: 78,
    color: "bg-stamp",
  },
  {
    icon: Calendar,
    label: "ANC Attendance Rate",
    value: "87%",
    trend: "+5% improvement",
    bar: 87,
    color: "bg-leaf",
  },
  {
    icon: AlertTriangle,
    label: "Risk Cases Detected",
    value: "156",
    trend: "92% resolved promptly",
    bar: 92,
    color: "bg-gold",
  },
  {
    icon: TrendingUp,
    label: "Referral Completion",
    value: "94%",
    trend: "Above 90% target",
    bar: 94,
    color: "bg-ink",
  },
];

export default function OutcomesTracking() {
  return (
    <Container>
      <FadeInUp>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-gold-dark uppercase tracking-wider mb-2">
            Impact Measurement
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Track What Matters
          </h2>
          <p className="mt-3 text-ink-soft max-w-2xl mx-auto">
            Real-time dashboards and exportable reports help you demonstrate impact
            to donors, partners, and government stakeholders.
          </p>
        </div>
      </FadeInUp>

      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {outcomes.map((item, i) => (
          <FadeInUp key={item.label} delay={i * 0.1}>
            <div className="bg-white border border-line rounded-xl p-6 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.label}</p>
                    <p className="text-[11px] text-gold">{item.trend}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-ink">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-line/50 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.bar}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>
    </Container>
  );
}
