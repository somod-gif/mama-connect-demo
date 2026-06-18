"use client";

import { AlertCircle, Clock } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "./SectionWrapper";

const dangerSigns = [
  "Bleeding",
  "Swelling",
  "Severe Headaches",
  "Fever",
  "Reduced Fetal Movement",
];

const responseIssues = [
  "Paper Records",
  "Delayed Follow-Up",
  "No Real-Time Alerts",
  "Late Referrals",
  "Delayed Intervention",
];

export default function ProblemBreakdown() {
  return (
    <section className="section-padding bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Why Mothers Are Still Dying
            </h2>
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeInLeft>
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
              <div className="absolute top-0 right-0 w-36 h-36 -mr-12 -mt-12 rounded-full bg-rose-50" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                  <AlertCircle className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Danger Signs Go Undetected
                </h3>
                <ul className="space-y-3 mb-6">
                  {dangerSigns.map((sign) => (
                    <li key={sign} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-sm text-slate-600">{sign}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Many women miss critical warning signs until complications
                  become life-threatening.
                </p>
              </div>
            </div>
          </FadeInLeft>

          <FadeInRight>
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
              <div className="absolute top-0 right-0 w-36 h-36 -mr-12 -mt-12 rounded-full bg-amber-50" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Lack of Rapid Response
                </h3>
                <ul className="space-y-3 mb-6">
                  {responseIssues.map((issue) => (
                    <li key={issue} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-sm text-slate-600">{issue}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Community healthcare workers often lack the tools needed to
                  act quickly.
                </p>
              </div>
            </div>
          </FadeInRight>
        </div>
      </div>
    </section>
  );
}