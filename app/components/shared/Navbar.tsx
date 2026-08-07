"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, HeartPulse, ScrollText, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "For Mothers", href: "/mothers" },
  { label: "For CHEWs", href: "/chew" },
];

const appLinks = [
  { label: "Market", href: "/market", icon: ShoppingBag },
  { label: "Passport", href: "/passport", icon: HeartPulse },
  { label: "Timeline", href: "/timeline", icon: ScrollText },
  { label: "Organization", href: "/orgs", icon: Building2 },
];

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

function isDashboardRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isDashboardRoute(pathname)) return null;

  const showAppLinks = isAuthenticated;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-paper/92 backdrop-blur-xl border-b border-line shadow-paper"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="MamaConnect"
                width={40}
                height={40}
                priority
                className="transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <span className="text-lg md:text-xl font-extrabold text-ink tracking-tight leading-tight">
              Mama<span className="text-leaf">Connect</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                    active
                      ? "text-ink bg-bone/80 border border-line"
                      : "text-ink-soft hover:text-ink hover:bg-bone/60"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-stamp"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
            {showAppLinks && (
              <span className="mx-2 h-5 w-px bg-line" aria-hidden />
            )}
            {showAppLinks &&
              appLinks.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-xs font-medium uppercase tracking-wider font-mono rounded-xl transition-all duration-200",
                      active
                        ? "text-stamp bg-stamp-light/70"
                        : "text-ink-soft hover:text-ink hover:bg-bone/60"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href={
                  user?.role === "ADMIN"
                    ? "/admin"
                    : user?.role === "ORG_ADMIN" ||
                        user?.role === "SUPERVISOR" ||
                        user?.role === "FACILITY_STAFF"
                      ? "/orgs"
                      : user?.role === "PATIENT"
                        ? "/passport"
                        : "/dashboard"
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-all duration-300 shadow-paper hover:-translate-y-0.5"
              >
                {user?.role === "ADMIN" ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-ink/80 hover:text-ink transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-all duration-300 shadow-paper hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-ink hover:bg-bone/70 transition-colors"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/25 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden border-t border-line bg-paper/95 backdrop-blur-xl overflow-hidden shadow-paper"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-sm font-semibold rounded-xl transition-colors",
                      isActive(pathname, item.href)
                        ? "text-ink bg-bone/80 border border-line"
                        : "text-ink-soft hover:bg-bone/60 hover:text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {showAppLinks && (
                  <div className="pt-2">
                    <p className="px-4 pt-2 pb-1 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-faint">
                      Your tools
                    </p>
                    {appLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                          isActive(pathname, item.href)
                            ? "text-stamp bg-stamp-light/70"
                            : "text-ink-soft hover:bg-bone/60 hover:text-ink"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="pt-3 space-y-2 border-t border-line mt-3">
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-all"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-ink border border-line rounded-xl hover:bg-bone/60 transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-all"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
