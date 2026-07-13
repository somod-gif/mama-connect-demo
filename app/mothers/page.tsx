import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Button } from "@/app/components/ui/Button";
import { Footer } from "@/app/components/shared/Footer";
import { MessageCircle, Smartphone, MessageSquare, Heart, Shield, Baby } from "lucide-react";
import Link from "next/link";
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from "@/lib/constants";

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Register and receive check-ins through WhatsApp. No app download needed.",
    action: "Chat on WhatsApp",
    href: getWhatsAppUrl(WHATSAPP_MESSAGES.pregnant),
  },
  {
    icon: Smartphone,
    title: "USSD",
    description: "Dial a simple code on any phone to register, check in, and receive health tips.",
    action: "Coming Soon",
    href: "#",
    comingSoon: true,
  },
  {
    icon: MessageSquare,
    title: "SMS",
    description: "Send a text message to register and get weekly check-in reminders via SMS.",
    action: "Coming Soon",
    href: "#",
    comingSoon: true,
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Weekly Check-ins",
    description: "Answer simple health questions every week. We monitor your health and flag concerns early.",
  },
  {
    icon: Shield,
    title: "Risk Detection",
    description: "Our system identifies potential complications early, alerting your CHEW to provide timely care.",
  },
  {
    icon: Baby,
    title: "Nutrition & Vaccination",
    description: "Get personalized nutrition advice and vaccination reminders throughout your pregnancy.",
  },
];

export default function MothersPage() {
  return (
    <main className="flex flex-col min-h-screen pt-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/50 via-transparent to-transparent" />
        <Container className="relative py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
          <SectionHeading
            badge="For Mothers"
            title="Care That Reaches You"
            description="No smartphone? No problem. Register through WhatsApp, USSD, or SMS and get weekly check-ins, health education, and direct connection to your CHEW."
          />
              <div className="flex flex-wrap gap-3 mt-8">
                <Button asChild>
                  <Link href={getWhatsAppUrl(WHATSAPP_MESSAGES.pregnant)}>
                    <MessageCircle className="w-4 h-4" />
                    Register via WhatsApp
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <Heart className="w-24 h-24 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-secondary-light flex items-center justify-center">
                  <Baby className="w-12 h-12 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading
          title="How to Register"
          description="Choose the channel that works best for you. All are free and easy to use."
          className="mb-12"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div
              key={channel.title}
              className="p-8 rounded-2xl border border-border bg-card hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-5">
                <channel.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{channel.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{channel.description}</p>
              {channel.comingSoon ? (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  Coming Soon
                </span>
              ) : (
                <Link
                  href={channel.href}
                  className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  {channel.action} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <SectionHeading
          title="Benefits of Registering"
          description="MamaConnect helps you stay healthy throughout your pregnancy and after."
          className="mb-12"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <Footer />
    </main>
  );
}
