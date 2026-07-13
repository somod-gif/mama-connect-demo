"use client";

import { Clock, Building2, Heart } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";
import { Footer } from "@/app/components/shared/Footer";
import Link from "next/link";

export default function PartnersComingSoon() {
  return (
    <main className="flex flex-col min-h-screen">
      <Container className="flex-1 flex items-center pt-28">
        <div className="max-w-2xl mx-auto text-center">
          <FadeInUp>
            <div className="w-20 h-20 rounded-2xl bg-secondary-light flex items-center justify-center mx-auto mb-8">
              <Building2 className="w-10 h-10 text-secondary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Healthcare Partners
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              We are building the maternal health ecosystem. Partnerships with
              healthcare organizations are coming soon.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <Card className="p-8 mb-8 inline-block">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                We are currently focused on connecting mothers with Community
                Health Workers. Healthcare partnerships will open in our next
                phase.
              </p>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              {[
                { label: "Primary Healthcare Centres", icon: Building2 },
                { label: "Hospitals & Clinics", icon: Heart },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background-soft border border-border"
                >
                  <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground text-left">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <Heart className="w-4 h-4" />
              Return to MamaConnect Home
            </Link>
          </FadeInUp>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
