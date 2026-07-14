"use client";

import {
  Cpu,
  Globe,
  Heart,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
} from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const aiCapabilities = [
  {
    icon: BookOpen,
    title: "Maternal Health Education",
    description:
      "AI supports personalized educational content delivery, powered by HelpMum's MamaBot AI and MamaBot Llama models for domain-specific maternal health knowledge.",
  },
  {
    icon: Globe,
    title: "Multilingual Translation",
    description:
      "Automatic translation across English, Pidgin, Yoruba, Hausa, and Igbo ensures every mother receives care in her preferred language.",
  },
  {
    icon: Heart,
    title: "Nutrition Recommendations",
    description:
      "AI analyzes pregnancy stage, symptoms, and regional food availability to suggest affordable, locally available nutrition options.",
  },
  {
    icon: Cpu,
    title: "Risk Categorization",
    description:
      "Responses are intelligently categorized into low, medium, or high risk, enabling CHEWs to prioritize and act on urgent cases immediately.",
  },
  {
    icon: Sparkles,
    title: "AI-Provider Agnostic",
    description:
      "MamaConnect integrates with OpenAI, Gemini, Groq, and DeepSeek, selecting the best available provider. For maternal expertise, we use HelpMum's MamaBot and VaxAI models.",
  },
];

export default function TechnologySection() {
  return (
    <Container id="technology" className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="Technology"
          title="AI That Supports, Not Replaces"
          description="Technology empowers healthcare workers. It never makes medical decisions."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <FadeInLeft>
          <div className="space-y-6">
            {aiCapabilities.map((cap) => (
              <Card key={cap.title} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </FadeInLeft>

        <FadeInRight className="hidden lg:block">
          <div className="sticky top-28">
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Human-Centered, AI-Assisted
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Every medical decision is made by healthcare professionals.
                  AI simply provides information, translations, and risk
                  indicators to support their expertise.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-light border border-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Healthcare Workers Decide
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All clinical decisions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary-light border border-secondary/10">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      AI Assists
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Information, translation, risk cues
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Maternal health expertise powered by <strong className="text-foreground">HelpMum</strong>&apos;s
                   <strong>MamaBot AI,  VaxAI,</strong> models.
                </p>
              </div>
            </Card>
          </div>
        </FadeInRight>
      </div>
    </Container>
  );
}
