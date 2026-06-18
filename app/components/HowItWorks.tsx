"use client";

import {
  UserRound,
  ShieldPlus,
  Building2,
  MessageCircle,
  Smartphone,
  Globe,
  BookOpen,
  Activity,
  AlertTriangle,
  Heart,
  Baby,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeInUp, FadeInLeft, FadeInRight } from "./SectionWrapper";

const regions = [
  { name: "Northern Nigeria", foods: "Millet, Beans, Moringa" },
  { name: "South-West", foods: "Beans, Vegetables, Traditional Nutritious Meals" },
  { name: "South-East", foods: "Vegetables, Fish, Local Protein Sources" },
];

const layers = [
  {
    title: "Pregnant Women",
    icon: UserRound,
    gradient: "from-emerald-400 to-emerald-600",
    lightBg: "bg-emerald-50/50",
    borderColor: "border-emerald-200",
    features: [
      {
        label: "Weekly Health Check-ins",
        desc: "Every registered woman receives a short weekly health check-in through WhatsApp or USSD.",
        icon: MessageCircle,
      },
      {
        label: "Maternal Education Library",
        desc: "Access educational content covering: Pregnancy Care, Birth Preparedness, Danger Signs, Postnatal Care, Newborn Health.",
        icon: BookOpen,
        items: [
          "Pregnancy Care",
          "Birth Preparedness",
          "Danger Signs",
          "Postnatal Care",
          "Newborn Health",
        ],
      },
      {
        label: "WhatsApp Health Monitoring Assistant",
        desc: "A conversational assistant supports mothers between check-ins and encourages continuous engagement.",
        icon: MessageCircle,
      },
      {
        label: "Risk Monitoring",
        desc: "Responses are categorized into:",
        icon: Activity,
        risks: [
          { label: "Low Risk", color: "text-emerald-600", dot: "bg-emerald-500" },
          { label: "Medium Risk", color: "text-amber-600", dot: "bg-amber-500" },
          { label: "High Risk", color: "text-rose-600", dot: "bg-rose-500" },
        ],
      },
      {
        label: "AI-Assisted Maternal Nutrition Support",
        desc: "Provide affordable, region-specific nutritional recommendations based on Pregnancy Stage, Symptoms, Nutritional Needs, and Geographic Region.",
        icon: Heart,
        regions: regions,
      },
    ],
    access: [
      { icon: MessageCircle, label: "WhatsApp" },
      { icon: Smartphone, label: "USSD" },
      { icon: Globe, label: "Mobile App" },
    ],
  },
  {
    title: "Community Health Extension Workers (CHEWs)",
    icon: ShieldPlus,
    gradient: "from-blue-400 to-blue-600",
    lightBg: "bg-blue-50/50",
    borderColor: "border-blue-200",
    features: [
      {
        label: "Patient Dashboard",
        desc: "View and manage assigned patients in one centralized dashboard.",
        icon: UserRound,
      },
      {
        label: "Risk Alerts",
        desc: "When a mother becomes high risk, her assigned CHEW is notified immediately.",
        icon: AlertTriangle,
      },
      {
        label: "Follow-Up Management",
        desc: "Schedule and track follow-up visits with patients.",
        icon: Activity,
      },
      {
        label: "Home Visit Coordination",
        desc: "Coordinate home visits for at-risk mothers in the community.",
        icon: Baby,
      },
      {
        label: "Maternal Monitoring",
        desc: "Monitor vital signs and symptoms reported by patients continuously.",
        icon: Heart,
      },
    ],
    access: [
      { icon: Smartphone, label: "Mobile App" },
      { icon: Globe, label: "Web Dashboard" },
    ],
  },
  {
    title: "Clinics & Hospitals",
    icon: Building2,
    gradient: "from-purple-400 to-purple-600",
    lightBg: "bg-purple-50/50",
    borderColor: "border-purple-200",
    features: [
      {
        label: "Referrals",
        desc: "Receive referrals from CHEWs and community health workers.",
        icon: UserRound,
      },
      {
        label: "Escalations",
        desc: "Handle escalated critical cases requiring immediate medical attention.",
        icon: AlertTriangle,
      },
      {
        label: "Emergency Support",
        desc: "Coordinate emergency response for high-risk pregnancies.",
        icon: Activity,
      },
      {
        label: "Treatment Coordination",
        desc: "Coordinate treatment plans with CHEWs and community health workers.",
        icon: Heart,
      },
    ],
    access: [
      { icon: Globe, label: "Referral Portal" },
      { icon: Smartphone, label: "Alert System" },
    ],
  },
];

function LayerCard({ layer, index }: { layer: typeof layers[0]; index: number }) {
  const Animation = index === 0 ? FadeInLeft : index === 2 ? FadeInRight : FadeInUp;

  return (
    <Animation>
      <div
        className={`group relative overflow-hidden rounded-2xl bg-white border ${layer.borderColor} card-shadow transition-all duration-300 h-full`}
      >
        {/* Gradient top bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${layer.gradient}`} />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl ${layer.lightBg} flex items-center justify-center`}
            >
              <layer.icon className={`w-7 h-7 text-transparent bg-clip-text bg-gradient-to-r ${layer.gradient}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Layer {index + 1}
              </p>
              <h3 className="text-lg font-bold text-slate-900">{layer.title}</h3>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-5">
            {layer.features.map((feature, fi) => (
              <div key={fi} className="space-y-2">
                <div className="flex items-start gap-2.5">
                  {feature.icon ? (
                    <feature.icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {feature.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>

                {/* Education items */}
                {"items" in feature && feature.items && (
                  <div className="ml-7 flex flex-wrap gap-1.5">
                    {feature.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Risk levels */}
                {"risks" in feature && feature.risks && (
                  <div className="ml-7 flex flex-wrap gap-3">
                    {feature.risks.map((risk) => (
                      <span
                        key={risk.label}
                        className="inline-flex items-center gap-1.5 text-xs font-medium"
                      >
                        <span className={`w-2 h-2 rounded-full ${risk.dot}`} />
                        <span className={risk.color}>{risk.label}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Nutrition regions */}
                {"regions" in feature && feature.regions && (
                  <div className="ml-7 space-y-1.5">
                    {feature.regions.map((region) => (
                      <div
                        key={region.name}
                        className="text-xs text-slate-600 flex gap-2"
                      >
                        <span className="font-semibold text-slate-700 flex-shrink-0">
                          {region.name}:
                        </span>
                        <span className="text-slate-500">{region.foods}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Access Channels */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Access Channels
            </p>
            <div className="flex flex-wrap gap-2">
              {layer.access.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-medium text-slate-600"
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Animation>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Connecting Mothers to Timely Care
            </h2>
            <p className="text-lg text-slate-500">
              Three Layers. One Coordinated Maternal Health Ecosystem.
            </p>
          </div>
        </FadeInUp>

        <div className="grid lg:grid-cols-3 gap-8">
          {layers.map((layer, index) => (
            <LayerCard key={layer.title} layer={layer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}