import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Smartphone,
  MessageSquare,
  Phone,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Smartphone,
  MessageSquare,
  Phone,
};

interface ChannelBadgeProps {
  channel: { label: string; icon: string; comingSoon?: boolean };
  className?: string;
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  const Icon = iconMap[channel.icon as keyof typeof iconMap] || MessageCircle;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-card text-sm font-medium transition-colors duration-200",
        channel.comingSoon
          ? "border-border text-muted-foreground opacity-60"
          : "border-border text-foreground hover:border-primary/30 hover:bg-primary-light/50",
        className
      )}
    >
      <Icon className={cn("w-4 h-4", channel.comingSoon ? "" : "text-primary")} />
      <span>{channel.label}</span>
      {channel.comingSoon && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          Coming Soon
        </span>
      )}
    </div>
  );
}
