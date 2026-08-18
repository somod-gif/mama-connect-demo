"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right" | "bottom";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  children,
  title,
  side = "right",
  className,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sideClasses = {
    left: "left-0 top-0 h-full w-80 max-w-[85vw]",
    right: "right-0 top-0 h-full w-80 max-w-[85vw]",
    bottom: "bottom-0 left-0 right-0 max-h-[85vh]",
  };

  const slideFrom = {
    left: { x: "-100%" },
    right: { x: "100%" },
    bottom: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={slideFrom[side]}
            animate={{ x: 0, y: 0 }}
            exit={slideFrom[side]}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed z-50 bg-card shadow-xl flex flex-col",
              sideClasses[side],
              side === "bottom" && "rounded-t-2xl",
              side === "left" && "rounded-r-2xl",
              side === "right" && "rounded-l-2xl",
              className
            )}
          >
            {(title || side !== "bottom") && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background-soft transition-colors ml-auto"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
