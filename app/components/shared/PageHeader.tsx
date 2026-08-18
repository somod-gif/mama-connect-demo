import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint mb-2">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {title}
            {titleAccent && <em className="italic text-stamp font-normal"> {titleAccent}</em>}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
        {actions}
      </div>
    </div>
  );
}
