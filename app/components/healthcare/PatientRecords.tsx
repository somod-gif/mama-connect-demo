"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, Pill, AlertTriangle, Heart, Activity } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";

const records = [
  { icon: Calendar, label: "ANC Visits", value: "6 of 8 completed", color: "text-leaf" },
  { icon: Activity, label: "Blood Pressure", value: "130/85 — Elevated", color: "text-gold" },
  { icon: Pill, label: "Medications", value: "Iron supplements, Folic acid", color: "text-ink" },
  { icon: Heart, label: "Fetal Heart Rate", value: "142 bpm — Normal", color: "text-stamp" },
  { icon: AlertTriangle, label: "Risk Flags", value: "Pre-eclampsia screening pending", color: "text-gold" },
  { icon: FileText, label: "Lab Results", value: "Hemoglobin: 10.2 g/dL", color: "text-ink" },
];

export default function PatientRecords() {
  return (
    <Container className="bg-background-soft">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <FadeInUp>
          <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-paper">
            <div className="px-5 py-3 border-b border-line bg-background-soft">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stamp flex items-center justify-center text-xs font-bold text-white">AB</div>
                <div>
                  <p className="text-sm font-bold text-ink">Amina Bello</p>
                  <p className="text-[11px] text-ink-faint">MID-2024-0847 · 28 weeks</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {records.map((record, i) => (
                <motion.div
                  key={record.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background-soft"
                >
                  <record.icon className={`w-4 h-4 ${record.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-ink-faint uppercase tracking-wider">{record.label}</p>
                    <p className="text-sm text-ink truncate">{record.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInUp>

        <div>
          <FadeInUp>
            <p className="text-xs font-semibold text-leaf-dark uppercase tracking-wider mb-2">
              Patient Context
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mb-4">
              Full Health Records at Your Fingertips
            </h2>
            <p className="text-ink-soft leading-relaxed mb-8">
              When a CHEW refers a patient to your facility, you receive their
              complete maternal health record — antenatal visits, measurements,
              risk flags, and medication history. No paperwork, no phone tag.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-4">
              {[
                { title: "Maternal Passport", desc: "Complete pregnancy record including LMP, EDD, gravida, parity, and care status." },
                { title: "Check-in History", desc: "Weekly self-reported symptoms, measurements, and CHEW observations over time." },
                { title: "Risk Profile", desc: "AI-flagged risk factors based on symptoms, history, and clinical thresholds." },
                { title: "Referral Notes", desc: "Clinical context from the referring CHEW with reason and urgency level." },
              ].map((item, i) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-leaf mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    <p className="text-sm text-ink-soft">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </div>
    </Container>
  );
}
