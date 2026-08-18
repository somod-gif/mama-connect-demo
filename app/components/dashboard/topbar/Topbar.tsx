'use client';

import { usePathname } from 'next/navigation';
import { Menu, X, Search, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.startsWith('/dashboard/mothers/')) return 'Mother Profile';
  if (pathname === '/dashboard/mothers') return 'Assigned Mothers';
  if (pathname === '/dashboard/find-mothers') return 'Find Mothers';
  if (pathname === '/dashboard/documents') return 'Documents';
  if (pathname === '/dashboard/referrals') return 'Referrals';
  if (pathname === '/dashboard/concerns') return 'Concerns';
  if (pathname === '/dashboard/deliveries') return 'Deliveries';
  if (pathname === '/dashboard/profile') return 'Profile';
  if (pathname === '/dashboard/settings') return 'Settings';
  return 'Dashboard';
}

export default function Topbar({
  mobileOpen,
  onMobileToggle,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = getPageTitle(pathname);
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'CH'
    : 'CH';

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-12 lg:h-14">
        {/* Mobile: hamburger + title */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onMobileToggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background-soft transition-colors -ml-1"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
        </div>

        {/* Desktop: greeting */}
        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">
            Good{' '}
            {new Date().getHours() < 12
              ? 'morning'
              : new Date().getHours() < 17
                ? 'afternoon'
                : 'evening'}
            ,{' '}
            <span className="font-semibold text-foreground">
              {user?.firstName || 'CHEW'}
            </span>
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-background-soft transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-background-soft transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>
          <div className="w-px h-5 bg-border hidden md:block mx-1" />
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-background-soft transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">{initials}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">
                {user?.firstName || 'CHEW'}
              </p>
              <p className="text-[10px] text-muted-foreground">CHEW</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
