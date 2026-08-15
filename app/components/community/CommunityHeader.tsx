"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, ShieldCheck, LayoutDashboard, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { PROFESSIONAL_ROLES } from "@/lib/types/community";
import { PaintedBoard } from "./PaintedBoard";

export function CommunityHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPro = user ? PROFESSIONAL_ROLES.includes(user.role) : false;

  const links = [
    { href: "/community", label: "The Circle" },
    { href: "/community/guidelines", label: "Guidelines" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <PaintedBoard name="Mama Circle" icon="🍉" size="sm" href="/community" />

        <nav className="ml-2 hidden items-center gap-1 sm:flex" aria-label="Community">
          {links.map((link) => {
            const active =
              link.href === "/community"
                ? pathname === "/community"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-[var(--radius-stamp)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                  active
                    ? "bg-secondary-light text-secondary"
                    : "text-ink-faint hover:bg-background-soft hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isPro && (
            <Link
              href="/community/moderation"
              className={cn(
                "hidden items-center gap-1.5 rounded-[var(--radius-stamp)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors sm:flex",
                pathname.startsWith("/community/moderation")
                  ? "bg-gold-light text-gold-dark"
                  : "text-gold-dark hover:bg-gold-light",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Review wall
            </Link>
          )}
          <Link
            href="/community/new"
            className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] bg-gold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[0_4px_14px_rgba(199,125,26,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-dark"
          >
            <PenLine className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Post to the board</span>
            <span className="sm:hidden">Post</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-[var(--radius-stamp)] border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:bg-background-soft"
            title="Back to dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-1 border-t border-line/60 px-4 py-1.5 sm:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-[var(--radius-stamp)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
              pathname.startsWith(link.href)
                ? "bg-secondary-light text-secondary"
                : "text-ink-faint",
            )}
          >
            {link.label}
          </Link>
        ))}
        {isPro && (
          <Link
            href="/community/moderation"
            className={cn(
              "flex items-center gap-1 rounded-[var(--radius-stamp)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
              pathname.startsWith("/community/moderation")
                ? "bg-gold-light text-gold-dark"
                : "text-gold-dark",
            )}
          >
            <ShieldCheck className="h-3 w-3" /> Review wall
          </Link>
        )}
      </div>
    </header>
  );
}

export function CircleMark({ icon }: { icon?: string | null }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-stamp)] bg-secondary-light text-sm" aria-hidden>
      {icon ?? <HandHeart className="h-4 w-4 text-stamp" />}
    </span>
  );
}
