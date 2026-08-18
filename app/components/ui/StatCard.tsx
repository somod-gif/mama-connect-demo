import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: { value: number; label?: string };
  accent?: "primary" | "danger" | "warning" | "leaf" | "gold";
  className?: string;
}

const accentStyles = {
  primary: "bg-stamp-light text-stamp",
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning",
  leaf: "bg-leaf-light text-leaf",
  gold: "bg-gold-light text-gold",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  accent = "primary",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 md:p-5 transition-all hover:shadow-card-hover", className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accentStyles[accent])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{value}</p>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-medium mb-1",
              change.value > 0 ? "text-leaf" : change.value < 0 ? "text-danger" : "text-muted-foreground"
            )}
          >
            {change.value > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : change.value < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {change.label || `${Math.abs(change.value)}%`}
          </span>
        )}
      </div>
    </div>
  );
}
