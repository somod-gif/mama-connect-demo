"use client";

import {
  Building2,
  Heart,
  Users,
  Hospital,
  Landmark,
  Clock,
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const partnerTypes = [
  { icon: Building2, label: "Primary Healthcare Centres" },
  { icon: Hospital, label: "Hospitals & Clinics" },
  { icon: Users, label: "NGOs & Community Organizations" },
  { icon: Landmark, label: "Government Health Programs" },
  { icon: Heart, label: "International Health Partners" },
];

export default function PartnersTeaser() {
  return (
    <Container id="partners" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Partners"
          title="Building the Maternal Health Ecosystem"
          description="We are inviting healthcare organizations to join us in reducing preventable maternal deaths."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <StaggerContainer className="grid sm:grid-cols-2 gap-4">
          {partnerTypes.map((partner) => (
            <StaggerItem key={partner.label}>
              <Card className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <partner.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {partner.label}
                  </span>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.2}>
          <Card className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary-light flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
              We are currently focused on connecting mothers with Community
              Health Workers. Healthcare partnerships will open in the next
              phase.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-xl text-sm font-medium text-primary-dark">
              <Heart className="w-4 h-4" />
              Stay tuned for updates
            </div>
          </Card>
        </FadeInUp>
      </div>
    </Container>
  );
}
