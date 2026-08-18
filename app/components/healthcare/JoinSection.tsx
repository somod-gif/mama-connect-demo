"use client";

import { ArrowRight, Stethoscope, Mail, Phone } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";

export default function JoinSection() {
  return (
    <Container className="bg-leaf">
      <FadeInUp>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Connect Your Facility to the Referral Network
          </h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            Join healthcare facilities across Nigeria receiving maternal health
            referrals through MamaConnect. Be part of the care chain that saves lives.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" asChild>
              <a href="/orgs/register">
                Register Your Facility
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <a href="/login">
                Facility Login
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail className="w-4 h-4" />
              facilities@mamaconnect.ng
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
