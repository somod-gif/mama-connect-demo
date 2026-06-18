"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  Play,
  MessageCircle,
  Smartphone,
  Globe,
  Users,
  Shield,
  HeartPulse,
  User,
  Building2,
} from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "./SectionWrapper";

const trustIndicators = [
  { icon: MessageCircle, label: "WhatsApp Accessible" },
  { icon: Smartphone, label: "USSD Enabled" },
  { icon: Globe, label: "5 Language Support" },
  { icon: Users, label: "Community Health Worker Driven" },
];

const ecosystemSteps = [
  { label: "Pregnant Woman", icon: User, color: "from-emerald-400 to-emerald-600", delay: 0 },
  { label: "MamaConnect", icon: Shield, color: "from-blue-400 to-blue-600", delay: 0.5 },
  { label: "CHEW", icon: Users, color: "from-emerald-400 to-green-600", delay: 1 },
  { label: "PHC", icon: Building2, color: "from-amber-400 to-amber-600", delay: 1.5 },
  { label: "Hospital", icon: HeartPulse, color: "from-rose-400 to-rose-600", delay: 2 },
  { label: "Safe Delivery", icon: Shield, color: "from-emerald-400 to-emerald-600", delay: 2.5 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80 pt-24 pb-12">
      {/* Clean background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="space-y-7">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">
                  Maternal Health Innovation
                </span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                  MamaConnect
                </span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-lg sm:text-xl font-medium text-slate-700 leading-snug">
                Human-Centered, AI-Assisted Maternal Health Platform
              </p>
            </FadeInLeft>

            <FadeInLeft delay={0.35}>
              <p className="text-base text-slate-500 leading-relaxed max-w-lg">
                Detecting Danger Early. Connecting Mothers to Life-Saving Care.
                A coordinated network connecting pregnant women, CHEWs, and
                healthcare facilities across underserved communities.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-green-blue rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Explore Demo
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                >
                  How It Works
                </a>
              </div>
            </FadeInUp>

            {/* Trust Indicators - Compact */}
            <FadeInUp delay={0.5}>
              <div className="flex flex-wrap gap-2 pt-2">
                {trustIndicators.map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-500"
                  >
                    <item.icon className="w-3 h-3 text-emerald-500" />
                    {item.label}
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>

          {/* Right Visual - Clean Ecosystem Card */}
          <FadeInRight delay={0.3} className="hidden lg:block">
            <div className="relative">
              <div className="relative bg-white rounded-2xl border border-slate-200/80 p-6 shadow-lg">
                <div className="space-y-0">
                  {ecosystemSteps.map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay, duration: 0.4 }}
                      className="flex items-center relative"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3.5">
                        <p className="text-sm font-semibold text-slate-800">
                          {step.label}
                        </p>
                      </div>
                      {index < ecosystemSteps.length - 1 && (
                        <div className="absolute left-5 top-10 w-px h-6 bg-slate-200" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInRight>
        </div>
      </div>
    </section>
  );
}