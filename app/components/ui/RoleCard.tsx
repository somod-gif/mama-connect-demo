"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  accent: "cyan" | "purple";
  badge?: string;
  index?: number;
}

export function RoleCard({
  icon: Icon,
  title,
  description,
  href,
  accent,
  badge,
  index = 0,
}: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link
        href={href}
        className={cn(
          "group relative block p-8 md:p-10 rounded-[var(--radius-card)] border bg-card transition-all duration-500 h-full",
          accent === "cyan"
            ? "border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            : "border-secondary/20 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5"
        )}
      >
        {badge && (
          <span
            className={cn(
              "inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full mb-4",
              accent === "cyan"
                ? "bg-primary-light text-primary-dark"
                : "bg-secondary-light text-secondary"
            )}
          >
            {badge}
          </span>
        )}

        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300",
            accent === "cyan"
              ? "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
              : "bg-secondary-light text-secondary group-hover:bg-secondary group-hover:text-white"
          )}
        >
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>

        <div
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300",
            accent === "cyan" ? "text-primary" : "text-secondary"
          )}
        >
          {accent === "cyan" ? "Start your journey" : "Explore the platform"}
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-[var(--radius-card)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
            accent === "cyan"
              ? "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
              : "bg-gradient-to-br from-secondary/5 via-transparent to-transparent"
          )}
        />
      </Link>
    </motion.div>
  );
}
