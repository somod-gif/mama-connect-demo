"use client";

import { AlertTriangle } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";

export default function ProblemSection() {
  return (
    <Container id="problem" className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="The Challenge"
          title="The Maternal Health Challenge"
          description="Thousands of maternal deaths remain preventable in Nigeria."
        />
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <div className="max-w-3xl mx-auto">
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary-light via-white to-secondary-light border border-border/60">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-xl text-foreground font-semibold leading-relaxed">
                  The problem is not the absence of healthcare.
                </p>
                <p className="text-base text-primary-dark font-medium mt-2 leading-relaxed">
                  The problem is delayed detection, delayed communication, and
                  delayed intervention. Mothers die because warning signs are
                  missed and help arrives too late.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
