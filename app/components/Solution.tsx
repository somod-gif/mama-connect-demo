"use client";

import {
  Shield,
  BookOpen,
  Activity,
  ArrowRight,
  Building2,
  Bell,
  Heart,
  Apple,
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./SectionWrapper";

const benefits = [
  {
    icon: Shield,
    label: "Early Risk Detection",
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: BookOpen,
    label: "Maternal Education",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Activity,
    label: "Continuous Monitoring",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: ArrowRight,
    label: "Faster Referrals",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Bell,
    label: "Emergency Coordination",
    color: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Apple,
    label: "Nutrition Guidance",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Our Solution
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Introducing MamaConnect
            </h2>
            <p className="text-lg text-slate-500 mb-3">
              A Human-Centered Maternal Care Network
            </p>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              MamaConnect connects mothers, Community Health Extension Workers
              (CHEWs), Primary Healthcare Centres, clinics, and hospitals
              through one coordinated maternal healthcare ecosystem.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.label}>
              <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 card-shadow hover:card-shadow-hover hover:border-emerald-200 transition-all duration-300">
                <div
                  className={`w-12 h-12 rounded-xl ${benefit.color} flex items-center justify-center flex-shrink-0`}
                >
                  <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {benefit.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}