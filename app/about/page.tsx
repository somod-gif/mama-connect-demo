import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Footer } from "@/app/components/shared/Footer";
import { Heart, Users, Shield } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Human-Centered Care",
    description: "Technology supports healthcare workers. It never replaces them. Every feature is designed to strengthen the bond between CHEWs and the mothers they serve.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We meet mothers where they are — on WhatsApp, USSD, and SMS. No smartphone required. No internet needed. Just care that reaches every community.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Maternal health data is sensitive. We built MamaConnect with security at its core, ensuring every mother's information is protected.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen pt-24">
      <Container className="flex-1 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <SectionHeading
            badge="About Us"
            title="Human-Centered Maternal Healthcare"
            description="MamaConnect was built to solve a critical problem: thousands of pregnant women in Nigeria lack access to timely, coordinated maternal care. Community Health Extension Workers are the backbone of primary healthcare, yet they lack the tools to manage their workload effectively."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value) => (
            <div
              key={value.title}
              className="p-8 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-5">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            MamaConnect connects pregnant and postpartum women with Community Health Extension Workers
            and healthcare facilities for timely maternal care. We believe every mother deserves access
            to quality healthcare, regardless of where she lives.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By empowering CHEWs with better tools and meeting mothers through channels they already use,
            we reduce maternal mortality and improve health outcomes across Nigeria.
          </p>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
