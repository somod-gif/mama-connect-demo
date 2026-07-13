"use client";

import { MessageCircle, Smartphone, Activity } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

export default function CheckInsDetail() {
  return (
    <Container className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Check-ins"
          title="A Simple Weekly Check-In"
          description="Every week, you answer a few easy questions. Your answers help detect problems early."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeInUp>
          <Card className="p-6 md:p-8">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Via WhatsApp</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You receive a message with simple yes/no and multiple-choice questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Via USSD</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    If you do not have WhatsApp or internet, dial the MamaConnect USSD code on any phone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Risk Categorization</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your answers are categorized as low, medium, or high risk. If concern is detected, your CHEW is alerted.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <Card className="p-6 md:p-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              What we ask about
            </p>
            <div className="space-y-3">
              {[
                "How are you feeling today?",
                "Any swelling in your hands or face?",
                "Any headache that will not go away?",
                "Have you noticed any bleeding?",
                "Is your baby moving as usual?",
              ].map((question) => (
                <div
                  key={question}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background-soft border border-border/50"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{question}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Takes less than 2 minutes to complete.
            </p>
          </Card>
        </FadeInUp>
      </div>
    </Container>
  );
}
