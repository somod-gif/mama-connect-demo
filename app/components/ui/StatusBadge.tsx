import { cn } from "@/lib/utils";
import {
  Shield,
  Clock,
  XCircle,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";

type StatusVariant =
  | "verified"
  | "pending"
  | "rejected"
  | "high"
  | "medium"
  | "low"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  size?: "sm" | "md";
  className?: string;
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<string, { variant: StatusVariant; icon: LucideIcon; label: string }> = {
  VERIFIED: { variant: "verified", icon: Shield, label: "Verified" },
  PENDING: { variant: "pending", icon: Clock, label: "Pending" },
  REJECTED: { variant: "rejected", icon: XCircle, label: "Rejected" },
  HIGH: { variant: "danger", icon: AlertTriangle, label: "High Risk" },
  MEDIUM: { variant: "warning", icon: AlertCircle, label: "Medium Risk" },
  LOW: { variant: "info", icon: Info, label: "Low Risk" },
  active: { variant: "success", icon: CheckCircle2, label: "Active" },
  postpartum: { variant: "info", icon: Info, label: "Postpartum" },
  NEW: { variant: "danger", icon: AlertTriangle, label: "New" },
  ACKNOWLEDGED: { variant: "warning", icon: Clock, label: "Acknowledged" },
  RESOLVED: { variant: "success", icon: CheckCircle2, label: "Resolved" },
  PAID: { variant: "success", icon: CheckCircle2, label: "Paid" },
  PENDING_PAYMENT: { variant: "warning", icon: Clock, label: "Awaiting Payment" },
  PROCESSING: { variant: "info", icon: AlertCircle, label: "Processing" },
  DELIVERED: { variant: "success", icon: CheckCircle2, label: "Delivered" },
  CANCELLED: { variant: "danger", icon: XCircle, label: "Cancelled" },
};

const variantStyles: Record<StatusVariant, string> = {
  verified: "bg-leaf-light text-leaf-dark border-leaf/20",
  pending: "bg-gold-light text-gold-dark border-gold/20",
  rejected: "bg-danger-bg text-danger border-danger/20",
  high: "bg-danger-bg text-danger border-danger/20",
  medium: "bg-warning-bg text-warning border-warning/20",
  low: "bg-stamp-light text-stamp-dark border-stamp/20",
  success: "bg-leaf-light text-leaf-dark border-leaf/20",
  warning: "bg-gold-light text-gold-dark border-gold/20",
  danger: "bg-danger-bg text-danger border-danger/20",
  info: "bg-stamp-light text-stamp-dark border-stamp/20",
  default: "bg-paper-ink text-ink-soft border-line",
};

export function StatusBadge({
  status,
  variant,
  size = "sm",
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const resolvedVariant = variant || config?.variant || "default";
  const Icon = config?.icon;
  const label = config?.label || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border font-medium rounded-full whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        variantStyles[resolvedVariant],
        className
      )}
    >
      {showIcon && Icon && <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      {label}
    </span>
  );
}
