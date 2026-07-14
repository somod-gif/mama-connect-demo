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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mothers", label: "Mothers", icon: Users },
  { href: "/dashboard/find-mothers", label: "Find Mothers", icon: UserPlus },
  { href: "/dashboard/referrals", label: "Referrals", icon: ArrowRightLeft },
];

const bottomItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const NavLink = ({
    item,
    collapsed,
  }: {
    item: (typeof navItems)[number];
    collapsed: boolean;
  }) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-background-soft hover:text-foreground"
        } ${collapsed ? "justify-center px-0" : ""}`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 px-4 h-14 lg:h-16 border-b border-border ${collapsed ? "justify-center px-0" : ""}`}>
        <Image
          src="/logo.png"
          alt="MamaConnect"
          width={collapsed ? 28 : 32}
          height={collapsed ? 28 : 32}
          className="rounded-lg flex-shrink-0"
        />
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">
              Mama<span className="text-primary">Connect</span>
            </p>
          </div>
        )}
      </div>

      <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className={`py-3 border-t border-border space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
        {bottomItems.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
        <button
          onClick={() => logout()}
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {!collapsed && user && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                CHEW
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
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="MamaConnect"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-sm font-bold text-foreground">
                  Mama<span className="text-primary">Connect</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-background-soft"
              >
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
          onClick={onToggle}
          className="absolute -right-3 top-5 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-background-soft transition-colors shadow-sm z-10"
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
