"use client";

import { Eye, Zap, Heart, ArrowRight, Globe, HeartPulse, Quote } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./SectionWrapper";

const impacts = [
  {
    icon: Eye,
    label: "Earlier Detection",
    value: "85%",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Zap,
    label: "Faster Response",
    value: "60%",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Heart,
    label: "Better Monitoring",
    value: "3x",
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: ArrowRight,
    label: "Better Healthcare Coordination",
    value: "40%",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Globe,
    label: "Improved Outcomes",
    value: "70%",
    color: "from-cyan-400 to-cyan-600",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    icon: HeartPulse,
    label: "Reduced Maternal Mortality",
    value: "50%",
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

export default function Impact() {
  return (
    <section id="impact" className="section-padding bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Why MamaConnect Matters
            </h2>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {impacts.map((impact) => (
            <StaggerItem key={impact.label}>
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
                <div
                  className={`absolute top-0 right-0 w-28 h-28 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br ${impact.color}`}
                />
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-xl ${impact.bg} flex items-center justify-center mb-4`}
                  >
                    <impact.icon className={`w-5.5 h-5.5 ${impact.iconColor}`} />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">
                    <span
                      className={`text-transparent bg-clip-text bg-gradient-to-r ${impact.color}`}
                    >
                      {impact.value}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {impact.label}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.3}>
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Quote className="w-8 h-8 text-emerald-200" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900 leading-tight pt-6">
              Every early intervention is an opportunity to save a life.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}