"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Smartphone,
  Globe,
  MessageCircle,
  AlertTriangle,
  Activity,
  Bell,
  Phone,
  Building2,
  Heart,
  ThumbsDown,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { FadeInUp } from "./SectionWrapper";

const languages = [
  "English",
  "Nigerian Pidgin",
  "Hausa",
  "Yoruba",
  "Igbo",
];

const steps = [
  {
    label: "Pregnant",
    title: "Amina is 7 months pregnant.",
    icon: User,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    label: "Access",
    title: "She dials the MamaConnect USSD code or opens WhatsApp.",
    icon: Smartphone,
    color: "from-blue-400 to-blue-600",
  },
  {
    label: "Language",
    title: "She selects her preferred language:",
    icon: Globe,
    color: "from-purple-400 to-purple-600",
    hasLanguages: true,
  },
  {
    label: "Check-in",
    title: "She answers simple maternal health questions.",
    icon: MessageCircle,
    color: "from-cyan-400 to-cyan-600",
  },
  {
    label: "Symptoms",
    title: "She reports: Severe Headache, Swollen Feet.",
    icon: AlertTriangle,
    color: "from-amber-400 to-amber-600",
  },
  {
    label: "Classified",
    title: "The system classifies her as high risk.",
    icon: Activity,
    color: "from-rose-400 to-rose-600",
  },
  {
    label: "Alerted",
    title: "Her assigned CHEW receives an alert.",
    icon: Bell,
    color: "from-orange-400 to-orange-600",
  },
  {
    label: "Contacted",
    title: "The CHEW contacts her immediately.",
    icon: Phone,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    label: "PHC",
    title: "The nearest PHC is identified.",
    icon: Building2,
    color: "from-blue-400 to-blue-600",
  },
  {
    label: "Referred",
    title: "If necessary, she is referred to a hospital.",
    icon: Heart,
    color: "from-rose-400 to-rose-600",
  },
];

export default function UserStory() {
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = steps[activeStep];
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Meet Amina
            </h2>
            <p className="text-lg text-slate-500">
              A Real Maternal Care Journey
            </p>
          </div>
        </FadeInUp>

        {/* Desktop Timeline */}
        <div className="hidden md:block mb-10">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200">
              <motion.div
                className="h-full gradient-green-blue"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(activeStep / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <motion.div
                    className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      index <= activeStep
                        ? "gradient-green-blue shadow-lg"
                        : "bg-white border-2 border-slate-200 shadow-sm"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index < activeStep ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon
                        className={`w-5 h-5 ${
                          index === activeStep ? "text-white" : "text-slate-400"
                        }`}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium text-center max-w-[70px] leading-tight ${
                      index <= activeStep ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Step Content */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 card-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center flex-shrink-0`}
                >
                  <currentStep.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                    Step {activeStep + 1} of {steps.length}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {currentStep.title}
                  </p>

                  {/* Language selection display */}
                  {currentStep.hasLanguages && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={isFirst}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Step indicator */}
          <span className="text-sm text-slate-400 font-medium px-4">
            {activeStep + 1} / {steps.length}
          </span>

          <button
            onClick={() =>
              setActiveStep(Math.min(steps.length - 1, activeStep + 1))
            }
            disabled={isLast}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white gradient-green-blue rounded-xl hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile compact steps */}
        <div className="md:hidden mb-10">
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeStep
                    ? "w-8 bg-emerald-500"
                    : index < activeStep
                    ? "bg-emerald-300"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Outcome Comparison */}
        <FadeInUp>
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Outcome
            </p>
            <p className="text-center text-lg font-semibold text-slate-800 mb-6">
              Amina receives care before complications become severe.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-semibold text-rose-700">
                    Without MamaConnect
                  </span>
                </div>
                <p className="text-sm text-rose-600">
                  Symptoms may go unnoticed.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-700">
                    With MamaConnect
                  </span>
                </div>
                <p className="text-sm text-emerald-600">
                  Early detection leads to timely intervention.
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}