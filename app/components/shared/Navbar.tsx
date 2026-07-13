"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/auth-context";

interface NavItem {
  label: string;
  href?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "For Mothers", href: "/mothers" },
  { label: "For CHEWs", href: "/chew" },
];

function isActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (pathname === href) return true;
  if (href === "/" && pathname !== "/") return false;
  if (href !== "/" && pathname.startsWith(href) && href !== "#") return true;
  return false;
}

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isDashboardRoute(pathname)) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="MamaConnect"
                width={48}
                height={48}
                className="rounded-xl transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-foreground tracking-tight leading-tight">
                Mama<span className="text-primary">Connect</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                    active
                      ? "text-primary bg-primary-light/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/chew/login"
                  className="px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/chew/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-white/60 transition-colors"
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden border-t border-border bg-white/95 backdrop-blur-xl overflow-hidden shadow-lg"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-sm font-semibold rounded-xl transition-colors",
                      isActive(pathname, item.href)
                        ? "text-primary bg-primary-light/50"
                        : "text-muted-foreground hover:bg-primary-light/30 hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-3 space-y-2 border-t border-border mt-3">
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/chew/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-background-soft transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/chew/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all"
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
