"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Phone, MapPin } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { Container } from "@/app/components/ui/Container";

export default function EmergencyResponse() {
  return (
    <Container>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <FadeInUp>
            <p className="text-xs font-semibold text-stamp uppercase tracking-wider mb-2">
              Emergency Response
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mb-4">
              When Every Minute Counts
            </h2>
            <p className="text-ink-soft leading-relaxed mb-8">
              High-risk alerts are pushed to your facility in real time. See the
              patient&apos;s location, contact details, and clinical context —
              so your team can prepare before they arrive.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-4">
              {[
                { icon: AlertTriangle, title: "Instant High-Risk Alerts", desc: "CHEWs flag danger signs and the alert reaches your facility immediately." },
                { icon: MapPin, title: "Patient Location", desc: "See the patient&apos;s LGA and ward for faster coordination." },
                { icon: Phone, title: "Direct Contact", desc: "Call the CHEW or patient directly from the referral card." },
                { icon: Clock, title: "Response Tracking", desc: "Track acknowledgment and response times for accountability." },
              ].map((item, i) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stamp-light flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-stamp" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    <p className="text-sm text-ink-soft" dangerouslySetInnerHTML={{ __html: item.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.2}>
          <div className="bg-stamp-light border border-stamp/15 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-stamp flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">High-Risk Alert</p>
                <p className="text-[11px] text-ink-faint">Just now</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white border border-stamp/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-ink">Amina Bello</p>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-stamp text-white rounded-full">HIGH</span>
                </div>
                <p className="text-sm text-ink-soft mb-1">Severe headache + blurred vision at 32 weeks</p>
                <p className="text-[11px] text-ink-faint mb-3">Mushin LGA · Referred by: Fatima Abubakar (CHEW)</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 text-xs font-semibold text-white bg-stamp rounded-lg flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call CHEW
                  </span>
                  <span className="px-3 py-1.5 text-xs font-semibold text-ink-soft bg-background-soft rounded-lg border border-line">
                    View Records
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stamp-dark text-center font-medium">
                Average response time: 8 minutes
              </p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </Container>
  );
}
