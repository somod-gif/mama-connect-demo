"use client";

import { ArrowRight, HeartPulse, Mail, Phone } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";

export default function FinalCTA() {
  return (
    <Container className="bg-ink">
      <FadeInUp>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Every Mother Deserves Continuous Care
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Join us in building a future where no mother is left behind — where care
            is continuous, accessible, and coordinated from pregnancy to parenthood.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" className="bg-stamp hover:bg-stamp-dark text-white" asChild>
              <a href="/register">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <a href="/organizations">
                Partner With MamaConnect
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail className="w-4 h-4" />
              hello@mamaconnect.ng
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone className="w-4 h-4" />
              +234 816 972 5007
            </div>
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
