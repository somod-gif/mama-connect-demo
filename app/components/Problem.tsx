"use client";

import {
  Globe2,
  Home,
  Stethoscope,
  HeartHandshake,
  AlertTriangle,
} from "lucide-react";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "./SectionWrapper";

const stats = [
  {
    value: "28%",
    label: "Nigeria accounts for a significant share of global maternal deaths.",
    icon: Globe2,
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    value: "59%",
    label: "Births occur outside healthcare facilities.",
    icon: Home,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    value: "43%",
    label: "Births attended by skilled health workers.",
    icon: Stethoscope,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "Preventable",
    label: "Many maternal deaths can be prevented through earlier intervention.",
    icon: HeartHandshake,
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
              <AlertTriangle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                The Challenge
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              The Maternal Health Challenge
            </h2>
            <p className="text-lg text-slate-500">
              Thousands of maternal deaths remain preventable.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
                <div
                  className={`absolute top-0 right-0 w-28 h-28 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${stat.gradient}`}
                />
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}
                  >
                    <stat.icon className={`w-5.5 h-5.5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-2">
                    <span
                      className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}
                    >
                      {stat.value}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.3}>
          <div className="text-center max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-green-blue-soft border border-slate-200/60">
            <p className="text-lg md:text-xl text-slate-800 font-semibold leading-relaxed">
              The problem is not the absence of healthcare.
            </p>
            <p className="text-base text-rose-600 font-medium mt-2">
              The problem is delayed detection, delayed communication, and
              delayed intervention.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}