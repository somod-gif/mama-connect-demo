"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-button)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[var(--shadow-button)] hover:bg-primary-dark",
        secondary:
          "bg-ink text-white hover:bg-ink/90",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-background-soft hover:border-border-hover",
        ghost:
          "bg-transparent text-foreground hover:bg-background-soft",
        danger:
          "bg-danger text-white hover:bg-danger/90",
        whatsapp:
          "bg-[#25D366] text-white shadow-md hover:bg-[#1DA851]",
      },
      size: {
        sm: "px-3 py-1.5 text-xs min-h-[32px]",
        md: "px-4 py-2.5 text-sm min-h-[40px]",
        lg: "px-6 py-3 text-sm min-h-[44px]",
        xl: "px-8 py-3.5 text-base min-h-[48px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
