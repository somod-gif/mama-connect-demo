"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, Mail, Phone } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";

export default function JoinSection() {
  return (
    <Container className="bg-ink">
      <FadeInUp>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Ready to Scale Your Maternal Health Program?
          </h2>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Join organizations across Nigeria using MamaConnect to coordinate
            care, track outcomes, and save lives at scale.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" asChild>
              <a href="/orgs/register">
                Register Your Organization
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" asChild>
              <a href="/login">
                Organization Login
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Mail className="w-4 h-4 text-gold" />
              orgs@mamaconnect.ng
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Phone className="w-4 h-4 text-gold" />
              +234 816 972 5007
            </div>
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
