"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaintedBoardProps {
  name: string;
  icon?: string | null;
  href?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * The painted-board strip: hand-painted sign look built from house assets —
 * ink-purple plank, Archivo 800 caps, a slight tilt and an asymmetric
 * underline that runs past the right edge like a sign-painter's final stroke.
 */
export function PaintedBoard({
  name,
  icon,
  href,
  subtitle,
  size = "md",
  className,
}: PaintedBoardProps) {
  const sizes = {
    sm: "px-3 py-1.5 text-[11px] tracking-[0.14em]",
    md: "px-4 py-2 text-sm tracking-[0.16em]",
    lg: "px-5 py-2.5 text-base tracking-[0.18em]",
  } as const;

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span aria-hidden>{icon}</span>}
        <span className="font-extrabold uppercase leading-none">{name}</span>
        {subtitle && (
          <span className="hidden sm:inline text-white/50 font-mono text-[9px] font-normal tracking-normal uppercase">
            {subtitle}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="absolute left-3 -bottom-[3px] h-[3px] bg-gold"
        style={{ width: "62%", clipPath: "polygon(0 0, 100% 0, calc(100% + 6px) 100%, 0 100%)" }}
      />
    </>
  );

  const cls = cn(
    "relative inline-flex items-center bg-secondary text-white shadow-[var(--shadow-paper)] -rotate-[0.5deg] transition-transform duration-300 hover:rotate-0",
    "rounded-[var(--radius-stamp)]",
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
