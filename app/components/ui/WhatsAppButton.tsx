"use client";

import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  compact?: boolean;
}

export function WhatsAppButton({
  href,
  label = "Join on WhatsApp",
  size = "lg",
  className,
  compact = false,
}: WhatsAppButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2.5",
    xl: "px-10 py-4 text-lg gap-3",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-[var(--radius-button)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        "bg-[#25D366] text-white shadow-lg hover:bg-[#1DA851]",
        sizeClasses[size],
        compact && "fixed bottom-4 right-4 z-40 shadow-xl md:static md:shadow-lg",
        className
      )}
    >
      <MessageCircle className={cn(size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5")} />
      {!compact && label}
    </a>
  );
}
