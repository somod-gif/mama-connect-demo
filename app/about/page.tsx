"use client";

import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Footer } from "@/app/components/shared/Footer";
import { FadeInUp } from "@/app/components/animations";
import { Heart, Users, Shield, Handshake, Package, CreditCard, GraduationCap, Eye, Lock, Bot } from "lucide-react";

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

const sustainabilityStreams = [
  { icon: Handshake, title: "Partnerships", desc: "Collaborations with healthcare organizations, NGOs, and government programs." },
  { icon: GraduationCap, title: "Programs", desc: "Funded maternal health programs through grants and development partnerships." },
  { icon: Package, title: "Marketplace", desc: "Revenue from curated maternal and baby essentials through the care marketplace." },
  { icon: CreditCard, title: "Subscriptions", desc: "Premium analytics and management tools for organizations and facilities." },
];

const trustPrinciples = [
  { icon: Heart, title: "Human Oversight", desc: "Every clinical decision is made by healthcare professionals. AI supports — it never decides." },
  { icon: Lock, title: "Privacy First", desc: "Health data is encrypted and confidential. Shared only with assigned CHEWs and care providers." },
  { icon: Users, title: "Role-Based Access", desc: "Each user sees only what their role permits. Mothers, CHEWs, facilities, and orgs have distinct permissions." },
  { icon: Bot, title: "AI Safety Boundaries", desc: "AI provides information and risk cues. It is explicitly prevented from making diagnoses or treatment decisions." },
  { icon: Eye, title: "Transparency", desc: "Mothers can see what data is collected, who accesses it, and how it is used in their care." },
  { icon: Shield, title: "Data Security", desc: "Industry-standard encryption, secure authentication, and regular security audits protect all platform data." },
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

        <div className="max-w-3xl mx-auto mb-16">
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

      <Container className="bg-background-soft">
        <FadeInUp>
          <SectionHeading
            badge="Trust & Safety"
            title="Built on Trust"
            description="Healthcare-grade security and privacy standards. Mothers' data is protected at every layer."
          />
        </FadeInUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustPrinciples.map((p) => (
            <FadeInUp key={p.title}>
              <div className="bg-white border border-line rounded-xl p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-leaf-light flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-leaf" />
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{p.desc}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </Container>

      <Container className="bg-white">
        <FadeInUp>
          <SectionHeading
            badge="Sustainability"
            title="Built to Last"
            description="A sustainable model that ensures MamaConnect continues to serve mothers beyond the initial deployment."
          />
        </FadeInUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sustainabilityStreams.map((stream) => (
            <FadeInUp key={stream.title}>
              <div className="bg-background-soft border border-line rounded-xl p-6 h-full text-center">
                <div className={`w-12 h-12 rounded-2xl bg-stamp flex items-center justify-center mx-auto mb-4`}>
                  <stream.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{stream.title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed">{stream.desc}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </Container>

      <Footer />
    </main>
  );
}
