export const WHATSAPP_NUMBER = "2348169725007";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  pregnant: "Hi, I am pregnant and I would like to register on MamaConnect.",
  postpartum:
    "Hi, I am a postpartum mother and I would like to register on MamaConnect.",
  chew:
    "Hi, I am a Community Health Extension Worker (CHEW) and I would like to join MamaConnect.",
} as const;

export const NAV_LINKS_HOME = [
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Technology", href: "#technology" },
  { label: "Partners", href: "#partners" },
  { label: "FAQ", href: "#faq" },
] as const;

export const NAV_LINKS_MOTHER = [
  { label: "Benefits", href: "#benefits" },
  { label: "Languages", href: "#languages" },
  { label: "FAQ", href: "#faq" },
] as const;

export const NAV_LINKS_CHEW = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Mothers", href: "#mothers" },
  { label: "FAQ", href: "#faq" },
] as const;

export const CHANNELS = [
  { label: "WhatsApp", icon: "MessageCircle" as const },
  { label: "USSD", icon: "Smartphone" as const },
  { label: "SMS", icon: "MessageSquare" as const },
  { label: "Voice Calls", icon: "Phone" as const, comingSoon: true },
] as const;

export const LANGUAGES = [
  "English",
  "Pidgin",
  "Yoruba",
  "Hausa",
  "Igbo",
] as const;
