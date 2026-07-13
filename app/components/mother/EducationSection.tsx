"use client";

import { BookOpen } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const topics = [
  {
    title: "Pregnancy Care",
    items: [
      "What to expect each trimester",
      "Common pregnancy symptoms",
      "When to seek help",
    ],
  },
  {
    title: "Birth Preparedness",
    items: [
      "Creating a birth plan",
      "Packing for the hospital",
      "Transport arrangements",
    ],
  },
  {
    title: "Danger Signs",
    items: [
      "Recognizing warning signs",
      "Bleeding, swelling, severe headache",
      "Reduced fetal movement",
    ],
  },
  {
    title: "Postnatal Care",
    items: [
      "Recovery after birth",
      "Breastfeeding support",
      "Newborn health basics",
    ],
  },
  {
    title: "Newborn Health",
    items: [
      "Vaccination schedule",
      "Feeding and nutrition",
      "Developmental milestones",
    ],
  },
];

export default function EducationSection() {
  return (
    <Container className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Education"
          title="Knowledge That Empowers"
          description="Educational content designed for every stage of your pregnancy journey."
        />
      </FadeInUp>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {topics.map((topic) => (
          <FadeInUp key={topic.title} delay={0.1}>
            <Card className="p-5 h-full">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-3">
                {topic.title}
              </h3>
              <ul className="space-y-2">
                {topic.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeInUp>
        ))}
      </div>

      <FadeInUp delay={0.2}>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-xl text-sm font-medium text-primary-dark">
            <BookOpen className="w-4 h-4" />
            Available in English, Pidgin, Yoruba, Hausa, and Igbo
          </div>
        </div>
      </FadeInUp>
    </Container>
  );
}
