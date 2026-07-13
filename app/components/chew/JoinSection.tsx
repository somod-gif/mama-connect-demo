"use client";

import { Shield } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { WhatsAppButton } from "@/app/components/ui/WhatsAppButton";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "@/lib/constants";

export default function JoinSection() {
  const url = getWhatsAppUrl(WHATSAPP_MESSAGES.chew);

  return (
    <Container className="bg-gradient-to-br from-secondary-light via-white to-primary-light">
      <div className="max-w-3xl mx-auto text-center">
        <FadeInUp>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-[1.15]">
            Ready to Transform Your Community Health Work?
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Join MamaConnect and get the tools you need to serve your community
            better. Training and support provided.
          </p>

          <div className="flex flex-col items-center gap-4">
            <WhatsAppButton
              href={url}
              size="xl"
              label="Join the Platform"
            />
            <p className="text-xs text-muted-foreground">
              Opens WhatsApp. Free for Community Health Extension Workers.
            </p>
          </div>
        </FadeInUp>
      </div>
    </Container>
  );
}
