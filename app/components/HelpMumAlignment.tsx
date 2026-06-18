"use client";

import { Heart, Globe, BookOpen, Users, Building2, TrendingUp, Shield } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "./SectionWrapper";

const highlights = [
  { icon: Heart, label: "Community Healthcare First", color: "bg-emerald-100", iconColor: "text-emerald-600" },
  { icon: BookOpen, label: "Maternal Health Education", color: "bg-blue-100", iconColor: "text-blue-600" },
  { icon: Globe, label: "Local Language Accessibility", color: "bg-amber-100", iconColor: "text-amber-600" },
  { icon: Users, label: "CHEW Empowerment", color: "bg-purple-100", iconColor: "text-purple-600" },
  { icon: Building2, label: "Digital Inclusion", color: "bg-cyan-100", iconColor: "text-cyan-600" },
  { icon: TrendingUp, label: "Improved Maternal Monitoring", color: "bg-rose-100", iconColor: "text-rose-600" },
];

export default function HelpMumAlignment() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeInLeft>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Strategic Alignment
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Built to Extend Community Healthcare Impact
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                MamaConnect aligns with HelpMum's mission by strengthening
                the connection between mothers, Community Health Extension
                Workers, Primary Healthcare Centres, clinics, and hospitals.
              </p>

              <div className="space-y-3">
                {highlights.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInLeft>

          <FadeInRight>
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-6 -left-6 w-56 h-56 rounded-full bg-emerald-50 opacity-60" />
                <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-blue-50 opacity-60" />

                <div className="relative bg-white rounded-3xl border border-slate-200 p-8 card-shadow">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl gradient-green-blue flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">MamaConnect</h3>
                    <p className="text-sm text-slate-500">+ HelpMum Mission</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-green-blue-soft">
                      <div className="w-8 h-8 rounded-lg bg-emerald-200/50 flex items-center justify-center">
                        <Users className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Mothers in Community
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
                      <div className="w-8 h-8 rounded-lg bg-blue-200/50 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-700" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Community Health Workers
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50">
                      <div className="w-8 h-8 rounded-lg bg-amber-200/50 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-amber-700" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Healthcare Facilities
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 rounded-xl bg-gradient-green-blue-soft text-center">
                    <p className="text-sm font-semibold text-emerald-700">
                      Reducing Preventable Maternal Deaths
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInRight>
        </div>
      </div>
    </section>
  );
}