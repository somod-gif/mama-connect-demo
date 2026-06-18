"use client";

import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiPostgresql,
  SiWhatsapp,
} from "react-icons/si";
import {
  Smartphone,
  MessageCircle,
  Phone,
  Database,
  Cpu,
  Globe,
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./SectionWrapper";

const categories = [
  {
    title: "Frontend",
    color: "from-emerald-400 to-emerald-600",
    techs: [
      { name: "Next.js", icon: SiNextdotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "TailwindCSS", icon: SiTailwindcss },
    ],
  },
  {
    title: "Backend",
    color: "from-blue-400 to-blue-600",
    techs: [
      { name: "Python", icon: SiPython },
      { name: "FastAPI", icon: SiPython },
    ],
  },
  {
    title: "Database",
    color: "from-purple-400 to-purple-600",
    techs: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Neon", icon: Database },
    ],
  },
  {
    title: "Communication",
    color: "from-amber-400 to-amber-600",
    techs: [
      { name: "WhatsApp", icon: SiWhatsapp },
      { name: "USSD", icon: Smartphone },
      { name: "SMS", icon: MessageCircle },
      { name: "IVR", icon: Phone },
    ],
  },
  {
    title: "AI Assistance",
    color: "from-cyan-400 to-cyan-600",
    techs: [
      { name: "Risk Assessment", icon: Cpu },
      { name: "Nutrition Recommendations", icon: Cpu },
      { name: "Language Support", icon: Globe },
    ],
  },
];

export default function Technology() {
  return (
    <section id="technology" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Built for Accessibility and Scale
            </h2>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((category) => (
            <StaggerItem key={category.title}>
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
                <div className={`h-1.5 w-full bg-gradient-to-r ${category.color}`} />
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.techs.map((tech) => {
                      const IconComponent = tech.icon;
                      return (
                        <div key={tech.name} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {tech.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}