"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  ArrowRightLeft,
  User,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  Clock,
  Bell,
  Package,
  MessagesSquare,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const fullAccess = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mothers", label: "Mothers", icon: Users },
  { href: "/dashboard/concerns", label: "Concerns", icon: Bell },
  { href: "/dashboard/find-mothers", label: "Find Mothers", icon: UserPlus },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/referrals", label: "Referrals", icon: ArrowRightLeft },
  { href: "/dashboard/deliveries", label: "Deliveries", icon: Package },
  { href: "/community", label: "Mama Circle", icon: MessagesSquare },
];

const restrictedItems = ["Mothers", "Find Mothers", "Referrals", "Concerns", "Deliveries", "Mama Circle"];

const bottomItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (mobileOpen && window.innerWidth >= 1024) {
        onMobileToggle();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen, onMobileToggle]);

  const isRestricted = user?.verificationStatus !== "VERIFIED";
  const visibleNavItems = isRestricted
    ? fullAccess.filter((item) => !restrictedItems.includes(item.label))
    : fullAccess;

  const closeMobile = mobileOpen ? onMobileToggle : () => {};

  const NavLink = ({
    item,
    isCollapsed,
  }: {
    item: (typeof fullAccess)[number];
    isCollapsed: boolean;
  }) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        onClick={closeMobile}
        title={isCollapsed ? item.label : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 min-h-[40px] rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-background-soft hover:text-foreground"
        } ${isCollapsed ? "justify-center px-0" : ""}`}
      >
        <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-12 lg:h-14 border-b border-border ${collapsed ? "justify-center px-0" : ""}`}>
        <Image
          src="/logo.png"
          alt="MamaConnect"
          width={collapsed ? 28 : 32}
          height={collapsed ? 28 : 32}
          className="rounded-lg flex-shrink-0"
        />
        {!collapsed && (
          <span className="inline-flex items-baseline text-sm font-bold text-foreground whitespace-nowrap">
            Mama<span className="text-primary">Connect</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
        {visibleNavItems.map((item) => (
          <NavLink key={item.href} item={item} isCollapsed={collapsed} />
        ))}
        {isRestricted && !collapsed && (
          <div className="px-3 py-2 mt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-light border border-gold/20">
              <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <p className="text-[10px] text-gold-dark leading-tight">
                Some features limited until verification
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className={`py-3 border-t border-border space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
        {bottomItems.map((item) => (
          <NavLink key={item.href} item={item} isCollapsed={collapsed} />
        ))}
        <button
          onClick={() => { closeMobile(); logout(); }}
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger-bg transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground">CHEW</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileToggle}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 w-72 max-w-[80vw] h-full bg-card border-r border-border lg:hidden"
          >
            <button
              onClick={onMobileToggle}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background-soft transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-card border-r border-border z-30 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <button
          onClick={onToggle}
          className="absolute -right-3 top-5 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-background-soft transition-colors shadow-sm z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`w-3 h-3 text-muted-foreground transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
