"use client";

import { Cpu, Globe, Heart, BookOpen, Sparkles, ShieldCheck, Calendar, MapPin, User } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

const aiCapabilities = [
  {
    icon: BookOpen,
    title: "Maternal Health Education",
    description: "Personalized educational content delivered at every stage of pregnancy and postpartum recovery.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Automatic translation across English, Pidgin, Yoruba, Hausa, and Igbo — care in every mother's language.",
  },
  {
    icon: Heart,
    title: "Nutrition Guidance",
    description: "AI analyzes pregnancy stage and regional food availability to suggest affordable, locally available nutrition.",
  },
  {
    icon: Cpu,
    title: "Early Warning Cues",
    description: "Responses are categorized by risk level, enabling CHEWs to prioritize and act on urgent cases immediately.",
  },
];

const personalizationFactors = [
  { icon: Calendar, label: "Pregnancy Stage", desc: "Content adapts as the mother progresses" },
  { icon: Globe, label: "Language", desc: "Auto-translated across 5 Nigerian languages" },
  { icon: MapPin, label: "Location", desc: "Region-specific nutrition and nearby facilities" },
  { icon: User, label: "User Context", desc: "Tailored for first-time vs. experienced mothers" },
];

export default function AiAssistant() {
  return (
    <Container id="ai" className="bg-white">
      <FadeInUp>
        <SectionHeading
          badge="AI Assistant"
          title="AI That Supports, Not Replaces"
          description="Technology empowers healthcare workers. It never makes medical decisions."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <FadeInLeft>
          <div className="space-y-4 mb-8">
            {aiCapabilities.map((cap) => (
              <div key={cap.title} className="flex items-start gap-4 p-4 rounded-xl border border-line hover:border-border-hover hover:shadow-card transition-all">
                <div className="w-10 h-10 rounded-xl bg-stamp-light flex items-center justify-center flex-shrink-0">
                  <cap.icon className="w-5 h-5 text-stamp" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-1">{cap.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{cap.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-background-soft border border-line">
            <p className="text-xs font-semibold text-ink mb-3">Personalized for every mother</p>
            <div className="grid grid-cols-2 gap-2">
              {personalizationFactors.map((f) => (
                <div key={f.label} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-line/50">
                  <f.icon className="w-3.5 h-3.5 text-stamp flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-ink">{f.label}</p>
                    <p className="text-[10px] text-ink-soft">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInLeft>

        <FadeInRight className="hidden lg:block">
          <div className="sticky top-28">
            <div className="bg-white border border-line rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stamp to-stamp-dark flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-ink">Human-Centered, AI-Assisted</h3>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                  Every medical decision is made by healthcare professionals.
                  AI provides information, translations, and risk indicators to support their expertise.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stamp-light border border-stamp/10">
                  <div className="w-8 h-8 rounded-lg bg-stamp/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-stamp" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">Healthcare Professionals Decide</p>
                    <p className="text-xs text-ink-soft">Diagnosis, treatment, clinical decisions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary-light border border-ink/5">
                  <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-ink" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">AI Assists</p>
                    <p className="text-xs text-ink-soft">Info, translation, personalization, risk cues</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-line">
                <div className="flex items-center justify-center gap-2 text-xs text-ink-soft">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AI safety boundaries enforced at every layer</span>
                </div>
              </div>
            </div>
          </div>
        </FadeInRight>
      </div>
    </Container>
  );
}
