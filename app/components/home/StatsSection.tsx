"use client";

import {
  Globe2,
  Home,
  Stethoscope,
  HeartHandshake,
} from "lucide-react";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { maternalStats } from "@/lib/data/stats";

const statIcons = [Globe2, Home, Stethoscope, HeartHandshake];

export default function StatsSection() {
  return (
    <Container className="bg-background-soft">
      <FadeInUp>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            The Reality in Numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-[1.15]">
            Why Nigeria Must Act Now
          </h2>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {maternalStats.map((stat, index) => {
          const Icon = statIcons[index] || HeartHandshake;
          const gradients = [
            "from-primary to-primary-dark",
            "from-secondary to-secondary",
            "from-primary/80 to-primary",
            "from-primary to-primary-dark",
          ];

          return (
            <StaggerItem key={stat.label}>
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-28 h-28 -mr-8 -mt-8 rounded-full opacity-5 bg-gradient-to-br from-primary to-primary-dark" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <Icon className="w-5.5 h-5.5 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-2">
                    <span
                      className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[index]}`}
                    >
                      {stat.value}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Container>
  );
}
