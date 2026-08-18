"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, ShoppingBag, HeartPulse, ScrollText, Building2, LogOut } from "lucide-react";
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
  { label: "Organizations", href: "/organizations" },
  { label: "Healthcare", href: "/healthcare" },
];

const appLinks = [
  { label: "Market", href: "/market", icon: ShoppingBag },
  { label: "Passport", href: "/passport", icon: HeartPulse },
  { label: "Timeline", href: "/timeline", icon: ScrollText },
  { label: "Organization", href: "/orgs", icon: Building2 },
];

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href + "/")) return true;
  return false;
}

function isDashboardRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/community") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/setup"
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  if (isDashboardRoute(pathname)) return null;

  const showAppLinks = isAuthenticated;

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "ORG_ADMIN" || user?.role === "SUPERVISOR" || user?.role === "FACILITY_STAFF"
        ? "/orgs"
        : user?.role === "PATIENT"
          ? "/passport"
          : "/dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-line shadow-nav"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 whitespace-nowrap group" onClick={closeMobile}>
            <Image
              src="/logo.png"
              alt="MamaConnect"
              width={36}
              height={36}
              priority
              className="transition-transform group-hover:scale-105"
            />
            <span className="inline-flex items-baseline text-lg font-bold text-ink tracking-tight whitespace-nowrap">
              Mama<span className="text-stamp">Connect</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    active
                      ? "text-stamp bg-stamp-light/60"
                      : "text-ink-soft hover:text-ink hover:bg-background-soft"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {showAppLinks && <div className="w-px h-4 bg-line mx-1" />}
            {showAppLinks &&
              appLinks.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      active
                        ? "text-stamp bg-stamp-light/60"
                        : "text-ink-soft hover:text-ink hover:bg-background-soft"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="hidden xl:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-ink-faint hover:text-ink hover:bg-background-soft rounded-lg transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg text-ink hover:bg-background-soft transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-line bg-white/98 backdrop-blur-md shadow-lg max-h-[calc(100vh-56px)] overflow-y-auto">
          <div className="px-5 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive(pathname, item.href)
                    ? "text-stamp bg-stamp-light/60"
                    : "text-ink-soft hover:bg-background-soft"
                )}
              >
                {item.label}
              </Link>
            ))}

            {showAppLinks && (
              <div className="pt-3 mt-1 border-t border-border">
                <p className="px-4 pb-2 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  Your Tools
                </p>
                {appLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive(pathname, item.href)
                        ? "text-stamp bg-stamp-light/60"
                        : "text-ink-soft hover:bg-background-soft"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="pt-3 mt-1 border-t border-border space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={closeMobile}
                    className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-primary rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      closeMobile();
                      logout();
                    }}
                    className="block w-full px-4 py-3 text-sm font-medium text-center text-ink-soft hover:bg-background-soft rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="block w-full px-4 py-3 text-sm font-medium text-center text-ink-soft border border-border rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-primary rounded-lg"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
