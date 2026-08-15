"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, CheckCircle, Building2 } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";

const stats = [
  { icon: Users, label: "Active CHEWs", value: "24", change: "+3 this month", color: "text-ink" },
  { icon: TrendingUp, label: "Mothers Enrolled", value: "1,284", change: "+186 this quarter", color: "text-gold" },
  { icon: AlertTriangle, label: "High-Risk Cases", value: "12", change: "8 resolved", color: "text-stamp" },
  { icon: CheckCircle, label: "Referrals Completed", value: "94%", change: "Above target", color: "text-leaf" },
];

const recentActivity = [
  { chew: "Amina Bello", action: "Verified 3 new patients", time: "2 hours ago", lga: "Ikeja" },
  { chew: "Fatima Abubakar", action: "Completed referral to General Hospital", time: "4 hours ago", lga: "Mushin" },
  { chew: "Grace Okonkwo", action: "Filed high-risk alert for patient #1247", time: "6 hours ago", lga: "Surulere" },
  { chew: "Blessing Eze", action: "Submitted monthly report", time: "1 day ago", lga: "Yaba" },
];

export default function DashboardPreview() {
  return (
    <Container>
      <FadeInUp>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-gold-dark uppercase tracking-wider mb-2">
            Dashboard Preview
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Your Command Center
          </h2>
          <p className="mt-3 text-ink-soft max-w-2xl mx-auto">
            See everything at a glance — CHEW performance, patient coverage, active alerts, and program health metrics.
          </p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.15}>
        <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-paper">
          <div className="px-6 py-4 border-b border-line flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">MamaConnect Admin</p>
              <p className="text-[11px] text-ink-faint">Organization Dashboard</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  className="p-4 rounded-xl bg-background-soft border border-line/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-2xl font-bold text-ink">{stat.value}</span>
                  </div>
                  <p className="text-xs font-medium text-ink-faint">{stat.label}</p>
                  <p className="text-[11px] text-gold mt-0.5">{stat.change}</p>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-line pt-5">
              <h4 className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">Recent CHEW Activity</h4>
              <div className="space-y-2">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-soft transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink">
                        <span className="font-semibold">{item.chew}</span> — {item.action}
                      </p>
                      <p className="text-[11px] text-ink-faint">{item.time} · {item.lga}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
