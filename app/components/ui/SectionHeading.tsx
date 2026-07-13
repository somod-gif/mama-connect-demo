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
        "max-w-3xl mb-14",
        align === "center" ? "mx-auto text-center" : "",
        className
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light rounded-full mb-4">
          <span className="text-xs font-semibold text-primary-dark uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
