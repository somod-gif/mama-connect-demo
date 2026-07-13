import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-[var(--radius-card)] shadow-[var(--shadow-card)] transition-all duration-300",
        hover && "hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 hover:border-primary/20",
        className
      )}
    >
      {children}
    </div>
  );
}
