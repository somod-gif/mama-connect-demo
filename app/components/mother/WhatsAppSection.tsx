"use client";

import { MessageCircle, Smartphone, MessageSquare } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";
import { WhatsAppButton } from "@/app/components/ui/WhatsAppButton";
import { ChannelBadge } from "@/app/components/ui/ChannelBadge";
import { WHATSAPP_NUMBER, CHANNELS, WHATSAPP_MESSAGES, getWhatsAppUrl } from "@/lib/constants";

const SMS_NUMBER = WHATSAPP_NUMBER;
const USSD_CODE = "*347*123#";

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
            Register through any channel that works for you. A caring team member
            will help you in your preferred language.
          </p>

          <div className="flex flex-col items-center gap-6">
            <WhatsAppButton
              href={url}
              size="xl"
              label="Register on WhatsApp"
            />

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`sms:${SMS_NUMBER}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border border-border text-foreground hover:border-primary/30 hover:bg-primary-light/50 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-primary" />
                Send SMS
              </a>
              <a
                href={`tel:${USSD_CODE}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border border-border text-foreground hover:border-primary/30 hover:bg-primary-light/50 transition-all"
              >
                <Smartphone className="w-4 h-4 text-primary" />
                Dial {USSD_CODE}
              </a>
            </div>

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
