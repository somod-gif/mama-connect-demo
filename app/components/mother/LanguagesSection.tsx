"use client";

import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { LanguageBadge } from "@/app/components/ui/LanguageBadge";
import { LANGUAGES } from "@/lib/constants";

export default function LanguagesSection() {
  return (
    <Container id="languages" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          title="Supported in Your Language"
          description="Every feature of MamaConnect is available in the language you are most comfortable with."
          badge="Languages"
        />
      </FadeInUp>

      <FadeInUp>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {LANGUAGES.map((lang) => (
            <LanguageBadge key={lang} name={lang} />
          ))}
        </div>

        <div className="mt-8 text-center max-w-xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            From registration to weekly check-ins to educational content —
            everything is available in your chosen language. Language should
            never be a barrier to maternal healthcare.
          </p>
        </div>
      </FadeInUp>
    </Container>
  );
}
