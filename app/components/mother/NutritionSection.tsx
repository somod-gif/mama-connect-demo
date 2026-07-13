"use client";

import { Apple } from "lucide-react";
import { FadeInUp, FadeInLeft } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const regions = [
  {
    name: "Northern Nigeria",
    foods: "Millet, Beans, Moringa, Groundnuts",
  },
  {
    name: "South-West",
    foods: "Beans, Vegetables, Fish, Traditional Nutritious Meals",
  },
  {
    name: "South-East",
    foods: "Vegetables, Fish, Coco Yam, Local Protein Sources",
  },
];

export default function NutritionSection() {
  return (
    <Container className="bg-background">
      <FadeInUp>
        <SectionHeading
          badge="Nutrition"
          title="Affordable Nutrition, Locally Sourced"
          description="Recommendations based on what is available in your community — not expensive imports."
        />
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeInLeft>
          <div className="space-y-6">
            {regions.map((region) => (
              <Card key={region.name} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Apple className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {region.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {region.foods}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            <div className="p-4 rounded-xl bg-primary-light border border-primary/10">
              <p className="text-xs text-primary-dark leading-relaxed">
                Nutrition advice is tailored to your pregnancy stage, symptoms,
                and food preferences. All recommendations use affordable,
                locally available ingredients.
              </p>
            </div>
          </div>
        </FadeInLeft>

        <FadeInUp delay={0.2}>
          <Card className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-foreground mb-4">
              How it works
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Tell us about yourself",
                  desc: "Your pregnancy stage, region, and any symptoms you are experiencing.",
                },
                {
                  title: "Get personalized suggestions",
                  desc: "AI analyzes your needs and suggests foods available in your area.",
                },
                {
                  title: "Follow at your own pace",
                  desc: "Simple, practical tips you can apply with what you already have.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeInUp>
      </div>
    </Container>
  );
}
