"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-button)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[var(--shadow-button)] hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg",
        secondary:
          "bg-secondary text-white hover:bg-secondary/90 hover:-translate-y-0.5",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-background-soft hover:border-border-hover",
        ghost:
          "bg-transparent text-foreground hover:bg-background-soft",
        whatsapp:
          "bg-[#25D366] text-white shadow-lg hover:bg-[#1DA851] hover:-translate-y-0.5",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base",
        xl: "px-10 py-4 text-lg",
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
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
