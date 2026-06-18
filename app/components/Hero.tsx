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
import { FadeInUp, FadeInLeft, FadeInRight, ScaleIn } from "./SectionWrapper";

const trustIndicators = [
  { icon: MessageCircle, label: "WhatsApp Accessible" },
  { icon: Smartphone, label: "USSD Enabled" },
  { icon: Globe, label: "English Support" },
  { icon: Globe, label: "Nigerian Pidgin Support" },
  { icon: Globe, label: "Hausa Support" },
  { icon: Globe, label: "Yoruba Support" },
  { icon: Globe, label: "Igbo Support" },
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80 pt-20">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full bg-emerald-50/30 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <FadeInUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full">
                <HeartPulse className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 tracking-tight">
                  Maternal Health Innovation for Underserved Communities
                </span>
              </div>
            </FadeInUp>

            <FadeInLeft delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                  MamaConnect
                </span>
              </h1>
            </FadeInLeft>

            <FadeInLeft delay={0.3}>
              <p className="text-xl sm:text-2xl font-semibold text-slate-800 leading-snug">
                Human-Centered, AI-Assisted Maternal Health Platform
              </p>
            </FadeInLeft>

            <FadeInLeft delay={0.35}>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Detecting Danger Early. Connecting Mothers to Life-Saving Care.
                MamaConnect helps pregnant women, Community Health Extension
                Workers (CHEWs), and healthcare facilities work together to detect
                risks early, coordinate care, and improve maternal health outcomes
                across underserved communities.
              </p>
            </FadeInLeft>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold gradient-green-blue rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Explore Demo
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 text-emerald-700 font-semibold bg-white border-2 border-emerald-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  See How It Works
                </a>
              </div>
            </FadeInUp>

            {/* Trust Indicators */}
            <FadeInUp delay={0.5}>
              <div className="pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  Access for everyone
                </p>
                <div className="flex flex-wrap gap-2">
                  {trustIndicators.map((item) => (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm"
                    >
                      <item.icon className="w-3.5 h-3.5 text-emerald-500" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Right Visual - Ecosystem Diagram */}
          <FadeInRight delay={0.3} className="hidden lg:block">
            <div className="relative">
              {/* Floating decorative elements */}
              <div className="absolute -top-8 -right-8 w-72 h-72 rounded-full bg-emerald-100/20 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-72 h-72 rounded-full bg-blue-100/20 blur-2xl" />

              <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-xl">
                <div className="space-y-0">
                  {ecosystemSteps.map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay, duration: 0.5 }}
                      className="flex items-center"
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {step.label}
                        </p>
                      </div>
                      {index < ecosystemSteps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-slate-200 to-slate-100" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Connecting vertical line */}
                <svg className="absolute left-6 top-12 w-0.5 h-[calc(100%-5rem)]" style={{ transform: "translateX(-0.5px)" }}>
                  <line x1="0" y1="0" x2="0" y2="100%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </FadeInRight>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}