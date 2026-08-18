"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type StampTone = "danger" | "leaf" | "gold" | "ink";

const toneClasses: Record<StampTone, string> = {
  danger: "text-danger border-danger/70",
  leaf: "text-leaf border-leaf/70",
  gold: "text-gold-dark border-gold/70",
  ink: "text-ink border-ink/50",
};

/**
 * The rubber stamp: mono caps inside a dashed border, landing with a press
 * (scale 1.5 -> 1) like a clerk stamping a record. Slight rotation so no two
 * stamps sit perfectly square.
 */
export function Stamp({
  text,
  tone = "ink",
  className,
  delay = 0,
}: {
  text: string;
  tone?: StampTone;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 1.5, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: -3 }}
      transition={{ type: "spring", damping: 14, stiffness: 260, delay }}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-stamp)] border-[1.5px] border-dashed bg-white/70 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
    >
      {text}
    </motion.span>
  );
}
