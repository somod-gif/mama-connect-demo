import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  badge,
  title,
  description,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12",
        align === "center" ? "mx-auto text-center" : "",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center px-3 py-1 bg-primary-light text-primary-dark text-[11px] font-semibold uppercase tracking-wider rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
