import { cn } from "@/lib/utils";

type StampTone = "ink" | "stamp" | "leaf";

const toneClasses: Record<StampTone, string> = {
  ink: "text-ink border-ink/70",
  stamp: "text-stamp border-stamp/70",
  leaf: "text-leaf border-leaf/70",
};

interface StampProps {
  text: string;
  tone?: StampTone;
  className?: string;
  /** Plays the stamp-strike entrance animation once on mount. */
  animate?: boolean;
  rotation?: number;
}

/**
 * The rubber stamp — the ANC card's signature gesture.
 * Used for statuses: VERIFIED, PAID, IN STOCK, 3RD TRIMESTER…
 */
export function Stamp({
  text,
  tone = "ink",
  className,
  animate = false,
  rotation = -2,
}: StampProps) {
  return (
    <span
      className={cn(
        "inline-block border-2 px-2 py-0.5 font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em]",
        "rounded-[2px] select-none",
        toneClasses[tone],
        animate && "stamp-in",
        className
      )}
      style={
        {
          "--stamp-rot": `${rotation}deg`,
          transform: `rotate(${rotation}deg)`,
          boxShadow: "inset 0 0 0 999px rgba(255,255,255,0.06)",
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
}
