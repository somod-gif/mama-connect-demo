"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { FadeInUp } from "@/app/components/animations";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: readonly FAQItem[];
  title?: string;
  description?: string;
  id?: string;
}

export function FAQSection({
  items,
  title = "Frequently Asked Questions",
  description,
  id = "faq",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Container id={id} className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          title={title}
          description={description}
          badge="FAQ"
        />
      </FadeInUp>

      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, index) => (
          <FadeInUp key={index} delay={index * 0.05}>
            <div
              className="bg-card border border-border rounded-xl overflow-hidden transition-colors duration-200 hover:border-primary/20"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex items-center justify-between w-full px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-semibold text-foreground pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeInUp>
        ))}
      </div>
    </Container>
  );
}
