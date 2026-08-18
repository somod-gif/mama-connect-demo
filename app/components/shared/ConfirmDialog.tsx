"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { FadeInUp } from "@/app/components/animations";

type Variant = "primary" | "success" | "danger";

const VARIANT_MAP: Record<Variant, "primary" | "danger"> = {
  primary: "primary",
  success: "primary",
  danger: "danger",
};

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isPending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <FadeInUp className="w-full max-w-sm">
        <div
          className="bg-card rounded-xl border border-border shadow-xl p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              size="md"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1"
            >
              {cancelLabel}
            </Button>
            <Button
              variant={VARIANT_MAP[variant]}
              size="md"
              onClick={onConfirm}
              loading={isPending}
              className="flex-1"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
