"use client";

import { motion } from "framer-motion";
import {
  User,
  Calendar,
  FileText,
  ArrowRightLeft,
  Shield,
  QrCode,
  Bell,
  HeartPulse,
} from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const fields = [
  { icon: User, label: "Patient Profile", desc: "Name, age, contact, next of kin" },
  { icon: Calendar, label: "Expected Due Date", desc: "Tracked from registration" },
  { icon: FileText, label: "Health History", desc: "Appointments, notes, conditions" },
  { icon: ArrowRightLeft, label: "Referrals", desc: "Full referral trail with status" },
  { icon: Shield, label: "CHEW Link", desc: "Assigned community health worker" },
  { icon: Bell, label: "Risk Alerts", desc: "Flagged danger signs and escalation" },
];

export default function DigitalPassport() {
  return (
    <Container className="bg-background-soft">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <FadeInUp>
            <SectionHeading
              badge="Digital Passport"
              title="A Care Identity for Every Mother"
              description="The Digital Maternal Passport is a continuous health record that travels with every mother — from first contact through delivery and beyond."
              align="left"
            />
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <p className="text-sm text-ink-soft leading-relaxed mb-8 max-w-lg">
              No more lost paper records. No more repeating history at every visit.
              The passport gives mothers, CHEWs, and facilities a single source of truth
              for the entire maternal journey.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="grid sm:grid-cols-2 gap-3">
              {fields.map((field) => (
                <div key={field.label} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-line">
                  <div className="w-8 h-8 rounded-lg bg-stamp-light flex items-center justify-center flex-shrink-0">
                    <field.icon className="w-4 h-4 text-stamp" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{field.label}</p>
                    <p className="text-xs text-ink-soft">{field.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.25} className="hidden lg:block">
          <div className="bg-white border border-line rounded-2xl p-8 shadow-paper">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-stamp flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Maternal Passport</p>
                <p className="text-xs text-ink-soft">Digital Health Record</p>
              </div>
              <div className="ml-auto">
                <QrCode className="w-8 h-8 text-ink-faint" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-background-soft border border-line/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-ink">Amina Bello</p>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-leaf text-white rounded-full">ACTIVE</span>
                </div>
                <p className="text-xs text-ink-soft">Age 28 · 32 weeks pregnant</p>
                <p className="text-xs text-ink-soft mt-1">EDD: September 15, 2026</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-stamp-light border border-stamp/10 text-center">
                  <p className="text-lg font-bold text-stamp">6</p>
                  <p className="text-[11px] text-stamp-dark">ANC Visits</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary-light border border-secondary/10 text-center">
                  <p className="text-lg font-bold text-ink">Low</p>
                  <p className="text-[11px] text-ink-soft">Risk Level</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-background-soft border border-line/50">
                <p className="text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-2">Recent Activity</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-leaf" />
                    <p className="text-xs text-ink-soft">ANC visit completed — Aug 10</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-stamp" />
                    <p className="text-xs text-ink-soft">Next appointment — Aug 24</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <p className="text-xs text-ink-soft">CHEW check-in — Aug 8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </Container>
  );
}
