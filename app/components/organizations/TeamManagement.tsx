"use client";

import { motion } from "framer-motion";
import { UserPlus, Shield, Mail, CheckCircle2 } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";

const steps = [
  {
    icon: UserPlus,
    title: "Invite CHEWs",
    description: "Send email or SMS invitations to community health workers. They register, upload credentials, and await verification.",
    color: "bg-ink",
  },
  {
    icon: Shield,
    title: "Verify Credentials",
    description: "Review uploaded licenses, certificates, and government IDs. Approve or reject with one click. Only verified CHEWs access the dashboard.",
    color: "bg-gold",
  },
  {
    icon: CheckCircle2,
    title: "Assign Territories",
    description: "Map CHEWs to specific LGAs and wards. Ensure every community has coverage and no area is left behind.",
    color: "bg-leaf",
  },
];

export default function TeamManagement() {
  return (
    <Container className="bg-background-soft">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <FadeInLeft>
          <div>
            <p className="text-xs font-semibold text-gold-dark uppercase tracking-wider mb-2">
              Team Management
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mb-4">
              Build Your CHEW Network
            </h2>
            <p className="text-ink-soft leading-relaxed mb-8">
              Recruit, verify, and deploy community health workers across your
              target areas. Every CHEW goes through a verification process before
              they can access patient data.
            </p>

            <div className="space-y-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink mb-1">{step.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInLeft>

        <FadeInUp delay={0.2}>
          <div className="bg-white border border-line rounded-2xl p-6 shadow-paper">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Invitation Preview</p>
                <p className="text-[11px] text-ink-faint">What your CHEWs receive</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background-soft border border-line/50 space-y-3">
              <p className="text-sm font-semibold text-ink">You&apos;ve been invited to join MamaConnect</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                <span className="font-medium text-ink">Lagos State Primary Healthcare Board</span> has
                invited you to join as a Community Health Extension Worker. Complete your
                registration and upload your credentials to get started.
              </p>
              <div className="flex gap-2 pt-1">
                <span className="px-3 py-1.5 text-xs font-semibold text-white bg-gold rounded-lg">
                  Accept Invitation
                </span>
                <span className="px-3 py-1.5 text-xs font-semibold text-ink-soft border border-line rounded-lg">
                  Learn More
                </span>
              </div>
              <p className="text-[11px] text-ink-faint pt-1 border-t border-line/50">
                This invitation expires in 7 days. Questions? Contact your program manager.
              </p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </Container>
  );
}
