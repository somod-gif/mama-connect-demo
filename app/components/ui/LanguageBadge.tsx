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
        "inline-flex items-center gap-2 px-4 py-2 bg-card-alt border border-primary/10 rounded-xl text-sm font-medium text-primary-dark",
        className
      )}
    >
      <Globe className="w-4 h-4 text-primary" />
      <span>{name}</span>
    </div>
  );
}
