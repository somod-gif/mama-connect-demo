import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  /** Optional italic accent rendered after the title in the display face. */
  titleAccent?: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * Identity page header — stamped eyebrow, display-serif title, quiet body.
 */
export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative border-b border-line pb-8 md:pb-10 pt-4",
        className
      )}
    >
      <p className="font-mono text-[11px] md:text-xs font-medium uppercase tracking-[0.22em] text-ink-faint">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.02]">
          {title}
          {titleAccent && <em className="italic text-stamp">{titleAccent}</em>}
        </h1>
        {actions}
      </div>
      {description && (
        <p className="mt-4 max-w-2xl text-[15px] md:text-base leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
