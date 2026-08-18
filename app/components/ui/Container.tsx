import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
}

export function Container({
  children,
  className,
  as: Tag = "section",
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn("py-16 md:py-24", className)}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        {children}
      </div>
    </Tag>
  );
}
