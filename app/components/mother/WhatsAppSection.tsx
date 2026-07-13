"use client";

import { MessageCircle } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { WhatsAppButton } from "@/app/components/ui/WhatsAppButton";
import { ChannelBadge } from "@/app/components/ui/ChannelBadge";
import { CHANNELS, WHATSAPP_MESSAGES, getWhatsAppUrl } from "@/lib/constants";

export default function WhatsAppSection() {
  const url = getWhatsAppUrl(WHATSAPP_MESSAGES.pregnant);

  return (
    <Container className="bg-gradient-to-br from-primary-light via-white to-secondary-light">
      <div className="max-w-3xl mx-auto text-center">
        <FadeInUp>
          <div className="w-16 h-16 rounded-2xl bg-[#25D366] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-[1.15]">
            Ready to Start Your Journey?
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Click below to send us a message on WhatsApp. A caring team member
            will help you register in your preferred language.
          </p>

          <div className="flex flex-col items-center gap-6">
            <WhatsAppButton
              href={url}
              size="xl"
              label="Register on WhatsApp"
            />

            <div className="flex flex-wrap justify-center gap-2">
              {CHANNELS.map((channel) => (
                <ChannelBadge key={channel.label} channel={channel} />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Free to use. Your information is kept confidential.
            </p>
          </div>
        </FadeInUp>
      </div>
    </Container>
  );
}
