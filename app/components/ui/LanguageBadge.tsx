import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageBadgeProps {
  name: string;
  className?: string;
}

export function LanguageBadge({ name, className }: LanguageBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2 bg-stamp-light/50 border border-stamp/10 rounded-xl text-sm font-medium text-stamp-dark",
        className
      )}
    >
      <Globe className="w-3.5 h-3.5 text-stamp" />
      <span>{name}</span>
    </div>
  );
}
