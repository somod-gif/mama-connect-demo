"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ArrowRightLeft,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  HeartPulse,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mothers", label: "Assigned Mothers", icon: Users },
  { href: "/dashboard/find-mothers", label: "Find Mothers", icon: UserPlus },
  { href: "/dashboard/referrals", label: "Referrals", icon: ArrowRightLeft },
];

const bottomItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOnboarding = pathname === "/dashboard/onboarding";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isOnboarding) return null;

  const NavLink = ({ item }: { item: typeof navItems[number] }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? "bg-primary-light text-primary"
            : "text-muted-foreground hover:bg-background-soft hover:text-foreground"
        }`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <Image
          src="/logo.png"
          alt="MamaConnect"
          width={36}
          height={36}
          className="rounded-lg flex-shrink-0"
        />
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">MamaConnect</p>
            <p className="text-[10px] text-muted-foreground">CHEW Workspace</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        {bottomItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {!collapsed && user && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.role === "chew" ? "CHEW" : user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 lg:hidden bg-card border border-border rounded-xl p-2 shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 w-72 h-full bg-card border-r border-border lg:hidden"
          >
            <div className="flex items-center justify-end p-4">
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-background-soft">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-card border-r border-border z-30 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-background-soft transition-colors"
        >
          <ChevronLeft className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
